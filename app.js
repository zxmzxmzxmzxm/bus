//app.js
var appId = 'wx1e931ef78ea9908b';
var secret = '62834398893cb36bb94279811e2a03ab';
App({
    onLaunch: function () {
      // 确认更新小程序
      const updateManager = wx.getUpdateManager()
  
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate)
      })
  
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
  
      updateManager.onUpdateFailed(function () {
        // 新版本下载失败
      })
  
      // 展示本地存储能力
      var logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)
      var openId = wx.getStorageSync('openId')
  
      if (openId == null || openId =='') {
        // 登录
        wx.login({
          success: res => {
            console.log(res)
            wx.request({
              url: this.globalData.url + '/api/user/getOpenId', 
              method: "POST",
              data: {
                code: res.code,
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res) {
                console.log(res)
                wx.setStorageSync('openId', res.data.data)
              }
            })
          }
        })
      }
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      })
    },
    globalData: {
      userInfo: null,
      openId: null,
      url:'https://giantexbus.cn/car-boot'
      // url: 'http://39.97.177.86:8088'
      // url: 'https://www.ymxsaas.cn'
      // url: 'http://172.18.0.148:8088/car-boot'
      // url: 'http://172.18.1.58:8088'
    },
    initToken: function() {
      let appToken = wx.getStorageSync('app-token')
      let tokenTime = wx.getStorageSync('token-time')
      let timestamp = Date.parse(new Date())
      let refresh = false
      if (appToken != null && appToken != '') {  
        if (timestamp - tokenTime > 60000) {
          refresh = true
        }
      } else {
        refresh = true
      }
      if (refresh) {
        wx.request({
          url: this.globalData.url + 'sign/token?key=Epass@sibd.org.cn',
          success(res) {
            if (res.data.code == 0) {
              wx.setStorageSync('app-token', res.data.data)
              wx.setStorageSync('token-time', timestamp)
              return res.data.data
            } else {
              return appToken
            }
          }
        })
      }
      return appToken
    }
  })