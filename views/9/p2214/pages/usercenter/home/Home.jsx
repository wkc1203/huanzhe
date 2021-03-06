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
        userId:"",
        cardType:1,
        cardNo:'0014492503',
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
        cardShow:false,
        codeUrl:'',
        style1: {
            buttons: [
                {
                    label: '确定',
                    onClick: this.hideDialog.bind(this)
                }
            ]
        },
        style2: {
            title: '添加就诊人',
            buttons: [
                {
                    type: 'primary',
                    label: '已有就诊卡',
                    onClick: this.isAdd.bind(this)
                },
                {
                    type: 'primary',
                    label: '申请就诊卡',
                    onClick: this.goMain.bind(this)
                }
            ]
        },
        msg:'',
        phoneShow:false,//查看报告手机验证
        login_access_token:this.props.location.query.login_access_token,
    };
  }

  componentDidMount() {

      console.log("openid",window.openId);
      this.getJs();
      if(this.props.location.query.cardType==1&&this.props.location.query.cardNo!=''){
          this.showLoading();
          this.syncUser(this.props.location.query.cardNo);
      }
     this.isRegistered();
      /*document.getElementsByClassName('weui-mask')[0].on('click',function(){
          this.setState({
              showIOS2:false
          })

      }) */
      var that=this;
      document.addEventListener('click',function(e){

          console.log( e.target.className);
          if(e.target.className=='weui-mask'){
              that.setState({
                  showIOS2:false
              })
          }
      });
  }

  componentWillUnmount() {

  }
    addPerson(param){
        Api
            .sameCard(param)
            .then((res) => {
                if (res.code == 0) {
                    this.hideLoading();
                  this.getCardList()
                }
            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });
    }
    syncUser(cardNo){
        Api
            .getCardList1()
            .then((res) => {
                if(res.code==0) {

                    if (res.data.length > 0) {

                        for (var i = 0; i < res.data.length; i++) {
                            if (cardNo == res.data[i].patCardNo){
                                    for(var val in res.data[i]){
                                        if(res.data[i][val]==null){
                                            delete  res.data[i][val];
                                        }
                                    }
                               this.addPerson(res.data[i])
                            }
                        }
                    }else {
                        this.hideLoading();
                    }
                }
            },(e) => {
                this.hideLoading();
            });

    }
    getJs() {
        console.log(window.location.href.substring(0,window.location.href.indexOf("#")-1))
        Api
            .getJsApiConfig({url:window.location.href.substring(0,window.location.href.indexOf("#")-1)})
            .then((res) => {
                if (res.code == 0) {
//写入b字段
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: res.data.appId, // 必填，公众号的唯一标识
                        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: res.data.noncestr, // 必填，生成签名的随机串
                        signature: res.data.signature,// 必填，签名
                        jsApiList: ['hideMenuItems', 'showMenuItems'] // 必填，需要使用的JS接口列表
                    });
                    wx.ready(function () {
//批量隐藏功能
                        wx.hideMenuItems({
                            menuList: ["menuItem:share:QZone", "menuItem:share:facebook", "menuItem:favorite", "menuItem:share:weiboApp", "menuItem:share:qq", "menuItem:share:timeline", "menuItem:share:appMessage", "menuItem:copyUrl", "menuItem:openWithSafari", "menuItem:openWithQQBrowser"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                        });
                    });
                }
            }, (e) => {

            });
    }
    goMain(){
       window.location.href='http://wx.cqkqinfo.com/wx3/p/03/p/card_choose.cgi'
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
    isAdd(){
        this.setState({
            showIOS2:false
        })
        this.context.router.push({
            pathname:'usercenter/addcard',
            query:{
                type:0,
            }
        })

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
    isRegistered() {
        Api
            .isRegistered()
            .then((res) => {
                   if(res.code==0){
                       this.getUser();
                       this.getCardList();
                   }
            }, (e) => {
            });
    }
    /*是否注册*/
    isRegistered1() {
        Api
            .isRegistered()
            .then((res) => {
                if(res.code==0){
                   this.getCardList1();
                }
            }, (e) => {

            });
    }
    /*跳转就诊人页面*/
    getCardList1() {
        Api
            .getCardList1()
            .then((res) => {
                if(res.code==0){
                    this.hideLoading();
                     if(res.data.length>0){
                         hashHistory.push({
                             pathname: '/usercenter/samecard',
                             query:{left:2}
                         });
                     }else{
                         this.setState({
                             showIOS2:true
                         })
                     }
                }
            },(e) => {
                this.hideLoading();
            });
    }
    /*获取就诊人列表*/
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

            });
    }

    addCard(){
        this.showLoading();
        Api
            .getOpenId({openId: window.localStorage.getItem('openId')})
            .then((res) => {
                if (res.code == 0) {
                    if (res.data.subscribe == 0) {
                        if(window.localStorage.getItem('times')>=1) {
                             this.hideLoading();
                            this.setState({
                                showIOS2: true
                            })
                        }else{
                            this.setState({
                                cardShow: true
                            })
                            var storage = window.localStorage;
                            //加入缓存
                            storage.times = window.localStorage.getItem('times') + 1 || 1;
                            Api
                                .getCode({
                                    url: window.location.href
                                })
                                .then((res) => {
                                    if (res.code == 0) {
                                        this.hideLoading();
                                        this.setState({
                                            codeUrl: res.data.url
                                        })
                                        console.log(res)
                                    }
                                }, (e) => {
                                });
                        }
                    } else {
                        
                        this.isRegistered1();
                    }
                    console.log(res.code)
                }
            }, (e) => {
                console.log(e)
            });

}
    /*获取用户信息*/
    getUser(){
        Api
            .getUser()
            .then((res) => {
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

            });
    }
    modalOpen(){
        this.setState({
            isShow:true
        })
    }
    /*修改手机号*/
    updateMobile() {
        this.setState({
            isShow:false
        });
        this.context.router.push({
            pathname:'usercenter/newphone'
        })

    }
    /*关闭弹框*/
    modalClose(){
        this.setState({
            isShow:false
        });
    }
    /**验证手机密码 */
    checkPassword(e){
        this.setState({
            phoneShow:false
        })
        //验证密码
        //成功 跳转
        this.context.router.push({
            pathname:'/report/reportList'
        })
    }

  render() {
       const {phoneShow,userInfo,codeUrl,cardShow,msg,isShow,patNum,defaultUser,leftBindNum,pList,userId}=this.state;
      return (
        <div className="h-page">

            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
            <Dialog type="ios" title={this.state.style2.title} buttons={this.state.style2.buttons} show={this.state.showIOS2}>
            </Dialog>
          <div className="m-wxinfo">
            <div className="user-info">
              <img className="m-wxicon" src={userInfo.headImage?userInfo.headImage:'./././resources/images/defautImg.png'} />
                {userInfo.realName&&<div className="m-nickname" >{userInfo.realName}</div>}
                {!userInfo.realName&&<Link className="m-nickname unlogin"
                    to={{pathname:'login/loginindex'}}>注册</Link>}
                {userInfo.mobile&&<div className="m-phone"
                    onClick={()=>{
                   this.modalOpen();
                    }}
                    >{userInfo.mobile}<img src="../../../resources/images/edit.png" /></div>}
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
                     <div className="m-function">
                         <Link className="function-list"  to={{
                          pathname:'/ordermng/orderlist',
                          query:{userId:userId}
                         }} >
                             <div className="list-item">
                                 <div className="item">
                                     <div className="item-icon">
                                       <img style={{width:'18px',height:'18px;'}}
                                        src="../../../resources/images/inquiry-mng.png"></img>
                                     </div>
                                     <div className="item-main">
                                        <div className="main-title">订单管理</div>
                                     </div>
                                 </div>
                             </div>
                         </Link>
                  </div>
            {/*<div className="m-function">
                    <Link className="function-list"
                        to={{pathname:'/add/manageList',query:{userId:userId}}}>
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
                    </div>

                    
                */}
                <div className="m-function" onClick={()=>{
                    /*this.setState({
                        phoneShow:true
                    })*/
                }}>
                <Link className="function-list"
                    to={{
                        pathname:'/report/reportList',
                        query:{userId:userId}
                    }}
                    >
                  <div className="list-item">
                    <div className="item">
                      <div className="item-icon">
                        <img style={{width:'18px',height:'18px;'}}
                      src="../../../resources/images/report.png"></img>
                      </div>
                      <div className="item-main">
                      <div className="main-title">检验检查报告</div>
                      </div>
                    </div>
                  </div>
                </Link>
                </div>
                    <div className="m-function">
                    <Link className="function-list"
                        to={{pathname:'/usercenter/collect'}}>
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
                    </div>
                    <div className="m-function">
                    <Link className="function-list"
                        to={{pathname:'/usercenter/complain'}}>
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
                    </div>
            {cardShow && <div className='modal'
                              onClick={(e)=>{
                    this.setState({
                     cardShow:false
                    })
                    }}>
                <div className='modal-body-register'
                     onClick={(e)=>{
                    e.stopPropagation()
                    }}
                    >
                    <div className='modal-img-register'>
                        {codeUrl&&<img src={codeUrl||'./././resources/images/code.jpg'}/>}
                        <p>长按识别二维码关注公众号</p>
                    </div>
                    <div className='modal-content-register'>
                        关注后可以同步您的儿童医院就诊卡
                    </div>
                    <div className='modal-btn-register'>
                        <div onClick={(e)=>{
                        e.stopPropagation();
                        this.setState({
                           cardShow:false,
                           showIOS2:true
                        })
                        }}>暂不关注
                        </div>
                    </div>
                </div>
            </div>}
            {isShow && <div className='modal' onClick={()=>{
            this.setState({
             isShow:false
            })
            }} >
                <div className='modal-body'
                    onClick={(e)=>{
                    e.stopPropagation()
                    }}>
                    <div className='modal-img'><img src="../../../resources/images/mobile.png"/></div>
                    <div className='modal-content'>您的手机号：{userInfo.mobile}</div>
                    <div className='modal-btn'>
                        <div onClick={(e)=>{
                        e.stopPropagation();
            this.updateMobile()
            }}>更换手机号
                        </div>
                    </div>
                </div>
                <div className="modal-close">
                    <div className="modal-close-line"></div>
                    <div className="modal-close-icon" onClick={()=>{
           this.modalClose()
            }}>
                        <img mode="widthFix" src="../../../resources/images/close.png"></img>
                    </div>
                </div>
            </div>}
            {phoneShow && <div className='modal' onClick={()=>{
                this.setState({
                    phoneShow:false
                })
                }} >
                    <div className='modal-body'
                        onClick={(e)=>{
                        e.stopPropagation()
                        }}>
                        <div className='modal-content'>
                          <div className='modal-title'>
                             <p className='title'>短信验证</p>
                             <p className='subTitle'>为了你的隐私，请先短信验证</p>
                          </div>
                          <div className='inputItem'>
                             <input type="text" maxLength='11' placeholder='请输入手机号'/>
                             <input type="text" maxLength='6' placeholder='请输入验证码'/>
                             <span>获取验证码</span>
                           </div>
                          <div className='submitBtn'>
                             <p onClick={(e)=>{
                                 this.checkPassword(e)
                             }}>确定</p>
                          </div>

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
              <div>咨询会话</div>
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
