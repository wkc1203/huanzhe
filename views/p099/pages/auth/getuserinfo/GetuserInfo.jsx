import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import hashHistory from 'react-router/lib/hashHistory';

import * as Api from './getuserInfoApi';
import 'style/index.scss';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hospInfo: {},
        param:{},
    };
  }

  componentDidMount() {
       //this.getUser();
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

    getAuth() {
    this.showLoading();
    Api
      .getAuth(this.state.param)
      .then((res) => {
        this.hideLoading();
            console.log('res'+res.login_access_token);
            console.log("ddd"+res.login_access_token);
            var storage=window.localStorage;
            //写入b字段
            //console.log("st1",storage.login_access_token);
                storage.login_access_token=res.login_access_token;
            var   ss={login_access_token:storage["login_access_token"]};
             console.log(ss.login_access_token);
            setTimeout(() => {
                if(res.code==0){

                    hashHistory.replace({
                        pathname: '/usercenter/home',
                    });
                }

            }, 1000);


        //this.setState({ hospInfo: res.data });
      }, (e) => {
        this.hideLoading();
            //alert("r"+JSON.stringify(e));
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
