// pages/chat/chat.js
const app = require('../../app.js');
const utils = require('../../utils/util.js')
const debugUtils = require('../../utils/debug-utils.js');


Page({
    data: {
        nickname: '',
        username: 'username',
        messages: [],
        messageInput: '',
        pageContext: this,
        fromUser: false,
    },

    showDebugInfo: function(title, content) {
        wx.showModal({
            title: title,
            content: JSON.stringify(content, null, 2),
            showCancel: false
        });
    },

    inputMessage: function(e) {
        this.setData({
            messageInput: e.detail.value,
        });
    },

    sendMessage: function() {
        if (this.data.messageInput.trim() === '') return;

        const newMessage = {
            'role': 'user',
            'content': this.data.messageInput,
        };
        
        this.setData({
            fromUser: true,
        });
        
        const messages = this.data.messages.concat(newMessage);

        this.setData({
            messages: messages,
            messageInput: '',
        });

        wx.showLoading({
            title: '正在回复...',
        });

        const that = this;
        
        // Show API URL for debugging
        const apiUrl = global.utils.getAPI(global.utils.serverURL, `/api/chat`);
        //debugUtils.showDebugInfo('API URL', apiUrl);
        
        wx.request({
            url: apiUrl,
            method: 'POST',
            data: {
                messages: messages
            },
            header: {
                'Content-Type': 'application/json'
            },
            success(res) {
                // Show response data for debugging
                //debugUtils.showDebugInfo('Response Data', res);
                
                if (!res.data || !res.data.choices || !res.data.choices[0] || !res.data.choices[0].message) {
                    wx.showModal({
                        title: '响应格式错误',
                        content: JSON.stringify(res.data),
                        showCancel: false
                    });
                    wx.hideLoading();
                    return;
                }

                const aiMessage = {
                    'role': 'assistant',
                    'content': res.data.choices[0].message.content,
                };
                that.setData({
                    fromUser: false,
                    messages: messages.concat(aiMessage),
                });
                wx.hideLoading();
            },
            fail(error) {
                debugUtils.showErrorInfo('请求失败', error);
                wx.hideLoading();
            }
        });
    },

    clearMessages: function() {
        this.setData({
            messages: [],
            messageInput: '',
        });
    },

    onLoad(options) {
        const nickname = wx.getStorageSync('nickname');
        if (nickname) {
            this.setData({
                nickname: nickname,
            });
        }
        // Show server URL on load
        //this.showDebugInfo('Server URL', global.utils.serverURL);
    }
});