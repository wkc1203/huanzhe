import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';
import * as Utils from '../../../utils/utils';
const QRCode = require('qrcode.react');
import JsBarcode from 'jsbarcode';
import './style/index.scss';
var _barcodeSVGS='';
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
        check:'',
        case1:'',
        leftTimer:'',
        mainDiagnosis:'',
        detail:JSON.parse(this.props.location.query.detail),
        show:false,
    };
  }
  componentDidMount() {
       console.log(this.state.detail)  

       //隐藏分享等按钮
       Utils.getJsByHide();
        if(!!this.state.detail.hospitalVisitDate){

        
       JsBarcode(this._barcodeSVG, '*'+this.state.detail.hospitalVisitDate.replace('-','').replace('-','')+this.state.detail.hospitalVisitNo+'*',
       {
           displayValue: true,  //  不显示原始值
           textMargin:5,//设置条形码和文本之间的间距
           fontSize:30,//设置文本的大小
           width:2,//设置条之间的宽度
        }
        );
        JsBarcode(this._barcodeSVG11, '*'+this.state.detail.hospitalVisitDate.replace('-','').replace('-','')+this.state.detail.hospitalVisitNo+'*',
                        {
                            displayValue: true,  //  不显示原始值
                            textMargin:10,//设置条形码和文本之间的间距
                            fontSize:32,//设置文本的大小
                            width:3,//设置条之间的宽度
                           
        }
        ); 
    }

     /*  this.setState({
        check:JSON.parse(this.props.location.query.check),
        case1:JSON.parse(this.props.location.query.case)
      })
      var diagnosis1=JSON.parse(this.props.location.query.case).mainDiagnosis;
      var de=diagnosis1.split('|');
        var txt1=de[0];
        var txt2=de[1];
        var txt3=de[2];
        var mainDiagnosis=(txt1!=''&&txt1!='无'?txt1+"|":'')+txt2+(txt3!=''&&txt3!='无'?txt3+"":'');
        console.log(mainDiagnosis)
        this.setState({
            mainDiagnosis:mainDiagnosis
        })

        //生成条形码
        if(!!JSON.parse(this.props.location.query.check)&&JSON.parse(this.props.location.query.check).Test_no){          
            JsBarcode(this._barcodeSVG, '*'+JSON.parse(this.props.location.query.check).Test_no+'*',
            {
                displayValue: true,  //  不显示原始值
                textMargin:5,//设置条形码和文本之间的间距
                fontSize:18,//设置文本的大小
                width:2,//设置条之间的宽度
            }
        );
        }else{
            this.setState({
                show:false
            })
        }
     this.setState({
         orderId:this.props.location.query.orderId
     }) */
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
  render() {
    const {msg,detail,case1,mainDiagnosis,show,leftTime}=this.state;
    console.log("ds",this._barcodeSVGS11)
    return (
        <div className={`${show?'over-hidden ':' '}container page-describe-info`}>
            <div className="home "><span className="jian"
                                        onClick={()=>{
                                      this.context.router.goBack();
                                      }}
                ></span>处方详情
            </div>
            <Toast icon="success-no-circle" show={this.state.showToast}>修改成功</Toast>
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
           <div className={`${show?'modal':'hide_code'}`} onClick={()=>{
           
            this.setState({
                   show:false
                })
                }} >
                    <div className='modal-body'
                        onClick={(e)=>{
                        e.stopPropagation()
                        }}>
                        <div className='modal-content'>
                            <p className='sub-title'>处方码仅限于患者向医院展示使用</p>
                            <div className='barcode' onClick={()=>{
                                console.log(this._barcodeSVGS11,this._barcodeSVGS,this._barcodeSVG)
                            }}> 
                               <svg  ref={(ref)=>this._barcodeSVG11= ref} >
                                
                                </svg>
                                              
                            </div>
                        </div>
                         
                    </div>
                </div>
                {!show&&<div className='modal' style={{display:'none'}} onClick={()=>{
           
                    this.setState({
                           show:false
                        })
                        }} >
                            <div className='modal-body'
                                onClick={(e)=>{
                                e.stopPropagation()
                                }}>
                                <div className='modal-content'>
                                    <p className='sub-title'>处方码仅限于患者向医院展示使用</p>
                                    <div className='barcode'>
                                        <svg  ref={(ref)=>this._barcodeSVG= ref}></svg>              
                                    </div>
                                </div>
                                 
                            </div>
                        </div>}
            <div className='main-content'>
            <div className='check-title'>
                 <p className='hospital'>重庆医科大学附属儿童医院</p>
                  <p className='sub-title'>电子处方笺</p>
                    {!!detail.hospitalVisitDate&&<div className='barcode' onClick={()=>{
                        
                        this.setState({
                            show:true
                        })
                        this._barcodeSVGS11=this._barcodeSVGS;
                         console.log(show,this._barcodeSVGS)

                    }}>
                    <svg ref={(ref)=>this._barcodeSVG = ref}></svg>              
                  </div>}
                  {!!detail.hospitalVisitDate&&<p className="large">点击可放大</p>}
                 
            </div>  

            {!!detail.pControlResultNo&&<div className='person-info'>
                    <p style={{fontSize:'14px'}}>电子处方平台流水号：</p>
                    <p style={{fontSize:'14px'}}>{detail.pControlResultNo}</p>
            </div>}

               <div className='person-info'>
                    <div className='person-item'>
                        <p>就诊人：<span>{detail.patientName}</span></p>
                        <p>就诊卡号：<span>{detail.patCardNo}</span></p>
                    </div>
                    <div className='person-item'>
                        <p>性别：<span>{detail.patientSex}</span></p>
                        <p>年龄：<span >{detail.patientAge}</span> </p>
                    </div>
                    <div className='person-item'>
                        <p>体重：<span>{detail.caseInfo.patientWeight}kg</span></p>
                    
                    </div>
                </div>
                <span className='left'></span>
                <span className='right'></span>          
                <div className='check-basic'>
                   {!!detail.hospitalVisitNo&&<div className='check-item'>
                      {!!detail.hospitalVisitNo&&<p>开单序号：<span>{detail.hospitalVisitNo}</span></p>}
                      {!!detail.patHisId&&<p>ID号：<span>{detail.patHisId}</span></p>}
                    </div>}
                    <div className='check-item'>
                      <p>科室：<span>{detail.deptName}</span></p>
                    </div>             
                </div>
                {detail.drugList&&<div className="more-info">
                         <div className="drug-icon">
                         <img src='./././resources/images/describe_ypcf.png'/> 
                         </div>
                        <div className="drug-info">
                          {detail.drugList&&detail.drugList.map((item,index)=>{
                              return(
                                <div className="drug-item" key={index}>
                                    <div className="name">
                                        <p className="left1">{item.Drug_name}</p>
                                        <p className="right1">*{item.amount}</p>
                                    </div>
                                    <div className="dose">
                                        <p className="dose-item">{item.Freq_desc}</p>
                                        <p className="dose-item">{item.Administration}</p>
                                        <p className="dose-item">{item.Drug_spec}</p>
                                        <p className="dose-item">用法：{item.Dosage+item.Dosage_unit}</p>
                                    </div>
                                </div>
                              )
                          })}
                        </div>
                        <div className="desdoc-info">
                            <p className="left1">药品价格</p>
                            <p className="right1">￥{detail.totalFee/100}</p>
                        </div>

                    </div>}
                <div className='doctor'>
                    <div className='doc'>
                        <div className="left1">
                           <p>开方医师：{detail.doctorName}</p>
                           {!!detail.doctorSignImg&&<img src={detail.doctorSignImg} />}
                           {!detail.doctorSignImg&&<span style={{color:'#ccc',display:'block',padding:'10px 20px'}}>（电子签名）</span>}
                        </div>
                        {!!detail.pharSignImg&&<div className="right1">
                           <p> 审核药师：{detail.pharDoctorName}</p>
                           {!!detail.pharSignImg&&<img src={detail.pharSignImg} />}
                        </div>}  
                    </div> 
                {!!detail.auditDate&&<div className='time'>
                    <p>日期：<span>{!!detail.auditDate?detail.auditDate:''}</span></p>
                    <p></p>
                </div>}
                <div className='name'>
                    {!!detail.storageAddress&&<p style={{color:'#4cabcf'}}>{detail.storageAddress}</p>}
                </div>
                </div>
              </div>
        </div>
    );
  }
}
export default Connect()(Widget);