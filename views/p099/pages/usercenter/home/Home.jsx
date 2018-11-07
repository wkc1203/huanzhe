import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import { Link } from 'react-router';
import hashHistory from 'react-router/lib/hashHistory';

import Connect from '../../../components/connect/Connect';
import NoResult from '../../../components/noresult/NoResult';

import * as Api from './homeApi';
import './style/index.scss';

class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
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
        showToast: false,
        showLoading: false,
        toastTimer: null,
        loadingTimer: null,
        showIOS1: false,
        showIOS2: false,
        showAndroid1: false,
        showAndroid2: false,
        style1: {
            buttons: [
                {
                    label: '确定',
                    onClick: this.hideDialog.bind(this)
                }
            ]
        },
        style2: {
            title: '提示',
            buttons: [
                {
                    type: 'default',
                    label: '取消',
                    onClick: this.hideDialog.bind(this)
                },
                {
                    type: 'primary',
                    label: '确定',
                    onClick: this.hideDialog.bind(this)
                }
            ]
        },
        msg:'',
        login_access_token:this.props.location.query.login_access_token,
    };
  }

  componentDidMount() {
      //this.getJs();
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
    getJs(){

        Api
            .getJsApiConfig({url:'https://tih.cqkqinfo.com/views/p099/'})
            .then((res) => {
                console.log(res);
                if(res.code==0){
                    //写入b字段
                    console.log("str",res.data);
                    wx.config({
                        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId:res.data.appId, // 必填，公众号的唯一标识
                        timestamp:res.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr:res.data.noncestr, // 必填，生成签名的随机串
                        signature:res.data.signature,// 必填，签名
                        jsApiList: ['hideMenuItems','showMenuItems','previewImage','uploadImage','downloadImage'] // 必填，需要使用的JS接口列表
                    });
                    wx.ready(function(){
                        //批量隐藏功能
                        wx.hideMenuItems({
                            menuList: ["menuItem:share:QZone","menuItem:share:facebook","menuItem:favorite","menuItem:share:weiboApp","menuItem:share:qq","menuItem:share:timeline","menuItem:share:appMessage","menuItem:copyUrl", "menuItem:openWithSafari","menuItem:openWithQQBrowser"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                        });
                    });

                }


                //this.setState({ hospInfo: res.data });
            }, (e) => {
                this.hideLoading();
                alert("r"+JSON.stringify(e));
                //this.showPopup({ content: e.msg });
            });



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
        console.log(this.state);
        this.setState({
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            showAndroid2: false,
        });
    }
    isRegistered() {

        Api
            .isRegistered()
            .then((res) => {


                   if(res.code==0){

                       this.getUser();
                       this.getCardList();
                   }
            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });
    }
    isRegistered1() {

        Api
            .isRegistered()
            .then((res) => {

                if(res.code==0){

                   this.getCardList1();
                }
            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });
    }
    getCardList1() {
        Api
            .getCardList1()
            .then((res) => {

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
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
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
                         patNum:res.data.cardList.length,
                         defaultUser:res.data.cardList[0],
                         pList:res.data.cardList
                     })


                }
            },(e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
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
                     this.setState({
                         userInfo:res.data,
                         userId:res.data.id
                     })
                     var storage=window.localStorage;
                     //写入b字段
                     storage.userInfo=JSON.stringify(res.data);

                 }

            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })

            });

    }

    modalOpen(){
        this.setState({
            isShow:true
        })
    }
    updateMobile() {
        this.setState({
            isShow:false
        });
        this.context.router.push({
            pathname:'usercenter/newphone'
        })

    }
    modalClose(){
        this.setState({
            isShow:false
        });
    }

  render() {
       const {userInfo,userId,msg,isShow,patNum,defaultUser,leftBindNum}=this.state;
      console.log("patNum",patNum);
      return (
        <div className="h-page">
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
          <div className="m-wxinfo">
            <div className="user-info">
              <img className="m-wxicon" src={userInfo.headImage} />
                {userInfo.realName&&<div className="m-nickname" >{userInfo.realName}</div>}
                {!userInfo.realName&&<Link className="m-nickname unlogin"
                    to={{pathname:'login/loginindex'}}>注册</Link>}
                {userInfo.mobile&&<div className="m-phone"
                    onClick={()=>{
                   this.modalOpen();

                    }}
                    >{userInfo.mobile}<img src="../../../resources/images/edit.png" /></div>}

              {/*<img className="m-wxicon" src="{{userInfo.headimg}}" />
               <div className="m-nickname" wx:if="{{userInfo.realName}}">{{userInfo.realName}}</div>
               <navigator className="m-nickname unlogin" url="/pages/login/login" wx:if="{{!userInfo.realName}}">注册</navigator>
               <div className="m-phone" @tap="modalOpen" wx:if="{{userInfo.mobile}}">{{userInfo.mobile || ''}}<img src="../../../resources/images/edit.png" /></div>
               */}
            </div>
          </div>
            {leftBindNum<2&&<Link className="m-mycard"
                to={{pathname:'usercenter/userlist'}}>我的就诊人({patNum}人)</Link>}
            {leftBindNum < 2 &&
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

                  </div>
            {false&&<div className="m-function">
                    <Link className="function-list"
                        to={{pathname:'/add/manageList'}}>
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
                    </div>}
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
            {isShow&&<div className='modal' >
                    <div className='modal-body'>
                    <div className='modal-img'><img src="../../../resources/images/mobile.png" /></div>
                    <div className='modal-content'>您的手机号：{userInfo.mobile}</div>

                    <div className='modal-btn'>
                    <div onClick={()=>{
                    this.updateMobile()

                    }}>更换手机号</div>
                    </div>
                    </div>
                    <div className="modal-close">
                    <div className="modal-close-line"></div>
                    <div className="modal-close-icon"  onClick={()=>{
                   this.modalClose()

                    }}>
                    <img mode="widthFix" src="../../../resources/images/close.png"></img>
                    </div>
                    </div>

                    </div>}

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
