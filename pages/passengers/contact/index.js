// pages/contact/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personData:[],
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    wx.request({
      url: app.globalData.url+'/api/user/listUserPronse',
      method:'GET',
      data:{
        id: wx.getStorageSync('userId')
      },
      success:function(res){
        console.log(res)
        that.setData({
          personData: res.data.result
        })
      }
    })
  },
  editTap:function(e){
    wx.navigateTo({
      url: '../updatePassenger/index?id='+e.currentTarget.dataset.id
    })
  },
  deleteTap:function(e){
    let that=this
    wx.showModal({
      title: '提示',
      content: '确认删除该乘客',
      success (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url+'/api/user/delUserPronse',
            method: 'GET',
            data:{
              id: e.currentTarget.dataset.id
            },
            header:{
              'content-type': 'application/json'
            },
            success:function(res){
              console.log(res)
              if(res.data.code==200){
                wx.showToast({
                  title: '删除成功',
                })
                that.onLoad()
              }else{
                wx.showToast({
                  title: '删除失败',
                })
              }
            }
          })
        } else if (res.cancel) {
          wx.showToast({
            title: '已取消删除',
          })
        }
      }
    })
  },
  addTap:function(res){
    wx.navigateTo({
      url: '../addPassenger/index?userId='+wx.getStorageSync('userId'),
    })
  },
  onShow(){
    let that=this
    wx.request({
      url: app.globalData.url+'/api/user/listUserPronse',
      method:'GET',
      data:{
        id: wx.getStorageSync('userId')
      },
      success:function(res){
        console.log(res)
        that.setData({
          personData: res.data.result
        })
      }
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