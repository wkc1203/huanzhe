import React, { Component } from 'react';
import { Link } from 'react-router';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
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
        isSure:false,
        info:{},
        leftTimes:900,
        hasData:false,//是否有数据
        inquiryId:'',
        id:'',
        interval:'',
        no:'',
        orderId:'',
        time:'',
        userId:'',
        // 剩余时间大于0
        leftTimeFlag: false,
        end:false,
        isAdd:false,
        hospitalUserId:'',
        // 剩余支付时间
        leftTime: '00:00',
        hospitalTradeno:'',
        canBack:false,
        showToast: false,
        showLoading: false,
        toastTimer: null,
        loadingTimer: null,
        showIOS1: false,
            showIOS2: false,
            showIOS3: false,
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
            style3: {
                buttons: [
                    {
                        label: '立即完善',
                        onClick: this.finishInfo.bind(this)
                    }
                ]
            },
            msg: '',
    };
  }
  componentWillUnmount(){
    clearInterval(this.state.interval);
  }
  showToast() {
    this.setState({showToast: true});
    this.state.toastTimer = setTimeout(()=> {
        this.setState({showToast: false});
    }, 2000);
}
finishInfo() {
    this.setState({
        showIOS1: false,
        showIOS2: false,
        showIOS3:false,
        showAndroid1: false,
        showAndroid2: false,
    });
    window.location.href='https://wx.cqkqinfo.com/wx3/p/03/p/patient_info_modify.cgi?cardNo='+this.state.info.orderCarNo+'&companyCode=netHospital&backUrl='+window.location.origin+'/views/p2214/#/usercenter/home'
}
  componentDidMount() {
    Utils.getJsByHide();
      if(this.props.location.query.addId){
        this.getInfo1(this.props.location.query.addId);
      }else{
        this.getInfo(this.props.location.query.id);
      }
      this.setState({
          id:this.props.location.query.id,
          userId:this.props.location.query.userId,
          no:this.props.location.query.patHisNo,
          inquiryId:this.props.location.query.inquiryId
      })
  }
    getLeftTime(time = 0) {
        if (time <= 0) {
            this.setState({
                end:true,
                leftTimeFlag:false,
                leftTime: '00:00'
            })
            this.state.leftTimer && clearInterval(this.state.leftTimer);
            return;
        }
        const minute = `00${Math.floor(time / 60)}`.substr(-2);
        const second = `00${Math.floor(time % 60)}`.substr(-2);
        this.setState({
            leftTimeFlag:true,
            leftTime:  `${minute}:${second}`
        })
    }
    returnMoney(){
        this.showLoading("处理中")
                    Api
                        .returnMoney({
                            url:window.location.origin,
                            hospitalTradeno:this.state.info.hospitalTradeno,
                            hospitalUserId:this.state.info.hospitalUserId,
                        })
                        .then((res1) => {
                            if(res1.code==0){
                                this.hideLoading();
                                this.showToast();

                                const timer = setTimeout(() => {
                                    clearTimeout(timer);
                                    this.context.router.push({
                                        pathname:'/inquiry/chat',
                                        query:{inquiryId:this.state.info.inquiryId}
                                    });
                                }, 2000);
                            }else{
                                this.hideLoading();
                                this.setState({
                                    msg:'退款失败',
                                    showIOS1:true
                                })
                            }
                        }, (e) => {
                            this.hideLoading();
                            this.setState({
                                msg:'退款失败',
                                showIOS1:true
                            })
                        });
    }
    getInfo(id){
        this.showLoading();
        Api
            .getInfo({
                hospitalTradeno:id,
            })
            .then((res) => {
                if(res.code==0){
                    var now=new Date().getTime();
                    var date=new Date(res.data.orderDate).getTime();
                    if(now<date){
                        this.setState({
                            canBack:true,
                        })
                    }
                    var info=res.data;
                    for(var i=0;i<info.length;i++){
                         var now=new Date().getTime();
                         var day=new Date(info[i].orderDate).getTime();
                         if(now<day){
                             info[i].pass=true;
                         }
                    }
                    this.hideLoading();
                    this.setState({ 
                        info:info,
                        hasData:true,
                        time:res.data.orderDate.substr(0,10),
                        inquiryId:res.data.inquiryId,
                        userId:res.data.userId,
                        orderId:res.data.id,
                        hospitalTradeno:res.data.hospitalTradeno,
                        hospitalUserId:res.data.hospitalUserId,
                    });
                                }
            }, (e) => {
                 this.hideLoading();
                    this.setState({
                        hasData:false,
                    })
            });
    }
    getInfo1(id){
        this.showLoading();
        Api
            .getInfo1({
                id:id,
            })
            .then((res) => {
                if(res.code==0){
                    var now=new Date().getTime();
                    var date=new Date(res.data.orderDate).getTime();
                    if(now<date){
                        this.setState({
                            canBack:true,
                        })
                    }
                    this.hideLoading();
                    this.setState({ 
                        info:res.data,
                        time:res.data.orderDate.substr(0,10),
                        inquiryId:res.data.inquiryId,
                        userId:res.data.userId,
                        orderId:res.data.id,
                        hospitalTradeno:res.data.hospitalTradeno,
                        hospitalUserId:res.data.hospitalUserId,
                    });
                    this.setState({
                        hasData:true,
                    })
                }else{
                    this.hideLoading();
                    this.setState({
                        hasData:false,
                    })
                }
            }, (e) => {
                this.hideLoading();
                this.setState({
                    hasData:false,
                })
            });
    }
    showToast() {
        this.setState({showToast: true});

        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
    }
    sure()
    {
        this.addInfo()
    }
    sureAdd(){
        this.setState({
            isAdd:false
        })
        this.returnMoney();
    }
    returnM(){
        this.setState({
            isAdd:true
        })
    }
    noSure(){
        this.setState({
            isAdd:false
        })
    }
    sure1(){
        this.setState({
            isSure:false
        })
        this.context.router.push({
            pathname:'consult/pay',
            query:{orderId:this.state.orderId,source:this.props.location.query.source,hospitalUserId:this.state.hospitalUserId,hospitalTradeno:this.state.hospitalTradeno}
        })
    }
    addInfo(){
        Api
            .addInfo({
                hospitalTradeno:this.state.id,
                type:1,
                inquiryId:this.state.inquiryId,
                userId:this.state.userId,
                orderId:this.state.orderId,
            })
            .then((res) => {
                if(res.code==0){                  
                    this.sure1();
                }
            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1: true
                })
            });
    }
  render() {
   const {isAdd,isSure,info,hasData,time,canBack,msg}=this.state;
   console.log(info)     
    return (
        <div className="page-add-confirm">
        <div className="home bid" >
            <span className="jian"
                onClick={()=>{
                    if(this.props.location.query.source==1){
                        this.context.router.push({
                            pathname:'inquiry/chat',
                            query:{inquiryId:this.state.inquiryId}
                        });
                    }else{
                        this.context.router.push({
                            pathname:'ordermng/orderlist',
                            query:{userId:info.userId,busType:'add'}
                        });
                    }                 
                }}
            ></span>加号详情
        </div>
            <Toast icon="success-no-circle" show={this.state.showToast}>退号成功</Toast>
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons}
                    show={this.state.showIOS1}>
                {msg}
            </Dialog>
            <Dialog type="ios" title={this.state.style3.title} buttons={this.state.style3.buttons}
                    show={this.state.showIOS3}>
               请先完善资料，才能完成加号
            </Dialog>
            {hasData&&<div className="container">
                {info.orederStatus!=='2'&&info.orederStatus=='0'&&info.isPay=='0'&&info.isVisit=='0'&&
                <div className="time" >请在今日23：15前确定加号</div>
                }
                <div className="doctorInfo">
                    <div className="img">
                        <img src={info.doctorImg}/>
                        </div>
                        <div className="basic">
                            <div><span>{info.doctorName}</span>{info.doctorLever} | {info.deptName}</div>
                            <div>{info.hisName}</div>
                            <div className="registerTime">预约时间：{time} {info.times=='上午'?'11:00-11:30':info.hospitalDistrict=='礼嘉分院'?'15:30-16:00':'17:00-17:30'}</div>
                        </div>
                    {info.orederStatus=='1'&&info.isPay=='1'&&info.isVisit=='0'&&<div  className="status"> <p>待就诊</p></div>}
                    {info.orederStatus=='1'&&info.isPay=='0'&&info.isVisit=='0'&&<div   className="status"><p>待付款</p></div>}
                    {info.orederStatus=='1'&&info.isPay=='1'&&info.isVisit=='2'&&<div  className="status"> <p  className="disNo"  >已过期</p></div>}
                    {info.orederStatus=='1'&&info.isPay=='1'&&info.isVisit=='3'&&<div  className="status"><p className="disNo"  >已退号</p></div>}
                    {info.orederStatus=='1'&&info.isPay=='1'&&info.isVisit=='1'&&<div className="status"> <p className="disNo">已就诊</p></div>}
                    {info.orederStatus=='3'&&info.isPay=='2'&&info.isVisit=='0'&&<div className="status"> <p className="disNo">加号失败</p></div>}
                    {info.orederStatus=='2'&&info.isPay=='0'&&info.isVisit=='0'&&<div className="status"> <p className="disNo">已超时</p></div>}
                    {info.orederStatus=='4'&&info.isPay=='1'&&info.isVisit=='0'&&<div className="status"> <p className="disNo">申请中</p></div>}
                    </div>  
                    <div className="main">
                        <div><span>就诊人：</span>{info.patientName}</div>
                        <div><span>联系手机：</span>{info.phone}</div>
                        <div><span>院区：</span>{info.hospitalDistrict}</div>
                        <div><span>科室：</span>{info.deptName}</div>
                        <div><span>挂号类别：</span>{info.registLevel}</div>
                        <div><span>订单编号：</span>{info.hospitalTradeno}</div>
                        {info.retSerialNo&&info.retSerialNo!=''&&<div><span>排队序号：</span>{info.retSerialNo}</div>}
                        <div><span>就诊位置：</span>{info.hisName} {info.medicalAddress} </div>
                        <div><span>金额：</span>￥{(info.fees/100)||"0:00"}元</div>
                        <div
                        style={{height:'auto',lineHeight:'25px'}}
                        ><span>注意事项：</span>{info.memo?info.memo:''} 目前暂不支持线下窗口退号</div>
                    </div>
                    <Link
                        className="m-mycard"
                        to={{ pathname: '/usercenter/userinfo',query:{patientId:info.patientId,source:1} }}>
                        我的就诊卡
                    </Link>
                    {info.orederStatus=='0'&&info.isPay=='0'&&info.isVisit=='0'&&<div className="confirm" onClick={()=>{
                        this.context.router.push({
                            pathname:'/add/cardtip',
                            query:{status:0,time:time,times:info.times=='上午'?'11:00-11:30':info.hospitalDistrict=='礼嘉分院'?'15:30-16:00':'17:00-17:30',hospitalTradeno:this.state.id,orderId:this.state.orderId,userId:this.state.userId,type:1,orderId:this.state.orderId,inquiryId:this.state.inquiryId,source:this.props.location.query.source,hospitalUserId:this.state.hospitalUserId,hospitalTradeno:this.state.hospitalTradeno}
                        })
                    }} >
                        <img  src="../../../resources/images/confirm1.png"/>
                    </div>}
                    {info.orederStatus=='1'&&info.isPay=='0'&&info.isVisit=='0'&&<div className="confirm" onClick={()=>{
                        this.context.router.push({
                            pathname:'/add/cardtip',
                            query:{status:1,time:time,times:info.times=='上午'?'11:00-11:30':info.hospitalDistrict=='礼嘉分院'?'15:30-16:00':'17:00-17:30',hospitalTradeno:this.state.id,orderId:this.state.orderId,userId:this.state.userId,type:1,orderId:this.state.orderId,inquiryId:this.state.inquiryId,source:this.props.location.query.source,hospitalUserId:this.state.hospitalUserId,hospitalTradeno:this.state.hospitalTradeno}
                        })
                    }} >     
                        <img  src="../../../resources/images/confirm1.png"/>
                    </div>}
                    {info.orederStatus=='1'&&info.isPay=='1'&&info.isVisit=='0'&&
                    <div className="confirm" 
                    onClick={()=>{
                        this.returnM();
                    }}>
                        <img  src="../../../resources/images/tui.png" />
                    </div>}
                {isSure&&<div className='modal' >
                        <div className='modal-body'>
                            <div className='modal-title'>提示</div>
                            <div className='modal-content'>您已确认加号</div>
                            <div className='modal-footer'>
                                <span onClick={()=>{
                                this.sure1()
                                }}>确定</span>
                            </div>
                        </div>
                    </div>}
                {isAdd&&<div className='modal' >
                        <div className='modal-body'>
                            <div className='modal-title'>温馨提示</div>
                            <div className='modal-content'>就诊卡
                                或身份证或电话号码30天内最多退号3次，如果
                                退号次数在30天内达到3次，则该就诊卡或
                                身份证或电话号码暂停预约挂号90天</div>
                            <div className='modal-footer'>
                                <span  onClick={()=>{
                                this.sureAdd()
                                }}
                                style={{color:'rgb(77,171,199)'}}
                                    >确定</span>
                                <span  style={{color:'rgb(102,102,102)'}}
                                    onClick={()=>{
                                this.noSure()
                                }}
                                    >取消</span>
                            </div>
                        </div>
                    </div>}
                </div>}
                { !hasData&&
                    <div className="wgt-empty-box">
                    <img className="wgt-empty-img" src="../../../resources/images/no-result.png" alt=""></img>
                    <div className="wgt-empty-txt">暂未查询到相关信息
                    </div>
                </div>
                }
            </div>
    );
  }
}
export default Connect()(Widget);
