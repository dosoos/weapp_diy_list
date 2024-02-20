// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 'home',
    tabs:[
      {
        text:"首页",
        pagePath:"/pages/explore/explore",
        iconPath:"/images/icons/home.png",
        selectedIconPath:"/images/icons/home-selected.png"
      },
      {
        text:"攒机",
        pagePath:"/pages/diy/diy",
        iconPath:"/images/icons/diy.png",
        selectedIconPath:"/images/icons/diy-selected.png"
      },
      {
        text:"我的",
        pagePath:"/pages/me/me",
        iconPath:"/images/icons/user.png",
        selectedIconPath:"/images/icons/user-selected.png"
      }
    ]
  },

  onTabChange(e) {
    console.log(e)
    this.setData({ active: e.detail });
    switch (e.detail) {
      case 0:
        wx.switchTab({
          url: '../pages/home/home'
        })
        break
      case 1:
        wx.switchTab({
          url: '../pages/diy/diy'
        })
        break;
      case 2:
        wx.switchTab({
          url: '../pages/me/me'
        })
        break;
      default:
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
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