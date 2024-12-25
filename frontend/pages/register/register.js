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
<<<<<<< HEAD
                title: 'All fields are required!',
                icon: 'none',
=======
                title: '您有空没填哦',
                icon: 'error',
>>>>>>> d6bb237743e6f4066442911546827900a5233234
            });
            return;
        }

        // Check if passwords match
        if (password !== confirmpassword) {
            wx.showToast({
<<<<<<< HEAD
                title: 'Passwords do not match!',
                icon: 'none',
=======
                title: '两个密码不同',
                icon: 'error',
>>>>>>> d6bb237743e6f4066442911546827900a5233234
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
<<<<<<< HEAD
                        title: 'Registration Successful!',
=======
                        title: '注册成功',
                        icon: 'success'
>>>>>>> d6bb237743e6f4066442911546827900a5233234
                    });
                    setTimeout(function () {
                        wx.navigateBack();
                    }, 1000); // 等待1000毫秒（1秒）后执行
<<<<<<< HEAD
                    //wx.navigateBack();
                } else {
                    wx.showToast({
                        title: 'Registration Failed',
                        icon: 'none',
=======
                } else {
                    wx.showToast({
                        title: '注册失败',
                        icon: 'error',
>>>>>>> d6bb237743e6f4066442911546827900a5233234
                    });
                }
            },
            fail(err) {
                wx.showToast({
<<<<<<< HEAD
                    title: 'Network Error',
                    icon: 'none',
=======
                    title: '网络不佳',
                    icon: 'error',
>>>>>>> d6bb237743e6f4066442911546827900a5233234
                });
                console.error(err);
            },
        });
    },

<<<<<<< HEAD


=======
>>>>>>> d6bb237743e6f4066442911546827900a5233234
    goBack: function () {
        wx.navigateBack();
    }
});