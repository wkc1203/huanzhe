import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';
import * as Api from './doctorInfoApi';
import './style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
  constructor(props) {
    super(props);
    this.state = {
      doctor:[],
      isFavorite: false,
      doctorId:'',
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
      deptId:'',
        toastTitle:'',
      isShowTip: false,
      doctorInquirys:[]
    };
  }
  componentDidMount() {
        this.getJs();
    var doctorId=this.props.location.query.doctorId;
    this.getDoctorInfo({doctorId:doctorId});
  }
  componentWillUnmount() {
    // 离开页面时结束所有可能异步逻辑

  }
  hideDialog(){
    Utils.hideDialog();
}
    getJs(){
        Api
            .getJsApiConfig({url:window.location.href.substring(0,window.location.href.indexOf("#"))})
            .then((res) => {
                console.log(res);
                if(res.code==0){
                    //写入b字段
                    console.log("str",res.data);
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId:res.data.appId, // 必填，公众号的唯一标识
                        timestamp:res.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr:res.data.noncestr, // 必填，生成签名的随机串
                        signature:res.data.signature,// 必填，签名
                        jsApiList: ['hideMenuItems','showMenuItems'] // 必填，需要使用的JS接口列表
                    });
                    wx.ready(function(){
                        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                        wx.showMenuItems({
                            menuList: ["menuItem:copyUrl","menuItem:openWithQQBrowser","menuItem:share:appMessage", "menuItem:share:timeline"
                                ,"menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:QZone",
                                "menuItem:openWithSafari"] // 要显示的菜单项，所有menu项见附录3
                        });
                    });

                }
            }, (e) => {
            });
    }
   getDoctorInfo(param) {
    Api
        .getDoctorInfo(param)
        .then((res) => {
          if(res.code==0){
            this.setState({
              isFavorite: res.data.isFavorite,
              doctor:res.data.doctor,
              doctorInquirys:res.data.doctor.inquirys,
              doctorId:res.data.doctor.inquirys[0].doctorId,
              deptId:res.data.doctor.inquirys[0].deptId,
            });
          }
          this.setState({ user: res.data });
        }, e=> {
            this.setState({
                msg:e.msg,
                showIOS1:true
            })
        });
  }
   switchCollect(isFavorite){
    const { doctorId, deptId } = this.state;
       if (!isFavorite) {
           Api
               .addCollect({doctorId, deptId})
               .then((res) => {
                   if (res.code == 0) {
                       Utils.showToast();
                       this.setState({
                           isFavorite: true,
                           toastTitle:"收藏成功"
                       });
                   }
               }, e=> {

               });
       } else {
           Api
               .cancelCollect({doctorId, deptId})
               .then((res) => {
                   if (res.code == 0) {
                       Utils.showToast();

                       this.setState({
                           isFavorite: false,
                           toastTitle:"取消收藏成功"
                       });
                   }
               }, e=> {

               });
       }
  }
  switchTip(flag){
     this.setState({
       isShowTip:flag == '1'
     })

  }

  render() {
    const {doctor,isFavorite,isShowTip,doctorInquirys,msg,toastTitle}=this.state;
      return (
        <div className="di-page">
            <div className="home">
                <span className="jian"
                    onClick={()=>{
                  this.context.router.push({
                   pathname:'microweb/deptlistfordoc'
                  })
                  }}
                ></span>医生简介
            </div>
            <Toast icon="success-no-circle" show={this.state.showToast}>{toastTitle}</Toast>

            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
          <div className="container1">
            <div className='headerp'>
              <div className='doctor'>

                {doctor.image&&<img className="doc-img" src={doctor.image} alt="医生头像"/>
                }
                {!doctor.image&&<img className="doc-img" src="../../../resources/images/doc.png" alt="医生头像"/>
                }
                <div className='text-box'>
                  <div>
                    {doctor.name}
                    {isFavorite&&<img  src="../../../resources/images/collect-none.png"
                          onClick={()=>{
                this.switchCollect(isFavorite)

                }}/>}
                    {!isFavorite&&<img  src="../../../resources/images/collect-active.png"
                          onClick={()=>{
                this.switchCollect(isFavorite)

                }}/>}
                  </div>
                  <div>{doctor.grade || ''} {doctor.grade ? '|' : '' }   {doctor.level}</div>
                  <div>{doctor.deptName}</div>
                </div>
              </div>
            </div>

             <div className="m-oper">
                {!!doctor&&doctorInquirys.map((item,index)=>{
                  return(
                      <div key={index} className={`${item.type=='1'?'':'disNo'}`}>
                        {item.type == '1' && item.isOnDuty == '1'&&<Link className="oper-item active"
                              to={{
                                pathname:'consult/confirminfo',
                                query:{doctorId:doctor.doctorId,deptId:doctor.deptId,totalFee:item.remune,com:1},
                              }}>
                          <div>
                            <img src="../../../resources/images/inquiry-bg.png" />
                          </div>
                          <div>图文咨询</div>
                        </Link>
                            }
                        {item.type=='1'&&item.isOnDuty == '0'&&<div className="oper-item" >
                          <div>
                            <img src="../../../resources/images/inquiry-gray.png" />
                          </div>
                          <div>图文咨询</div>
                          <div>（离线）</div>
                        </div>
                            }
                      </div>
                        )
                    }
                  )
                        }

             <div className="oper-item" onClick={()=>{
                this.switchTip(1)
                }}>
                <div><img src="../../../resources/images/video.png" /></div>
                <div>视频咨询</div>
              </div>
              <div className="oper-item" onClick={()=>{
                this.switchTip(1)
                }}>
                <div><img src="../../../resources/images/phone.png" /></div>
                <div>电话咨询</div>
              </div>
            </div>
              <div className="m-deptinfo">
                <div className="m-blockinfo">
                  <div className="m-title">擅长领域</div>
                  <div className="m-summary">{doctor.specialty ? doctor.specialty : '暂无描述'}</div>
                </div>
              </div>
              <div className="m-deptinfo">
                <div className="m-blockinfo">
                  <div className="m-title">医生简介</div>
                  <div className="m-summary">{doctor.introduction ? doctor.introduction : '暂无介绍'}</div>
                </div>
              </div>
            </div>
          {isShowTip && <div className='modal-tip'>
            <div className='modal-body-tip'>
              <div className='modal-title'>温馨提示</div>
              <div className='modal-content-tip'>
                <div slot="content">
                  <div className="content-item">该功能正在努力建设中！</div>
                </div>
              </div>
              <div className='modal-footer-tip'>
                <span  onClick={()=>{
                this.switchTip(0)

                }}>我知道了</span>
              </div>
            </div>
          </div>
          }
          </div>
    );
  }
}
export default Connect()(Widget);