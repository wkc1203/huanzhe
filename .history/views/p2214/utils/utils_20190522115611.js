import fetch from '../utils/fetch';
const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export function jsonToQueryString(json) {
  if (!!json) {
    return Object.keys(json).map((key) => {
      if (json[key] instanceof Array) {
        return Object.keys(json[key]).map((k) => {
          return `${encodeURIComponent(key)}=${encodeURIComponent(json[key][k])}`;
        }).join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`;
    }).join('&');
  }
  return '';
}

export function toFixed(digital, num) {

}
export function timestampFordate(timeStamp, type = 'Y-M-D H:I:S', auto = false){
  let time = (timeStamp + '').length === 10 ? new Date(parseInt(timeStamp) * 1000) : new Date(parseInt(timeStamp));
  let _year = time.getFullYear();
  let _month = (time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1);
  let _date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
  let _hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
  let _minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
  let _secconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
  let formatTime = '';
  let distinctTime = new Date().getTime() - time.getTime();

  if (auto) {
      if (distinctTime <= (1 * 60 * 1000)) {
          // console.log('一分钟以内，以秒数计算');
          let _s = Math.floor((distinctTime / 1000) % 60);
          formatTime = _s + '秒前';
      } else if (distinctTime <= (1 * 3600 * 1000)) {
          // console.log('一小时以内,以分钟计算');
          let _m = Math.floor((distinctTime / (60 * 1000)) % 60);
          formatTime = _m + '分钟前';
      } else if (distinctTime <= (24 * 3600 * 1000)) {
          // console.log('一天以内，以小时计算');
          let _h = Math.floor((distinctTime / (60 * 60 * 1000)) % 24);
          formatTime = _h + '小时前';
      } else if (distinctTime <= (30 * 24 * 3600 * 1000)) {
          let _d = Math.floor((distinctTime / (24 * 60 * 60 * 1000)) % 30);
          formatTime = _d + '天前';
          // console.log('30天以内,以天数计算');
      } else {
          // 30天以外只显示年月日
          formatTime = _year + '-' + _month + '-' + _date;
      }
  } else {

      switch (type) {
          case 'Y-M-D H:I:S':
              formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours + ':' + _minutes + ':' + _secconds;
              break;
          case 'Y-M-D H:I:S zh':
              formatTime = _year + '年' + _month + '月' + _date + '日  ' + _hours + ':' + _minutes + ':' + _secconds;
              break;
          case 'Y-M-D H:I':
              formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours + ':' + _minutes;
              break;
          case 'Y-M-D H':
              formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours;
              break;
          case 'Y-M-D':
              formatTime = _year + '-' + _month + '-' + _date;
              break;
          case 'Y-M-D zh':
              formatTime = _year + '年' + _month + '月' + _date + '日';
              break;
          case 'Y-M':
              formatTime = _year + '-' + _month;
              break;
          case 'Y':
              formatTime = _year;
              break;
          case 'M':
              formatTime = _month;
              break;
          case 'D':
              formatTime = _date;
              break;
          case 'H':
              formatTime = _hours;
              break;
          case 'I':
              formatTime = _minutes;
              break;
          case 'S':
              formatTime = _secconds;
              break;
          default:
              formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours + ':' + _minutes + ':' + _secconds;
              break;
      }
  }
  // 返回格式化的日期字符串
  return formatTime;
}
export function getJsByHide() {
  //需要隐藏微信分享按钮的页面调用
  console.log(window.location.href.substring(0,window.location.href.indexOf("#")-1))
  
      getJsApiConfig({url:window.location.href.substring(0,window.location.href.indexOf("#")-1)})
      .then((res) => {
          if (res.code == 0) {
//写入b字段
              wx.config({
                  debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                  appId: res.data.appId, // 必填，公众号的唯一标识
                  timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                  nonceStr: res.data.noncestr, // 必填，生成签名的随机串
                  signature: res.data.signature,// 必填，签名
                  jsApiList: ['hideMenuItems', 'showMenuItems'] // 必填，需要使用的JS接口列表
              });
              wx.ready(function () {
//批量隐藏功能
                  wx.hideMenuItems({
                      menuList: ["menuItem:share:QZone", "menuItem:share:facebook", "menuItem:favorite", "menuItem:share:weiboApp", "menuItem:share:qq", "menuItem:share:timeline", "menuItem:share:appMessage", "menuItem:copyUrl", "menuItem:openWithSafari", "menuItem:openWithQQBrowser"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                  });
              });
          }
      }, (e) => {
         
      });
}

export function formDataToJson(data) {
  let __json;
  if (data instanceof FormData) {
    __json = {};
    data.forEach((v, k) => {
      __json[k] = v;
    });
  } else {
    __json = data;
  }
  return __json;
}
/**
 * 验证规则
 * @type {{idCard: ((val?)), mobile: ((val?))}}
 */
export const validators= {
  idCard(val = '') {
    val = val.replace(/(^\s*)|(\s*$)/g, '');
    val = val.toUpperCase();
    const len = (val || '').length;

    if (len == 0) {
      return { ret: false, tip: '不能为空' };
    }
    if (len != 18 && len != 15) {
      return { ret: false, tip: '格式错误' };
    }
    // 15位的身份证，验证了生日是否有效
    if (len == 15) {
      const year = val.substring(6, 8);
      const month = val.substring(8, 10);
      const day = val.substring(10, 12);
      const tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day));
      if (tempDate.getYear() != parseFloat(year) || tempDate.getMonth() != parseFloat(month) - 1
          || tempDate.getDate() != parseFloat(day)) {
        return { ret: false, tip: '格式错误' };
      }
      return { ret: true };
    }
    // 18位的身份证，验证最后一位校验位
    if (len == 18) {
      // 身份证的最后一为字符
      const endChar = val.charAt(len - 1);
      val = val.substr(0, 17);
      const table = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      const table2 = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
      const cNum = [];
      for (let i = 0; i < val.length; i++) {
        cNum[i] = val.charAt(i);
      }
      let sum = 0;
      for (let i = 0; i < cNum.length; i++) {
        // 其中(cNum[i]-48)表示第i位置上的身份证号码数字值，table[i]表示第i位置上的加权因子，
        const num = cNum[i].charCodeAt(0);
        const num1 = parseInt(table[i], 10);
        sum = (sum * 1) + ((num - 48) * num1);
      }
      // 以11对计算结果取模
      const index = Number(sum % 11);
      // 根据模的值得到对应的校验码,即身份证上的最后一位为校验码
      const verfiyCode = table2[index];
      if (endChar != verfiyCode) {
        return { ret: false, tip: '格式错误' };
      }
      return { ret: true };
    }
  },
  mobile(val = '') {
    return {
      ret: /^1\d{10}$/.test(val),
      tip: '格式错误',
    };
  },
};

export function getRequestParam() {
  const url = window.location.search;
  const paramArr = (url.split('?')[1] || '').split('&');
  const paramObj = {};
  for (let i = 0; i < paramArr.length; i++) {
    if (paramArr[i].indexOf('=') != -1) {
      paramObj[paramArr[i].split('=')[0]] = paramArr[i].split('=')[1];
    }
  }
  return paramObj;
}

export function getPlatformSource() {
  const ua = window.navigator.userAgent.toLowerCase();
  if (/micromessenger/.test(ua)) {
    return {
      name: 'wechat',
    };
  } else if (/alipayclient/.test(ua)) {
    return {
      name: 'alipay',
    };
  } else {
    return {}
  }
}

export function isIOS() {
  const ua = window.navigator.userAgent.toLowerCase();
  return !!ua.match(/iPhone|iPad|iPod|iOS/i);
}

export function isAndroid() {
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.indexOf('android') != -1;
}

export function setTitle(title) {
  document.title = title || '';
  const platformSource = window.CONSTANT_CONFIG.platformSource;
  if (platformSource == 2 && /ip(hone|od|ad)/i.test(navigator.userAgent)) {
    const i = document.createElement('iframe');
    i.src = '/favicon.ico';
    i.style.display = 'none';
    i.onload = () => {
      setTimeout(() => {
        i.remove();
      }, 9);
    };
    document.body.appendChild(i);
  }
}
export function showToast() {
  console.log("hhhh")
  this.setState({showToast: true});
  console.log(this.state.showToast)

  this.state.toastTimer = setTimeout(()=> {
      this.setState({showToast: false});
  }, 2000);
}
export function showToast1() {
  this.setState({showToast1: true});
  this.state.toastTimer = setTimeout(()=> {
      this.setState({showToast1: false});
  }, 2000);
}
export function showLoading() {
  this.setState({showLoading: true});

  this.state.loadingTimer = setTimeout(()=> {
      this.setState({showLoading: false});
  }, 2000);
}
export function getJs() {
  Api
      .getJsApiConfig({url:window.location.href.substring(0,window.location.href.indexOf("#")-1)})
      .then((res) => {
          if (res.code == 0) {
//写入b字段
              wx.config({
                  debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                  appId: res.data.appId, // 必填，公众号的唯一标识
                  timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                  nonceStr: res.data.noncestr, // 必填，生成签名的随机串
                  signature: res.data.signature,// 必填，签名
                  jsApiList: ['hideMenuItems', 'showMenuItems'] // 必填，需要使用的JS接口列表
              });
              wx.ready(function () {
//批量隐藏功能
                  wx.hideMenuItems({
                      menuList: ["menuItem:share:QZone", "menuItem:share:facebook", "menuItem:favorite", "menuItem:share:weiboApp", "menuItem:share:qq", "menuItem:share:timeline", "menuItem:share:appMessage", "menuItem:copyUrl", "menuItem:openWithSafari", "menuItem:openWithQQBrowser"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                  });
              });
          }
      }, (e) => {

      });
}
export function hideDialog() {
    this.setState({
        showIOS1: false,
        showIOS2: false,
        showIOS3:false,
        showAndroid1: false,
        showAndroid2: false,
    });
}
