// pages/detail/detail.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    logoImage: 'https://636c-cloud1-1gq9y7n198603bfa-1324314513.tcb.qcloud.la/logo-text-mini.png?sign=376f8ae8b98683621c890b502b3e1c90&t=1707836091',
    shareImage: '',
    qrcodeImage: '',
    diyid: 0,
    title: '',
    desc: '',
    wares: [],
    totalPrice: 0,
    showQrcode: true,
    paddingTopNum: wx.getSystemInfoSync().statusBarHeight+7
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

  retriveDiy(id) {
    wx.cloud.callFunction({
      name: 'diyFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'diyDetail',
        id: id
      }
    }).then((resp) => {
      console.log(resp)
      this.setData({
        title: resp.result.data.title,
        desc: resp.result.data.desc,
        wares: resp.result.data.wares,
        totalPrice: resp.result.data.totalPrice,
        qrcodeImage: resp.result.data.qrImage
      })
    });
  },

  async onShare(e) {
    const _this = this
    console.log(e)
    wx.showLoading({
      title: '生成中...',
    })
    if (this.data.qrcodeImage == undefined || this.data.qrcodeImage.length <= 0) {
      // 没有二维码, 生成配置二维码
      console.log('分享二维码为空, 重新生成')
      const resp = await wx.cloud.callFunction({
        name: 'diyFunctions',
        config: {
          env: this.data.envId
        },
        data: {
          type: 'genImage',
          diyid: this.data.diyid
        }
      })
      this.setData({
        qrcodeImage: resp.result.imageUrl
      })
      // 等待两秒图片加载完成
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
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

            const f = `${wx.env.USER_DATA_PATH}/${_this.data.title}_${_this.data.diyid}.png`

            const fs = wx.getFileSystemManager();
            fs.writeFileSync(f, res.data, 'binary')

            wx.saveImageToPhotosAlbum({
              filePath: f,
              success(res) {
                console.log("saveImageToPhotosAlbum:", res)
                wx.showToast({
                  title: '保存成功'
                })
              },
              fail(err) {
                wx.showToast({
                  icon: 'error',
                  title: '保存失败!' + err.errMsg,
                })
              }
            })
          },
          fail(res) {
            console.log('截屏失败', res)
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
    app.globalData.copyDiyId = this.data.diyid
    wx.switchTab({
      url: '../diy/diy',
    })
  },

  onCopyItem(e) {
    const index = e.currentTarget.dataset.index
    const ware = this.data.wares[index]
    console.log(ware)
    wx.setClipboardData({
      data: ware.special,
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