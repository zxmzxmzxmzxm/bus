// pages/buyTicket/index.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:[],
    myAddress:'',
    myAddress1:'',
    carMobile:'',
    carNo:'',
    className:'',
    id:'',
    price:'',
    time:'',
    date:'',
    startStation:'',
    endStation:'',
    driver:''
  },
  onLoad: function (options) {
    let that=this
    var time = util.formatTime(new Date());
    that.setData({
      myAddress: options.myAddress,
      myAddress1: options.myAddress1,
      date: options.queryDate,
      startStation: options.startStation,
      endStation: options.endStation
    })
    wx.request({
      // url: 'http://172.18.0.148:8088/car-boot/api/station/infoByCityName',
      url: app.globalData.url+'/api/station/infoByCityName',
      method:"POST",
      data:{
        startStation: options.startStation,
        endStation: options.endStation,
        queryDate: options.queryDate
      },
      success:function(res){
        that.setData({
          result:res.data.result
        })      
      }
    })
  },
  reservationTap:function(e){
    let that=this
    console.log(e)
    that.setData({
      carMobile: e.currentTarget.dataset.carmobile,
      carNo: e.currentTarget.dataset.carno,
      className: e.currentTarget.dataset.classn,
      price: e.currentTarget.dataset.price,
      time: e.currentTarget.dataset.time,
      driver: e.currentTarget.dataset.driver
    })
    wx.redirectTo({
      url: '../fill/index?carNo='+that.data.carNo+'&price='+that.data.price+'&date='+that.data.date+'&time='+that.data.time+'&driver='+that.data.driver+'&driverPhone='+that.data.carMobile+'&downEnd='+that.data.myAddress1+'&upStart='+that.data.myAddress+'&startCity='+that.data.startStation+'&endCity='+that.data.endStation,
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