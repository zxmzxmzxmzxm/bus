// pages/buySuccess/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateTime:'',
    upStart:'',
    countPrice:'',
    orderNo:'',
    carMobile:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    that.setData({
      dateTime: options.dateTime,
      upStart: options.upStart,
      countPrice: options.countPrice,
      orderNo: options.orderNo,
      carMobile: options.driverPhone
    })
  },
  showOrderTap:function(){
    wx.switchTab({
      url: '../travel/index',
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