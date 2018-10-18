import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';

import * as Api from './payApi';
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
        <div className='p-page page-pay'>
            <div className='fee-box'>
                <div className="warm-tip">
                    <div className="lefttime">请在 leftTime秒内完成支付</div>
                </div>
                {/*<block wx:if="{{orderInfo.leftPayTime && leftTimeFlag}}">
                 <div className="warm-tip">
                 <div className="lefttime">请在 {{leftTime}} 秒内完成支付</div>
                 </div>
                 </block>*/}

                <div className='fee-item'>
                    <div className='des-fee'>支付金额（元）</div>
                    100
                    {/*{{WxsUtils.formatMoney(totalFee,100)}}*/}
                </div>

            </div>
            <div className="m-list">
                <div className="content">
                    <div className="list">
                        <div className="list-item">
                            <div className="item-label">医生姓名</div>
                            <div className="item-value">orderInfo.doctorName</div>
                            {/*<div className="item-value">{{orderInfo.doctorName}}</div>*/}
                        </div>
                        <div className="list-item">
                            <div className="item-label">科室名称</div>
                            <div className="item-value">deptName</div>
                            {/*<div className="item-value">{{orderInfo.deptName}}</div>*/}
                        </div>
                        <div className="list-item">
                            <div className="item-label">业务类型</div>
                            <div className="item-value">typeName</div>
                            {/*<div className="item-value">{{orderInfo.typeName}}</div>*/}
                        </div>
                    </div>
                </div>
            </div>
            <div className="m-list">
                <div className="content">
                    <div className="list">
                        <div className="list-item">
                            <div className="item-label">就诊人</div>
                            <div className="item-value">patientName</div>
                            {/* <div className="item-value">{{orderInfo.patientName}}</div>*/}
                        </div>
                        <div className="list-item">
                            <div className="item-label">就诊卡号</div>
                            <div className="item-value">patCardNo</div>
                            {/*<div className="item-value">{{orderInfo.patCardNo}}</div>*/}
                        </div>
                    </div>
                </div>
            </div>

            <div className='btn'>
                <button  className="submit-btn">
                    立即支付
                </button>
                {/* <block wx:if="{{orderInfo.canPayFlag == '1' && (!orderInfo.leftPayTime || (orderInfo.leftPayTime && leftTimeFlag))}}">
                 <button @tap="confirmPay" className="submit-btn">
                 立即支付
                 </button>
                 </block>
                 <block wx:else>
                 <button disabled className="submit-btn">
                 立即支付
                 </button>
                 </block>*/}


                <div className="empty-box"></div>
            </div>
        </div>
    );
  }
}

export default Connect()(Widget);
