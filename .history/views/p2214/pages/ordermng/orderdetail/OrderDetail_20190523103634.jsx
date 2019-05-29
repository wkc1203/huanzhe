import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';
import ListItem from './component/ListItem';
import * as Api from '../../../components/Api/Api';
import * as Utils from '../../../utils/utils';
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
                    onClick: Utils.hideDialog.bind(this)
                }
            ]
        },
        style2: {
            title: '提示',
            buttons: [
                {
                    type: 'default',
                    label: '取消',
                    onClick: Utils.hideDialog.bind(this)
                },
                {
                    type: 'primary',
                    label: '确定',
                    onClick: Utils.hideDialog.bind(this)
                }
            ]
        },
        msg:'',
        leftTimer:''
    };
  }
  componentDidMount() {
        //隐藏分享等按钮
      Utils.getJsByHide();
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
                      <ListItem txt='咨询类型' name={orderDetail.typeName} />
                      <ListItem txt='咨询原因' name={orderDetail.purpose} />  
                      <ListItem txt='医生姓名' name={orderDetail.doctorName} />
                      <ListItem txt='科室名称' name={orderDetail.deptName} />
                      <ListItem txt='就诊人' name={orderDetail.patientName} />
                      <ListItem txt='就诊卡号' name={orderDetail.patientCardNo} />
                    </div>
                </div>
            </div>
            <div className="od-list">
                <div className="title3">支付详情</div>
                <div className="content2">
                    <div className="list">
                        {orderDetail.createTime&&
                            <ListItem txt='订单创建时间' name={orderDetail.createTime} />
                        }
                        {orderDetail.payTime&&
                            <ListItem txt='支付时间' name={orderDetail.payTime} />
                            }
                        {orderDetail.totalFee&&
                            <ListItem txt='支付金额' name={'￥'+(orderDetail.totalFee/100).toFixed(2)} />
                           }
                        {orderDetail.status&&
                            <ListItem txt='订单状态' name={orderDetail.orderStatusName} />
                            }
                        {orderDetail.tradeNo&&
                            <ListItem txt='微信订单号' name={orderDetail.tradeNo} />
                           }
                        {orderDetail.orderId&&
                            <ListItem txt='平台订单号' name={orderDetail.orderId} />
                           }
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