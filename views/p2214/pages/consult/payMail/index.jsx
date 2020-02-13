import React, { Component } from 'react';
import { Link } from 'react-router';
import hashHistory from 'react-router/lib/hashHistory';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';

import * as Api from '../../../components/Api/Api';
import './index.scss';

class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            orderInfo: {},
            orderId: '',
            inquiryId: '',
            showToast: false,
            showLoading: false,
            toastTimer: null,
            loadingTimer: null,
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            showAndroid2: false,
            hrefUrl:'',
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
            // 剩余时间大于0
            leftTimeFlag: false,
            // 剩余支付时间
            leftTime: '00:00',
            totalFee: 0,
            go:0,
            payData:{}
        };
    }

    componentDidMount() {
        /*this.getJs();
        this.setState({
            orderId:this.props.location.query.orderId,
            inquiryId:this.props.location.query.inquiryId,
            totalFee:this.props.location.query.totalFee,
        })
        const orderId =this.props.location.query.orderId;
        this.confirmPay1();*/
    }

    getJs() {
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

    // 获取邮寄费用

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
    /*支付*/
    confirmPay() {
      var  payData=this.state.payData;
      if (this.state.payData) {
        wx.ready(function () {
          wx.chooseWXPay({
            appId: payData.appId,
            timestamp: payData.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: payData.nonceStr, // 支付签名随机串，不长于 32 位
            package: payData.packages, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType:payData.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: payData.paySign, // 支付签名
            success: function (res) {
              var inquiryIdUrl=window.location.href.substring(window.location.href.lastIndexOf("?"),window.location.href.length);
              var replaceUrl=window.location.origin+"/views/p2214/#/consult/waiting"+
                  inquiryIdUrl+"&type=TWZX";
              var storage=window.localStorage;
              //写入b字段
              storage.loc='1';
              top.window.location.replace(replaceUrl);
            }
          });
        })

      }
    }

    /*获取支付签名*/
    confirmPay1() {
      Api
        .getPayInfo({
            orderId: this.props.location.query.orderId,
        })
        .then((res) => {
            if (res.code == 0) {
                this.setState({
                    payData:res.data
                })
            }
        }, (e) => {
            this.setState({
                msg:e.msg,
                showIOS1:true
            })
        });
    }
    /*倒计时*/
    getLeftTime(time = 0) {
        if (time <= 0) {
            this.state.leftTimer && clearInterval(this.state.leftTimer);
            this.setState({
                leftTimeFlag:false,
                leftTime:'00:00',
            })
            return;
        }

        const minute = `00${Math.floor(time / 60)}`.substr(-2);
        const second = `00${Math.floor(time % 60)}`.substr(-2);
        this.setState({
            leftTimeFlag:true,
            leftTime:`${minute}:${second}`,
        })
        var leftTimer=this.state.leftTimer;
        leftTimer = setTimeout(() => {
            this.getLeftTime(--time);
        }, 1000);
        this.setState({
            leftTimer:leftTimer
        })
    } 

    render() {
        const {orderInfo,msg,hrefUrl,orderId,inquiryId,leftTimeFlag,leftTime,totalFee}=this.state;
        return (
            <div className='page1-paymail'>
                <div className="home"><span className="jian"
                                            onClick={()=>{
                                            if(this.props.location.query.card==1){
                                                 this.context.router.push({
                                      pathname:'ordermng/orderdetail',
                                      query:{orderId:this.props.location.query.orderId,

                                      }
                                      })
                                            }else{
                                                this.context.router.push({
                                                  pathname:'consult/confirminfo',
                                                  query:{
                                                    doctorId:this.props.location.query.doctorId,
                                                    deptId:this.props.location.query.deptId,
                                                    totalFee:this.props.location.query.totalFee
                                                  }
                                                })
                                            }

                                      }}
                    ></span>收银台
                </div>
                <a href={this.state.hrefUrl} id="a"></a>
                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                    {msg}
                </Dialog>
                <div className='fee-box'>
                    {leftTimeFlag&&
                    <div className="warm-tip1">
                        {leftTime!='0'&&<div className="lefttime">请在 {leftTime}秒内完成支付</div>}
                    </div>}

                    <div className='fee-item'>
                        <div className='des-fee'>支付金额（元）</div>
                        {(totalFee/100).toFixed(2)}
                        {/*{{WxsUtils.formatMoney(totalFee,100)}}*/}
                    </div>

                </div>
                <div className="mm-list">
                    <div className="content">
                        <div className="list">
                            <div className="list-item">
                                <div className="item-label">
                                  <img src='./././resources/images/shr.png'/>
                                  <span>收货人</span>
                                </div>
                                <div className="item-value">{this.props.location.query.doctorName}</div>
                            </div>
                            <div className="list-item">
                                <div className="item-label">
                                  <img src='./././resources/images/lxfs.png'/>
                                  <span>联系方式</span>
                                </div>
                                <div className="item-value">{this.props.location.query.deptName}</div>
                            </div>
                            <div className="list-item">
                                <div className="item-label">
                                  <img src='./././resources/images/szdq.png'/>
                                  <span>所在地区</span>
                                </div>
                                <div className="item-value">重庆市江北区</div>
                            </div>
                            <div className="list-item">
                                <div className="item-label">
                                  <img src='./././resources/images/xxdz.png'/>
                                  <span>详细地址</span>
                                </div>
                                <div className="item-value">新牌坊</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mm-list">
                    <div className="content">
                        <div className="list">
                            <div className="list-item">
                                <div className="item-label">
                                  <img src='./././resources/images/psfs.png'/>
                                  <span>配送方式</span>
                                </div>
                                <div className="item-value">EMS（中国邮政）</div>
                            </div>
                        </div>
                    </div>
                </div>
                <p className='beizhu-tishi'>
                  温馨提示：配送费用重庆市内为15元，重庆市外为25元，新疆西藏地区为30元，费用由中国邮政收取，
                  支付后即为确定需要配送，配送费不予退回。
                </p>

                <div className='btn'>
                    {
                    <button  className="submit-btn" onClick={()=>{
                    this.confirmPay()
                    }}>
                        立即支付
                    </button>}
                    <div className="empty-box"></div>
                </div>
                
            </div>
        );
    }
}

export default Connect()(Widget);
