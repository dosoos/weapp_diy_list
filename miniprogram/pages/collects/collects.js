// pages/collects/collects.js
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
    var diyid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detail/detail?id=' + diyid,
    });
  },

  getMyCollects() {
    const _this = this
    wx.request({
      url: getApp().globalData.baseUrl + '/api/diy/collects',
      header: {
        'Authorization': 'Token ' + getApp().globalData.userToken
      },
      success (res) {
        console.log("获取我的收藏", res)
        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.message,
          })
          return
        }
        _this.setData({
          diys: res.data.data.map(function(x) {
            x['fiendlyTime'] = x.create_time.split('.')[0].replace('T', ' ')
            x['avatar'] = x.account.avatar || '../../images/logo-mini.png'
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
          _this.deleteCollect(e)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  deleteCollect(e) {
    console.log(e)
    const diyid = e.currentTarget.dataset.id
    const _this = this
    wx.request({
      method: "DELETE",
      url: getApp().globalData.baseUrl + '/api/diy/collects/' + diyid + '/',
      header: {
        'Authorization': 'Token ' + getApp().globalData.userToken
      },
      success (res) {
        console.log("删除收藏", res)
        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.message,
          })
          return
        }
        _this.getMyCollects()
      }
    })
  },

  handleRefresh(e) {
    console.log('下啦刷新')
    wx.stopPullDownRefresh()
    this.setData({
      refreshing: false
    })
    this.getMyCollects()

  },

  handleLoadMore(e) {
    console.log('到底了')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getMyCollects()
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