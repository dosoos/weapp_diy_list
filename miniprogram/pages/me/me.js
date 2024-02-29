// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../images/logo-mini.png',
    nickName: '微信用户',
    // 设置昵称弹窗
    showSettingNickname: false,
    settingNickname: '',
    collect_count: 0,
    like_count: 0,
    myself_count: 0,
  },
  
  // 修心获取用户头像方式
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    console.log('user avatar', avatarUrl)
    const that = this
    
    wx.cloud.uploadFile({      
      cloudPath: `avatar_${parseInt(Math.random() * 10**10)}.png`,
      filePath: avatarUrl
    }).then(res => {
      console.log('上传文件返回', res)
      //返回该图片文件路径fileID        
      that.setData({             
        avatarUrl: res.fileID
        //文件 ID        
      });
      
      // 将头像保存至数据库
      wx.cloud.callFunction({
        name: 'diyFunctions',
        config: {
          env: this.data.envId
        },
        data: {
          type: 'profile',
          avatar: res.fileID
        }
      }).then((resp) => {
        console.log("将头像保存至数据库返回", resp)
        that.setData({
          avatarUrl: resp.result.data.avatar == '' ? this.data.avatarUrl : resp.result.data.avatar,
          nickName: resp.result.data.nickname
        })
      });

    }).catch(error => {      
      console.log('将头像保存至数据库错误', error)    
    });

  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        const that = this
        console.log("获取微信头像昵称", that.data.userInfo)
        wx.cloud.callFunction({
          name: 'diyFunctions',
          config: {
            env: this.data.envId
          },
          data: {
            type: 'profile'
          }
        }).then((resp) => {
          console.log("获取资料返回", resp)
          that.setData({
            avatarUrl: resp.result.data.avatar == '' ? this.data.avatarUrl : resp.result.data.avatar,
            nickName: resp.result.data.nickname == '' ? '微信用户' : resp.result.data.nickname,
          })
        });
      }
    })
  },

  onNicknameClick(e) {
    console.log('显示设置昵称对话框')
    this.setData({
      showSettingNickname: true
    })
  },

  onConfirmNickname(e) {
    console.log('确认昵称设置')
    const that = this
    wx.cloud.callFunction({
      name: 'diyFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'profile',
        nickname: this.data.settingNickname
      }
    }).then((resp) => {
      console.log("设置资料返回", resp)
      that.setData({
        avatarUrl: resp.result.data.avatar == '' ? this.data.avatarUrl : resp.result.data.avatar,
        nickName: resp.result.data.nickname == '' ? '微信用户' : resp.result.data.nickname,
      })
    });
  },

  getMySelfs() {
    var _this = this
    wx.cloud.callFunction({
      name: 'diyFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'diyBoard'
      }
    }).then((resp) => {
      console.log(resp)
      _this.setData({
        collect_count: resp.result.data.collect_count.total,
        like_count: resp.result.data.like_count.total,
        myself_count: resp.result.data.myself_count.total,
        avatarUrl: resp.result.data.avatar == '' ? this.data.avatarUrl : resp.result.data.avatar,
        nickName: resp.result.data.nickname == '' ? '微信用户' : resp.result.data.nickname,
      })
    });
  },

  copyWechat(e) {
    wx.setClipboardData({
      data: 'dosoos',
      success (res) {
        wx.showToast({
          title: '复制成功!',
        })
      }
    })
  },

  goMyLikes(e) {
    wx.navigateTo({
      url: '../likes/likes?avatar=' + this.data.avatarUrl,
    });
  },

  goMyCollects(e) {
    wx.navigateTo({
      url: '../collects/collects?avatar=' + this.data.avatarUrl,
    });
  },

  goMySelfs(e) {
    wx.navigateTo({
      url: '../myself/myself?avatar=' + this.data.avatarUrl,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getMySelfs()
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