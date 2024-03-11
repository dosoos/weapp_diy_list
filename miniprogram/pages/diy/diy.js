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
        title: '',
        // 型号
        desc: '',
        // 价格
        price: 0,
        // 数量
        count: 1
      }
    ],
    diyTitle: '',
    diyDesc: '',
    detail: null,
    saveButtonText: '保存配置'
  },

  computed: {
    totalPrice(data) {
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
      title: category,
      // 型号
      desc: special,
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

  onClose(e) {
    this.setData({
      show: false
    })
  },

  uploadDiy() {
    if (this.data.diyTitle.length <= 0) {
      wx.showToast({
        icon: 'error',
        title: '请输入配置单名称',
      })
      return
    }
    wx.showLoading({
      title: '保存中...',
    })
    const _this = this
    var totalPrice = 0
    if (this.data.tempDatas.length > 0) {
      totalPrice = this.data.tempDatas.reduce((sum, { price, count }) => sum + price * count, 0)
    }
    if (app.globalData.diyType == 'edit') {
      // 编辑配置单
      wx.request({
        method: "PUT",
        url: getApp().globalData.baseUrl + `/api/diy/diys/${this.data.detail.id}/`,
        header: {
          'Authorization': 'Token ' + getApp().globalData.userToken
        },
        data: {
          uuid: this.data.detail.uuid,
          title: this.data.diyTitle,
          desc: this.data.diyDesc,
          price: totalPrice,
          wares: [
            ...this.data.tempDatas
          ],
        },
        success (res) {
          console.log("编辑配置单", res)
          if (res.data.code != 0) {
            wx.showToast({
              title: res.data.message,
            })
            return
          }
          wx.showToast({
            title: '保存成功',
          })
          wx.hideLoading()
          getApp().globalData.copyDiyId = null
          getApp().globalData.diyType == 'edit'
          _this.setData({
            saveButtonText: '保存修改',
            diyTitle: res.data.data.title,
            diyDesc: res.data.data.desc,
            tempDatas: res.data.data.wares,
            detail: res.data.data
          })
        }
      })
    } else {
      // 创建配置单
      wx.request({
        method: "POST",
        url: getApp().globalData.baseUrl + '/api/diy/diys/',
        header: {
          'Authorization': 'Token ' + getApp().globalData.userToken
        },
        data: {
          title: this.data.diyTitle,
          desc: this.data.diyDesc,
          price: totalPrice,
          wares: [
            ...this.data.tempDatas
          ],
        },
        success (res) {
          console.log("创建配置单", res)
          if (res.statusCode == 401) {
            wx.removeStorageSync('token')
            getApp().globalData.userToken = null
            wx.hideLoading()
            wx.navigateTo({
              url: '../login/login',
            })
            return
          }
          if (res.data.code != 0) {
            wx.showToast({
              title: res.data.message,
            })
            return
          }
          wx.showToast({
            title: '保存成功',
          })
          wx.hideLoading()
          getApp().globalData.copyDiyId = null
          getApp().globalData.diyType == 'edit'
          _this.setData({
            saveButtonText: '保存修改',
            diyTitle: res.data.data.title,
            diyDesc: res.data.data.desc,
            tempDatas: res.data.data.wares,
            detail: res.data.data
          })
        }
      })
    }
    
  },

  // 数据元素被修改时修改列表元素
  onCategoryChange(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    this.setData({
      ['tempDatas[' + index + '].title']: e.detail
    })
  },

  onSpecialChange(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    this.setData({
      ['tempDatas[' + index + '].desc']: e.detail
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
      tempDatas: [],
      diyTitle: '我的diy_' + parseInt(Math.random()*10000),
      diyDesc: "",
      saveButtonText: '保存配置'
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
    const _this = this
    wx.request({
      url: getApp().globalData.baseUrl + '/api/diy/detail/' + id,
      success (res) {
        console.log('DIY详情', res)
        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.message,
          })
          return
        }
        _this.setData({
          diyTitle: res.data.data.title,
          diyDesc: res.data.data.desc,
          tempDatas: res.data.data.wares,
          detail: res.data.data
        })
      }
    })
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
      if (app.globalData.diyType == 'edit') {
        this.setData({
          saveButtonText: '保存修改'
        })
      }
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