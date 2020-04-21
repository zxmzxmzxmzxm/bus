// pages/scan/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderShow: 'none',
    orderNo:'',
    beginAddress:'',
    endAddress:'',
    pronseNum:'',
    countPrice:'',
    dateTime:'',
    orderNo:'',
    driverPhone:'',
    isFlag: '',
    flagLabel:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  scanTap:function(){
    let that=this
    wx.scanCode({
      success (res) {
        let result=JSON.parse(res.result)
        that.setData({
          orderNo: result.orderNo,
          beginAddress: result.beginAddress,
          endAddress: result.endAddress ,
          countPrice: result.countPrice,
          pronseNum: result.pronseNum,
        })
        if(result.isFlag==3){
          that.setData({
            flagLabel: '已支付，待出行'
          })
        }
      }
    })
  },
  userOrderTap:function(){
    wx.redirectTo({
      url: '../driverOrder/index',
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