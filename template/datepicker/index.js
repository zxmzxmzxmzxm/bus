function t(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
}

function e(t) {
    var e = this.data.gesture, a = e.startX, i = e.startY;
    if (this.slideLock) {
        var r = t.touches[0], s = r.clientX - a, c = r.clientY - i;
        return s < -60 && c < 20 && c > -20 && (this.slideLock = !1, !0);
    }
}

function a(t) {
    var e = this.data.gesture, a = e.startX, i = e.startY;
    if (this.slideLock) {
        var r = t.touches[0], s = r.clientX - a, c = r.clientY - i;
        return s > 60 && c < 20 && c > -20 && (this.slideLock = !1, !0);
    }
}

function i() {
    var t = getCurrentPages();
    return t[t.length - 1];
}

Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.isUpSlide = function(t) {
    var e = this.data.gesture, a = e.startX, i = e.startY;
    if (this.slideLock) {
        var r = t.touches[0], s = r.clientX - a;
        return r.clientY - i < -60 && s < 20 && s > -20 && (this.slideLock = !1, !0);
    }
}, exports.isDownSlide = function(t) {
    var e = this.data.gesture, a = e.startX, i = e.startY;
    if (this.slideLock) {
        var r = t.touches[0], s = r.clientX - a;
        return r.clientY - i > 60 && s < 20 && s > -20 && (this.slideLock = !1, !0);
    }
}, exports.isLeftSlide = e, exports.isRightSlide = a;

