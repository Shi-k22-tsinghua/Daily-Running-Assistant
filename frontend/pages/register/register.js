// pages/register/register.js
Page({
    data: {
        username: '',
        password: '',
        confirmpassword: '',
    },

    onLoad: function () {
        // 展示注册页面
        // console.log('Register page loaded');
    },

    // Handle username input
    onUsernameInput(e) {
        this.setData({
            username: e.detail.value,
        });
    },

    // Handle password input
    onPasswordInput(e) {
        this.setData({
            password: e.detail.value,
        });
    },

    // Handle confirm password input
    onConfirmPasswordInput(e) {
        this.setData({
            confirmpassword: e.detail.value,
        });
    },


    // Register button click handler
    onRegister() {
        const {
            username,
            password,
            confirmpassword
        } = this.data;

        // Check if inputs are provided
        if (!username || !password || !confirmpassword) {
            wx.showToast({
                title: '您有空没填哦',
                icon: 'error',
            });
            return;
        }

        // Check if passwords match
        if (password !== confirmpassword) {
            wx.showToast({
                title: '两个密码不同',
                icon: 'error',
            });
            return;
        }

        // Proceed with HTTP request if validation passes
        wx.request({
            url: global.utils.getAPI(global.utils.serverURL, '/api/users'),
            method: 'POST',
            data: {
                username,
                password
            },
            header: {
                'Content-Type': 'application/json',
            },
            success(res) {
                if (res.statusCode === 200) {
                    wx.showToast({
                        title: '注册成功',
                        icon: 'success'
                    });
                    setTimeout(function () {
                        wx.navigateBack();
                    }, 1000); // 等待1000毫秒（1秒）后执行
                } else {
                    wx.showToast({
                        title: '注册失败',
                        icon: 'error',
                    });
                }
            },
            fail(err) {
                wx.showToast({
                    title: '网络不佳',
                    icon: 'error',
                });
                console.error(err);
            },
        });
    },

    goBack: function () {
        wx.navigateBack();
    }
});