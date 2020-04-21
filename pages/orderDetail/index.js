// pages/orderDetail/index.js
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
    pronseList:[],
    discount: '',
    payPrice:'',
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
    if(that.data.isFlag==0){
      that.setData({
        flagLabel: '待支付'
      })
    }else if(that.data.isFlag==3){
      that.setData({
        flagLabel: '待出行'
      })
    }else if(that.data.isFlag==1){
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
        that.setData({
          upStart: res.data.result.upStart,
          downEnd: res.data.result.downEnd,
          pronseName: res.data.result.pronseName,
          pronseNum: res.data.result.pronseNum,
          pronsePhone: res.data.result.pronsePhone,
          countPrice: res.data.result.countPrice,
          dateTime: res.data.result.dateTime,
          orderNo: res.data.result.orderNo,
          tradeNo: res.data.result.tradeNo,
          driverPhone: res.data.result.driverPhone,
          qrcode: res.data.result.qrcode,
          pronseList: res.data.result.pronseList,
          payPrice: res.data.result.payPrice,
          discount: res.data.result.countPrice-res.data.result.payPrice
        })
      }
    })
  },
  //退票
  refundTap: function(){
    let that=this
    wx.showModal({ 
      title: '退票',
      content: '确认退票',
      success (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url+'/api/pay/underPay',
            method:'POST',
            data:{
              orderNo: that.data.orderNo,
              totalFee: that.data.payPrice*100,
              refundFee: that.data.payPrice*100,  
              outTradeNo: that.data.orderNo,
              transactionID: that.data.tradeNo,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success:function(res){
              console.log(res)
              if(res.data==true){
                wx.showToast({
                  title: '退票成功'
                })
                wx.redirectTo({
                  url: '../travel/index',
                })
              }else{
                wx.showToast({
                  title: res.errMsg,
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 取消订单
  cancelOrderTap:function(){
    let that=this
    wx.showModal({
      title: '取消订单',
      content: '确认取消订单',
      success (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url+'/api/order/cancelOrder',
            method:'GET',
            data:{
              orderNo: that.data.orderNo,
              userId: wx.getStorageSync('userId')
            },
            success:function(res){ 
              if(res.data.code==200){
                wx.showToast({
                  title: '此订单已取消',
                })
                wx.redirectTo({
                  url: '../order/index',
                })
              }else{
                wx.showToast({
                  title: res.data.message,
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //去验票
  checkTap:function(){
    let that=this
    wx.redirectTo({
      url: '../code/index?qrcode='+that.data.qrcode,
    })
  },
  //去支付
  payTap:function(){
    let that=this
    if(that.data.orderNo!=undefined||that.data.orderNo!=''){
      wx.request({
        url: app.globalData.url+'/api/pay/wechatAppletPay',
        method:'POST',
        data:{
          orderNo: that.data.orderNo,
          price: that.data.payPrice,
          body: '订单支付',
          openId: wx.getStorageSync('openId')
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success:function(res){
          if(res.data.code==0){
            wx.requestPayment({
              timeStamp: res.data.data.timeStamp,
              nonceStr: res.data.data.nonceStr,
              package: res.data.data.packageStr,
              signType: 'MD5',
              paySign: res.data.data.sign,
              appId: res.data.data.appId,
              success:function(res){
                wx.showToast({
                  title: '支付成功',
                })
                wx.redirectTo({
                  url: '../buySuccess/index?dateTime='+that.data.dateTime+'&upStart='+that.data.upStart+'&countPrice='+that.data.countPrice+'&orderNo='+that.data.orderNo+'&driverPhone='+that.data.driverPhone,
                })
              },
              fail:function(err){
                wx.showToast({
                  title: '支付失败',
                })
                wx.redirectTo({
                  url: '../order/index',
                })
              },
              complete:function(com){
                console.log(com)
              }
            })
          }else if(res.data.code==1){
            wx.showToast({
              title: res.data.message,
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '支付失败',
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