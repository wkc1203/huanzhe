import 'whatwg-fetch';
import 'es6-promise';
import hashHistory from 'react-router/lib/hashHistory';
import * as Utils from './utils';
import { DOMAIN } from '../config/constant/constant';

export default {
  post(url, param) {
    const CONSTANT_CONFIG = window.CONSTANT_CONFIG;
    const queryStr = Utils.jsonToQueryString({...CONSTANT_CONFIG, ...Utils.formDataToJson(param)});
    console.log(`${DOMAIN}${url}${url.indexOf('?') >= 0 ? '&' : '?'}${queryStr}`);
    return fetch(`${DOMAIN}${url}${url.indexOf('?') >= 0 ? '&' : '?'}${queryStr}`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: Utils.jsonToQueryString({ ...Utils.formDataToJson(param) }),
    })
      .then(res => res.json())
      .then((data) => {
        if (data.code === 999) {
          var str =JSON.stringify(window.location);
           if(str.indexOf('openId')==-1){
             window.REDIRECT_CODE = 999;
             const { protocol, host, pathname, search, hash } = window.location;
             const returnUrl = encodeURIComponent(`${protocol}//${host}${pathname}?returnRandomParam=${Date.now()}&${search.replace(/(\?)|(returnRandomParam=\d*)/g, '')}${hash}`);
             window.location.href = "https://wx.cqkqinfo.com/wx/wechat/authorize/ff80808165b465600166766884b4006b?scope=snsapi_userinfo";
             // return false;
           }

         //alert(window.location);
          //var str = "1234A4567B789";
          //var str = window.location.substring(window.location.indexOf("=") + 1,window.location.indexOf("&"));
        }
        if(data.code === 990){
          window.REDIRECT_CODE = 990;
          hashHistory.replace({
            pathname: '/common/development'
          }); }
        /*if(data.code === 998){
          hashHistory.replace({
            pathname: '/common/development'
          });
        }*/
        return new Promise((resolve, reject) => {
          if (data.code === 0) {
            resolve(data);
          } else {
            data.msg = data.msg || 'service request failed.';
            reject(data);
          }
        });
      }, (e) => {
        if (!window.REDIRECT_CODE || window.REDIRECT_CODE < 0) { // 发生了重定向，解决ios授权等重定向时弹框问题
          return new Promise((resolve, reject) => {
            let data = {};
            data.msg = 'network request failed.';
            reject(data);
          });
        }
      });
  },
};
