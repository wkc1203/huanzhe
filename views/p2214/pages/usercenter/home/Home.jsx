import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import { Link } from 'react-router';
import hashHistory from 'react-router/lib/hashHistory';
import Connect from '../../../components/connect/Connect';
import Func from './component/Func';
import * as Utils from '../../../utils/utils';
import * as Api from '../../../components/Api/Api';
import './style/index.scss';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
  constructor(props) {
    super(props);
    this.state = {
     hasMsg:false,
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
                    onClick: Utils.hideDialog.bind(this)
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
        validatePass:'',//验证码
        leftTime: 120,
        isSendValidate: false,
        mobile:'',//字符手机号
        phone:'',//手机号
        login_access_token:this.props.location.query.login_access_token,
    };
  }
  componentWillReceiveProps(){
    // this.hasReigister();
     }
     showToast() {
        console.log("hhhh")
        this.setState({showToast: true});
        console.log(this.state.showToast)
      
        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
      }
      /**
     * 倒计时
     */
    clock() {
        var clockTimer = setTimeout(() => {
            var leftTime1 = this.state.leftTime;
            --leftTime1;
            this.setState({
                leftTime: leftTime1
            })
            if (leftTime1 <= 0) {
// 查询超时，跳转详情页面
                this.setState({
                    isSendValidate: false,
                })
            } else {
                this.setState({
                    leftTime: leftTime1
                })
                this.clock();
            }
        }, 1000);
    }
  componentDidMount() {
      this.getMsg();
      window.localStorage.goChat=2;
      this.hasReigister();    
         //隐藏分享等按钮
      Utils.getJsByHide();
      if(this.props.location.query.cardType==1&&this.props.location.query.cardNo!=''){
          this.showLoading();
      }
     this.isRegistered();
  
     
      
  }
  componentWillUnmount() {
  }
  /*获取未读条数*/
  getMsg() {
    Api
        .getMsg()
        .then((res) => {
            if(res.code==0&&res.data!=null){
                   if(res.data.length>0){
                        for(var i=0;i<res.data.length;i++)
                         if(res.data[i].userReaded=='0'){
                            this.setState({
                                hasMsg:true
                            })
                         }
                   }
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
//是否注册
hasReigister() {
    Api
        .isRegistered()
        .then((res) => {
               if(res.code==0&&res.msg=='hasBind'){
               }else{
                if(window.localStorage.getItem('back')==1){
                    this.context.router.push({
                        pathname:'home/index'
                    })
                }
               }
        }, (e) => {
                 if(e.msg=='hasBind'){
               }else{
                if(window.localStorage.getItem('back')==1){
                    this.context.router.push({
                        pathname:'home/index'
                    })
                }
               } 
        });
}
//是否注册
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
//添加就诊卡
    addCard(){
        this.showLoading();
        Api
            .getOpenId({openId: window.localStorage.getItem('openId')})
            .then((res) => {
                if (res.code == 0) {
                    if (res.data.subscribe == 0) {
                        this.setState({
                            cardShow: true
                        })
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
                                }
                            }, (e) => {
                            });
                    } else {
                        if(this.state.leftBindNum==2){
                            this.goMain();
                        }
                    }
                }
            }, (e) => {
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
                         userId:res.data.id,
                         phone:res.data.mobile
                     })
                     var mobile=res.data.mobile;
                     var begin=mobile.substring(0,3);
                     var end=mobile.substring(7,11);
                     mobile=begin+'****'+end;
                     console.log(mobile);
                     this.setState({
                         mobile:mobile
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
        //验证密码
        if(this.state.validatePass){
            this.setState({
                phoneShow:false
            })
            this.showLoading();
            Api
            .validate({type:'check',validateCode:this.state.validatePass})
            .then((res) => {
                this.hideLoading();
                if (res.code == 0) {
                   //成功 跳转
                    this.context.router.push({
                        pathname:'/report/reportList'
                    })
                }else{
                    this.hideLoading();
                    this.setState({
                        msg:e.msg,
                        showIOS1: true 
                    })
                }
            }, (e) => {
                this.hideLoading();
                this.setState({
                    msg:e.msg,
                    showIOS1: true 
               })
            });
        }else{
            this.setState({
                msg:'请输入验证码',
           });
           this.showToast();
        }
    }
    //获取验证码
    getValidate() {
        if (this.state.phone) {
            this.showLoading();
            Api
            .getMsgValidate({type:'check',phone: this.state.phone})
            .then((res) => {
                this.hideLoading();
                if (res.code == 0) {
                    this.setState({
                        isSendValidate: true,
                    })
                    this.setState({
                        leftTime:120,
                    })
                    this.clock();
                }else{
                    this.hideLoading();
                    if(!!res.data){
                        this.setState({
                            isSendValidate: true,
                        })
                        this.setState({
                            leftTime:res.data,
                        })
                        this.clock();
                     }else{
                        this.setState({
                            msg:res.msg,
                            showIOS1: true
                        })
                     }
                }
            }, (e) => {
                     this.hideLoading();
                     if(!!e.data){
                        this.setState({
                            isSendValidate: true,
                        })
                        this.setState({
                            leftTime:e.data,
                        })
                        this.clock();
                     }else{
                        this.setState({
                            msg:e.msg,
                            showIOS1: true
                        })
                     }
            });
        }
    }
    
  render() {
    const {phone,mobile,phoneShow,userInfo,codeUrl,cardShow,msg,leftTime,isSendValidate,isShow,patNum,defaultUser,leftBindNum,validatePass,userId,hasMsg}=this.state;
    return (
        <div className="h-page">
           <div className='toas'>
            <Toast icon="toast" show={this.state.showToast}>{msg}</Toast>
            </div>
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
                    >{mobile}<img src="../../../resources/images/edit.png" /></div>}
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
            <Func url='/ordermng/orderlist' userId={userId}  img='./././resources/images/inquiry-mng.png'  name='订单管理'/>
            <div className="m-function">
                <Link className="function-list"  onClick={()=>{
                    this.context.router.push({
                        pathname:'/report/reportList'
                    })
                }}>
                    <div className="list-item">
                        <div className="item">
                            <div className="item-icon">
                                <img style={{width:'18px',height:'18px;'}}
                                src='./././resources/images/report.png'></img>
                            </div>
                            <div className="item-main">
                                <div className="main-title">检验检查报告</div>
                            </div>
                        </div>
                    </div>
                </Link>
              </div>
              <Func url='/usercenter/collect' userId={userId}  img='./././resources/images/collect.png'  name='我的收藏'/>
              <Func url='/usercenter/complain' userId={userId}  img='./././resources/images/complain.png'  name='投诉建议'/>
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
                    <div className='modal-content'>您的手机号：{mobile}</div>
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
            
            <div className="tarbar">
                    <div  onClick={()=> {this.toNext(1)}}>
                    <img  src="../../../resources/images/index.png"/>
                    <div>首页</div>
                    </div>
                    <div className='inquiry'  onClick={()=> {this.toNext(2)}}>
                    {hasMsg&&<span></span>}
                    <img  src="../../../resources/images/inquiry.png"/>
                    <div>咨询会话</div>
                    </div>
                    <div>  
                    <img  src="../../../resources/images/my-active.png"/>
                    <div style={{color:'#4FABCA'}}>我的</div>
                    </div>
            </div>
        </div>
                    );
  }
}
export default Connect()(Widget);
