// pages/addPassenger/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pronseIdCard: "",
  	pronseName: "",
    pronsePhone: "",
    nametrue: false,
    ajxtrue: false,
    idCardtrue: false,
  },

  onLoad: function (options) {

  },
  blurName:function(e){
    let that=this
    var pronseName = e.detail.value;
    that.setData({
      pronseName: pronseName
    })
    if(e.detail.value==''){
      that.setData({
        nametrue: false
      })
    }else{
      that.setData({
        nametrue: true
      })
    }
  },
    // 校验手机号
    blurPhone: function(e) {
      let that = this
      var phone = e.detail.value;
      that.setData({
        pronsePhone: phone
      })
      if (!(/^1[34578]\d{9}$/.test(phone))) {
        that.setData({
          ajxtrue: false
        })
        if (phone.length >= 11) {
          wx.showToast({
            title: '手机号有误',
            icon: 'success',
            duration: 2000
          })
        }
      } else {
        that.setData({
          ajxtrue: true
        })
      }
    },
    // 身份证号不严格校验
    blurIdCard: function(e) {
      let that=this
      var idCard = e.detail.value;
      that.setData({
        pronseIdCard: idCard
      })
      if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard)) {
        that.setData({
          idCardtrue: false
        })
      } else {
        that.setData({
          idCardtrue: true
        })
      }
    },
  saveTap:function(){
    let that=this
    if(that.data.nametrue==true){
      if(that.data.ajxtrue==true){
        if(that.data.idCardtrue==true){
          wx.request({
            url: app.globalData.url+'/api/user/saveUserPronse',
            method:'POST',
            data:{
              pronseIdCard: that.data.pronseIdCard,
              pronseName: that.data.pronseName,
              pronsePhone: that.data.pronsePhone,
              userId: wx.getStorageSync('userId')
            },
            success:function(res){
              console.log(res)
              if(res.data.code==200){
                wx.showToast({
                  title: '保存成功',
                })
                var pages = getCurrentPages();
                if (pages.length > 1) {
                  var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
                  beforePage.onLoad({
                    userId: wx.getStorageSync('userId')
                  })
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }else{
                wx.showToast({
                  title: res.data.message,
                })
              }
            }
          })
        }else{
          wx.showToast({
            title: '请输入正确证件号',
          })
        }
      }else{
        wx.showToast({
          title: '手机号有误',
        })
      }
    }else{
      wx.showToast({
        title: '请输入姓名',
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