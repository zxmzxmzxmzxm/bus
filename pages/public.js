//  要引用这个文件的函数或者变量，除了在要引用的的js文件中模块化之外（var utils=require('js地址')），
// 在被引用的的js中要通过 module.exports={a:a}作为面向对象的变量输出函数如下：
// 多个手机号中间几位*替换
// function withPhone(phoneArr) {
//     var arr = [];
//     phoneArr.forEach(o => arr.push(o.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')));
//     return arr;
// }
// let phoneArr = ['15669335699', '15669335699', '15669335699', '15669335699', '15669335699'];
// let newArr = withPhone(phoneArr);

// 字符串用*替代 （手机号，身份证号）
/** 
 * str       字符串
 * frontLen  前面保留位数
 * endLen    后面保留位数
 * **/
function plusXing(str, frontLen, endLen) {
    var len = str.length - frontLen - endLen;
    var xing = '';
    for (var i = 0; i < len; i++) {
        xing += '*';
    }
    return str.substr(0, frontLen) + xing + str.substr(str.length - endLen);
}

function checkDate(startTime, endTime) {
    //日期格式化
    var start_date = new Date(startTime.replace(/-/g, "/"));
    var end_date = new Date(endTime.replace(/-/g, "/"));
    //转成毫秒数，两个日期相减
    var days = end_date.getTime() - start_date.getTime();
    //转换成天数
    var day = parseInt(days / (1000 * 60 * 60 * 24));
    //do something
    console.log("day = ", day);
}
// 获取系统时间
const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    // const second = date.getSeconds()
    // return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}
// 时间相差天数
//发布时间
// var timefb = '2018-12-12 9:40';
// //获取系统时间
// // 调用函数时，传入new Date()参数，返回值是日期和时间
// var timext = pubilc.formatTime(new Date());
// console.log( timext)
// var days = pubilc.checkDate(timefb, timext);
// console.log(days)
// var that = this;
// console.log(that.data)

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}
// 日期选择器
function withData(param) {
    return param < 10 ? '0' + param : '' + param;
}

function getLoopArray(start, end) {
    var start = start || 0;
    var end = end || 1;
    var array = [];
    for (var i = start; i <= end; i++) {
        array.push(withData(i));
    }
    return array;
}

function getMonthDay(year, month) {
    var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0),
        array = null;

    switch (month) {
        case '01':
        case '03':
        case '05':
        case '07':
        case '08':
        case '10':
        case '12':
            array = getLoopArray(1, 31)
            break;
        case '04':
        case '06':
        case '09':
        case '11':
            array = getLoopArray(1, 30)
            break;
        case '02':
            array = flag ? getLoopArray(1, 29) : getLoopArray(1, 28)
            break;
        default:
            array = '月份格式不正确，请重新输入！'
    }
    return array;
}

function getNewDateArry() {
    // 当前时间的处理
    var newDate = new Date();
    var year = withData(newDate.getFullYear()),
        mont = withData(newDate.getMonth() + 1),
        date = withData(newDate.getDate()),
        hour = withData(newDate.getHours()),
        minu = withData(newDate.getMinutes()),
        seco = withData(newDate.getSeconds());

    return [year, mont, date, hour, minu, seco];
}

function dateTimePicker(startYear, endYear, date) {
    // 返回默认显示的数组和联动数组的声明
    var dateTime = [],
        dateTimeArray = [
            [],
            [],
            [],
            [],
            [],
            []
        ];
    var start = startYear || 1978;
    var end = endYear || 2100;
    // 默认开始显示数据
    var defaultDate = date ? [...date.split(' ')[0].split('-'), ...date.split(' ')[1].split(':')] : getNewDateArry();
    // 处理联动列表数据
    /*年月日 时分秒*/
    dateTimeArray[0] = getLoopArray(start, end);
    dateTimeArray[1] = getLoopArray(1, 12);
    dateTimeArray[2] = getMonthDay(defaultDate[0], defaultDate[1]);
    dateTimeArray[3] = getLoopArray(0, 23);
    dateTimeArray[4] = getLoopArray(0, 59);
    dateTimeArray[5] = getLoopArray(0, 59);

    dateTimeArray.forEach((current, index) => {
        dateTime.push(current.indexOf(defaultDate[index]));
    });

    return {
        dateTimeArray: dateTimeArray,
        dateTime: dateTime
    }
}

function pickerTap() {
    // pickerTap: function () {
    date = new Date();

    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    // 月-日
    for (var i = 2; i <= 28; i++) {
        var date1 = new Date(date);
        date1.setDate(date.getDate() + i);
        var md = (date1.getMonth() + 1) + "-" + date1.getDate();
        monthDay.push(md);
    }

    var data = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
    };
    console.log(data.multiIndex)
    if (data.multiIndex[0] === 0) {
        if (data.multiIndex[1] === 0) {
            this.loadData(hours, minute);
        } else {
            this.loadMinute(hours, minute);
        }
    } else {
        this.loadHoursMinute(hours, minute);
    }

    data.multiArray[0] = monthDay;
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;

    this.setData(data);
}

