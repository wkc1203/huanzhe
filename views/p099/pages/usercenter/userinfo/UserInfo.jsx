import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import { Link } from 'react-router';
import hashHistory from 'react-router/lib/hashHistory';
import Connect from '../../../components/connect/Connect';
import NoResult from '../../../components/noresult/NoResult';
import * as Api from './userInfoApi';
import './style/index.scss';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
        showToast: false,
        showToast1:false,
        showLoading: false,
        toastTimer: null,
        loadingTimer: null,
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
                    label: '暂不删除',
                    onClick: this.hideDialog.bind(this)
                },
                {
                    type: 'primary',
                    label: '确定删除',
                    onClick: this.unBind.bind(this)
                }
            ]
        },
        msg:'',
        popConfig: {
            show: false,
            title: '提示',
            cancelText: '取消',
            submitText: '确定'
        },
        userInfo: {},
        id: ''
    };
  }

  componentDidMount() {
      this.getJs();
      this.setState({
          id:this.props.location.query.patientId
      })
      this.getUserInfo({ patientId: this.props.location.query.patientId });

  }
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
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })
            });
    }


    showToast() {
        this.setState({showToast: true});
        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
    }
    showToast1() {
        this.setState({showToast1: true});
        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast1: false});
        }, 2000);
    }
    showLoading() {
        this.setState({showLoading: true});
        this.state.loadingTimer = setTimeout(()=> {
            this.setState({showLoading: false});
        }, 2000);
    }
    hideDialog() {
        console.log(this.state);
        this.setState({
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            showAndroid2: false,
        });
    }
     getUserInfo(param) {
        Api
            .getUserInfo(param)
            .then((res) => {
                this.setState({
                    userInfo:res.data
                })
            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });

    }
  componentWillUnmount() {
    //this.state.Timer && clearTimeout(this.state.Timer);
  }
     setDefault() {
        if (this.state.userInfo.isDefalut != 1) {
            Api
                .setDefault({ id: this.props.location.query.patientId })
                .then((res) => {
                    if (res.code == 0) {
                        this.showToast1();
                        console.log(res.code);
                        var userInfo=this.state.userInfo;
                        userInfo.isDefalut = 1;
                        this.setState({
                            userInfo:userInfo
                        })
                        const timer = setTimeout(() => {
                            clearTimeout(timer);
                            hashHistory.push({
                                pathname:'usercenter/userlist',
                            })
                        }, 2000);
                    }

                }, (e) => {
                    this.setState({
                        msg:e.msg,
                        showIOS1:true
                    })
                });

        }
    }

     unBind1() {
         this.setState({
             showIOS2:true,
             msg:'确定删除该就诊人吗？'
         })
    }
    unBind(){
        Api
            .unBind({ id:this.props.location.query.patientId})
            .then((res) => {
                if (res.code == 0) {
                    this.setState({
                        showIOS2:false
                    })
                    this.showToast();
                    const timer = setTimeout(() => {
                        clearTimeout(timer);
                        hashHistory.push({
                            pathname:'usercenter/userlist',
                        })
                    }, 2000);
                }

            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });

    }

  render() {
     const {userInfo,msg}=this.state
    return (
        <div className="ui-page">
            <Toast icon="success-no-circle" show={this.state.showToast1}>设置成功</Toast>

            <Toast icon="success-no-circle" show={this.state.showToast}>删除成功</Toast>
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
            <Dialog type="ios" title={this.state.style2.title} buttons={this.state.style2.buttons} show={this.state.showIOS2}>
                {msg}
            </Dialog>
            <div className="mu-card">
                <div className="card-info">
                    <div className="info-main">
                        <div className="main-name">
                            <div className="name">{userInfo.name}</div>
                            {userInfo.isDefalut == 1&&<div className="status" >默认</div>}
                        </div>
                    </div>
                    <div className="info-extra">
                        {userInfo.patCardTypeName || '就诊卡'}：{userInfo.patCardNo||userInfo.idNo}
                    </div>
                </div>
            </div>

            <div className="m-userinfo">

                {userInfo.sex&&<div className="userinfo-item" >
                    <div className="item-tit">性别</div>
                    <div className="item-txt">{userInfo.sex === 'M' ? '男' : '女'}</div>
                </div>}
                {userInfo.birthday&&<div className="userinfo-item" >
                    <div className="item-tit">出生日期</div>
                    <div className="item-txt">{userInfo.birth}</div>
                </div>}
                {userInfo.idNo&&<div className="userinfo-item" >
                    <div className="item-tit">身份证号</div>
                    <div className="item-txt">{userInfo.idNo}</div>
                </div>}
                <div className="userinfo-item">
                    <div className="item-tit">手机号</div>
                    <div className="item-txt">{userInfo.mobile}</div>
                </div>
                <div className="userinfo-item">
                    <div className="item-tit">就诊卡号</div>
                    <div className="item-txt">{userInfo.patCardNo||userInfo.idNo}</div>
                </div>
            </div>



            <div className="mu-list">
                {userInfo.isDefalut == 0&&<div className="list-item" >
                    <div className="item">
                        <div className="item-hd"
                          >设为默认就诊人</div>
                        <div className="item-bd disabled"
                             onClick={()=>{
                            this.setDefault()

                            }}
                            >
                            <Switch checked={userInfo.isDefalut == 1} disabled color="#3ECDB5" />
                        </div>
                    </div>
                </div>}
                <div className="m-btn">

                    <div className="btn-item default-btn" onClick={()=>{
                    this.unBind1()

                    }}>删除就诊人</div>
                </div>

            </div>

        </div>


    );
  }
}

export default Connect()(Widget);
