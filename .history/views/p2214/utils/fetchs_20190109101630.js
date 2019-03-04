import 'whatwg-fetch';
import 'es6-promise';
import hashHistory from 'react-router/lib/hashHistory';
import * as Utils from './utils';
import { DOMAIN } from '../config/constant/constant';

export default {
  post(url, param) {
    const CONSTANT_CONFIG = window.CONSTANT_CONFIG;
    const config = {
      hisId:2214,
      platformSource:3,
      platformId:2214,
      login_access_token:window.localStorage.getItem('login_access_token'),

    };
    const queryStr = Utils.jsonToQueryString({...config});
    return fetch(`${DOMAIN}${url}${url.indexOf('?') >= 0 ? '&' : '?'}${queryStr}`,{
      credentials: 'include',
      method: 'POST',
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: Utils.jsonToQueryString({ ...Utils.formDataToJson(param)}),
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
          if(window.location.origin=='https://tih.cqkqinfo.com'){
            code='ff80808165b46560016817f5569d00b5';  
      
          }else{
            code='ff80808165b46560016817f58e0600b6';
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
      return new Promise((resolve, reject) => {
        if (data.code === 0) {
          resolve(data);
        } else {
          data.msg = data.msg;
          reject(data);
        }
      });
    }, (e) => {
      if (!window.REDIRECT_CODE) { // 发生了重定向，解决ios授权等重定向时弹框问题
        return new Promise((resolve, reject) => {
          let data = {};
          data.msg = '服务器异常';
          reject(data);
        });
      }
    });
},
};
