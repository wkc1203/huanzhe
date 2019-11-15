
import React, { Component } from 'react';
import { Link } from 'react-router';
import {Upload, Modal,Button,Spin, Alert,Drawer } from 'antd-mobile';
import {  Toptips,Switch,Dialog,Toast,Icon } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { ImagePicker } from 'antd-mobile';
import { addressMap } from '../../../config/constant/constant';
import hashHistory from 'react-router/lib/hashHistory';
import * as Utils from '../../../utils/utils';
import * as Api from '../../../components/Api/Api';
import 'style/index.scss';
var imgArr1 = [];
var uuList = [];
var interval1 = '';
var nameList=[];
var success=[];
var maxLength = 0;
var upload=true;
var has=0;
var imgList = [];
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
            hospInfo: {},
            consultationReason: '',
            consultationId:'',
            content: '',
            upLoadImg: [],
            doctorId: '',
            docInfo: {},
            cardList: [],
            hid: false,
            sign:{},
            showToast: false,
            showLoading: false,
            toastTimer: null,
            loadingTimer: null,
            showIOS1: false,
            showIOS2: false,
            showIOS3: false,
            showIOS5: false,
            showAndroid1: false,
            showAndroid2: false,
            cardShow:false,
            codeUrl:'',
            style1: {
                title: '温馨提示',
                buttons: [
                    {
                        label: '确定',
                        onClick: this.hideIOS1.bind(this)
                    }
                ]
            },
            style5: {
                title: '温馨提示',
                buttons: [
                    {
                        label: '确定',
                        onClick: this.hideLoad.bind(this)
                    }
                ]
            },
            style2: {
                title: '温馨提示',
                buttons: [
                    {
                        type: 'default',
                        label: '取消',
                        onClick: Utils.hideDialog.bind(this)
                    },
                    {
                        type: 'primary',
                        label: '确定',
                        onClick: this.confirmInfo.bind(this)
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
            msg: '',
            consultList: [
                {reason: '咨询', id: 1},
                {reason: '复诊', id: 2},
                {reason: '报告解读', id: 3},
               /*  {reason: '加号', id: 4}, */
                {reason: '其他', id: 8},
            ],
            leftBindNum: 5, 
            totalFee: 0,
            selectName: '',
            selectSex: '',
            selectBirthday: '',
            selectPatientId: '',
            showTip: false,
            toptip: '',
            intervals:'',
            name: "",
            knows:false,
            cardType:1,
            inquiryId:'',       
            patCardNo:'',
            cardNo:'0014492503',
            hasList:true,
            reportList:[],
            isChecked:false,
            patientShow:false,
            curItem:{},
            diagList:['J45.900x001','J45.005','J30.400y001','L30.902','M08.800y001','M32.900','M32.101+','E66.900',
            'E66.900x001','E27.800y002','E14.900y002','R73.000x001','E22.802','E30.100x004','E30.800y002',
            'E05.000x001','E05.900x001','G40.900','R51.x00','G43.900','N04.900','N05.803y001','N04.900y001',
            'N00.900','N00.902','N02.801','N02.801','N01.900x001','D69.004','M32.101+','M32.900','I15.102','N39.000',
            'N04.900y002','I42.900','I50.908','I49.100x001','I49.300y001','I47.100','I47.200','Q21.000','Q21.100','Q25.000','I37.000'],
            curPat:{}
        };
    }
    componentWillMount(){
        this.mounted = true;
    }
    componentWillUnmount() {
        imgList=[];
        this.setState({
           imgArr:[]
        })
       clearInterval(interval1);
        this.mounted = false;
        
    }
    confirmInfo(){
        this.setState({
            showIOS2:false,
            report:true,
        })
    }
    hideLoad(){
        this.setState({
            showIOS5:false,
        })
    }
    hideIOS1(){
        this.setState({
            showIOS1:false,
        })
    }
   
    
    addQuiry(){
        this.showLoading();
        const params = {
         hisName: this.state.docInfo.hisName,
         deptId: this.state.docInfo.deptId,
         doctorId: this.state.docInfo.doctorId,
         deptName: this.state.docInfo.deptName,
         doctorName: this.state.docInfo.name,
         totalFee:0,
         type: '1',
         pics:'',
         hisId:2214,
         userId:JSON.parse(window.localStorage.userInfo).id||"",
         patientName:this.state.selectName,
         content: '',
         patCardNo:this.state.patCardNo,
         patientId: this.state.selectPatientId,
         purpose:'免费报告解读',
         purposeType:'9',
         hisDoctorName:this.state.reportInfo.hisDoctorName,
         hospitalVisitNo:this.state.reportInfo.report[0].Visit_no,
         inDate:this.state.reportInfo.inDate,
         status:'4',
         reportNo:this.state.reportInfo.report[0].Test_no,
     };
     console.log(params)
        //创建咨询
        Api
        .createOrder(params)
        .then((res) => {
             if(res.code==0){
                 this.hideLoading();
                 this.setState({hasApply:true})
                   console.log(res);
                 
             }else{
                 this.hideLoading();
                 if (res.code==-2) {
                     console.log("1")
                     window.scrollTo(0,0);
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
            window.scrollTo(0,0);
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
                     showIOS5: true
                 })
             }
        });
    }
    componentDidMount() {
        console.log(this.state.diagList.length)
        if(!!window.localStorage.openId){
         }else{
             var code='';
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
         }
        imgList=[];
        this.getDocDetail(this.props.location.query.doctorId, this.props.location.query.deptId);
        var ua = navigator.userAgent.toLowerCase();//获取浏览器的userAgent,并转化为小写——注：userAgent是用户可以修改的
        var isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);//判断是否是苹果手机，是则是true
        if(this.mounted){
            this.setState({
                isIos:isIos
            });
        }
       
        document.getElementById("home").scrollIntoView();
        Utils.getJsByHide();
        //判断是否是从儿童医院公众号添加卡进入该页面
        if(this.props.location.query.cardType==1&&this.props.location.query.cardNo!=''){
            this.showLoading();
          //  this.syncUser(this.props.location.query.cardNo);
        }
      
        if(this.mounted){
            this.setState({
                doctorId: this.props.location.query.doctorId,
                deptId: this.props.location.query.deptId,
            })
        }
        var that=this;
        document.addEventListener('click',function(e){
            if(e.target.className=='weui-mask'){
                if(that.mounted){
                that.setState({
                    showIOS2:false
                })
            }
            }
        });

       

    }
    
  
    /*文件目录*/
    randomName(){
        var myDate = new Date();
        var ossPath='PIC/';
        var fileRandName=Date.now();
        var year=myDate.getFullYear();
        var month;
        var day;
        if(myDate.getMonth()+1<10) {
            var  m=myDate.getMonth()+1;
            month = '0'+m;
        }else{
            month=myDate.getMonth()+1;
        }
        if(myDate.getDate()<10){
            var d=myDate.getDate()+1;
            day='0'+d;
        }else{
            day=myDate.getDate();
        }
        var date=new Date().getTime();
        var m=ossPath+year+'/'+month+'/'+day+"/";
        uuList[0]=m;
        return  m;
    }
  
    //同步就诊人
    addPerson(param){
        Api
            .sameCard(param)
            .then((res) => {
                if (res.code == 0) {
                    this.hideLoading();
                    this.getCardList()
                }
            }, (e) => {
                if(this.mounted){
                    this.setState({
                        msg:e.msg,
                        showIOS1:true
                    })
                }
            });
    }
    //获取公众号添加的卡信息
    syncUser(cardNo){
        Api
            .getCardList1()
            .then((res) => {
                if(res.code==0) {
                    if (res.data.length > 0) {
                        for (var i = 0; i < res.data.length; i++) {
                            if (cardNo == res.data[i].patCardNo){
                                for(var val in res.data[i]){
                                    if(res.data[i][val]==null){
                                        delete  res.data[i][val];
                                    }
                                }
                                this.addPerson(res.data[i])
                            }
                        }
                    }else {
                        this.hideLoading();
                    }
                }
            },(e) => {
                this.hideLoading();
            });
    }
   /*显示toast*/
    showToast() {
        this.setState({showToast: true});
        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
    }
    goMain(){
        window.location.href='http://wx.cqkqinfo.com/wx3/p/03/p/card_choose.cgi'
    }
    isAdd(){
        this.setState({
            showIOS2:false
        })
        this.context.router.push({
            pathname:'usercenter/addcard',
            query:{
                type:1,
            }
        })
    }
    goInquiry(){
        this.setState({
            showIOS1: false,
            showIOS2: false,
            showIOS3:false,
            showAndroid1: false,
            showAndroid2: false,
        });
        this.context.router.push({
            pathname:'/inquiry/chat',
            query:{inquiryId:this.state.inquiryId}
        })
    }
    addCard(){
        Api
            .getOpenId({openId: window.localStorage.getItem('openId')})
            .then((res) => {
                if (res.code == 0) {
                    if (res.data.subscribe == 0) {
                        if(this.mounted){
                            this.setState({
                                cardShow: true
                            })
                        }
                            Api
                                .getCode({
                                    url: window.location.href
                                })
                                .then((res) => {
                                    if (res.code == 0) {
                                        if(this.mounted){
                                            this.setState({
                                                codeUrl: res.data.url
                                            })
                                        }
                                    }
                                }, (e) => {
                                });
                    } else {
                        this.isRegister();
                    }
                }
            }, (e) => {
            });
    }
   
    /*获取就诊人列表*/
    getCardList() {
        this.showLoading();
        Api
            .getCardList()
            .then((res) => {
                if (res.code == 0) {
                    this.hideLoading();
                    this.setState({
                        leftBindNum: res.data.leftBindNum
                    })
                    if (res.data.cardList.length > 0) {
                        var cardList = res.data.cardList;
                            if(this.mounted){
                            this.setState({
                                leftBindNum: res.data.leftBindNum,
                                cardList: cardList,
                                
                            })

                            if(cardList.length>1){
                                this.setState({
                                    patientShow:true
                                })
                               
                           }else{
                               cardList[0].active=true;
                               this.setState({
                                   patCardNo:cardList[0].patCardNo,
                                   selectName: cardList[0].patientName,
                                   selectSex: cardList[0].patientSex == 'M' ? '男' : '女',
                                   selectBirthday: cardList[0].birthday,
                                   curPat:cardList[0],
                                   selectPatientId: cardList[0].patientId
                               })
                               this.getreportList(this.state.selectPatientId);
                           }                       

                        }
                    }else{
                        this.hideLoading();
                    }
                }else{
                    this.hideLoading();
                }
            }, (e) => {
                this.hideLoading();
            });
    }
           
   /*获取医生信息*/
    getDocDetail(doctorId, deptId) {
        Api
            .getDocDetail({doctorId: doctorId, deptId: deptId})
            .then((res) => {
                if (res.code == 0 && res.data != null) {
                    if(this.mounted){
                      this.setState({docInfo: res.data.doctor});
               
                      
                    }
                    this.getCardList();
                }

            }, (e) => {
            });
    }
   
    getreportList(id) {
        this.showLoading();
        //390
        var report;   
        Api
            .getdiseaseList({patientId:id})
            .then((res) => {
                this.hideLoading();
                if (res.code == 0) {
                     if(res.data.length>0){
                         var list=res.data;
                          for(var i=0;i<list.length;i++){
                              if(!!this.props.location.query.test&&this.props.location.query.test==1){
                                list[i].has=true;

                              }else{
                                if(this.state.diagList.indexOf(list[i].Diagnosis_code)!=-1){
                                    list[i].has=true;
                                  }else{
                                   list[i].has=false;
                                    }
                              }
                            
                                
                                //arr1.indexOf(NaN)
                                list[i].showMore=false;
                                if(!!list[i].Recipel_list&&list[i].Recipel_list.length>0){
                                    for(var j=0;j<list[i].Recipel_list.length;j++){
                                        list[i].Recipel_list[j].name=list[i].Recipel_list[j].Detail.substring(0,list[i].Recipel_list[j].Detail.indexOf(' '));
                                        console.log(list[i].Recipel_list[j].name)
                                        list[i].Recipel_list[j].use=list[i].Recipel_list[j].Detail.substring(list[i].Recipel_list[j].Detail.indexOf(' ')+1,list[i].Recipel_list[j].Detail.length);
                                    }
                                }else{
                                    list[i].Recipel_list=[];
                                }
                          }
                          this.setState({
                              reportList:list
                          })
                     }else{
                        this.setState({
                            reportList:[]
                        })
                     }
                }
            }, e=> {
                this.setState({
                    reportList:[]
                })
               this.hideLoading();
            });
   }
      
   /*切换就诊人*/
    changePat(id,type) {
        this.setState({
            has:false,
            apply:false,
            currentDoctor:false,
        })
        console.log("id",id)
        var cardList = this.state.cardList.map(item => {
            item.active = item.patientId == id ? true : false;
            return item;
        });
        cardList.map(item => {
            console.log(item.active)
            if (item.active) { 
                console.log("hahh",item)
                this.setState({
                    selectName: item.patientName,
                    patCardNo:item.patCardNo,
                    selectSex: item.patientSex == 'F' ? '女' : '男',
                    selectBirthday: item.birthday,
                    selectPatientId: id,
                    curPat:item
                })
            } 
        });
        this.setState({
            selectPatientId:id
        })
        console.log("test",this.state.selectPatientId);
        this.setState({
            cardList: cardList
        })
        if(type==2){
            this.getreportList(id);  
        }
    
    }

    /*是否注册*/
    isRegister() {
        this.showLoading();
        Api
            .isRegister()
            .then((res) => {
                if (res.code == 0) {
                    Api
                        .getCardList1()//查询就诊人列表
                        .then((res) => {
                            this.hideLoading();
                            if(res.data.length > 0){
                                this.goMain();
                            }else{
                               this.goMain();
                            }
                        }, (e) => {
                            this.hideLoading();
                            if(this.mounted){
                            this.setState({
                                msg:e.msg,
                                showIOS1:true
                            })
                        }
                        });
                }
            }, (e) => {
                this.hideLoading();
                if(this.mounted){
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            }
            });
    }
   /*切换咨询目的*/
    changeStatus(id) {
        if (this.state.consultList) {
            const consultList = this.state.consultList.map(item => {
                item.active = item.id == id ? true : false;
                return item;
            });
            var consultationReason;
            var consultationId;
            consultList.map(item => {
                if (item.active) {
                    consultationReason = item.reason;
                    consultationId=item.id;
                }
            });
            this.setState({
                consultationReason: consultationReason,
                consultationId:consultationId,
                consultList: consultList
            })
        }
    }
    
    /*保存内容*/
    saveContent(e) {
        this.setState({
            content: e.target.value
        })
    }
  
  
  
