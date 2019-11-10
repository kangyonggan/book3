//app.js
App({
  // apiUrl: 'http://localhost:8080',
  apiUrl: 'https://kangyonggan.com/api',
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