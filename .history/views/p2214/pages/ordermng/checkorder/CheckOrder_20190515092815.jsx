import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';
import * as Api from './checkOrderApi';
const QRCode = require('qrcode.react');
import JsBarcode from 'jsbarcode';
import './style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
  constructor(props) {
    super(props);
    this.state = {
        orderId: '',
        statusName: '',
        statusClassName: '',
        orderDetail: {},
        leftTimeFlag: false,
        // 剩余支付时间
        leftTime: '00:00',
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
        check:'',
        case1:'',
        leftTimer:'',
        mainDiagnosis:'',
        show:true,
    };
  }
  componentDidMount() {
      //  this.getJs();
      this.setState({
        check:JSON.parse(this.props.location.query.check),
        case1:JSON.parse(this.props.location.query.case)
      })
      var diagnosis1=JSON.parse(this.props.location.query.case).mainDiagnosis;
      var de=diagnosis1.split('|');
       console.log("dede",de);
        var txt1=de[0];
        var txt2=de[1];
        var txt3=de[2];
        var mainDiagnosis=(txt1!=''&&txt1!='无'?txt1+"|":'')+txt2+(txt3!=''&&txt3!='无'?txt3+"":'');
        console.log(mainDiagnosis)
        this.setState({
            mainDiagnosis:mainDiagnosis
        })
      console.log("33",this.state.check,JSON.parse(this.props.location.query.check).Test_no)
        //生成条形码
        if(!!JSON.parse(this.props.location.query.check)&&JSON.parse(this.props.location.query.check).Test_no){
           
            JsBarcode(this._barcodeSVG, '*'+JSON.parse(this.props.location.query.check).Test_no+'*',
            {
                displayValue: true,  //  不显示原始值
                textMargin:5,//设置条形码和文本之间的间距
                fontSize:17,//设置文本的大小
                width:2,//设置条之间的宽度
            }
        );
        }else{
            this.setState({
                show:false
            })
        }
        console.log(this.state.check,JSON.parse(this.props.location.query.check))

       

     
     this.setState({
         orderId:this.props.location.query.orderId
     })
     // this.getOrderDet();
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
        this.setState({
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            showAndroid2: false,
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
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })
            });
    }
  componentWillUnmount() {
    // 离开页面时结束所有可能异步逻辑
      this.state.leftTimer && clearInterval(this.state.leftTimer);

  }
   

  render() {
    const {msg,check,case1,mainDiagnosis,show,leftTime}=this.state
    return (
        <div className="container page-check-order">
            <div className="home "><span className="jian"
                                        onClick={()=>{
                                      this.context.router.goBack();
                                      }}
                ></span>我的检验检查单
            </div>
            <Toast icon="success-no-circle" show={this.state.showToast}>修改成功</Toast>
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
            <div className='main-content'>

            <div className='check-title'>
                 <p className='hospital'>重庆医科大学儿童医院</p>
                  {check.type=='inspect'&&<p className='sub-title'>化验申请单</p>}
                  {check.type=='check'&&<p className='sub-title'>检查申请单</p>}    
                  
                    {show&&<div className='barcode'>
                    <svg ref={(ref)=>this._barcodeSVG = ref}></svg>
               
                  </div>}
                  {!!check.Test_no&&<p className='show'>拿报告时出示</p>}
            </div>
             
                <div className='check-basic'>
                   {(!!check.Test_no||!!check.Patient_id)&&<div className='check-item'>
                    {!!check.Test_no&&<p>申请序号：<span>{!!check.Test_no?check.Test_no:''}</span></p>}
                    {!!check.Patient_id&&<p>ID号：<span>{!!check.Patient_id?check.Patient_id:''}</span></p>}
                    </div>}
                    <div className='check-item'>
                    {!!check.orderDept&&<p>执行科室：<span>{!!check.orderDept?check.orderDept:''}</span></p>}
                    <p>申请科室：<span>{case1.deptName}</span></p>
                    </div>
                    {!!check.Visit_no&&<div className='check-item'>
                     <p>开单序号：<span>{!!check.Visit_no?check.Visit_no:''}</span></p>
                    </div>}
                    
                </div>
                <span className='left'></span>
                <span className='right'></span>
                <div className='person-info'>
                    <div className='person-item'>
                        <p>就诊人：<span>{case1.patientName}</span></p>
                        <p>就诊卡号：<span>{case1.patCardNo}</span></p>
                    </div>
                    <div className='person-item'>
                        <p>年龄：<span>{case1.patientAge}</span></p>
                        <p>性别：<span style={{paddingRight:'10px'}}>{case1.patientSex=='M'?'男':'女'}</span> {!!case1.patientWeight&&<span>体重：{!!case1.patientWeight?case1.patientWeight:''} {!!case1.weightUnit?case1.weightUnit:''}</span>}</p>
                    </div>

                </div>
                {check.type=='inspect'&&<div className='sample'>
                <p>标本：<span>{!!check.speciman.Speciman_name?check.speciman.Speciman_name:''}</span></p>
                <p>标本说明：<span>{!!check.speciman.detail?check.speciman.detail:''}</span></p>
                <p>金额：<span>{!!check.Total_charges?check.Total_charges:''}</span></p>

                </div>}
                {check.type=='check'&&<div className='sample'>
                <p>类别：<span>{!!check.Exam_class?check.Exam_class:''}</span></p>
                <p>子类：<span>{!!check.Exam_sub_class?check.Exam_sub_class:''}</span></p>
                <p>病史：<span>{!!case1.medicalHistory?case1.medicalHistory:''}</span></p>
                <p>体征：<span>{!!case1.examination?case1.examination:''}</span></p>
                <p>主要诊断：<span>{!!mainDiagnosis?mainDiagnosis:''}</span></p>
                <p>金额：￥<span>{!!check.Total_charges?check.Total_charges:''}</span></p>

                </div>}

                {check.type=='inspect'&&!!check.Lab_sheet_item&&<div className='info-item'>
                        <p className='bg-blue'>{!!check.Lab_sheet_item?check.Lab_sheet_item:''}</p>
                     
                </div>}
                {((check.type=='check'&&!!check&&!!check.item[0].Exam_attention)||(check.type=='inspect'&&!!check.Lab_attention))&&<div className='alarm'>
                    <p className="title">
                            注意事项：
                    </p>
                    {check.type=='check'&&<p className='content' >{!!check.item[0].Exam_attention?check.item[0].Exam_attention:''}</p>}
                    {check.type=='inspect'&&<p className='content' >{!!check.Lab_attention?check.Lab_attention:''}</p>}
                    
                </div>}
                <div className='doctor'>
                <div className="name">
                <p >医生：<span>{case1.doctorName}</span></p>

                </div>    
                <div className='time'>
                    {!!check.Req_date&&<p>日期：<span>{!!check.Req_date&&check.Req_date}</span></p>}
                    <p></p>
                </div>
                    
                </div>
              </div>
        </div>
    );
  }
}
export default Connect()(Widget);