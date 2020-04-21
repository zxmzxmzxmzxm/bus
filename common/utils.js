Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.currentDate = function() {
    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "-", e = new Date(), r = e.getFullYear(), n = e.getMonth() + 1, o = e.getDate();
    return n < 10 && (n = "0" + n), o < 10 && (o = "0" + o), "" + r + t + n + t + o;
}, exports.timeToDate = function(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "-", r = new Date(t);
    return "" + r.getFullYear() + e + (r.getMonth() + 1) + e + r.getDate();
}, exports.timeToDate2 = function(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "-", r = new Date(t), n = r.getFullYear(), o = r.getMonth() + 1;
    o = o < 10 ? "0" + o : o;
    var a = r.getDate();
    return a = a < 10 ? "0" + a : a, "" + n + e + o + e + a;
}, exports.timeToDate3 = function(t) {
    var e = new Date(t), r = e.getFullYear(), n = e.getMonth() + 1;
    n = n < 10 ? "0" + n : n;
    var o = e.getDate();
    o = o < 10 ? "0" + o : o;
    var a = e.getHours();
    a = a < 10 ? "0" + a : a;
    var g = e.getMinutes();
    g = g < 10 ? "0" + g : g;
    var u = e.getSeconds();
    return u = u < 10 ? "0" + u : u, r + "年" + n + "月" + o + "日 " + a + ":" + g;
}, exports.timeToDate4 = function(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : ".", r = new Date(t), n = r.getFullYear(), o = r.getMonth() + 1;
    o = o < 10 ? "0" + o : o;
    var a = r.getDate();
    a = a < 10 ? "0" + a : a;
    var g = r.getHours();
    g = g < 10 ? "0" + g : g;
    var u = r.getMinutes();
    u = u < 10 ? "0" + u : u;
    var i = r.getSeconds();
    return i = i < 10 ? "0" + i : i, "" + n + e + o + e + a + " " + g + ":" + u + ":" + i;
}, exports.timeSecondsToHourAndMinnte = function(t) {
    var e, r;
    return e = parseInt(t / 3600), r = parseInt(60 * (t / 3600 - e)), e = e < 10 ? "0" + e : e, 
    r = r < 10 ? "0" + r : r, e + "时" + r + "分";
}, exports.timeToHM = function(t, e) {
    if ("string" == typeof t) return t.split(" ")[1];
    var r = new Date(t), n = r.getHours(), o = r.getMinutes();
    return e && (n < 10 && (n = "0" + n), o < 10 && (o = "0" + o)), n + ":" + o;
}, exports.formatSelectDate = function(t, e) {
    for (var r, n, o = [], a = [], g = [], u = {
        arr: [],
        leftHours: [],
        leftMinutes: []
    }, i = 0; i < 15; i++) {
        var s = new Date();
        s.setDate(s.getDate() + i);
        var l = s.getFullYear(), v = s.getMonth() + 1, f = s.getDate();
        v = 1 == v.toString().length ? "0" + v : v, f = 1 == f.toString().length ? "0" + f : f;
        var D = 0 == i ? "今天" : l.toString() + "-" + v.toString() + "-" + f.toString();
        o[i] = D;
    }
    if (t) {
        var c = new Date();
        r = c.getHours(), n = e ? c.getMinutes() : 0;
    } else r = 0, n = 0;
    for (p = 0; p < 24; p++) if (r <= p) {
        var h = 1 == p.toString().length ? "0" + p + "点" : p + "点";
        a.push(h);
    }
    for (var p = 0; p < 60; p++) if (n <= p) {
        var M = 1 == p.toString().length ? "0" + p + "分" : p + "分";
        g.push(M);
    }
    return console.log(a), console.log(g), u.arr = o, u.leftHours = a, u.leftMinutes = g, 
    u;
};