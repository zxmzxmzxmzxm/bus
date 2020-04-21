// pages/driverLogin/index.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  blurPhone:function(e){
    let that=this
    that.setData({
      phone: e.detail.value
    })
  },
  blurPassword:function(e){
    let that=this
    that.setData({
      password: e.detail.value
    })
  },
  loginTap:function(){
    let that=this
    wx.request({
      url: app.globalData.url+'/api/car/driverLogin',
      method:'POST',
      data:{
        phone: that.data.phone,
        password: that.data.password
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
        },
      success:function(res){
        console.log(res)
        if(res.data.code==200){
          wx.setStorageSync('driverToken', res.data.data)
          wx.showToast({
            title: '登录成功',
          })
          wx.redirectTo({
            url: '../scan/index',
          })
        }else{
          wx.showToast({
            title: res.data.msg,
          })
        }
      }
    })
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