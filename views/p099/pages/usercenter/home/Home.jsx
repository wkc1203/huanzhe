import React, { Component } from 'react';
import { InfiniteLoader, LoadMore } from 'react-weui';
import { Link } from 'react-router';
import hashHistory from 'react-router/lib/hashHistory';

import Connect from '../../../components/connect/Connect';
import NoResult from '../../../components/noresult/NoResult';

import * as Api from './homeApi';
import './style/index.scss';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noResult: {
        msg: '暂未获取到相关信息',
        show: false,
      },
      articleTypeList: [],
        userInfo:{},
        userId:{},
        defaultUser: {},
        patNum: 0,
        leftBindNum: 0,
        articleData: {},
        pList:{},
        login_access_token:this.props.location.query.login_access_token,
    };
  }

  componentDidMount() {
    //this.getArticleTypeList();
      //alert(this.props.location.query.login_access_token);
     /* alert("ddd"+this.state.login_access_token);

      //写入b字段
      alert("st",storage.login_access_token);
      if(storage.login_access_token==''&&this.state.login_access_token!=''){
          storage.login_access_token=this.state.login_access_token;
      }*/
      //alert("ee");
      var storage=window.localStorage;
      var  param={login_access_token:storage["login_access_token"]||''};
     //alert('s'+param.login_access_token);
     this.isRegistered();

  }

  componentWillUnmount() {

  }
    toNext(type){
        if(type==1){

                hashHistory.replace({
                    pathname: '/home/index'
                });
        }
       if(type==2){
           hashHistory.replace({
               pathname: '/inquiry/inquirylist'
           });
       }


    }
    isRegistered() {
        //alert("ee");
        //var storage=window.localStorage;
        //alert('s'+storage.login_access_token);
        this.showLoading();
        Api
            .isRegistered()
            .then((res) => {
                this.hideLoading();

                   if(res.code==0){
                       this.showLoading();
                       this.getUser();
                       this.getCardList();
                   }
            }, (e) => {
                //alert("e"+JSON.stringify(e));
                this.hideLoading();
            });
    }
    isRegistered1() {
        //alert("ee");
        //var storage=window.localStorage;
        //alert('s'+storage.login_access_token);
        this.showLoading();
        Api
            .isRegistered()
            .then((res) => {
                this.hideLoading();

                if(res.code==0){
                    this.showLoading();
                   this.getCardList1();
                }
            }, (e) => {
                //alert("e"+JSON.stringify(e));
                this.hideLoading();
            });
    }
    getCardList1() {
        Api
            .getCardList1()
            .then((res) => {
                this.hideLoading();
                if(res.code==0){
                     if(res.data.length>0){
                         hashHistory.replace({
                             pathname: '/usercenter/samecard',
                             query:{left:2}
                         });
                     }else{
                         hashHistory.replace({
                             pathname: '/usercenter/addcard',
                             query:{type:0}
                         });
                     }

                }
            },(e) => {
                //alert("e"+JSON.stringify(e));
                this.hideLoading();
            });
    }
    getCardList() {
        Api
            .getCardList()
            .then((res) => {
                this.hideLoading();
                if(res.code==0){
                     this.setState({
                         leftBindNum:res.data.leftBindNum,
                         patNum:res.data.length,
                         defaultUser:res.data[0],
                         pList:JSON.stringify(res.data.cardList)
                     })
                      console.log(this.state.pList);
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].isDefault == 1) {
                            this.setState({
                             defaultUser:res.data[0]
                            })
                            break;
                        }
                    }

                }
            },(e) => {
                //alert("e"+JSON.stringify(e));
                this.hideLoading();
            });
    }
    addCard(){
      this.isRegistered1();
}
    getUser(){
        Api
            .getUser()
            .then((res) => {
                 console.log(res);
                 if(res.code==0){
                     this.hideLoading();
                     this.setState({
                         userInfo:res.data,
                         userId:res.data.id
                     })
                 }

            }, (e) => {
                //alert("e"+JSON.stringify(e));

            });

    }

  render() {
       const {userInfo,userId,patNum,defaultUser,leftBindNum}=this.state;
    return (
        <div className="h-page">

          <div className="m-wxinfo">
            <div className="user-info">
              <img className="m-wxicon" src={userInfo.headImage} />
                {userInfo.realName&&<div className="m-nickname" >{userInfo.realName}</div>}
                {!userInfo.realName&&<Link className="m-nickname unlogin"
                    to={{pathname:'login/loginindex'}}>注册</Link>}
                {userInfo.mobile&&<div className="m-phone" >{userInfo.mobile}<img src="../../../resources/images/edit.png" /></div>}

              {/*<img className="m-wxicon" src="{{userInfo.headimg}}" />
               <div className="m-nickname" wx:if="{{userInfo.realName}}">{{userInfo.realName}}</div>
               <navigator className="m-nickname unlogin" url="/pages/login/login" wx:if="{{!userInfo.realName}}">注册</navigator>
               <div className="m-phone" @tap="modalOpen" wx:if="{{userInfo.mobile}}">{{userInfo.mobile || ''}}<img src="../../../resources/images/edit.png" /></div>
               */}
            </div>
          </div>
            {leftBindNum <0&&<Link className="m-mycard"
                to={{pathname:'usercenter/userlist'}}>我的就诊人({patNum}人)</Link>}
            {leftBindNum < 0 &&
            <div className="m-card1">
                <div className="card-info">
                    <div className="info-main">
                        <div className="main-name">
                            <div className="name">{defaultUser.patientName}</div>
                        </div>
                    </div>
                    <div className="info-extra">{defaultUser.patCardTypeName || '就诊卡'}：{defaultUser.patCardNo}</div>
                </div>
            </div>
            }
            {leftBindNum==2&&<div className="m-nocard"  onClick={()=>{
             this.addCard()
            }}>
                <div className="t1">绑定就诊卡</div>
                <div className="t2">绑定就诊卡立即享重医儿童医院专家为您一对一服务</div>
            </div>
            }
          {/*</block>*/}
                     <div className="m-function">
                         <Link className="function-list"  to={{
                          pathname:'/ordermng/orderlist'
                         }} >
                             <div className="list-item">
                                 <div className="item">
                                     <div className="item-icon">
                                       <img style={{width:'18px',height:'18px;'}}
                                        src="../../../resources/images/inquiry-mng.png"></img>
                                     </div>
                                     <div className="item-main">
                                        <div className="main-title">咨询管理</div>
                                     </div>
                                 </div>
                             </div>
                         </Link>
                     {/*<block wx:if="{{leftBindNum==2}}">*/}
                    {/*<div className="m-nocard" @tap="isRegister">
                     <div className="t1">绑定就诊卡</div>
                     <div  className="t2">绑定就诊卡立即享重医儿童医院专家为您一对一服务</div>
                     </div>

                     </block>
                     <div className="m-function">
                     <navigator className="function-list" url="/pages/ordermng/orderlist/orderlist">
                     <div className="list-item">
                     <div className="item">
                     <div className="item-icon">
                     <img style="width:36rpx;height:36rpx;"
                     src="../../../resources/images/inquiry-mng.png"></img>
                     </div>
                     <div className="item-main">
                     <div className="main-title">咨询管理</div>
                     </div>
                     </div>
                     </div>
                     </navigator>*/}
                  </div>
                  <div className="m-function">
                    <Link className="function-list"
                        to={{pathname:'/add/manageList'}}>
                    {/*<navigator className="function-list" url="/pages/add/manageList/manageList?pList={{pList}}&userId={{userId}}">*/}
                      <div className="list-item">
                        <div className="item">
                          <div className="item-icon">
                            <img style={{width:'18px',height:'18px;'}}
                          src="../../../resources/images/add2.png"></img>
                          </div>
                          <div className="item-main">
                          <div className="main-title">加号管理</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  {/*</navigator>*/}
                    </div>
                    <div className="m-function">
                    <Link className="function-list"
                        to={{pathname:'/usercenter/collect'}}>
                    {/*<navigator className="function-list" url="/pages/usercenter/collect/index">*/}
                    <div className="list-item">
                    <div className="item">
                    <div className="item-icon">
                      <img style={{width:'18px',height:'18px;'}}
                    src="../../../resources/images/collect.png"></img>
                    </div>
                    <div className="item-main">
                    <div className="main-title">我的收藏</div>
                    </div>
                    </div>
                    </div>
                    </Link>
                    {/*</navigator>*/}
                    </div>
                    <div className="m-function">
                    <Link className="function-list"
                        to={{pathname:'/usercenter/complain'}}>
                    {/*<navigator className="function-list" url="/pages/usercenter/complain/index">*/}
                    <div className="list-item">
                    <div className="item">
                    <div className="item-icon">
                      <img style={{width:'18px',height:'18px;'}}
                    src="../../../resources/images/complain.png"></img>
                    </div>
                    <div className="item-main">
                    <div className="main-title">投诉建议</div>
                    </div>
                    </div>
                    </div>
                    </Link>
                    {/*</navigator>*/}

                    </div>
                    <div className='modal' >
                    {/*<div className='modal' wx:if="{{isShow}}">*/}
                    <div className='modal-body'>
                    <div className='modal-img'><img src="../../../resources/images/mobile.png" /></div>
                    <div className='modal-content'>您的手机号：mobile</div>
                    {/*<div className='modal-content'>您的手机号：{{userInfo.mobile}}</div>*/}

                    <div className='modal-btn'>
                    <div>更换手机号</div>
                    {/*<div @tap="updateMobile">更换手机号</div>*/}

                    </div>
                    </div>
                    <div className="modal-close">
                    <div className="modal-close-line"></div>
                    <div className="modal-close-icon" >
                    {/*<div className="modal-close-icon" @tap="modalClose">*/}

                    <img mode="widthFix" src="../../../resources/images/close.png"></img>
                    </div>
                    </div>

                    </div>
                    <div className='modal'>

                    <img className="bindTip" src="../../../resources/images/bindTip.png"></img>
                    <img  className="know" src="../../../resources/images/know.png"></img>

                    {/* <div className='modal' wx:if="{{showTip}}">

                     <img className="bindTip" src="../../../resources/images/bindTip.png"></img>
                     <img @tap="hideTip" className="know" src="../../../resources/images/know.png"></img>
                     */}
                    </div>
          <div className="tarbar">
            <div  onClick={
              ()=> {
                this.toNext(1);
              }
            }>

              <img
                  src="../../../resources/images/index.png"
                  />
              <div >首页</div>

            </div>
            <div  onClick={
              ()=> {
                this.toNext(2);
              }
            }>
              <img
                  src="../../../resources/images/inquiry.png"/>
              <div >咨询会话</div>

            </div>
            <div>

              <img
                  src="../../../resources/images/my-active.png"/>
              <div style={{color:'#4FABCA'}}>我的</div>
            </div>
          </div>
                    </div>

                    );
  }
}

export default Connect()(Widget);
