
import React, { Component } from 'react';
import { Link } from 'react-router';
import {Upload, Modal,Button,Spin, Alert } from 'antd';
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
            imgArr: [],
            expire:'',
            leftBindNum: 5, 
            totalFee: 0,
            selectName: '',
            pics: '',
            selectSex: '',
            selectBirthday: '',
            selectPatientId: '',
            showTip: false,
            toptip: '',
            isUploadAll: false,
            suffix: '',
            policy: "",
            callback: "",
            OSSAccessKeyId: "",
            key: "",
            intervals:'',
            files:[],
            name: "",
            fileList: [],
            uploading: false,
            formData: {},
            open: false,
            open1: false,
            cardType:1,
            inquiryId:'',       
            patCardNo:'',
            cardNo:'0014492503',
            report:false,
            isIos:false,
            has:false,
            inDate:'',
            reportInfo:[],
            visitNo:'',
            apply:false,
            hasApply:false,
            currentDoctor:true,
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
    other(){
        
       
            Api.getDoctor({hospitalUserName:this.state.reportInfo.hisDoctorName})
        .then((res) => {
            if (res.code == 0 && res.data != null) {
                if(this.mounted){
                    if(res.data.status!='2'&&res.data.freeReport=='1'){
                        this.setState({docInfo: res.data});
                        this.setState({
                            msg:' 查询到您可向'+this.state.reportInfo.doctorRealName+'医生发起免费报告解读，是否立即前往',
                            showIOS1:true,
                        })
                    
                  
                    
                    }else{
                        this.setState({
                      
                            has:false,
                            apply:false,
                            currentDoctor:false,
                        })
                    }
                }
                  
                }else{
                    this.setState({
                      
                        has:false,
                        apply:false,
                        currentDoctor:false,
                    })
                }

            }, (e) => {
                this.setState({
                      
                    has:false,
                    apply:false,
                    currentDoctor:false,
                })
                
            });
        
        
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
                  this.getreportList(this.state.selectPatientId);
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

        if(!!window.localStorage.openId){
            Utils.sum('inquiry_img',1);
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
        this.getJs1();
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
    
    /*获取报告列表*/
    getreportList(id) {
        this.showLoading();
        //390
        var report;   
        console.log("his",this.state.docInfo)
        Api
            .getreportList({patientId:id,hisDoctorName:this.state.docInfo&&this.state.docInfo.hisDoctorName?this.state.docInfo.hisDoctorName:''})
            .then((res) => {
                this.hideLoading();
                if (res.code == 0) {
                    if(res.data.length>0){
                        var otherDoctor=false;
                        var currentDoctor=false;
                        var data=res.data;
                         for(var i=0;i<data.length;i++){
                            console.log("@",this.state.docInfo.hisDoctorName,data[i].hisDoctorName,data[i].doctorRealName)
                            if(this.state.docInfo.hisDoctorName==data[i].hisDoctorName&&!!data[i].doctorRealName){ 
                                       if(data[i].inquiryId!='0'){
                                            if(!!data[i].inquiry&&(data[i].inquiry.status=='4'||data[i].inquiry.status=='5')){
                                                this.setState({
                                                    reportInfo:data[i],
                                                    has:true,
                                                    apply:true,
                                                    currentDoctor:true,
                                                })
                                                currentDoctor=true;
                                                break;
                                            }else{
                                                continue;
                                            }
                                       }     
                            }
                        } 
                        if(!currentDoctor){
                            console.log("1")
                            for(var i=0;i<data.length;i++){
                                if(this.state.docInfo.hisDoctorName==data[i].hisDoctorName&&!!data[i].doctorRealName){ 
                                    if(data[i].inquiryId=='0'){
                                             this.setState({
                                                 reportInfo:data[i],
                                                 has:true,
                                                 apply:false,
                                                 currentDoctor:true,
                                             })
                                             currentDoctor=true;
                                             break;
                                         }
                                    }     
                         }
                        }
                        if(!currentDoctor){

                            for(var i=0;i<data.length;i++){
                                if(this.state.docInfo.hisDoctorName!=data[i].hisDoctorName&&!!data[i].doctorRealName&&(!!data[i].inquiryId&&data[i].inquiryId=='0')){                               
                                              this.setState({
                                                  reportInfo:data[i],
                                                  has:true, 
                                                  currentDoctor:false, 
                                              })
                                              otherDoctor=true;
                                              break;
                            }

                        }
                       }
                        
                        if(currentDoctor){
                            
                        } 
                        if(otherDoctor){
                           this.other();
                        }
                       
                    }else{
                        this.setState({
                            has:false
                        })
                    }
                    console.log("resaa",this.state.reportInfo,this.state.apply,this.state.has);
                }
            }, e=> {
               this.hideLoading();
            });
   }
      
        checkInquiry(remune){
        Api
            .isRegister() 
            .then((res) => {
                if (res.code == 0) {
                    Api
                    .checkHasInquiry({
                        hisId:2214,
                        doctorId:this.state.doctorId||"",
                        deptId:this.state.deptId||"",
                        userId:JSON.parse(window.localStorage.userInfo).id||""
                    })
                    .then((res1) => {
                        if (res1.code == 0) {
                            if(res1.data.inquiryId!=null&&res1.data.inquiryId!=''){
                                if(this.mounted){
                                this.setState({
                                    inquiryId:res1.data.inquiryId||'',
                                    msg:'当前咨询完成后，才能对医生发起新的咨询',
                                    showIOS3:true
                                })
                            }
                            }else{
                                this.jumpConfirminfo(remune);
                            }                            
                        }
                    }, es=> {
                        if(this.mounted){
                        this.setState({
                            msg:es.msg,
                            showIOS1:true
                        })
                    }
                    });
                }
            }, e=> {
                if(this.mounted){
                    this.setState({
                        msg:e.msg,
                        showIOS1:true
                    })
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
   /*获取oss 签名*/
    getJs1(){
        Api
            .getSign({bucket: 'ihoss', dir: "PIC"})
            .then((res) => {
                if (res.code == 0) {
                    this.hideLoading();
                    const sign={
                        signature: res.data.sign,
                        policy: res.data.policy,
                        callback: res.data.callback,
                        OSSAccessKeyId: res.data.accessId,
                    };
                    if(this.mounted){
                        this.setState({
                            sign:sign,
                            expire:res.data.expire
                        })
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
   
    /*提示信息*/
    submitData() {
        let errMsg = !this.state.selectPatientId
            ? '请选择就诊人'
           
            : !this.state.content
            ? '病情描述不能为空'
            : this.state.content.length <= 10 ? '病情描述不能低于10个字' : '';
        if (errMsg) {
            this.setState({
                toptip: errMsg
            })
            setTimeout(() => {
                this.setState({
                    toptip: ''
                })
            }, 2000);
            return;
        }
        const imgArr2 = this.state.imgArr;
        var len = imgArr2.length;
        const docInfo = this.state.docInfo;
        if (len == 0) {
            const params = {
                hisName: docInfo.hisName,
                deptId: docInfo.deptId,
                doctorId: docInfo.doctorId,
                deptName: docInfo.deptName,
                doctorName: docInfo.name,
                totalFee: 1,
                type: '1',
                pics: '',
                patientName: this.state.selectName,
                content: this.state.content,
                patientId: this.state.selectPatientId,
                patCardNo:this.state.patCardNo,
                purpose:'报告解读',
                purposeType:'3',
                hisId:2214,
                userId:JSON.parse(window.localStorage.userInfo).id||""
            };
            this.createOrder(params);
        } else {
            var pics = '';
            if (imgArr2.length > 1) {

                for (var i = 0; i < imgArr2.length; i++) {
                    if (i != imgArr2.length - 1) {
                        pics = pics + imgArr2[i] + ',';
                    } else {
                        pics = pics + imgArr2[i];
                    }
                }
            } else {
                pics = imgArr2[0];
            }
            this.setState({
                pics: pics
            })
            const params = {
                hisName: docInfo.hisName,
                deptId: docInfo.deptId,
                doctorId: docInfo.doctorId,
                deptName: docInfo.deptName,
                doctorName: docInfo.name,
                totalFee:1,
                type: '1',
                pics: pics,
                hisId:2214,
                userId:JSON.parse(window.localStorage.userInfo).id||"",
                patientName: this.state.selectName,
                content: this.state.content,
                patCardNo:this.state.patCardNo,
                patientId: this.state.selectPatientId,
                purpose:'报告解读',
                purposeType:'3',
            };
            this.createOrder(params);
        }
    }
    isHasImg(url){
        var xmlHttp ;
        if (window.ActiveXObject)
         {
          xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
         }
         else if (window.XMLHttpRequest)
         {
          xmlHttp = new XMLHttpRequest();
         } 
        xmlHttp.open("Get",url,false);
        xmlHttp.send();
        if(xmlHttp.status==404)
        return false;
        else
        return true;
    }
   /*创建订单*/
    createOrder(params) {
         this.showLoading();
        Api
            .createOrder(params)
            .then((res) => {
                if (res.code == 0) {
                    imgList=[];
                    var replaceUrl=window.location.origin+"/views/p2214/#/consult/pay?orderId="+res.data.orderId+"&totalFee="+
                        1+"&inquiryId="+res.data.id+"&type=2"; 
                              console.log(replaceUrl)
                   top.window.location.replace(replaceUrl);
                }else{
                    this.hideLoading();
                    if (res.code==-2) {
                        console.log("1")
                        window.scrollTo(0,0);
                        if(res.msg!=null&&res.msg!=''){
                            if(this.mounted){
                            this.setState({
                                inquiryId:res.msg||'',
                                msg:'当前咨询完成后，才能对医生发起新的咨询',
                                showIOS3:true
                            })
                        }
                    }
                    }else{
                        if(this.mounted){
                            this.setState({
                                msg: res.msg,
                                showIOS1: true
                            })
                        }
                }
                }
            }, (e) => {
                this.hideLoading();
                window.scrollTo(0,0);
                if (e.code==-2) {
                    if(e.msg!=null&&e.msg!=''){
                        if(this.mounted){
                            this.setState({
                                inquiryId:e.msg||'',
                                msg:'当前咨询完成后，才能对医生发起新的咨询',
                                showIOS3:true
                            })
                        }   
                }              
                }else{
                    if(this.mounted){
                        this.setState({
                            msg: e.msg,
                            showIOS1: true
                        })
                    }
                }     
            });
    }
   /*切换就诊人*/
    changePat(id) {
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
                    selectPatientId: id
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
        this.getreportList(id); 
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
    /*放大图片*/
    previewImg(url) {
        const arr = [];
        this.state.imgArr.map(item => {
            if (item) {
                arr.push(item);
            }
        });
            wx.previewImage({
                current: url, // 当前显示图片的http链接
                urls: arr // 需要预览的图片http链接列表
            });
    }
    /*保存内容*/
    saveContent(e) {
        this.setState({
            content: e.target.value
        })
    }
    /*验证图片张数*/
    alertTxt(e) {
        if (this.state.imgArr.length >= 4) {
            this.setState({
                open1: true
            })
            this.setState({
                msg: '最多只能上传4张图片',
                showIOS1: true,
            })
        } else {
            if(this.mounted){
                this.setState({
                    open:true
                })
                this.setState({
                    open1:false
                })
            }
            this.getJs1();
        }
    }
   /*删除图片*/
    deleteImg(url) {
        event.stopPropagation();
        event.preventDefault();
        var images = this.state.imgArr;
        var s1 = [];
        for (var i = 0; i < images.length; i++) {
            if (url != images[i]) {
                s1.push(images[i])
            }
        }
        var imgdata=[];
        for(var j=0;j<images.length;j++){
            if(url!=imgList[j]){
                imgdata.push(imgList[j])
            }
        }
        imgList=imgdata;
            if(this.mounted){
            this.setState({
                imgArr: s1
            });
        }
    }
    base64ToBlob(urlData) {
        var arr = urlData.split(',');
        var ua = navigator.userAgent.toLowerCase();//获取浏览器的userAgent,并转化为小写——注：userAgent是用户可以修改的
        var isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);//判断是否是苹果手机，是则是true
        var  mime ='';
        var bytes;
        
            mime = arr[0].match(/:(.*?);/)[1] || 'image/png';
           bytes = window.atob(arr[1]);
      
        // 去掉url的头，并转化为byte
        // 处理异常,将ascii码小于0的转换为大于0
        var ab = new ArrayBuffer(bytes.length);
        // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
        var ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        return new Blob([ab], {
            type: mime
        });
    }
    choose(sign){
    var that=this;
    if(that.state.imgArr.length>=4){
        if(this.mounted){
            that.setState({
            msg:'一次最多只能上传四张图片',
            showIOS1:true,
            })
        }
}else{
    wx.ready(function () {
        wx.chooseImage({
            count: 4, // 默认9
            sizeType: ['original','compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album','camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                that.showLoading('上传中');
                var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                var m=[];
                var length=that.state.imgArr.length;
                length+=localIds.length;
                if(length>4){
                    that.hideLoading();
                    that.showToast(); 
                }else{
                    for(var i=0;i<localIds.length;i++){
                        var ua = navigator.userAgent.toLowerCase();
                        var isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);//判断是否是苹果手机，是则是true                       
                        wx.getLocalImgData({
                            localId: localIds[i], // 图片的localID
                            success: function (res) {
                                var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                                if (isIos) { // 如果是IOS，需要去掉前缀
                                    localData = res.localData.replace(/^.*?base64,/, 'data:image/jpg;base64,');
                                }
                                const formData = new FormData();
                                var filename='';
                                var image=[];
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
                                var S4=(((1+Math.random())*0x10000)|0).toString(16).substring(1);
                                var uuid=S4+S4+"-"+S4+"-"+S4+"-"+S4+"-"+S4+S4+S4;
                                var filename=that.randomName()+Utils.uuid()+'.png';
                                formData.append('key',filename);
                                formData.append("policy",sign.policy);
                                formData.append("callback",sign.callback);
                                formData.append("signature",sign.signature);
                                formData.append("OSSAccessKeyId",sign.OSSAccessKeyId); 
                                formData.append('file',that.base64ToBlob(localData));
                                $.ajax({
                                    url: 'https://ihoss.oss-cn-beijing.aliyuncs.com',
                                    method: 'POST',
                                    processData: false,
                                    contentType: false,
                                    cache: false,
                                    data: formData,
                                    success: (e) => {
                                        that.hideLoading();
                                        imgList.push('https://ihoss.oss-cn-beijing.aliyuncs.com/'+filename);
                                        that.setState({
                                            imgArr:imgList
                                        })
                                    },
                                    error:(e) =>{
                                        that.hideLoading();
                                        console.log("this.sate",that.state.imgArr)
                                    }
                                });
                            }
                        });
                    }
                }
            },
            error:(res)=>{
                alert(res)
            }
        });
    });
} 
}

onChange = (files,file,index) => {
   
    var that=this;
    if(that.state.imgArr.length>=4){

    that.setState({
    msg:'一次最多只能上传四张图片',  
    showIOS1:true,
    })
}else{
    if(!!file){
     console.log(files,!!file,index)
    this.setState({
        files,
      });
      var that=this;
      var sign=that.state.sign;
    
    that.showLoading('上传中');
    for(var i=0;i<files.length;i++){
        console.log(this.state.imgList)
        const formData = new FormData();
        var filename='';
        var image=[];
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
    
                var base64='';
        var that=this;
                var reader = new FileReader();//创建一个字符流对象
            reader.readAsDataURL(files[i]);//读取本地图片
            reader.onload = function(e) {
               base64=this.result;
               var date=new Date().getTime();
        var m=ossPath+year+'/'+month+'/'+day+"/";
        var S4=(((1+Math.random())*0x10000)|0).toString(16).substring(1);
        var uuid=S4+S4+"-"+S4+"-"+S4+"-"+S4+"-"+S4+S4+S4;
        var filename=that.randomName()+Utils.uuid()+'.png';
        formData.append('key',filename);
        formData.append("policy",sign.policy);
        formData.append("callback",sign.callback);
        formData.append("signature",sign.signature);
        formData.append("OSSAccessKeyId",sign.OSSAccessKeyId); 
        formData.append('file',that.base64ToBlob(base64)); 
        $.ajax({
            url: 'https://ihoss.oss-cn-beijing.aliyuncs.com', 
            method: 'POST',
            processData: false,
            contentType: false,
            cache: false,
            data: formData,
            success: (e) => {
               
                imgList.push('https://ihoss.oss-cn-beijing.aliyuncs.com/'+filename);
               // alert("us")
                //alert(this.isHasImg('https://ihoss.oss-cn-beijing.aliyuncs.com/'+filename));
                if(that.isHasImg('https://ihoss.oss-cn-beijing.aliyuncs.com/'+filename)){
                    that.hideLoading();
                that.setState({
                        imgArr:Array.from(new Set(imgList))
                    });
                }else{
                   var  intervals = setInterval(() => that.isHas('https://ihoss.oss-cn-beijing.aliyuncs.com/'+filename,imgList), 500);
                   that.setState({
                       intervals:intervals
                   })
                    
                }
               
              
               
            },
            error:(e) =>{
                that.hideLoading();
            }
        });
            };
    }
    
}
}
  };
  
  getBase64Image(){
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
    var dataURL = canvas.toDataURL("image/"+ext);
    return dataURL;
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

  isHas(url,imgList){
      var that=this;
    if(that.isHasImg(url)){
        clearInterval(this.state.intervals);
        that.hideLoading();
        that.setState({
            imgArr:Array.from(new Set(imgList))
        });
    }
  }
  onAddImageClick = () => {
    this.setState({
      files: this.state.files.concat({
        url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
        id: '3',
      }),
    });
  };
  onTabChange = (key) => {
    console.log(key);
  };
    render() {
        const {report,apply,codeUrl,cardShow,patientShow,msg,callback,OSSAccessKeyId,open1,docInfo,cardList,consultList,imgArr,leftBindNum,
            selectName,isIos,sign,selectSex,selectBirthday,toptip,files,reportInfo,hasApply}=this.state;
        return (
            <div className="page-confirm-info">
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
                    ></span>报告解读
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
                                this.changePat(item.patientId);
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
                            if(selectName!=''){
                                this.setState({
                                    patientShow:false
                                })
                            }else{
                                this.setState({
                                    msg:'请选择就诊人',  
                                    showIOS1:true,
                                    })
                            }
                        }                      
                        }>确定</button>          
                    </div>
                </div>
                }
                {cardShow && <div className='modal'
                                  onClick={(e)=>{
                    this.setState({
                     cardShow:false
                    })
                    }}>
                    <div className='modal-body-register'
                         onClick={(e)=>{
                    e.stopPropagation()
                    }}
                        >
                        <div className='modal-img-register'>
                            {codeUrl&&<img src={codeUrl||'./././resources/images/code.jpg'}/>}
                            <p>长按识别二维码关注公众号</p>
                        </div>
                        <div className='modal-content-register'>
                            关注后可以同步您的儿童医院就诊卡
                        </div>
                        <div className='modal-btn-register'>
                            <div onClick={(e)=>{
                          e.stopPropagation();

                        this.setState({
                           cardShow:false,
                           showIOS2:true
                        })
                        }}>暂不关注
                            </div>
                        </div>
                    </div>
                </div>}
                {!!toptip && <div className="hc-toptip">{toptip}</div>}
                <div className="doc-item" id="head">
                    <div className="doc-info">
                        {docInfo.image && <img className="doc-img" src={docInfo.image&&docInfo.image.indexOf("ihoss")=='-1'?docInfo.image:docInfo.image+"?x-oss-process=image/resize,w_105"} alt="医生头像"/>}
                        {!docInfo.image &&
                        <img className="doc-img" src='../../../resources/images/doc.png' alt="医生头像"/>}
                        <div className="text2-box">
                            <div className="doc-name">{docInfo.name}</div>
                            <div className="doc-des">{docInfo.hisName}</div>
                            <div className="doc-des">{docInfo.deptName } | {docInfo.level}</div>
                        </div>
                    </div>
                </div>
                <div className="pat-box">
                    <div className="pat-title">请选择就诊人
                        {cardList.length > 0 && <span >（{selectName} | {selectSex} | {selectBirthday}）</span>}
                    </div>
                    <div className="item-box1">
                        {cardList && cardList.map((item, index)=> {
                            return (
                                <div
                                    key={index}
                                    onClick={
                                    ()=>{
                                    this.changePat(item.patientId)
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
                {
                    !patientShow&&!report&&<div className='report'>
                        <p className='rule'>规则说明</p>
                        <div>
                        <p>1、免费报告解读仅限于在本院（渝中本部和礼嘉分院）完成的检验检查项目。</p>

                        <p>2、每次就诊报告结果发布后，患者均有<span>一次机会向开单医生申请免费报告解读</span>，请确保您已拿到全部报告结果。</p>
                        
                        <p> 3、报告解读有效期自所有线上能出结果的最后一个报告发布时间起，<span>72小时内可向开单医生申请报告解读，逾期无效。</span></p>
                        
                        <p>4、因部分报告结果无法通过手机查看，请及时到线下获取纸质报告结果，<span>纸质报告可通过上传照片</span>的方式进行解读，线上报告无需上传资料。</p>
                        </div>
                    </div>
                }
                {!patientShow&&report&&<div className="describe">
                    <div className="edit-title">病情描述</div>
                    <div className="edit-area">
                        <textarea
                            onChange={(e)=>{
                        this.saveContent(e)
                        }}
                            placeholder="请详细描述就诊人的性别、年龄、症状、持续时间和用药情况，或已经确诊的疾病以及看诊医生的意见，我们会确保您的隐私安全。（最少10个字）">
                        </textarea>
                        <div className='img-choose-box'>
                            <div className='img-box'
                                >
                                <div className="img-item">
                                {imgArr.length<4&&
                                 <input type="file" id="file"  onChange={(e) => {           
                                            this.onChange(e.target.files,e.target.files[0],0)
                                        }} accept="image/*" />
                                        } 
                            {<img onClick={()=>{
                                if(imgArr.length>=4){
                                    this.setState({
                                    msg:'一次最多只能上传四张图片',  
                                    showIOS1:true,
                                    })
                                }
                            }} src="./././resources/images/add-img.png"/> }
                                        {/* isIos&&<div onClick={(e)=>{
                                                   this.choose(this.state.sign)
                                                }}> 
                                            <img src="../../../resources/images/add-img.png"/>
                                       </div> */}
                                </div>
                            </div>
                            {imgArr && imgArr.map((item, index)=> {
                                return (
                                    <div className='img-box'
                                         key={index}
                                        >
                                        <div className='img-add'
                                            >
                                            <Icon value="clear"
                                                  onClick={
                                                    ()=>{
                                                    this.deleteImg(item)
                                                    }}
                                                />
                                            <div>
                                                <img  src={item&&item.indexOf("ihoss")=='-1'?item:item+"?x-oss-process=image/resize,w_105"}
                                                     onClick={()=>{
                                                        this.previewImg(item)
                                                        }}/>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            {imgArr.length <= 0 && <div className="explain">
                                <div>添加图片(请上传高清原图)</div>
                                <div>病症部位、检查报告或其他病情资料(最多可上传4张)</div>
                            </div>}
                        </div>
                    </div>
                </div>}
                {report&&<div className="btn">
                    <button className="submit-btn1"
                            onClick={
                            ()=>{
                            this.submitData()
                            }}
                        >
                        提交
                    </button>
                </div>}
                {!report&&!apply&&<div className="btn">
                    <button className="submit-btn1"
                            onClick={
                            ()=>{
                            this.add()
                            }}
                        >
                        提交申请
                    </button>
                </div>}
                {!report&&apply&&(reportInfo.inquiry.status=='4'||hasApply)&&<div className="btn">
                    <button className="submit-btn1" style={{background:'rgba(106, 179, 204, 0.46)'}}
                        >
                        已发送申请，待医生同意
                    </button>
                </div>}
                {!report&&apply&&reportInfo.inquiry.status=='5'&&<div className="btn">
                    <button className="submit-btn1"
                    style={{background:'#ccc',color:'white',fontSize:'15px'}}
                        >
                        申请未通过，请到线下咨询开单医生
                    </button>
                </div>}
                <div className="empty-box"></div>
            </div>
        );
    }
}
export default Connect()(Widget);
