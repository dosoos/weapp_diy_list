// pages/diy/diy.js
// component.js
const computedBehavior = require('miniprogram-computed').behavior
const app = getApp()

Page({
  behaviors: [computedBehavior],

  /**
   * 页面的初始数据
   */
  data: {
    // 临时配置单数据
    tempDatas: [
      {
        // 类型
        category: '',
        // 型号
        special: '',
        // 价格
        price: 0,
        // 数量
        count: 1
      }
    ],
    // 显示保存对话框
    show: false,
    diyTitle: '',
    diyDesc: '',
    detail: null,
  },

  computed: {
    totalPrice(data) {
      console.log(data.tempDatas.length)
      if (data.tempDatas.length <= 0) {
        return 0
      }
      return data.tempDatas.reduce((sum, { price, count }) => sum + price * count, 0) * 100
    },
  },

  handleDelete(e) {
    var _this = this
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '确定删除吗',
      success (res) {
        if (res.confirm) {
          _this.deleteWare(e)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  deleteWare(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    var tempArray = this.data.tempDatas
    tempArray.splice(index, 1)
    this.setData({
      tempDatas: tempArray,
    })
  },

  onAdd(e) {
    console.log(e)
    this.addWare('', '')
  },

  addWare(category, special) {
    // 先从源数据取出值赋给一个新的数组
    let array0 = this.data.tempDatas; 
    // 向新的数组填充元素
    array0.push({
      // 类型
      category: category,
      // 型号
      special: special,
      // 价格
      price: 0,
      // 数量
      count: 1
    }); 
    // 将新数组整个重新赋值给源数据
    this.setData({ 
      tempDatas: array0
    });
  },

  onSubmit(e) {
    console.log(e)
    this.setData({
      show: true
    })
  },

  onClose(e) {
    this.setData({
      show: false
    })
  },

  uploadDiy() {
    wx.showLoading({
      title: '保存中...',
    })
    var totalPrice = 0
    if (this.data.tempDatas.length > 0) {
      totalPrice = this.data.tempDatas.reduce((sum, { price, count }) => sum + price * count, 0)
    }
    var copyOrEdit = {}
    if (app.globalData.diyType == 'edit') {
      copyOrEdit['_id'] = this.data.detail._id
    }
    wx.cloud.callFunction({
      name: 'diyFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'diyCreate',
        data: {
          title: this.data.diyTitle,
          desc: this.data.diyDesc,
          totalPrice: totalPrice,
          wares: [
            ...this.data.tempDatas
          ],
          ...copyOrEdit
        }
      }
    }).then((resp) => {
      console.log(resp);
      wx.hideLoading();
      wx.navigateTo({
        url: '../detail/detail?id=' + resp.result._id,
      });
      wx.showToast({
        title: '保存成功',
      })
    }).catch((e) => {
      console.log(e);
      wx.hideLoading();
    });
  },

  // 数据元素被修改时修改列表元素
  onCategoryChange(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    this.setData({
      ['tempDatas[' + index + '].category']: e.detail
    })
  },

  onSpecialChange(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    this.setData({
      ['tempDatas[' + index + '].special']: e.detail
    })
    
  },

  onPriceChange(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    var price = parseInt(e.detail)
    if (('' + price) == 'NaN') {
      return
    }
    this.setData({
      ['tempDatas[' + index + '].price']: price
    })
  },

  onCountChange(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    this.setData({
      ['tempDatas[' + index + '].count']: e.detail
    })
  },

  onMoveUp(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    if (index <= 0) return
    var changeDatas = this.data.tempDatas
    var item = changeDatas[index]
    changeDatas[index] = changeDatas[index-1]
    changeDatas[index-1] = item
    this.setData({
      tempDatas: changeDatas
    })
  },

  onMoveDown(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    if (index >= this.data.tempDatas.length - 1) return
    var changeDatas = this.data.tempDatas
    var item = changeDatas[index]
    changeDatas[index] = changeDatas[index+1]
    changeDatas[index+1] = item
    this.setData({
      tempDatas: changeDatas
    })
  },

  dialogClearContent(e) {
    var _this = this
    wx.showModal({
      title: '温馨提示',
      content: '这会清空您所有的输入内容?',
      confirmText:  '是的',
      cancelText: '不清空',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.globalData.copyDiyId = null
          app.globalData.diyType = null
          _this.clearContent()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  clearContent(e) {
    this.setData({ 
      tempDatas: []
    });
    this.addWare('CPU', '')
    this.addWare('内存', '')
    this.addWare('主板', '')
    this.addWare('显卡', '')
    this.addWare('硬盘', '')
    this.addWare('电源', '')
    this.addWare('显示器', '')
    this.addWare('机箱', '')
    this.addWare('键盘', '')
    this.addWare('鼠标', '')
    this.addWare('音响', '')
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
        diyTitle: resp.result.data.title,
        diyDesc: resp.result.data.desc,
        tempDatas: resp.result.data.wares,
        detail: resp.result.data
      })
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.clearContent(null)
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
    if (app.globalData.copyDiyId != null) {
      console.log('修改配置')
      this.retriveDiy(app.globalData.copyDiyId)
      app.globalData.copyDiyId = null
    }
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