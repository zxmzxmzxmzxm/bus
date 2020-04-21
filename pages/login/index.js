// pages/index/index.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:'',
    nickName:'',
    encryptedData:'',
    iv:'',
    sendTime: '获取验证码',
    sendColor: '#fff',
    snsMsgWait: 60,
    phone:'',
    code:'',
    showModal: false,
    codetrue: false,
    ajxtrue: false,
    userId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    wx.getSetting({
      success: function(res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              wx.setStorageSync('nickName', res.userInfo.nickName)
              wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl)
            }
          })
        }else{
          that.setData({
            showModal: true
          })
        }
      }
    })
  },
   // 获取用户信息
   onGotUserInfo: function (e) {
     let that=this
     that.hideModal()
      wx.setStorageSync('nickName', e.detail.userInfo.nickName)
      wx.setStorageSync('avatarUrl', e.detail.userInfo.avatarUrl)
  },
  // 获取手机号
  onGotphonenumber:function(e){
    console.log(e)
    let that=this
    that.setData({
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    })
  },
  blurCode:function(e){
    let that=this
    that.setData({
      code: e.detail.value
    })
    if(that.data.code==''){
      that.setData({
        codetrue: false
      })
    }else{
      that.setData({
        codetrue: true
      })
    }
  },
  // 弹窗方法
  hideModal: function () {
    let that=this
    that.setData({
      showModal: false
    });
  },
  preventTouchMove: function () {
  },
// 校验手机号
blurPhone: function(e) {
  let that = this
  var phone = e.detail.value;
  that.setData({
    phone: phone
  })
  wx.setStorageSync('phone', phone)
  if (!(/^1[34578]\d{9}$/.test(phone))) {
    that.setData({
      ajxtrue: false
    })
    if (phone.length >= 11) {
      wx.showToast({
        title: '手机号有误',
        icon: 'success',
        duration: 2000
      })
    }
  } else {
    that.setData({
      ajxtrue: true
    })
  }
},
  // 获取验证码
  sendCode: function() {  
    let that=this
    // 60秒后重新获取验证码
    var inter = setInterval(function() {
      that.setData({
        smsFlag: true,
        sendColor: '#cccccc',
        sendTime: that.data.snsMsgWait + 's后重发',
        snsMsgWait: that.data.snsMsgWait - 1
        });
        if (that.data.snsMsgWait < 0) {
          clearInterval(inter)
          that.setData({
            sendColor: '#fff',
            sendTime: '获取验证码',
            snsMsgWait: 60,
            smsFlag: false
          });
        }
       }.bind(that), 1000);
       wx.request({
         url: app.globalData.url+'/smsRecord/sendSms',
         method:'POST',
         data:{
          phone: that.data.phone
         },
         header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
         success: function(res){
         }
       })
  },
  loginTap:function(){
    let that=this
    if (that.data.ajxtrue == true){
      if (that.data.codetrue == true){
        wx.request({
          url: app.globalData.url+'/api/user/bindOpenId',
          method:'POST',
          data:{
            phone: that.data.phone,
            code: that.data.code,
            openId: wx.getStorageSync('openId'),
            userPwd: '1111',
            gender: '男',
            avatar: wx.getStorageSync('avatarUrl'),
            nickName: wx.getStorageSync('nickName')
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
            },
          success:function(res){
            if(res.data.code==1){
              if(res.data.message=='手机号已绑定！'){
                wx.reLaunch({
                  url: '../travel/index',
                })
              }else{
                wx.showToast({
                  title: res.data.message,
                })
              }
            }else if(res.data.code==0){
              that.setData({
                userId: res.data.data.id
              })
              wx.setStorageSync('userId', res.data.data.id)
              wx.showToast({
                title: '用户绑定成功',
              })
              wx.reLaunch({
                url: '../travel/index',
              })
            }
          }
        })
      }else{
        wx.showToast({
          title: '验证码不能为空',
          icon: 'success',
          duration: 2000
        })
      }
    }else{
      wx.showToast({
        title: '手机号有误',
        icon: 'success',
        duration: 2000
      })
  }
},
onShareAppMessage: function () {
  return {
    title: '晋捷出行',
    path: '/pages/travel/index',
    imageUrl: '../image/share.jpg',
    success: function (res) {
      console.log('成功', res)
    }
  }
}
})