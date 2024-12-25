const utilsPath = require('../../utils/util.js'); // Path: frontend/utils/util.js
const app = require('../../app.js');

Page({
    data: {
        username: '',
        nickname: '',
        profilepicture: '',
        password: ''
    },

    bindUsernameInput: function (e) {
        this.setData({
            username: e.detail.value
        });
    },

    bindPasswordInput: function (e) {
        this.setData({
            password: e.detail.value
        });
    },

    onLogin() {
        const {
            username,
            password
        } = this.data;

        if (!username) {
            wx.showToast({
                title: '请输入用户名!',
<<<<<<< HEAD
                icon: 'none',
=======
                icon: 'error',
>>>>>>> d6bb237743e6f4066442911546827900a5233234
            });
            return;
        }

        if (!password) {
            wx.showToast({
                title: '请输入密码!',
<<<<<<< HEAD
                icon: 'none',
=======
                icon: 'error',
>>>>>>> d6bb237743e6f4066442911546827900a5233234
            });
            return;
        }

        const data = {
            username,
            password
        };

        wx.request({
            url: global.utils.getAPI(global.utils.serverURL, '/api/users/login'),
            method: 'POST',
            data: JSON.stringify(data),
            header: {
                'Content-Type': 'application/json',
            },
            success(res) {
                if (res.statusCode === 200) {
                    const token = res.data.token;
                    const username = res.data.user.username;

                    wx.setStorageSync('token', token);
                    wx.setStorageSync('username', username);

                    wx.showToast({
                        title: '登录成功!',
<<<<<<< HEAD
                        icon: 'none',
=======
                        icon: 'success',
>>>>>>> d6bb237743e6f4066442911546827900a5233234
                    });
                    const nicknameFetch = res.data.user.nickname; // Adjust this depending on your response structure
                    wx.setStorageSync('nickname', nicknameFetch);
                    //console.log('nickname fetched: ' + wx.getStorageSync('nickname'));
<<<<<<< HEAD
                    wx.navigateTo({
=======
                    wx.switchTab({
>>>>>>> d6bb237743e6f4066442911546827900a5233234
                        url: '../run/run'
                    });
                } else if (res.statusCode === 404) {
                    wx.showToast({
                        title: '用户不存在',
<<<<<<< HEAD
                        icon: 'none',
=======
                        icon: 'error',
>>>>>>> d6bb237743e6f4066442911546827900a5233234
                    });
                } else if (res.statusCode === 401) {
                    wx.showToast({
                        title: '密码错误',
<<<<<<< HEAD
                        icon: 'none',
=======
                        icon: 'error',
>>>>>>> d6bb237743e6f4066442911546827900a5233234
                    });
                }
            },
            fail(err) {
                wx.showToast({
                    title: 'Network Error',
<<<<<<< HEAD
                    icon: 'none',
=======
                    icon: 'error',
>>>>>>> d6bb237743e6f4066442911546827900a5233234
                });
                console.error(err);
            },
        });
    },

    onRegister: function () {
        wx.navigateTo({
            url: '../register/register'
        });
    },

    onWeChatLogin: function (e) {
        if (e.detail.userInfo) {
            wx.showToast({
                title: '微信登录成功',
                icon: 'success'
            });

            // 使用 Promise 来模拟 sleep
            sleep(1000).then(() => {
                wx.navigateTo({
                    url: '../run/run'
                });
            });
        } else {
            wx.showToast({
                title: '微信登录失败',
                icon: 'none'
            });
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    },

    onLoad(options) {
        const token = wx.getStorageSync('token'); // 从本地存储中获取 token

        if (token) {
            wx.request({
                url: 'http://124.221.96.133:8000/api/users/tokenCheck',
                method: 'POST',
                header: {
                    'Authorization': `Bearer ${token}`, // 在头部添加 token 用于身份验证
                    'Content-Type': 'application/json',
                },
                success(res) {
                    if (res.statusCode === 200) {
                        // 如果 token 验证成功
                        console.log('Token 验证成功');
<<<<<<< HEAD
                        wx.navigateTo({
=======
                        wx.switchTab({
>>>>>>> d6bb237743e6f4066442911546827900a5233234
                            url: '../run/run'
                        });
                    } else {
                        wx.showToast({
<<<<<<< HEAD
                            title: '登录过期或无效\n请重新登陆',
=======
                            title: '登录过期或无效',
>>>>>>> d6bb237743e6f4066442911546827900a5233234
                            icon: 'error',
                        });
                        setTimeout(function () {}, 1500);
                    }
                },
                fail(err) {
                    console.error('获取受保护数据失败:', err);
                    // 网络错误或其他问题，处理错误
                    wx.showToast({
<<<<<<< HEAD
                        title: '网络错误或服务器无响应',
                        icon: 'none'
=======
                        title: '服务器无响应',
                        icon: 'error'
>>>>>>> d6bb237743e6f4066442911546827900a5233234
                    });
                },
            });
        }
    },
});