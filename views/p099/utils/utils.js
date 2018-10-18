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

export function closeWebView() {
  const platformSource = window.CONSTANT_CONFIG.platformSource * 1;
  switch (platformSource) {
    case 1:
      WeixinJSBridge.call('closeWindow');
      break;
    case 2:
      AlipayJSBridge.call('closeWebview');
      break;
    default:
      throw new Error(`WebView关闭错误：未知的渠道类型:${platformSource}`);
  }
}
