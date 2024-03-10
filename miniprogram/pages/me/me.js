// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../images/logo-mini.png',
    nickName: '微信用户',
    // 设置昵称弹窗
    showSettingNickname: false,
    settingNickname: '',
    collect_count: 0,
    like_count: 0,
    myself_count: 0,
  },

  // 选择头像绑定事件
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const that = this
    wx.uploadFile({
      url: getApp().globalData.baseUrl + '/api/account/profile', 
      filePath: avatarUrl,
      name:'avatar_file',
      header: {
        'content-type': 'multipart/form-data',
        'Authorization': 'Token ' + getApp().globalData.userToken
      },
      success (res) {
        console.log("设置资料返回", res)
        that.getProfile()
      }
    })
  },

  onNicknameClick(e) {
    console.log('显示设置昵称对话框')
    this.setData({
      showSettingNickname: true
    })
  },

  onConfirmNickname(e) {
    console.log('确认昵称设置')
    const that = this
    wx.request({
      method: 'POST',
      url: getApp().globalData.baseUrl + '/api/account/profile', 
      data: {
        nickname: that.data.settingNickname
      },
      header: {
        'Authorization': 'Token ' + getApp().globalData.userToken
      },
      success (res) {
        console.log("设置资料返回", res)
        that.getProfile()
      }
    })
  },

  getProfile() {
    const _this = this
    wx.request({
      url: getApp().globalData.baseUrl + '/api/account/profile',
      header: {
        'Authorization': 'Token ' + getApp().globalData.userToken
      },
      success (res) {
        console.log("获取个人资料", res)
        _this.setData({
          avatarUrl: res.data.data.avatar == null ? _this.data.avatarUrl : res.data.data.avatar,
          nickName: res.data.data.nickname == null ? '微信用户' : res.data.data.nickname,
        })
      }
    })
  },

  copyWechat(e) {
    wx.setClipboardData({
      data: 'dosoos',
      success (res) {
        wx.showToast({
          title: '复制成功!',
        })
      }
    })
  },

  goMyLikes(e) {
    wx.navigateTo({
      url: '../likes/likes?avatar=' + this.data.avatarUrl,
    });
  },

  goMyCollects(e) {
    wx.navigateTo({
      url: '../collects/collects?avatar=' + this.data.avatarUrl,
    });
  },

  goMySelfs(e) {
    wx.navigateTo({
      url: '../myself/myself?avatar=' + this.data.avatarUrl,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getProfile()
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