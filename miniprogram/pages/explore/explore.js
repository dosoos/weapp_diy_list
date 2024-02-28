// pages/explore/explore.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swippers: [
      {
        image: 'https://636c-cloud1-1gq9y7n198603bfa-1324314513.tcb.qcloud.la/swipper2.png?sign=2f0b9b42d24fe21655783fff5dea9a55&t=1707961337',
        url: ''
      },
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
    wx.cloud.callFunction({
      name: 'diyFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'banner'
      }
    }).then((resp) => {
      console.log(resp)
      this.setData({
        swippers: resp.result.data
      })
    });
  },

  getDiyList() {
    const filterData = {}
    if (this.data.searchKeywords.length > 0) {
      // 添加搜索内容
      console.log('搜索关键字', this.data.searchKeywords)
      filterData['search'] = this.data.searchKeywords
    }
    wx.cloud.callFunction({
      name: 'diyFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'diyList',
        ...filterData
      }
    }).then((resp) => {
      console.log(resp)
      const handleDatas = resp.result.list.map(function(x) {
        x['fiendlyTime'] = x.updateTime.split('.')[0].replace('T', ' ')
        if (x.profiles.length > 0) {
          x['avatar'] = x.profiles[0].avatar == '' ? this.data.avatarUrl : x.profiles[0].avatar
        } else {
          x['avatar'] = '/images/logo-mini.png'
        }
        if (x.profiles.length > 0) {
          x['nickname'] = x.profiles[0].nickname == '' ? '匿名用户' : x.profiles[0].nickname
        } else {
          x['nickname'] = '匿名用户'
        }
        return x
      });
      this.setData({
        diys: handleDatas
      })
    });
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