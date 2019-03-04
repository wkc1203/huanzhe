import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import hashHistory from 'react-router/lib/hashHistory';

import * as Api from './getuserInfoApi';
import 'style/index.scss';

class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
  constructor(props) {
    super(props);
    this.state = {
      hospInfo: {},
        param:{},
    };
  }
  componentDidMount() {
      this.showLoading();
      this.getJs();
      var isOpenId=window.localStorage.getItem('isOpenId');
      
      var str =JSON.stringify(window.location);
      if(str.indexOf('openId')!==-1){
          var str1=str.substring(str.indexOf("openId") ,str.length)||'';
          str =str1.substring(str1.indexOf("=") + 1,str1.indexOf("&"))||'';
          console.log(str);
          window.openId=str;
          var storage=window.localStorage;
          //写入b字段
          storage.openId=str;
          var id={openId:str};
          this.setState({
              param:id
          })
           console.log("iddid",id);
           if(isOpenId==1){
            this.getAuth(id);
           }else{
            this.bindAnother(id);
           }
          
      }

  }
    /*隐藏功能*/
    getJs() {
        Api
            .getJsApiConfig({url:window.location.href.substring(0,window.location.href.indexOf("#")-1)})
            .then((res) => {
                if (res.code == 0) {
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: res.data.appId, // 必填，公众号的唯一标识
                        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: res.data.noncestr, // 必填，生成签名的随机串
                        signature: res.data.signature,// 必填，签名
                        jsApiList: ['hideMenuItems', 'showMenuItems'] // 必填，需要使用的JS接口列表
                    });
                    wx.ready(function () {
                        wx.hideMenuItems({
                            menuList: ["menuItem:share:QZone", "menuItem:share:facebook", "menuItem:favorite", "menuItem:share:weiboApp", "menuItem:share:qq", "menuItem:share:timeline", "menuItem:share:appMessage", "menuItem:copyUrl", "menuItem:openWithSafari", "menuItem:openWithQQBrowser"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                        });
                    });
                }
            }, (e) => {
            });
    }
    /*获取用户信息*/
    getUser(){

        Api
            .getUser()
            .then((res) => {
                console.log(res);
                if(res.code==0){
                    this.setState({
                        userInfo:res.data,
                        userId:res.data.id
                    })
                    var storage=window.localStorage;
                    //加入缓存
                    storage.userInfo=JSON.stringify(res.data);
                    var replaceUrl=window.localStorage.getItem('url');
                    //top.window.location.replace(replaceUrl);
                    this.context.router.goBack();
                }
            }, (e) => {
            });
    }
    /*获取授权信息*/
    getAuth(ids) {
    Api
      .getAuth(ids)
      .then((res) => {
        this.hideLoading();
                if(res.code==0){
                    var storage=window.localStorage;
                    //写入b字段
                    storage.login_access_token=res.login_access_token;
                    var   ss={login_access_token:storage["login_access_token"]};
                     if(res.hasbind=='1'){
                        var storage=1;
                        //加入缓存
                        storage.isOpenId=1;
                        this.getUser();
                     }else{
                        var storage=window.localStorage;
                        //加入缓存
                        storage.isOpenId=2;
                        var code='';
                        if(window.location.origin=='https://tih.cqkqinfo.com'){
                          code='ff80808165b46560016817f20bbc00b3';
                    
                        }else{
                          code='ff80808165b46560016817f30cc500b4';
                        }
                      
                        window.location.href = "https://wx.cqkqinfo.com/wx/wechat/authorize/"+code+"?scope=snsapi_base";
                                           
                     }
                    //
                }
      }, (e) => {
      });
  }
   /*获取授权信息*/
   bindAnother(ids) {
  
    Api
      .bindAnother(ids)
      .then((res) => {
        this.hideLoading();
                if(res.code==0){
                        this.getUser();
                     
                    //
                }
      }, (e) => {
      });
  }

  

  render() {
    return (
        <div className="auth-page">
            {/*<div className="m1-btn">
                <div className="tips">需要您授权登录后才可以继续操作~</div>
                <button className="btn"  onClick={
                ()=>{
                this.getAuth();
                }
                }>立即授权</button>
            </div>*/}
        </div>
    );
  }
}

export default Connect()(Widget);
