import 'whatwg-fetch';
import 'es6-promise';
import hashHistory from 'react-router/lib/hashHistory';
import * as Utils from './utils';
import { DOMAIN } from '../config/constant/constant';

export default {
  post(url, param) {
    const CONSTANT_CONFIG = window.CONSTANT_CONFIG;
    const config = {
      hisId:2215,
      platformSource:3,
      platformId:2215,
      login_access_token:window.localStorage.getItem('login_access_token'),

    };
    const queryStr = Utils.jsonToQueryString({...config});
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
        //未授权  
        var str =JSON.stringify(window.location);
        if(str.indexOf('openId')==-1){
          window.REDIRECT_CODE = 999;
          const { protocol, host, pathname, search, hash } = window.location;
          const returnUrl = encodeURIComponent(`${protocol}//${host}${pathname}?returnRandomParam=${Date.now()}&${search.replace(/(\?)|(returnRandomParam=\d*)/g, '')}${hash}`);
          var code='';
          //sessionStorage.setItem('systemOauthRedirect', 1);
          if(window.location.origin=='https://tih.cqkqinfo.com'){
            code='ff808081683e587c01685eececfa0001';
          
          }else{
            code='ff808081683e587c01685eeb6a160000';
          }
          var storage=window.localStorage;
          //加入缓存
          storage.isOpenId=1;   
        
          window.location.href = "https://wx.cqkqinfo.com/wx/wechat/authorize/"+code+"?scope=snsapi_base";
          // return false;
             var storage=window.localStorage;
             //加入缓存
             storage.url=window.location.href;
           }
      }
      if(data.code === 990){
        /*未注册*/
        window.REDIRECT_CODE = 990;
        hashHistory.push({
          pathname: '/login/loginindex'
        }); }
      return new Promise((resolve, reject) => {
        if (data.code === 0) {
          resolve(data);
        } else {
          data.msg = data.msg;
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
