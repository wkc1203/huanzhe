import React, { Component } from 'react';
import { Link } from 'react-router';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import hashHistory from 'react-router/lib/hashHistory';

import * as Api from './loginApi';
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
        hisId:2214,
        account:'',
        accountType:'',
        password:'',
        openId:'',
        unionId:'',
        isPwd:true,
        success:false,
        isRe:true,
        num:0,
        showIOS1: false,
        showIOS2: false,
        showAndroid1: false,
        showAndroid2: false,
        style1: {
            buttons: [
                {
                    label: '确定',
                    onClick: this.hideDialog.bind(this)
                }
            ]
        },
        style2: {
            title: '提示',
            buttons: [
                {
                    type: 'default',
                    label: '取消',
                    onClick: this.hideDialog.bind(this)
                },
                {
                    type: 'primary',
                    label: '确定',
                    onClick: this.hideDialog.bind(this)
                }
            ]
        },
        msg:'',
        kong:true,
    };
  }
  componentDidMount() {
      if(this.props.location.query.hisId){
          var storage=window.localStorage;
          //加入缓存
          storage.hisId=this.props.location.query.hisId;
          storage.account=this.props.location.query.account;
          storage.accountType=this.props.location.query.accountType;
      }
      this.setState({
          hisId:window.localStorage.getItem('hisId'),
          account:window.localStorage.getItem('account'),
          accountType:window.localStorage.getItem('accountType'),
      })
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
          this.setState({
              openId:str
          })
          this.getOpenId(id);
      }else{
          window.location.href = "https://wx.cqkqinfo.com/wx/wechat/authorize/ff80808165b4656001675d9712d70071?scope=snsapi_userinfo";

      }
  }
    /*隐藏功能*/
    getJs() {
        console.log(window.location.href.substring(0,window.location.href.indexOf("#")-1))
        Api
            .getJsApiConfig({url:window.location.href.substring(0,window.location.href.indexOf("#")-1)})
            .then((res) => {
                if (res.code == 0) {
//写入b字段
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: res.data.appId, // 必填，公众号的唯一标识
                        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: res.data.noncestr, // 必填，生成签名的随机串
                        signature: res.data.signature,// 必填，签名
                        jsApiList: ['hideMenuItems', 'showMenuItems'] // 必填，需要使用的JS接口列表
                    });
                    wx.ready(function () {
//批量隐藏功能
                        wx.hideMenuItems({
                            menuList: ["menuItem:share:QZone", "menuItem:share:facebook", "menuItem:favorite", "menuItem:share:weiboApp", "menuItem:share:qq", "menuItem:share:timeline", "menuItem:share:appMessage", "menuItem:copyUrl", "menuItem:openWithSafari", "menuItem:openWithQQBrowser"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                        });
                    });
                }
            }, (e) => {

            });
    }

    /*获取unionId并判断是否已经绑定*/
    getOpenId(ids) {
    Api
      .getOpenId(ids)
      .then((res) => {
        this.hideLoading();
                if(res.code==0){
                    this.setState({
                        unionId:res.data.unionid
                    })
                    Api
                        .exist({
                            hisId:this.state.hisId,
                            account:this.state.account,
                            accountType:this.state.accountType,
                            openId:this.state.openId,
                        })
                        .then((res) => {
                            this.hideLoading();
                            if(res.code==0){
                                this.setState({
                                    success:false
                                })
                            }
                            if(res.code==1){
                                this.setState({
                                    success:true
                                })
                            }
                        }, (e) => {
                            console.log(e,this.state.success)
                            if(e.code==1){
                                this.setState({
                                    success:true
                                })
                            }
                        });
                }
      }, (e) => {
      });
  }
    /*获取密码*/
    changePwd(e){
        this.setState({
            password:e.target.value
        })
        console.log("password",e.target.value);
        if(e.target.value!=''){
            this.setState({
                kong:false
            })
        }else{
            this.setState({
                kong:true
            })
        }
         }
   /*是否显示真实密码*/
    changeIsPwd(){
        this.setState({
            isPwd:!this.state.isPwd
        })
       }
    /*登录*/
    bindGetUserInfo(){
        Api
            .add({
                hisId:this.state.hisId,
                account:this.state.account,
                accountType:this.state.accountType,
                password:this.state.password,
                openId:this.state.openId,
                unionId:this.state.unionId
            })
            .then((res) => {
                if(res.code==0){
                    this.setState({
                        success:true
                    })
                }else{
                    this.setState({
                        msg:res.msg,
                        showIOS1:true
                    })
                }
            }, (e) => {
                 console.log(e)
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });
}
    showToast() {
        this.setState({showToast: true});
        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
    }

    showLoading() {
        this.setState({showLoading: true});
        this.state.loadingTimer = setTimeout(()=> {
            this.setState({showLoading: false});
        }, 2000);
    }
    hideDialog() {
        this.setState({
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            showAndroid2: false,
        });
    }
  render() {
      const {password,isPwd,success,msg,kong}=this.state;
    return (
        <div className="loginPage">
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
    {!success&&<div className="login-page">
                    <img className="logo" src="../../../resources/images/logo.png" />
                    <div className="tips">账户密码必须与监管端账户一致</div>
            {isPwd&&<div className='input-item' >
                密 码
                <input  placeholder="请输入密码" type="password" value={password} onChange={(e)=>{
                        this.changePwd(e);
                        }} />
                <img className="close" src="./././resources/images/close1.png" onClick={(e)=>{
                            this.changeIsPwd(e)
                             }}
                    />
            </div>}
            {!isPwd&&<div className='input-item'>
                密 码
                <input placeholder="请输入密码" value={password} onChange={(e)=>{
                        this.changePwd(e);
                        }} />
                <img src="../../../resources/images/open.png" onClick={(e)=>{
                            this.changeIsPwd(e)
                             }}/>
            </div>}
                    <button  className={`login-btn ${kong?'gray':''}`}
                             onClick={()=>{
                             if(!this.state.kong){
                              this.bindGetUserInfo()
                             }
                             }}
                           >登 录</button>
                    <div className="re-pwd">输入您在互联网医院医生端密码</div>
        </div>}
            {success&&<div className="login-page1 login-page">
                <img className="logos" src="../../../resources/images/success.png" />
                <p className="success">登录成功</p>
                <div className="tip2">
                    即将超时达到20条，儿童健康圈公众号将会给您发送即将超时提醒，每天下午5点，也会定时向您发送即将超时提醒
                </div>
                <button  className='login-btn1'
                         onClick={()=>{
                            wx.closeWindow();
                             }}
                    >我知道了</button>
            </div>}
        </div>
    );
  }
}

export default Connect()(Widget);
