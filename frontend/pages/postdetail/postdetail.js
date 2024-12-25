// pages/postdetail/postdetail.js
const utils = require('../../utils/util.js')
const app = require('../../app.js');

Page({

    data: {
        postId: 0, //存储所要获取帖子的postId
        post: {
            images: ['../../images/run-icon.png'],
            title: '今日运动记录，12分长跑3千米',
            content: '#我要减肥#俗话说7分吃3分练，每日搭配营养健身餐。',
            author: 'cuber',
<<<<<<< HEAD
            commentCount: 334,
=======

>>>>>>> d6bb237743e6f4066442911546827900a5233234
            comments: [{
                    content: "haha",
                    author: 'a commentator',
                    createdAt: '2024-12-18 14:49'
                },
                {
                    content: "this is another comment",
                    author: 'some commentator',
                    createdAt: '2024-12-18 14:50'
                },
                {
                    content: "this is another comment",
                    author: 'some commentator',
                    createdAt: '2024-12-18 14:51'
                },
                {
                    content: "this is another comment",
                    author: 'some commentator',
                    createdAt: '2024-12-18 14:52'
                },
                {
                    content: "this is another comment",
                    author: 'some commentator',
                    createdAt: '2024-12-18 14:53'
                },
                {
                    content: "this is another comment",
                    author: 'some commentator',
                    createdAt: '2024-12-18 14:54'
                },
                {
                    content: "this is another comment",
                    author: 'some commentator',
                    createdAt: '2024-12-18 14:55'
                },
                {
                    content: "this is another another another another another comment",
                    author: 'another commentator',
                    createdAt: '2024-12-18 14:56'
                }
            ],
            likes: 334,
<<<<<<< HEAD
            createdAt: '2024-12-17 21:54'
        },
=======
            createdAt: '2024-12-17 21:54',
            commentCount: 334, // 评论数
        },
        isLiked: false, // 是否已点赞
        messageInput: '' // 评论框里的内容
>>>>>>> d6bb237743e6f4066442911546827900a5233234
    },

    onImageError: function (e) {
        console.error('Image load error:', e);
        const index = e.currentTarget.dataset.index;
        console.log('Failed to load image at index:', index);
    },

    onImageLoad: function (e) {
        console.log('Image loaded successfully:', e);
    },

    fetchPostDetails: function (postId) {
        wx.request({
<<<<<<< HEAD
=======
            // 获取帖子
>>>>>>> d6bb237743e6f4066442911546827900a5233234
            url: global.utils.getAPI(global.utils.serverURL, '/api/users/share/posts/' + postId),
            method: 'GET',
            success: (res) => {
                if (res.statusCode === 200) {
                    this.setData({
                        post: res.data.post,
<<<<<<< HEAD
                        comments: res.data.comments,
                        serverURL: global.utils.serverURL // Add this line
                    });
=======

                        // comments: res.data.comments, 
                        // request返回的data中只有data.post，没有comment，（comment已在post.comment中）
                        serverURL: global.utils.serverURL // Add this line
                    });
                    console.log('get post:', this.data.post);
                    //console.log(res);
                    console.log('before:', this.data.post.createdAt);
                    const formattedDate = this.convertToBeijingTime(this.data.post.createdAt);
                    console.log('after:', formattedDate);
                    this.setData({
                        'post.createdAt': formattedDate
                    });
                    console.log(this.data.post.createdAt);
                    //转化每个comment.createAt
                    // 假设this.data.post是你的post对象
                    let commentsTemp = this.data.post.comments;
                    commentsTemp.forEach(item => {
                        // 遍历数组的每个元素，并执行相应的操作
                        const formattedDate = this.convertToBeijingTime(item.createdAt);
                        item.createdAt = formattedDate;
                    });
                    this.setData({
                        'post.comments': commentsTemp
                    });

>>>>>>> d6bb237743e6f4066442911546827900a5233234
                } else {
                    wx.showToast({
                        title: '获取帖子详情失败',
                        icon: 'none',
                        duration: 2000
                    });
                }
            },
            fail: () => {
                wx.showToast({
                    title: '网络请求失败',
                    icon: 'none',
                    duration: 2000
                });
            }
        });
