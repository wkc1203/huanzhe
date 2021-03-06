﻿import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';
import * as Api from './doctorInfoApi';
import './style/index.scss';
import * as Utils from '../../../utils/utils';
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
                    onClick: Utils.hideDialog.bind(this)
                }
            ]
        },
        style2: {
            title: '提示',
            buttons: [
                {
                    type: 'default',
                    label: '取消',
                    onClick: Utils.hideDialog.bind(this)
                },
                {
                    type: 'primary',
                    label: '确定',
                    onClick: Utils.hideDialog.bind(this)
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
       //隐藏分享等按钮
       Utils.getJsByHide();
    var doctorId=this.props.location.query.doctorId;
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
                    {/* isFavorite&&<img  src="../../../resources/images/collect-none.png"
                          onClick={()=>{
                this.switchCollect(isFavorite)

                }}/> */}
                    {/* !isFavorite&&<img  src="../../../resources/images/collect-active.png"
                          onClick={()=>{
                this.switchCollect(isFavorite)

                }}/> */}
                  </div>
                  <div> {doctor.level}</div>
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