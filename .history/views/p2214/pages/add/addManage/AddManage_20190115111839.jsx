import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';

import * as Api from './addManageApi';
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
        inquiryId:'',
        id:'',
        no:'',
        userId:'',
        // 剩余时间大于0
        leftTimeFlag: false,
        end:false,
        isAdd:false,
        // 剩余支付时间
        leftTime: '00:00',
    };
  }

  componentDidMount() {
      console.log("ss1",this.props.location.query);
      this.getInfo(this.props.location.query.id);
      if(this.state.end){

      }else{
          var time1=this.state.info.createTimeStr;
          var d = time1+90000;
          var now=new Date().getTime();
          console.log('ddddd');
          console.log("t1",time1);
          console.log(now);
          console.log(d);
          console.log((d-now)/1000);
          var s=(d-now)/1000;
          // var d1=(d-now)/1000;
          // console.log(d1);
          this.getLeftTime(s||0);
          this.state.interval = setInterval(() =>{
              var time1=this.state.info.createTimeStr;
              var d = new Date(time1).getTime()+90000;
              var now=new Date().getTime();
              console.log(now);
              console.log(d);
              console.log((d-now)/1000);
              var s1=(d-now)/1000;
              this.getLeftTime(s1 || 0)
          }, 1000);
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
        Api
            .addInfo({
                hospitalTradeno:this.state.info.hospitalTradeno,
                type:3,
                hospitalUserId:this.state.info.hospitalUserId,
            })
            .then((res) => {
                if(res.code==0){
                    Api
                        .returnMoney({
                            url:window.location.origin,
                            hospitalTradeno:this.state.info.hospitalTradeno,
                            hospitalUserId:this.state.info.hospitalUserId,
                        })
                        .then((res1) => {
                            if(res1.code==0){
                                this.showToast()

                                const timer = setTimeout(() => {
                                    clearTimeout(timer);
                                    this.context.router.goBack();
                                }, 2000);
                            }
                        }, (e) => {
                        });
                }
            }, (e) => {
            });
    }
    getInfo(id){
        Api
            .getInfo({
                hospitalTradeno:id,
            })
            .then((res) => {
                if(res.code==0){
                    this.setState({ info:res.data });
                }
            }, (e) => {
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
            pathname:'add/cardtip',
            inquiryId:this.state.inquiryId
        })
    }
    addInfo(){
        Api
            .addInfo({
                hospitalTradeno:this.state.id,
                type:1,
                inquiryId:this.state.inquiryId,
                userId:this.state.userId,
            })
            .then((res) => {
                if(res.code==0){
                    this.setState({ isSure:true });
                }
            }, (e) => {
            });
    }

  getHospIntro() {
    this.showLoading();
    Api
      .getHisInfo()
      .then((res) => {
        this.hideLoading();
        this.setState({ hospInfo: res.data });
      }, (e) => {
        this.hideLoading();
        this.showPopup({ content: e.msg });
      });
  }

  render() {
   const {isAdd,isSure,info,leftTime}=this.state;
    return (
        <div className="page-add-confirm">
            <Toast icon="success-no-circle" show={this.state.showToast}>退号成功</Toast>

            <div className="container">
                {info.orederStatus=='0'&&
                <div className="time" >请在{leftTime}秒后内确定加号</div>
                }
                <div className="doctorInfo">
                    <div className="img">
                        <img src={info.doctorImg}/>
                        </div>
                        <div className="basic">
                            <div><span>{info.doctorName}</span>{info.doctorLever}</div>
                            <div>{info.hisName}</div>
                            <div className="registerTime">预约时间：{info.orderDate} {info.times=='上午'?'11:00-11:30':info.hospitalDistrict=='礼嘉分院'?'15:30-16:00':'17:00-17:30'}</div>
                        </div>

                    {info.isVisit=='0'&&info.isPay=='1'&&<div  className="status"> <p>待就诊</p></div>}
                    { info.isVisit=='0'&&info.isPay=='0'&& <div   className="status"><p>未付款</p></div>}
                    { info.isVisit=='2'&& <div  className="status"> <p  className="disNo"  >已过期</p></div>}
                    { info.isVisit=='3'&& <div  className="status"><p className="disNo"  >已退号</p></div>}
                    { info.isVisit=='1'&& <div className="status"> <p className="disNo">已就诊</p></div>}
                    </div>
                    <div className="main">

                        <div><span>就诊人：</span>{info.patientName}</div>
                        <div><span>联系电话：</span>{info.phone}</div>
                        <div><span>支付方式：</span>线上支付</div>
                        <div><span>院区：</span>{info.hospitalDistrict}</div>
                        <div><span>科室：</span>{info.deptName}</div>
                        <div><span>号别：</span>{info.registLevel}</div>
                        <div><span>订单号：</span>{info.hospitalTradeno}</div>
                        <div><span>就诊位置：</span>{info.hisName} {info.medicalAddress} {info.deptName} </div>
                        <div style={{lineHeight:'20px'}}><span>就诊指引：</span>请就诊当天到医生所在门诊，出示您的就诊卡（或电子就诊卡）</div>
                        <div><span>挂号费用：</span>￥{info.fees}元</div>
                    </div>
                  {info.isVisit=='0'&&info.isPay=='1'&&<Link
                        className="m-mycard"
                        to={{ pathname: '/usercenter/userinfo' }}>
                        我的就诊卡
                    </Link>}
                    {info.isVisit=='0'&&info.isPay=='1'&&<div className="confirm"  >
                        <img  src="../../../resources/images/confirm1.png"/>
                    </div>}
                    <div className="confirm" >
                        <img  src="../../../resources/images/tui.png" />
                    </div>

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
                            <div className='modal-content'>就诊当日只能在医院窗口退号。就诊卡
                                或身份证或电话号码30天内最多退号3次，如果
                                退号次数在30天内达到3次，则该就诊卡或
                                身份证或电话号码暂停预约挂号90天</div>
                            <div className='modal-footer'>
                                <span  onClick={()=>{
                                this.sureAdd()

                                }}
                                    style={{color:'rgb(102,102,102)'}}
                                    >确定</span>
                                <span
                                    onClick={()=>{
                                this.noSure()

                                }}
                                    style={{color:'rgb(77,171,199)'}}>取消</span>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>

    );
  }
}

export default Connect()(Widget);
