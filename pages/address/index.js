// pages/address/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    startCity: '',
    endCity: '',
    startCitys: '',
    endCitys: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.request({
      url: app.globalData.url+'/api/station/queryEndCityList',
      method: "POST",
      data: {
        endCity: that.data.endCity
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res){
        console.log(res)
        that.setData({
          startCitys: res.data.result
        })
      }
    })
  },
  checkCity: function(e){
    var that = this
    console.log(e)
    that.setData({
      address: e.target.dataset.address
    })
    wx.switchTab({
      url: '../travel/index?address='+that.data.address,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})