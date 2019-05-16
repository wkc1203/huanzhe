import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';
import * as Api from './orderDetailApi';
import './style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
  constructor(props) {
    super(props);
    this.state = {
        orderId: '',
        statusName: '',
        statusClassName: '',
        orderDetail: {},
        leftTimeFlag: false,
        // 剩余支付时间
        leftTime: '00:00',
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
        leftTimer:''
    };
  }
  componentDidMount() {
        this.getJs();
     this.setState({
         orderId:this.props.location.query.orderId
     })
      this.getOrderDet();
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
    /*获取订单详情*/
     getOrderDet() {
         Api
             .getOrderDet({
                 orderId:this.props.location.query.orderId
             })
             .then((res) => {
                 if (res.code == 0) {
                     if(res.data.refundStatus!=1){
                         this.getStatus(res.data.status);
                     }else{
                         this.getStatus(3);
                     }

                     this.setState({ orderDetail: res.data });
                     this.getLeftTime(res.data.leftPayTime || 0);
                 }
             }, e=> {
                 this.setState({
                     msg:e.msg,
                     showIOS1:true
                 })
             });
    }
    /*获取订单状态*/
    getStatus(status) {
        const STATUS_MAP = {
            '-1': {
                name: 'waiting',
                statusName: '待付款'
            },
            '0': {
                name: 'info',
                statusName: '咨询中'
            },
            '1': {
                name: 'info',
                statusName: '咨询中'
            },
            '2': {
                name: 'waiting',
                statusName: '待评价'
            },
            '3': {
                name: 'success',
                statusName: '已完成'
            }
        };
        const statusObj = STATUS_MAP[status] || {};
        this.setState({
            statusName:statusObj.statusName,
            statusClassName:statusObj.name
        })
    }
    /*获取支付剩余时间*/
    getLeftTime(time = 0) {
        if (time <= 0) {
            this.state.leftTimer && clearInterval(this.state.leftTimer);
          this.setState({
              leftTimeFlag:false,
              leftTime:'00:00'
          })
            return;
        }
        const minute = `00${Math.floor(time / 60)}`.substr(-2);
        const second = `00${Math.floor(time % 60)}`.substr(-2);
        this.setState({
            leftTimeFlag:true,
            leftTime:`${minute}:${second}`
        })
        var  leftTimer=this.state.leftTimer;
        leftTimer = setTimeout(() => {
            this.getLeftTime(--time);
        }, 1000);
        this.setState({
            leftTimer:leftTimer
        })

    }
    /*重新支付*/
    repay() {
        this.context.router.push({
            pathname:'consult/pay',
            query:{
                orderId:this.state.orderId,
                inquiryId:this.state.orderDetail.inquiryId,
                totalFee:this.state.orderDetail.totalFee,
                card:1
            }
        })
      ;

    }

  render() {
    const {msg,statusName,statusClassName,orderDetail,leftTimeFlag,leftTime}=this.state
    return (
        <div className="container page-order-detail">
            <div className="home "><span className="jian"
                                        onClick={()=>{
                                            this.context.router.push({
                                                pathname:'ordermng/orderlist',
                                                query:{userId:this.props.location.query.userId,busType:'consult'}
                                            });
                                      }}
                ></span>咨询订单
            </div>
            <Toast icon="success-no-circle" show={this.state.showToast}>修改成功</Toast>
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
            {leftTimeFlag && orderDetail.orderStatus === 'U'&&<div className="m-lefttime" >
                <div className="lefttime-zw"></div>
                <div className="lefttime">剩余支付时间 {leftTime}</div>
            </div>}

            <div className="wgt-detailstatus wgt-detailstatus-waiting">
                <div className="wgt-detailstatus-bd">
                    <div className="wgt-detailstatus-bd-icon">
                        <i className={`${statusClassName?'weui-icon-'+statusClassName:''}`}></i>
                    </div>
                    <div className="wgt-detailstatus-bd-tit ">
                        {statusName}
                    </div>
                </div>
            </div>
            <div className="od-list">
                <div className="title3">就诊信息</div>
                <div className="content2">
                    <div className="list">
                        <div className="list-item">
                            <div className="item-label">咨询类型</div>
                            <div className="item-value">{orderDetail.typeName} </div>
                        </div>
                        <div className="list-item">
                            <div className="item-label">咨询原因</div>
                            <div className="item-value">{orderDetail.purpose}</div>
                        </div>
                        <div className="list-item">
                            <div className="item-label">医生姓名</div>
                            <div className="item-value">{orderDetail.doctorName}</div>
                        </div>
                        <div className="list-item">
                            <div className="item-label">科室名称</div>
                            <div className="item-value">{orderDetail.deptName}</div>
                        </div>
                        <div className="list-item">
                            <div className="item-label">就诊人</div>
                            <div className="item-value">{orderDetail.patientName}</div>
                        </div>
                        <div className="list-item">
                            <div className="item-label">就诊卡号</div>
                            <div className="item-value">{orderDetail.patientCardNo}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="od-list">
                <div className="title3">支付详情</div>
                <div className="content2">
                    <div className="list">
                        {orderDetail.createTime&&<div className="list-item" >
                            <div className="item-label">订单创建时间</div>
                            <div className="item-value">{orderDetail.createTime}</div>
                        </div>}
                        {orderDetail.payTime&&<div className="list-item" >
                            <div className="item-label">支付时间</div>
                            <div className="item-value">{orderDetail.payTime}</div>
                        </div>}
                        {orderDetail.totalFee&&<div className="list-item" >
                            <div className="item-label">支付金额</div>
                            <div className="item-value">￥{(orderDetail.totalFee/100).toFixed(2)}</div>
                        </div>}
                        {orderDetail.status&&<div className="list-item" >
                            <div className="item-label">订单状态</div>
                            <div className="item-value">{orderDetail.orderStatusName}</div>
                        </div>}
                        {orderDetail.tradeNo&&<div className="list-item" >
                            <div className="item-label">微信订单号</div>
                            <div className="item-value">{orderDetail.tradeNo}</div>
                        </div>}
                        {orderDetail.orderId&&<div className="list-item" >
                            <div className="item-label">平台订单号</div>
                            <div className="item-value">{orderDetail.orderId}</div>
                        </div>}
                    </div>
                </div>
            </div>
            <div className="empty-box"></div>
            {orderDetail.orderStatus == 'U' && leftTimeFlag&&<div className="footer-btn">
                <div className="fee-item">￥{(orderDetail.totalFee/100).toFixed(2)}</div>
                <div  className="repay-btn"
                      onClick={
                      ()=>{
                      this.repay()
                      }
                      }
                    >立即支付</div>
            </div>}
        </div>
    );
  }
}
export default Connect()(Widget);