import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import { Link } from 'react-router';
import * as Api from './registerInfoApi';
import './style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
            msgList: [],
            quiryNum: 0,
            showToast: false,
            showLoading: false,
            toastTimer: null,
            loadingTimer: null,
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            no:3,
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
            msg: '',
        };
    }
    componentDidMount() {
        this.getInquiryList();


  this.getJs();
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

    getMsg() {
        Api
            .getMsg()
            .then((res) => {
                if (res.code == 0 && res.data != null) {
                    this.setState({
                        quiryNum: res.data.length
                    })
                }
            }, (e) => {
                this.hideLoading();
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
   /*获取咨询列表*/
    getInquiryList() {
        this.showLoading();
        Api
            .getInquiryList()
            .then((res) => {
                if (res.code == 0) {
                    this.hideLoading();

                    this.setState({
                        msgList: res.data
                    })

                    if(this.props.location.query.inquiryId&&this.props.location.query.s!=1){
                        window.location.href=window.location.href+"&s=1";
                        this.context.router.push({
                            pathname:'inquiry/chat',
                            query:{
                                inquiryId:this.props.location.query.inquiryId,
                                orderId:this.props.location.query.orderId,
                                status:this.props.location.query.status,
                                no:1
                            }
                        })
                    }
                }
            }, (e) => {
                this.hideLoading();
            });
    }

    toNext(type) {
        if (type == 1) {
            this.context.router.replace({
                pathname: '/home/index'
            });
        }
        if (type == 3) {
            this.context.router.replace({
                pathname: '/usercenter/home'
            });
        }
    }
    render() {
        const {msgList,msg}=this.state
        return (
            <div className="container page-register-info">
                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons}
                        show={this.state.showIOS1}>
                    {msg}
                </Dialog>
                <div className="home" style={{position:'relative',width:'100%',top:'0'}}><span className="jian"
                                    onClick={()=>{
                                      this.context.router.goBack();
                                      }}
            ></span>就诊指引
        </div>
                <div className='info'>
                   <p className='register-title'>
                    如何检查
                   </p>
                   <p className='register-text'>
                     按照检查单项目，到检查科室，出示您的实体就诊卡，若没有实体就诊卡，
                     出示您 的电子就诊卡二维码
                   </p>
                </div>
                <div className='info'>
                   <p className='register-title'>
                    如何查看报告
                   </p>
                   <p className='register-text'>
                     在报告出来后，在个人中心查看我的检验检查报告
                   </p>
                </div>
                <div className='info'>
                   <p className='register-title'>
                    如何取实体报告
                   </p>
                   <p className='register-text'>
                     在报告出来后，在拿报告窗口，出示您的检查单条形码。
                     检查单条形码就在检验检查报告页面个人中心>病历记录>检查单
                   </p>
                </div>
            </div>
        );
    }
}

export default Connect()(Widget);
