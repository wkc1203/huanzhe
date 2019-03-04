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
        thisAppId:'',
        thatAppid:'',
    };
  }
  componentDidMount() {
      this.showLoading();
      this.getJs();
   /*    var str =JSON.stringify(window.location);
      if(str.indexOf('openId')!==-1){
          str =str.substring(str.indexOf("=") + 1,str.indexOf("&"))||'';
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
          this.getAuth(id);
      } */
      this.getAppid();


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
      .getAuth({openId:ids})
      .then((res) => {
        this.hideLoading();
                if(res.code==0){
                    var storage=window.localStorage;
                    //写入b字段
                    storage.login_access_token=res.login_access_token;
                    var   ss={login_access_token:storage["login_access_token"]};
                    this.getUser();
                }
      }, (e) => {
      });
  }
  //获取appid
  getAppid() {
    Api
      .getAppid()
      .then((res) => {
        this.hideLoading();
        if(res.code==0){
            this.setState({
                thisAppId:res.data[0],
                thatAppid:res.data[1]
            })
            if(this.state.thisAppId){
                window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+this.state.thisAppId+'&redirect_uri='+window.location.href+'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
                //this.getAuth(this.state.thisAppId)
            }
        }
     
                console.log(res);
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
