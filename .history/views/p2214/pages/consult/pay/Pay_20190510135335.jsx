import React, { Component } from 'react';
import { Link } from 'react-router';
import hashHistory from 'react-router/lib/hashHistory';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';

import * as Api from './payApi';
import 'style/index.scss';

class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            orderInfo: {},
            orderInfo1: {},
            orderId: '',
            inquiryId: '',
            showToast: false,
            showLoading: false,
            toastTimer: null,
            loadingTimer: null,
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            showAndroid2: false,
            hrefUrl:'',
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
                        label: '放弃付款',
                        onClick: this.delete.bind(this)
                    },
                    {
                        type: 'primary',
                        label: '付款',
                        onClick: this.sure.bind(this)
                    }
                ]
            },
            msg:'',
            // 剩余时间大于0
            leftTimeFlag: false,
            // 剩余支付时间
            leftTime: '00:00',
            totalFee: 0,
            go:0,
            appId:'',
            addInfo:'',
            payData:{},
            noPay:true,
            checkDetail:'',
        };
    }

    componentDidMount() {
        this.sum('inquiry_pay',1);

          this.getJs();
        this.setState({
            orderId:this.props.location.query.orderId,
            inquiryId:this.props.location.query.inquiryId,
            totalFee:this.props.location.query.totalFee||0,

        })
        const orderId =this.props.location.query.orderId;
        //if(!this.props.location.query.patientName){
         //   this.getConsultDet(orderId);
        //} 
        console.log("ds",this.props.location.query);
        if(this.props.location.query.source){
             if(this.props.location.query.source=='check'){
                this.getDetail();
                console.log("check")
                     
                
               // this.getCheckPay();
             }else{
                   
                    this.getAddPay(this.props.location.query.orderId);

                  
             }
           
        }else{
            console.log("log2");
            this.getConsultDet(orderId);
        }


    }
    getJs() {
        console.log(window.location.href.substring(0,window.location.href.indexOf("#")-1))
        Api
            .getJsApiConfig({url:window.location.href.substring(0,window.location.href.indexOf("#")-1)})
            .then((res) => {
                if (res.code == 0) {
                    this.setState({
                        appId:res.data.appId
                    })
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
    showToast() {
        this.setState({showToast: true});

        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
    }
    delete(){
           this.hideDialog();
           this.context.router.goBack();
    }
    sure(){
        this.hideDialog();
        this.confirmPay()
    }
    sum(code,type){
        Api
        .getSum({
            hisId:'2214',
            code:code,
            type:type
        })
        .then((res) => {

          
        }, (e) => {

        });
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
    /*支付*/
    confirmPay() {
        if(this.props.location.query.source){
            if(this.props.location.query.status=='1'){
                this.prePay();
             // window.location.href=this.state.orderInfo1.payUrl;
           }else{
               if(!!this.state.addInfo&&this.state.addInfo.isPay=='1'){
                   this.prePay();
                   
                   
                   
               }else{
                   window.location.href=this.state.orderInfo1.payUrl;
   
               }
           }

        }else{
            window.location.href=this.state.orderInfo.payUrl;
        }
       
     
    }
    getAddPay(orderId) {
      
            Api
            .getAddInfo({
                orderId: orderId,
                source:this.props.location.query.source,
                hospitalUserId:this.props.location.query.hospitalUserId,
                hospitalTradeno:this.props.location.query.hospitalTradeno,
               
            })
            .then((res) => {
                if (res.code == 0) {
                    this.setState({
                        orderInfo:res.data,
                        totalFee:res.data.totalFee||0
                    })

                }
            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });
    
    }
    getInfo(id){
        Api
            .getInfo({
                hospitalTradeno:id,
            })
            .then((res) => {
                if(res.code==0){
                    this.setState({
                        addInfo:res.data
                    })
                      console.log("check2")
                        if((res.data.isPay=='0'&&res.data.orederStatus=='2'&&res.data.isVisit=='0')||
                        (res.data.isPay=='1'&&res.data.orederStatus=='1'&&res.data.isVisit=='2')||
                        (res.data.isPay=='1'&&res.data.orederStatus=='1'&&res.data.isVisit=='1')||
                        (res.data.isPay=='2'&&res.data.orederStatus=='3'&&res.data.isVisit=='0')||
                        (res.data.isPay=='1'&&res.data.orederStatus=='1'&&res.data.isVisit=='3')){
                           this.update();
                           this.setState({
                            noPay:false
                         })
                         this.getDetail1();

                        }else{
                           
                            this.getAddPay1(id)
                        }
                    
                }
            }, (e) => {
                
            });
    }
   
    getAddPay1(id) {
      
      Api
      .getAddInfo({
          source:'1',
          hospitalUserId:this.props.location.query.hospitalUserId,
          hospitalTradeno:id,
         
      })
      .then((res) => {
          if (res.code == 0) {
              this.setState({
                  orderInfo1:res.data,
                  totalFee1:res.data.totalFee||0
              })
          }
      }, (e) => {
          this.setState({
              msg:e.msg,
              showIOS1:true
          })
      });

}
    getCheckPay(id) {
      
        Api
        .getCheckInfo({
            orderId: id,
            hisId:'2214',
            source:'1'
           
        })
        .then((res) => {
            if (res.code == 0) {
                this.setState({
                    orderInfo1:res.data,
                    totalFee:res.data.totalFee||0
                })
                window.location.href=res.data.payUrl;
                 
            }
        }, (e) => {
            this.setState({
                msg:e.msg,
                showIOS1:true
            })
        });

}
update() {
      
    Api
    .update({
        id: this.props.location.query.checkId,
        status:'3',
      
       
    })
    .then((res) => {
        this.setState({
            noPay:false
         })
         console.log(this.state.noPay)
    }, (e) => {
        
    });

}
    /*倒计时*/
    getLeftTime(time = 0) {
        if (time <= 0) {
            this.state.leftTimer && clearInterval(this.state.leftTimer);
            this.setState({
                leftTimeFlag:false,
                leftTime:'00:00',
            })
            return;
        }

        const minute = `00${Math.floor(time / 60)}`.substr(-2);
        const second = `00${Math.floor(time % 60)}`.substr(-2);
        this.setState({
            leftTimeFlag:true,
            leftTime:`${minute}:${second}`,
        })
        var leftTimer=this.state.leftTimer;
        leftTimer = setTimeout(() => {
            this.getLeftTime(--time);
        }, 1000);
        this.setState({
            leftTimer:leftTimer
        })
    }
    orderStatus(orderId) {
        Api
            .orderStatus({orderId:orderId})
            .then((res) => {
                

            }, (e) => {
                
            });


    }
     /*获取订单信息*/
    getConsultDet(orderId) {
        Api
            .getConsultDet1({orderId:orderId})
            .then((res) => {
                if (res.code == 0 && res.data != null) {
                    this.setState({
                        orderInfo:res.data,
                    })
                    //window.location.href=window.location.href+"&deptId="+res.data.deptId+"&doctorId="+res.data.doctorId;
                    this.getLeftTime(res.data.leftPayTime || 0);

                }

            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });


    }
    getDetail() {
        Api
            .getCheckDetail({
                id:this.props.location.query.checkId,
                hisId:'2214'
            })
            .then((res) => {
                if (res.code == 0) {
                     this.setState({
                       checkDetail:res.data,
                     })
                     console.log("check1")
                        if(this.props.location.query.isPay=='1'){
                               
                        }else{
                            this.getInfo(res.data.subscribeOrderNo);
                        }
                        
                    
                     
                     console.log("dd",this.state.checkDetail)
                }
            }, e=> {
            });
   }
   getDetail1() {
    Api
        .getCheckDetail({
            id:this.props.location.query.checkId,
            hisId:'2214'
        })
        .then((res) => {
            if (res.code == 0) {
                 this.setState({
                   checkDetail:res.data,
                 })
                
                 
                 console.log("dd",this.state.checkDetail)
            }
        }, e=> {
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
                 id:this.props.location.query.checkId,
                 patientId:this.props.location.query.patientId,
                 hisId:'2214'
             })
             .then((res) => {
                 
                 if(res.code==0){
                    this.getCheckPay(this.state.checkDetail.orderStr)
                    
                        
                 }
             }, e=> {
                 this.setState({
                     msg:e.msg,
                     showIOS1:true
                 })
             });

    }


    render() {
        const {orderInfo1,orderInfo,msg,addInfo,checkDetail,noPay,leftTimeFlag,leftTime,totalFee}=this.state;
        return (
            <div className='page1-pay'>
                <div className="home"><span className="jian"
                                            onClick={()=>{
                                                 if(this.props.location.query.source){
                                                     if(this.props.location.query.source=='check'){
                                                        this.context.router.push({
                                                            pathname:'ordermng/orderdetail',
                                                            query:{id:this.props.location.query.checkId,
                    
                                                            }  
                                                        })
                                                     }else{
                                                        this.context.router.goBack();
                                                     }

                                                    


                                                }else{  
                                                    if(this.props.location.query.card==1){
                                                        this.context.router.push({
                                                    pathname:'ordermng/orderdetail',
                                                    query:{orderId:this.props.location.query.orderId,
            
                                                    }
                                                    })
                                                        }else{
                                                                this.context.router.push({
                                                    pathname:'consult/confirminfo',
                                                    query:{doctorId:this.props.location.query.doctorId,
                                                    deptId:this.props.location.query.deptId,
                                                    totalFee:this.props.location.query.totalFee
                                                    }
                                                    })
                                                        }
                                                
                                                    }

                                      }}
                    ></span>收银台
                </div>
                <a href={this.state.hrefUrl} id="a"></a>
                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                    {msg}
                </Dialog>
                <Dialog type="ios" title={this.state.style2.title} buttons={this.state.style2.buttons}
                        show={this.state.showIOS2}>
                    请于今日内完成支付。若未支付，订单将会自动取消，您将无法就诊
                </Dialog>
                <div className='fee-box'>
                    {leftTimeFlag&&
                    <div className="warm-tip1">
                        {leftTime!='0'&&<div className="lefttime">请在 {leftTime}秒内完成支付</div>}
                    </div>}
                    {this.props.location.query.source&&
                        <div className="warm-tip1">
                        <div className="lefttime">请在今日23：30前完成支付</div>
                    </div>}
                    

                    {this.props.location.query.source!="check"&&<div className='fee-item'>
                        <div className='des-fee'>支付金额（元）</div>
                        <span style={{fontSize:'18px'}}>￥</span>{(totalFee/100).toFixed(2)||'0:00'}
                        {/*{{WxsUtils.formatMoney(totalFee,100)}}*/}
                    </div>}
                    {this.props.location.query.source=="check"&&noPay&&<div className='fee-item'>
                        <div className='des-fee'>待缴费金额（元）</div>
                        
                        <span style={{fontSize:'18px'}}>￥</span>{addInfo.isPay=='1'?(checkDetail.totalFee/100).toFixed(2)||'0.00':((addInfo.fees/100)+(checkDetail.totalFee/100)).toFixed(2)}

                        {/*{{WxsUtils.formatMoney(totalFee,100)}}*/}
                    </div>}
                    {this.props.location.query.source=="check"&&!noPay&&<div className='fee-item'>
                    <div className='des-fee'>待缴费金额（元）</div>
                    
                    <span style={{fontSize:'18px'}}>￥</span>0.00

                    {/*{{WxsUtils.formatMoney(totalFee,100)}}*/}
                </div>}
                   

                </div>
              {this.props.location.query.source!="check"&&<div className="mm-list">
                    <div className="content">
                        <div className="list">
                            <div className="list-item">
                                <div className="item-label">
                                  <img src="./././resources/images/pay-doctor.png"/>医生姓名
                                </div>
                                <div className="item-value">{orderInfo.doctorName}</div>
                            </div>
                            <div className="list-item">
                                <div className="item-label">
                                <img src="./././resources/images/pay-dept.png"/>
                                科室名称
                                </div>
                                <div className="item-value">{orderInfo.deptName}</div>
                            </div>
                            <div className="list-item">
                                <div className="item-label">
                                <img src="./././resources/images/pay-type.png"/>
                                业务类型
                                </div>
                                <div className="item-value">{orderInfo.typeName}</div>
                            </div>
                        </div>
                    </div>
                </div>}
                {this.props.location.query.source!="check"&&<div className="mm-list">
                    <div className="content">
                        <div className="list">
                            <div className="list-item">
                                <div className="item-label">
                                <img src="./././resources/images/pay-patient.png"/>
                                就诊人
                                </div>
                                <div className="item-value">{orderInfo.patientName}</div>
                            </div>
                            <div className="list-item">
                                <div className="item-label">
                                <img src="./././resources/images/pay-card.png"/>
                                就诊卡号</div>
                                <div className="item-value">{orderInfo.patCardNo}</div>
                            </div>
                        </div>
                    </div>
                </div>}
    
                {this.props.location.query.source=="check"&&!!checkDetail&&!!checkDetail.doctorName&&<div className="mm-list">
                    <div className="content">
                        <div className="list">
                            <div className="list-item">
                                <div className="item-label">
                                  <img src="./././resources/images/pay-doctor.png"/>医生姓名
                                </div>
                                <div className="item-value">{checkDetail.doctorName}</div>
                            </div>
                            <div className="list-item">
                                <div className="item-label">
                                <img src="./././resources/images/pay-dept.png"/>
                                科室名称
                                </div>
                                <div className="item-value">{checkDetail.deptName}</div>
                            </div>
                            <div className="list-item">
                                <div className="item-label">
                                <img src="./././resources/images/pay-patient.png"/>
                                就诊人
                                </div>
                                <div className="item-value">{checkDetail.patientName}</div>
                            </div>
                            <div className="list-item">
                                <div className="item-label">
                                <img src="./././resources/images/pay-card.png"/>
                                就诊卡号</div>
                                <div className="item-value">{checkDetail.patCardNo}</div>
                            </div>

                        </div>
                    </div>
                </div>}
                {this.props.location.query.source=="check"&&<div className="mm-list">
                    <div className="content">
                        <div className="list">
                            
                            <div className="list-item">
                                <div className="item-label">
                                <img src="./././resources/images/pay-type.png"/>
                                业务类型
                                </div>
                                <div className="item-value">网络门诊</div>
                            </div>
                            <div className="list-item">
                                <div className="item-label">
                                <img src="./././resources/images/pay_fee.png"/>
                                金额
                                </div>
                                {this.props.location.query.isPay=='1'&&<div className="item-value">￥{((this.props.location.query.addFee).toFixed(2))||'0.00'}</div>}
                                {this.props.location.query.isPay!=='1'&&<div className="item-value">￥{(!!addInfo.fees?(addInfo.fees/100).toFixed(2):'')||'0.00'}</div>}

                                </div>
                            <div className="list-item">
                                <div className="item-label">
                                <img src="./././resources/images/pay_jin.png"/>
                                支付状态
                                </div>
                                <div className="item-value">{(addInfo.isPay=='1'||this.props.location.query.isPay=='1')?'已支付':'未支付'}</div> 
                            </div>

                        </div>
                    </div>
                </div>}
                {this.props.location.query.source=="check"&&<div className="mm-list">
                    <div className="content">
                        <div className="list">
                            
                            <div className="list-item">
                                <div className="item-label">
                                <img src="./././resources/images/pay-type.png"/>
                                业务类型
                                </div>
                                <div className="item-value">检验检查</div>
                            </div>
                            <div className="list-item">
                                <div className="item-label">
                                <img src="./././resources/images/pay_fee.png"/>
                                金额
                                </div>
                                {this.props.location.query.status!=='1'&&<div className="item-value">￥{(checkDetail.totalFee/100).toFixed(2)||'0.00'}</div>}

                                {this.props.location.query.status=='1'&&<div className="item-value">￥{((!!this.props.location.query.checkFee?this.props.location.query.checkFee:checkDetail.totalFee)/100).toFixed(2)||'0:00'}</div>}
                            </div>
                            <div className="list-item">
                                <div className="item-label">
                                <img src="./././resources/images/pay_jin.png"/>
                                支付状态
                                </div>
                                <div className="item-value">{noPay?'未支付':'已过期'}</div>
                            </div>

                        </div>
                    </div>
                </div>}

                 {this.props.location.query.source&&<p className='warm'>注：
                 {this.props.location.query.status=='0'&&addInfo.isPay=='0'&&<span style={{color:'red'}}>
                 因此处存在两种业务类型缴费，所以您需要分两次完成支付，网络门诊费支付后将不支持退款。
                 </span>}
                 请于今日内完成支付，若未支付，订单将会自动取消
                 </p>}

                {<div className='btn'>
                    {orderInfo.canPayFlag == 1 &&this.props.location.query.source!=="check"&&
                    <button  className="submit-btn" onClick={()=>{
                 this.confirmPay()

                 }}>
                        立即支付
                    </button>}

                    {orderInfo.canPayFlag != 1&&!this.props.location.query.source=="check"&&
                    <button disabled  className="submit-btn" >
                        立即支付
                    </button>}
                    {this.props.location.query.source=="check"&&noPay&&
                    <button  className="submit-btn" onClick={()=>{
                 this.confirmPay()

                 }}>
                        立即支付
                    </button>}
                    <div className="empty-box"></div>
                </div>}
            
            </div>
        );
    }
}

export default Connect()(Widget);
