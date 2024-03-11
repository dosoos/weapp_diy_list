// pages/myself/myself.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    diys: [],
    refreshing: false
  },

  goDiyDetail(e) {
    var diyid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detail/detail?id=' + diyid,
    });
  },

  switchShare(e) {
    const index = e.currentTarget.dataset.index
    const diy = this.data.diys[index]
    this.setData({
      ['diys[' + index + '].share']: e.detail.value
    })
    wx.request({
      method: "PUT",
      url: getApp().globalData.baseUrl + '/api/diy/diys/' + diy.id + '/',
      header: {
        'Authorization': 'Token ' + getApp().globalData.userToken
      },
      data: {
        share: e.detail.value
      },
      success (res) {
        console.log("切换分享", res)
      }
    })
    // wx.cloud.callFunction({
    //   name: 'diyFunctions',
    //   config: {
    //     env: this.data.envId
    //   },
    //   data: {
    //     type: 'diyCreate',
    //     data: {
    //       _id: diy._id,
    //       share: e.detail.value
    //     }
    //   }
    // }).then((resp) => {
    //   console.log('分享返回', resp)
    // });
  },

  getMySelf() {
    const _this = this
    wx.request({
      url: getApp().globalData.baseUrl + '/api/diy/diys',
      header: {
        'Authorization': 'Token ' + getApp().globalData.userToken
      },
      success (res) {
        console.log("获取我的DIY", res)
        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.message,
          })
          return
        }
        _this.setData({
          diys: res.data.data.map(function(x) {
            x['fiendlyTime'] = x.update_time.split('.')[0].replace('T', ' ')
            x['avatar'] = x.account.avatar == '' ? _this.data.avatarUrl : x.account.avatar
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
          _this.deleteDiy(e)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
    
  },

  deleteDiy(e) {
    console.log(e)
    const diyid = e.currentTarget.dataset.id
    const _this = this
    wx.request({
      method: "DELETE",
      url: getApp().globalData.baseUrl + '/api/diy/diys/' + diyid + '/',
      header: {
        'Authorization': 'Token ' + getApp().globalData.userToken
      },
      success (res) {
        console.log("获取我的DIY", res)
        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.message,
          })
          return
        }
        _this.getMySelf()
      }
    })
  },

  handleRefresh(e) {
    console.log('下啦刷新')
    wx.stopPullDownRefresh()
    this.setData({
      refreshing: false
    })
    this.getMySelf()

  },

  handleLoadMore(e) {
    console.log('到底了')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getMySelf()
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