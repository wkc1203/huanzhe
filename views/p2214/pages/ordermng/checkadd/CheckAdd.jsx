import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';
import * as Api from './checkAddApi';
import './style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
  constructor(props) {
    super(props);
    this.state = {
        showToast: false,
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
        addInfo:'',
      
    }; 
  }
  componentDidMount() {
       this.getJs();
       this.setState({
        addInfo:JSON.parse(this.props.location.query.content)

       })
     // this.getDetail();
     console.log(JSON.parse(this.props.location.query.content))
     
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
  componentWillUnmount() {
    // 离开页面时结束所有可能异步逻辑
      this.state.leftTimer && clearInterval(this.state.leftTimer);

  }
   

  render() {
    const {msg,addInfo,edit,showMore,statusClassName,phone,orderDetail,leftTimeFlag,leftTime}=this.state
    return (
        <div className="container page-add-detail">
            <div className="home "><span className="jian"
                                        onClick={()=>{
                                      this.context.router.goBack();
                                      }}
                ></span>加号详情
            </div>
            <Toast icon="success-no-circle" show={this.state.showToast}>修改成功</Toast>
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
            {addInfo!=''&&<div className="main">
                <div><img src='./././resources/images/add-patient.png'/>
                    <span>就诊人</span>
                    <span>{addInfo.patientName}</span>
                </div>                                                                                                                                                                                                                                                                
                <div><img src='./././resources/images/add-age.png'/>
                    <span>年龄</span>
                    <span>{addInfo.patientAge}</span>
                </div>
                <div><img src='./././resources/images/add-sex.png'/>
                    <span>性别</span>
                    <span>{addInfo.patientSex=='M'?'男':'女'}</span>
                </div>
                <div><img src='./././resources/images/add-card.png'/>
                    <span>就诊卡</span>
                    <span>{addInfo.patCardNo}</span>
                </div>
                <div><img src='./././resources/images/add-hospital.png'/>
                    <span>院区</span>
                    <span>重庆医科大学附属儿童医院|{addInfo.hospitalDistrict}</span>
                </div>
                <div><img src='./././resources/images/add-dept.png'/>
                    <span>科室</span>
                    <span>{addInfo.deptName}</span> 
                </div>
                <div><img src='./././resources/images/add-type.png'/>
                    <span>号别</span>
                    <span>{addInfo.registLevel}</span>
                </div> 
                <div><img src='./././resources/images/add-time.png'/>
                    <span>时间</span>
                    <span>{addInfo.viditDate} </span>
                </div>
                <div><img src='./././resources/images/add-price.png'/>
                    <span>价格</span>
                    <span>￥{addInfo.totalFee}</span>
                </div>
            </div>}
           
        </div>
    );
  }
}
export default Connect()(Widget);