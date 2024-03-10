// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },

  loginAction(e) {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: getApp().globalData.baseUrl + '/api/account/wechat_login?code=' + res.code,
          success (res) {
            console.log(res)
            wx.setStorageSync('token', res.data.data.token)
            getApp().globalData.userToken = res.data.data.token
            
            // 判断当前路由层级, 选择跳转首页还是返回首页
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
          }
        })
      }
    })
  },

})
