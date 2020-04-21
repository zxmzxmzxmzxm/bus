Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.transition = void 0;

var e = require("../common/utils"), t = function(e) {
    return {
        enter: "van-" + e + "-enter van-" + e + "-enter-active enter-class enter-active-class",
        "enter-to": "van-" + e + "-enter-to van-" + e + "-enter-active enter-to-class enter-active-class",
        leave: "van-" + e + "-leave van-" + e + "-leave-active leave-class leave-active-class",
        "leave-to": "van-" + e + "-leave-to van-" + e + "-leave-active leave-to-class leave-active-class"
    };
}, s = function() {
    return new Promise(function(e) {
        return setTimeout(e, 1e3 / 30);
    });
};

exports.transition = function(n) {
    return Behavior({
        properties: {
            customStyle: String,
            show: {
                type: Boolean,
                value: n,
                observer: "observeShow"
            },
            duration: {
                type: [ Number, Object ],
                value: 300,
                observer: "observeDuration"
            },
            name: {
                type: String,
                value: "fade",
                observer: "updateClasses"
            }
        },
        data: {
            type: "",
            inited: !1,
            display: !1,
            classNames: t("fade")
        },
        attached: function() {
            this.data.show && this.enter();
        },
        methods: {
            observeShow: function(e) {
                e ? this.enter() : this.leave();
            },
            updateClasses: function(e) {
                this.set({
                    classNames: t(e)
                });
            },
            enter: function() {
                var t = this, n = this.data, a = n.classNames, i = n.duration, r = (0, e.isObj)(i) ? i.leave : i;
                this.status = "enter", Promise.resolve().then(s).then(function() {
                    t.checkStatus("enter"), t.set({
                        inited: !0,
                        display: !0,
                        classes: a.enter,
                        currentDuration: r
                    });
                }).then(s).then(function() {
                    t.checkStatus("enter"), t.set({
                        classes: a["enter-to"]
                    });
                }).catch(function() {});
            },
            leave: function() {
                var t = this, n = this.data, a = n.classNames, i = n.duration, r = (0, e.isObj)(i) ? i.leave : i;
                this.status = "leave", Promise.resolve().then(s).then(function() {
                    t.checkStatus("leave"), t.set({
                        classes: a.leave,
                        currentDuration: r
                    });
                }).then(function() {
                    return setTimeout(function() {
                        return t.onTransitionEnd();
                    }, r);
                }).then(s).then(function() {
                    t.checkStatus("leave"), t.set({
                        classes: a["leave-to"]
                    });
                }).catch(function() {});
            },
            checkStatus: function(e) {
                if (e !== this.status) throw new Error("incongruent status: " + e);
            },
            onTransitionEnd: function() {
                this.data.show || (this.set({
                    display: !1
                }), this.$emit("transitionEnd"));
            }
        }
    });
};