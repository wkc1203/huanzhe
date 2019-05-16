import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast ,showTips} from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';
import * as Api from './checkDetailApi';
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
                    onClick: this.hideDialog.bind(this)
                }
            ]
        },
        style2: {
            title: '请选择取消的原因',
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
        checkDetail:{},
        edit:false,
        phone:'',
        mainDiagnosis:'',
        showMore:false,
    };
  }
  componentDidMount() {
       this.getJs();
    
      this.getDetail();
     
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
    console.log(select)
    console.log(this.refs.yuanyin.value)
    if (select !== '' && this.refs.yuanyin.value == '') {
        cancelVal = select;
        console.log('1')
    }
    if (this.refs.cancelInpt.checkbox1.value == '' && this.refs.yuanyin.value !== '') {
        cancelVal = (this.refs.yuanyin.value || '').replace(/(^\s*)|(\s*$)/g, '');
        console.log('2')
    }
    if (select !== '' && this.refs.yuanyin.value !== '') {
        cancelVal = (select + ' ' + this.refs.yuanyin.value || '').replace(/(^\s*)|(\s*$)/g, '');
        console.log('3')
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
    /*获取订单详情*/
    getDetail() {
      this.showLoading();
         Api
             .getCheckDetail({
                 id:this.props.location.query.id,
                 hisId:'2214'
             })
             .then((res) => {
                 if (res.code == 0) {
                   this.hideLoading();
                     var checkDetail=res.data;
                     checkDetail.addInfo=JSON.parse(res.data.subscribeInfo);
                     var checkItem;
                      if(res.data.checkItem){
                        checkItem=JSON.parse(res.data.checkItem);
                      }
                   
                      
                      for(var i=0;i<checkItem.length;i++){
                        var num=0;
                           if(checkItem[i].type=='check'){
                               for(var j=0;j<checkItem[i].item.length;j++){
                                   num=num*1+checkItem[i].item[j].Total_charges*1;
                               }
                               checkItem[i].Total_charges=num;
                           }

                      }
                       checkDetail.checkItem=checkItem;
                      this.setState({
                        checkDetail:checkDetail,
                        phone:checkDetail.patientTel
                      })
                      if(!!checkDetail.refundSerialNo){
                          var s=JSON.parse(checkDetail.refundSerialNo);
                          checkDetail.refundNo=s.refundId;
                      }
                      var diagnosis1=checkDetail.onlineCheckListCaseVo.mainDiagnosis;
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
                      console.log("or",this.state.checkDetail)
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
    showTips(text) {
        let { tipsConfig, tipsText }=this.state;
        tipsConfig.type = 'warn';
        tipsConfig.show = true;
        tipsText = text || '取消原因不能为空';
        this.setState({
          tipsText: tipsText,
          tipsConfig: tipsConfig
        });
        this.state.tipsTimer = setTimeout(()=> {
          tipsConfig.show = false;
          this.setState({
            tipsText: tipsText,
          });
        }, 2000);
      }
    cancel(id,cancelVal) {
        this.showLoading();
         Api
             .cancel({
                 orderId:id,
                 refundDesc:cancelVal,
                 userId:this.state.checkDetail.userId,
                 hisId:'2214'
             })
             .then((res) => {
                 this.hideLoading();
                 this.getDetail();
             }, e=> {
              this.hideLoading();
                 this.setState({
                     msg:e.msg,
                     showIOS1:true
                 })
             });
    }
    prePay(){
        /* 
        this.context.router.push({
                    pathname:'consult/pay',
                    query:{id:checkDetail.id,source:'check',orderId:checkDetail.orderStr,userId:checkDetail.userId}
                }) */

                Api
             .prePay({
                 id:this.state.checkDetail.id,
                 patientId:this.state.checkDetail.patientId,
                 hisId:'2214'
             })
             .then((res) => {
               //  this.getDetail();
             }, e=> {
                 this.setState({
                     msg:e.msg,
                     showIOS1:true
                 })
             });

    }
   
  
   

  render() {
    const {msg,checkDetail,edit,showMore,mainDiagnosis,phone,orderDetail,leftTimeFlag,leftTime}=this.state
    return (
        <div className="container page-check-detail">
            <div className="home "><span className="jian"
                                        onClick={()=>{
                                            this.context.router.push({
                                                pathname:'ordermng/orderlist',
                                                query:{userId:checkDetail.userId,busType:'check'}
                                            });
                                      }}
                ></span>订单详情
            </div>
            <Toast icon="success-no-circle" show={this.state.showToast}>修改成功</Toast>
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
            <Toptips {...this.state.tipsConfig}>{this.state.tipsText}</Toptips>  
         <Dialog {...this.state.dialogConfig} >
          <form ref="cancelInpt">
            <div className="because">
              <div className="weui-cells weui-cells_checkbox">
                <label className="weui-cell weui-check__label">
                  <div className="weui-cell__hd">
                    <input type="checkbox" className="weui-check" name="checkbox1" value='医生开错单'/>
                    <i className="weui-icon-checked"></i>
                  </div>
                  <div className="weui-cell__bd">
                    <p>医生开错单</p>
                  </div>
                </label>
                <label className="weui-cell weui-check__label">
                  <div className="weui-cell__hd">
                    <input type="checkbox" name="checkbox1" className="weui-check" value='费用太贵'/>
                    <i className="weui-icon-checked"></i>
                  </div>
                  <div className="weui-cell__bd">
                    <p>费用太贵</p>
                  </div>
                </label>
                <label className="weui-cell weui-check__label">
                  <div className="weui-cell__hd">
                    <input type="checkbox" name="checkbox1" className="weui-check" value='不想做该检查了'/>
                    <i className="weui-icon-checked"></i>
                  </div>
                  <div className="weui-cell__bd">
                    <p>不想做该检查了</p>
                  </div>
                </label>
              </div>
              <textarea className="m-cancel-text" ref="yuanyin" placeholder="请输入取消原因"/>

            </div>
          </form>
        </Dialog>
          <div className='person-info'>
               <div >
                  <p>就诊人：{checkDetail.patientName}</p>
                  <p>性别：{checkDetail.patientSex=='M'?'男':'女'}</p>
                  <p style={{textAlign:'right'}}>年龄：{checkDetail.patientAge}岁</p>
               </div>
               <div>
               <p>就诊卡：{checkDetail.patCardNo}</p>
               </div>
               <div>
               {!edit&&<p>手机号：{checkDetail.patientTel}</p>}
               {edit&&<p>手机号：<input type="text" maxLength='11' value={phone} onChange={(e)=>{
                             console.log(e.target.value);
                             this.setState({
                                 phone:e.target.value
                             })
               }}/></p>}
               {!!checkDetail&&checkDetail.status=='0'&&<img 
                onClick={()=>{
                    this.setState({
                        edit:true
                    })
                }}
               src="./././resources/images/updateMobile.png" />}

               </div>
          </div>
          <div className='doctor-info'>
             <div className='doctor'>
                 <div className='img'>
                 <img src={checkDetail.doctorImage} />
                 </div>
                  <div className='info'>
                        <p className='name'>{checkDetail.doctorName} <span>{checkDetail.level}</span></p>
                        <p className='hospital'>{checkDetail.hisName}（{checkDetail.deptName}）</p>
                  </div>
             </div>
             <div className='health-status'>
                <p>就诊时间：{checkDetail.visitDate}</p>
                <p><span style={{letterSpacing:'9px'}}>诊   </span>
                断：{!!mainDiagnosis?mainDiagnosis:''}</p>
             </div>
          </div>
          <div className='check-order'>
              
              <div className='order-item righttab' onClick={()=>{ 
                this.context.router.push({
                    pathname:'/ordermng/checkadd',
                    query:{content:JSON.stringify(checkDetail.addInfo)}
                }) 
            }}
             >
                 <p>网络门诊</p>
                 <p>￥{!!checkDetail.addInfo&&!!checkDetail.addInfo.totalFee?checkDetail.addInfo.totalFee:''}</p>
              </div>

              {!!checkDetail.checkItem&&checkDetail.checkItem.length>0&&checkDetail.checkItem.map((item,index)=>{
                   return(
                    <div className={`order-item righttab ${!!item.item&&item.refund=='1'?'grey':!!item.refund&&item.refund=='1'?'grey':''}`} key={index}
                    onClick={()=>{ 
                        this.context.router.push({
                            pathname:'/ordermng/checkorder?check='+JSON.stringify(item)+"&case="+JSON.stringify(!!this.state.checkDetail.onlineCheckListCaseVo?this.state.checkDetail.onlineCheckListCaseVo:'').replace(/%/g, '%25')
                        }) 
                    }}
                    >
                        {item.type=='inspect'&&<p className={`${!!item.item&&item.refund=='1'?'grey':!!item.refund&&item.refund=='1'?'grey':''}`}>{item.type=='inspect'?item.Lab_sheet_item:item.subItem}</p>}
                        {item.type=='check'&&<p className={` ${!!item.item&&item.refund=='1'?'grey':!!item.refund&&item.refund=='1'?'grey':''}`}>{item.Exam_class?item.Exam_class:''}{item.Exam_sub_class?"|"+item.Exam_sub_class:''}{item.Exam_lower_sub_class&&item.Exam_lower_sub_class!='ALL'?"|"+item.Exam_lower_sub_class:''}</p>}
                        <p>￥{item.Total_charges} {!!item.item&&item.refund=='1'?'| 已退款':!!item.refund&&item.refund=='1'?'| 已退款':''}</p>
                    </div>
                   )
                   
              })}
            

          </div>
          <div className='register-info'>
               <div className='title'>
                    <p>就诊指引
                     <span></span>
                    </p>
                    {!showMore&&<a onClick={()=>{
                        this.setState({
                            showMore:true
                        })
                    }}>查看更多</a>}
                    {showMore&&<a onClick={()=>{
                        this.setState({
                            showMore:false
                        })
                    }}>收起更多</a>}
               </div>
                {!showMore&&<div className='info'>
                    <p className='sub-title'>1、如何检查</p>
                     <p className='text-info'>按照检查单项目，到检查科室，出示您的实体就座卡，若没有实体就诊卡，出示您的电子就诊卡二维码</p>
                     
              </div>}
              {showMore&&<div className='info'>
                    <p className='sub-title'>1、如何检查</p>
                    <p className='text-info'>按照检查单项目，到检查科室，出示您的实体就诊卡，若没有实体就诊卡，出示您的电子就诊卡二维码。</p>
                    <p className='sub-title'>2、如何就诊</p>
                    <p className='text-info'>根据就诊时间，到所在科室找到医生即可（建议提前检查，检查完毕后再向医生就诊）。</p>
                    <p className='sub-title'>3、如何查看报告</p>
                    <p className='text-info'>在报告出来后，在个人中心查看我的检验检查报告。</p>
                    <p className='sub-title'>4、如何取实体报告</p>
                    <p className='text-info'>当报告结果出来后，在取报告窗口，出示您的检查单条形码。检查单条形码就在检验检查报告页面个人中心>病历记录>检查单。</p>
                    <p className='sub-title'>5、如何报告解读</p>
                    <p className='text-info'>在个人中心查看报告，并可对开具本次报告的医生，发起报告解读。</p>
                     
              </div>}
          </div>
          {!!checkDetail&&checkDetail.status=='4'&&<div className='order-info'>
               <div className='title'>
                    <p>订单信息
                     <span></span>
                    </p>
               </div>
                <div className='info'>
                   <div className='item'>
                      <p>医院订单号</p>
                      <p >
                        
                      {!!checkDetail.checkItem&&checkDetail.checkItem.length>0&&checkDetail.checkItem.map((item,index)=>{
                        return(
                         
                              <span key={index} style={{paddingLeft:'10px',display:'block'}}>{item.Hospital_tradeno}</span>
                            
                        
                        )
                        
                   })}
                   </p>
                   </div>
                   <div className='item'>
                      <p>支付流水号</p>
                      <p>
                      {checkDetail.paySerialNumber&&<span  style={{paddingLeft:'10px',display:'block'}}>
                        {checkDetail.paySerialNumber}
                      </span>}
                      {checkDetail.subPaySerialNumber&&<span  style={{paddingLeft:'10px',display:'block'}}>
                        {!!checkDetail.subPaySerialNumber?checkDetail.subPaySerialNumber:''}}
                      </span>}
                     </p>                 
                       </div>
                   <div className='item'>
                      <p>支付时间</p>
                      <p>{checkDetail.payTime}</p>
                   </div>
                   <div className='item'>
                      <p>退款流水号</p>
                      <p>
                        {!!checkDetail.checkItem&&checkDetail.checkItem.length>0&&checkDetail.checkItem.map((item,index)=>{
                          return(
                         <p>{!!item.item&&!!item.refundSerialNo?item.refundSerialNo:!!item.refundSerialNo&&item.refundSerialNo?item.refundSerialNo:''}</p>
                          
                          )
                          
                     })}
                      </p>
                   </div>
                   <div className='item'>
                      <p>退款时间</p>
                      <p>{checkDetail.refundTime}</p>
                   </div>
                  
                </div>
          </div> }
          {!!checkDetail&&checkDetail.status=='2'&&<div className='order-info'>
               <div className='title'>
                    <p>订单信息
                     <span></span>
                    </p>
               </div>
                <div className='info'>
                   <div className='item'>
                      <p>医院订单号</p>
                      <p >
                        
                      {!!checkDetail.checkItem&&checkDetail.checkItem.length>0&&checkDetail.checkItem.map((item,index)=>{
                        return(
                         
                              <span key={index} style={{paddingLeft:'10px',display:'block'}}>{item.Hospital_tradeno}</span>
                            
                        
                        )
                        
                   })}
                   </p>
                   </div>
                   <div className='item'>
                      <p>支付流水号</p>
                      <p>
                      {checkDetail.paySerialNumber&&<span  style={{paddingLeft:'10px',display:'block'}}>
                        {checkDetail.paySerialNumber}
                      </span>}
                      {checkDetail.subPaySerialNumber&&<span  style={{paddingLeft:'10px',display:'block'}}>
                        {!!checkDetail.subPaySerialNumber?checkDetail.subPaySerialNumber:''}}
                      </span>}
                     </p>
                   </div>
                   <div className='item'>
                      <p>支付时间</p>
                      <p>{checkDetail.payTime}</p>
                   </div>
                   <p style={{color:'red',fontSize:'13px'}}>注：取消后挂号费无法退回，只能退回检验检查费用。</p>
                   
                  
                  
                </div>
          </div>}
          <div className='submit-btn'>
          
         {  !!checkDetail&&checkDetail.status=='2'&& 
         <p 
         className="delete"
          onClick={()=>{
              this.cancelConfirm();
             // this.cancel(checkDetail.orderStr)
          }}
         >取消检验检查</p>
        }
              {!!checkDetail&&(checkDetail.status=='4'||checkDetail.status=='3')&& <p className='cancel'>已取消</p> }
              {!!checkDetail&&(checkDetail.status=='5')&& <p className='cancel' style={{color:'#f57f17'}}>支付异常</p> }
              {!!checkDetail&&(checkDetail.status=='6')&& <p className='cancel' style={{color:'red'}}>支付失败</p> }
              {!!checkDetail&&(checkDetail.status=='5')&& <p className='infos'>对不起，由于系统网络原因导致本次缴费异常，我们将在3个工作日内为您及时处理。</p> }
              {!!checkDetail&&(checkDetail.status=='6')&& <p className='infos'>对不起，由于系统网络原因导致本次缴费失败，我们将在3个工作日内为您及时处理。</p> }
              {!!checkDetail&&(checkDetail.status=='1'||checkDetail.status=='0')&&phone.length>=11&&<p className='sure' onClick={()=>{
                if(!!this.state.checkDetail.addInfo.hasPay&&this.state.checkDetail.addInfo.hasPay=='1'){
                    this.context.router.push({ 
                        pathname:'consult/pay',
                    query:{status:'1',source:'check',hospitalUserId:this.state.checkDetail.hospitalUserId,hospitalTradeno:this.state.checkDetail.addInfo.hospitalTradeno,checkId:this.state.checkDetail.id,addFee:this.state.checkDetail.addInfo.totalFee,checkFee:this.state.checkDetail.totalFee,patientId:this.state.checkDetail.patientId,isPay:'1'}
                }) 
                }else{
                    this.context.router.push({
                        pathname:'consult/pay',
                        query:{hospitalUserId:this.state.checkDetail.hospitalUserId,addFee:this.state.checkDetail.addInfo.totalFee,checkFee:this.state.checkDetail.totalFee,patientId:this.state.checkDetail.patientId,checkId:this.state.checkDetail.id,source:'check',orderId:this.state.checkDetail.orderStr,userId:this.state.checkDetail.userId,addId:this.state.checkDetail.addInfo.subOrderId,status:!!this.state.checkDetail.addInfo&&!!this.state.checkDetail.addInfo.hasPay?this.state.checkDetail.addInfo.hasPay:'',hospitalTradeno:this.state.checkDetail.addInfo.hospitalTradeno}
                    }) 
                } 
                
              }}>确定支付</p> }
              {!!checkDetail&&checkDetail.status=='0'&&phone.length<11&&<p className='sure' style={{background:'#ccc'}} onClick={()=>{
              
              }}>确定支付</p> }
          </div>
        </div>
    );
  }
}
export default Connect()(Widget);