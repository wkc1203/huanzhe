import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';

import * as Api from './deptListApi';
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
        <div>
    <div className="m-search active" >
        <div className="search-ipt">
            <div className="ipt-icon">
                <img src="../../../resources/images/search.png" />
            </div>
            {/*<input className="ipt" @bindinput='getValue' placeholder="{{searchFocus ? '点击搜索科室/医生' : '点击搜索科室/医生'}}" @focus="bindSearchFocus" @input="bindSearchInput" value="{{searchValue}}" />*/}
            <input className="ipt"  placeholder="点击搜索科室/医生"   />
        </div>
    </div>
    <div className="page-dept-list">
          <div className="dept-modal">
              {/*<div className="dept-modal" wx:if="{{isFunnel}}" style="{{search1?'display:none;':''}}">*/}
              <div className="modal-pop">
                  <div className="modal-his-list">
                      <div className="list-item">重医儿童医院</div>
                  </div>
                  <div className="modal-dept-list">

                      <div className="list-item" >全部科室</div>
                      {/*<div className="list-item" @tap="selectDept('全部科室','')">全部科室</div>*/}
                      <div className="list-item" >name</div>
                      {/*<block wx:for="{{deptList || []}}" wx:for-index="index" wx:for-item="item" wx:key="index">
                       <div className="list-item" @tap="selectDept('{{item.name}}','{{item.no}}')">{{item.name}}</div>
                       </block>*/}
                  </div>
              </div>
          </div>
          <div className="m-search-content">
                  {/*<div className="m-search-content" wx:if="{{search1}}" >
                      <div className="wgt-empty-box">
                          <img  className="wgt-empty-img" src="../../../resources/images/no-result.png" alt=""></img>
                          <div className="wgt-empty-txt">暂未查询到相关信息
                          </div>
                      </div>*/}
              {/*<block wx:if="{{searchList.length <= 0&&searchDoctorList.length<=0 }}">
               <div className="wgt-empty-box">
               <img mode="widthFix" className="wgt-empty-img" src="../../../resources/images/no-result.png" alt=""></img>
               <div className="wgt-empty-txt">暂未查询到相关信息
               </div>
               </div>
               </block>*/}
                  <div className="search-content">

                      <div className="content">
                          <div className="title">科室</div>
                          <div className="title1">name</div>
                          <div className="space"></div>
                          <div className="title">医生</div>
                          <Link  className='doc-item'>
                              <div className="doc-info">
                                  <img className="doc-img" src="../../../resources/images/doc.png" alt="医生头像" />
                                  <div className="text-box">
                                      <div className='doc-name'>name
                                          <div className="status-item">已满</div>
                                      </div>
                                      <div className='doc-des'>deptName | level</div>
                                      <div className='pinfen'>
                                          <span>好评率：favoriteRate</span>咨询人数：serviceTimes</div>
                                      <div className='doc-des ellipsis'>暂无描述</div>
                                  </div>
                              </div>
                              <div className='oper-box'>
                                  <div >
                                      <text >图文咨询</text><span className="fee-des">￥100元/次 </span>
                                      <span className="f-color-gray" >￥100元/次 </span>
                                      <div>
                                          <span>|</span>
                                          视频问诊<span className="fee-des">100元/次 </span>
                                      </div>
                                      <div>
                                          <span>|</span>
                                          电话问诊<span className="fee-des">￥100元/次 </span>
                                      </div>
                                  </div>
                              </div>
                          </Link>
                          {/*</block>*/}
                      </div>
                     {/*</block>*/}
                  </div>
                      {/*</block>


                  {/*<block wx:else>
                   <div className="search-content">
                   <block wx:if="{{searchList.length > 0||searchDoctorList.length>0}}">
                   <div className="content">
                   <block wx:if="{{searchDoctorList.length>0}}">
                   <div className="title">科室</div>
                   <block wx:for="{{searchDoctorList || []}}" wx:for-index="index" wx:for-item="item" wx:key="index">
                   <div className="title1" @tap="selectDept('{{item.name}}','{{item.no}}')">{{item.name}}</div>
                   </block>
                   </block>
                   </block>
                   <div className="space"></div>
                   <div className="title " style="{{searchList.length>0?'':'display:none'}}">医生</div>
                   <block wx:for="{{searchList || []}}" wx:for-index="idx" wx:for-item="item" wx:key="{{idx}}">
                   <navigator url="/pages/consult/deptdetail/deptdetail?doctorId={{item.doctorId}}&deptId={{item.deptId}}" className='doc-item'>
                   <div className="doc-info">
                   <img className="doc-img" src="{{item.img}}" alt="医生头像" />
                   <div className="text-box">
                   <div className='doc-name'>{{item.name}}
                   <block wx:for="{{item.inquirys}}" wx:for-index="idx" wx:for-item="item1" wx:key="{{idx}}">
                   <block wx:if="{{item1.type == '1'}}">
                   <div className="status-item" wx:if="{{item1.isFull == '1'}}">已满</div>
                   <div className="status-active" wx:if="{{item1.isFull != '1' && item1.isOnDuty == '1'}}">在线</div>
                   <div className="status-item" wx:if="{{item1.isFull != '1' && item1.isOnDuty == '0'}}">离线</div>
                   </block>
                   </block>
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
                   <text className="{{item1.isOnDuty == '0' ? 'f-color-gray' : ''}}">图文咨询</text><span className="fee-des" wx:if="{{item1.isOnDuty == '1'}}">￥{{WxsUtils.formatMoney(item1.remune,100)}}元/次 </span>
                   <span className="f-color-gray" wx:if="{{item1.isOnDuty == '0'}}">￥{{WxsUtils.formatMoney(item1.remune,100)}}元/次 </span>
                   </block>
                   <block wx:if="{{item.type == '2'}}">
                   <div>
                   <span>|</span>
                   视频问诊<span className="fee-des">￥{{WxsUtils.formatMoney(item1.remune,100)}}元/次 </span>
                   </div>
                   </block>
                   <block wx:if="{{item.type == '3'}}">
                   <div>
                   <span>|</span>
                   电话问诊<span className="fee-des">￥{{WxsUtils.formatMoney(item1.remune,100)}}元/次 </span>
                   </div>
                   </block>
                   </div>
                   </div>
                   </Link>
                   </block>
                   </div>
                   </block>
                   </div>
                   </block>*/}
            </div>
        </div>
   </div>
    );
  }
}

export default Connect()(Widget);