var r = {
    getThisMonthDays: function(t, e) {
        return new Date(t, e, 0).getDate();
    },
    getFirstDayOfWeek: function(t, e) {
        return new Date(Date.UTC(t, e - 1, 1)).getDay();
    },
    calculateEmptyGrids: function(t, e) {
        r.calculatePrevMonthGrids.call(this, t, e), r.calculateNextMonthGrids.call(this, t, e);
    },
    calculatePrevMonthGrids: function(t, e) {
        var a = r.getThisMonthDays(t, e - 1), i = r.getFirstDayOfWeek(t, e), s = [];
        if (i > 0) {
            for (var c = a - i, n = a; n > c; n--) s.push(n);
            this.setData({
                "datepicker.empytGrids": s.reverse()
            });
        } else this.setData({
            "datepicker.empytGrids": null
        });
    },
    calculateNextMonthGrids: function(t, e) {
        var a = r.getThisMonthDays(t, e), i = new Date(t + "-" + e + "-" + a).getDay(), s = [];
        if (6 != +i) {
            for (var c = 7 - (i + 1), n = 1; n <= c; n++) s.push(n);
            this.setData({
                "datepicker.lastEmptyGrids": s
            });
        } else this.setData({
            "datepicker.lastEmptyGrids": null
        });
    },
    calculateDays: function(t, e, a) {
        var i = this, s = this.data.datepicker, c = s.todayTimestamp, n = s.fifTeenDays, o = [], d = void 0, l = void 0, h = void 0, u = r.getThisMonthDays(t, e), p = this.data.datepicker.selectedDay;
        p && p.length && (d = p[0].day, l = p[0].month, h = p[0].year);
        for (var f = void 0, y = 1; y <= u; y++) y === a && (f = t + "-" + e + "-" + y), 
        o.push({
            day: y,
            choosed: a ? y === a : t === h && e === l && y === d,
            year: t,
            month: e,
            fullDate: t + "-" + e + "-" + y
        });
        o.map(function(t) {
            var e = new Date(t.year + "-" + t.month + "-" + t.day).getTime();
            i.config.disablePastDay && e - c < 0 && (t.disable = !0), n.indexOf(t.year + "-" + t.month + "-" + t.day) > -1 || (t.disable = !0);
        });
        var D = {
            "datepicker.days": o,
            "datepicker.currentDay": f
        };
        a && (D["datepicker.selectedDay"] = [ {
            day: a,
            choosed: !0,
            year: t,
            month: e
        } ]), this.setData(D);
    },
    jumpToToday: function() {
        var t = new Date(), e = t.getFullYear(), a = t.getMonth() + 1, i = t.getDate();
        r.renderCalendar.call(this, e, a, i);
    },
    renderCalendar: function(t, e, a) {
        var i = new Date(t + "-" + e + "-" + a).getTime();
        this.setData({
            "datepicker.curYear": t,
            "datepicker.curMonth": e,
            "datepicker.todayTimestamp": i
        }), r.calculateEmptyGrids.call(this, t, e), r.calculateDays.call(this, t, e, a);
    },
    init: function(t, e, a) {
        var s = i(), c = [ "日", "一", "二", "三", "四", "五", "六" ];
        if (s.setData({
            "datepicker.weeksCh": c,
            "datepicker.showDatePicker": !0
        }), !t && !e && !a) return r.jumpToToday.call(s);
        r.renderCalendar.call(s, t, e, a);
    },
    showDatepicker: function(t) {
        var e = t.detail.value;
        if (e && "string" == typeof e) {
            var a = e.split("-");
            r.init(+a[0], +a[1], +a[2]);
        } else r.init();
    },
    onInputDate: function(t) {
        var e = i();
        this.inputTimer && clearTimeout(this.inputTimer), this.inputTimer = setTimeout(function() {
            var a = t.detail.value, i = a && a.split("-") || [], s = /^\d{4}$/, c = /^(([0]?[1-9])|([1][0-2]))$/, n = /^(([0]?[1-9])|([1-2][0-9])|(3[0-1]))$/;
            i && 3 === i.length && s.test(i[0]) && c.test(i[1]) && n.test(i[2]) && r.renderCalendar.call(e, +i[0], +i[1], +i[2]);
        }, 500);
    },
    choosePrevMonth: function() {
        var t = this.data.datepicker, e = t.curYear, a = t.curMonth - 1, i = e;
        a < 1 && (i = e - 1, a = 12), r.calculateDays.call(this, i, a), r.calculateEmptyGrids.call(this, i, a), 
        this.setData({
            "datepicker.curYear": i,
            "datepicker.curMonth": a
        });
    },
    chooseNextMonth: function() {
        var t = this.data.datepicker, e = t.curYear, a = t.curMonth + 1, i = e;
        a > 12 && (i = e + 1, a = 1), r.calculateDays.call(this, i, a), r.calculateEmptyGrids.call(this, i, a), 
        this.setData({
            "datepicker.curYear": i,
            "datepicker.curMonth": a
        });
    },
    handleCalendar: function(t) {
        "prev" === t.currentTarget.dataset.handle ? r.choosePrevMonth.call(this) : r.chooseNextMonth.call(this);
    },
    tapDayItem: function(e) {
        var a = e.currentTarget.dataset, i = a.idx;
        if (!a.disable) {
            var r = this.config, s = r.afterTapDay, c = r.onTapDay, n = this.data.datepicker, o = n.curYear, d = n.curMonth, l = n.days, h = "datepicker.days[" + i + "].choosed", u = o + "-" + d + "-" + l[i].day;
            if ("timearea" === this.config.type) {
                if (c && "function" == typeof c) return void r.onTapDay(this.data.datepicker.days[i], e);
                this.setData(t({}, h, !l[i].choosed));
            } else if ("normal" === this.config.type && !l[i].choosed) {
                var p, f = l.filter(function(t) {
                    return t.choosed;
                })[0], y = f && "datepicker.days[" + (f.day - 1) + "].choosed";
                if (c && "function" == typeof c) return void r.onTapDay(l[i], e);
                var D = (p = {}, t(p, h, !0), t(p, "datepicker.selectedValue", u), t(p, "datepicker.selectedDay", [ l[i] ]), 
                p);
                y && (D[y] = !1), this.setData(D);
            }
            s && "function" == typeof s && r.afterTapDay(l[i]);
        }
    },
    closeDatePicker: function() {
        this.setData({
            "datepicker.showDatePicker": !1
        });
    },
    datepickerTouchstart: function(t) {
        var e = t.touches[0], a = e.clientX, i = e.clientY;
        this.slideLock = !0, this.setData({
            "gesture.startX": a,
            "gesture.startY": i
        });
    },
    datepickerTouchmove: function(t) {
        e.call(this, t) && r.chooseNextMonth.call(this), a.call(this, t) && r.choosePrevMonth.call(this);
    }
};

exports.jumpToToday = function() {
    var t = i();
    r.jumpToToday.call(t);
};

exports.default = function() {
    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, e = i();
    t.type || (t.type = "normal"), e.config = t, e.setData({
        datepicker: {
            showDatePicker: !1,
            showInput: !0 === t.showInput || void 0 === t.showInput,
            placeholder: t.placeholder || "请选择日期",
            fifTeenDays: t.fifTeenDays
        }
    }), e.datepickerTouchstart = r.datepickerTouchstart.bind(e), e.datepickerTouchmove = r.datepickerTouchmove.bind(e), 
    e.showDatepicker = r.showDatepicker.bind(e), e.onInputDate = r.onInputDate.bind(e), 
    e.closeDatePicker = r.closeDatePicker.bind(e), e.tapDayItem = r.tapDayItem.bind(e), 
    e.handleCalendar = r.handleCalendar.bind(e);
};

exports.getSelectedDay = function() {
    return i().data.datepicker.selectedDay;
};