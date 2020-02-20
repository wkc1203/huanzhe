import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';

import * as Api from './collectIndexApi';
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
        <div className="p-page">

            <div className="m-search-content">
                {/*<div className='no-data'>
                    <img src='/resources/images/no-result.png' />
                    <div>暂未查询到相关信息</div>
                </div>
                {/*<block wx:if="{{docList.length <= 0}}">
                 <div className='no-data'>
                 <img src='/resources/images/no-result.png' />
                 <div>暂未查询到相关信息</div>
                 </div>
                 </block>*/}

                <Link  className='doc-item'>
                    <div className="doc-info">
                        <img className="doc-img" src="../../../resources/images/doc.png" alt="医生头像" />
                        <div className="text-box">
                            <div className='doc-name'>
                                name<div className="img-box"><img src="../../../resources/images/collect1.png" /></div>
                            </div>
                            <div className='doc-des'>deptName | level</div>
                            <div className='pinfen'>
                                <span>好评率：favoriteRate</span>咨询人数：12</div>
                            <div className='doc-des ellipsis'>specialty</div>
                        </div>
                    </div>
                    <div className='oper-box'>
                        图文问诊<span className="fee-des">￥100元/次 </span>
                        </div>
                    </Link>

                    {/*<block wx:else>
                     <block wx:for="{{docList}}" wx:for-index="idx" wx:for-item="item" wx:key="{{idx}}">
                     <navigator url="/pages/consult/deptdetail/deptdetail?doctorId={{item.doctorId}}&deptId={{item.deptId}}" className='doc-item'>
                     <div className="doc-info">
                     <img className="doc-img" src="{{item.img || '/resources/images/doc.png'}}" alt="医生头像" />
                     <div className="text-box">
                     <div className='doc-name'>
                     {{item.name}}<div className="img-box"><img @tap.stop="switchCollect('{{item.deptId}}','{{item.doctorId}}')" src="/resources/images/collect1.png" /></div>
                     </div>
                     <div className='doc-des'>{{item.deptName}} | {{item.level}}</div>
                     <div className='pinfen'>
                     <span>好评率：{{item.favoriteRate}}</span>咨询人数：{{item.serviceTimes}}</div>
                     <div className='doc-des ellipsis'>{{item.specialty ? item.specialty : '暂无描述'}}</div>
                     </div>

                     </div>
                     <div className='oper-box'>
                     <div wx:for="{{item.inquirys}}" wx:for-index="idx" wx:for-item="item1" wx:key="{{idx}}">
                     <block wx:if="{{item1.type == '1'}}">
                     <!--<img src='/resources/images/inquiry-bg.png' />-->图文咨询<span className="fee-des">￥{{WxsUtils.formatMoney(item1.remune,100)}}元/次 </span>
                     </block>
                     </div>
                     <block wx:if="{{item.type == '2'}}">
                     <div>
                     <span>|</span>
                     <!--<img src='/resources/images/video-gray.png' />-->视频问诊<span className="fee-des">￥{{WxsUtils.formatMoney(item1.remune,100)}}元/次 </span>
                     </div>
                     </block>
                     <block wx:if="{{item.type == '3'}}">
                     <div>
                     <span>|</span>
                     <!--<img src='/resources/images/video-gray.png' />-->电话问诊<span className="fee-des">￥{{WxsUtils.formatMoney(item1.remune,100)}}元/次 </span>
                     </div>
                     </block>

                     </navigator>
                     </block>
                     </block>*/}
                </div>
            </div>


            );
  }
}

export default Connect()(Widget);
