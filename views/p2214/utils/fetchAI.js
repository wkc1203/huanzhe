import 'whatwg-fetch';
import 'es6-promise';
import hashHistory from 'react-router/lib/hashHistory';
import * as Utils from './utils';
import { DOMAIN } from '../config/constant/constant';

export default {
  post(url, param) {
   
    var  config = {};
    console.log(param,'frtchAI',JSON.stringify(param))

    const queryStr = Utils.jsonToQueryString({...config});
    return fetch(`${DOMAIN}${url}${url.indexOf('?') >= 0 ? '&' : '?'}${queryStr}`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        Accept: 'application/json, text/javascript, */*',
        'Content-Type': 'application/json',
        // ...header
      },
      body: !!JSON.stringify(param)?JSON.stringify(param):'' ,
  })
.then(res => res.json())
    .then((data) => {

     console.log(data,'........................222')
      // if(data.code===77777){
  
      //   hashHistory.push({
      //     pathname: '/auth/developing',
      //     query:{msg:data.msg||'服务器维护中'}
      //   });
       
      // }
      // if (data.code === 999) {
      //   //alert(data.code)
      //   //未授权
      //   console.log(data.code)
      //   var str =JSON.stringify(window.location);
      //   if(str.indexOf('openId')==-1){
      //     window.REDIRECT_CODE = 999;
      //     const { protocol, host, pathname, search, hash } = window.location;
      //     const returnUrl = encodeURIComponent(`${protocol}//${host}${pathname}?returnRandomParam=${Date.now()}&${search.replace(/(\?)|(returnRandomParam=\d*)/g, '')}${hash}`);
      //     var code='';
      //     sessionStorage.setItem('systemOauthRedirect', 1);
      //     if(window.location.hostname=='tih.cqkqinfo.com'){
      //       code='ff8080816b4bfb65016bb08126130000';
      
      //     }else{
      //       code='ff8080816b4bfb65016bb08186d70001';
      //     }
      //     var storage=window.localStorage;
      //     //加入缓存
      //     storage.isOpenId=1;
        
      //     window.location.href = "https://wx.cqkqinfo.com/wx/wechat/authorize/"+code+"?scope=snsapi_base";
      //     // return false;
      //        var storage=window.localStorage;
      //        //加入缓存
      //        storage.url=window.location.href;
      //      }
      // }
      return new Promise((resolve, reject) => {
        if (data.code === 0) {
          resolve(data);
        } else {
          data.msg = data.msg;
          reject(data);
        }
      });
    }, (e) => {
      console.log(e,'..................')
      // if (!window.REDIRECT_CODE || window.REDIRECT_CODE < 0) { // 发生了重定向，解决ios授权等重定向时弹框问题
      //   return new Promise((resolve, reject) => {
      //     let data = {};
      //     data.msg =data.msg|| '服务器异常';
      //     reject(data);
      //   });
      // }
    });
},
};
