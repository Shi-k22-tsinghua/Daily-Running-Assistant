// pages/run/run.js
const app = require('../../app.js');
Page({
    onLoad(options) {
        app.tokenCheck();
    }
})