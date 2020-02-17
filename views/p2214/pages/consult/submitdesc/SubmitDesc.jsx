
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
            doclistShow:false,
            fileList: [],
            uploading: false,
            formData: {},
            open: false,
            open1: false,
            cardType:1,
            inquiryId:'',       
            patCardNo:'',
            cardNo:'0014492503',
            visitNo:'',
            showMore:false,
            docList:[],
            content:{},
            pat:{},
            detail:'',
            currentiInquiry:'',
            inquiryPage:1,
            maxinquiryPage:'',
            maxinquiryPage:'',
            searchPage:1,//查询页
            // 方式重复提交
            islock:false

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

        let timeCount;
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
        
        this.getDocDetail(this.props.location.query.doctorId, this.props.location.query.deptId);
       
       this.getDocList(this.props.location.query.deptId,1)
        document.getElementById("home").scrollIntoView();
        Utils.getJsByHide();
        //判断是否是从儿童医院公众号添加卡进入该页面
       this.setState({
           content:JSON.parse(this.props.location.query.content),
           pat:JSON.parse(this.props.location.query.pat),
       })
        window.addEventListener('scroll', function () {
            if (this.state.isLoadingMore) {
                return ;
            }
            if (timeCount) {
                clearTimeout(timeCount);
            }
            timeCount = setTimeout(this.callback(), 5000);
        }.bind(this), false);
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
    loadMoreDataFn() { 
        if(this.state.open){
           
           this.setState({
            inquiryPage:this.state.inquiryPage+1
           })
            if(this.state.inquiryPage<=this.state.maxinquiryPage){
              // alert(this.state.currentiInquiry+"-----"+this.state.inquiryPage)
             
                   this.getDocList(this.state.deptId,this.state.inquiryPage);
               
            }
        } 
        
   }
    getDocList(deptId,page) {
        this.setState({
            deptId:deptId,
        })
        
            this.showLoading();
            Api
                .getInfo({deptId,pageNum:page})
                .then((res) => {
                    this.hideLoading();
                    if (res.code == 0 && res.data != null) {
                            this.setState({
                            maxinquiryPage:res.data.pageCount,
                        })
                        var data=[];
                        for(var i=0;i<res.data.doctors.length;i++){
                                data.push(res.data.doctors[i])
                        }
                        if(res.data.currentPage==1){
                            this.setState({
                                docList: data || [],
                            })
                        }else{
                            this.setState({
                                docList: this.state.docList.concat(data) || [],
                            })
                        }
                        console.log("doc",this.state.docList)
                                               
                    }
                }, (e) => {
                    this.hideLoading();
                    this.setState({
                        msg: e.msg||'系统错误',
                        showIOS1: true
                    })
                });
    }
    callback() {
        const wrapper = this.refs.wrapper;
        const loadMoreDataFn = this.loadMoreDataFn;
        const top = wrapper?wrapper.getBoundingClientRect().top:0;
        const windowHeight = window.screen.height;
        const that = this; // 为解决不同context的问题
        that.loadMoreDataFn();
        if (top && top < windowHeight) {
            // 当 wrapper 已经被滚动到页面可视范围之内触发
            
        }
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
        Api
            .getCardList()
            .then((res) => {
                if (res.code == 0) {
                    this.setState({
                        leftBindNum: res.data.leftBindNum
                    })
                    if (res.data.cardList.length > 0) {
                        var cardList = res.data.cardList;
                        cardList[0].active = true;
                            if(this.mounted){
                            this.setState({
                                leftBindNum: res.data.leftBindNum,
                                cardList: cardList,
                                patCardNo:cardList[0].patCardNo,
                                selectName: cardList[0].patientName,
                                selectSex: cardList[0].patientSex == 'M' ? '男' : '女',
                                selectBirthday: cardList[0].birthday,
                                selectPatientId: cardList[0].patientId
                            })
                            this.getreportList(this.state.selectPatientId);
                        }
                    }
                }
            }, (e) => {
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
                }

            }, (e) => {
            });
    }
   
    /*提示信息*/
    submitData() {
         if(this.state.detail.length>9){
            const params = {
                doctorId: this.state.docInfo.doctorId,
                patientAge:this.state.content.Patient_age,
                patientSex:this.state.content.Patient_sex,
                visitData:JSON.stringify(this.state.content),
                visitNo:this.state.content.Visit_no,
                diseaseDescribe:this.state.detail,
                diagnosis:this.state.content.Diagnosis_desc,
                patientId: this.state.pat.patientId,
                patientWeight:this.state.content.Weight,
                userId:JSON.parse(window.localStorage.userInfo).id
            };
            // 枷锁，防止重复提交
            if(!this.state.islock){
                this.createOrder(params);
            }
        }else{
            this.setState({
                showIOS1:true,
                msg:'请输入病情描述,最少输入10个汉字'
            })
        }
    }
  
   /*创建订单*/
    createOrder(params) {
        this.setState({
            islock:true
        })
         this.showLoading();
         Api
            .applyDisease(params)
            .then((res) => {
                this.hideLoading();
                this.setState({
                    islock:false
                })
                if (res.code == 0) {
                    this.context.router.push({
                         pathname:'/consult/pay',
                         query:{source:'describe',detail:JSON.stringify(res.data)}
                    })
                }else{
                    this.setState({
                        showIOS1:true,
                        msg:e.msg
                    })
                }
            }, (e) => {
            this.hideLoading();
            this.setState({
                islock:false
            })
            window.scrollTo(0,0);
            console.log(e)
                   if(e.code==-2){
                    if(e.msg!=null&&e.msg!=''){
                        this.setState({
                            inquiryId:e.msg||'',
                            msg:'当前咨询完成后，才能对医生发起新的咨询',
                            showIOS3:true
                        })
                    
                   }
                }else{
                    this.setState({
                        showIOS1:true,
                        msg:e.msg
                    })
                }
                    
            }); 
            
    }
    onOpenChange=()=>{
        this.setState({ open: !this.state.open });
        console.log(this.state.open)
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
    saveContent(e){

        this.setState({
            detail: e.target.value
        })
        

    }


    render() {
        const {content,docList,showMore,codeUrl,doclistShow,policy,msg,callback,OSSAccessKeyId,open1,docInfo,cardList,consultList,imgArr,leftBindNum,
            selectName,isIos,sign,selectSex,selectBirthday,toptip,files,reportInfo,hasApply,pat}=this.state;
            console.log("open",this.state.open)
            const sidebar =(<div className="doclist">{ docList.map((item,index)=>{
                return(
                  <div className="doclist-item" key={index} onClick={()=>{
                      this.setState({
                          doclistShow:false,
                          docInfo:item,
                          open:false,
                      })
                  }}>
                       <div className="doclist-img">
                         <img className="doc-img" src={item.image} alt="医生头像"/>
                       </div>
                       <div className="doclist-cont">
                           <p className="name">{item.name}</p> 
                           <p className="level">{item.deptName} | {item.level}</p>
                           <p className="desc">{item.specialty}</p>
                       </div> 
                  </div>
                )
              
            })}</div>);
            return (
            <div className={`${doclistShow?'over-hidden':''} page-describe`}>
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
                    ></span>提交申请
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
               {this.state.open&&<Drawer
                className="my-drawer"
                style={{ minHeight: document.documentElement.clientHeight,zIndex:'100000' }}
                enableDragHandle
                sidebar={sidebar}
                position="right" 
                width='80%'
                dragToggleDistance={100}
                open={this.state.open}
                onOpenChange={this.onOpenChange}   
            > 
              <div>            </div>
            </Drawer>}
                {doclistShow&&<div className='modal' style={{zIndex:'1000'}}
                                  onClick={(e)=>{
                    this.setState({
                        doclistShow:false
                    })
                    }}>
                    <div className='modal-body-register'
                         onClick={(e)=>{
                        e.stopPropagation()
                        }}
                        >
                        <div className="doclist">
                          {docList.map((item,index)=>{
                              return(
                                <div className="doclist-item" key={index} onClick={()=>{
                                    this.setState({
                                        doclistShow:false
                                    })
                                }}>
                                     <div className="doclist-img">
                                       <img className="doc-img" src={item.circleImage} alt="医生头像"/>
                                     </div>
                                     <div className="doclist-cont">
                                         <p className="name">{item.name}</p> 
                                         <p className="level">{item.deptName} | {item.level}</p>
                                         <p className="desc">{item.specialty}</p>
                                     </div> 
                                </div>
                              )
                            
                          })}
                          <div className="loadMore" ref="wrapper"  ></div>
                           
                        </div>
                       
                       
                    </div>
                </div>}
                {!!toptip && <div className="hc-toptip">{toptip}</div>}
               
                {!!pat&&<div className="pat-info">
                   <div className="pat-items">
                       <p>姓名：{!!pat.patientName&&pat.patientName}</p>
                       <p>性别：{!!pat.patientSex&&pat.patientSex=='F'?'女':'男'}</p>
                       <p>年龄：{!!content.Patient_age&&content.Patient_age}</p>
                   </div>
                   <div className="pat-items">
                       <p>就诊卡：{pat.patCardNo}</p>
                   </div>
                </div>}
               
                <div className="des-doc-item" id="head" onClick={()=>{
                    this.setState({
                        open:true,
                        //doclistShow:true
                    })
                }}>
                    <div className="doc-info">
                        {docInfo.image && <img className="doc-img" src={docInfo.image&&docInfo.image.indexOf("ihoss")=='-1'?docInfo.image:docInfo.image+"?x-oss-process=image/resize,w_105"} alt="医生头像"/>}
                        {!docInfo.image &&
                        <img className="doc-img" src='../../../resources/images/doc.png' alt="医生头像"/>}
                        <div className="text2-box">
                            <div className="doc-name">{docInfo.name}  <span>  {docInfo.level}  </span></div>
                            <div className="doc-des">{docInfo.hisName} | {docInfo.deptName } </div>
                        </div>
                    </div> 
                    <img src='./././resources/images/des_xyjt.png' className='left_icon' />  
                </div> 

                <div className="describe-info">  
                     <div className="des_tip">
                      <img src="../../../resources/images/describe_tip_icon.png"/>
                        上次就诊
                     </div>
                    {!!content&&
                        <div className="describe-item" >
                        <div className="des-basic">
                                <div className="des">
                                    <p className="left">就诊时间：<span>{content.Visit_date}</span></p>
                                   
                                </div>
                                <div className="des">
                                    <p className="left">就诊科室：<span>{content.Dept_name}</span></p>
                                </div>  
                                <div className="des">
                                <p className="left">诊断：<span>{content.Diagnosis_desc}</span></p>
                                
                                </div>
                              
                            </div>
                            {content&&content.Recipel_list&&content.Recipel_list.length>0&&<div className='drug' onClick={()=>{
                                var list=content;
                                 list.showMore=!list.showMore;
                                this.setState({
                                    content:list
                                })
                            }}>
                                <div className="drug-tip">
                                <img src='./././resources/images/describe-icon.png'/>药品处方
                                </div>
                                <div className="drug-tab">
                                {!showMore&&<img src='./././resources/images/des_xyjt.png'/>}
                                {showMore&&<img src='./././resources/images/des_jt.png' style={{width:'18px',height:'10px'}} />}
                               
                                </div>
                            </div>}
                            {content.showMore&&<div className="more-info"> 
                                  <div className="drug-info">
                                    {content.Recipel_list.length>0&&content.Recipel_list.map((item1,index1)=>{
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
                                        <p className="left">医生：{content.Doctor} | {content.Doctor_duty}</p>
                                      
                                    </div>
            
                                </div>}
                        </div>
                    }
                </div>
                <div className="describe">
                    <div className="edit-title">
                    <img src='./././resources/images/describe_msbq.png'/>

                    病情描述</div>
                    <div className="edit-area">
                        <textarea
                            onChange={(e)=>{
                        this.saveContent(e)
                        }}
                            placeholder="请详细描述您的病情症状、持续时间、目前有无好转、以及想要获得医生什么帮助（最少输入10个汉字）">
                        </textarea>
                    </div>
                </div>
                {!this.state.open&&<div className="confirm" >
                    <p className='p1' onClick={()=>{
                        this.submitData()
                    }}>提交</p>
                  

                </div>}
                <div className="empty-box"></div>
            </div>
        );
    }
}
export default Connect()(Widget);
