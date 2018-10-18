import React, { Component } from 'react';
import { Button, Toptips } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';

import * as Api from './orderDetailApi';
import './style/index.scss';
class Widget extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      config: {},
      sexOption: [
        {
          dictKey: 'M',
          dictValue: '男',
        },
        {
          dictKey: 'F',
          dictValue: '女',
        },
      ],
      viewData: {
        onSubmit: false,
        showToptips: false,
        toptips: '',
        isNewCard: '0',
        noresult: {
          msg: '暂未获取到医院配置信息',
          show: false,
        },
        isloading: 0,
      },
    };
  }
  componentDidMount() {
   
  }
  componentWillUnmount() {
    // 离开页面时结束所有可能异步逻辑

  }
  getUser() { // 获取实名制
    Api
      .getUser()
      .then((res) => {
        console.log(res);
        this.setState({ user: res.data });
      }, e=> {
        console.log(e);
      });
  }
  getHisConfig() {
    const { viewData } = this.state;
    viewData.isloading = 1;
    this.setState({ viewData });
    this.showLoading();
    Api
      .getHisConfig()
      .then((res) => {
        this.hideLoading();
        viewData.isloading = 0;
        // 添加身份证的验证规则
        res.data.idTypes = res.data.idTypes.map((v) => {
          if (v.dictKey === '1') {
            v.validator = `[{'required':'',tip:'${v.dictValue}不能为空'},{'idcard':'',tip:'${v.dictValue}格式错误'}]`;
            v.maxLength = 18;
          } else {
            v.validator = `[{'required':'',tip:'${v.dictValue}不能为空'}]`;
            v.maxLength = 30;
          }
          return v;
        });
        this.setState({ viewData, config: res.data });
      }, (e) => {
        this.hideLoading();
        this.showPopup({ content: e.msg });
        viewData.isloading = 2;
        viewData.noresult.show = true;
        this.setState({ viewData });
      });
  }
  isZfb() {
    const { platformSource } = window.CONSTANT_CONFIG;
    return platformSource == 2;
  }
  switchPatientType(v) {
    this.setState({
      patientType: v,
    });
  }
  submitData(onSubmit) {
    if (onSubmit) {
      return false;
    }
    const ret = Validator(this.refs.dataForm);
    if (ret.result.length > 0) {
      this.setState({
        showToptips: true,
        toptips: ret.result[0].tip,
      });
      this.state.errorTimer = setTimeout(() => {
        this.setState({
          showToptips: false,
        });
      }, 2000);
      return false;
    }
    const { viewData } = this.state;
    viewData.onSubmit = true;
    this.setState({ viewData });
    this.showLoading();
    Api
      .addPatients(ret.data)
      .then(() => {
        viewData.onSubmit = false;
        this.setState({ viewData });
        this.showSuccess({
          title: '绑定成功',
          duration: 1500,
          complete: ()=>{
            this.context.router.goBack();
          }
        });
      }, (e) => {
        this.hideLoading();
        this.showPopup({ content: e.msg });
        viewData.onSubmit = false;
        this.setState({ viewData });
      });
  }
  isNewCard(e) {
    const { viewData } = this.state;
    viewData.isNewCard = e.target.value;
    this.setState({ viewData });
  }
  isSelf(relationType) {
    this.setState({
      isSelf: relationType.toString() === '1',
    });
  }
  isZfbSelf() {
    const { isSelf } = this.state;
    return this.isZfb() && isSelf;
  }
  filterChildWhenSelf() {
    const { config, isSelf } = this.state;
    const { patientTypes = [] } = config;
    if (isSelf) {
      return patientTypes.filter((v) => {
        return v && v.dictKey && v.dictKey.toString() !== '1';
      });
    } else {
      return patientTypes;
    }
  }
  render() {
 
    return (
        <div className="container page-order-detail">
            <div className="m-lefttime" style={{display:'none'}}>
                <div className="lefttime-zw"></div>
                <div className="lefttime">剩余支付时间 leftTime</div>
            </div>
            {/*<block wx:if="{{leftTimeFlag && orderDetail.orderStatus === 'U'}}">
             <div className="m-lefttime">
             <div className="lefttime-zw"></div>
             <div className="lefttime">剩余支付时间 {{leftTime}}</div>
             </div>
             </block>*/}

            <div className="wgt-detailstatus wgt-detailstatus-waiting">
                <div className="wgt-detailstatus-bd">
                    <div className="wgt-detailstatus-bd-icon">

                        <icon  size="30" color="#fff" />

                    </div>
                    <div className="wgt-detailstatus-bd-tit ">
                        <div name="title">statusName</div>
                    </div>
                </div>

                {/*<div className="wgt-detailstatus wgt-detailstatus-{{statusclassName}}">
                 <div className="wgt-detailstatus-bd">
                 <div className="wgt-detailstatus-bd-icon">
                 <block wx:if="{{statusclassNameName}}">
                 <icon type="{{statusclassNameName}}" size="30" color="#fff" />
                 </block>
                 </div>
                 <div className="wgt-detailstatus-bd-tit">
                 <div name="title">{{statusName}}</div>
                 </div>
                 </div>*/}


              
            </div>
            <div className="od-list">
                <div className="title">就诊信息</div>
                <div className="content">
                    <div className="list">
                        <div className="list-item">
                            <div className="item-label">咨询类型</div>
                            <div className="item-value">typeName </div>
                            {/*<div className="item-value">{{orderDetail.typeName}} </div>*/}
                        </div>
                        <div className="list-item">
                            <div className="item-label">咨询原因</div>
                            <div className="item-value">purpose</div>
                            {/*<div className="item-value">{{orderDetail.purpose}}</div>*/}
                        </div>
                        <div className="list-item">
                            <div className="item-label">医生姓名</div>
                            <div className="item-value">doctorName</div>
                            {/*<div className="item-value">{{orderDetail.doctorName}}</div>*/}
                        </div>
                        <div className="list-item">
                            <div className="item-label">科室名称</div>
                            <div className="item-value">deptName</div>
                            {/*<div className="item-value">{{orderDetail.deptName}}</div>*/}
                        </div>
                        <div className="list-item">
                            <div className="item-label">就诊人</div>
                            <div className="item-value">patientName</div>
                            {/*<div className="item-value">{{orderDetail.patientName}}</div>*/}
                        </div>
                        <div className="list-item">
                            <div className="item-label">就诊卡号</div>
                            <div className="item-value">patientCardNo</div>
                            {/*<div className="item-value">{{orderDetail.patientCardNo}}</div>*/}
                        </div>
                    </div>
                </div>
            </div>
            <div className="od-list">
                <div className="title">支付详情</div>
                <div className="content">

                    <div className="list">
                        <div className="list-item" >
                            <div className="item-label">订单创建时间</div>
                            <div className="item-value">createTime</div>
                        </div>
                        <div className="list-item" >
                            <div className="item-label">支付时间</div>
                            <div className="item-value">payTime</div>
                        </div>
                        <div className="list-item" >
                            <div className="item-label">支付金额</div>
                            <div className="item-value">￥100</div>
                        </div>
                        <div className="list-item" >
                            <div className="item-label">订单状态</div>
                            <div className="item-value">orderStatusName</div>
                        </div>
                        <div className="list-item" >
                            <div className="item-label">微信订单号</div>
                            <div className="item-value">tradeNo</div>
                        </div>
                        <div className="list-item" >
                            <div className="item-label">平台订单号</div>
                            <div className="item-value">orderId</div>
                        </div>

                        {/*<div className="list">
                         <div className="list-item" wx:if="{{orderDetail.createTime}}">
                         <div className="item-label">订单创建时间</div>
                         <div className="item-value">{{orderDetail.createTime}}</div>
                         </div>
                         <div className="list-item" wx:if="{{orderDetail.payTime}}">
                         <div className="item-label">支付时间</div>
                         <div className="item-value">{{orderDetail.payTime}}</div>
                         </div>
                         <div className="list-item" wx:if="{{orderDetail.totalFee}}">
                         <div className="item-label">支付金额</div>
                         <div className="item-value">￥{{WxsUtils.formatMoney(orderDetail.totalFee,100)}}</div>
                         </div>
                         <div className="list-item" wx:if="{{orderDetail.status}}">
                         <div className="item-label">订单状态</div>
                         <div className="item-value">{{orderDetail.orderStatusName}}</div>
                         </div>
                         <div className="list-item" wx:if="{{orderDetail.tradeNo}}">
                         <div className="item-label">微信订单号</div>
                         <div className="item-value">{{orderDetail.tradeNo}}</div>
                         </div>
                         <div className="list-item" wx:if="{{orderDetail.orderId}}">
                         <div className="item-label">平台订单号</div>
                         <div className="item-value">{{orderDetail.orderId}}</div>
                         </div>*/}

                    </div>
                </div>
            </div>
            <div className="empty-box"></div>

            <div className="footer-btn">
                <div className="fee-item">￥100</div>
                <div  className="repay-btn">立即支付</div>

                {/*<div className="footer-btn" wx:if="{{orderDetail.orderStatus == 'U' && leftTimeFlag}}">
                 <div className="fee-item">￥{{WxsUtils.formatMoney(orderDetail.totalFee,100)}}</div>
                 <div @tap="repay" className="repay-btn">立即支付</div>*/}
            </div>
        </div>

    );
  }
}
export default Connect()(Widget);