import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';
import * as Api from './reportListApi';
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
        reportList: [],
        showToast: false,
        showLoading: false,
        toastTimer: null,
        loadingTimer: null,
        showIOS1: false,
        showIOS2: false,
        showIOS3:false,
        showIOS4:false,
        showAndroid1: false,
        showAndroid2: false,
        isShowProtocol:false,
        style1: { 
            title: '提示', 
            buttons: [
                { type: 'primary',
                    label: '确定',
                    onClick: this.hideDialog.bind(this)
                }
            ]
        },
        style3: {
            title: '提示',
            buttons: [
                {
                    type: 'default',
                    label: '取消',
                    onClick: this.hideDialog.bind(this)
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
                    onClick: this.hideDialog.bind(this)
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
                    onClick: this.hideDialog.bind(this)
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
        item1Show:true,//咨询显示
        item3Show:false,//检查单显示
        currentName:'',
        currentId:'',
        inquiryId:'',
        currentPatient:[],
        hisDoctorName:'',
        visitNo:'',
    }
  }
  componentDidMount() {
        this.getJs();
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
            this.getCardList();  
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
        hospitalVisitNo:visitNo
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
            }
            }, e=> {
           this.hideLoading();
           if(e.msg.length>5){
            this.setState({
                inquiryId:e.msg||'',
                msg:'当前咨询完成后，才能对医生发起新的咨询',
                showIOS3:true
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
    showLoading() {
        this.setState({showLoading: true});
        this.state.loadingTimer = setTimeout(()=> {
            this.setState({showLoading: false});
        }, 2000);
    }
    hideDialog() {
        console.log("sss",this.state.showIOS1)
        this.setState({
            showIOS1: false,
            showIOS2: false,
            showIOS3:false,
            showIOS4:false,
            showAndroid1: false,
            showAndroid2: false,
        });
    }
    getJs() {
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
      this.setState({
          patList:[],
          patientName:'全部就诊人',
          isPatShow:false,
          orderList:[]
      })
      console.log("state",this.state);
      window.localStorage.reportStatus=JSON.stringify(this.state);
    // 离开页面时结束所有可能异步逻辑

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
    //获取就诊人列表
     getCardList() {
         
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
                          console.log(cardList[i].patientId);
                         
                      }
                      this.getreportList(cardList[0].patientId);
                      this.setState({
                        patList:cardList
                      })
                     
                      
                  }
                  }, e=> {
                 this.setState({
                     msg:e.msg,
                     showIOS1:true
                 })
             });
    }
    /*获取报告列表*/
    getreportList(patientId = '') {
         this.showLoading();
         var report;
         Api
             .getreportList({patientId:patientId})
             .then((res) => {
                 if (res.code == 0) {
                      console.log("yy",patientId,res.data);
                      this.hideLoading();
                      if(res.data.length>0){
                        var report=res.data;
                        report.patientId=patientId;
                       
                        for(var i=0;i<report.length;i++){
                          var yes=0;
                          var no=0;
                          var j; 
                                for(j=0;j<report[i].report.length;j++){
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
                                console.log("j",j)
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
                        var reportlist=this.state.reportList;
  
                        console.log("rr11",this.state.reportList)
                         reportlist.push(report)
                        this.setState({
                          reportList:reportlist||'',
                       })
                      console.log("rr",this.state.reportList)
  
                      }else{
                        var reportlist=this.state.reportList;
                        reportlist.push([])
                        this.setState({
                          reportList:reportlist.reverse(),
                       })
                      }
                      
                 }
             }, e=> {
                this.hideLoading();
            
             });


    }
  getUser() { // 获取实名制

      Api
      .getUser()
      .then((res) => {
        this.setState({ user: res.data });
      }, e=> {
            this.setState({
                msg:e.msg,
                showIOS1:true
            })
      });
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
       // this.getreportList(list[index].patientId);

    }
    //根据hisDoctorName查询医生信息
    getreport(hisDoctorName,visitNo){
        this.showLoading();
        Api
        .getDoctor({hospitalUserName:hisDoctorName})
        .then((res) => {
            this.hideLoading();
            if (res.code == 0) {
                 //成功 跳转
                 //建立咨询
                 this.setState({
                     doctor:res.data
                 })
                 this.setState({
                    isShowProtocol:true,
                    visitNo:visitNo,
                    hisDoctorName:hisDoctorName,
                })
                
                console.log(res)
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
                msg:'对不起，您的报告已被绑定此就诊人的其他账户申请解读，您可在发起此报告解读的账号上查看解读详情',
                
            })
        }
    }

  render() {
    const {patList,currentName,reportList,currentId,isShowProtocol,currentPatient,msg}=this.state
     console.log(reportList,currentId)
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
        <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
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
        {isShowProtocol && <div className='modal1'>
                    <div className='modal-body-protocol'>
                        <div className='modal-title'>温馨提示</div>
                        <div className='modal-content-protocol'>
                            <div className="content">
                                <div className="content-item">
                                    1、每次就诊报告结果发布后，患者均有。
                                    <span className="f-color-red">一次机会向开单医生申请报告解读
                                    </span>。
                                </div>
                                <div className="content-item">
                                    2、报告解读有效期自医生开单当日起，
                                    <span className="f-color-red">可在7天内向开单医生申请报告解读，逾期无效
                                    </span>。
                               </div>
                               <div className="content-item">
                                 3、因部分报告结果无法通过手机查看，进行报告解读前请确保所有报告均已拿到结果，
                                        <span className="f-color-red">纸质报告可通过上传照片
                                        </span>的方式进行解读，线上报告无需上传资料。
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
                              this.Inquiry()
                          }}
                            className='sure'
                            >确认</div>
                    </div>
                 
                </div>}
        <div className='person'>
            <p>就诊人：</p>   
            {patList&&patList.map((item,index)=>{
                return(
                    <p
                        key={index}
                        onClick={()=>{
                           console.log("iii",index);
                          this.getList(index);

                 
                }}
                        className={`${item.active?'active':''}`} style={{fontWeight:'bold',flex:2,textAlign:'center'}}>
                        {item.patientName}
                        <span className={`${item.patientName.length<=2?'len2':item.patientName.length==3?'len3':'len4'}`}></span>
                        
                        </p>
                )
            })}               
        </div>
        <div className='reportList'>
        {reportList[currentId]&&reportList[currentId].map((item,index)=>{
            return(
                <div className='reportItem'  key={index}>
                <div className='reportPersonTime'>
                    <p className='name'>
                       就诊人：{currentName}
                    </p>
                    <p className='time'>
                    {item.inDate}
                   </p>
                    </div>
                <div className='reportPerson'>

                    <p className='time'>
                    <span style={{fontSize:'14px',fontWeight:'normal'}}>
                    医生：{item.doctorRealName}
                    </span> 
                    </p>
                    {item.inquiryId=='0'&&item.hasTimeOut=='0'&&<span className='yes' onClick={()=>{
                          //已出未解读
                          this.setState({
                              showIOS1:true,
                              msg:'对不起，您已超过了报告解读的有效期'
                          })
                    }}>报告解读</span>}
                    {item.inquiryId=='0'&&item.hasTimeOut=='1'&&<span className='yes' onClick={()=>{
                        //已出未解读
                        this.inquiry(1,item.hisDoctorName,item.report[0].Visit_no)
                  }}>报告解读</span>}
                    {item.inquiryId.length>2&&item.myself=='1'&&<span className='already' onClick={()=>{
                          //已解读是自己
                          this.inquiry(2,item.hisDoctorName,item.inquiryId)
                    }}>查看解读详情</span>}
                    {/* item.inquiryId=='0'&&item.has==2&&<span className='no' onClick={()=>{
                         //未出未解读
                    }}>报告解读</span> */}
                    {/* item.inquiryId=='0'&&item.has==3&&<span className='no' onClick={()=>{
                          this.inquiry(3,item.hisDoctorName,item.report[0].Visit_no)
                         //未出完未解读
                    }}>报告解读</span> */}
                    {item.inquiryId.length>2&&item.myself=='0'&&<span className='no' onClick={()=>{
                          //已解读不是自己
                          this.inquiry(4,item.hisDoctorName,item.report[0].Visit_no)
                    }}>报告解读</span>}

                    </div>
                {
                    item.report&&item.report.map((item1,index1)=>{
                        return(
                            <div className="checkItem" key={index1}>
                            <p className='name rightTab' onClick={()=>{
                                window.localStorage.goChat=1;
                                this.context.router.push({
                                    pathname:'report/reportInfo',
                                    query:{report:JSON.stringify(item1),patient:JSON.stringify(currentPatient)}
                                })
                            }}>
                            <span style={{fontSize:'14px'}}>检查项：</span> <span style={{fontSize:'14px'}}>{item1.type=='1'?item1.Sheet_title+'  ':item1.Exam_item+'  '  }   </span>   
                             {item1.type=='1'&&<span style={{fontSize:'14px',color:'#4dabc7'}}>{item1.Results_rpt_date_time?'(已出结果)':''}</span>}
                             {item1.type=='2'&&<span style={{fontSize:'14px',color:'#4dabc7'}}>{item1.Report_date_time?'(已出结果)':''}</span>}

                             </p>
                        </div>
                        )
                       
                    })
                }
           </div>
            )
        })}   
        </div>
        {!reportList[currentId]&&
            <div  className='no-data'>
              <img src='../../../resources/images/no-result.png'/>
              <div>暂未查询到相关信息</div>
            </div>}
    </div>  
    );
  }
}
export default Connect()(Widget);