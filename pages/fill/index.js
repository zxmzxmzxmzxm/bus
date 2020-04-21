// pages/fill/index.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carNo:'',
    price:'',
    driver:'',
    driverPhone: '',
    dateTime:'',
    upStart:'',
    downEnd:'',
    pronseNum: 1,
    orderPhone: '',
    openId: '',
    startLat: '',
    startLng: '',
    endLat:'',
    endLng:'',
    orderNo:'',
    userId:'',
    startCity:'',
    endCity:'',
    showModal: false,
    couponId: '',
    coupon: '点击选择代金券',
    fullmoney: '',
    money: '',
    sum:'',
    ids:[],
    personData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
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
        if(that.data.couponData.length<1){
          that.setData({
            coupon: '无可用优惠券',
            showModal: false
          })
        }
      }
    })
    that.setData({
      carNo: options.carNo,
      price: options.price,
      countPrice: options.price,
      sum: options.price,
      driver: options.driver,
      driverPhone: options.driverPhone,
      dateTime: options.date+' '+options.time,
      upStart: options.upStart,
      downEnd: options.downEnd,
      startCity: options.startCity,
      endCity: options.endCity,
      openId: wx.getStorageSync("openId"),
      startLat: wx.getStorageSync("startLat"),
      startLng: wx.getStorageSync("startLng"),
      endLat: wx.getStorageSync("endLat"),
      endLng: wx.getStorageSync("endLng"),
      orderPhone: wx.getStorageSync('phone')
    })
  },
  nochooseTap:function(){
    let that=this
    that.setData({
      showModal: false,
      countPrice: that.data.sum,
      coupon:'点击选择代金券' ,
      couponId:''
    })
  },
   // 选择代金券
   showCouponTap:function(res){
    let that=this
    that.setData({
      showModal: true,
      countPrice: that.data.sum
    })
  },
  chooseCouponTap:function(e){
    let that=this
    if(that.data.countPrice>e.currentTarget.dataset.fullmoney){
      that.setData({
        countPrice: (that.data.sum-e.currentTarget.dataset.money).toFixed(2),
        fullmoney: e.currentTarget.dataset.fullmoney,
        money: e.currentTarget.dataset.money,
        couponId: e.currentTarget.dataset.id,
        showModal: false,
        coupon: '满'+e.currentTarget.dataset.fullmoney+'减'+e.currentTarget.dataset.money,
      })
    }else{
      wx.showToast({
        title: '当前优惠券不可用',
      })
    }
  },
    // 弹窗方法
  hideModal: function () {
    let that=this
    that.setData({
      showModal: false
    });
  },
  preventTouchMove: function () {
  },
  editTap:function(e){
    wx.navigateTo({
      url: '../passengers/updatePassenger/index?id='+e.currentTarget.dataset.id,
    })
  },
  addPassengerTap:function(){
    wx.navigateTo({
      url: '../passengers/index?userId='+wx.getStorageSync('userId'),
    })
  },
  remove:function(array,val){
       for(var i = 0; i < array.length; i++) {
         if(array[i] == val){
           array.splice(i, 1)
         }
       }
       return -1
     },
  deleteTap:function(e){
    let that=this
    let val =e.currentTarget.dataset.id
    let array=that.data.ids
    wx.showModal({
      title: '提示',
      content: '确认删除该乘客',
      success (res) {
        if (res.confirm) {
          if(array.includes(val)){
            that.remove(array,val)
            that.setData({
              ids: array,
              pronseNum: array.length,
              countPrice: array.length*that.data.price,
              sum: array.length*that.data.price,
              coupon:'点击选择代金券'
            })
            wx.request({
              url: app.globalData.url+'/api/user/queryUserPronseInfo',
              method:'POST',
              data:{
                ids: that.data.ids
              },
              success:function(res){
                that.setData({
                  personData: res.data.result
                })
              }
            })
          }
        } else if (res.cancel) {
          wx.showToast({
            title: '已取消删除',
          })
        }
      }
    })
  },
  // 提交订单
  submitOrder: function(){
    let that=this
    if(that.data.ids.length>0){
      wx.request({
        url: app.globalData.url+'/api/order/save',
        method: 'POST',
        data: {
          carNo: that.data.carNo,
          payPrice: that.data.countPrice,
          dateTime: that.data.dateTime,
          depLat: that.data.startLat,
          depLon: that.data.startLng,
          destLat: that.data.endLat,
          destLon: that.data.endLng,
          upStart: that.data.upStart,
          downEnd: that.data.downEnd,
          openId: that.data.openId,
          carNo: that.data.carNo,
          userPronses: that.data.ids,
          pronseNum: that.data.pronseNum,
          userId: wx.getStorageSync('userId'),
          driver: that.data.driver,
          driverPhone: that.data.driverPhone,
          beginAddress: that.data.startCity,
          endAddress: that.data.endCity,
          couponId: that.data.couponId
        },
        success:function(res){
          if(res.data.code==200){
            console.log(res, '提交订单')
          that.setData({
            orderNo: res.data.result.orderNo,
            driverPhone: res.data.result.driverPhone
          })
          if(res.data.result.orderNo!=undefined||res.data.result.orderNo!=''){
            wx.request({
              url: app.globalData.url+'/api/pay/wechatAppletPay',
              method:'POST',
              data:{
                orderNo: res.data.result.orderNo,
                price: that.data.countPrice,
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
                      console.log(err)
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
              title: '保存订单失败',
            })
          }
          }else if(res.data.code==201){
            wx.showToast({
              title: res.data.message+'重复购买！',
            })
          }else{
            wx.showToast({
              title: res.data.message,
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '请选择乘车人',
      })
    }
  },
  onShow(){
    let that=this
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    //当前页的options，啥意思呢，就是你可能某个函数需要刷新，但是他的参数正好是传过来的参数
    if(currPage.data.ids!=null&&currPage.data.ids!=''){
      let idsArr=currPage.data.ids.map((item,index)=>{
        return  Number(item)
      })
      that.setData({
        ids: idsArr,
        pronseNum: idsArr.length,
        countPrice: idsArr.length*that.data.price,
        sum: idsArr.length*that.data.price,
        coupon: '点击选择代金券'
      })
      wx.request({
        url: app.globalData.url+'/api/user/queryUserPronseInfo',
        method:'POST',
        data:{
          ids: that.data.ids
        },
        success:function(res){
          that.setData({
            personData: res.data.result
          })
        }
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