import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import { Link } from 'react-router';
import * as Api from './confirmCheckApi';
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
            msgList: [],
            quiryNum: 0,
            showToast: false,
            showLoading: false,
            toastTimer: null,
            loadingTimer: null,
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            no:3,
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
            msg: '',
            checkInfo:[],//订单详情
            itemList:[],//检查项
            patientTel:'',//就诊人电话
            time:'',//申请时间
        };
    }
    componentDidMount() {
         this.getCheckInfo(this.props.location.query.id,this.props.location.query.orderId,this.props.location.inquiryId)
         Utils.getJsByHide();
    }
    //确认
    confrim(){
        if(this.state.checkInfo.status=='1'){
            var replaceUrl=window.location.origin+"/views/p2214/#/consult/pay?orderId="+this.state.checkInfo.orderIdStr+"&totalFee="+
            this.state.checkInfo.totalFee+"&inquiryId="+this.state.checkInfo.inquiryId+"&doctorName="+this.state.checkInfo.doctorName+"&deptName="+this.state.checkInfo.deptName+
            "&patientCard="+this.state.checkInfo.patCardNo+"&patientName="+this.state.checkInfo.patientName+"&id="+this.state.checkInfo.id;
       top.window.location.replace(replaceUrl);
        }else{
            Api 
            .confirm({hisId:2214,platformId:2214,id:this.state.checkInfo.id,patientTel:this.state.patientTel})
            .then((res) => {
                if (res.code == 0) {
                     var replaceUrl=window.location.origin+"/views/p2214/#/consult/pay?orderId="+this.state.checkInfo.orderIdStr+"&totalFee="+
                     this.state.checkInfo.totalFee+"&inquiryId="+this.state.checkInfo.inquiryId+"&doctorName="+this.state.checkInfo.doctorName+"&deptName="+this.state.checkInfo.deptName+
                     "&patientCard="+this.state.checkInfo.patCardNo+"&patientName="+this.state.checkInfo.patientName+"&id="+this.state.checkInfo.id;
                top.window.location.replace(replaceUrl);
                     
                }
            }, (e) => {
                this.hideLoading();
            
            });
        }
        
    }
    //获取检查单信息
    getCheckInfo(id,orderId,inquiryId){
        Api 
        .getCheckInfo({hisId:2214,platformId:3,id:id,inquiryId:this.props.location.query.inquiryId})
        .then((res) => {
            if (res.code == 0 && res.data != null) {
                 var dateee = new Date(res.data.createTime).toJSON();

        
             var date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')  
                 this.setState({
                     checkInfo:res.data,
                     itemList:JSON.parse(res.data.checkItem),
                     patientTel:res.data.patientTel,
                     time:date
                 })
            }
        }, (e) => {
            this.hideLoading();
           /* this.setState({
                msg: e.msg,
                showIOS1: true
            })*/
        });
    }

   

    getMsg() {
        Api
            .getMsg()
            .then((res) => {
                if (res.code == 0 && res.data != null) {
                    this.setState({
                        quiryNum: res.data.length
                    })
                }
            }, (e) => {
                this.hideLoading();
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })
            });
    }
    showToast() {
        this.setState({showToast: true});
        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
    }

   
   /*获取咨询列表*/
    getInquiryList() {
        this.showLoading();
        Api
            .getInquiryList()
            .then((res) => {
                if (res.code == 0) {
                    this.hideLoading();

                    this.setState({
                        msgList: res.data
                    })

                    if(this.props.location.query.inquiryId&&this.props.location.query.s!=1){
                        window.location.href=window.location.href+"&s=1";
                        this.context.router.push({
                            pathname:'inquiry/chat',
                            query:{
                                inquiryId:this.props.location.query.inquiryId,
                                orderId:this.props.location.query.orderId,
                                status:this.props.location.query.status,
                                no:1
                            }
                        })
                    }
                }
            }, (e) => {
                this.hideLoading();
            });
    }

    toNext(type) {
        if (type == 1) {
            this.context.router.replace({
                pathname: '/home/index'
            });
        }
        if (type == 3) {
            this.context.router.replace({
                pathname: '/usercenter/home'
            });
        }
    }
    render() {
        const {time,patientTel,checkInfo,itemList,msgList,msg}=this.state
        return (
            <div className="container page-confirm-check">
            <div className="home" style={{position:'fixed',width:'100%',top:'0'}}><span className="jian"
                                    onClick={()=>{
                                        if(this.props.location.query.resource!='1'){
                                            this.context.router.push({
                                                pathname:'inquiry/chat',
                                                query:{inquiryId:checkInfo.inquiryId,orderId:checkInfo.orderIdStr,name:checkInfo.doctorName,status:this.props.location.query.status}
                                               })
                                        }else{
                                            this.context.router.goBack();
                                        }
                                    
                                      }}
            ></span>检验检查单详情
        </div>
                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons}
                        show={this.state.showIOS1}>
                    {msg}
                </Dialog>
                <div className='user-info'>
                         <div className='info-item'>
                           <p>就诊人</p>
                           <p>{checkInfo.patientName}</p>
                         </div>
                         <div className='info-item'>
                           <p>就诊卡</p>
                           <p>{checkInfo.patCardNo}</p>
                         </div>
                         <div className='info-item'>
                           <p className='phone'>联系电话</p>
                           <input type="number" maxLength='11' disabled={checkInfo.status=='0'?'':'disabled'} value={patientTel}  onChange={(e)=>{
                            if(checkInfo.status=='0')
                            this.setState({
                                patientTel:e.target.value
                            })
                            }}/>
                           {checkInfo.status=='0'&&<img src='../../../resources/images/delete.png' onClick={()=>{
                                   this.setState({
                                       patientTel:''
                                   })
                           }}/>}
                           </div>
                </div>
                <div className='check-item'>
                   <div className='item'>
                     <p>院区</p>
                     <p>{checkInfo.hisName}</p>
                   </div>
                   <div className='item'>
                      <p>申请时间</p>
                      <p>{checkInfo.createTime}</p>
                   </div>
                   {itemList.length>0&&
                        <div className='item-info'>
                            <div className='item-name'>检验检查项</div>
                            <div className='items'>
                           { itemList.map((item,index)=> {
                                return (
                                    <div className='info rightTab' onClick={()=>{
                                        this.context.router.push({
                                            pathname:'/check/checkInfo',
                                            query:{doctorName:checkInfo.doctorName,content:JSON.stringify(item),time:checkInfo.createTime,hisName:checkInfo.hisName,deptName:checkInfo.deptName}
                                        })
                                    }}> 
                                    <p>{item.project_name}</p>
                                    <p>￥{(item.price / 100).toFixed(2)}</p>
                                </div>
                                )
                           
                    
                        })
                    }
                            </div>
                            
                        </div>
                     }
                    <div className='fee'>
                     合计：<span>￥{(checkInfo.totalFee / 100).toFixed(2)}</span>
                   </div>
                </div>
                <div className='check-status'>
                  <div className='status-item'>
                    <p>付款状态</p>
                    <p>{checkInfo.status=='2'?'已付款':'未付款'}</p>
                  </div>
                  <div className='status-item'>
                   <p>订单号</p>
                   <p>{checkInfo.orderIdStr}</p>
                  </div>
                  <div className='status-item register-info rightTab'>
                    <p className='info-title'>就诊指引</p>
                     <p className='info-text' onClick={()=>{
                         this.context.router.push({
                             pathname:'/check/registerInfo'
                         })
                     }}>请检查当天到检查执行科室，出示您的就诊卡（或电子就诊卡）</p>
                  </div>
                  <div className='status-item rightTab' onClick={()=>{
                    this.context.router.push({
                        pathname:'/usercenter/userinfo',
                        query:{patientId:checkInfo.patientId,source:'1'}
                    })
                
                  }}>
                   我的就诊卡
                  </div>
                </div>
                {(checkInfo.status=='0'||checkInfo.status=='1')&&<div className={`${patientTel.length==11?'submit-btn':'submit-grey'}`} onClick={()=>{
                    if(patientTel.length==11){
                        this.confrim()
                    }
                }}>
                 确定
                </div>}

                <div className='register-tip'>
                  <p>请于今日内完成支付。若未支付，订单将会自动取消，您将无法检查</p>
                  <p>客服电话：22222222</p>
                  </div>
            </div>
        );
    }
}

export default Connect()(Widget);