<<<<<<< HEAD
=======

        const that = this;
        const username = wx.getStorageSync('username');
        wx.request({
            //获取username对postId是否点赞
            url: 'http://124.221.96.133:8000/api/users/share/posts/' + postId + '/ifLikedPost',
            method: 'POST',
            header: {
                'content-type': 'application/json' // 设置请求头为application/json
            },
            data: JSON.stringify({
                username: username // 将数据转换为JSON字符串
            }),
            success: function (res) {
                // 成功回调
                console.log('获取username对postId是否点赞成功');
                that.setData({
                    isLiked: res.data.liked
                });
                console.log('get isLiked:', that.data.isLiked);
            },
            fail: function (err) {
                // 失败回调
                console.error('获取username对postId是否点赞失败', err);
            }
        });

    },

    // 点赞事件处理函数
    toggleLike: function (e) {
        const postId = this.data.postId;
        const username = wx.getStorageSync('username');

        this.data.isLiked = !this.data.isLiked; // 切换点赞状态
        console.log('isLiked:', this.data.isLiked);
        // this.data.post.likes += this.data.isLiked ? 1 : -1; // 更新点赞数
        // console.log('likes', this.data.post.likes);

        // 调用服务器API更新点赞数
        this.updateLikeCount(postId, this.data.isLiked, username);
        // 更新页面
        setTimeout(() => this.fetchPostDetails(postId), 100);

    },

    // 更新服务器上的点赞数
    updateLikeCount: function (postId, isLiked, username) {
        if (isLiked) {
            // isLiked = true,点赞
            // 请求服务器API来更新点赞数
            wx.request({
                url: 'http://124.221.96.133:8000/api/users/share/posts/' + postId + '/likePost',
                method: 'POST',
                header: {
                    'content-type': 'application/json' // 设置请求头为application/json
                },
                data: {
                    postId: postId,
                    username: username,
                },
                success: function (res) {
                    // 成功回调
                    console.log('点赞成功', res);
                },
                fail: function (err) {
                    // 失败回调
                    console.error('点赞失败', err);
                }
            });
        } else {
            // isLiked = false,取消点赞
            wx.request({
                url: 'http://124.221.96.133:8000/api/users/share/posts/' + postId + '/unlikePost',
                method: 'POST',
                data: {
                    postId: postId,
                    username: username,
                },
                success: function (res) {
                    // 成功回调
                    console.log('取消点赞成功', res);
                },
                fail: function (err) {
                    // 失败回调
                    console.error('取消点赞失败', err);
                }
            })
        }
>>>>>>> d6bb237743e6f4066442911546827900a5233234
    },

    bindCommentInput: function (e) {
        this.setData({
<<<<<<< HEAD
            commentContent: e.detail.value
=======
            messageInput: e.detail.value
>>>>>>> d6bb237743e6f4066442911546827900a5233234
        });
    },

    submitComment: function () {
<<<<<<< HEAD
        const commentContent = this.data.commentContent;
=======
        const commentContent = this.data.messageInput;
>>>>>>> d6bb237743e6f4066442911546827900a5233234
        const postId = this.data.postId;
        if (!commentContent) {
            wx.showToast({
                title: '评论不能为空',
<<<<<<< HEAD
                icon: 'none',
                duration: 2000
=======
                icon: 'error'
>>>>>>> d6bb237743e6f4066442911546827900a5233234
            });
            return;
        }
        this.createComment(postId, commentContent);
<<<<<<< HEAD
    },

    createComment: function (postId, commentContent) {
        console.log(postId);
=======
        this.setData({
            messageInput: ''
        });
    },

    createComment: function (postId, commentContent) {
        //console.log(postId);
>>>>>>> d6bb237743e6f4066442911546827900a5233234
        wx.request({
            url: global.utils.getAPI(global.utils.serverURL, '/api/users/share/posts/' + postId + '/comments'),
            method: 'POST',
            data: {
                username: wx.getStorageSync('username'),
                content: commentContent
            },
            success: (res) => {
                if (res.statusCode === 200) {
                    wx.showToast({
                        title: '评论成功',
                        icon: 'success',
                        duration: 2000
                    });
                    this.fetchPostDetails(postId); // 重新获取帖子详情以更新评论列表
                } else {
                    wx.showToast({
                        title: '评论失败',
                        icon: 'none',
                        duration: 2000
                    });
                }
            },
            fail: () => {
                wx.showToast({
                    title: '网络请求失败',
                    icon: 'none',
                    duration: 2000
                });
            }
        });
    },

<<<<<<< HEAD
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            postId: options.id
        });
        console.log(this.data.postId)
        this.fetchPostDetails(options.id);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
=======

    /**
     * 修改显示时间为北京时间 
     */
    convertToBeijingTime: function (UTCTime) {
        // 原始时间字符串
        const postCreateAt = UTCTime;

        // 解析时间字符串为Date对象
        const date = new Date(postCreateAt);

        // 将UTC时间转换为北京时间（东八区，UTC+8）
        // getUTCHours() 获取UTC时区的小时数，然后加上8小时转换为北京时间
        const beijingTime = new Date(date.getTime());

        // 调用格式化函数并输出结果
        const formattedDate = utils.formatDateWithInput(beijingTime);
        console.log(formattedDate);
        return formattedDate;

    },


    /**
     * 修改显示时间为北京时间 
     */
    convertToBeijingTime: function (UTCTime) {
        // 原始时间字符串
        const postCreateAt = UTCTime;

        // 解析时间字符串为Date对象
        const date = new Date(postCreateAt);

        // 将UTC时间转换为北京时间（东八区，UTC+8）
        // getUTCHours() 获取UTC时区的小时数，然后加上8小时转换为北京时间
        const beijingTime = new Date(date.getTime());

        // 调用格式化函数并输出结果
        const formattedDate = utils.formatDateWithInput(beijingTime);
        console.log(formattedDate);
        return formattedDate;
>>>>>>> d6bb237743e6f4066442911546827900a5233234

    },

    /**
<<<<<<< HEAD
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
=======
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            postId: options.id
        });

        console.log('postId:', this.data.postId);
        this.fetchPostDetails(options.id);
    },

>>>>>>> d6bb237743e6f4066442911546827900a5233234
})