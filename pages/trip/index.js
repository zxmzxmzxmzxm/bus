// pages/trip/index.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo:'',
    isFlag:'',
    orderData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    wx.request({
      url: app.globalData.url+'/api/order/queryOrderList',
      method:'GET',
      data:{
        isFlag: 3,
        userId:wx.getStorageSync('userId')
      },
      success:function(res){
        that.setData({
          orderData: res.data.result
        })
      }
    })
  },
  buyTicket:function(){
    wx.switchTab({
      url: '../travel/index',
    })
  },
  goDetailTap:function(e){
    let that=this
    that.setData({
      orderNo: e.currentTarget.dataset.orderno
    })
    wx.redirectTo({
      url: '../orderDetail/index?orderNo='+that.data.orderNo+'&isFlag=3',
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