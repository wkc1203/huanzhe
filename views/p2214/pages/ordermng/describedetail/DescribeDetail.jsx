import React, { Component } from 'react';
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
        describeDetail:{},
        edit:false,
        phone:'',
        mainDiagnosis:'',
        showMore:false,
    };
  }
  componentDidMount() {
        //隐藏分享等按钮
      Utils.getJsByHide();   
      this.getDetail(this.props.location.query.id); 
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
  pay() {
   /*  this.context.router.push({
        pathname:'consult/pay',
        query:{hospitalUserId:this.state.describeDetail.hospitalUserId,source:'describe1',hospitalTradeno:this.state.describeDetail.subscribeOrderNo}
    })  */
    this.context.router.push({
        pathname:'consult/pay',
        query:{userId:this.state.describeDetail.userId,source:'describe2',id:this.state.describeDetail.id,orderId:this.state.describeDetail.orderStr}
    }) 
       
  }
  cancle(){
        Api
        .cancleDescribe({ 
            id:this.state.describeDetail.id,
            hisId:'2214'  
        })
        .then((res) => {
            if (res.code == 0) {
                    this.getDetail(this.state.describeDetail.id)
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
    /*获取订单详情*/
    getDetail(id) {
      this.showLoading();
         Api
             .getDescribeDetail({ 
                 id:id,
                 signFlag:'1',
                 hisId:'2214'  
             })
             .then((res) => {
                 if (res.code == 0) {
                    this.hideLoading();
                    var info=res.data;
                    info.addInfo=!!res.data.subscribeInfo?JSON.parse(res.data.subscribeInfo):'';
                    info.drugList=!!res.data.recipelList?JSON.parse(res.data.recipelList):'';
                    console.log(info)
                    this.setState({
                        describeDetail:info
                    })
                    
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
  render() {
    const {msg,describeDetail,showMore,mainDiagnosis,phone,orderDetail,leftTimeFlag,leftTime}=this.state
    return (
        <div className="container page-describe-detail">
            <div className="home "><span className="jian"
                                        onClick={()=>{
                                            if(this.props.location.query.source=='inquiry'){
                                                this.context.router.goBack();
                                            }else{
                                                this.context.router.push({
                                                    pathname:'ordermng/orderlist',
                                                    query:{userId:describeDetail.userId,busType:'describe'}
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
            <div className="describe-detail">
                {describeDetail.status=='3'&&<div className="order-status">
                    <div className="time">
                      {describeDetail.createDate}
                    </div>
                    <div className="status">
                       <div className="main_infos">
                           <img src='./././resources/images/des_daipay.png'/>
                           <p>
                               <span className='dai'>等待缴费</span>
                               <span className='yuan'>￥{describeDetail.totalFee/100}</span>
                           </p>
                       </div> 
                    </div>
                </div>}
                <div className='patient main-info'>
                <div className="title-tip">
                    <img src='./././resources/images/des_jiu.png'/>就诊人信息
                   
                          
                </div> 
                <div className='info items'> 
                    <div className='item'>
                        <p>姓名：<span>{describeDetail.patientName}</span></p>
                        <p>性别：<span>{describeDetail.patientSex}</span></p>
                        <p>年龄：<span>{describeDetail.patientAge}</span></p>
                    </div>  
                    <div className='item'>
                        <p>院区：<span>{!!describeDetail.addInfo&&!!describeDetail.addInfo.hospitalDistrict&&describeDetail.addInfo.hospitalDistrict}</span></p>
                    </div>
                    <div className='item'>
                        <p>就诊卡号：<span>{describeDetail.patCardNo}</span></p>
                    </div>
                    <div className='item'>
                        <p>科室：<span>{!!describeDetail.addInfo&&!!describeDetail.addInfo.deptName&&describeDetail.addInfo.deptName}</span></p>
                    </div>
                    <div className='item'>
                        <p>就诊时间：<span>{!!describeDetail.addInfo&&!!describeDetail.addInfo.viditDate&&describeDetail.addInfo.viditDate.substring(0,10) }</span></p>
                    </div>
                </div>
          </div>
          <div className='diagnosis main-info'>
                  <div className='title-tip'>
                      <img src='./././resources/images/des_zhen.png'/>诊断</div>
                  <div className="items">
                      {describeDetail.diagnosis}
                </div> 
          </div>
          
          {!!describeDetail.drugList&&!(describeDetail.status=='2'&&describeDetail.auditStatus=='0')&&<div className="handle main-info">
              <div className='title-tip'>
                <img src='./././resources/images/des_chu.png'/>
                处置
                <p className='title-info' onClick={()=>{
                  this.context.router.push({
                    pathname:'ordermng/describeinfo',
                    query:{detail:JSON.stringify(describeDetail)}
                  })
                }}>查看详情 <img src='./././resources/images/des_xyjt.png'/></p>
              </div>
  
              <div className="handle_content"> 
                <div className="handle_info">
                     {describeDetail.drugList&&describeDetail.drugList.map((item,index)=>{
                         return(
                            <div className="handle_item" key={index}>
                            <div className="name_tip">
                                <p className="left">{item.Drug_name}</p>
                                <p className="right">￥{item.price}</p>
                            </div>
                            <div className="drug_info">
                                <div className="info_item">
                                    <p className="left">规格：{item.Drug_spec}</p>
                                    <p className="right">用量：{item.Dosage}</p>
                                </div>
                                <div className="info_item">
                                    <p className="left">数量：{item.amount}</p>
                                    <p className="right">用法：{item.Administration}，{item.Freq_desc}</p>
                                </div>
                            </div>
                        </div> 
                         ) 
                     })}
                      <p className="totals">
                        共计￥{describeDetail.totalFee/100}
                      </p> 
                    </div> 
                <div className="des_docinfo">
                  <p>开方医师：{describeDetail.doctorName}（{describeDetail.deptName}）</p>
                  {!!describeDetail.auditDate&&<p>开方日期：{!!describeDetail.auditDate?describeDetail.auditDate:''}</p>}
                </div>
              </div>
            
                
          </div>} 
          {!!describeDetail.diseaseDescribe&&<div className='diagnosis main-info'>
                <div className='title-tip'>
                    <img src='./././resources/images/des_jian.png'/>建议</div>
                <div className="items">
                    {describeDetail.diseaseDescribe}
                </div> 
          </div>}
          <div className="confirm" >
              {describeDetail.status=='3'&&<p className='p1' onClick={()=>{
                  this.pay()
              }}>确定支付</p>}
              {(describeDetail.status=='0'||describeDetail.status=='1'||describeDetail.status=='2'||describeDetail.status=='3')&&<p className='p2' onClick={()=>{
                  this.cancle()
              }}>取消订单</p>}

          </div>
          </div>
    </div>
    ); 
  }
}
export default Connect()(Widget);