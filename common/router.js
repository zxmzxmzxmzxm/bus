module.exports = {
    navigateTo: function(t) {
        getCurrentPages().length > 9 ? this.redirectTo(t) : wx.navigateTo(t);
    },
    navigateBack: function(t) {
        wx.navigateBack(t);
    },
    switchTab: function(t) {
        wx.switchTab(t);
    },
    redirectTo: function(t) {
        wx.redirectTo(t);
    },
    reLaunch: function(t) {
        wx.reLaunch(t);
    }
};