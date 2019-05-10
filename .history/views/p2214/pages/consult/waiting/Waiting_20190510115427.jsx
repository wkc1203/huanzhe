import React, { Component } from 'react';
import { Link } from 'react-router';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import hashHistory from 'react-router/lib/hashHistory';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';

import * as Api from './waitingApi';
import 'style/index.scss';
const statusMap = {
    TWZX: {
        SUC: {
            S: '缴费成功',
        },
        ALERT: {
            F: '缴费失败',
        },
    },
};
const urlMap = {
    TWZX: '//inquiry/chat',
};

class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            // 页面参数
            options: {},
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
            // 倒计时剩余数
            leftTime: 60,
            // 结束标志
            endFlag: false,
            // 倒计时计时器
            clockTimer: 0,
            // 状态计时器
            statusTimer: 0,
            // 订单数据
            orderData: {},
        };
    }

    componentDidMount() {
        console.log(this.props.location);
        var loc=window.localStorage.getItem('loc');
        this.showLoading();
        this.getJs();
        if(this.props.location.query.orderType==2){
                 this.getOrderStats1(this.props.location.query.orderId);
           
        }else{
            console.log("32")
            if(this.props.location.query.orderType==1){
                  this.getOrderStats(this.props.location.query.orderId)
            }else{
                  // if(loc=='1'){
                this.hideLoading();
                if (!statusMap[this.props.location.query.type]) {
                    return;
                }
                this.initPage();
            // }else{
            //     this.hideLoading();
            //     this.context.router.push({
            //         pathname:'inquiry/inquirylist',
            //     })
            // }
            }

           
        }
       


    }
    /*初始化页面*/
    initPage(){
        this.clock();
        this.getStatus();

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
        console.log(this.state);
        this.setState({
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            showAndroid2: false,
        });
    }
    /**
     * 倒计时
     */
    clock() {
        this.state.clockTimer = setTimeout(() => {
            if (this.state.endFlag) {
                return;
            }

            let { leftTime } = this.state;
            --leftTime;
            if (leftTime <= 0) {
                // 查询超时，跳转详情页面
                this.beforeNext();
            } else {
                this.setState({
                    leftTime:leftTime
                })
                this.clock();
            }
        }, 1000);
    }

    /**
     * 获取订单状态
     */
    async getStatus() {
        const orderId=this.props.location.query.orderId;
        const type=this.props.location.query.type;
        const param = {
            orderId: orderId || '',
        };
        
        Api
            .orderStatus(param)
            .then((res) => {
                if (res.code == 0) {
                    this.setState({
                        orderData:res.data
                    })
                     if(res.data.orderStatus=='S'){
                        //支付成功
                        hashHistory.push({
                            pathname:'inquiry/chat',
                            query:{
                                inquiryId:this.props.location.query.inquiryId,
                                orderId:this.props.location.query.orderId,
                                status:1
                            }
                        })

                        var replaceUrl=window.location.origin+"/views/p2214/#/inquiry/chat?inquiryId="+this.props.location.query.inquiryId+
                            "&orderId"+this.props.location.query.orderId+"status=1"

                        top.window.location.replace(replaceUrl);
                    }
                    else{
                        this.analysisOrderStatus();
                    }

                }else{
                   this.beforeNext();

                }

            }, (e) => {
                this.setState({
                    msg:e.msg||'查询失败',
                    showIOS1:true
                })
            });


    }
    /**
     * 分析订单状态，确定下一步任务
     */
    analysisOrderStatus() {
        const { orderStatus = '' } = this.state.orderData || {};
        const { leftTime, options = {} } = this.state;
        const { type = '' } = options;
        if (this.state.endFlag) {
            // 其他地方触发结束，不继续
            return;
        }
        if (statusMap[type] && statusMap[type]['SUC'][orderStatus]) {
            // 明确状态或者未知状态
            this.beforeNext(true);
        } else if (statusMap[type] && statusMap[type]['ALERT'][orderStatus]) {
            // 明确失败

            this.beforeNext(true);
        } else if (leftTime <= 0) {

            // 查询超时
            this.beforeNext();
        } else {
            this.state.statusTimer = setTimeout(() => {
                this.getStatus();
            }, 2000);
        }
    };
    /**
     * 跳转之前的相应逻辑
     * @param sucFlag
     */
    beforeNext(sucFlag) {
        this.setState({
            endFlag:true
        })
        const { orderData = {} } = this.state;
        if(orderData.orderStatus === 'F'){
            // 明确失败，弹窗提示错误原因
            /* await wepy.showModal({
             title: '处理失败',
             content: '支付失败，请重新下单',
             showCancel: false,
             });*/
            this.goNext('F');
        } else if (orderData.orderStatus === 'S'){
            this.goNext('S');
        } else {
            //支付异常，弹窗提示错误原因
            /*await wepy.showModal({
             title: '处理异常',
             content: '支付异常，请重新下单',
             showCancel: false,
             });*/
            this.goNext('unknow');
        }
    };

    /**
     * 跳转至详情页
     * @param sucFlag
     */
    goNext(orderStatus) {
        const { type, inquiryId, doctorId, deptId, orderId } = this.props.location.query;
        const url = urlMap[type];
        if (orderStatus === 'S') {
            hashHistory.push({
                pathname:'inquiry/chat',
                query:{
                    inquiryId:this.props.location.query.inquiryId,
                    orderId:this.props.location.query.orderId,
                    status:1
                }
            })

        } else {
            hashHistory.push({
                pathname:'consult/confirminfo',
                query:{
                    doctorId:this.props.location.query.doctorId,
                    deptId:this.props.location.query.deptId,
                }
            })
            // 其他情况统一跳入下单页面

        }
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
                          //  menuList: ["menuItem:share:QZone", "menuItem:share:facebook", "menuItem:favorite", "menuItem:share:weiboApp", "menuItem:share:qq", "menuItem:share:timeline", "menuItem:share:appMessage", "menuItem:copyUrl", "menuItem:openWithSafari", "menuItem:openWithQQBrowser"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
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

    
    
    getOrderStats(orderId) {
        Api
            .getStatus({orderId:orderId})
            .then((res) => {
                if (res.code == 0) {
                   console.log("rR",this.props.location.query.orderId);
                     if(res.data.orderStatus=='S'){
                            
                                this.context.router.push({
                                    pathname:'/ordermng/checkdetail',
                                    query:{id:this.props.location.query.id,}
        
                                 })
                            

                             
                         }
                         
                        
                      
                     
                }

            }, (e) => {
                
                 
            });


    }
    getOrderStats1(orderId) {
        Api
            .getStatus({orderId:orderId})
            .then((res) => {
                if (res.code == 0) {
                   console.log("rR",this.props.location.query.orderId);
                     if(res.data.orderStatus=='S'){

                         if(this.props.location.query.type=='check'){
                            this.context.router.push({
                                pathname:'consult/pay',
                                query:{status:'1',source:'check',hos:this.props.location.query.hospitalTradeno,checkId:this.props.location.query.checkId,}
                            }) 
                         }else{
                           
                                this.context.router.push({
                                    pathname:'/add/addManage',
                                    query:{addId:this.props.location.query.id,source:this.props.location.query.source}
        
                                 })
                             
                         }
                         
                        
                      
                     }
                }else{
                } 
            }, (e) => {
            });


    }


    render() {
        const {orderId,msg,inquiryId,leftTimeFlag,leftTime,totalFee}=this.state
        return (
            <div className="page1-pay">
                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                    {msg}
                </Dialog>
                <div className="m-gif">
                    <div className="pacman">
                        <div className="pacman-item item-1"></div>
                        <div className="pacman-item item-2"></div>
                        <div className="pacman-item item-3"></div>
                        <div className="pacman-item item-4"></div>
                    </div>
                </div>
                <div className="m-text">系统正在处理，请稍候...</div>
                <div className="m-time">{leftTime || 0}秒后跳转</div>
            </div>
        );
    }
}

export default Connect()(Widget);
