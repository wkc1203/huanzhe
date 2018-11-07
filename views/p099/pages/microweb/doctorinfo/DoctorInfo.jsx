import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';

import * as Api from './doctorInfoApi';
import './style/index.scss';
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
      isShowTip: false,
      doctorInquirys:[]
    };
  }
  componentDidMount() {
      //this.getJs();
    var doctorId=this.props.location.query.doctorId;
    console.log("doctorId",doctorId)
    this.getDoctorInfo({doctorId:doctorId});
  }
  componentWillUnmount() {
    // 离开页面时结束所有可能异步逻辑

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
    getJs(){

        Api
            .getJsApiConfig({url:'https://tih.cqkqinfo.com/views/p099/'})
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
                        //批量隐藏功能
                        wx.hideMenuItems({
                            menuList: ["menuItem:copyUrl", "menuItem:openWithSafari","menuItem:openWithQQBrowser"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                        });
                    });

                }


                //this.setState({ hospInfo: res.data });
            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
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
            console.log("inquirys",res.data.doctor.inquirys);
          }
          console.log(res);
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
       console.log('f',isFavorite)
    if(!isFavorite){
      Api
          .addCollect({ doctorId, deptId })
          .then((res) => {
            if(res.code==0){
              this.setState({
                isFavorite: true,
              });
            }
          }, e=> {
              this.setState({
                  msg:e.msg,
                  showIOS1:true
              })
          });
    } else {
      Api
          .cancelCollect({ doctorId, deptId })
          .then((res) => {
            if(res.code==0){
              this.setState({
                isFavorite: false,
              });
            }
          }, e=> {
              this.setState({
                  msg:e.msg,
                  showIOS1:true
              })
          });
    }
  }
  switchTip(flag){
     this.setState({
       isShowTip:flag == '1'
     })

  }

  render() {
    const {doctor,isFavorite,isShowTip,doctorInquirys,msg}=this.state;
      console.log("isf",isFavorite);
      return (
        <div className="di-page">
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
                {/*<img className="doc-img" src="{{doctor.img || '../../../resources/images/doc.png'}}" alt="医生头像" />*/}
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
                      console.log('type',item.type)
                  return(
                      <div key={index} className={`${item.type=='1'?'':'disNo'}`}>
                        {item.type == '1' && item.isOnDuty == '1'&&<Link className="oper-item active"
                              to={{
                                pathname:'consult/confirminfo',
                                query:{doctorId:doctor.doctorId,deptId:doctor.deptId,totalFee:item.remune},
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