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
    wx.cloud.callFunction({
      name: 'diyFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'diyCollectList',
      }
    }).then((resp) => {
      console.log(resp)
      this.setData({
        diys: resp.result.data.map(function(x) {
          x['fiendlyTime'] = x.updateTime.split('.')[0].replace('T', ' ')
          x['avatar'] = '../../images/logo-mini.png'
          return x
        })
      })
    });
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
    var diyid = e.currentTarget.dataset.id
    wx.cloud.callFunction({
      name: 'diyFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'diyCollectDelete',
        diyid: diyid
      }
    }).then((resp) => {
      this.getMyCollects()
    });
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