function bindMultiPickerColumnChange(e) {
    // bindMultiPickerColumnChange: function (e) {
    date = new Date();

    var that = this;

    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    var data = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
    };
    // 把选择的对应值赋值给 multiIndex
    data.multiIndex[e.detail.column] = e.detail.value;

    // 然后再判断当前改变的是哪一列,如果是第1列改变
    if (e.detail.column === 0) {
        // 如果第一列滚动到第一行
        if (e.detail.value === 0) {

            that.loadData(hours, minute);

        } else {
            that.loadHoursMinute(hours, minute);
        }

        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;

        // 如果是第2列改变
    } else if (e.detail.column === 1) {

        // 如果第一列为今天
        if (data.multiIndex[0] === 0) {
            if (e.detail.value === 0) {
                that.loadData(hours, minute);
            } else {
                that.loadMinute(hours, minute);
            }
            // 第一列不为今天
        } else {
            that.loadHoursMinute(hours, minute);
        }
        data.multiIndex[2] = 0;

        // 如果是第3列改变
    } else {
        // 如果第一列为'今天'
        if (data.multiIndex[0] === 0) {

            // 如果第一列为 '今天'并且第二列为当前时间
            if (data.multiIndex[1] === 0) {
                that.loadData(hours, minute);
            } else {
                that.loadMinute(hours, minute);
            }
        } else {
            that.loadHoursMinute(hours, minute);
        }
    }
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;
    this.setData(data);
}

function loadData(hours, minute) {

    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
        minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
        minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
        minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
        minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
        minuteIndex = 50;
    } else {
        minuteIndex = 60;
    }

    if (minuteIndex == 60) {
        // 时
        for (var i = currentHours + 1; i < 24; i++) {
            hours.push(i);
        }
        // 分
        for (var i = 0; i < 60; i += 10) {
            minute.push(i);
        }
    } else {
        // 时
        for (var i = currentHours; i < 24; i++) {
            hours.push(i);
        }
        // 分
        for (var i = minuteIndex; i < 60; i += 10) {
            minute.push(i);
        }
    }
}

function loadHoursMinute(hours, minute) {
    // 时
    for (var i = 0; i < 24; i++) {
        hours.push(i);
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
        minute.push(i);
    }
}

function loadMinute(hours, minute) {
    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
        minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
        minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
        minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
        minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
        minuteIndex = 50;
    } else {
        minuteIndex = 60;
    }

    if (minuteIndex == 60) {
        // 时
        for (var i = currentHours + 1; i < 24; i++) {
            hours.push(i);
        }
    } else {
        // 时
        for (var i = currentHours; i < 24; i++) {
            hours.push(i);
        }
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
        minute.push(i);
    }
}

function bindStartMultiPickerChange(e) {
    var that = this;
    var monthDay = that.data.multiArray[0][e.detail.value[0]];
    var hours = that.data.multiArray[1][e.detail.value[1]];
    var minute = that.data.multiArray[2][e.detail.value[2]];

    if (monthDay === "今天") {
        var month = date.getMonth() + 1;
        var day = date.getDate();
        monthDay = month + "月" + day + "日";
    } else if (monthDay === "明天") {
        var date1 = new Date(date);
        date1.setDate(date.getDate() + 1);
        monthDay = (date1.getMonth() + 1) + "月" + date1.getDate() + "日";

    } else {
        var month = monthDay.split("-")[0]; // 返回月
        var day = monthDay.split("-")[1]; // 返回日
        monthDay = month + "月" + day + "日";
    }

    var startDate = monthDay + " " + hours + ":" + minute;
    console.log(startDate)
    that.setData({
        startDate: startDate
    })
}

module.exports = {
    // withPhone: withPhone,
    plusXing: plusXing,
    formatTime: formatTime,
    dateTimePicker: dateTimePicker,
    getMonthDay: getMonthDay,

}


// 展示进度条的网络请求
// url:网络请求的url
// params:请求参数
// message:进度条的提示信息
// success:成功的回调函数
// fail：失败的回调
function requestLoading(url, params, message, success, fail) {
    console.log(params)
    wx.showLoading({
        title: message,
    })
    wx.request({
        url: url,
        data: params,
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        success: function(res) {
            //console.log(res.data)
            wx.hideLoading()
            if (res.statusCode == 200) {
                success(res.data)
            } else {
                fail()
            }

        },
        fail: function(res) {
            wx.hideLoading()
            fail()
        },
        complete: function(res) {

        },
    })
}