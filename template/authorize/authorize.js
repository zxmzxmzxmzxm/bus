var e = getApp();

Component({
    properties: {
        authorize: {
            type: Boolean,
            value: !1
        },
        url: {
            type: String,
            value: ""
        }
    },
    data: {
        authorize: !1,
        url: ""
    },
    methods: {
        getUserInfo: function(a) {
            var t = this;
            wx.getSetting({
                success: function(o) {
                    o.authSetting["scope.userInfo"] ? wx.getUserInfo({
                        success: function(o) {
                            wx.setStorage({
                                key: "wx_encryptedData",
                                data: a.detail.encryptedData
                            }), wx.setStorage({
                                key: "wx_iv",
                                data: a.detail.iv
                            }), wx.login({
                                success: function(o) {
                                    wx.request({
                                        url: e.globalData.requestUrl + "/passenger/api/v1/getUnionid",
                                        method: "POST",
                                        header: {
                                            "content-type": "application/json",
                                            header_token: "",
                                            header_lng: "",
                                            header_lat: "",
                                            header_source: "WX_XCX",
                                            header_version: "1.0"
                                        },
                                        data: {
                                            encryptedData: a.detail.encryptedData,
                                            xcxCode: o.code,
                                            xcxIv: a.detail.iv
                                        },
                                        success: function(e) {
                                            "SUCCESS" == e.data.code ? (wx.setStorage({
                                                key: "header_token",
                                                data: e.data.data.unionId
                                            }), wx.setStorage({
                                                key: "wx_unionId",
                                                data: e.data.data.unionId
                                            }), wx.setStorage({
                                                key: "openId",
                                                data: e.data.data.openId
                                            }), t.setData({
                                                authorize: !1
                                            }), wx.showTabBar(), wx.setStorageSync("authorize", "authorized"), t.data.url && wx.reLaunch({
                                                url: "/" + url
                                            })) : wx.showToast({
                                                title: e.data.error
                                            });
                                        }
                                    });
                                }
                            }), t.setData({
                                isshouquan: !0
                            });
                        }
                    }) : (t.setData({
                        authorize: !0
                    }), wx.hideTabBar());
                },
                fail: function(e) {
                    t.setData({
                        authorize: !1
                    });
                }
            });
        }
    }
});