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
       //this.getUser();
      this.getJs();
      var str =JSON.stringify(window.location);
      if(str.indexOf('openId')!==-1){
          str =str.substring(str.indexOf("=") + 1,str.indexOf("&"))||'';
          console.log(str);
          window.openId=str;
          var id={openId:str};
          this.setState({
              param:id
          })

          //this.getAuth();
      }
  }
    getJs(){

        Api
            .getJsApiConfig({url:'https://tih.cqkqinfo.com/views/p099/'})
            .then((res) => {
                console.log(res);
                if(res.code==0){
                    //写入b字段
                    console.log("str",res.data);
                    wx.config({
                        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId:res.data.appId, // 必填，公众号的唯一标识
                        timestamp:res.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr:res.data.noncestr, // 必填，生成签名的随机串
                        signature:res.data.signature,// 必填，签名
                        jsApiList: ['chooseWXPay','hideMenuItems','showMenuItems','previewImage','uploadImage','downloadImage'] // 必填，需要使用的JS接口列表
                    });
                    wx.ready(function(){
                        //批量隐藏功能
                        wx.hideMenuItems({
                            menuList: ["menuItem:share:QZone","menuItem:share:facebook","menuItem:favorite","menuItem:share:weiboApp","menuItem:share:qq","menuItem:share:timeline","menuItem:share:appMessage","menuItem:copyUrl", "menuItem:openWithSafari","menuItem:openWithQQBrowser"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                        });
                    });

                }


                //this.setState({ hospInfo: res.data });
            }, (e) => {
                this.hideLoading();
                alert("r"+JSON.stringify(e));
                //this.showPopup({ content: e.msg });
            });



    }
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
                    //写入b字段
                    storage.userInfo=JSON.stringify(res.data);
                    this.context.router.goBack();
                }

            }, (e) => {
                //alert("e"+JSON.stringify(e));

            });

    }
    getAuth() {
    this.showLoading();
    Api
      .getAuth(this.state.param)
      .then((res) => {
        this.hideLoading();
                if(res.code==0){
                    var storage=window.localStorage;
                    //写入b字段
                    storage.login_access_token=res.login_access_token;
                    var   ss={login_access_token:storage["login_access_token"]};
                    this.getUser();


                }
        //this.setState({ hospInfo: res.data });
      }, (e) => {
        this.hideLoading();
            alert("r"+JSON.stringify(e));
        //this.showPopup({ content: e.msg });
      });

  }

  render() {

    return (
        <div className="auth-page">
            <div className="m1-btn">
                <div className="tips">需要您授权登录后才可以继续操作~</div>
                {/*<button className="btn" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">立即授权</button>*/}
                <button className="btn"  onClick={
                ()=>{
                this.getAuth();

                }
                }>立即授权</button>
            </div>
        </div>

    );
  }
}

export default Connect()(Widget);
