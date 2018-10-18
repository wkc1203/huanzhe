import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';

import * as Api from './addManageApi';
import 'style/index.scss';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hospInfo: {},
    };
  }

  componentDidMount() {

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

    return (
        <div className="page-add-confirm">
            <div className="container">
                {/*<div className="time" wx:if="{{info.orederStatus=='0'}}">请在{{leftTime}}秒后内确定加号</div>*/}
                <div className="time" >请在0秒后内确定加号</div>
                <div className="doctorInfo">
                    <div className="img">
                        <img src="../../../resources/images/doc.png"/>
                            {/*<image src="{{info.doctorImg}}"></image>*/}
                        </div>
                        <div className="basic">
                            {/*<div><span>{{info.doctorName}}</span> {{info.doctorLevel}}</div>
                             <div>{{info.hisName}}</div>
                             <view class="registerTime">预约时间：{{info.orderDate}} {{info.times=='上午'?'11:00-11:30':info.hospitalDistrict=='礼嘉分院'?'15:30-16:00':'17:00-17:30'}}</view>
                             */}

                            <div><span>刘小红</span>主任医师</div>
                            <div>hisName</div>
                            <div className="registerTime">预约时间：2018-09-10 11:00-11:30</div>
                        </div>
                        <div  className="status"> <p>待就诊</p></div>

                        {/*<div wx:if="{{info.isVisit=='0'&&info.isPay=='1'}}" className="status"> <p>待就诊</p></div>
                         <div wx:if="{{info.isVisit=='0'&&info.isPay=='0'}}"  className="status"><p>未付款</p></div>
                         <div wx:if="{{info.isVisit=='2'}}" className="status"> <p  className="disNo"  >已过期</p></div>
                         <div wx:if="{{info.isVisit=='3'}}" className="status"><p className="disNo"  >已退号</p></div>
                         <div wx:if="{{info.isVisit=='1'}}" className="status"> <p className="disNo">已就诊</p></div>*/}
                    </div>
                    <div className="main">

                        <div><span>就诊人：</span>patientName</div>
                        <div><span>联系电话：</span>phone</div>
                        <div><span>支付方式：</span>线上支付</div>
                        <div><span>院区：</span>hospitalDistrict</div>
                        <div><span>科室：</span>deptName</div>
                        <div><span>号别：</span>info.registLevel</div>
                        <div><span>订单号：</span>info.hospitalTradeno</div>
                        <div><span>就诊位置：</span>info.hisName medicalAddress deptName</div>
                        <div style={{lineHeight:'20px'}}><span>就诊指引：</span>请就诊当天到医生所在门诊，出示您的就诊卡　　　　　（或电子就诊卡）</div>
                        <div><span>挂号费用：</span>￥fees元</div>
                        {/*<div><span>就诊人：</span>{{info.patientName}}</div>
                         <div><span>联系电话：</span>{{info.phone}}</div>
                         <div><span>支付方式：</span>线上支付</div>
                         <div><span>院区：</span>{{info.hospitalDistrict}}</div>
                         <div><span>科室：</span>{{info.deptName}}</div>
                         <div><span>号别：</span>{{info.registLevel}}</div>
                         <div><span>订单号：</span>{{info.hospitalTradeno}}</div>
                         <div><span>就诊位置：</span>{{info.hisName}} {{info.medicalAddress}} {{info.deptName}}</div>
                         <div style="line-height:40rpx"><span>就诊指引：</span><text>请就诊当天到医生所在门诊，出示您的就诊卡\n　　　　　（或电子就诊卡）</text></div>
                         <div><span>挂号费用：</span>￥{{info.fees}} 元</div>*/}
                    </div>
                    <Link
                        className="m-mycard"
                        to={{ pathname: '/usercenter/userinfo' }}>
                        我的就诊卡
                    </Link>
                    <div className="confirm"  >
                        <img  src="../../../resources/images/confirm1.png"/>
                    </div>
                    <div className="confirm" >
                        <img  src="../../../resources/images/tui.png" />
                    </div>

                    {/*<navigator className="m-mycard" url="/pages/usercenter/userinfo/index?patientId={{info.patientId}}" wx:if="{{info.isVisit=='0'&&info.isPay=='1'}}">我的就诊卡</navigator>
                     <div className="confirm"  wx:if="{{info.orederStatus=='0'}}"><image  src="/resources/images/confirm1.png" bindtap="sure"></image></div>
                     <div className="confirm" wx:if="{{info.isVisit=='0'&&info.isPay=='1'}}"><image  src="/resources/images/tui.png" bindtap="returnM"></image></div>*/}

                    {/*<div className='modal' wx:if="{{isSure}}">*/}
                    <div className='modal' >
                        <div className='modal-body'>
                            <div className='modal-title'>提示</div>
                            <div className='modal-content'>您已确认加号</div>
                            <div className='modal-footer'>
                                <span >确定</span>
                            </div>
                        </div>
                    </div>
                    {/*<div className='modal' >*/}
                    <div className='modal' >
                        <div className='modal-body'>
                            <div className='modal-title'>温馨提示</div>
                            <div className='modal-content'>就诊当日只能在医院窗口退号。就诊卡
                                或身份证或电话号码30天内最多退号3次，如果
                                退号次数在30天内达到3次，则该就诊卡或
                                身份证或电话号码暂停预约挂号90天</div>
                            <div className='modal-footer'>
                                <span  style={{color:'rgb(102,102,102)'}}>确定</span>
                                <span style={{color:'rgb(77,171,199)'}}>取消</span>
                                {/*<span bindtap="sureAdd" style="color:rgb(102,102,102)">确定</span>
                                 <span bindtap="noSure" style="color:rgb(77,171,199)">取消</span>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

    );
  }
}

export default Connect()(Widget);
