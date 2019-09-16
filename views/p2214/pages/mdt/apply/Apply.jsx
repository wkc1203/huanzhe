
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

 class ApplicationComponent extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    
    constructor(props) {
        super(props);
        this.state = {
            patientShow:'Hi',
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
                        onClick: Utils.hideDialog.bind(this)
                    }
                ]
            },
            msg: '',
           
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
            success:false,
            currentDoctor:true,
            reason:'协商下一步诊治方案',//诊断目的
            diagnosis:'1.支气管炎；2.室间缺损；3.房间隔缺损；4.动脉导管末闭；5.心力衰竭（轻度）；6.肺动脉高压（中度）；7二尖瓣返流（轻-中度）            ',//主要诊断
            detail:'',//病情描述
            date:'',
            mdtDetail:'',
        };
    }
    componentWillUnmount(){
        

    }
    componentDidMount(){
        Utils.getJsByHide();
        if(sessionStorage.isApplyInfo==1){
             console.log()
            this.setState({
                ...JSON.parse(sessionStorage.applyInfo)
            })
        }else{
            this.getCardList();
        }
      

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
                         this.setState({
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
                                    selectBirthday: cardList[0].patientAge,
                                    selectPatientId: cardList[0].patientId
                                })
                            

                        }
                    }else{
                        this.hideLoading();
                    }
                }
            }, (e) => {
                this.hideLoading();
            });
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
   /* 提交申请 */
    submitData(){
        var mdtDetail=JSON.parse(this.props.location.query.mdtDetail);
        var imgList=!!sessionStorage.getItem('imgList')?JSON.parse(sessionStorage.getItem('imgList')):[];
        var docInfo={};
         for(var i=0;i<mdtDetail.mdtDoctorList.length;i++){
             if(mdtDetail.mdtDoctorList[i].type=='2'){
                 //领队
                docInfo=mdtDetail.mdtDoctorList[i];
             }
         }
         var img=[];
         for(var i=0;i<imgList.length;i++){
             if(imgList[i].img.length>0){
                 //有图片才加入
                var info={};
                var imgs=imgList[i].img;
                if(!imgList[i].type||imgList[i].type==''){
                 //未填写类型
                   this.setState({
                       showIOS1:true,
                       msg:'图片资料未填写完整'
                   })
                    return false;
                }
                info[imgList[i].type]=imgs;
                img.push(info)
             }
             
         }
         console.log(img,imgList);

         if(this.state.diagnosis==''){
             this.setState({
                 showIOS1:true,
                 msg:'请输入主要诊断'
             })
             return false;
         }
         if(this.state.reason==''){
            this.setState({
                showIOS1:true,
                msg:'请输入诊断目的'
            })
            return false;
        }
        console.log(mdtDetail)
        const param={
            hisId:'2214',
            patientId:this.state.selectPatientId,
            patientName:this.state.selectName,
            patientAge:this.state.selectBirthday,
            patientSex:this.state.selectSex,
            patientCardNo:this.state.patCardNo,
            patientDoctorId:docInfo.doctorId,
            patientDoctorName:docInfo.name,
            patientDoctorTitle:docInfo.title,
            mainDiagnosis:this.state.diagnosis,
            purpose:this.state.reason,
            teamId:mdtDetail.id,
            teamName:mdtDetail.name,
            amount:mdtDetail.price,
            supplement:this.state.detail,
            images:JSON.stringify(img),
        }
        Api
        .addMdt(param)
        .then((res) => {
             if(res.code==0){
                 this.showToast();
                   //清空session
                    sessionStorage.removeItem('imgList');
                    sessionStorage.removeItem('imgLength');
                    sessionStorage.removeItem('applyInfo');
             }
        }, (e) => {
  
        });
    }
    
   showToast() {
    console.log("hhhh")
    this.setState({showToast: true});
    console.log(this.state.showToast)
  
    this.state.toastTimer = setTimeout(()=> {
        this.setState({showToast: false});
        this.context.router.push({
            pathname:'/ordermng/orderlist',
            query:{busType:'mdt'}
        })
    }, 2000);
  }
    /*切换就诊人*/
    changePat(id) {
        var cardList = this.state.cardList.map(item => {
            item.active = item.patientId == id ? true : false;
            return item;
        });
        cardList.map(item => {
            if (item.active) {
                this.setState({
                    selectName: item.patientName,
                    patCardNo:item.patCardNo,
                    selectSex: item.patientSex == 'F' ? '女' : '男',
                    selectBirthday: item.patientAge,
                    selectPatientId: item.patientId
                })
            }
        });
        this.setState({
            cardList: cardList
        })
    }
    /* 显示选择就诊人 */
    selectPat(){
        this.setState({
            patientShow:true
        })
    }
    /* 确定就诊人 */
    surePat(){
        if(this.state.selectName!=''){
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
   
    
   
    render() {
        const {report,success,codeUrl,cardShow,patientShow,msg,callback,OSSAccessKeyId,open1,docInfo,cardList,consultList,imgArr,patCardNo,
            selectName,isIos,sign,selectSex,selectBirthday,detail,diagnosis,reason,imgList}=this.state;
            console.log(cardList)
        return (
           
            <div className="page-apply-info"> 
                <div className="home" id="home"><span className="jian"
                                            onClick={()=>{
                                              this.context.router.goBack()
                                      }}
                    ></span>会诊申请
                </div>
                <Toast icon="success-no-circle" show={this.state.showToast}>提交成功</Toast>
                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons}
                        show={this.state.showIOS1}>
                    {msg}
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
                               
                                }}
                                className={`pat-item ${item.active ? 'active-item' : ''}`}>
                                 <div className={`pat-name ${item.active ? 'active' : ''}`}>
                                   <text style={{fontSize:'10px'}}> {item.patientName}</text>
                                </div>
                                <div className="pat-more">
                                   <p>{item.patientSex=='M'?'男':'女'} | {item.patientAge}</p>
                                   <p>就诊卡：{item.patCardNo}</p>
                                </div>

                            </div>
                        )
                    })}
                    </div>
                        <button onClick={()=>{
                            this.surePat()
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
                {success&&<div className='modal'>
                       <div className="success-icon">
                         <img src="../../../resources/images/apply-tjcg.png" alt=""/>
                         <p>提交成功</p>
                       </div>
                </div>}
                <div className="apply-info">
                  <div className="apply-item" onClick={()=>{
                      this.selectPat()
                  }}>
                    <p className="apply-title">
                      <img src="../../../resources/images/apply-hzdx.png" alt=""/>
                      会诊对象
                    </p>
                    <div className="pat-info">
                     <img className='select-more' src="./././resources/images/des_xyjt.png" alt=""/>
                        <div className="left">
                            <span className="name">{selectName}</span>
                        </div>
                        <div className="right">
                           <p className="sex">
                              性别：{selectSex}
                           </p>
                           <p className="age">
                            年龄：{selectBirthday}
                           </p>
                           <p className="card">
                             就诊卡号：{patCardNo}
                           </p>
                        </div>
                    </div>
                  </div>
                  <div className="apply-item">
                    <p className="apply-title">
                      <img src="../../../resources/images/apply-zyzd.png" alt=""/>
                      主要诊断
                    </p>
                    <div className="pat-info">
                      <textarea name="" id="" cols="30" rows="10" value={diagnosis} onChange={(e)=>{
                        this.setState({
                            diagnosis:e.target.value
                        })
                    }}>
                      
                      </textarea>
                    </div>
                  </div>
                  <div className="apply-item">
                    <p className="apply-title">
                      <img src="../../../resources/images/apply-hzmd.png" alt=""/>
                      诊断目的
                    </p>
                    <div className="pat-info">
                      <textarea name="" id="" cols="30" value={reason} rows="10" onChange={(e)=>{
                        this.setState({
                            reason:e.target.value
                        })
                    }}>
                      </textarea>
                    </div>
                  </div>
                  {!patientShow&&<div className="apply-item">
                    <p className="apply-title">
                      <img src="../../../resources/images/apply-bqbcms.png" alt=""/>
                      病情补充描述（选填）
                    </p>
                    <div className="pat-info" style={{display:'block',padding:'10px 5px 0'}}>
                      <textarea name="" value={detail}
                       onChange={(e)=>{
                           this.setState({
                               detail:e.target.value
                           })
                       }}
                      placeholder='请对患者的病情进行补充描述' id="" cols="30" rows="10">
                      </textarea>
                      <p className="upload-img" onClick={()=>{
                        sessionStorage.setItem('applyInfo',JSON.stringify(this.state))
                        sessionStorage.setItem('isApplyInfo',0)
                          this.context.router.push({
                              pathname:'/mdt/upload'
                          })
                      }}>
                        <img src="../../../resources/images/apply-djsctp.png" alt=""/>
                            点击上传图片资料(已上传{!!sessionStorage.imgLength?sessionStorage.imgLength:0}张)
                        </p>
                    </div>
                    
                  </div>}
                </div>
                
                {<div className="btn">
                    <button className="submit-btn1"
                            onClick={
                            ()=>{
                            this.submitData()
                            }}
                        >
                        发送申请
                    </button>
                </div>}
                <div className="empty-box"></div>
            </div>
           
        );
    }
}

export default Connect()(ApplicationComponent);

