import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
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
        patientName: '全部就诊人',
        isPatShow: false,
        reportList:'1',
        showToast: false,
        showToast1: false,
        showLoading: false,
        toastTimer: null,
        loadingTimer: null,
        showIOS1: false,
        showIOS2: false,
        showIOS3:false,
        showIOS5:false,
        showIOS4:false,
        showAndroid1: false,
        showAndroid2: false,
        isShowProtocol:false,
        style1: { 
            title: '提示', 
            buttons: [
                { type: 'primary',
                    label: '确定',
                    onClick: Utils.hideDialog.bind(this)
                }
            ]
        },
        style5: {
            buttons: [
                {
                    label: '确定',
                    onClick: Utils.hideDialog.bind(this)
                }
            ]
        },
        style3: {
            title: '提示',
            buttons: [
                {
                    type: 'default',
                    label: '取消',
                    onClick: Utils.hideDialog.bind(this)
                },
                {
                    type: 'primary',
                    label: '继续咨询',
                    onClick: this.goInquiry.bind(this)
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
                    label: '报告解读',
                    onClick: this.addQuiry.bind(this)
                }
            ]
        },
        style4: {
            title: '提示',
            buttons: [
                {
                    type: 'default',
                    label: '取消',
                    onClick: Utils.hideDialog.bind(this)
                },
                {
                    type: 'primary',
                    label: '继续咨询',
                    onClick: this.Inquiry.bind(this)
                }
            ]
        },
        msg:'',
        clickItem:555,
        patList: [],
        userInfo:{},
        item1Show:true,//咨询显示
        item3Show:false,//检查单显示
        currentName:'',
        currentId:'',
        inquiryId:'',
        currentPatient:[],
        hisDoctorName:'',
        visitNo:'',
        timeout:false,
        validatePass:'',//验证码
        leftTime: 120,
        isSendValidate: false,
        mobile:'',//字符手机号
        phone:'',//手机号
        phoneShow:false,
        inDate:'',
    }
  }
   /*获取用户信息*/
   getUser(){
    Api 
        .getUser()
        .then((res) => {
             if(res.code==0){
                this.setState({
                    userInfo:res.data,
                    phone:res.data.mobile
                })
                var mobile=res.data.mobile;
                var begin=mobile.substring(0,3);
                var end=mobile.substring(7,11);
                mobile=begin+'****'+end;
                console.log(mobile);
                this.setState({
                    mobile:mobile
                })
               
                 var storage=window.localStorage;
                 //写入b字段
                 storage.userInfo=JSON.stringify(res.data);
             }
        }, (e) => {
        });  
}
hideDialog() {  
    console.log("3232")
    this.setState({
        showIOS1: false,
        showIOS2: false,
        showIOS5:false,
        showAndroid1: false,
        showAndroid2: false,
        phoneShow:true
    });
}
  componentDidMount() {
      this.getCardList();
      this.getUser();
     
    if(!window.localStorage.login_access_token){
        var code;
        if(window.location.origin=='https://tih.cqkqinfo.com'){
            code='ff80808165b46560016817f20bbc00b3';
          }else{
            code='ff80808165b46560016817f30cc500b4';
          }
          var storage=window.localStorage;
          //加入缓存
          storage.isOpenId=1;
          window.location.href = "https://wx.cqkqinfo.com/wx/wechat/authorize/"+code+"?scope=snsapi_base";
          // return false;
             var storage=window.localStorage;
             //加入缓存
             storage.url=window.location.href; 
           
    }else{
         //隐藏分享等按钮
      Utils.getJsByHide();
        if(window.localStorage.goChat==1&&window.localStorage.reportStatus){
            var report=JSON.parse(window.localStorage.reportStatus);
            this.setState({
               patientName: report.patientName,
               isPatShow: report.isPatShow,
               reportList: report.reportList,
               showToast:report.showToast,
               showLoading:report.showLoading,
               toastTimer: report.toastTimer,
               loadingTimer: report.loadingTimer,
               showAndroid1: report.showAndroid1,
               showAndroid2: report.showAndroid2,
               msg:report.msg,
               clickItem:report.clickItem,
               patList:report.patList,
               item1Show:report.item1Show,//咨询显示
               item3Show:report.item3Show,//检查单显示
               currentName:report.currentName,
               currentId:report.currentId,
               currentPatient:report.currentPatient
            })
            console.log("rrport",report);
        }else{
          
        }
    }
  }
  Inquiry(){
    this.setState({
        showIOS1: false,
        showIOS2: false,
        showIOS3:false,
        showIOS4:false,
        showAndroid1: false,
        showAndroid2: false,
    });
    this.addQuiry(this.state.visitNo)
}
  goInquiry(){
    this.setState({
        showIOS1: false,
        showIOS2: false,
        showIOS3:false,
        showIOS4:false,
        showAndroid1: false,
        showAndroid2: false,
    });
    this.context.router.push({
        pathname:'/inquiry/chat',
        query:{inquiryId:this.state.inquiryId,resource:'report'}
    })
}
   addQuiry(visitNo){
       this.hideDialog();
       this.showLoading();
       const params = {
        hisName: this.state.doctor.hisName,
        deptId: this.state.doctor.deptId,
        doctorId: this.state.doctor.doctorId,
        deptName: this.state.doctor.deptName,
        doctorName: this.state.doctor.name,
        totalFee:0,
        type: '1',
        pics:'',
        hisId:2214,
        userId:JSON.parse(window.localStorage.userInfo).id||"",
        patientName:this.state.currentName,
        content: '',
        patCardNo:this.state.currentPatient.patCardNo,
        patientId: this.state.currentPatient.patientId,
        purpose:'免费报告解读',
        purposeType:'9',
        hisDoctorName:this.state.hisDoctorName,
        hospitalVisitNo:visitNo,
        inDate:this.state.inDate
    };
    console.log(params)
       //创建咨询
       Api
       .createOrder(params)
       .then((res) => {
            if(res.code==0){
                this.hideLoading();
                console.log(res);
                this.context.router.push({
                    pathname:'inquiry/chat',
                    query:{inquiryId:res.data.id,resource:'report'}
                })
            }else{
                this.hideLoading();
                if (res.code==-2) {
                    console.log("1")
                    if(res.msg!=null&&res.msg!=''){
                        this.setState({
                            msg:'当前咨询完成后，才能对医生发起新的咨询',
                            showIOS3:true
                        })
                    }
                }else{
                    this.setState({
                        msg: res.msg,
                        showIOS3: true
                    })
                }
            }    
            }, e=> {
           this.hideLoading();
                if (e.code==-2) {
                if(e.msg!=null&&e.msg!=''){
                    this.setState({
                        inquiryId:e.msg||'',
                        msg:'当前咨询完成后，才能对医生发起新的咨询',
                        showIOS3:true
                    })
                }
            }else{
                console.log("2")
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })
            }
       });
   }
    showToast() {
        this.setState({showToast: true});
        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
    }
    showToast1() {
        this.setState({showToast1: true});
        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast1: false});
        }, 2000);
    }
  componentWillUnmount() {
      this.setState({
          patList:[],
          patientName:'全部就诊人',
          isPatShow:false,
          orderList:[]
      })
      window.localStorage.reportStatus=JSON.stringify(this.state);
  }
    selectPat(patientId, patientName) {
        this.setState({
            patientName:patientName,
            isPatShow:false,
        })
        this.getOrderList(patientId);
    }
    openList() {
        this.setState({
            isPatShow:!this.state.isPatShow,
        })
    }
   
    getCardList1() {
        Api
            .getCardList()
            .then((res) => {
                console.log("r",res)
                 if(res.code==0){
                    this.getUser();

                 }
                 }, e=> {
                   
            });
   }
    //获取就诊人列表
     getCardList() {
         this.showLoading();
         Api
             .getCardList()
             .then((res) => {
                  if(res.code==0){
                      var cardList=res.data.cardList;
                      for(var i=0;i<cardList.length;i++){
                          if(i==0){
                              cardList[i].active=true;
                                this.setState({
                                    currentName:cardList[i].patientName,
                                    currentPatient:cardList[i],
                                    currentId:i,
                                })
                          }else{
                            cardList[i].active=false;
                          }
                      }
                      console.log(cardList)
                      this.hideLoading();
                      this.getreportList(cardList[0].patientId);
                      this.setState({
                        patList:cardList
                      })
                  }
                  }, e=> {
                      this.hideLoading();
                    var code;
                    if(window.location.origin=='https://tih.cqkqinfo.com'){
                        code='ff80808165b46560016817f20bbc00b3';
                      }else{
                        code='ff80808165b46560016817f30cc500b4';
                      }
                      var storage=window.localStorage;
                      //加入缓存
                      storage.isOpenId=1;
                      window.location.href = "https://wx.cqkqinfo.com/wx/wechat/authorize/"+code+"?scope=snsapi_base";
                      // return false;
                         var storage=window.localStorage;
                         //加入缓存
                         storage.url=window.location.href;
             });
    }
    /*获取报告列表*/
    getreportList(patientId = '') {
         this.showLoading();
         //390
         var report;   
         Api
             .getreportList({patientId:patientId,source:!!this.props.location.source?this.props.location.source:''})
             .then((res) => {
                 if (res.code == 0) {
                      this.hideLoading();
                      if(res.data.length>0){ 
                        var report=res.data;
                        report.patientId=patientId;
                        for(var i=0;i<report.length;i++){
                          var yes=0;
                          var no=0;
                          var j; 
                                for(j=0;j<report[i].report.length;j++){
                                     if(j==0){
                                        var vDate=Math.round(new Date(report[i].report[j].Visit_date.replace(/-/g,'/')).getTime()/1000);
                                        var nDate=Math.round(new Date().getTime()/1000);
                                        if(vDate<=nDate){
                                            report[i].getTime=1; 
                                        }else{
                                            report[i].getTime=2;
                                        }
                                     }
                                      if(report[i].report[j].type=='1'){
                                          if(report[i].report[j].Results_rpt_date_time){
                                                  yes++;
                                          }else{
                                              no++;
                                          }
                                      }else{
                                          if(report[i].report[j].Report_date_time){
                                              yes++;
                                          }else{
                                              no++;
                                          }
                                      }
                                }  
                                if(j==yes){
                                    report[i].has=1;
                                }
                                if(yes<j){
                                  report[i].has=3;
                                }
                                if(j==no){
                                    report[i].has=2;
                                }
                        }
                        this.setState({
                          reportList:report||[],
                       })
                      }else{
                        this.setState({
                          reportList:[]
                       })
                      }
                 }
             }, e=> {
                this.hideLoading();
                if(e.code=='-2'){
                    this.setState({
                        phoneShow:true
                     })
                }else{
                    this.setState({
                        reportList:[]
                     })
                }
                
             });
    }
     formatDate(value) {
         console.log(value);
            var date = new Date(value).format("yyyy-MM-dd HH:mm");
            if (date == "1970-01-01 08:00")
                return "--";
            else
                return date;
        }
 
    //获取就诊人列表
    getList(index){
        var list=this.state.patList;
        console.log("index",index);
        for(var i=0;i<list.length;i++){
             if(index==i){
                 list[i].active=true;
                 this.setState({
                     currentName:list[i].patientName,
                     currentPatient:list[i],
                     currentId:i,
                 })
             }else{
                 list[i].active=false;
             }
        }
        this.setState({
              patList:list
        })
       this.getreportList(list[index].patientId);
    }
    /**验证手机密码 */
    checkPassword(e){
        //验证密码
        if(this.state.validatePass){
           
            this.showLoading();
            Api
            .validate({type:'check',validateCode:this.state.validatePass})
            .then((res) => {
                this.hideLoading();
                if (res.code == 0) {  
                   //成功 跳转
                    this.setState({
                        phoneShow:false,
                    })
                    this.getCardList();   
                }else{
                    this.hideLoading();
                  
                    this.setState({
                        msg:e.msg,
                    })
                    this.showToast1();
                }
            }, (e) => {
                this.hideLoading();
                this.setState({
                    msg:e.msg,
                })
                this.showToast1();
            });
        }else{
            this.setState({
                msg:'请输入验证码',
               
           })
            this.showToast1();
           
    }
    }
    checkTime(){ 
        Api
           .checkTime()
           .then((res) => {
               this.hideLoading();
               if (res.code == 0) {
                    //成功 跳转
                    this.getCardList();  
               }else{
                   this.hideLoading();
                   this.setState({
                       phoneShow:true
                    })
               }
           }, (e) => {
                    this.hideLoading();
                    this.setState({
                       phoneShow:true
                    })
           });
    }
    //根据hisDoctorName查询医生信息
    getreport(hisDoctorName,visitNo){
        this.showLoading();
        Api
        .getDoctor({hospitalUserName:hisDoctorName})
        .then((res) => {
            this.hideLoading();
            if (res.code == 0) {
                    this.setState({
                        doctor:res.data
                    })
                    this.setState({
                    isShowProtocol:true,
                    visitNo:visitNo,
                    hisDoctorName:hisDoctorName,
                })
            }else{
                this.hideLoading();
                this.setState({
                    showIOS1:true,
                    msg:'对不起，为你开具报告的医生，还没有进入平台，您可到线下进行报告解读',               
                 })
            }
        }, (e) => {
                 this.hideLoading();
                 this.setState({
                    showIOS1:true,
                    msg:'对不起，为你开具报告的医生，还没有进入平台，您可到线下进行报告解读',                  
                 })
        });
    }
     //获取验证码
     getValidate() {
        if (this.state.phone) {
            this.showLoading();
            Api
            .getMsgValidate({type:'check',phone: this.state.phone})
            .then((res) => {
                this.hideLoading();
                if (res.code == 0) {
                    this.setState({
                        isSendValidate: true,
                    })
                    this.setState({
                        leftTime:120,
                    })
                    this.clock();
                }else{
                    this.hideLoading();
                     
                    this.setState({
                        msg:res.msg,
                    })
                    this.showToast1();
                }
            }, (e) => {
                     this.hideLoading();
                     this.setState({
                        msg:e.msg,
                    })
                    this.showToast1();
            });
        }
    }
    //根据不同的情况进行处理
    inquiry(type,hisDoctorName,visitNo){
        console.log(type);
        if(type==1){
            //报告解读
           this.getreport(hisDoctorName,visitNo)
        }
        if(type==2){
            console.log('inquriy',visitNo)
            //报告解读
            this.context.router.push({
                pathname:'inquiry/chat',
                query:{inquiryId:visitNo,resource:'report'}
            })
        }
        if(type==3){
            this.setState({
                msg:'你还有报告结果未出，是否开始报告解读？一次就诊检查，只能免费解读一次',
                showIOS2:true,
            })
        }
        if(type==4){
            this.setState({
                showIOS1:true,
                msg:'对不起，您的报告已被绑定此就诊人的其他账号申请解读，您可在发起此报告解读的账号上查看解读详情',
            })
        }
    }
     /**
     * 倒计时
     */
    clock() {
        var clockTimer = setTimeout(() => {
            var leftTime1 = this.state.leftTime;
            --leftTime1;
            this.setState({
                leftTime: leftTime1
            })
            if (leftTime1 <= 0) {
// 查询超时，跳转详情页面
                this.setState({
                    isSendValidate: false,
                })
            } else {
                this.setState({
                    leftTime: leftTime1
                })
                this.clock();
            }
        }, 1000);
    }
  render() {
    const {patList,currentName,reportList,validatePass ,leftTime,isSendValidate ,phoneShow,isShowProtocol,mobile,userInfo,currentPatient,msg,timeout}=this.state
    console.log(reportList)
    return ( 
    <div className="container page-report-list">
        <div className="home" style={{position:'fixed',width:'100%',top:'0'}}><span className="jian"
                                    onClick={()=>{
                                        window.localStorage.goChat=2;
                                      this.context.router.push({
                                       pathname:'usercenter/home'
                                      })
                                      }}
            ></span>检查检验报告
        </div>
        <Toast icon="success-no-circle" show={this.state.showToast}>修改成功</Toast>
        <Toast icon="warn" show={this.state.showToast1}>{msg}</Toast>
        <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
        {msg}
       </Dialog>
       <Dialog type="ios" title={this.state.style5.title} buttons={this.state.style5.buttons} show={this.state.showIOS5}>
        {msg}
       </Dialog>
        <Dialog type="ios" title={this.state.style2.title} buttons={this.state.style2.buttons} show={this.state.showIOS2}>
            {msg}
        </Dialog>
        <Dialog type="ios" title={this.state.style3.title} buttons={this.state.style3.buttons} show={this.state.showIOS3}>
        你还有对当前医生的咨询未完成
        </Dialog>
        <Dialog type="ios" title={this.state.style4.title} buttons={this.state.style4.buttons} show={this.state.showIOS4}>
        {msg}
        </Dialog>
        {phoneShow && <div className='modal' onClick={()=>{
           
            }} >
                <div className='modal-body'
                    onClick={(e)=>{
                    e.stopPropagation()
                    }}>
                    <div className='modal-content'>
                      <div className='modal-title'>
                         <p className='title'>短信验证</p>
                         <p className='subTitle'>为了你的隐私，请先短信验证</p>
                      </div>
                      <div className='inputItem'>
                         <input type="text" maxLength={11}  readOnly value={mobile}/>
                         <p></p>
                         <input type="text" maxLength={6} placeholder='请输入验证码'
                         onBlur={(e)=>{
                            window.scrollTo(0,0);         
                        }}
                            onChange={(e)=>{
                                this.setState({
                                    validatePass:e.target.value
                                })
                                }}      
                          value={validatePass}/> <p></p>
                         {!isSendValidate &&<span
                            onClick={(e)=>{
                                this.getValidate(e)
                                }}
                            >获取验证码</span>}
                            {isSendValidate && <span >
                            {leftTime} s 后重试
                        </span>}  
                       </div>
                      <div className='submitBtn '>
                         <p onClick={(e)=>{
                             this.checkPassword(e)
                         }} className={`${validatePass.length!==6?'grey':''}`}>确定</p>
                      </div>
                    </div>
                </div>
            </div>}
        {isShowProtocol && <div className='modal1'>
                    <div className='modal-body-protocol'>
                        <div className='modal-title'>温馨提示</div>
                        <div className='modal-content-protocol'>
                            <div className="content">
                                <div className="content-item">
                                    1、每次就诊报告结果发布后，患者均有
                                    <span className="f-color-red">一次机会向开单医生申请免费报告解读
                                    </span>，请确保您已拿到全部报告结果。
                                </div>
                                <div className="content-item">
                                    2、报告解读有效期自所有线上能出结果的最后一个报告发布时间起，
                                    <span className="f-color-red">72小时内可向开单医生申请报告解读，逾期无效
                                    </span>。
                               </div>
                               <div className="content-item">
                                 3、因部分报告结果无法通过手机查看，请及时到线下获取纸质报告结果，
                                        <span className="f-color-red">纸质报告可通过上传照片的方式进行解读
                                        </span>，线上报告无需上传资料。
                               </div>
                            </div>  
                        </div>
                    </div>
                    {!timeout&&<div className='modal-footer'>
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
                              this.Inquiry()
                          }}
                            className='sure'
                            >确认</div>
                    </div>}
                    {timeout&&<div className='modal-footer'>                  
                        <div
                          onClick={()=>{
                            this.setState({
                                isShowProtocol:false
                            })
                          }}
                            className='sure' 
                            >确认</div>
                    </div>}
                </div>} 
        {patList.length>0&&<div className='person'>
              
            {patList&&patList.length>0&&patList.map((item,index)=>{
                return(
                    <p
                        key={index}
                        onClick={()=>{
                            if(index!==this.state.currentId){
                                this.setState({
                                    reportList:[]
                                })
                                this.getList(index);
                            }
                }}
                        className={`${item.active?'active':''}`} style={{fontWeight:'bold',textAlign:'center'}}>
                        {item.patientName}
                       <span ></span>

                        </p>
                )
            })}               
        </div>
        }
        <div className='reportList'>
        {reportList&&reportList!='1'&&reportList.length>0&&reportList.map((item,index)=>{
            console.log((item.inquiryId=='0'&&item.hasTimeOut!=='1'&&item.getTime=='1'&&item.allOnLineReportResult==1&&item.reportInterpretateFlag=='1')||(item.inquiryId=='0'&&item.getTime!=='1'&&item.allOnLineReportResult==1&&item.reportInterpretateFlag=='1'))
            console.log(item.inquiryId,item.hasTimeOut,item.getTime,item.allOnLineReportResult,item.reportInterpretateFlag)
            return(
                <div className='reportItem'  key={index}> 
                <div className='reportPersonTime'>
                    <p className='name'>
                       就诊人：{currentName}
                    </p>
                    <p className='time'>
                    {item.inDate.substring(0,16)}
                   </p>
                    </div>
                <div className='reportPerson'>
                    <p className='time'>
                    <span style={{fontSize:'14px',fontWeight:'normal'}}>
                    医生：{item.doctorRealName}
                    </span> 
                    </p>
                    {((item.inquiryId=='0'&&item.hasTimeOut!=='1'&&item.getTime=='1'&&item.allOnLineReportResult==1&&item.reportInterpretateFlag=='1')||(item.inquiryId=='0'&&item.getTime!=='1'&&item.allOnLineReportResult==1&&item.reportInterpretateFlag=='1'))&&<span className='yes' onClick={()=>{
                            this.inquiry(1,item.hisDoctorName,item.report[0].Visit_no)
                  }}>报告解读</span>}
                  {(item.inquiryId=='0'&&item.getTime!=='1'&&((item.allOnLineReportResult!==1||item.reportInterpretateFlag!=='1'))||(item.inquiryId=='0'&&item.hasTimeOut!=='1'&&item.getTime=='1'&&(item.allOnLineReportResult!==1||item.reportInterpretateFlag!=='1')))&&<span className='no' onClick={()=>{
                     if(item.allOnLineReportResult!==1){
                        this.setState({
                            showIOS1:true,
                            timeout:false, 
                            msg:'对不起，您的报告还未全部出结果。'
                        })
                     }else{
                        this.setState({
                            showIOS1:true,
                            timeout:false, 
                            msg:'对不起，本次就诊医生暂未开启在线免费报告解读，请到线下咨询开单医生。'
                        })
                     }
              }}>报告解读</span>}
                  {item.inquiryId=='0'&&item.getTime=='1'&&item.hasTimeOut=='1'&&<span className='no' onClick={()=>{
                    this.setState({
                        showIOS1:true,
                        timeout:true,
                        msg:'对不起，您已超过了在线报告解读的有效期，请到线下咨询开单医生。'
                    })
               }}>报告解读</span>}
                    {item.inquiryId.length>2&&item.myself=='1'&&(!!item.inquiry?(item.inquiry.status!=='4'&&item.inquiry.status=='5'):true)&&<span className='already' onClick={()=>{
                          //已解读是自己
                          this.inquiry(2,item.hisDoctorName,item.inquiryId)
                    }}>查看解读详情</span>}
                    {item.inquiryId.length>2&&item.myself=='0'&&<span className='no' onClick={()=>{
                          //已解读不是自己
                          this.setState({
                            timeout:false,
                        })
                          this.inquiry(4,item.hisDoctorName,item.report[0].Visit_no)
                    }}>报告解读</span>}
                    {item.inquiryId.length>2&&(item.myself=='1'&&(!!item.inquiry&&(item.inquiry.status=='4'||item.inquiry.status=='5')))&&<span className='no' onClick={()=>{
                        
                  }}>报告解读</span>} 
                    </div>
                {item.report&&item.report.map((item1,index1)=>{
                        return(
                            <div className="checkItem" key={index1}>
                            {item1.type=='1'&&item1.Results_rpt_date_time&&<p className='name rightTab' onClick={()=>{
                                window.localStorage.goChat=1;
                                this.context.router.push({
                                    pathname:'report/reportInfo',
                                    query:{report:JSON.stringify(item1),patient:JSON.stringify(currentPatient)}
                                })
                            }}>
                                <span style={{fontSize:'14px'}}>检查项：</span> 
                                <span style={{fontSize:'14px'}} className='report-item'>
                                {item1.type=='1'?item1.Sheet_title+'  ':item1.Exam_item+'  '  }  
                                 </span> 
                                {item1.type=='1'&&!item1.Results_rpt_date_time&&item1.On_line=='Y'&&<span style={{fontSize:'14px',color:'#FF6600'}}>(待出结果)</span>}
                                {item1.type=='1'&&!item1.Results_rpt_date_time&&item1.On_line!=='Y'&&<span style={{fontSize:'14px',color:'#ff0000'}}>(线下取结果)</span>}
                                {item1.type=='1'&&item1.Results_rpt_date_time&&<span style={{fontSize:'14px',color:'#4dabc7'}}>(已出结果)</span>}
                             </p>}
                             {item1.type=='1'&&!item1.Results_rpt_date_time&&<p className='name ' >
                                <span style={{fontSize:'14px'}}>检查项：</span>
                                <span style={{fontSize:'14px'}} className='report-item'>
                                {item1.type=='1'?item1.Sheet_title+'  ':item1.Exam_item+'  '  }  
                                 </span> 
                                {item1.type=='1'&&!item1.Results_rpt_date_time&&item1.On_line=='Y'&&<span  style={{fontSize:'14px',color:'#FF6600'}}>(待出结果)</span>}
                                {item1.type=='1'&&!item1.Results_rpt_date_time&&item1.On_line!=='Y'&&<span  style={{fontSize:'14px',color:'#ff0000'}}>(线下取结果)</span>}
                                {item1.type=='1'&&item1.Results_rpt_date_time&&<span  style={{fontSize:'14px',color:'#4dabc7'}}>(已出结果)</span>}
                             </p>}
                             {item1.type=='2'&&item1.Report_date_time&&<p className='name rightTab' onClick={()=>{
                                window.localStorage.goChat=1;
                                this.context.router.push({
                                    pathname:'report/reportInfo',
                                    query:{report:JSON.stringify(item1),patient:JSON.stringify(currentPatient)}
                                })
                            }}>
                                <span style={{fontSize:'14px'}}>检查项：</span> 
                                <span style={{fontSize:'14px'}} className='report-item'>
                                {item1.type=='1'?item1.Sheet_title+'  ':item1.Exam_item+'  '  }  
                                 </span> 
                                {item1.type=='2'&&!item1.Report_date_time&&item1.On_line=='Y'&&<span style={{fontSize:'14px',color:'#FF6600'}}>(待出结果)</span>}
                                {item1.type=='2'&&!item1.Report_date_time&&item1.On_line!=='Y'&&<span style={{fontSize:'14px',color:'#ff0000'}}>(线下取结果)</span>}
                                {item1.type=='2'&&item1.Report_date_time&&<span style={{fontSize:'14px',color:'#4dabc7'}}>(已出结果)</span>}
                             </p>}
                             {item1.type=='2'&&!item1.Report_date_time&&<p className='name ' >
                                <span style={{fontSize:'14px'}}>检查项：</span> 
                                <span style={{fontSize:'14px'}} className='report-item'>
                                {item1.type=='1'?item1.Sheet_title+'  ':item1.Exam_item+'  '  }  
                                 </span>   
                                {item1.type=='2'&&!item1.Report_date_time&&item1.On_line=='Y'&&<span style={{fontSize:'14px',color:'#FF6600'}}>(待出结果)</span>}
                                {item1.type=='2'&&!item1.Report_date_time&&item1.On_line!=='Y'&&<span style={{fontSize:'14px',color:'#ff0000'}}>(线下取结果)</span>}
                                {item1.type=='2'&&item1.Report_date_time&&<span style={{fontSize:'14px',color:'#4dabc7'}}>(已出结果)</span>}
                             </p>}
                        </div>
                        )
                    })
                }
           </div>
            )
        })}   
        </div>
        {reportList&&reportList.length<=0&&reportList!='1'&&
            <div  className='no-data'>
              <img src='../../../resources/images/no-result.png'/>
              <div>暂未查询到相关信息</div>
            </div>}
    </div>  
    );
  }
}
export default Connect()(Widget);