﻿import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast ,showTips} from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';
import * as Api from '../../../components/Api/Api';
import * as Utils from '../../../utils/utils';
import './style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
  constructor(props) {
    super(props);
    this.state = {
        dialogConfig: {
            title: '请选择取消的原因',
            type: 'ios',
            buttons: [
              {
                type: 'default',
                label: '取消',
                onClick: () => {
                  this.closeDialog();
                }
              },
              {
                type: 'primary',
                label: '确定',
                onClick: () => {
                  this.cancelOrder();
                }
              }
            ],
            show: false,
          },
        showToast: false,
        showLoading: false,
        toastTimer: null, 
        loadingTimer: null,
        showIOS1: false,
        showIOS2: false,
        showAndroid1: false,
        showAndroid2: false,
        tipsConfig: {
            type: 'warn',
            show: false,
          },
          tipsText: '取消原因不能为空',
        style1: {
            buttons: [
                {
                    label: '确定',
                    onClick: Utils.hideDialog.bind(this)
                }
            ]
        },
        style2: {
            title: '请选择取消的原因',
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
        mdtDetail:{},//mdt详情
        edit:false,
        imgList:[],
        phone:'',
        mainDiagnosis:'',
        showMore:false,
        isShowProtocol:false,
        imgArr:[],
        docInfo:{},//领队
    };
  }
  componentDidMount() {
        //隐藏分享等按钮
      this.getJsByHide();   
      this.getDetail(); 
  }
  getJsByHide() {
    //需要隐藏微信分享按钮的页面调用
    console.log(window.location.href.substring(0,window.location.href.indexOf("#")-1))
        Api.getJsApiConfig({url:window.location.href.substring(0,window.location.href.indexOf("#")-1)})
        .then((res) => {
            if (res.code == 0) {
  //写入b字段 
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: res.data.appId, // 必填，公众号的唯一标识
                    timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: res.data.noncestr, // 必填，生成签名的随机串
                    signature: res.data.signature,// 必填，签名
                    jsApiList: ['chooseImage','getLocalImgData','hideMenuItems', 'showMenuItems','previewImage','uploadImage','downloadImage','hideMenuItems', 'showMenuItems'] // 必填，需要使用的JS接口列表
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
  /*放大图片*/
  previewImg(url) {
    const arr = [];
    this.state.imgArr.map(item => {
        if (item) {
            arr.push(item);
        }
    });
   // alert(url)
        wx.previewImage({
            current:'https://ihoss.oss-cn-beijing.aliyuncs.com/PIC/1543463523344-docMng.jpg',
            urls:[], 
            
        });
}
  cancelOrder()
    {
    var select = '';
    var cancelVal;
    for (var i = 0; i < 3; i++) {
        if (this.refs.cancelInpt.checkbox1[i].checked == true) {
        select = select + ' ' + this.refs.cancelInpt.checkbox1[i].value;
        }
    }
    if (select !== '' && this.refs.yuanyin.value == '') {
        cancelVal = select;
    }
    if (this.refs.cancelInpt.checkbox1.value == '' && this.refs.yuanyin.value !== '') {
        cancelVal = (this.refs.yuanyin.value || '').replace(/(^\s*)|(\s*$)/g, '');
    }
    if (select !== '' && this.refs.yuanyin.value !== '') {
        cancelVal = (select + ' ' + this.refs.yuanyin.value || '').replace(/(^\s*)|(\s*$)/g, '');
    }
    if (select == '' && this.refs.yuanyin.value == '') {
        this.showTips('取消原因不能为空,请选择或填写');
        return;
    }
    if (this.refs.yuanyin.value.length > 100) {
        this.showTips('取消原因太长');
        return;
    }
    this.closeDialog();
    this.cancel(this.state.checkDetail.orderStr,cancelVal);
    }
  cancelConfirm() {
    const { dialogConfig } = this.state;
    dialogConfig.show = true;
    this.setState({ dialogConfig });
  }
  closeDialog() {
    const { dialogConfig } = this.state;
    dialogConfig.show = false;
    this.setState({
      dialogConfig
    });
  }
    showToast() {
        this.setState({showToast: true});
        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
    }
  componentWillUnmount() {
    // 离开页面时结束所有可能异步逻辑
      this.state.leftTimer && clearInterval(this.state.leftTimer);
  }
    /*获取订单详情*/
    getDetail() {
      this.showLoading();
         Api
             .getmdtDetail({
                 id:this.props.location.query.id,
                 hisId:'2214'
             })
             .then((res) => {
                 if (res.code == 0) {
                   this.hideLoading();
                   this.setState({
                     mdtDetail:res.data,
                     imgList:!!res.data.images?JSON.parse(res.data.images):[]
                   })
                   //图片
                   var list=[];
                    for(var i=0;i<this.state.imgList.length;i++){
                      for(var j=0;j<this.state.imgList[i][Object.getOwnPropertyNames(this.state.imgList[i])[0]].length;j++){
                         console.log(this.state.imgList[i][Object.getOwnPropertyNames(this.state.imgList[i])[0]][j])
                         list.push(this.state.imgList[i][Object.getOwnPropertyNames(this.state.imgList[i])[0]][j])
                        }
                    }
                    //领队
                    var docInfo={}
                    for(var i=0;i<res.data.mdtRoomDoctorVoList.length;i++){
                      if(!!res.data.mdtRoomDoctorVoList[i]&&res.data.mdtRoomDoctorVoList[i].type=='2'){
                          
                         docInfo=res.data.mdtRoomDoctorVoList[i];
                      }
                  }
                    this.setState({
                      imgArr:list,
                      docInfo:docInfo
                    })

                     console.log(this.state.imgList)
                 }else{
                  this.hideLoading();
                 }
             }, e=> {
              this.hideLoading();
                 this.setState({
                     msg:e.msg,
                     showIOS1:true
                 })
             });
    }
    //去支付
    prePay(){
      this.context.router.push({
          pathname:'consult/pay',
          query:{source:'mdt',orderId:this.state.mdtDetail.orderIdStr,id:this.state.mdtDetail.id}
      })

    }
    delOrder(){
      console.log("dd")
      this.showLoading();
      Api
          .delMdt({
              id:this.props.location.query.id,
              userId:window.localStorage.userId
          })
          .then((res) => {
              if (res.code == 0) {
                  this.getDetail();
              }
          }, e=> {
           this.hideLoading();
              this.setState({
                  msg:e.msg,
                  showIOS1:true
              })
          });
    }
  render() {
    const {msg,mdtDetail,imgList,isShowProtocol,docInfo,phone,orderDetail,leftTimeFlag,leftTime}=this.state
    return (
        <div className="container page-mdt-order">
            <div className="home "><span className="jian"
                                        onClick={()=>{
                                          if(this.props.location.query.resource=='1'){
                                               this.context.router.goBack();
                                          }else{
                                            this.context.router.push({
                                              pathname:'ordermng/orderlist',
                                              query:{busType:'mdt'}
                                          });
                                          }
                                            
                                      }}
                ></span>订单详情
            </div>
            <Toast icon="success-no-circle" show={this.state.showToast}>修改成功</Toast>
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
            <Toptips {...this.state.tipsConfig}>{this.state.tipsText}</Toptips>  
            <div className="mdt-info">
             {!!mdtDetail&&!!mdtDetail.amount&&mdtDetail.status=='2'&&<div className='waitingForPayment'>
                <div className='tp'> 
                  <img src='./././resources/images/des_daipay.png'></img>
                  <div>
                    <p>{!!mdtDetail.statusName&&mdtDetail.statusName}</p> 
                    <p>￥{!!mdtDetail.amount&&mdtDetail.amount}</p>
                  </div>
                </div> 
              </div>}
            <div className="apply-item">
              <p className="apply-title">
                <img src="../../../resources/images/apply-hzdx.png" alt=""/>
                会诊对象
              </p>
              <div className="pat-info">
                  <div className="left">
                      <span className="name">{!!mdtDetail.patientName&&mdtDetail.patientName}</span>
                  </div>
                  <div className="right">
                     <p className="sex">
                        性别：{!!mdtDetail.patientSex&&mdtDetail.patientSex}
                     </p>
                     <p className="age">
                      年龄：{!!mdtDetail.patientAge&&mdtDetail.patientAge}
                     </p>
                     <p className="card">
                       就诊卡号：{!!mdtDetail.patientCardNo&&mdtDetail.patientCardNo}
                     </p>
                  </div>
              </div>
            </div>
            {!!mdtDetail.patientDoctorId&&<div className="apply-item">
              <p className="apply-title">
                <img src="../../../resources/images/sxzj.png" alt=""/>
                经治医生
              </p>
              <div className="pat-info">
              {!!mdtDetail.patientDoctorId?mdtDetail.patientDoctorName+'('+mdtDetail.patientDoctorTitle+')':''}
              </div>
            </div>}
            {!!mdtDetail.consultationTimeName&&<div className="apply-item">
              <p className="apply-title">
                <img src="../../../resources/images/hzsj.png" alt=""/>
                会诊时间
              </p>
              <div className="pat-info">
              {!!mdtDetail.consultationTimeName&&mdtDetail.consultationTimeName}
                
              </div>
            </div>}
          
            <div className="apply-item">
              <p className="apply-title">
                <img src="../../../resources/images/apply-zyzd.png" alt=""/>
                主要诊断
              </p>
              <div className="pat-info">
              {!!mdtDetail.mainDiagnosis&&mdtDetail.mainDiagnosis}
               </div>
            </div>
            <div className="apply-item">
              <p className="apply-title">
                <img src="../../../resources/images/apply-hzmd.png" alt=""/>
                会诊目的
              </p>
              <div className="pat-info">
              {!!mdtDetail.purpose&&mdtDetail.purpose}
              </div>
            </div>  
            {!!mdtDetail&&!!mdtDetail.mdtRoomDoctorVoList&&mdtDetail.mdtRoomDoctorVoList.length>0&&<div className="apply-item" >
                    <p className="apply-title">
                      <img src="./././resources/images/apply-hzzj.png" width='15px' height='13px' alt=""/>
                      会诊专家
                    </p>
                    <div className="info-doc pat-info">
                    {!!mdtDetail&&!!mdtDetail.mdtRoomDoctorVoList&&mdtDetail.mdtRoomDoctorVoList.length>0&&mdtDetail.mdtRoomDoctorVoList.map((item,index)=>{
                      return(
                       <div className="doctor" key={index}>
                         <img src={item.image} alt=""/>
                         <p className="name">{item.name}</p>
                         <p className="dept">{item.deptName}</p>
                       </div>
                      )
                    })}
                    </div>  
             </div>}
            <div className="apply-item">
              <p className="apply-title">
                <img src="../../../resources/images/apply-bqbcms.png" alt=""/>
                病情补充描述
              </p>
              <div className="pat-info" style={{display:'block'}}>
              {!!mdtDetail.supplement&&mdtDetail.supplement}
              {!!imgList&&imgList.length>0&&imgList.map((item,index)=>{
                 return(
                  <div className="upload-img" key={index}>
                    <p className="upload-title">
                      <img src="../../../resources/images/tplx.png" alt=""/>
                        {Object.getOwnPropertyNames(item)[0]}
                    </p>
                    <div className="img-list">
                    {
                      !!item[Object.getOwnPropertyNames(item)[0]]&&
                      item[Object.getOwnPropertyNames(item)[0]].length>0&&item[Object.getOwnPropertyNames(item)[0]].map((item1,index1)=>{
                        return( 
                          <img key={index1} className='main-img' src={item1} onClick={()=>{
                            //this.previewImg(item1)
                          }} alt=""/>
                         
                        )
                      })
                    }
                      </div>
                  </div> 
                
                 )
              })}
              </div>
              
            </div>
            {!!mdtDetail.remark&&<div className="apply-item"> 
              <p className="apply-title">
                <img src="./././resources/images/sf_bt.png" alt=""/>
                备注
              </p>
              <div className="pat-info">
                {!!mdtDetail.remark&&mdtDetail.remark}
              </div>
            </div>}
            
          </div>
          {isShowProtocol && <div className='modal1'>
                    <div className='modal-body-protocol'>
                        <div className='modal-title'>重庆医科大学附属儿童医院
                        MDT知情同意书</div>
                        <div className='modal-content-protocol'>
                            <div className="content">
                                <div className="content-item">
                                由于患方要求/患者病情需要，拟邀请重庆医科大学附属儿童医院MDT会诊专家团队进行在线远程会诊。以便于明确诊断/指导治疗/其他。本次会诊后所确定的诊断、治疗方案，不一定能达到预想的效果，甚至可能出现无法预料或不能防范的并发症等情况。
                                </div>
                                <div className="content-item">
                                上述情况已讲明。患者经慎重考虑后表示充分理解，同意邀请远程会诊并签字，自愿支付会诊的相关费用。医方当尽职尽力，积极予以诊断及治疗。
                               </div>
                            </div>  
                        </div>
                    </div>
                   <div className='modal-footer'>
                    <span onClick={()=>{
                        this.setState({
                            isShowProtocol:false
                        })
                        }}>取消</span>
                        <div
                          onClick={()=>{
                            this.setState({
                                isShowProtocol:false
                            })
                              this.prePay()
                          }}
                            className='sure'
                            >同意</div>
                    </div>
                    </div>}
          <div className='submit-btn'>
              {mdtDetail.status=='2'&&<p className='sure'  onClick={()=>{  
                console.log("1")  
                this.setState({
                  isShowProtocol:true
                })          
              }}>立即缴费</p> 
            }
            {(mdtDetail.status=='2')&&<p className='sure'
             onClick={()=>{ 
               console.log("delt")
               this.delOrder()  
             }}
             style={{marginTop:'10px',background:'white',border:'1px solid #4cabcf',color:'#4cabcf'}} >取消订单</p> 
          }
          </div>
        </div> 
    ); 
  }
}
export default Connect()(Widget);