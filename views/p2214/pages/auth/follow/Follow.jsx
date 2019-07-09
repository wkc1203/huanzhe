import React, { Component } from 'react';
import { Link } from 'react-router';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import hashHistory from 'react-router/lib/hashHistory';
import * as Utils from '../../../utils/utils';
import * as Api from '../../../components/Api/Api';
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
      Utils.getJsByHide();
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
          var isOpenId=window.localStorage.getItem('isOpenId');
           var that=this;
         
              this.getAuth(id);
           
      }
  }
    /*获取用户信息*/
    getUser(){
      this.showLoading();
        Api
            .getUser()
            .then((res) => {
                this.hideLoading();
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
                    top.window.location.replace(replaceUrl);
                    storage.isOpenId=1;
                    storage.url='f';
                }
            }, (e) => {
            });
    }
    goHref(){
        if(window.localStorage.getItem('href')=='t'){
            var code='';
          if(window.location.origin=='https://tih.cqkqinfo.com'){
              code='ff80808165b465600168276e19d200e6';
            }else{
              code='ff80808165b46560016827701f7e00e7';
            }
            var replaceUrl= "https://wx.cqkqinfo.com/wx/wechat/authorize/"+code+"?scope=snsapi_base";
            window.localStorage.href='f';
            top.window.location.replace(replaceUrl);
        }
    }
    /*获取授权信息*/
    getAuth(ids) {
       this.showLoading();
       console.log("ids",ids)
    Api
      .getAuth1(ids)
      .then((res) => {
        console.log(res)
                if(res.code==0){
                    var storage=window.localStorage;
                    //写入b字段
                    storage.login_access_token=res.login_access_token;
                    var replaceUrl=window.localStorage.getItem('url');
                    top.window.location.replace(replaceUrl);
                     
                }
      }, (e) => { 
      });
  } 
   /*获取授权信息*/
   bindAnother(ids) { this.showLoading();
    window.localStorage.isOpenId=1;
    Api
      .bindAnother(ids)
      .then((res) => {
                if(res.code==0){
                    window.localStorage.isOpenId=1;
                        this.getUser();
                }
      }, (e) => {
      });
  }
  render() {
    return (
        <div className="auth-page">
            
        </div>
    );
  }
}

export default Connect()(Widget);
