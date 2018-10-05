//app.js
App({
  // apiUrl: 'http://localhost:7777',
  apiUrl: 'https://kangyonggan.com',
  onLaunch: function () {
    
  },
  message: function (msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 1500
    });
  }
})