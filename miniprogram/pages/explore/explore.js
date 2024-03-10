// pages/explore/explore.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swippers: [
    ],
    avatarUrl: '/images/logo-mini.png',
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    diys: [],
    refreshing: false,
    searchKeywords: '',
    currentPage: 0,
    hasNextPage: false
  },

  onSearchDiy(e) {
    console.log(e)
    const searchText = e.detail
    this.setData({
      searchKeywords: searchText
    })
    this.getDiyList()
    
  },

  onBannerTap(e) {
    console.log(e)
    const index = e.currentTarget.dataset.index
    const banner = this.data.swippers[index]
    console.log(banner)
    if (banner.category == 'webview') {
      console.log('webview', `../web/index?title?url=${banner.url}&title=${banner.title}`)
      wx.navigateTo({
        url: `../web/index?url=${banner.url}&title=${banner.title}`,
      })
    } else if (banner.category == 'app') {
      wx.navigateTo({
        url: banner.url,
      })
    }
  },

  getBannerList() {
    console.log('获取轮播图')
    const _this = this
    wx.request({
      url: getApp().globalData.baseUrl + '/api/info/banners',
      success (res) {
        console.log(res)
        if (res.data.code != 0) {
          return
        }
        _this.setData({
          swippers: res.data.data
        })
      }
    })
  },

  getDiyList() {
    const _this = this
    wx.request({
      url: getApp().globalData.baseUrl + '/api/diy/search?search=' + this.data.searchKeywords,
      success (res) {
        console.log(res)
        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.message,
          })
          return
        }
        const handleDatas = res.data.data.map(function(x) {
          x['fiendlyTime'] = x.update_time.split('.')[0].replace('T', ' ')
          x['avatar'] = x.account.avatar == null ? _this.data.avatarUrl : x.account.avatar
          x['nickname'] = x.nickname == '' || x.nickname == null ? '匿名用户' : x.nickname
          x['totalPriceText'] = x.price.toLocaleString()
          return x
        });
        _this.setData({
          diys: handleDatas
        })
      }
    })
  },

  goDiyDetail(e) {
    console.log(e)
    var diyid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detail/detail?id=' + diyid,
    });
  },

  handleRefresh(e) {
    console.log('下啦刷新')
    wx.stopPullDownRefresh()
    this.setData({
      searchKeywords: '',
      refreshing: false
    })
    this.getBannerList()
    this.getDiyList()

  },

  handleLoadMore(e) {
    console.log('到底了')
  },

  diyLike(e) {
    console.log(e)
    var diyid = e.currentTarget.dataset.id
    wx.cloud.callFunction({
      name: 'diyFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'diyLike',
        diyid: diyid
      }
    }).then((resp) => {
      console.log(resp)
      wx.showToast({
        duration: 1000,
        title: '成功',
      })
    });
  },

  diyCollect(e) {
    console.log(e)
    var diyid = e.currentTarget.dataset.id
    wx.cloud.callFunction({
      name: 'diyFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'diyCollect',
        diyid: diyid
      }
    }).then((resp) => {
      console.log(resp)
      wx.showToast({
        duration: 1000,
        title: '成功',
      })
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('onLoad 初始化')
    this.getBannerList()
    this.getDiyList()
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