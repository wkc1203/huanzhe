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
  componentWillUpdate (nextProps,nextState){
      //alert("55555")
  }
  componentDidUpdate(prevProps,prevState){
    //alert("44444")
}
shouldComponentUpdate(nextProps,nextState){
    //alert("333333")
}
componentWillReceiveProps (nextProps){
 //window.location.reload(); 
 //alert("11"+window.location.href)
 ////alert("iso1112"+window.localStorage.getItem('isOpenId'))
 this.showLoading();
 Utils.getJsByHide();
 
 var str =JSON.stringify(window.location);
//   //alert(window.localStorage.getItem('href'));
//   if(window.localStorage.getItem('href')=='t'){
//       var code='';
//     if(window.location.origin=='https://tih.cqkqinfo.com'){
//         code='ff80808165b465600168276e19d200e6';
//       }else{
//         code='ff80808165b46560016827701f7e00e7';
//       }

//    ////alert("iso1111441111112"+window.localStorage.getItem('isOpenId'))
//       var replaceUrl= "https://wx.cqkqinfo.com/wx/wechat/authorize/"+code+"?scope=snsapi_base";
//      // //alert(replaceUrl)
//       window.localStorage.href='f';
//       top.window.location.replace(replaceUrl);

//   }
// //alert("iso1112"+window.localStorage.getItem('isOpenId'))
//this.goHref();
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
     ////alert("iso9"+str)
     var isOpenId=window.localStorage.getItem('isOpenId');
          //alert("is"+isOpenId)
      if(isOpenId==2){
       this.bindAnother({openid:str});

     
      }else{
         this.getAuth(id);
      }
     
 }

}
componentWillMount (){
    //alert("1111111")
}
  componentWillUnmount(){
      ////alert(window.location.href);
      ////alert("is"+window.localStorage.getItem('isOpenId'))
  }
  componentWillMount(){
    ////alert("bb"+window.location.href);
  }
  componentDidMount() {
    //window.location.reload(); 
      //alert("11"+window.location.href)
      ////alert("iso1112"+window.localStorage.getItem('isOpenId'))
      this.showLoading();
      Utils.getJsByHide();
      
      var str =JSON.stringify(window.location);
    //   //alert(window.localStorage.getItem('href'));
    //   if(window.localStorage.getItem('href')=='t'){
    //       var code='';
    //     if(window.location.origin=='https://tih.cqkqinfo.com'){
    //         code='ff80808165b465600168276e19d200e6';
    //       }else{
    //         code='ff80808165b46560016827701f7e00e7';
    //       }

    //    ////alert("iso1111441111112"+window.localStorage.getItem('isOpenId'))
    //       var replaceUrl= "https://wx.cqkqinfo.com/wx/wechat/authorize/"+code+"?scope=snsapi_base";
    //      // //alert(replaceUrl)
    //       window.localStorage.href='f';
    //       top.window.location.replace(replaceUrl);

    //   }
     // //alert("iso1112"+window.localStorage.getItem('isOpenId'))
     //this.goHref();
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
          ////alert("iso9"+str)
          var isOpenId=window.localStorage.getItem('isOpenId');
               //alert("is"+isOpenId)
           var that=this;
           if(isOpenId==2){   
               // alert("kkkk")
                //setTimeout(function(){
                    that.bindAnother({openid:str});
               // },5000);
                
           }else{
              this.getAuth(id);
           }
          
      }

  }
   
    /*获取用户信息*/
    getUser(){

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
                   // //alert("res"+JSON.stringify(res.data))
                    var storage=window.localStorage;
                    //加入缓存
                    storage.userInfo=JSON.stringify(res.data);
                    var replaceUrl=window.localStorage.getItem('url');
                    top.window.location.replace(replaceUrl);
                   // //alert("gg")    
                    storage.isOpenId=1;
                    storage.url='f';
                    
                   // this.context.router.go(-2);
                }
            }, (e) => {
            });
    }
    goHref(){
        //alert(window.localStorage.getItem('href'));
        if(window.localStorage.getItem('href')=='t'){
            var code='';
          if(window.location.origin=='https://tih.cqkqinfo.com'){
              code='ff80808165b465600168276e19d200e6';
            }else{
              code='ff80808165b46560016827701f7e00e7';
            }
  
         ////alert("iso1111441111112"+window.localStorage.getItem('isOpenId'))
            var replaceUrl= "https://wx.cqkqinfo.com/wx/wechat/authorize/"+code+"?scope=snsapi_base";
           // //alert(replaceUrl)
            window.localStorage.href='f';
            top.window.location.replace(replaceUrl);
  
        }
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
                    storage.login_access_token1=res.login_access_token;
                    var   ss={login_access_token:storage["login_access_token"]};
                    //alert("his"+res.hasBind);
                     if(res.hasBind==1){
                       //alert("@1") 
                       window.localStorage.isOpenId=1;
                      // //alert("iso11111111112"+window.localStorage.getItem('isOpenId'))

                       this.getUser();

                     }else{
                        //alert("@2")
                        //加入缓存
                        window.localStorage.isOpenId=2;
                       // window.localStorage.href='t';
                        var code='';
                     
                       // this.bindAnother({openId:1});     
                       
                       if(window.location.origin=='https://tih.cqkqinfo.com'){
                        code='ff80808165b465600168276e19d200e6';
                    }else{
                        code='ff80808165b46560016827701f7e00e7';
                    }
                var replaceUrl= "https://wx.cqkqinfo.com/wx/wechat/authorize/"+code+"?scope=snsapi_userinfo";         
                top.window.location.replace(replaceUrl);
                //alert(window.location.href)
                     }
                    //
                }
      }, (e) => {
      });
  }
   /*获取授权信息*/
   bindAnother(ids) {
    window.localStorage.isOpenId=1;
    ////alert("haha")
    Api
      .bindAnother(ids)
      .then((res) => {

                if(res.code==0){
                   // console.log("@2111111")
                    window.localStorage.isOpenId=1;
                     ////alert("iso1111111111"+window.localStorage.getItem('isOpenId'))
                        this.getUser();
                     
                    //
                }
      }, (e) => {
      });
  }

  

  render() {
      ////alert("cush")
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
