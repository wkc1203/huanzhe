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
var has="";
var imgList = [];
var drugArray =['T020001IA','T020001IB','T020001IC','T020001ID',
                'T020001TA','N091020TC','N091001SC','N091006LA',
                'N091012LO','N091012LP','N091012LQ','N091012LR',
                'NO91001SA','P040023OA','0030002TA','G022009TA',
                'G022010TA','I071001TA','I030012IA','I030012IB',
                'I030012IC','I030012TA','I030012TB','I030012TC',
                'I030014LA','I030014TP','O010030TA','O010030TB',
                'O010031TB','O010031TC','O010031TD','O010031TA',
                'P040007OA','O010031TC','O010009LB','O010009LA',
                'O010009TA','DO20010LA','W020036TR','W020036TP',
                'W020036TQ','W020035PA','W050001TB','W020036PA',
                'W020034PA','V010008TB','V010008TC','V010008TA',
                'H010004TA','D050033TA','O030072TC','Z01A007TA',
                'N120021IA','C030012TA','N120021IC','N120021IB',
                'C050004TA','R020022TP','R020022LA','R020043TB',
                'P070025PA','P070025TA','P070010LA','P070012TC',
                'P070012TA','I055013PB','I055013PP','R010009PA',
                '0010008TA','Z012035TA','Z016020BA','B010016LA',
                'B010016LB','B010016LC','B010016LD','B010016LE',
                'G022015L2','P040122OA','G022015L3','G022015L2',
                'G022015L4','P0401220B','R020032L2','R020035LA',
                'R020005LB','C010001LB','C010001TA','C050039TP',
                'C050004TA','C020013TP','C020008TA','C020008TA',
                'C050055TA','C020014TA','C020009TA','U010003TA',
                'U010004TA','U010005TA','G022009TA','W050060PA',
                'N091001TA','N091001T1','H030002TA','C070013TA',
                'C070013TA','C060011TA','C060011TB','C030014TB',
                'C030014LB','C030014LA','C030014TA','B020009TA',
                '0020013LA','Z019014AA','C020018TA','C050009TA',
                'C030004TA','C030004TP','V030001TA','V020001TA',
                'V030006TD','C030012TA','G041004T1','V010008TD',
                'V010008TD','G042004TB','G042003TA','C020008TA',
                'O010008LA','O010007TB','O010007TA','O020013LA',
                'G031030TA','Z016019DA','W020025PC','W020025PD',
                'Z016026CA','G070002T1','W020036TR','W020036PA',
                'U010004TA','P040120LA','N091002TA','X021007LB',
                '0020010TB','0020010TA','B020009TA','Z040004IA',
                'N050004IA','N050004LA','N050004LB','N050004TA',
                'N050004TB','N050004TP','N050014LA','N050014TA',
                'N050014TP','N050015TJ','N050015TP','N050007LA',
                'N050007TA','N050007TB','N050005TA','N071012TC',
                'P070004TA','C030016TP','W0330001TA','C030012TA',
                'Z016005BB','0030002TA','G022009TA','G022010IB',
                'G022010IA','G022010TA','G022010IC','I071001TA',
                'Z016020BA','H010005TA','H010005TB','H010005LA',
                '0010030TB','0010030TA','O010031TB','0010031TC',
                'O010031TD','O010031TA','P040007OA','O010031TC',
                'C020013IA','C020013TP','DO20010LA','W020036TR',
                'W020036TP','W020036TQ','W020035PA','W050001TB',
                'W020036PA','W020034PA','V010008TB','V010008TC',
                'V010008TA','H010004TA','D050033TA','O030072TC',
                'Z01A007TA','I073001TA','P070025PA','P070025TA','C050004TA']
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
            /*过滤 */
            newList:[],
           
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
            diagList:[],
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
            if(window.location.hostname=='tih.cqkqinfo.com'){
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
        var queryParams={patientId:id};
        if(!!this.props.location.query.test&&this.props.location.query.test==1){
            queryParams = {patientId:id,test:"1"};
        }
        Api
            .getdiseaseList(queryParams)
            .then((res) => {
                this.hideLoading();
                if (res.code == 0) {
                     if(res.data.length>0){
                         var listUse = res.data;
                         var listt=[];
                         console.log("listUse",listUse)
                          for(var i=0;i<listUse.length;i++){
                           
                              listUse[i].has=true;
                            //  console.log(listUse[i].has,"has")
                              if(!!listUse[i].Recipel_list&&listUse[i].Recipel_list.length>0){
                                 for(const item of listUse[i].Recipel_list){
                                        //   for(let j=0;j<drugArray.length;i++){
                                            console.log("qqq",":",j,"-",item.Item_code,":",drugArray.indexOf(item.Item_code))
                                            if(drugArray.indexOf(item.Item_code)==-1){
                                                listUse[i].has=false; 
                                                console.log(listUse[i].has,"hass")
                                             }
                                        //   }
                                }
                                
                              } 

                             listUse[i].showMore=false;
                                if(!!listUse[i].Recipel_list&&listUse[i].Recipel_list.length>0){
                                    for(var j=0;j<listUse[i].Recipel_list.length;j++){
                                        listUse[i].Recipel_list[j].name=listUse[i].Recipel_list[j].Detail.substring(0,listUse[i].Recipel_list[j].Detail.indexOf(' '));
                                        //console.log(list[i].Recipel_list[j].name)
                                        listUse[i].Recipel_list[j].use=listUse[i].Recipel_list[j].Detail.substring(listUse[i].Recipel_list[j].Detail.indexOf(' ')+1,listUse[i].Recipel_list[j].Detail.length);
                                    }
                                }else{
                                    listUse[i].Recipel_list=[];
                                }
                                if(!!listUse[i].Recipel_list&&listUse[i].Recipel_list.length>0){
                                    listt.push(listUse[i]) 
                                }
                          }
                          console.log('list=',listt)
                          this.setState({
                              reportList:listUse,
                              newList:listt,
                          })
                         console.log("newList",this.state.newList)
                     }else{
                        this.setState({
                            reportList:[],
                            newList:[]
                        })
                     }
                }
                
            }, e=> {
                this.setState({
                    reportList:[],
                    newList:[]

                })
                if(e.msg&&e.msg.indexOf('系统维护')>=0){
                    this.setState({
                        showIOS1:true,
                        msg:e.msg
                    })
                }
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
        //console.log(listUse[i].has,"hass")
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
                    ></span>选择复诊处方记录
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
                    您还有对当前科室/医生的咨询未完结，请先完结当前科室/医生的咨询，再发起新的咨询。
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
                            <p> 复诊续方业务须知</p>
                    </div>
                    <div className='modal-content-protocol'>
                        <div >       

                            <div className="content-item" >1、仅支持有历史处方记录的患者申请；</div>
                            <div className="content-item" >2、最大配药量遵循医保规定执行（1个月）；</div>
                            <div className="content-item" >3、提交申请后医师将在24小时内处理，请耐心等待；</div>
                            <div className="content-item" >4、若24h内医生未接诊，系统将在<span style={{color:'red'}}>3个工作日内</span>自动为您退回网络门诊费；</div>
                            <div className="content-item" >5、提交申请后，请留意平台消息，请在医师开具处方后及时在线支付药品费和快递费，订单只在当天有效，超时网络挂号费概不退回；</div>
                            <div className="content-item" >6、通过本平台开具的处方药品暂时只能选择快递到家，快递费以实际显示为准；
                            </div>
                            <div className="content-item" >7、由于药品属于特殊商品，不能每种药品都进行配送，故以下几类药物暂不列入配送范围：
                                <p style={{color:'red'}}>&nbsp;&nbsp;(1)、各类注射用（针）剂；</p>
                                <p style={{color:'red'}}>&nbsp;&nbsp;(2)、重医儿院自配制剂；</p>
                                <p style={{color:'red'}}>&nbsp;&nbsp;(3)、冰箱冷藏药品；</p>
                                <p style={{color:'red'}}>&nbsp;&nbsp;(4)、一、二类精神药品。</p>
                            </div>
                            <div className="content-item" >8、通过本平台开配的处方药品缴费后不予退还。
                            </div>
                             {/*<div className="content-item" >1、仅支持慢病患者院内1个月内的历史处方记录续方申请；</div>
                            <div className="content-item" >2、最大配药量遵循医保规定执行；
                            </div>
                            <div className="content-item" >3、<span style={{color:'red'}}>包含门诊费和药品费</span>两种业务类型缴费，请依次完成支付；
                            </div>
                            <div className="content-item" >4、<span style={{color:'red'}}>医师接诊后，网络门诊费不予退费。</span>若24h内医生未接诊，系统将在<span style={{color:'red'}}>3个工作日内</span>自动为您退回网络门诊费；
                            </div>
                            <div className="content-item" >5、订单支付成功后，可凭电子处方笺（条形码）<span style={{color:'red'}}>到渝中院区（门诊楼1楼）或两江院区药房取药</span>；
                            </div>
                            <div className="content-item" >6、通过本平台开配的药物原则上不予退换。如需退费退药，请到医院窗口申请。
                            </div>*/}
                      

                            {/* <div className="content-item" >1、只允许对1个月以内的慢病处方记录发起续方申请</div>
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
                            </div>                                */}
                                                                                   
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
                                            msg:'请阅读并同意复诊续方业务须知'

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
                        最近5个月内在本科室的就诊记录
                     </div>

                     {

                       // console.log(reportList,'reportListreportListreportList')
                        console.log(this.state.newList,"itemm")
                     }

                    {this.state.newList&&this.state.newList.length>0&&this.state.newList.map((item,index)=>{
                           // console.log("has",item)
                         return(
                             
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
                                    {<span className="btns" onClick={()=>{  
                                        //console.log()
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
                                            msg:'您好，该处方中存在不可在线开具的药品，建议您到医院就诊。'
                                        })
                                    }} 
                                    >
                                    申请续方
                                    </span>}
                                </div>
                                {item.Recipel_list.length>0&&<div className='drug' onClick={()=>{
                                    this.expandMore(item.Visit_no)

                                }}>
                                    {item.Recipel_list.length>0&&<div className="drug-tip">
                                      <img src='./././resources/images/describe-icon.png'/>药品处方
                                    </div>}
                                    {/* {!item.has&&item.Recipel_list.length>0&&<div className="drug-tip" style={{color:'#ccc'}}>
                                       <img src='./././resources/images/describe-icon-hide.png'/>药品处方
                                    </div>} */}
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
                        )
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
                <div>您近一个月内在本科室无复诊处方记录</div>
            </div>}
                <div className="empty-box"></div>
            </div>
        );
    }
}
export default Connect()(Widget);
