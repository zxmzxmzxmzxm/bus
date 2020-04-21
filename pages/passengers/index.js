// pages/passengers/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personData:[],
    ids:[]
  },
  onLoad: function (options) {
    let that=this
    wx.request({
      url: app.globalData.url+'/api/user/listUserPronse',
      method:'GET',
      data:{
        id: wx.getStorageSync('userId')
      },
      success:function(res){
        that.setData({
          personData: res.data.result
        })
      }
    })
  },
  editTap:function(e){
    wx.navigateTo({
      url: 'updatePassenger/index?id='+e.currentTarget.dataset.id
    })
  },
  addTap:function(){
    wx.navigateTo({
      url: 'addPassenger/index?userId='+wx.getStorageSync('userId'),
    })
  },
  checkboxChange:function(e){
    let that=this
    that.setData({
      ids: e.detail.value
    })
  },
  complateTap(){
    let that=this
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
      // beforePage.
      beforePage.setData({                                      //修改上一个页面的变量
        ids: that.data.ids
      })
      console.log(that.data.ids)
      wx.navigateBack({
        delta: 1
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