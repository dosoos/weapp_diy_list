// app.js
App({
  globalData: {
    copyDiyId: null,
    diyType: null,
    baseUrl: 'https://smalldog.basha.fun',
    userToken: null,
  },

  onLaunch: function () {
    // 初始化用户token
    this.globalData.userToken = wx.getStorageSync('token') || null
  }
});
