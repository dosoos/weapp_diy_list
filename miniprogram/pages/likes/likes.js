// pages/likes/likes.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../images/logo-mini.png',
    diys: [],
    refreshing: false
  },

  goDiyDetail(e) {
    var uuid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detail/detail?id=' + uuid,
    });
  },

  getMyLikes() {
    const _this = this
    wx.request({
      url: getApp().globalData.baseUrl + '/api/diy/likes',
      header: {
        'Authorization': 'Token ' + getApp().globalData.userToken
      },
      success (res) {
        console.log("我的点赞", res)
        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.message,
          })
          return
        }
        _this.setData({
          diys: res.data.data.map(function(x) {
            x['fiendlyTime'] = x.update_time.split('.')[0].replace('T', ' ')
            x['avatar'] = '../../images/logo-mini.png'
            return x
          })
        })
      }
    })
  },

  handleDelete(e) {
    var _this = this
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '确定删除吗',
      success (res) {
        if (res.confirm) {
          _this.deleteLike(e)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  deleteLike(e) {
    console.log(e)
    const diyid = e.currentTarget.dataset.id
    const _this = this
    wx.request({
      method: "DELETE",
      url: getApp().globalData.baseUrl + '/api/diy/likes/' + diyid + '/',
      header: {
        'Authorization': 'Token ' + getApp().globalData.userToken
      },
      success (res) {
        console.log("删除点赞", res)
        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.message,
          })
          return
        }
        _this.getMyLikes()
      }
    })
  },

  handleRefresh(e) {
    console.log('下啦刷新')
    wx.stopPullDownRefresh()
    this.setData({
      refreshing: false
    })
    this.getMyLikes()

  },

  handleLoadMore(e) {
    console.log('到底了')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getMyLikes()
    this.setData({
      avatarUrl: options.avatar
    })
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