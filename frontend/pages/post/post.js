// pages/post/post.js
const utils = require('../../utils/util.js')
const app = require('../../app.js');


Page({

    /**
     * 页面的初始数据
     */
    data: {
        data: {
            titleInput: '',
            contentInput: '',
            imagePreview: [], // 用于存储图片预览的数组
            unique: 0, // 添加一个唯一标识符，用于wx:key
        },
    },


    /**
     * 获取输入的标题、正文
     */
    inputTitle: function (e) {
        this.setData({
            titleInput: e.detail.value,
        });
    },
    inputContent: function (e) {
        this.setData({
            contentInput: e.detail.value,
        });
    },

    /**
     * 处理发布帖子的函数
     */
    publishPost: function () {
        // 获取标题和正文
        const title = this.data.titleInput;
        const content = this.data.contentInput;

        // 获取图片URL数组
        const images = this.data.imagePreview;

        // 发布帖子的逻辑
        this.createPost(title, content, images);
    },
    /**
     * 用户上传图片
     * 调用wx.chooseImage()接口
     */
    uploadImage: function () {
        const that = this;
        // Check if already at maximum images
        if (that.data.imagePreview && that.data.imagePreview.length >= 3) {
            wx.showToast({
                title: '最多只能上传3张图片',
                icon: 'none',
                duration: 2000
            });
            return;
        }

        // Calculate remaining allowed images
        const remainingCount = 3 - (that.data.imagePreview ? that.data.imagePreview.length : 0);

        wx.chooseImage({
            count: remainingCount,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                if (!Array.isArray(that.data.imagePreview)) {
                    that.setData({
                        imagePreview: []
                    });
                }
                const newImages = that.data.imagePreview.concat(res.tempFilePaths);
                that.setData({
                    imagePreview: newImages,
                });
            }
        });
    },


    showDeleteModal: function (e) {
        const that = this; // 保存当前页面的this引用
        const index = e.currentTarget.dataset.index; // 获取被长按图片的索引
        wx.showModal({
            title: '提示',
            content: '确定要删除这张图片吗？',
            success: (res) => { // 使用箭头函数保持this的上下文
                if (res.confirm) {
                    that.deleteImage(index); // 调用删除函数
                }
            }
        });
    },
    deleteImage: function (index) {
        console.log('Current imagePreview:', this.data.imagePreview); //打印过滤前的
        const newImages = this.data.imagePreview.filter((item, idx) => idx !== index);
        this.setData({
            imagePreview: newImages,
        });
    },

    /**
     * 
     * 确认发布按钮，在服务器创建帖子并存储
     * TODO: wx.request()方法待完善
     */

    //createPost: function(title, content, images) {
    // Then modify the createPost function to handle image uploads
    createPost: function (title, content) {
        const username = wx.getStorageSync('username');
        const that = this;

        if (this.data.imagePreview && this.data.imagePreview.length > 0) {
            const files = this.data.imagePreview.map((path, index) => ({
                name: 'images',
                filePath: path,
                formData: {
                    title: title,
                    content: content,
                    username: username
                }
            }));

            Promise.all(files.map(file =>
                new Promise((resolve, reject) => {
                    wx.uploadFile({
                        url: global.utils.getAPI(global.utils.serverURL, '/api/users/share/posts'),
                        filePath: file.filePath,
                        name: file.name,
                        formData: file.formData,
                        success: resolve,
                        fail: reject
                    });
                })
            )).then(() => {
                wx.showToast({
                    title: '发布成功',
                    icon: 'success',
                    duration: 2000
                });
                that.setData({
                    titleInput: '',
                    contentInput: '',
                    imagePreview: [],
                });
                wx.navigateTo({
                    url: '../share/share',
                });
            }).catch(error => {
                console.error('Upload error:', error);
                wx.showToast({
                    title: '发布失败',
                    icon: 'none',
                    duration: 2000
                });
            });
        } else {
            // No images case remains the same
            wx.request({
                url: global.utils.getAPI(global.utils.serverURL, '/api/users/share/posts'),
                method: 'POST',
                data: {
                    title: title,
                    content: content,
                    username: username,
                },
                success: function (res) {
                    if (res.statusCode === 200) {
                        wx.showToast({
                            title: '发布成功',
                            icon: 'success',
                            duration: 2000
                        });
                        that.setData({
                            titleInput: '',
                            contentInput: '',
                            imagePreview: [],
                        });
                        wx.navigateTo({
                            url: '../share/share',
                        });
                    } else {
                        wx.showToast({
                            title: '发布失败',
                            icon: 'none',
                            duration: 2000
                        });
                    }
                }
            });
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        app.tokenCheck();
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