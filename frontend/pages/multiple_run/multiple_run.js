// pages/multiple_run.js
const utils = require('../../utils/util.js')
const app = require('../../app.js');

Page({
    data: {
        meters: 0, // 里程，单位米
        seconds: 0, // 时间，单位秒
        latitude: 39.9050, // 纬度
        longitude: 116.4070, // 经度
        running: false, // 是否开始
        interval: 1000, // 定位更新间隔，单位毫秒
        points: [], // 存储本人的轨迹点
        markers: [], // 其他人的位置标记
        showMap: false, // 控制地图是否显示
        polyline: [], // 路线
        userName: '', // 用户名
        paceFormatted: '', // 格式化配速输出
        timeFormatted: '', // 格式化时间输出
        startTime: '', // 开始跑步时间

        defaultPicUrl: '../../images/my-icon.png', // Add this line

        users: [{
                profilePic: '../../images/my-icon.png',
                username: 'NULL'
            },
            {
                profilePic: '../../images/my-icon.png',
                username: 'NULL'
            },
            {
                profilePic: '../../images/my-icon.png',
                username: 'NULL'
            },
            {
                profilePic: '../../images/my-icon.png',
                username: 'NULL'
            },
            {
                profilePic: '../../images/my-icon.png',
                username: 'NULL'
            },
            {
                profilePic: '../../images/my-icon.png',
                username: 'NULL'
            },
            {
                profilePic: '../../images/my-icon.png',
                username: 'NULL'
            },
            {
                profilePic: '../../images/my-icon.png',
                username: 'NULL'
            },
            {
                profilePic: '../../images/my-icon.png',
                username: 'NULL'
            },
        ],

        verifiedRoomID: '',
        verifiedRoomPassword: '',
        lastUpdateTime: null, // 上次更新时间
    },

    handleImageError: function (e) {
        const index = e.currentTarget.dataset.index;
        const usersArray = this.data.users;

        // Update just the profile pic for the user whose image failed to load
        usersArray[index].profilePic = this.data.defaultPicUrl;

        this.setData({
            users: usersArray
        });
    },

    formatPace: function () {
        // 配速计算和格式化
        const pace = (this.data.meters === 0) ? 0 : Math.round(this.data.seconds * 1000 / this.data.meters);
        const paceMinutes = Math.floor(pace / 60);
        const paceSeconds = (pace % 60).toString().padStart(2, '0');

        // 时间格式化（只显示分钟和秒）
        const minutes = Math.floor(this.data.seconds / 60);
        const seconds = this.data.seconds % 60;

        this.setData({
            paceFormatted: `${paceMinutes}'${paceSeconds}"`,
            timeFormatted: `${minutes}'${seconds.toString().padStart(2, '0')}"`
        });
    },

    onLoad() {
        app.tokenCheck();
        //格式化日期 xxxx/xx/xx
        const date = new Date();
        this.setData({
            formattedDate: utils.formatDate(date),
        });

        this.mapCtx = wx.createMapContext('map');
        wx.getLocation({
            type: 'gcj02',
            success: (res) => {
                console.log('获取位置成功')
                this.setData({
                    latitude: res.latitude,
                    longitude: res.longitude,
                    showMap: true,
                });
    
                // Send initial join/update to mark as in room
                wx.request({
                    url: global.utils.getAPI(global.utils.serverURL, `/api/runRoom/update`),
                    method: 'POST',
                    data: {
                        runID: wx.getStorageSync('verifiedRoomID'),
                        password: wx.getStorageSync('verifiedRoomPassword'),
                        username: wx.getStorageSync('username'),
                        longitude: res.longitude,
                        latitude: res.latitude,
                        meters: 0,
                        seconds: 0,
                        running: false,
                        in_room: true
                    },
                    success: (res) => {
                        console.log('初始房间状态更新成功');
                        this.updateOtherRunners();  // Update after successful join
                    },
                    fail: (error) => {
                        console.error('初始房间状态更新失败:', error);
                    }
                });
            },
            fail: (error) => {
                console.error('获取位置失败', error);
                wx.showToast({
                    title: '无法获取位置信息',
                    icon: 'error',
                });
            },
        });

        const username = wx.getStorageSync('username');
        if (username) {
            this.setData({
                username: username,
            });
        }

        const verifiedRoomID = wx.getStorageSync('verifiedRoomID');
        if (verifiedRoomID) {
            this.setData({
                verifiedRoomID: verifiedRoomID,
            });
        }

        const that = this;
        const runID = that.data.verifiedRoomID;

        if (!runID) {
            wx.showToast({
                title: '房间号不可用',
                icon: 'error'
            });
            return;
        }

        wx.request({
            url: global.utils.getAPI(global.utils.serverURL, `/api/runRoom/${runID}`),
            method: 'GET',
            success(res) {
                if (res.data.success && res.data.code === 'ROOM_FOUND') {
                    const users = res.data.data.runners.map(user => ({
                        // Use nickname if available, otherwise fall back to username
                        username: user.nickname || user.username,
                        profilePic: global.api.getProfilePicture(user.username) || '../../images/my-icon.png',
                        latitude: user.latitude,
                        longitude: user.longitude,
                    }));

                    console.log('Users:', users);

                    that.setData({
                        users: users
                    });
                }
            },
            fail(err) {
                wx.showToast({
                    title: '获取数据失败',
                    icon: 'error'
                });
            }
        });

        this.formatPace();

        // Start location updates immediately
        this.locationUpdateInterval = setInterval(() => {
            wx.getLocation({
                type: 'gcj02',
                success: (res) => {
                    this.setData({
                        latitude: res.latitude,
                        longitude: res.longitude,
                    });
                    this.updateLocation();
                },
                fail: (error) => {
                    console.error('获取位置失败', error);
                }
            });
        }, this.data.interval);

        // Keep the other runners update interval
        this.otherRunnersInterval = setInterval(this.updateOtherRunners.bind(this), 5000);
    },

    updateOtherRunners() {
        const runID = this.data.verifiedRoomID;
        if (!runID) return;

        wx.request({
            url: global.utils.getAPI(global.utils.serverURL, `/api/runRoom/${runID}`),
            method: 'GET',
            success: (res) => {
                if (res.data.success && res.data.code === 'ROOM_FOUND') {
                    const currentUsername = wx.getStorageSync('username');
                    const otherRunners = res.data.data.runners.filter(
                        runner => runner.username !== currentUsername && runner.in_room === true
                    );

                    // 更新其他跑步者的标记
                    const markers = otherRunners.map((runner, index) => ({
                        id: index,
                        latitude: runner.latitude,
                        longitude: runner.longitude,
                        width: 30,
                        height: 30,
                        iconPath: global.api.getProfilePicture(runner.username) || '../../images/my-icon.png',
                        // 添加以下属性使图标显示为圆形
                        borderRadius: 15, // 设置为宽高的一半
                        anchor: {
                            x: 0.5,
                            y: 0.5
                        },
                        callout: {
                            content: `${runner.nickname || runner.username}\n路程：${runner.meters}m\n时间：${Math.floor(runner.seconds/60)}'${(runner.seconds%60).toString().padStart(2,'0')}"\n配速：${runner.meters === 0 ? "0'00\"" : `${Math.floor((runner.seconds/runner.meters*1000)/60)}'${((runner.seconds/runner.meters*1000)%60).toFixed(0).padStart(2,'0')}"`}`,
                            color: '#000000',
                            fontSize: 14,
                            borderRadius: 5,
                            padding: 5,
                            display: 'BYCLICK',
                            textAlign: 'center',
                            bgColor: '#ffffff'
                        }
                    }));

                    // 更新用户列表数据
                    const updatedUsers = res.data.data.runners.map(runner => ({
                        profilePic: global.api.getProfilePicture(runner.username) || '../../images/my-icon.png',
                        username: runner.nickname || runner.username,
                        nickname: runner.nickname,
                        meters: runner.meters,
                        seconds: runner.seconds,
                        running: runner.running,
                        marathonPlace: runner.marathon_place
                    }));

                    this.setData({
                        markers,
                        users: updatedUsers
                    });

                    otherRunners.forEach(runner => {
                        if (runner.running) {
                            console.log(`${runner.nickname || runner.username}: ${runner.meters}米`);
                        }
                    });
                }
            },
            fail: (error) => {
                console.error('获取房间数据失败:', error);
            }
        });
    },

    startRun: function (e) {
        this.setData({
            running: !this.data.running
        })
        if (this.data.running == true) {
            console.log("开始跑步")
            // If not already tracking, start tracking (though it should already be tracking)
            if (!this.interval) {
                this.interval = setInterval(this.record.bind(this), this.data.interval);
            }
    
            // Set start time if not already set
            if (this.data.startTime === '') {
                this.setData({
                    startTime: new Date().toISOString()
                });
            }
    
            // Additional API call to mark run as started
            wx.request({
                url: global.utils.getAPI(global.utils.serverURL, `/api/runRoom/start`),
                method: 'POST',
                data: {
                    runID: this.data.verifiedRoomID,
                    username: wx.getStorageSync('username')
                },
                success: (res) => {
                    console.log('跑步状态更新成功');
                },
                fail: (error) => {
                    console.error('跑步状态更新失败:', error);
                }
            });
        } else {
            console.log("暂停/结束跑步")
            // Update running status in backend
            wx.request({
                url: global.utils.getAPI(global.utils.serverURL, `/api/runRoom/update`),
                method: 'POST',
                data: {
                    runID: this.data.verifiedRoomID,
                    password: wx.getStorageSync('verifiedRoomPassword'),
                    username: wx.getStorageSync('username'),
                    longitude: this.data.longitude,
                    latitude: this.data.latitude,
                    meters: this.data.meters,
                    seconds: this.data.seconds,
                    running: false
                },
                success: (res) => {
                    console.log('暂停状态更新成功');
                },
                fail: (error) => {
                    console.error('暂停状态更新失败:', error);
                }
            });
            clearInterval(this.interval);
            this.interval = null;
        }
    },

    updateLocation: function () {
        // Keep this function focused only on location updates
        const updatedData = {
            runID: wx.getStorageSync('verifiedRoomID'),
            password: wx.getStorageSync('verifiedRoomPassword'),
            username: wx.getStorageSync('username'),
            longitude: this.data.longitude,
            latitude: this.data.latitude,
            in_room: true
        }
    
        console.log('更新位置数据:', updatedData);
    
        wx.request({
            url: global.utils.getAPI(global.utils.serverURL, `/api/runRoom/update`),
            method: 'POST',
            data: updatedData,
            success: (res) => {
                if (res.data.message) {
                    console.log('位置更新成功');
                } else {
                    console.log('位置更新失败');
                }
            },
            fail: (error) => {
                console.error('位置更新失败:', error);
            }
        });
    },
    
    updateRunningStatus: function() {
        // This function handles running-related updates
        if (!this.data.running) return;
    
        const runData = {
            runID: wx.getStorageSync('verifiedRoomID'),
            password: wx.getStorageSync('verifiedRoomPassword'),
            username: wx.getStorageSync('username'),
            meters: this.data.meters,
            seconds: this.data.seconds,
            running: this.data.running
        }
    
        wx.request({
            url: global.utils.getAPI(global.utils.serverURL, `/api/runRoom/update`),
            method: 'POST',
            data: runData,
            success: (res) => {
                if (res.data.message) {
                    console.log('跑步数据更新成功');
                } else {
                    console.log('跑步数据更新失败');
                }
            },
            fail: (error) => {
                console.error('跑步数据更新失败:', error);
            }
        });
    },

    record() {
        if (!this.data.running) {
            return;
        }
        const runID = this.data.verifiedRoomID;
        if (!runID) return;
    
        this.setData({
            seconds: this.data.seconds + this.data.interval / 1000
        });
    
        // Only handle distance tracking and points when running
        wx.getLocation({
            type: 'gcj02',
        }).then(res => {
            let newPoint = {
                latitude: res.latitude,
                longitude: res.longitude,
                id: this.data.points.length + 1
            }
    
            let points = Array.isArray(this.data.points) ? this.data.points : [];
            let pace = 0;
    
            if (points.length > 0) {
                let lastPoint = points.slice(-1)[0]
                pace = utils.getDistance(lastPoint.latitude, lastPoint.longitude, newPoint.latitude, newPoint.longitude);
                pace = parseFloat(pace.toFixed(1))
                if (pace > 5) {
                    points.push(newPoint);
                } else {
                    pace = 0;
                }
            } else {
                points.push(newPoint);
            }
    
            this.setData({
                points,
                polyline: [{
                    points: points.map(point => ({
                        latitude: point.latitude,
                        longitude: point.longitude
                    })),
                    color: "#009688",
                    width: 5,
                    dottedLine: false,
                    arrowLine: false
                }],
                meters: parseFloat((this.data.meters + pace).toFixed(1))
            });
    
            this.formatPace();
            this.updateRunningStatus(); // Update running stats instead of location
        });
    },

    endRun: function (e) {
        if (this.data.points.length < 2) {
            console.log("你没有开始跑步！");
            wx.showToast({
                title: '你没有开始跑步！',
                icon: 'error'
            })
            return;
        }

        this.setData({
            running: false
        });
        clearInterval(this.interval);

        const runData = {
            username: wx.getStorageSync('username'),
            runRecord: {
                meters: this.data.meters,
                seconds: this.data.seconds,
                markers: this.data.points.map(point => ({
                    latitude: point.latitude,
                    longitude: point.longitude,
                    id: point.id
                })),
                start: this.data.startTime,
                end: new Date().toISOString()
            }
        };

        const app = getApp();
        app.globalData.currentRunData = runData;

        wx.request({
            url: global.utils.getAPI(global.utils.serverURL, `/api/users/run/record`),
            method: 'POST',
            data: runData,
            success: (res) => {
                console.log('跑步数据上传成功:', res);
                wx.redirectTo({
                    url: '../singlerecord/singlerecord',
                });
            },
            fail: (error) => {
                console.error('跑步数据上传失败:', error);
                wx.showModal({
                    title: '上传失败',
                    content: '是否重试上传数据？',
                    success: (res) => {
                        if (res.confirm) {
                            this.endRun(e);
                        } else {
                            wx.redirectTo({
                                url: '../singlerecord/singlerecord'
                            });
                        }
                    }
                });
            }
        });
    },

    onUnload() {
        // Clear all intervals
        if (this.interval) {
            clearInterval(this.interval);
        }
        if (this.locationUpdateInterval) {
            clearInterval(this.locationUpdateInterval);
        }
        if (this.otherRunnersInterval) {
            clearInterval(this.otherRunnersInterval);
        }

        // 检查房间人数并发送相应请求
        const runID = this.data.verifiedRoomID;
        if (!runID) return;

        wx.request({
            url: global.utils.getAPI(global.utils.serverURL, `/api/runRoom/${runID}`),
            method: 'GET',
            success: (res) => {
                if (res.data.success && res.data.code === 'ROOM_FOUND') {
                    const activeRunners = res.data.data.runners.filter(
                        runner => runner.in_room === true
                    );

                    // 根据房间人数决定发送的请求
                    if (activeRunners.length <= 1) {
                        // 房间只有一个人，删除房间
                        wx.request({
                            url: global.utils.getAPI(global.utils.serverURL, `/api/runRoom/delete`),
                            method: 'DELETE',
                            data: {
                                runID: runID,
                                password: wx.getStorageSync('verifiedRoomPassword')
                            },
                            success: (res) => {
                                console.log('房间已删除');
                            },
                            fail: (error) => {
                                console.error('删除房间失败:', error);
                            }
                        });
                    } else {
                        // 房间有多人，离开房间
                        wx.request({
                            url: global.utils.getAPI(global.utils.serverURL, `/api/runRoom/leave`),
                            method: 'POST',
                            data: {
                                runID: runID,
                                username: wx.getStorageSync('username'),
                                password: wx.getStorageSync('verifiedRoomPassword')
                            },
                            success: (res) => {
                                console.log('已离开房间');
                            },
                            fail: (error) => {
                                console.error('离开房间失败:', error);
                            }
                        });
                    }
                }
            },
            fail: (error) => {
                console.error('获取房间信息失败:', error);
            }
        });
    }

});