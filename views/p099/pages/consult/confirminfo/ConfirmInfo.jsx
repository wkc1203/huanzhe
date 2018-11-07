import React, { Component } from 'react';
import { Link } from 'react-router';
import {Upload, Icon, Modal,Button } from 'antd';
import {  Toptips,Switch,Dialog,Toast } from 'react-weui';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import hashHistory from 'react-router/lib/hashHistory';

import * as Api from './confirmInfoApi';
import 'style/index.scss';
var imgArrs=[];
var uuList=[];
var maxLength=0;
var imgList=[];
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
        hid:false,
        showToast: false,
        showLoading: false,
        toastTimer: null,
        loadingTimer: null,
        showIOS1: false,
        showIOS2: false,
        showAndroid1: false,
        showAndroid2: false,
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
                    label: '取消',
                    onClick: this.hideDialog.bind(this)
                },
                {
                    type: 'primary',
                    label: '确定',
                    onClick: this.hideDialog.bind(this)
                }
            ]
        },
        msg:'',
        consultList: [
            {reason: '咨询', id: 1},
            {reason: '复诊', id: 2},
            {reason: '报告解读', id: 3},
            {reason: '其他', id: 4},
        ],
        imgArr: [],
        leftBindNum: 5,
        totalFee: 0,
        selectName: '',
        pics:'',
        selectSex: '',
        selectBirthday: '',
        selectPatientId: '',
        showTip:false,
        toptip: '',
        isUploadAll: false,
        suffix:'',
        policy:"",
        callback:"",
        OSSAccessKeyId:"",
        key:"",
        name:"",
        sign:{},
        fileList:[],
        uploading: false,
        formData:{},
        open:false,
    };
  }

  componentDidMount() {

      this.getJs();
      this.getJs1();
      this.randomName();
      //this.getJs();
      console.log("this.props.location",window.location.href)
      this.getCardList();
      this.setState({
              doctorId:this.props.location.query.doctorId,
              deptId:this.props.location.query.deptId,
              totalFee:this.props.location.query.totalFee,
      })
      this.getDocDetail(this.props.location.query.doctorId, this.props.location.query.deptId);
  }
    getUuid() {
        if(this.state.open){
            var len = 32;//32长度
            var radix = 16;//16进制
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = [], i;
            radix = radix || chars.length;
            if(len) {
                for(i = 0; i < len; i++)uuid[i] = chars[0 | Math.random() * radix];
            } else {
                var r;
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';
                for(i = 0; i < 36; i++) {
                    if(!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }
            uuList.push(uuid.join(''))
            return uuid.join('');
        }else{
            return false;
        }

    }
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
        this.setState({
            key:ossPath+year+'/'+month+'/'+day
        })


    }
    getJs(){

        Api
            .getJsApiConfig({url:'https://tih.cqkqinfo.com/views/p099/'})
            .then((res) => {
                console.log(res);
                if(res.code==0){
                    //写入b字段
                    console.log("str",res.data);
                    wx.config({
                        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId:res.data.appId, // 必填，公众号的唯一标识
                        timestamp:res.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr:res.data.noncestr, // 必填，生成签名的随机串
                        signature:res.data.signature,// 必填，签名
                        jsApiList: ['hideMenuItems','showMenuItems','previewImage','uploadImage','downloadImage'] // 必填，需要使用的JS接口列表
                    });
                    wx.ready(function(){
                        //批量隐藏功能
                        wx.hideMenuItems({
                            menuList: ["menuItem:share:QZone","menuItem:share:facebook","menuItem:favorite","menuItem:share:weiboApp","menuItem:share:qq","menuItem:share:timeline","menuItem:share:appMessage","menuItem:copyUrl", "menuItem:openWithSafari","menuItem:openWithQQBrowser"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                        });
                    });

                }


                //this.setState({ hospInfo: res.data });
            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
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
        console.log(this.state);
        this.setState({
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            showAndroid2: false,
        });
    }
    getJs1(){

        /*Api
         .getJsApiConfig({url:'https://tih.cqkqinfo.com/views/p099/'})
         .then((res) => {
         console.log(res);
         if(res.code==0){
         //写入b字段
         console.log("str",res.data);
         wx.config({
         debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
         appId:res.data.appId, // 必填，公众号的唯一标识
         timestamp:res.data.timestamp, // 必填，生成签名的时间戳
         nonceStr:res.data.noncestr, // 必填，生成签名的随机串
         signature:res.data.signature,// 必填，签名
         jsApiList: ['chooseImage','uploadImage','downloadImage'] // 必填，需要使用的JS接口列表
         });
         }


         //this.setState({ hospInfo: res.data });
         }, (e) => {
         this.hideLoading();
         alert("r"+JSON.stringify(e));
         //this.showPopup({ content: e.msg });
         });
         */
        Api
            .getSign({bucket:'ihoss',dir:"PIC"})
            .then((res) => {
                if(res.code==0){
                    this.hideLoading();
                    var sign={

                    };
                    this.setState({
                        name:new Date().getTime()+".png",
                        signature:res.data.sign,
                        policy:res.data.policy,
                        callback:res.data.callback,
                        OSSAccessKeyId:res.data.accessId,
                        key:this.state.key,
                    })
                    /* host=res.data.host;
                     policy=res.data.policy;
                     sign1=res.data.sign;
                     dir=res.data.dir;
                     accessid=res.data.accessId;
                     var files = document.getElementById("input1").files;
                     console.log("files",files);*/

                }

            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });

    }
     getCardList() {
         Api
             .getCardList()
             .then((res) => {
                 if (res.code == 0){
                     this.setState({
                         leftBindNum:res.data.leftBindNum
                     })
                     if (res.data.cardList.length > 0) {
                         var cardList=res.data.cardList;
                         cardList[0].active=true;
                         this.setState({
                             leftBindNum:res.data.leftBindNum,
                             cardList:cardList,
                             selectName:cardList[0].patientName,
                             selectSex:cardList[0].patientSex == 'M' ? '男' : '女',
                             selectBirthday:cardList[0].birthday,
                             selectPatientId:cardList[0].patientId
                         })

                         }
                 }

             }, (e) => {
                 this.setState({
                     msg:e.msg,
                     showIOS1:true
                 })
             });
    }
    getDocDetail(doctorId, deptId) {
        Api
            .getDocDetail({ doctorId:doctorId, deptId:deptId })
            .then((res) => {
                if (res.code == 0 && res.data != null) {
                    this.setState({ docInfo: res.data.doctor });
                }

            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });
    }
    handleChange = (info) => {

        if(info.fileList.length>maxLength){
            maxLength=info.fileList.length;
        }
        for(var i=0;i<info.fileList.length;i++){


            if(imgList.length==0) {
                imgList.push(info.fileList[i].uid);
            }else{
                console.log("i",info.fileList[i].uid);
                console.log("j",imgList[j]);
                console.log("ji",info.fileList);
                console.log("jj",imgList);

                for(var j=0;j<imgList.length;j++){
                    if(info.fileList[i].uid!=imgList[j]){
                        imgList.push(info.fileList[i].uid);
                    }
                }
            }

        }
        console.log("ll",imgList.length);
        for(var i=0;i<=uuList.length-1;i++){
            //imgList.push('https://ihoss.oss-cn-beijing.aliyuncs.com/'+this.state.key+'/'+uuList[i]+'.png')
            imgArrs.push('https://ihoss.oss-cn-beijing.aliyuncs.com/'+this.state.key+'/'+uuList[i]+'.png');
        }

        let fileList = info.fileList;
        console.log("img",info.fileList.length);
        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-2);

        // 2. Read from response and show file link
        fileList = fileList.map((file) => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.url;
            }
            return file;
        });

        // 3. Filter successfully uploaded files according to response from server
        fileList = fileList.filter((file) => {
            if (file.response) {
                return file.response.status === 'success';
            }
            return true;
        });
        console.log("fileList",fileList);
        var s=this.uniq(imgArrs);

        var ll=this.uniq(imgList);

        var imgs=[];
        if(ll.length>4){
            for(var i=0;i<=3;i++){
                if(s[i]!=null){
                    imgs[i]=s[i]
                }

            }
        }else{
            for(var i=0;i<=ll.length-1;i++){
                if(s[i]!=null){
                    imgs[i]=s[i]
                }

            }
        }
       console.log("imgs",imgs);
        var u=setTimeout(()=>{
            this.setState({
                imgArr:imgs
            })
        },500);
        this.setState({ fileList });





    }
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
   /* getConsultDet(orderId) {
        const getConsultDetRes = await Api.getConsultDet({
            orderId
        });
        if (getConsultDetRes.code == 0 && getConsultDetRes.data != null) {
            this.orderInfo = getConsultDetRes.data;
            this.getLeftTime(getConsultDetRes.data.leftPayTime || 0);
            this.$apply();
        }
    }*/
    submitData() {

        let errMsg = !this.state.selectPatientId
            ? '请选择就诊人'
            : !this.state.consultationReason
            ? '请选择就诊目的'
            : !this.state.content
            ? '病情描述不能为空'
            : this.state.content.length <= 10 ? '病情描述不能低于10个字' : '';
        console.log("err",this.state.selectPatientId,this.state.consultationReason,this.state.content);
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
        const imgArr2 =this.uniq(this.state.imgArr);
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

            var pics='';
            if(imgArr2.length>1){

                for(var i=0;i<imgArr2.length;i++){
                    if(i!=imgArr2.length-1){
                        pics=pics+imgArr2[i]+',';
                    }else{
                        pics=pics+imgArr2[i];
                    }

                }
            }else{
                pics=imgArr2[0];
            }
            console.log("pics",imgArrs.length,pics);
            this.setState({
                pics:pics
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
     createOrder(params) {

         Api
             .createOrder(params)
             .then((res) => {
                 if (res.code == 0) {
                     hashHistory.push({
                    pathname:'consult/pay',
                    query:{
                        orderId:res.data.orderId,
                        totalFee:this.state.totalFee,
                        inquiryId:res.data.id
                    }
                 })
                 }

             }, (e) => {

                 this.setState({
                     msg:e.msg,
                     showIOS1:true
                 })
             });
        }
    changePat(id) {
        var cardList = this.state.cardList.map(item => {
            item.active = item.patientId == id ? true : false;
            return item;
        });
        cardList.map(item => {
            if (item.active) {
                this.setState({
                    selectName:item.patientName,
                    selectSex:item.patientSex == 'F' ? '女' : '男',
                    selectBirthday:item.birthday,
                    selectPatientId:item.patientId
                })
            }
        });
        this.setState({
            cardList:cardList
        })

    }
     isRegister() {
         Api
             .isRegister()
             .then((res) => {
                 if (res.code == 0) {
                       Api
                           .getCardList1()
                           .then((res) => {
                                   if(res.data.length > 0){
                                       hashHistory.push({
                                           pathname:'usercenter/samecard',
                                           query:{
                                               left:this.state.leftBindNum,

                                           }
                                       })

                                   }else{
                                       hashHistory.push({
                                           pathname:'usercenter/addcard',
                                           query:{
                                               type:0,
                                           }
                                       })
                                   }
                           }, (e) => {

                               this.showPopup({ content: e.msg });
                           });

                 }
             }, (e) => {

                 this.setState({
                     msg:e.msg,
                     showIOS1:true
                 })
             });
    }
    changeStatus(id) {

          if(this.state.consultList){

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
                  consultationReason:consultationReason,
                  consultList:consultList
              })
          }


    }
    async chooseImg() {
    /*    wx.ready(function(){
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        });*/
        wx.getLocalImgData({
            localId: '', // 图片的localID
            success: function (res) {
                var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                console.log("lo",localData);
            }
        });
        /*let imgArr = this.imgArr;
        if (imgArr.length >= 4) {
            wepy.showToast({
                title: `一次最多只能上传四张图片`,
                icon: 'none',
                duration: 2000
            });

            return;
        }
        const chooseRes = await wepy.chooseImage({
            count: 4, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'] // 可以指定来源是相册还是相机，默认二者都有
        });
        if (chooseRes.errMsg == 'chooseImage:ok') {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            const tempFilePaths = chooseRes.tempFilePaths;
            imgArr = tempFilePaths.concat(imgArr);
            if(imgArr.length > 4){
                await wepy.showToast({
                    title: `一次最多只能上传四张图片`,
                    icon: 'none',
                    duration: 2000
                });
                return;
            }
            this.imgArr = imgArr;
            this.$apply();
        }*/
    }
    previewImg(e) {
        var arr = [];
        this.imgArr.map(item => {
            arr.push(item);
        });
        var imgUrl = e.currentTarget.dataset.preurl;
        wepy.previewImage({
            current: imgUrl, // 当前显示图片的http链接
            urls: arr // 需要预览的图片http链接列表
        });
    }
    saveContent(e) {
        this.setState({
            content:e.target.value
        })
    }
    deleteImg(e) {
        var imgArr = this.imgArr;
        for (var i = imgArr.length - 1; i >= 0; i--) {
            if (imgArr[i] == e.currentTarget.dataset.url) {
                imgArr.splice(i, 1);
            }
        }
        this.imgArr = imgArr;
    }
    uniq(array){
        var temp = [];
        for(var i = 0; i < array.length; i++) {
            //如果当前数组的第i项在当前数组中第一次出现的位置是i，才存入数组；否则代表是重复的
            if(array.indexOf(array[i]) == i){
                temp.push(array[i])
            }
        }
        return temp;
    }
    render() {
    const {signature,policy,msg,callback,OSSAccessKeyId,key,open,consultationReason,content,upLoadImg,doctorId,docInfo,cardList,hid,consultList,imgArr,leftBindNum,totalFee,selectName,pics,selectSex,selectBirthday,selectPatientId,showTip,toptip,isUploadAll}=this.state;
        const props = {
            action: 'https://ihoss.oss-cn-beijing.aliyuncs.com',
            onChange: this.handleChange,
            multiple: true,
            data:{signature:signature,
                policy:policy,
                callback:callback,
                OSSAccessKeyId:OSSAccessKeyId,
                key:key+"/"+this.getUuid()+".png"}

        };
     return (
        <div className="page-confirm-info">
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
            {!!toptip&&<div className="hc-toptip" >{toptip}</div>}

            <div className="doc-item" >
                <div className="doc-info">
                    {docInfo.image&&<img className="doc-img" src={docInfo.image} alt="医生头像" />}
                    {!docInfo.image&&<img className="doc-img" src='../../../resources/images/doc.png' alt="医生头像" />}
                    <div className="text2-box">
                        <div className="doc-name">{docInfo.name}</div>
                        <div className="doc-des">{docInfo.hisName}</div>
                        <div className="doc-des">{docInfo.deptName } | {docInfo.level}</div>
                    </div>
                </div>
            </div>
            <div className="pat-box">
                <div className="pat-title">请选择就诊人
                    {cardList.length>0&&<span >（{selectName} | {selectSex} | {selectBirthday}）</span>}
                </div>
                <div className="item-box1">
                    {cardList&&cardList.map((item,index)=>{
                        return(
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

                    {leftBindNum>0&&<div className="pat-img"
                         onClick={
                                  ()=>{
                                 this.isRegister()

                                  }}>
                        <img src="../../../resources/images/plus.png" />
                    </div>}
                </div>
            </div>
            <div className="reason">
                <div className="reason-title">本次咨询目的</div>
                <div className="item-box1">
                    { consultList&&consultList.map((item,index)=>{
                        return(
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
                                <div className="img-item" >
                                    <Upload
                                        {...props} fileList={this.state.fileList}>
                                        <div onClick={()=>{
                                        this.setState({
                                          open:true
                                        })

                                        }}>
                                            <img src="../../../resources/images/add-img.png" />
                                        </div>
                                    </Upload>
                                </div>
                            </div>
                            {imgArr&&imgArr.map((item,index)=>{
                               return(
                                   <div className='img-box'
                                        key={index}
                              >
                                       <div className='img-add'
                                            onClick={
                                  ()=>{
                                 this.previewImg(item)

                                  }}>
                                           <icon
                                               onClick={
                                  ()=>{
                                 this.deleteImg()

                                  }}
                                    type="clear" size="20" color='red' />

                                           <div>
                                               <img src={item}/>
                                           </div>
                                       </div>
                                   </div>
                               )

                            })}
                            {imgArr.length <= 0&&<div className="explain">
                                <div>添加图片</div>
                                <div>病症部位、检查报告或其他病情资料(最多可上传4张)</div>
                            </div>}
                        </div>
                </div>
            </div>
            <div className="btn">
                <button  className="submit-btn1"
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
