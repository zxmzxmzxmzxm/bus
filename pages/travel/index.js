// pages/travel/index.js
import initCalendar, {
  getSelectedDay,
  setTodoLabels
} from '../../template/calendar/index';
const app = getApp()
// const config = require('../../config.js')
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
var city = require('../../utils/city.js');
var publics = require("../../utils/public.js");
var start_clientX
var end_clientX;
var address; //搜索页面传回地址
var inputVals;
var po; //起点终点区分
// 时间选择器（现在出发 获取系统当前时间）
var date = new Date();
var year = date.getFullYear();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();
var year = date.getFullYear();
var month = date.getMonth();
var day = date.getDay();
var nowDate = month + '月' + day + '日' + ' ' + currentHours + ':' + currentMinute;

var startDate;
var nowDate;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    startCity: '请选择',
    endCity: '请选择',
    changeData:'',
    windowWidth: wx.getSystemInfoSync().windowWidth,
    myLatitude: "", //获取当前位置
    myLongitude: "", //获取当前位置
    myAddress: "", //获取当前位置 起点
    myAddress1: "", //获取当前位置 终点  
    startLat: '',
    startLng: '',
    endLat: '',
    endLng: '',
    disabled: true, //禁止点击
    //城市列表页面
    inputShowed: false, //搜索框 显示隐藏
    inputVal: "", //搜索框 input的值
    inputVals: '', //搜索键值
    displaylist: 'none',
    displayCity: 'none', //城市列表弹窗
    // 起点地图选择开始
    mapShow: 'none',
    scale: 16, // 缩放级别，默认18，数值在0~18之间
    longitude: 0, // 经度
    latitude: 0, // 纬度
    controls: [], // 地图控件组
    markers: [], // 地图标记组
    mapAdds: '上车地点请尽量设在路边，方便与司机碰面',
    driveCon: '在这里上车',
    // 起点地图选择结束
    //  选项卡
    desk: 0, //tab内容
    deskIndex: 0, //tab名称
    city: "",
    addList: '', // 获取搜索城市列表
    // 城市列表结束
    // showModalSafe:true
    // 拖拽
    ballBottom: '30',
    ballRight: '30',
    screenHeight: 0,
    screenWidth: 0,
    //城市  区县选择
    cityLists: [ ],
    countyLists:[],
    cityLists1:[],
    countyLists1: [],
    ktCity:'请选择',
    Ncity:'',
    cityShow:'none',
    // ktCounty: '选择区县',
    countyShow:'none',
    mdCity: '请选择',
    cityShow1: 'none',
    // mdCounty: '选择区县',
    countyShow1: 'none',
    routeList:[],  //开通路线
    routeShow:'none', //开通线路弹窗
    Scity:'请选择',
    citysShow:'none',
    fourShow:'block',
    dateshow: 'none',
    citynshow: 'none',
    result: '',
    validatetrue: true,
    clickDate:'请选择出发日期',
    userId:'',
    air:'机场接送',
    gt:'高铁接送',
    custom:'定制接送',
    month:'',
    day:'',
    time:'请选择出发时间'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    if(options!=null){
      that.setData({
        startCity: options.startCity,
        endCity: options.endCity
      })
    }
    if(that.data.startCity==''){
      that.setData({
        startCity:"请选择"
      })
    }
    if(that.data.endCity==''){
      that.setData({
        endCity:"请选择"
      })
    }
    var po = wx.getStorageSync('po');
    var desk = wx.getStorageSync('desk');
    wx.setStorageSync('desk', 0);
   
    that.setData({
      deskIndex: desk,
    })
    Height(that)
    // po = options.po
    // 实例化API核心类   腾讯地图
    qqmapsdk = new QQMapWX({
        key: 'BJFBZ-ZFTHW-Y2HRO-RL2UZ-M6EC3-GMF4U'
    });
    var searchLetter = city.searchLetter;
    var cityList = city.cityList();
    var sysInfo = wx.getSystemInfoSync();
    var winHeight = sysInfo.windowHeight;
    var itemH = winHeight / searchLetter.length;
    var tempObj = [];
    var addList = [];
    for (var i = 0; i < searchLetter.length; i++) {
      var temp = {};
      temp.name = searchLetter[i];
      temp.tHeight = i * itemH;
      temp.bHeight = (i + 1) * itemH;
      tempObj.push(temp)
    }
    this.setData({
      winHeight: winHeight,
      itemH: itemH,
      searchLetter: tempObj,
      cityList: cityList,
      price1: '25.2',
      tel: '17722123631',
      desk: desk
    })
    //城市列表结束
    // 定位当前的具体位置
    // wx.getLocation({
    //   type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
    //   success: function (res) {
    //     // 调用sdk接口
    //     qqmapsdk.reverseGeocoder({
    //       poi_options: 'policy=2',
    //       get_poi: 1,
    //       success: function (res) {
    //         console.log(res);
    //         that.setData({
    //           myAddress: res.result.formatted_addresses.recommend,
    //           startLat: res.result.location.lat,
    //           startLng: res.result.location.lng,
    //           startAddress: res.result.address,
    //           city: res.result.address_component.city,
    //         });
    //         // 本地缓存
    //         wx.setStorageSync('startAddress', res.result.formatted_addresses.recommend);
    //         wx.setStorageSync('startLat', res.result.location.lat);
    //         wx.setStorageSync('startLng', res.result.location.lng);
    //         // var keyword = res.result.address_component.city
    //         // var keyword = wx.getStorageSync('cityName');
    //         // console.log(keyword)
    //         // qqmapsdk.getSuggestion({
    //         //   keyword: keyword,
    //         //   success: function (res) {
    //         //     var cityData = res.data;
    //         //     for (let i = 0; i < cityData.length; i++) {
    //         //       var temp = {};
    //         //       temp.title = cityData[i].title;
    //         //       temp.address = cityData[i].address;
    //         //       temp.lat = cityData[i].location.lat;
    //         //       temp.lng = cityData[i].location.lng;
    //         //       temp.index = i;
    //         //       addList.push(temp);
    //         //     }
    //         //     // 渲染列表  
    //         //     that.setData({
    //         //       addList: addList,
    //         //     })
    //         //   },
    //         //   fail: function (res) {
    //         //     // console.log(res);
    //         //   },
    //         //   complete: function (res) {
    //         //     // console.log(res);
    //         //   }
    //         // });
    //       },
    //       fail: function (res) {
    //         // console.log('')
    //       },
    //       complete: function (res) {
    //         // console.log(res);
    //       }
    //     });

    //   },
    //   fail: function () {
    //     // fail
    //     wx.showModal({
    //       title: '提示',
    //       content: '无忧出行无法获取您的位置，可能当前位置信号弱，或者未开启定位权限，请到设置中开启，或者选择上车地点',
    //       showCancel: true,
    //       cancelText: '选择上车地点',
    //       cancelColor: 'red',
    //       confirmText: '我知道了',
    //       confirmColor: 'black',
    //       success: function (res) {
    //         // wx: wx.navigateTo({
    //         //     url: '../wSearch/wSearch?po=' + 0,
    //         // })
    //         // console.log(2)
    //       },
    //       fail: function (res) {
    //         // console.log(1)

    //       },
    //       complete: function (res) {

    //       },
    //     })

    //   },
    //   complete: function () {
    //     // complete
    //     // console.log("定位完成");
    //   }
    // })
   

    var _this = this;
        wx.getSystemInfo({
            success: function(res) {
                _this.setData({
                    screenHeight: res.windowHeight,
                    screenWidth: res.windowWidth,
                });
                // console.log(res.windowHeight + '===' + res.windowWidth)
            }
        });
   
    
  },

  // 司机权限处理
  driverTap:function(){
    console.log(wx.getStorageSync('driverToken'))
    if(wx.getStorageSync('driverToken')!=''){
      wx.redirectTo({
        url: '../scan/index',
      })
    }else{
      wx.redirectTo({
        url: '../driverLogin/index',
      })
    }
  },
  // 选择列表
  selectList: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var address = this.data.addList[index];
    var po = wx.getStorageSync('po');
    if (po == '0') {
      wx.setStorageSync('myAddress', address.address);
      wx.setStorageSync('startLat', address.lat);
      wx.setStorageSync('startLng', address.lng);
      wx.setStorageSync('startAddress', address.title);
      this.setData({
        displayCity: 'none',
        showModalStatus: false,
        myAddress: wx.getStorageSync('startAddress')
      })
    } else if (po == '1') {
      wx.setStorageSync('myAddress1', address.address);
      wx.setStorageSync('endLat', address.lat);
      wx.setStorageSync('endLng', address.lng);
      wx.setStorageSync('endAddress', address.title);
      this.setData({
        displayCity: 'none',
        disabled: false,
        showModalStatus: false,
        myAddress1: wx.getStorageSync('endAddress')
      })
      // wx.navigateTo({
      //   url: '../wIndex/wIndex',
      // })
    }
    wx.setNavigationBarTitle({
        title: '晋捷出行',
    })
    that.setData({
        maphide: false,
        tiphide: false,
        inputVal: ''
    })
},
// 取消规则
backs: function() {
  this.setData({
      showModalStatus: false,
      maphide: false,
      tiphide: false
  });
  wx.setNavigationBarTitle({
    title: '无忧出行',
  })
},
   // 选择城市
   countySeled: function (e) {
    var that = this;
    var city = e.currentTarget.dataset.city;
    var countyCode = e.currentTarget.dataset.citycode;
    var type = e.currentTarget.dataset.type;
    var citys = e.currentTarget.dataset.citys;
    if(type == 1){
      that.setData({
        ktCity: citys+'-'+city,
        Ncity:citys,
        countyCode: countyCode,
        citysShow: 'none',
        countyShow: 'none',
        display: 'none',
        Scity: '请选择',
      })
      wx.setStorageSync('startCode', countyCode)
      // 获取四级
      wx.request({
        url: config.service.host + '/rest/cj/sbServiceLine/getDepPoints',
        data: { depAreaCode: countyCode },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'GET',
        success: function (res) {
          if( res.data.code == 0){
              var citys = res.data.data;
              that.setData({
                gtransitlist: citys,        
                fourShow: 'block'
              })
              wx.showModal({
                title: '提示',
                content: '系统已为您找到合适的出发地点，\r\n请选择出发地点；\r\n若没有合适的出发地点，您可以输入您要去的位置（提示：需要收取额外的费用）',
                showCancel: false,//是否显示取消按钮
                cancelText: "否",//默认是“取消”
                cancelColor: 'black',//取消文字的颜色
                confirmText: "我知道了",//默认是“确定”
                confirmColor: 'skyblue',//确定文字的颜色
                success: function (data) {
                  // console.log(data)
                },
              })
          }else if(res.data.code == 1){
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 3000
            })
          }
        }
      })
    }else if(type == 2){
      var serviceLineId = e.currentTarget.dataset.id;
      wx.setStorageSync("serviceLineId",serviceLineId);
      that.setData({
        mdCity: citys + '-' + city,
        Ncitys: citys,
        citysShow:'none',
        countyShow1: 'none',
        display: 'none'
      })
      // 获取四级
      wx.request({  
        url: config.service.host + '/rest/cj/sbServiceLine/getDestPoints',
        data: { 
          depAreaCode: wx.getStorageSync('startCode') ,
          depPointId: wx.getStorageSync('pointid') ,
          destAreaCode: countyCode,
          // serviceLineId:
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'GET',
        success: function (res) {
          if (res.data.code == 0) {
            var citys = res.data.data.points;
            var serviceLineId = res.data.data.serviceLineId;
            that.setData({
              lineId: serviceLineId,
            })
            if (citys.length < 1 ){
              wx.setStorageSync('serviceLineId', serviceLineId)
              wx.showModal({
                title: '提示',
                content: '暂未开通具体的站点，请自己选择目的地',
                showCancel: false,//是否显示取消按钮
                cancelText: "否",//默认是“取消”
                cancelColor: 'black',//取消文字的颜色
                confirmText: "我知道了",//默认是“确定”
                confirmColor: 'skyblue',//确定文字的颜色
                success: function (data) {
                  // console.log(data)
                },
              })
              that.setData({
                fourShow:'none',
              })
            }else{
              wx.setStorageSync('serviceLineId', citys.serviceLineId)
              that.setData({
                gtransitlist: citys,
                fourShow: 'block'
              })
              wx.showModal({
                title: '提示',
                content: '系统已为您找到合适的目的地点，\r\n请选择目的地点；\r\n若没有合适的目的地点，您可以输入您要去的位置（提示：需要收取额外的费用）',
                showCancel: false,//是否显示取消按钮
                cancelText: "否",//默认是“取消”
                cancelColor: 'black',//取消文字的颜色
                confirmText: "我知道了",//默认是“确定”
                confirmColor: 'skyblue',//确定文字的颜色
                success: function (data) {
                  // console.log(data)
                },
              })
             
            } 
          } else if (res.data.code == 1) {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 3000
            })
          }
        }
      })
    }
  },
  typeCodeSel: function (e) {
    //获取自定义的ID值 
    var type = e.currentTarget.dataset.type;
    if( type==1){
      var id = e.currentTarget.dataset.id; 
      var myAddress = e.currentTarget.dataset.address;
      var startLat = e.currentTarget.dataset.lat;
      var startLng = e.currentTarget.dataset.lng;
      var pointid = e.currentTarget.dataset.pointid;
      wx.setStorageSync('myAddress', myAddress);
      wx.setStorageSync('startLat', startLat);
      wx.setStorageSync('startLng', startLng);
      wx.setStorageSync('pointid', pointid);
      this.setData({
        one: id,
        myAddress: myAddress
      })
    }else{
      var id = e.currentTarget.dataset.id; 
      var endAddress = e.currentTarget.dataset.address;
      var endLat = e.currentTarget.dataset.lat;
      var endLng = e.currentTarget.dataset.lng;
      var servicelineid = e.currentTarget.dataset.servicelineid;
      wx.setStorageSync('endAddress', endAddress);
      wx.setStorageSync('endLat', endLat);
      wx.setStorageSync('endLng', endLng);
      wx.setStorageSync('serviceLineId', servicelineid); 
      this.setData({
        one: id,
        myAddress1: endAddress
      })
    }
  },
  // // 抽屉层显示
  getLocations: function (e) {
    var that = this;
    var po = e.currentTarget.dataset.po;
    var cityName = e.currentTarget.dataset.cityn;
    // var city = e.currentTarget.dataset.ncitys;
    wx.setStorageSync('po', po);
    wx.setStorageSync('cityName', cityName);
    
    if (cityName === "请选择") {
      wx.showToast({
        title: '请选择城市',
        duration: 2000,
        mask: true,//是否显示透明蒙层，防止触摸穿透，默认：false 
      })
      that.setData({
        showModalStatus: false
      })
    } else {
      var addList = [];
      qqmapsdk.getSuggestion({
        keyword: cityName,
        success: function (res) {
          var cityData = res.data;
          for (let i = 0; i < cityData.length; i++) {
            var temp = {};
            temp.title = cityData[i].title;
            temp.address = cityData[i].address;
            temp.lat = cityData[i].location.lat;
            temp.lng = cityData[i].location.lng;
            temp.index = i;
            addList.push(temp);
          }
          // 渲染列表  
          that.setData({
            addList: addList,
            showModalStatus: true

          })
        },
        fail: function (res) {
          console.log(res);
        },
        complete: function (res) {
          console.log(res);
        }
      });

    }
    
    
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      maphide: true,
      tiphide: true

    })
    // if (e.currentTarget.dataset.status == 1) {
    //   this.setData({
    //     showModalStatus: true
    //   });
    // }
    wx.setNavigationBarTitle({
      title: '地址选择',
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)
  },
  // 显示搜索
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  // 取消
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  // 清除内容
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  // input输入内容
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value,
    });
    var that = this;
    var inputVals = e.detail.value;
    var addList = [];
    qqmapsdk.getSuggestion({
      keyword: inputVals,
      success: function (res) {
        var cityData = res.data;
        for (let i = 0; i < cityData.length; i++) {
          var temp = {};
          temp.title = cityData[i].title;
          temp.address = cityData[i].address;
          temp.lat = cityData[i].location.lat;
          temp.lng = cityData[i].location.lng;
          temp.index = i;
          addList.push(temp);
        }
        // 渲染列表  
        that.setData({
          addList: addList
        })
      },
      fail: function (res) {
        // console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },
  chooseCitys:function(e){
    var type = e.currentTarget.dataset.p;
    var that= this;
    that.setData({
      citynshow:'block'
    })
    if( type=='0'){
      var selcity = e.currentTarget.dataset.selcity;
      if(that.data.endCity==undefined||that.data.endCity==''){
        wx.request({
          url: app.globalData.url + '/api/station/queryStartCityList',
          method: "POST",
          data: {
            endCity: ''
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            wx.setStorageSync('startCity1', res.data.result)
            that.setData({
              startCitys: res.data.result,
              typs:0,
            })
          }
        })
      }else{
        wx.request({
          url: app.globalData.url + '/api/station/queryStartCityList',
          method: "POST",
          data: {
            endCity: that.data.endCity
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            wx.setStorageSync('startCity1', res.data.result)
            that.setData({
              startCitys: res.data.result,
              typs:0,
            })
          }
        })
      }
    }else{
      var selcity = wx.getStorageSync('cityN');
      if(that.data.startCity==undefined||that.data.startCity==''){
        wx.request({
          url: app.globalData.url + '/api/station/queryEndCityList',
          method: "POST",
          data: {
            startCity: ''
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            that.setData({
              startCitys: res.data.result,
              typs:1
            })
          }
        })
      }else{
        wx.request({
          url: app.globalData.url + '/api/station/queryEndCityList',
          method: "POST",
          data: {
            startCity: that.data.startCity
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            that.setData({
              startCitys: res.data.result,
              typs:1
            })
          }
        })
      } 
    }
  },
  backCityTap:function(){
    let that=this
    that.setData({
      citynshow: 'none'
    })
  },
  backDateTap:function(){
    let that=this
    that.setData({
      dateshow: 'none'
    })
  },
  checkCity: function (e) {
    var that = this;
    var typs = e.currentTarget.dataset.typs
    var cityName = e.currentTarget.dataset.address;
    wx.setStorageSync('cityN', cityName)
    if (typs =="0"){
      that.setData({
        startCity: e.currentTarget.dataset.address,
        citynshow: 'none',
      })
    }else{
      that.setData({
        endCity: e.currentTarget.dataset.address,
        citynshow: 'none'
      })
    }
    wx.setStorageSync('cityName', cityName);
  },
  getListTap:function(){
    let that=this
    that.setData({
      userId: wx.getStorageSync('userId')
    })
    if(that.data.userId==''||that.data.userId==undefined){
      wx.request({
        url: app.globalData.url+'/api/user/wechatAuth',
        method:'POST',
        data:{
          openId: wx.getStorageSync('openId')
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success:function(res){
          if(res.data.code==0){
            wx.setStorageSync('userId', res.data.data.id)
            that.validate()
            if(that.data.validatetrue){
              if(that.data.time==''||that.data.time==undefined||that.data.time=='请选择出发时间'){
                wx.showToast({
                  title: '请选择出发时间',
                })
              }else{
                wx.redirectTo({
                  url: '../buyTicket/index?startStation='+that.data.startCity+'&endStation='+that.data.endCity+'&queryDate='+that.data.time+'&myAddress='+that.data.myAddress+'&myAddress1='+that.data.myAddress1,
                })
              }
            }
          }else if(res.data.code==1){
            wx.showToast({
              title: res.data.message,
            })
            wx.redirectTo({
              url: '../login/index',
            })
          }
        }
      })
    }else{
      that.validate()
      if(that.data.validatetrue){
        if(that.data.time==''||that.data.time==undefined||that.data.time=='请选择出发时间'){
          wx.showToast({
            title: '请选择出发时间',
          })
        }else{
          wx.redirectTo({
            url: '../buyTicket/index?startStation='+that.data.startCity+'&endStation='+that.data.endCity+'&queryDate='+that.data.time+'&myAddress='+that.data.myAddress+'&myAddress1='+that.data.myAddress1,
          })
        }
      }
    }
  },
// 选择日期校验
  validate:function(){
    let that=this
    if(that.data.startCity==''||that.data.startCity=='请选择'||that.data.startCity==undefined){
      wx.showToast({
        title: '请选择出发城市',
      })
      that.setData({
        validatetrue: false
      })
    }else if(that.data.endCity==''||that.data.endCity=='请选择'||that.data.startCity==undefined ){
      wx.showToast({
        title: '请选择目的地城市',
      })
      that.setData({
        validatetrue: false
      })
    }else if(that.data.myAddress==''){
      wx.showToast({
        title: '请选择上车地点',
      })
      that.setData({
        validatetrue: false
      })
    } else if(that.data.myAddress1==''){
      wx.showToast({
        title: '请选择下车地点',
      })
      that.setData({
        validatetrue: false
      })
    }else{
      that.setData({
        validatetrue: true
      })
    }
  },
// 选择日期
  times: function () {
    var that = this;
    that.validate()
    if(that.data.validatetrue==true){
      that.setData({
        dateshow: 'block'
      })
    }
  },
  goServiceTap:function(e){
    wx.redirectTo({
      url: '../airService/index?service='+e.currentTarget.dataset.service,
    })
  },
  onShow: function() {
    let that=this
    initCalendar({
      // multi: true, // 是否开启多选,
      disablePastDay: true, // 是否禁选过去日期
      // defaultDay: '2018-8-8', // 初始化日历时指定默认选中日期，如：'2018-3-6' 或 '2018-03-06'
      /**
       * 选择日期后执行的事件
       * @param { object } currentSelect 当前点击的日期
       * @param { array } allSelectedDays 选择的所有日期（当mulit为true时，才有allSelectedDays参数）
       */
      afterTapDay: (currentSelect, allSelectedDays) => {
        console.log('当前点击的日期', currentSelect);
        let monLen=currentSelect.month.toString().length
        let dayLen=currentSelect.day.toString().length
        if(monLen==1){
          that.setData({
            month: '0'+currentSelect.month
          })
        }else{
          that.setData({
            month: currentSelect.month
          })
        }
        if(dayLen==1){
          that.setData({
            day: '0'+currentSelect.day
          })
        }else{
          that.setData({
            day: currentSelect.day
          })
        }
        that.setData({
          time: currentSelect.year+'-'+that.data.month+'-'+that.data.day,
          dateshow: 'none'
        })
        console.log(that.data.time)
        // allSelectedDays && console.log('选择的所有日期', allSelectedDays);
        // console.log('getSelectedDay方法', getSelectedDay());
      },
      whenChangeMonth(current, next) {
        // console.log(current);
        // console.log(next);
      },
      /**
       * 日期点击事件（此事件会完全接管点击事件）
       * @param { object } currentSelect 当前点击的日期
       * @param { object } event 日期点击事件对象
       */
      // onTapDay(currentSelect, event) {
      //   console.log(currentSelect);
      //   console.log(event);
      // },
      /**
       * 日历初次渲染完成后触发事件，如设置事件标记
       */
      afterCalendarRender(ctx) {
        const data = [
          {
            year: '2019',
            month: '3',
            day: '15'
          },
          {
            year: 2019,
            month: 3,
            day: 18,
            todoText: '待办'
          }
        ];
        // 异步请求
        setTimeout(() => {
          setTodoLabels({
            circle: true,
            days: data
          });
        }, 1000);
        // enableArea(['2018-10-7', '2018-10-28']);
      }
    });
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

function Height(that) {
  var windowHeight;
  wx.getSystemInfo({
      success: function(res) {
          windowHeight = res.windowHeight
      }
  })
  var query = wx.createSelectorQuery();
  query.select('.head').boundingClientRect();
  query.select('.pagetop').boundingClientRect();
  query.selectViewport().scrollOffset();
  query.exec((res) => {
      var head = res[0].height;
      var pagecon = res[1].height;
      var mapHeight = windowHeight - head - pagecon;
      wx.setStorageSync('mapHeight', mapHeight)
      that.setData({
          mapHeight: mapHeight,
      })
  });
}