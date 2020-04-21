// pages/driverOrderDetail/index.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo:'',
    upStart:'',
    downEnd:'',
    pronseName:'',
    pronseNum:'',
    pronsePhone:'',
    countPrice:'',
    dateTime:'',
    orderNo:'',
    driverPhone:'',
    isFlag: '',
    flagLabel:'',
    pronseList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    console.log(options)
    that.setData({
      orderNo: options.orderNo,
      isFlag: options.isFlag,
      pronsePhone: wx.getStorageSync('phone')
    })
    if(that.data.isFlag==1){
      that.setData({
        flagLabel: '待支付'
      })
    }else if(that.data.isFlag==3){
      that.setData({
        flagLabel: '待出行'
      })
    }else if(that.data.isFlag==4){
      that.setData({
        flagLabel: '已出行'
      })
    }
    wx.request({
      url: app.globalData.url+'/api/order/queryOrderDetail',
      method:'GET',
      data:{
        orderNo: that.data.orderNo
      },
      success:function(res){
        console.log(res, '00000')
        that.setData({
          upStart: res.data.result.upStart,
          downEnd: res.data.result.downEnd,
          pronseName: res.data.result.pronseName,
          pronseNum: res.data.result.pronseNum,
          pronsePhone: res.data.result.pronsePhone,
          countPrice: res.data.result.countPrice,
          dateTime: res.data.result.dateTime,
          orderNo: res.data.result.orderNo,
          driverPhone: res.data.result.driverPhone,
          qrcode: res.data.result.qrcode,
          pronseList: res.data.result.pronseList
        })
      }
    })
  },
  refundTap: function(){
    let that=this
    wx.redirectTo({
      url: '../code/index?qrcode='+that.data.qrcode,
    })
  },
  callPassengerTap:function(){
    wx.makePhoneCall({
      phoneNumber: '1340000'
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