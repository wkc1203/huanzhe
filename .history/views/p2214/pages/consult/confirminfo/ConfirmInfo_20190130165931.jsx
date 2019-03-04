import React, { Component } from 'react';
import { Link } from 'react-router';
import {Upload, Modal,Button,Spin, Alert } from 'antd';
import {  Toptips,Switch,Dialog,Toast,Icon } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import hashHistory from 'react-router/lib/hashHistory';
import * as Api from './confirmInfoApi';
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
            showAndroid1: false,
            showAndroid2: false,
            cardShow:false,
            codeUrl:'',
            style1: {
                buttons: [
                    {
                        label: '确定',
                        onClick: this.hideDialog.bind(this)
                    }
                ]
            },
            style2: {
                title: '添加就诊人',
                buttons: [
                    {
                        type: 'primary',
                        label: '已有就诊卡',
                        onClick: this.isAdd.bind(this)
                    },
                    {
                        type: 'primary',
                        label: '申请就诊卡',
                        onClick: this.goMain.bind(this)
                    }
                ]
            },
            msg: '',
            consultList: [
                {reason: '咨询', id: 1},
                {reason: '复诊', id: 2},
                {reason: '报告解读', id: 3},
                {reason: '加号', id: 4},
                {reason: '其他', id: 5},
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
            name: "",
            fileList: [],
            uploading: false,
            formData: {},
            open: false,
            open1: false,
            cardType:1,
            cardNo:'0014492503',
        };
    }

    componentDidMount() {
        document.getElementById("home").scrollIntoView();
          this.getJs();
        this.getJs1();
        //判断是否是从儿童医院公众号添加卡进入该页面
        if(this.props.location.query.cardType==1&&this.props.location.query.cardNo!=''){
            this.showLoading();
          //  this.syncUser(this.props.location.query.cardNo);
        }
        this.getCardList();

        this.setState({
            doctorId: this.props.location.query.doctorId,
            deptId: this.props.location.query.deptId,
            totalFee: this.props.location.query.totalFee,
        })
        this.getDocDetail(this.props.location.query.doctorId, this.props.location.query.deptId);
        var that=this;
        document.addEventListener('click',function(e){

            console.log( e.target.className);
            if(e.target.className=='weui-mask'){
                that.setState({
                    showIOS2:false
                })
            }
        });

    }
    componentWillUnmount() {
         this.setState({
            imgArr:[]
         })
        clearInterval(interval1);
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
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
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
    getJs() {
        Api
            .getJsApiConfig({url:location.href.split('#')[0]})
            .then((res) => {
                if (res.code == 0) {
//写入b字段
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: res.data.appId, // 必填，公众号的唯一标识
                        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: res.data.noncestr, // 必填，生成签名的随机串
                        signature: res.data.signature,// 必填，签名
                        jsApiList: ['chooseImage','getLocalImgData','hideMenuItems', 'showMenuItems','previewImage','uploadImage','downloadImage'] // 必填，需要使用的JS接口列表
                    });
                    wx.ready(function () {
//批量隐藏功能
                        wx.hideMenuItems({
                            menuList: ["menuItem:share:QZone", "menuItem:share:facebook", "menuItem:favorite", "menuItem:share:weiboApp", "menuItem:share:qq", "menuItem:share:timeline", "menuItem:share:appMessage", "menuItem:copyUrl", "menuItem:openWithSafari", "menuItem:openWithQQBrowser"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                        });
                    });
                }
            }, (e) => {

            });
    }
   /*显示toast*/
    showToast() {
        this.setState({showToast: true});
        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
    }
   /*显示loading*/
    showLoading() {
        this.setState({showLoading: true});
        this.state.loadingTimer = setTimeout(()=> {
            this.setState({showLoading: false});
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
   /*提示*/
    hideDialog() {
        this.setState({
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            showAndroid2: false,
        });
    }
    addCard(){

        Api
            .getOpenId({openId: window.localStorage.getItem('openId')})
            .then((res) => {
                if (res.code == 0) {
                    if (res.data.subscribe == 0) {
                        //if(window.localStorage.getItem('times')>=1) {
                          //  this.setState({
                           //     showIOS2: true
                           // })
                       // }else{
                            this.setState({
                                cardShow: true
                            })
                          //  var storage = window.localStorage;
                            //加入缓存
                           // storage.times = window.localStorage.getItem('times') + 1 || 1;
                            Api
                                .getCode({
                                    url: window.location.href
                                })
                                .then((res) => {
                                    if (res.code == 0) {
                                        this.setState({
                                            codeUrl: res.data.url
                                        })
                                        console.log(res)
                                    }
                                }, (e) => {
                                });
                      //  }
                    } else {
                        this.isRegister();
                    }
                    console.log(res.code)
                }
            }, (e) => {
                console.log(e)
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
                    this.setState({
                        sign:sign,
                        expire:res.data.expire
                    })
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
                        this.setState({
                            leftBindNum: res.data.leftBindNum,
                            cardList: cardList,
                            selectName: cardList[0].patientName,
                            selectSex: cardList[0].patientSex == 'M' ? '男' : '女',
                            selectBirthday: cardList[0].birthday,
                            selectPatientId: cardList[0].patientId
                        })
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
                    this.setState({docInfo: res.data.doctor});
                }

            }, (e) => {

            });
    }
   /*倒计时*/
    getLeftTime(time = 0) {
        if (time <= 0) {
            this.state.leftTimer && clearInterval(this.state.leftTimer);
            this.setState({
                leftTimeFlag: false,
                leftTime: '00:00',
            })
            return;
        }
        const minute = `00${Math.floor(time / 60)}`.substr(-2);
        const second = `00${Math.floor(time % 60)}`.substr(-2);
        this.setState({
            leftTimeFlag: true,
            leftTime: `${minute}:${second}`,
        })
        var leftTimer = this.state.leftTimer;
        leftTimer = setTimeout(() => {
            this.getLeftTime(--time);
        }, 1000);
        this.setState({
            leftTimer: leftTimer
        })
    }
    /*提示信息*/
    submitData() {
        let errMsg = !this.state.selectPatientId
            ? '请选择就诊人'
            : !this.state.consultationReason
            ? '请选择就诊目的'
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
                totalFee: this.state.totalFee,
                type: '1',
                pics: '',
                patientName: this.state.selectName,
                content: this.state.content,
                patientId: this.state.selectPatientId,
                purpose: this.state.consultationReason,
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
                totalFee: this.state.totalFee,
                type: '1',
                pics: pics,
                patientName: this.state.selectName,
                content: this.state.content,
                patientId: this.state.selectPatientId,
                purpose: this.state.consultationReason,
            };
            this.createOrder(params);
        }
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
                        this.state.totalFee+"&inquiryId="+res.data.id;
                              console.log(replaceUrl)
                   top.window.location.replace(replaceUrl);
                }else{
                    this.hideLoading();
                    this.setState({
                        msg: res.msg,
                        showIOS1: true
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
                    selectSex: item.patientSex == 'F' ? '女' : '男',
                    selectBirthday: item.birthday,
                    selectPatientId: item.patientId
                })
            }
        });
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
                               // this.context.router.push({
                                   // pathname:'usercenter/samecard',
                                   // query:{
                                      //  left:this.state.leftBindNum,
                                    //    type:3,
                                  //  }
                                //})
                                this.goMain();
                            }else{
                               this.goMain();
                            }
                        }, (e) => {

                            this.hideLoading();
                            this.setState({
                                msg:e.msg,
                                showIOS1:true
                            })
                        });

                }
            }, (e) => {
                this.hideLoading();
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
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
            consultList.map(item => {
                if (item.active) {
                    consultationReason = item.reason;
                }
            });
            this.setState({
                consultationReason: consultationReason,
                consultList: consultList
            })
        }
    }
    /*放大图片*/
    previewImg(url) {
        event.stopPropagation();
        event.preventDefault();
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
            this.setState({
                open:true
            })
            this.setState({
                open1:false
            })
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
        this.setState({
            imgArr: s1
        });
    }

    base64ToBlob(urlData) {

        var arr = urlData.split(',');
        var ua = navigator.userAgent.toLowerCase();//获取浏览器的userAgent,并转化为小写——注：userAgent是用户可以修改的
        var isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);//判断是否是苹果手机，是则是true
        var  mime ='';
        var bytes;

        if(isIos){
            mime = arr[0].match(/:(.*?);/)[1] || 'image/png';
            bytes = window.atob(arr[1]);
        }else{
            mime='image/png';
            bytes = window.atob(urlData);
        }

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

    that.setState({
    msg:'一次最多只能上传四张图片',
    showIOS1:true,
    })
}else{
    wx.ready(function () {
        wx.chooseImage({
            count: 4, // 默认9
            sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                alert(JSON.stringify(res))
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
                        if (ua.match(/iphone/i) == "micromessenger") {
                               var ios = true;
                        } else {
                                var ios = false;
                        };
                        if (ios || window.__wxjs_is_wkwebview) {
                            wx.getLocalImgData({
                                localId: localIds[i], // 图片的localID
                                success: function (res) {
                                    var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
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
                                    var filename=that.randomName()+uuid+'.png';
    
                                    formData.append('key',filename);
                                    formData.append("policy",sign.policy);
                                    formData.append("callback",sign.callback);
                                    formData.append("signature",sign.signature);
                                    formData.append("OSSAccessKeyId",sign.OSSAccessKeyId);
                                    formData.append('file', that.base64ToBlob(localData));
                                   
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
                        }else{
                            alert("eelse")
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
                            var filename=that.randomName()+uuid+'.png';

                            formData.append('key',filename);
                            formData.append("policy",sign.policy);
                            formData.append("callback",sign.callback);
                            formData.append("signature",sign.signature);
                            formData.append("OSSAccessKeyId",sign.OSSAccessKeyId);
                            formData.append('file', that.base64ToBlob(localIds[i]));
                           
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
                        
                    }
                }


            },
            error:(res)=>{
              alert(JSON.stringify(res))
            }


        });

    });

}


}
    render() {
        const {signature,codeUrl,cardShow,policy,msg,callback,OSSAccessKeyId,open1,docInfo,cardList,consultList,imgArr,leftBindNum,
            selectName,sign,selectSex,selectBirthday,toptip}=this.state;

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
                    ></span>图文咨询
                </div>
                <Toast icon="success-no-circle" show={this.state.showToast}>一次最多只能上传四张图片</Toast>
                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons}
                        show={this.state.showIOS1}>
                    {msg}
                </Dialog>
                <Dialog type="ios" title={this.state.style2.title} buttons={this.state.style2.buttons} show={this.state.showIOS2}>
                </Dialog>
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
                        {docInfo.image && <img className="doc-img" src={docInfo.image} alt="医生头像"/>}
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
                <div className="reason">
                    <div className="reason-title">本次咨询目的</div>
                    <div className="item-box1">
                        { consultList && consultList.map((item, index)=> {
                            return (
                                <div
                                    key={index}
                                    onClick={
                                            ()=>{
                                            this.changeStatus(item.id)
                                            }}
                                    className={`reason-item ${item.active ? 'active' : ''}`}>{item.reason}</div>
                            )
                        })
                        }
                        <div className="reason-item f-bg-gray">预约手术</div>
                        <div className="reason-item f-bg-gray">预约检查</div>
                        <div className="reason-item f-bg-gray">在线开处方</div>
                    </div>
                </div>
                <div className="describe">
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
                                        <div onClick={(e)=>{
                                                   this.choose(this.state.sign)
                                                }}>
                                            <img src="../../../resources/images/add-img.png"/>
                                        </div>
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
                                                <img src={item}
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
                </div>
                <div className="btn">
                    <button className="submit-btn1"
                            onClick={
                            ()=>{
                            this.submitData()
                            }}
                        >
                        提交
                    </button>
                </div>
                <div className="empty-box"></div>
            </div>
        );
    }
}

export default Connect()(Widget);
