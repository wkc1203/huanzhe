import React, { Component } from 'react';
import { Link } from 'react-router';
import hashHistory from 'react-router/lib/hashHistory';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import ListItem from './component/ListItem';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
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
            orderInfo: {},
            orderInfo1: {},
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
                        onClick: Utils.hideDialog.bind(this)
                    }
                ]
            },
            style2: {
                title: '提示',
                buttons: [
                    {
                        type: 'default',
                        label: '放弃付款',
                        onClick: this.delete.bind(this)
                    },
                    {
                        type: 'primary',
                        label: '付款',
                        onClick: this.sure.bind(this)
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
            appId:'',
            addInfo:'',
            payData:{},
            checkDetail:'',
            

        };
    }
    componentWillMount(){
        this.mounted = true;
    }
    componentWillUnmount() {
        
        this.mounted = false;
    }
    componentDidMount() {
     

        if(!!window.localStorage.openId){
            Utils.sum('inquiry_pay',1);
         }else{
             var code='';
            if(window.location.origin=='https://tih.cqkqinfo.com'){
                code='ff80808165b46560016817f20bbc00b3';
              }else{
                code='ff80808165b46560016817f30cc500b4';
              }
              var storage=window.localStorage;
              //加入缓存
              storage.isOpenId=1;
              window.location.href = "https://wx.cqkqinfo.com/wx/wechat/authorize/"+code+"?scope=snsapi_base";
              // return false;
                 var storage=window.localStorage;
                 //加入缓存
                 storage.url=window.location.href;             
         }
         Utils.getJsByHide();
         if (this.mounted) {
            this.setState({
                orderId:this.props.location.query.orderId,
                inquiryId:this.props.location.query.inquiryId,
                totalFee:this.props.location.query.totalFee||0,

            })
        }
        const orderId =this.props.location.query.orderId;
        if(this.props.location.query.source){
             if(this.props.location.query.source=='check'){
                this.getDetail();
             }else{
                    this.getAddPay(this.props.location.query.orderId);
             }
        }else{
            this.getConsultDet(orderId);
        }
    }
    showToast() {
        this.setState({showToast: true});
        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
    }
    delete(){
           this.hideDialog();
           this.context.router.goBack();
    }
    sure(){
        this.hideDialog();
        this.confirmPay()
    }
    /*支付*/
    confirmPay() {
        if(this.props.location.query.source){
            if(this.props.location.query.status=='1'){
                this.prePay();
           }else{
               if(!!this.state.addInfo&&this.state.addInfo.isPay=='1'){
                   this.prePay();
               }else{
                   window.location.href=this.state.orderInfo1.payUrl;
               }
           }
        }else{
            window.location.href=this.state.orderInfo.payUrl;
        }
    }
    confirmPay1() {
        
           
            window.location.href=this.state.orderInfo.payUrl;
        
    }
    getAddPay(orderId) {
            Api
            .getAddInfo({
                orderId: orderId,
                source:this.props.location.query.source,
                hospitalUserId:this.props.location.query.hospitalUserId,
                hospitalTradeno:this.props.location.query.hospitalTradeno,
               
            })
            .then((res) => {
                if (res.code == 0) {
                    if (this.mounted) {
                    this.setState({
                        orderInfo:res.data,
                        totalFee:res.data.totalFee||0
                    })
                }
                }
            }, (e) => {
                if (this.mounted) {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            }
            });
    }
    getAddPay1(id) {
      Api
      .getAddInfo({
          source:'1',
          hospitalUserId:this.props.location.query.hospitalUserId,
          hospitalTradeno:id,
      })
      .then((res) => {
          if (res.code == 0) {
            if (this.mounted) {
              this.setState({
                  orderInfo1:res.data,
                  totalFee1:res.data.totalFee||0
              })
            }
          }
      }, (e) => {
        if (this.mounted) {
          this.setState({
              msg:e.msg,
              showIOS1:true
          })
        }
      });
}
    getCheckPay(id) {
        Api
        .getCheckInfo({
            orderId: id,
            hisId:'2214',
            source:'1'
        })
        .then((res) => {
            if (res.code == 0) {
                if (this.mounted) {
                this.setState({
                    orderInfo1:res.data,
                    totalFee:res.data.totalFee||0
                })
            }
                window.location.href=res.data.payUrl;
            }
        }, (e) => {
            if (this.mounted) {
            this.setState({
                msg:e.msg,
                showIOS1:true
            })
        }
        });
}
    /*倒计时*/
    getLeftTime(time = 0) {
        if (time <= 0) {
            this.state.leftTimer && clearInterval(this.state.leftTimer);
            if (this.mounted) {
            this.setState({
                leftTimeFlag:false,
                leftTime:'00:00',
            })
        }
            return;
        }
        const minute = `00${Math.floor(time / 60)}`.substr(-2);
        const second = `00${Math.floor(time % 60)}`.substr(-2);
        if (this.mounted) {
            this.setState({
                leftTimeFlag:true,
                leftTime:`${minute}:${second}`,
            })
        }
        var leftTimer=this.state.leftTimer;
        leftTimer = setTimeout(() => {
            this.getLeftTime(--time);
        }, 1000);
        if (this.mounted) {
            this.setState({
                leftTimer:leftTimer
            })
        }
}
    orderStatus(orderId) {
        Api
            .orderStatus({orderId:orderId})
            .then((res) => {
            }, (e) => {
            });
    }
     /*获取订单信息*/
    getConsultDet(orderId) {
        Api
            .getConsultDet1({orderId:orderId})
            .then((res) => {
                if (res.code == 0 && res.data != null) {
                    if (this.mounted) {
                    this.setState({
                        orderInfo:res.data,
                    })
                }
                    this.getLeftTime(res.data.leftPayTime || 0);
                }
            }, (e) => {
                if (this.mounted) {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            }
            });
    }
    getDetail() {
        Api
            .getCheckDetail({
                id:this.props.location.query.checkId,
                hisId:'2214'
            })
            .then((res) => {
                if (res.code == 0) {
                    if (this.mounted) {
                     this.setState({
                       checkDetail:res.data,
                       addInfo:JSON.parse(res.data.subscribeInfo)
                     })
                    }
                     var add=JSON.parse(res.data.subscribeInfo);
                        if(add.hasPay!=='0'){
                        }else{
                            this.getAddPay1(res.data.subscribeOrderNo);
                        }
                }
            }, e=> {
            });
   }
   getDetail1() {
    Api
        .getCheckDetail({
            id:this.props.location.query.checkId,
            hisId:'2214'
        })
        .then((res) => {
            if (res.code == 0) {
                if (this.mounted) {
                 this.setState({
                   checkDetail:res.data,
                 })
                }
            }
        }, e=> {
        });
}
    prePay(){
                Api
             .preCheckPay({
                 id:this.props.location.query.checkId,
                 patientId:this.props.location.query.patientId,
                 hisId:'2214'
             })
             .then((res) => {
                 if(res.code==0){
                    this.getCheckPay(this.state.checkDetail.orderStr)
                 }
             }, e=> {
                if (this.mounted) {
                 this.setState({
                     msg:e.msg,
                     showIOS1:true
                 })
                }
             });
    }
    render() {
        const {orderInfo1,orderInfo,msg,addInfo,checkDetail,leftTimeFlag,leftTime,totalFee}=this.state;
        return (
            <div className='page1-pay'>
                <div className="home"><span className="jian"
                                            onClick={()=>{
                                                 if(this.props.location.query.source){
                                                    this.context.router.push({
                                                        pathname:'ordermng/checkdetail',
                                                        query:{id:this.props.location.query.checkId,
                                                        }
                                                        })
                                                }else{  
                                                    if(this.props.location.query.card==1){
                                                        this.context.router.push({
                                                    pathname:'ordermng/orderdetail',
                                                    query:{orderId:this.props.location.query.orderId,
                                                    }
                                                    })
                                                        }else{
                                                             if(this.props.location.query.type=='2'){
                                                                this.context.router.push({
                                                                    pathname:'consult/report',
                                                                    query:{doctorId:orderInfo.doctorId,
                                                                    deptId:orderInfo.deptId,
                                                                    com:'2'
                                                                   
                                                                    }
                                                                  })
                                                             }else{
                                                                this.context.router.push({
                                                                    pathname:'consult/confirminfo',
                                                                    query:{doctorId:orderInfo.doctorId,
                                                                    deptId:orderInfo.deptId,
                                                                    type:this.props.location.query.type=='2'?'2':'1',
                                                                    totalFee:this.props.location.query.totalFee
                                                                    }
                                                                  })
                                                             }
                                                                
                                                        }
                                                    }
                                      }}
                    ></span>收银台
                </div>
                <a href={this.state.hrefUrl} id="a"></a>
                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                    {msg}
                </Dialog>
                <Dialog type="ios" title={this.state.style2.title} buttons={this.state.style2.buttons}
                        show={this.state.showIOS2}>
                    请于今日内完成支付。若未支付，订单将会自动取消，您将无法就诊
                </Dialog>
                <div className='fee-box'>
                    {leftTimeFlag&&
                    <div className="warm-tip1">
                        {leftTime!='0'&&<div className="lefttime">请在 {leftTime}秒内完成支付</div>}
                    </div>}
                    {this.props.location.query.source&&
                        <div className="warm-tip1">
                        <div className="lefttime">请在今日23：15前完成支付</div>
                    </div>}
                    {this.props.location.query.source!="check"&&<div className='fee-item'>
                        <div className='des-fee'>支付金额（元）</div>
                        <span style={{fontSize:'18px'}}>￥</span>{(totalFee/100).toFixed(2)||'0:00'}
                    </div>}
                    {this.props.location.query.source=="check"&&addInfo.hasPay=='0'&&(checkDetail.status=='0'||checkDetail.status=='1')&&<div className='fee-item'>
                        <div className='des-fee'>待缴费金额（元）</div>
                        <span style={{fontSize:'18px'}}>￥</span>{(addInfo.hasPay!=='0')?(checkDetail.totalFee/100).toFixed(2)||'0.00':((addInfo.totalFee*1)+(checkDetail.totalFee/100))}
                    </div>}
                    {this.props.location.query.source=="check"&&addInfo.hasPay!=='0'&&(checkDetail.status=='0'||checkDetail.status=='1')&&<div className='fee-item'>
                    <div className='des-fee'>待缴费金额（元）</div>
                    <span style={{fontSize:'18px'}}>￥</span>{(addInfo.hasPay!=='0')?(checkDetail.totalFee/100).toFixed(2)||'0.00':((addInfo.totalFee*1)+(checkDetail.totalFee/100))}
                </div>}
                    {this.props.location.query.source=="check"&&(checkDetail.status!='0'&&checkDetail.status!='1')&&<div className='fee-item'>
                    <div className='des-fee'>待缴费金额（元）</div>
                    <span style={{fontSize:'18px'}}>￥</span>0.00
                </div>}
                </div>
              {this.props.location.query.source!="check"&&<div className="mm-list">
                    <div className="content">
                        <div className="list">
                        <ListItem img="./././resources/images/pay-doctor.png" txt='医生姓名' name={orderInfo.doctorName}></ListItem>
                        <ListItem img="./././resources/images/pay-dept.png" txt='科室名称' name={orderInfo.deptName}></ListItem>
                        <ListItem img="./././resources/images/pay-type.png" txt='业务类型' name={orderInfo.typeName}></ListItem>
                        </div>
                    </div>
                </div>}
                {this.props.location.query.source!="check"&&<div className="mm-list">
                    <div className="content">
                        <div className="list">
                        <ListItem img="./././resources/images/pay-patient.png" txt='就诊人' name={orderInfo.patientName}></ListItem>
                        <ListItem img="./././resources/images/pay-card.png" txt='就诊卡号' name={orderInfo.patCardNo}></ListItem>
                        </div>
                    </div>
                </div>}
                {this.props.location.query.source=="check"&&!!checkDetail&&!!checkDetail.doctorName&&<div className="mm-list">
                    <div className="content">
                        <div className="list">
                        <ListItem img="./././resources/images/pay-doctor.png" txt='医生姓名' name={checkDetail.doctorName}></ListItem>
                        <ListItem img="./././resources/images/pay-dept.png" txt='科室名称' name={checkDetail.deptName}></ListItem>
                        <ListItem img="./././resources/images/pay-patient.png" txt='就诊人' name={checkDetail.patientName}></ListItem>
                        <ListItem img="./././resources/images/pay-card.png" txt='就诊卡号' name={checkDetail.patCardNo}></ListItem>
                        </div>
                    </div>
                </div>}
                {this.props.location.query.source=="check"&&<div className="mm-list">
                    <div className="content">
                        <div className="list">
                        <ListItem img="./././resources/images/pay-type.png" txt='业务类型' name='网络门诊'></ListItem>
                        <ListItem img="./././resources/images/pay_fee.png" txt='金额' name={'￥'+(!!addInfo.totalFee?addInfo.totalFee:'')||'0.00'}></ListItem>
                        <ListItem img="./././resources/images/pay_jin.png" txt='支付状态' name={(addInfo.hasPay!=='0')?'已支付':'未支付'}></ListItem>
                        </div>
                    </div>
                </div>}
                {this.props.location.query.source=="check"&&<div className="mm-list">
                    <div className="content">
                        <div className="list">
                        <ListItem img="./././resources/images/pay-type.png" txt='业务类型' name='检验检查'></ListItem>
                        {this.props.location.query.status!=='1'&&<ListItem img="./././resources/images/pay_fee.png" txt='金额' name={'￥'+(checkDetail.totalFee/100).toFixed(2)||'0.00'}></ListItem>}
                        {this.props.location.query.status=='1'&&<ListItem img="./././resources/images/pay_fee.png" txt='金额' name={'￥'+((!!this.props.location.query.checkFee?this.props.location.query.checkFee:checkDetail.totalFee)/100).toFixed(2)||'0:00'}></ListItem>}
                        <ListItem img="./././resources/images/pay_jin.png" txt='支付状态' name={(checkDetail.status=='0'||checkDetail.status=='1')?'未支付':'已过期'}></ListItem>
                        </div>
                    </div>
                </div>}
                 {this.props.location.query.source&&<p className='warm'>注：
                 {(checkDetail.status=='0'||checkDetail.status=='1')&&addInfo.hasPay=='0'&&<span style={{color:'red'}}>
                 因此处存在两种业务类型缴费，所以您需要分两次完成支付，网络门诊费支付后将不支持退款。
                 </span>}
                 请于今日内完成支付，若未支付，订单将会自动取消
                 </p>}
                {<div className='btn'>
                    {orderInfo.canPayFlag == 1 &&leftTimeFlag&&this.props.location.query.source!=="check"&&
                    <button  className="submit-btn" onClick={()=>{
                 this.confirmPay()
                 }}>
                        立即支付
                    </button>}
                    {orderInfo.canPayFlag != 1&&!this.props.location.query.source=="check"&&
                    <button disabled  className="submit-btn" >
                        立即支付
                    </button>}
                    {this.props.location.query.source=="check"&&(checkDetail.status=='0'||checkDetail.status=='1')&&
                    <button  className="submit-btn" onClick={()=>{
                 this.confirmPay()
                 }}>
                        立即支付
                    </button>}
                    {this.props.location.query.source=="1"&&&&
                    <button  className="submit-btn" onClick={()=>{
                 this.confirmPay1()
                 }}>
                        立即支付
                    </button>}
                    <div className="empty-box"></div>
                </div>}
            </div>
        );
    }
}
export default Connect()(Widget);
