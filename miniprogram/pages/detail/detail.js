// pages/detail/detail.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {
      wares: []
    },
    showQrcode: true,
    paddingTopNum: wx.getSystemInfoSync().statusBarHeight + 7
  },

  switchShowQrcode(e) {
    this.setData({
      showQrcode: e.detail.value
    })
  },

  onBack(e) {
    let pages = getCurrentPages();
    console.log(pages)
    if (pages.length > 1) {
      console.log('返回上级')
      wx.navigateBack()
    } else {
      console.log('重启进入首页')
      wx.reLaunch({
        url: '/pages/explore/explore',
      })
    }
  },

  onReEdit(e) {
    console.log(e)
    app.globalData.copyDiyId = this.data.diyid
    app.globalData.diyType = 'edit'
    wx.switchTab({
      url: '../diy/diy',
    })
  },

  retriveDiy(id) {
    const _this = this
    wx.request({
      url: getApp().globalData.baseUrl + '/api/diy/detail/' + id,
      header: {
        'Authorization': 'Token ' + getApp().globalData.userToken
      },
      success (res) {
        console.log('DIY详情', res)
        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.message,
          })
          return
        }
        _this.setData({
          title: res.data.data.title,
          desc: res.data.data.desc,
          wares: res.data.data.wares,
          totalPrice: res.data.data.price,
          totalPriceText: res.data.data.price.toLocaleString(),
          qrcodeImage: '',
          detail: res.data.data
        })
      }
    })
  },

  async onShare(e) {
    const _this = this

    console.log(e)
    const settings = await wx.getSetting()
    if (settings.authSetting['scope.writePhotosAlbum']) { // 检测相册写入权限
      this.taskScreenshot(e)

    } else { // 未授权的话发起授权
      wx.authorize({
        scope: 'scope.writePhotosAlbum',
        success: () => { //用户允许授权，保存到相册
          _this.taskScreenshot(e)
        },
        fail: () => {
          wx.showModal({    // 直接调wx.openSetting在真机调试正常，但在体验版无法调起，因为官方文档做了限制，请看下面什么
            content: '请允许写入相册授权',
            success: function (res2) {
              if (res2.confirm) {
                wx.openSetting({
                  success: () => {
                    _this.onShare(e)
                  }
                })
              } 
            }
          })
        }
      })
    }

  },

  async taskScreenshot(e) {
    const _this = this

    wx.showLoading({
      title: '生成中...',
    })

    console.log('开始生成图片')
    // 小程序 二维码
    this.createSelectorQuery().select("#target")
      .node().exec(res => {
        console.log("takeSnapshot success:", res)
        const node = res[0].node
        node.takeSnapshot({
          // type: 'file' 且 format: 'png' 时，可直接导出成临时文件
          type: 'arraybuffer',
          format: 'png',
          success: (res) => {

            console.log('截屏成功', res)
            wx.hideLoading()

            const f = `${wx.env.USER_DATA_PATH}/${_this.data.detail.title}_${_this.data.detail.uuid}_${parseInt(Math.random()*1000000)}.png`

            const fs = wx.getFileSystemManager();
            fs.writeFileSync(f, res.data, 'binary')

            wx.saveImageToPhotosAlbum({
              filePath: f,
              success(res) {
                console.log("add album success:", res)
                wx.showToast({
                  title: '保存成功'
                })
              },
              fail(err) {
                console.log("add album fail:", err)
                wx.showToast({
                  icon: 'error',
                  title: '保存失败!' + err.errMsg,
                })
              }
            })
          },
          fail(res) {
            console.log('图片保存失败!', res)
            wx.hideLoading()
            wx.showToast({
              title: '图片保存失败!',
              icon: 'error'
            })
          }
        })
      })
  },

  onCopy(e) {
    console.log(e)
    app.globalData.copyDiyId = this.data.detail.uuid
    app.globalData.diyType = 'copy'
    wx.switchTab({
      url: '../diy/diy',
    })
  },

  onCopyItem(e) {
    const index = e.currentTarget.dataset.index
    const ware = this.data.detail.wares[index]
    console.log(ware)
    wx.setClipboardData({
      data: ware.desc,
      success (res) {
        wx.showToast({
          title: '复制成功!',
          duration: 1000,
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var id = options.id
    this.setData({
      diyid: id
    })
    this.retriveDiy(id)
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