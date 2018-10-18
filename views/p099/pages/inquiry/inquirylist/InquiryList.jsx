import React, { Component } from 'react';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import { Link } from 'react-router';
import hashHistory from 'react-router/lib/hashHistory';

import * as Api from './inquiryListApi';
import './style/index.scss';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hospInfo: {},
    };
  }

  componentDidMount() {

  }
  toNext(type){
    if(type==1){

      hashHistory.replace({
        pathname: '/home/index'
      });
    }
    if(type==3){
      hashHistory.replace({
        pathname: '/usercenter/home'
      });
    }


  }
  getHospIntro() {
    this.showLoading();
    Api.getHisInfo()
      .then((res) => {
        this.hideLoading();
        if (res.data) {
          this.setState({ hospInfo: res.data });
        }
      }, (e) => {
        this.hideLoading();
        this.showPopup({ content: e.msg });
      });
  }

  render() {

    return (
        <div className="container page-inquiry-list">

          {/*<block wx:for="{{msgList}}" wx:for-index="idx" wx:for-item="item" wx:key="{{idx}}" wx:if="{{item.type == '1'}}">*/}
          <div className='doc-item'>
            <Link >

              {/*<navigator url="/pages/inquiry/chat/chat?inquiryId={{item.id}}&orderId={{item.orderIdStr}}&name={{item.doctorName}}&status={{item.status}}">
               */}
              <div className="doc-info">
                <img className="doc-img"
                     src="../../../resources/images/doc.png" alt="医生头像" />
                {/*<img className="doc-img" src="{{item.doctor.img || '/resources/imgs/doc.png'}}" alt="医生头像" />*/}
                <div className="text-box">
                  <div className='doc-name'>doctorName</div>
                  <div className='doc-des'>deptName | level</div>

                  {/*<div className='doc-name'>{{item.doctorName}}</div>
                   <div className='doc-des'>{{item.deptName}} {{item.doctor.level ? '|' : ''}} {{item.doctor.level}}</div>
                   */}
                </div>

                <div className="status-inquiry"> 咨询中</div>


                  {/*<div className="status-inquiry" wx:if="{{item.status == '0' || item.status == '1'}}">咨询中</div>
                   <div className="status-inquiry complete" wx:if="{{item.status == '3' || item.status == '2'}}">已完成</div>*/}
                </div>
                <div className="msg-item">
                  <div className='msg-box'>
                    <div className='msg-text'>content</div>
                    <div className="read-status" >未读</div>

                    {/*<div className='msg-text'>{{item.content ? item.content : '[图片]'}}</div>
                     <div className="read-status" wx:if="{{item.userReaded == '0'}}">未读</div>*/}
                  </div>
                  <div className="msg-date">createDate</div>
                  {/*<div className="msg-date">{{item.createDate}}</div>*/}
                </div>
                </Link>
                {/*</navigator>*/}
                <div className="oper-box">
                  <div>
                    图文咨询 | 就诊人：patientName
                  </div>
                  {/*<div>
                   图文咨询 | 就诊人：{{item.patientName}}
                   </div>*/}

                  <div className="evaluate-item" >
                    <Link  className='evaluate' >评价</Link>
                  </div>
                  {/*<div className="evaluate-item" wx:if="{{item.status == '2'}}">
                   <navigator url="/pages/ordermng/evaluate/evaluate?orderId={{item.orderIdStr}}" className='evaluate' >评价</navigator>
                   </div>*/}
                </div>
              </div>
          {/* </block>*/}
          {/*<div  className='no-data'>
              <img src='../../../resources/images/no-result.png' />
              <div>暂未查询到相关信息</div>
            </div>
           <div wx:if="{{msgList.length <= 0}}" className='no-data'>
             <img src='/resources/imgs/no-result.png' />
             <div>暂未查询到相关信息</div>
             </div>*/}
          <div className="tarbar">
            <div  onClick={
             ()=>{
             this.toNext(1)

             }
            } >
              <img
                  src="../../../resources/images/index.png"
                  />
              <div >首页</div>
            </div>
            <div >
              <img
                  src="../../../resources/images/inquiry-active.png"/>
              <div style={{color:'#4FABCA'}}>咨询会话</div>
            </div>
            <div  onClick={
             ()=>{
             this.toNext(3)

             }
            } >
              <img
                  src="../../../resources/images/my.png"/>
              <div>我的</div>
            </div>
          </div>
          </div>

          );
  }
}

export default Connect()(Widget);
