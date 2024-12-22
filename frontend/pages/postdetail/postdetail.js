// pages/postdetail/postdetail.js
Page({

    data: {
        postId: 0, //存储所要获取帖子的postId
        post: {
            images: ['../../images/run-icon.png'],
            title: '今日运动记录，12分长跑3千米',
            content: '#我要减肥#俗话说7分吃3分练，每日搭配营养健身餐。',
            author: 'cuber',

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
            createdAt: '2024-12-17 21:54'
        },
        commentCount: 334, // 评论数
        isLiked: false // 是否已点赞
    },

    fetchPostDetails: function (postId) {
        wx.request({
            url: 'http://124.221.96.133:8000/api/users/share/posts/' + postId, // 请替换为您的服务器API地址
            method: 'GET',
            success: (res) => {
                if (res.statusCode === 200) {
                    this.setData({
                        post: res.data.post,
                    });
                    //console.log(this.data.post);
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
        
        setTimeout(() => {
            const commentCount = this.data.post.comments.length;
            console.log('commentCount:',commentCount);
            this.setData({
              'commentCount': commentCount
            });
          }, 100); // 100ms后执行上述代码
    },


    // 点赞事件处理函数
    toggleLike: function (e) {
        const postId = e.currentTarget.dataset.id;
        const index = this.data.posts.findIndex(post => post.postId === postId);

        if (index !== -1) {
            // 克隆数据以进行更新
            const updatedPosts = this.data.posts.slice();
            const post = updatedPosts[index];
            post.isLiked = !post.isLiked; // 切换点赞状态
            post.likes += post.isLiked ? 1 : -1; // 更新点赞数

            // 更新页面数据
            this.setData({
                posts: updatedPosts
            });

            // 调用服务器API更新点赞数
            this.updateLikeCount(postId, post.isLiked);
        }
    },

    // 更新服务器上的点赞数
    updateLikeCount: function (postId, isLiked) {
        // 这里应该是调用云函数或请求服务器API来更新点赞数
        // 以下代码仅为示例，您需要根据实际的云函数或API来实现
        wx.cloud.callFunction({
            name: 'updateLike',
            data: {
                postId: postId,
                isLiked: isLiked
            },
            success: function (res) {
                // 成功回调
                console.log('更新点赞数成功', res);
            },
            fail: function (err) {
                // 失败回调
                console.error('更新点赞数失败', err);
            }
        });
    },

    bindCommentInput: function (e) {
        this.setData({
            commentContent: e.detail.value
        });
    },

    submitComment: function () {
        const commentContent = this.data.commentContent;
        const postId = this.data.postId;
        if (!commentContent) {
            wx.showToast({
                title: '评论不能为空',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        this.createComment(postId, commentContent);
    },

    createComment: function (postId, commentContent) {
        console.log(postId);
        wx.request({
            // http://124.221.96.133:8000/api/users/share/posts/4/comments
            url: 'http://124.221.96.133:8000/api/users/share/posts/' + postId + '/comments',
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            postId: options.id
        });
        console.log('postId:',this.data.postId);
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