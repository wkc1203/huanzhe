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
            msg: '',
            consultList: [
                {reason: '咨询', id: 1},
                {reason: '复诊', id: 2},
                {reason: '报告解读', id: 3},
                {reason: '其他', id: 4},
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
        };
    }

    componentDidMount() {
        document.getElementById("head").scrollIntoView();

        this.getJs();
        this.getJs1();
        this.getCardList();

        this.setState({
            doctorId: this.props.location.query.doctorId,
            deptId: this.props.location.query.deptId,
            totalFee: this.props.location.query.totalFee,
        })
        this.getDocDetail(this.props.location.query.doctorId, this.props.location.query.deptId);
    }
    componentWillUnmount() {
        clearInterval(interval1);
    }

    randomName() {
        if (this.state.open) {
            var myDate = new Date();
            var ossPath = 'PIC/';
            var year = myDate.getFullYear();
            var month;
            var day;
            if (myDate.getMonth() + 1 < 10) {
                var m = myDate.getMonth() + 1;
                month = '0' + m;
            } else {
                month = myDate.getMonth() + 1;
            }
            if (myDate.getDate() < 10) {
                var d = myDate.getDate() + 1;
                day = '0' + d;
            } else {
                day = myDate.getDate();
            }
            var date = new Date().getTime();
            var m = ossPath + year + '/' + month + '/' + day + '/' + date + '/';
            uuList[0] = m;
            return m;
        }
    }
    S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    guid() {
        var m=this.S4()+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+this.S4()+this.S4();
        nameList[0]=m;
        return m;
    }
    getJs() {
        console.log(window.location.href.substring(0,window.location.href.indexOf("#")-1))
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
        this.setState({
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            showAndroid2: false,
        });
    }

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
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })
            });
    }

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
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })
            });
    }

    getDocDetail(doctorId, deptId) {
        Api
            .getDocDetail({doctorId: doctorId, deptId: deptId})
            .then((res) => {
                if (res.code == 0 && res.data != null) {
                    this.setState({docInfo: res.data.doctor});
                }

            }, (e) => {
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })
            });
    }
validate(){
    var datas = [];
    var m2=[];
    var m=0;
        if(upload){
            interval1 = setInterval(() =>{
                if(upload){
                    for(var i=0;i<imgList.length;i++){
                        if(this.validateImage(imgList[i])){
                            console.log("e",imgList.length)
                            console.log(i,imgList[i]);
                            datas.push(imgList[i]);
                            if(i<=4){
                                m2.push(imgList[i]);
                                m++;
                            }
                            continue;
                        }else{
                            console.log('n')
                        }

                        console.log("在要"+i)
                    }
                    console.log(imgList,m2,this.state.imgArr)
                    console.log(m2.length,maxLength,has)
                    if(m2.length==m&&m!=0){
                        console.log("yes",m2.length,m)
                        clearInterval(interval1);
                        this.hideLoading();
                        this.setState({
                            imgArr: m2,
                        })
                        upload=false;


                    }
                }

            } , 2000);

        }





}
    handleChange = (info) => {
        console.log("in");
        imgList.push('https://ihoss.oss-cn-beijing.aliyuncs.com/' + uuList[0] + info.file.name);
        maxLength=imgList.length;
        this.showLoading('上传中');
        console.log("upl",maxLength);
        upload=true;
         this.validate(imgList);
    }
    validateImage(pathImg)
    {
        var ImgObj=new Image();
        ImgObj.src= pathImg;
        if(ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0))
        {  has=has+1;
            console.log("true",ImgObj.width)
            return true;
        } else {
            console.log("false");
            return false;
        }
    }

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

    createOrder(params) {
        Api
            .createOrder(params)
            .then((res) => {
                if (res.code == 0) {
                    imgList=[];
                    var replaceUrl="https://tih.cqkqinfo.com/views/p099/#/consult/pay?orderId="+res.data.orderId+"&totalFee="+
                        this.state.totalFee+"&inquiryId="+res.data.id;
                              console.log(replaceUrl)
                   top.window.location.replace(replaceUrl);
                }
            }, (e) => {

                this.setState({
                    msg: e.msg,
                    showIOS1: true
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
    isRegister() {
        this.showLoading();
        Api
            .isRegister()
            .then((res) => {
                if (res.code == 0) {
                    Api
                        .getCardList1()
                        .then((res) => {
                            this.hideLoading();
                            if (res.data.length > 0) {
                                hashHistory.push({
                                    pathname: 'usercenter/samecard',
                                    query: {
                                        left: this.state.leftBindNum,
                                    }
                                })
                            } else {
                                hashHistory.push({
                                    pathname: 'usercenter/addcard',
                                    query: {
                                        type: 0,
                                    }
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
            }, (e) => {
                this.hideLoading();
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })
            });
    }

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
    saveContent(e) {
        this.setState({
            content: e.target.value
        })
    }
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
        this.setState({
            fileList:[]
        })
        if(this.state.imgArr.length>=4){
            this.setState({
                open1:true
            })
        }else{
            this.setState({
                open1:false
            })
        }

    }

    imgShow(file){
        this.handleUpload(file)
    }
    handleUpload(file){
        const formData = new FormData();
        var filename='';
        var image=[];
        console.log("fii",file)

        filename=this.randomName() + this.guid()+file.name.substring(file.name.indexOf("."),file.name.length)
        formData.append('key', filename);
        formData.append("policy",this.state.sign.policy);
        formData.append("callback",this.state.sign.callback);
        formData.append("signature",this.state.sign.signature);
        formData.append("OSSAccessKeyId",this.state.sign.OSSAccessKeyId);
        formData.append('file', file);


        console.log(formData)
        this.setState({
            uploading: true,
        });
        $.ajax({
            url: 'https://ihoss.oss-cn-beijing.aliyuncs.com',
            method: 'POST',
            processData: false,
            contentType: false,
            cache: false,
            data: formData,
            success: (e) => {
                imgArr1=this.state.imgArr;
                imgArr1.push('https://ihoss.oss-cn-beijing.aliyuncs.com/'+filename);
                success.push(file.uid)
                for(var i=0;i<imgArr1.length;i++){
                    if(i<=4){
                        image.push(imgArr1[i])
                    }
                }
                this.setState({
                    uploading: false,
                });
                this.hideLoading();
                this.setState({
                    imgArr:image
                })
                if (this.state.imgArr.length >=5) {
                    this.setState({
                        open1: true
                    })

                }
                console.log("this.sate",this.state.imgArr)
            },

            error:(e) =>{
                console.log("this.sate",this.state.imgArr)
            }
        });
    }
    render() {
        const {signature,policy,msg,callback,OSSAccessKeyId,open1,docInfo,cardList,consultList,imgArr,leftBindNum,
            selectName,sign,selectSex,selectBirthday,toptip}=this.state;
        const props = {
            multiple:true,
            beforeUpload: (file) => {
                this.showLoading('上传中');
                this.setState(({ fileList }) => ({
                    fileList: [...fileList, file],

                }));
                this.imgShow(file);
                return false;
            },
            fileList: this.state.fileList,
        };
        return (
            <div className="page-confirm-info">

                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons}
                        show={this.state.showIOS1}>
                    {msg}
                </Dialog>
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
                                                    this.isRegister()

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
                                    <Upload disabled={open1}
                                        {...props} >
                                        <div onClick={(e)=>{
                                                  this.alertTxt(e)
                                                }}>
                                            <img src="../../../resources/images/add-img.png"/>
                                        </div>
                                    </Upload>
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
                                <div>添加图片</div>
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
