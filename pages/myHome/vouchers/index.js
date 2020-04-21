// pages/myHome/vouchers/index.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponData:[],
    fullmoney:'',
    money:'',
    couponId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    wx.request({
      url: app.globalData.url+'/api/coupon/queryCouponList',
      method:'GET',
      data:{
        userId: wx.getStorageSync('userId')
      },
      success: function(res){
        that.setData({
          couponData: res.data.result
        })
      }
    })
  },
  // chooseCouponTap:function(e){
  //   let that=this
  //   console.log(e)
  //   that.setData({
  //     fullmoney: e.currentTarget.dataset.fullmoney,
  //     money: e.currentTarget.dataset.money,
  //     couponId: e.currentTarget.dataset.id
  //   })
  //   wx.redirectTo({
  //     url: '../../fill/index?fullmoney='+that.data.fullmoney+'&money='+that.data.money+'&couponId='+that.data.couponId,
  //   })
  // }
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