add(){
    if(this.mounted ){
        
        if(this.state.has){
                //情况1
                this.addQuiry();

                
        }else{
            this.setState({
                msg:' 对不起，您暂不具备向该医生发起免费报告解读申请的条件。是否需要向该医生发起付费报告解读。',
                showIOS2:true,
            })

        }
        
        
    }
}

expandMore(Visit_no){
    var list=this.state.reportList;

    for(let i=0;i<list.length;i++){
        if(list[i].Visit_no==Visit_no){
            list[i].showMore=!list[i].showMore;
        }
    }
    this.setState({
        reportList:list
    })
}
  switch(){
      this.setState({
          isChecked:!this.state.isChecked
      })
     console.log(this.state.isChecked)
  }
  
  onTabChange = (key) => {
    console.log(key);
  };
    render() {
        const {knows,hasList,codeUrl,cardShow,isChecked,msg,cardList,leftBindNum,
            selectName,selectSex,selectBirthday,toptip,reportList,patientShow}=this.state;
            console.log("report",reportList,'11111111111111111222222222222222222222')
        return (
            <div className={`${knows?'over-hidden page-describe-info1':' page-describe-info1'} `}>
                <div className="home" id="home"><span className="jian"
                                            onClick={()=>{
                                            if(this.props.location.query.com==1){
                                              this.context.router.push({
                                              pathname:'microweb/doctorinfo',
                                              query:{doctorId:this.props.location.query.doctorId,deptId:this.props.location.query.deptId}
                                              })
                                            }else{
                                             this.context.router.push({
                                              pathname:'consult/deptdetail',
                                              query:{doctorId:this.props.location.query.doctorId,deptId:this.props.location.query.deptId}
                                              })
                                            }

                                      }}
                    ></span>选择慢病处方记录
                </div>
                <Toast icon="success-no-circle" show={this.state.showToast}>一次最多只能上传四张图片</Toast>
                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons}
                        show={this.state.showIOS1}>
                    {msg}
                </Dialog>
                <Dialog type="ios" title={this.state.style5.title} buttons={this.state.style5.buttons}
                show={this.state.showIOS5}>
                    {msg}
                </Dialog>
                <Dialog type="ios" title={this.state.style2.title} buttons={this.state.style2.buttons} show={this.state.showIOS2}>
                  {msg}
                </Dialog>
                <Dialog type="ios" title={this.state.style3.title} buttons={this.state.style3.buttons} show={this.state.showIOS3}>
                你还有对当前医生的咨询未完成
                </Dialog>
                {
                    patientShow&&<div className='modal' style={{justifyContent:'flex-end'}}
                   >
                    <div className='modal-body-select'
                    style={{background:'white',width:'100%'}}
                      >
                      <p className='patient-title'>请选择就诊人</p>
                      <p className='back'></p>
                       <div className="pat-list">
                      {cardList && cardList.map((item, index)=> {
                        return (
                            <div
                                key={index}
                                onClick={
                                ()=>{
                                this.changePat(item.patientId,1);
                                // setTimeout(()=>{
                                //     this.setState({
                                //         patientShow:false
                                //     })
                                // },500)
                               
                                }}
                                className={`pat-item ${item.active ? 'active-item' : ''}`}>
                                 <div className={`pat-name ${item.active ? 'active' : ''}`}>
                                   <text style={{fontSize:'10px'}}> {item.patientName}</text>
                                </div>
                                <div className="pat-more">
                                   <p>{item.patientSex=='M'?'男':'女'} | {item.birthday}</p>
                                   <p>就诊卡：{item.patCardNo}</p>
                                </div>

                            </div>
                        )
                    })}
                    </div>
                        <button onClick={()=>{
                             this.setState({
                                patientShow:false
                            })
                            this.getreportList(this.state.selectPatientId)
                        }                      
                        }>确定</button>          
                    </div>
                </div>
                }
                {knows &&<div className='modal'>
                <div className='modal-body-protocol'>
                    <div className='modal-title'  style={{fontSize:'16px'}}>
                            <p > 重庆医科大学附属儿童医院</p>
                            <p> 慢病续方业务须知</p>
                    </div>
                    <div className='modal-content-protocol'>
                        <div >                        
                            <div className="content-item" >1、只允许对1个月以内的慢病处方记录发起续方申请</div>
                            <div className="content-item" >2、医师接诊后，网络门诊费不予退费。
                            </div>
                            <div className="content-item" >3、若发送申请后超过24h医生未回复，系统将在3个工作日自动为您退回网络门诊费。
                            </div>
                            <div className="content-item" >4、该网络平台适用于慢病患者在线续方，涉及非网络可开药物请选择到院就诊。
                            </div>
                            <div className="content-item" >5、最大配药量按医保规定执行。
                            </div>
                            <div className="content-item" >6、该网络平台上所配药品原则上不予退药，如属特殊情况的，可通过平台进行退费申请，若药房审核通过则可线上直接退费，审核不通过或已经取药的患者，概不给予退费。
                            </div>
                            <div className="content-item" >7、药品订单支付成功后，可凭手机缴费详情页面到渝中院区（门诊大楼1楼）或两江院区药房取药。
                            </div>                               
                                                                                   
                        </div>
                    </div>
                    <div className="check-box" onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        this.switch()
                        }}>
                            <label className="weui-agree">
                                <input type="checkbox" checked={isChecked} className="weui-agree__checkbox"
                                       />
                            </label>
                            阅读并同意 
                    </div> 
                    <div className="btn">
                            <div className={`submit-btn }`}
                                    onClick={(e)=>{
                                        e.stopPropagation();
                                        e.preventDefault();
                                    this.setState({
                                        knows:false,
                                    })
                                    }}>取   消
                            </div>
                            <div className={`submit-btn }`}
                                    onClick={(e)=>{
                                        e.stopPropagation();
                                        e.preventDefault();
                                    if(isChecked){
                                        this.setState({
                                        knows:false,
                                    })
                                        this.context.router.push({
                                            pathname:'consult/submitdesc',
                                            query:{pat:JSON.stringify(this.state.curPat),doctorId:this.props.location.query.doctorId,deptId:this.props.location.query.deptId,content:JSON.stringify(this.state.curItem)}
                                           
                                        }) 
                                    }else{
                                        this.setState({
                                            showIOS1:true,
                                            msg:'请阅读并同意慢病续方业务须知'

                                        })
                                    }
                                    }}>确   定
                            </div>
                        </div>
                </div>
            </div>}
                {!!toptip && <div className="hc-toptip">{toptip}</div>}
               
                <div className="pat-box">
                    <div className="pat-title">请选择就诊人
                        {cardList.length > 0 &&selectName!=''&&<span >（{selectName} | {selectSex} | {selectBirthday}）</span>}
                    </div>
                    <div className="item-box1">
                        {cardList && cardList.map((item, index)=> {
                            return (
                                <div
                                    key={index}
                                    onClick={
                                    ()=>{
                                    this.changePat(item.patientId,2)
                                    }}
                                    className={`pat-item ${item.active ? 'active' : ''}`}>
                                    <text style={{fontSize:'10px'}}> {item.patientName}</text>
                                </div>
                            )
                        })}
                        {leftBindNum > 0 && <div className="pat-img"
                                                 onClick={
                                                    ()=>{
                                                    this.addCard()
                                                    }}>
                            <img src="../../../resources/images/plus.png"/>
                        </div>}
                    </div>
                </div>
                {hasList&&<div className="describe-info">  
                     <div className="des_tip">
                      <img src="../../../resources/images/describe_tip_icon.png"/>
                        最近1个月内在本科室的慢病就诊记录
                     </div>

                     {

                        console.log(reportList,'reportListreportListreportList')

                     }

                    {reportList&&reportList.length>0&&reportList.map((item,index)=>{

                        if(item.has) {return(
                            <div className="describe-item"  key={index}>
                            <div className="des-basic" >
                                    <div className="des">
                                        <p className="left">就诊时间：<span>{item.Visit_date}</span></p>
                                    </div>
                                    <div className="des">
                                        <p className="left">就诊科室：<span>{item.Dept_name}</span></p>
                                    </div>
                                    <div className="des">
                                    <p className="left">诊断：<span>{item.Diagnosis_desc}</span></p>
                                     
                                    </div>  
                                    {item.has&&<span className="btns" onClick={()=>{  
                                        console.log()
                                         this.setState({
                                             knows:true,
                                             curItem:item
                                         })
                                    }}>      
                                     申请续方
                                    </span>}
                                    {!item.has&&<span className="btns" style={{background:'#ccc'}}
                                    onClick={()=>{
                                        this.setState({
                                            showIOS1:true,
                                            msg:'对不起，该处方中存在不可在线开具的药品信息，您可选择到院就诊.'
                                        })
                                    }} 
                                    >
                                    申请续方
                                    </span>}
                                </div>
                                {item.Recipel_list.length>0&&<div className='drug' onClick={()=>{
                                    this.expandMore(item.Visit_no)

                                }}>
                                    {item.has&&item.Recipel_list.length>0&&<div className="drug-tip">
                                      <img src='./././resources/images/describe-icon.png'/>药品处方
                                    </div>}
                                    {!item.has&&item.Recipel_list.length>0&&<div className="drug-tip" style={{color:'#ccc'}}>
                                       <img src='./././resources/images/describe-icon-hide.png'/>药品处方
                                    </div>}
                                    <div className="drug-tab">
                                    {!item.showMore&&item.Recipel_list.length>0&&<img src='./././resources/images/des_xyjt.png'/>}
                                    {item.showMore&&item.Recipel_list.length>0&&<img src='./././resources/images/des_jt.png' style={{width:'18px',height:'10px'}} />}
                                    </div>
                                </div>}
                                {item.showMore&&<div className="more-info"> 
                                  <div className="drug-info">
                                    {item.Recipel_list.length>0&&item.Recipel_list.map((item1,index1)=>{
                                    return(
                                        <div className="drug-item" key={index1}>   
                                                <div className="name">
                                                    <p className="left">{item1.name}</p>
                                                    <p className="right"></p>
                                                </div> 
                                                <div className="dose">
                                                   {item1.use}
                                                </div>
                                                {/* <div className="dose">
                                                    <p className="dose-item">3/日</p>
                                                    <p className="dose-item">口服</p>
                                                    <p className="dose-item">25mg*10</p>
                                                    <p className="dose-item">1盒</p>
                                                    <p className="dose-item">用法：25mg</p>
                                                </div> */}
                                            </div>
                                    )
                                })} 
                                    </div>
                                    <div className="desdoc-info">
                                        <p className="left">医生：{item.Doctor} | {item.Doctor_duty}</p>
                                      
                                    </div>
            
                                </div>}
                            </div>
                        )}else{
                            return ''
                        }
                    })
                        
                        
                    }
                    
                    <div className="no-des">
                            <img src='./././resources/images/mygddl.png'/>     
                            <p>没有更多了</p>
                    </div>
                </div>
            }
            {!hasList&& <div className='no-data'>
                <img src='../../../resources/images/no-result.png'/>
                <div>您近一个月内在本科室无慢病处方记录</div>
            </div>}
                <div className="empty-box"></div>
            </div>
        );
    }
}
export default Connect()(Widget);
