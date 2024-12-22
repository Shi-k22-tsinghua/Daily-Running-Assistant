// pages/share/share.js
const utils = require('../../utils/util.js')
const app = require('../../app.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        posts: [{
                image: '../../images/run-icon.png',
                title: '今日运动记录，12分长跑3千米',
                content: '#我要减肥#俗话说7分吃3分练，每日搭配营养健身餐。',
                commentCount: 334,
                likeCount: 334
            },
            {
                image: '../../images/group-icon.png',
                title: '长跑怎么提速啊求aaaaaaaaaaaaaaaaaaaaaaa助',
                content: '#我要减肥#俗话说7分吃3分练，每日搭配营养健身餐。',
                commentCount: 200,
                likeCount: 411
            },
        ]
    },

    /**
     * 跳转编辑帖子页面
     */
    navigateToPost: function () {
        wx.navigateTo({
            url: '../post/post'
        });
    },

    /**
     * 获取帖子列表
     */
    fetchPosts: function() {
        const that = this;
        wx.request({
            url: global.utils.getAPI(global.utils.serverURL, '/api/users/share/posts'),
            method: 'GET',
            success: (res) => {
                if (res.statusCode === 200) {
                    this.setData({
                        posts: res.data.posts.reverse(),
                        serverURL: global.utils.serverURL  // Add this line
                    });
                } else {
                    wx.showToast({
                        title: '获取帖子列表失败',
                        icon: 'none',
                        duration: 2000
                    });
                }
            },
            // ... rest of your code
        });
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        app.tokenCheck();
        this.fetchPosts();

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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})