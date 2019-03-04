import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import NoResult from '../../../components/noresult/NoResult';
import * as Api from './userListApi';
import './style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';
import * as Utils from '../../../utils/utils';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
  constructor(props) {
    super(props);
    this.state = {
        patientList: [],//就诊人列表
        leftBindNum: 0,//剩余绑定人数
        showToast: false,
        showLoading: false,
        toastTimer: null,
        loadingTimer: null,
        showIOS1: false,
        showIOS2: false,
        cardShow:false,//是否显示公众号二维码
        codeUrl:'',//公众号二维码
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
    }
  }

  componentDidMount() {
      //在当前页面的微信内隐藏分享按钮
      this.getJsByHide();
        //初始化信息
      this.setState({
          patientList:[],
          leftBindNum:0
      })
      if(this.props.location.query.cardType==1&&this.props.location.query.cardNo!=''){
          //如果是公众号关注回来就自动去同步就诊人
          this.showLoading();
          this.syncUser(this.props.location.query.cardNo);
      }
      //查询就诊人列表
      this.getCardList();
      //解决作用域的问题
      var that=this;
     //weui的弹窗，点击黑色关闭弹窗
      document.addEventListener('click',function(e){
          if(e.target.className=='weui-mask'){
              that.setState({
                  showIOS2:false
              })
          }
      });
  }
  //同步就诊人，传入接口返回的不为null字段
    addPerson(param){
        Api
            .sameCard(param)
            .then((res) => {
                if (res.code == 0) {
                    this.hideLoading();
                    //同步完成后获取就诊人列表
                    this.getCardList()
                }
            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });
    }
    //自动同步就诊人 传入卡号
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
                                        //删除为null的字段，因为后台可能会报错
                                        delete  res.data[i][val];
                                    }
                                }
                                //去同步就诊人
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
    

    /*查询就诊人列表*/
    getCardList(){
            Api
                .getCardList()
                .then((res) => {
                    if (res.code == 0) {
                        this.setState({
                        patientList:res.data.patientList,
                        leftBindNum:res.data.leftBindNum || 0
                        })
                    }
                }, (e) => {
                });
    }
    /*是否注册*/
    isRegister() {
        this.showLoading();
        Api
            .isRegister()
            .then((res) => {
                if (res.code == 0) {
                    Api
                        .getCardList1()//查询儿童医院就诊人列表
                        .then((res) => {
                            this.hideLoading();
                            if(res.data.length > 0){
                                //如果有就诊人就进入同步页面
                                this.context.router.push({
                                    pathname:'usercenter/samecard',
                                    query:{
                                        //剩余绑卡数
                                        left:this.state.leftBindNum,
                                    }
                                })
                            }else{
                                //如果公众号没有就诊人就弹窗添加就诊人
                                this.setState({
                                    showIOS2:true
                                })
                            }
                        }, (e) => {
                            this.hideLoading();
                            this.setState({
                                msg:e.msg,
                                showIOS1:true
                            })
                        });

                }
            }, (e) => {
                this.hideLoading();
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });
    }
  componentWillUnmount() {
      //清除计时器
    this.state.Timer && clearTimeout(this.state.Timer);
  }
  getJsByHide() {
    //需要隐藏微信分享按钮的页面调用
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
            this.setState({
                msg: e.msg,
                showIOS1: true
            })
        });
  }
  
   //加载中
    showLoading() {
        this.setState({showLoading: true});
        this.state.loadingTimer = setTimeout(()=> {
            this.setState({showLoading: false});
        }, 2000);
    }
    //去儿童医院就诊卡绑定页面
    goMain(){
        window.location.href='http://wx.cqkqinfo.com/wx3/p/03/p/card_choose.cgi'
    }
    //已有就诊卡时，跳转到添加就诊卡页面
    isAdd(){
        this.setState({
            showIOS2:false
        })
        this.context.router.push({
            pathname:'usercenter/addcard',
            query:{
                type:0,//type为了在绑定就诊卡页面回到该页面
            }
        })

    }
    //关闭对话框
    hideDialog() {
        console.log(this.state);
        this.setState({
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            showAndroid2: false,
        });
    }
    //当前就诊人没有到2时，可以添加就诊人
    addCard(){
         this.showLoading();
             //判断用户是否关注儿童医院公众号 传入openId
            Api
                .getOpenId({openId: window.localStorage.getItem('openId')})
                .then((res) => {
                    if (res.code == 0) {
                        //subscribe为0时说明未关注公众号
                        if (res.data.subscribe == 0) {
                            //弹出公众号二维码， times是为了判断第一次显示二维码
                            if(window.localStorage.getItem('times')>=1) {
                                 //不是第一次进来就显示添加就诊人弹窗
                                 this.hideLoading();
                                this.setState({
                                    showIOS2: true
                                })

                            }else{
                                Api
                                    .getCode({
                                        url: window.location.href
                                    })
                                    .then((res) => {
                                        if (res.code == 0) {
                                            this.hideLoading();
                                            this.setState({
                                                codeUrl: res.data.url,
                                                 //第一次显示二维码
                                                cardShow: true
                                            })
                                           
                                        }
                                    }, (e) => {
                                        this.hideLoading();
                                    });
                                var storage = window.localStorage;
                                //显示了就不能显示了 设置缓存来实现
                                storage.times = window.localStorage.getItem('times') + 1 || 1;
                               
                                
                            }
                        } else {
                            //关注了就判断是否注册
                            this.hideLoading();
                            this.isRegister();
                        }

                    }
                }, (e) => {
                    this.hideLoading();
                    
                });

    }
  render() {
    const {patientList,codeUrl,msg,cardShow}=this.state;
    return (
        <div className="u-page">
        {//顶部返回
            <div className="home">
                <span className="jian"
                        onClick={()=>{
                        this.context.router.push({
                        pathname:'usercenter/home'
                        })
                        }}
                    ></span>我的就诊人
            </div>
        }
        <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
            {msg}
        </Dialog>
        <Dialog type="ios" title={this.state.style2.title} buttons={this.state.style2.buttons} show={this.state.showIOS2}>
        </Dialog>
        {//显示公众号二维码
            cardShow && 
            <div className='modal'
                            onClick={(e)=>{
                this.setState({
                    cardShow:false
                })
                }}>
                <div className='modal-body-register'
                        onClick={(e)=>{
                    e.stopPropagation()
                    }}>
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
            </div>
        }
            {//就诊人列表
                patientList&&patientList.map((item,index)=>{
                        return(
                        <Link className="m-card"
                            key={index}
                            to={{
                            pathname:'/usercenter/userinfo',
                            query:{patientId:item.patientId}
                            }}>
                            <div className="card-info">
                                <div className="info-main">
                                    <div className="main-name">
                                        <div className="name">{item.patientName||''}</div>
                                        {//设置默认
                                            item.isDefault == 1&&<div className="status" >默认</div>
                                        }
                                    </div>
                                </div>
                                <div className="info-extra">{item.patCardTypeName || '就诊卡'}：{item.patCardNo}</div>
                                <div className="info-extra">电话号码：{item.patientMobile}</div>
                            </div>
                        </Link>
                    )
                    })
            }

            {//添加就诊人
                2-patientList.length>0&&
                <div  className="m-adduser"
                   onClick={()=>{
                    this.addCard()
                        }}>
                    <div>
                      <img src="../../../resources/images/plus.png" />
                    </div>
                    <div>
                        <div className="add-title">添加就诊人</div>
                        <div className="add-text">还可添加{2-patientList.length}人</div>
                    </div>
                </div>
            }
             {//提示
                <div className="bandTip">
                    您只能绑定两张就诊卡，如果已有两张就诊卡,
                </div>
             }
            {//提示
                <div className="bandTip">
                    需要删除以后才能绑定新的就诊卡
                </div>
            }
        </div>


    );
  }
}

export default Connect()(Widget);
