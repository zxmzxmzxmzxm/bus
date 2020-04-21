// pages/myHome/order/index.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFlag:'',
    orderData:[],
    orderNo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    that.setData({
      isFlag:options.isFlag
    })
    wx.request({
      url: app.globalData.url+'/api/order/queryOrderList',
      method:'GET',
      data:{
        isFlag: options.isFlag,
        userId: wx.getStorageSync('userId')
      },
      success:function(res){
        that.setData({
          orderData: res.data.result
        })
      }
    })
  },
  tabOrder:function(e){
    let that=this
    that.setData({
      isFlag: e.currentTarget.dataset.isflag
    })
    if(that.data.isFlag==''||that.data.isFlag==undefined){
      wx.request({
        url: app.globalData.url+'/api/order/queryOrderList',
        method:'GET',
        data:{
          userId: wx.getStorageSync('userId'),
          isFlag: -1
        },
        success:function(res){
          that.setData({
            orderData: res.data.result
          })
        }
      })
    }else{
      wx.request({
        url: app.globalData.url+'/api/order/queryOrderList',
        method:'GET',
        data:{
          userId: wx.getStorageSync('userId'),
          isFlag: that.data.isFlag
        },
        success:function(res){
          that.setData({
            orderData: res.data.result
          })
        }
      })
    }
  },
  goDetailTap:function(e){
    let that=this
    that.setData({
      orderNo: e.currentTarget.dataset.orderno
    })
    wx.redirectTo({
      url: '../orderDetail/index?orderNo='+that.data.orderNo+'&isFlag='+that.data.isFlag,
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