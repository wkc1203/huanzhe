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
      this.setState({
          //初始化信息
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
                        .getCardList1()//查询就诊人列表
                        .then((res) => {
                            this.hideLoading();
                            if(res.data.length > 0){
                                this.context.router.push({
                                    pathname:'usercenter/samecard',
                                    query:{
                                        left:this.state.leftBindNum,
                                    }
                                })

                            }else{
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
    this.state.Timer && clearTimeout(this.state.Timer);
  }
    showLoading() {
        this.setState({showLoading: true});
        this.state.loadingTimer = setTimeout(()=> {
            this.setState({showLoading: false});
        }, 2000);
    }
    goMain(){
        window.location.href='http://wx.cqkqinfo.com/wx3/p/03/p/card_choose.cgi'
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
    hideDialog() {
        console.log(this.state);
        this.setState({
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            showAndroid2: false,
        });
    }
    addCard(){

            Api
                .getOpenId({openId: window.localStorage.getItem('openId')})
                .then((res) => {
                    if (res.code == 0) {
                        if (res.data.subscribe == 0) {
                            if(window.localStorage.getItem('times')>=1) {
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
                                            this.setState({
                                                codeUrl: res.data.url
                                            })
                                            console.log(res)
                                        }
                                    }, (e) => {
                                    });
                            }
                        } else {
                            this.isRegister();
                        }
                        console.log(res.code)
                    }
                }, (e) => {
                    console.log(e)
                });

    }
  render() {
    const {patientList,codeUrl,msg,cardShow}=this.state;

    return (
        <div className="u-page">
            <div className="home"><span className="jian"
                                        onClick={()=>{
                                      this.context.router.push({
                                       pathname:'usercenter/home'
                                      })
                                      }}
                ></span>我的就诊人
            </div>
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
            <Dialog type="ios" title={this.state.style2.title} buttons={this.state.style2.buttons} show={this.state.showIOS2}>
            </Dialog>
            {cardShow && <div className='modal'
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
            </div>}
            {patientList&&patientList.map((item,index)=>{
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
                                   <div className="name">{item.patientName}</div>
                                   {item.isDefault == 1&&<div className="status" >默认</div>}
                               </div>
                           </div>
                           <div className="info-extra">{item.patCardTypeName || '就诊卡'}：{item.patCardNo}</div>
                           <div className="info-extra">电话号码：{item.patientMobile}</div>
                       </div>
                   </Link>
               )

            })}
            {2-patientList.length>0&&<div  className="m-adduser" onClick={()=>{
           this.addCard()
            }}>
                <div><img src="../../../resources/images/plus.png" /></div>
                <div>
                    <div className="add-title">添加就诊人</div>
                    <div className="add-text">还可添加{2-patientList.length}人</div>
                </div>
            </div>}
            <div className="bandTip">
                您只能绑定两张就诊卡，如果已有两张就诊卡,
            </div>
            <div className="bandTip">
                需要删除以后才能绑定新的就诊卡
            </div>
        </div>


    );
  }
}

export default Connect()(Widget);
