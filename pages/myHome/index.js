// pages/myHome/index.js
const app=getApp()
Page({

  data: {
    userId:'',
    openId:'',
    avatarUrl:'',
    customer: '15735046427'
  },

  onLoad: function (options) {
    let that=this
    that.setData({
      openId: wx.getStorageSync('openId'),
    })
    wx.getSetting({
      success: function(res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              wx.setStorageSync('nickName', res.userInfo.nickName)
              wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl)
              that.setData({
                avatarUrl: res.userInfo.avatarUrl
              })
            }
          })
        }
      }
    })
  },
  goLoginTap:function(){
    wx.redirectTo({
      url: '../login/index',
    })
  },
  customerTap:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.customer
    })
  },
  goAllOrder:function(){
    let that=this
    that.setData({
      userId: wx.getStorageSync('userId')
    })
    if(that.data.userId==''||that.data.userId==undefined){
      wx.request({
        url: app.globalData.url+'/api/user/wechatAuth',
        method:'POST',
        data:{
          openId: wx.getStorageSync('openId')
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success:function(res){
          if(res.data.code==0){
            wx.setStorageSync('userId', res.data.data.id)
          }else if(res.data.code==1){
              wx.showToast({
                title: res.data.message,
              })
              wx.redirectTo({
                url: '../login/index',
              })
            }
        }
      })
    }else{
      wx.redirectTo({
        url: "../order/index?isFlag=-1",
      })
    }
  },
  goNopayOrder:function(){
    let that=this
    that.setData({
      userId: wx.getStorageSync('userId')
    })
    if(that.data.userId==''||that.data.userId==undefined){
      wx.request({
        url: app.globalData.url+'/api/user/wechatAuth',
        method:'POST',
        data:{
          openId: wx.getStorageSync('openId')
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success:function(res){
          if(res.data.code==0){
            wx.setStorageSync('userId', res.data.data.id)
          }else if(res.data.code==1){
            wx.showToast({
              title: res.data.message,
            })
            wx.redirectTo({
              url: '../login/index',
            })
          }
        }
      })
    }else{
      wx.redirectTo({
        url: '../order/index?isFlag=0',
      })
    }
  },
  goNoTripOrder:function(){
    let that=this
    that.setData({ 
      userId: wx.getStorageSync('userId')
    })
    if(that.data.userId==''||that.data.userId==undefined){
      wx.request({
        url: app.globalData.url+'/api/user/wechatAuth',
        method:'POST',
        data:{
          openId: wx.getStorageSync('openId')
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success:function(res){
          if(res.data.code==0){
            wx.setStorageSync('userId', res.data.data.id)
          }else if(res.data.code==1){
            wx.showToast({
              title: res.data.message,
            })
            wx.redirectTo({
              url: '../login/index',
            })
          }
        }
      })
    }else{
      wx.redirectTo({
        url: '../order/index?isFlag=3',
      })
    }
  },
  goNoAssessOrder:function(){
    let that=this
    that.setData({
      userId: wx.getStorageSync('userId')
    })
    if(that.data.userId==''||that.data.userId==undefined){
      wx.request({
        url: app.globalData.url+'/api/user/wechatAuth',
        method:'POST',
        data:{
          openId: wx.getStorageSync('openId')
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success:function(res){
          if(res.data.code==0){
            wx.setStorageSync('userId', res.data.data.id)
          }else if(res.data.code==1){
            wx.showToast({
              title: res.data.message,
            })
            wx.redirectTo({
              url: '../login/index',
            })
          }
        }
      })
    }else{
      wx.redirectTo({
        url: '../order/index?isFlag=1',
      })
    }
  },
  usequan:function(){
    wx.redirectTo({
      url: 'vouchers/index',
    })
  },
  myevaluation:function(){
    wx.redirectTo({
      url: 'evaluation/index',
    })
  },
  contactTap:function(){
    wx.redirectTo({
      url: '../passengers/contact/index',
    })
  },
  onUserOpStatistic: function(e) {
		if(e.op == 'share') {
			var path = '../travel/index';
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