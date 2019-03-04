import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import { Link } from 'react-router';
import { ImagePicker } from 'antd-mobile';
import { Input,Upload,Anchor,Icon, Modal} from 'antd';
const { TextArea } = Input;

import * as Api from './chatIndexApi';
import './style/index.scss';
var interval = '';
var interval1 = '';
var interval2='';
var upload=true;
var uuList = [];
var maxLength=0;
var nameList=[];
var success=[];
var imgList = [];
var imgArr1 = [];
var opens = false;
import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
            isEvaluate: false,
            orderId: '',
            list: [],
            msgText: null,
            isShow: false,
            isEnd: false,
            docInfo: {},
            userInfo: JSON.parse(window.localStorage.getItem('userInfo')),
            doctorid: '',
            deptid: '',
            inquiryList:0,
            doctorName: '',
            dian:'',
            status: '',
            canStop:true,
            expire:'',
            showPlus: false,
            name: this.props.location.query.name,
            inquiryId: '',
            userId: '',
            showId: '',
            uId: '',
            patHisNo: '',
            score: 5,
            txtNum: 0,
            t1: {text: '态度好', show: false},
            t2: {text: '及时回复', show: false},
            t3: {text: '解答详细', show: false},
            t4: {text: '很专业', show: false},
            t5: {text: '非常感谢', show: false},
            appraisalLabel: '',
            appraisal: '',
            pingShow: false,
            newScore: '',
            itemList: 0,
            detail: '',
            payBack:true,
            isOk: false,
            newText: '',
            timeShow: '',
            numEnd: 5,
            scroll:true,
            pics: "",
            innerAudioContext: '',
            isDuration: false,
            newItem: '',
            newTime: '',
            endding: false,
            end: false,
            evaluateTime: '',
            isBtn: false,
            inputText: '',
            isPlay: false,
            prevText: 0,
            nextprevText: 11111,
            sign: {},
            open: false,
            open1: false,
            fileList: [],
            uploading: false,
            formData: {},
            signature: "",
            policy: "",
            callback: "",
            OSSAccessKeyId: "",
            key: "",
            showToast: false,
            showLoading: false,
            toastTimer: null,
            loadingTimer: null,
            imgArr:[],
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
            scroll:true,
            match:[],
            files:[],
            canEnd:false,//是否可以结束
            noDoctor:false,//医生是否回复
            isIos:false,

        };
    }
    componentDidMount() {
      
          imgList=[];

        var ua = navigator.userAgent.toLowerCase();//获取浏览器的userAgent,并转化为小写——注：userAgent是用户可以修改的
        var isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);//判断是否是苹果手机，是则是true
        this.setState({
            isIos:isIos
        });
        var storage=window.localStorage;
        //写入b字段
        storage.loc='2';
          this.getJs();
        this.getJs1();
        this.setState({
            userInfo: JSON.parse(window.localStorage.getItem('userInfo')),
            name: this.props.location.query.name,
            inquiryId: this.props.location.query.inquiryId,
            isEvaluate: this.props.location.query.status ==3,

        })


        this.getChat(3);
      
        document.getElementById("txt").setAttribute("style", "padding-bottom:"+window.getComputedStyle(document.getElementsByClassName("operation-box")[0]).height
        );
        
         interval = setInterval(() => this.getChat(1), 1000);
           this.setState({
              interval:interval
         })
        

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
    componentWillUnmount() {
        imgList=[];
        this.setState({
            imgArr:[],
            imgArr1:[],
        })
        document.getElementsByTagName("body")[0].setAttribute("style", "position:inherit")
        clearInterval(this.state.interval);
        clearInterval(this.state.interval1);
        clearInterval(this.state.interval2);  
    }
    /*将这毫秒数转为日期时间*/
    dateTime(time) {
// 首先把它换成("2018-03-22 02:24:51.000+0000") 然后截取到秒 再进行转换就可以了
        var newTime = time.replace("T", " ");
        var t = newTime.substr(0, 19);
        var now = new Date(t.replace(/-/g, '/'))
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var hour = now.getHours() + 8;
        if (hour > 23) {
            hour = hour - 24;
            date += 1;
        }
        var minute = now.getMinutes();
        var second = now.getSeconds();
        if (hour.toString().length == 1) {
            hour = "0" + hour;
        }
        var minute = now.getMinutes();
        if (minute.toString().length == 1) {
            minute = "0" + minute;
        }
        var second = now.getSeconds();
        if (second.toString().length == 1) {
            second = "0" + second;
        }
        return year + "/" + month + "/" + date + " " + hour + ":" + minute + ":" + second;
    }
   /*将毫秒数转为时间类型*/
    MillisecondToDate(mss) {
        var days = parseInt(mss / (1000 * 60 * 60 * 24));
        var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + days * 24;
        var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = parseInt((mss % (1000 * 60)) / 1000);
        var h;
        var m;
        var s;
        if (hours < 10) {
            h = '0' + hours.toString();
        } else {
            h = hours.toString();
        }
        if (minutes < 10) {
            m = '0' + minutes.toString();
        } else {
            m = minutes.toString();
        }
        if (seconds < 10) {
            s = '0' + seconds.toString();
        } else {
            s = seconds.toString();
        }
        return h + " : " + m + " : " + s;
    }
    /*获取咨询信息*/
    getChat(type) {

        console.log(type)
        if(type==3){
            console.log(3);
            this.showLoading();
        }
        if(this.state.showPlus){
            document.getElementById("txt").setAttribute("style", "padding-bottom:"+window.getComputedStyle(document.getElementsByClassName("operation-box")[0]).height
            );
            var s=document.getElementsByClassName("content3")[0].scrollHeight;

            document.getElementsByClassName("content3")[0].scrollTop=500000;
            console.log(document.getElementsByClassName("content3")[0].scrollTop)
        }
        Api
            .getChat({inquiryId: this.props.location.query.inquiryId, operator: 'user'})
            .then((res) => {
                if (res.code == 0) {
                    this.setState({
                        patientName: res.data.inquiry.patientName,
                        patCardNo: res.data.inquiry.patCardNo,
                        userId: res.data.inquiry.userId,
                        uId: res.data.inquiry.userId,
                        orderId: res.data.inquiry.orderId,
                        patHisNo: res.data.patient.patHisNo,
                        status: res.data.inquiry.status,
                    })
                    if(type==3){
                        this.getDocDet(res.data.inquiry.orderId);
                    }
                    if(res.data.inquiry.status!='0'&&res.data.inquiry.status!='1') {
                        this.getEvaluate(res.data.inquiry.orderId);
                    }
                    var dd = 172800000 + res.data.inquiry.createTime;
                    var d = new Date().getTime();
                    this.setState({
                        timeShow: !!this.MillisecondToDate(dd - d).toString() ? this.MillisecondToDate(dd - d).toString() : '',
                        totalNum: 5
                    })
                    if (res.data.items.length > 0) {
                        this.setState({
                            isEvaluate: res.data.inquiry.status == '3',
                            totalNum: 5,
                            orderId: res.data.inquiry.orderId
                        })
                    }
                    var items = res.data.items;
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].direction == 'TO_DOCTOR' && !!items[i].content && items[i].type == 'BIZ') {
                            var totalNum = this.state.totalNum;
                            totalNum--;
                            var numEnd = totalNum;
                            this.setState({
                                totalNum: totalNum,
                                numEnd: numEnd
                            })
                        }
                    }
                    if (!this.state.endding && res.data.inquiry.status != '3' && res.data.inquiry.status != '2') {
                        if (this.state.numEnd <= 0) {
                            this.setState({
                                numEnd: 0,
                                endding: true,
                            })
                        }
                    }
                    if (res.code == 0) {

                        this.setState({
                            list: res.data.items.reverse(),
                            fee: res.data.inquiry.totalFee,
                            orderId: res.data.inquiry.orderId,
                            doctorName: res.data.inquiry.doctorName,
                        })
                        for(var j=0;j<this.state.list.length;j++){
                            if(this.state.list[j].direction=='TO_USER'&&this.state.list[j].type=='BIZ'){
                                this.setState({
                                    noDoctor:true
                                })
                                break;
                            }
                        };
                        if(!this.state.noDoctor){
                            var startTime=res.data.inquiry.createTime;
                            var nowTime=new Date().getTime();
                            console.log("TIME",startTime,nowTime);
                             if(nowTime-startTime<=36000000){
                                 this.setState({
                                     canEnd:false
                                 })
                             }else{
                                this.setState({
                                    canEnd:true
                                })
                             }  
                        }else{
                            this.setState({
                                canEnd:true
                            })
                        }
                        console.log("list551",window.localStorage.getItem('first'));
                        if(this.state.canStop){
                            var match=this.state.list;
                              for(var i=0;i<match.length;i++){
                                  if(match[i].voiceTime>0){
                                      match[i].stopPlay=true;
                                      match[i].play1=false;
                                      match[i].play2=false;
                                      match[i].play3=false;
                                  }
                              }
                           this.setState({
                               match:match
                           })
                        
                       }

                        setTimeout(()=>{
                            var strheight = window.getComputedStyle(document.getElementById("content2")).webkitLogicalHeight;
                            var height = strheight.substring(0, strheight.length - 2);
                            if (this.state.status != "2" &&this.state.status != "3") {
                                if(this.state.inquiryList<res.data.items.length||type==2||type==3){
                                    var s=document.getElementsByClassName("content3")[0].scrollHeight;
                                    document.getElementsByClassName("content3")[0].scrollTop=500000;
                                    console.log(s,document.getElementsByClassName("content3")[0].scrollTop);
                                    this.setState({
                                        inquiryList:res.data.items.length
                                    })
                                    if(type==3){
                                        this.hideLoading();
                                    }
                                }else{
                                    this.setState({
                                        scroll:true
                                    })
                                }
                                if (height < 500) {
                                    document.getElementsByTagName("body")[0].setAttribute("style", "position:fixed")
                                } else {
                                    document.getElementsByTagName("body")[0].setAttribute("style", "position:inherit")
                                }
                            } else {
                                    document.getElementsByTagName("body")[0].setAttribute("style", "position:inherit")
                            }
                        },2000)

                        if (res.data.inquiry.refundStatus ==1) {
                            this.setState({
                                payBack: false
                            })
                        }
                        if (res.data.inquiry.status != 1 && res.data.inquiry.status != 0) {
                            this.setState({
                                isEnd: true
                            })
                            clearInterval(this.state.interval);
                        }
                        
                    }
                }
            }, (e) => {
                this.hideLoading();
               /* this.setState({
                    msg: e.msg,
                    showIOS1: true
                })*/
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
   /*获取评价*/
    getEvaluate(orderId) {
        Api
            .evaluate1({orderId: orderId})
            .then((res) => {
                if (res.data.length > 0) {
                    this.setState({
                        pingShow: true,
                        isEvaluate: true,
                        newScore: res.data[0].score ? res.data[0].score : '',
                        newText: res.data[0].appraisal ? res.data[0].appraisal : '',
                        newItem: res.data[0].appraisalLabel ? res.data[0].appraisalLabel : '',
                        newTime: this.dateTime(res.data[0].createTime ? res.data[0].createTime : ''),
                    })
                    this.setState({
                        newTime: this.dateTime(res.data[0].createTime ? res.data[0].createTime : ''),
                    });
                    var str = this.state.newItem;
                    var s = [];
                    s = str.split("-");
                    this.setState({
                        itemList: 0
                    })
                    for (var i = 0; i < s.length; i++) {
                        if (s[i] == this.state.t1.text) {
                            var t1 = this.state.t1;
                            var itemList = this.state.itemList;
                            t1.show = true;
                            itemList += 1;
                            this.setState({
                                t1: t1,
                                itemList: itemList
                            })
                        }
                        if (s[i] == this.state.t2.text) {
                            var t2 = this.state.t2;
                            var itemList = this.state.itemList;
                            t2.show = true;
                            itemList += 1;
                            this.setState({
                                t2: t2,
                                itemList: itemList
                            })
                        }
                        if (s[i] == this.state.t3.text) {
                            var t3 = this.state.t3;
                            var itemList = this.state.itemList;
                            t3.show = true;
                            itemList += 1;
                            this.setState({
                                t3: t3,
                                itemList: itemList
                            })
                        }
                        if (s[i] == this.state.t4.text) {
                            var t4 = this.state.t4;
                            var itemList = this.state.itemList;
                            t4.show = true;
                            itemList += 1;
                            this.setState({
                                t4: t4,
                                itemList: itemList
                            })
                        }
                        if (s[i] == this.state.t5.text) {
                            var t5 = this.state.t5;
                            var itemList = this.state.itemList;
                            t5.show = true;
                            itemList += 1;
                            this.setState({
                                t5: t5,
                                itemList: itemList
                            })
                        }
                    }
                }
            }, (e) => {
                this.hideLoading();
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })
            });
    }
   /*获取医生信息*/
    getDocDet(orderId) {
        Api
            .getDocDet({orderId: orderId})
            .then((res) => {
                if (res.code == 0) {
                    this.setState({
                        docInfo: res.data,
                        doctorid: res.data.doctorId,
                        deptid: res.data.deptId
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

    /*显示发送按钮*/
    btnShow(e) {
      interval2 = setInterval(function() {
            document.body.scrollTop = document.body.scrollHeight
        }, 1000)
        e.stopPropagation();
        e.preventDefault();

        setTimeout((

        )=>{
            var s=document.getElementsByClassName("content3")[0].scrollHeight;

            document.getElementsByClassName("content3")[0].scrollTop=s;
            console.log(s,document.getElementsByClassName("content3")[0].scrollTop);



        },2000)
        this.setState({
            isBtn: true
        })
    }
    /*显示加号*/
    btnHide(e) {
        
       // e.stopPropagation();
       // e.preventDefault();
        window.scrollTo(0,0);
       clearInterval(interval2);
        if(e.target.value==''){
            e.stopPropagation();
            e.preventDefault();
            var time = setTimeout(()=> {
                this.setState({
                    isBtn: false
                })
            }, 200)
        }

    }
  /*发送信息*/
    sendMsg(e) {
        e.stopPropagation();
        e.preventDefault();
        this.showLoading("发送中")
        if (!this.state.endding) {
            if (this.state.inputText != '') {
                this.setState({
                    msgText: this.state.msgText == null ? '' : null
                })
                this.send({
                    inquiryId: this.state.inquiryId,
                    operator: 'user',
                    content: this.state.inputText,
                });
                this.hideLoading();
                 this.setState({
                     msg:'一次只能发送4张图片',
                     showIOS1: true,
                 })
                this.setState({
                    inputText: ''
                })
            }
        } else {
            this.hideLoading();
            this.setState({
                isOk: true
            })
        }
    }
    /*发送信息*/
    sendMsg1(e) {
        e.stopPropagation();
        e.preventDefault();
        window.scrollTo(0,0);
        if (!this.state.endding) {
            if (this.state.inputText != '') {
                this.setState({
                    msgText: this.state.msgText == null ? '' : null
                })
                this.send({
                    inquiryId: this.state.inquiryId,
                    operator: 'user',
                    content: this.state.inputText,
                });
               
            }
        } else {
            this.setState({
                isOk: true
            })
        }
    }
   /*获取焦点事件*/
    input(e) {
        document.getElementById("txt").setAttribute("style", "padding-bottom:"+window.getComputedStyle(document.getElementsByClassName("operation-box")[0]).height
        );
        setTimeout((

        )=>{
            var s=document.getElementsByClassName("content3")[0].scrollHeight;
            document.getElementsByClassName("content3")[0].scrollTop=500000;
            console.log(s,document.getElementsByClassName("content3")[0].scrollTop);
        },2000)
        e.stopPropagation();
        e.preventDefault();
        this.setState({
            inputText: e.target.value,
            msgText: e.target.value,
        })
    }
   /*发送*/
    send(param) {

        this.showLoading();
        Api.sendMsg(param)
            .then((res) => {
                this.setState({
                    isBtn: false,
                    inputText: '',
                })
                this.hideLoading();
                if (res.code == 0) {
                    this.setState({
                        imgArr:[]
                    })
                     imgList=[];
                   this.getChat(2);
                }
            }, (e) => {
                this.getChat(2);
                this.hideLoading();
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })
            });
    }
   /*隐藏添加图片*/
    hidePlus() {
        document.getElementById("txt").setAttribute("style", "padding-bottom:"+window.getComputedStyle(document.getElementsByClassName("operation-box")[0]).height
        );
        setTimeout((

        )=>{
            var s=document.getElementsByClassName("content3")[0].scrollHeight;

            document.getElementsByClassName("content3")[0].scrollTop=500000;
            console.log(s,document.getElementsByClassName("content3")[0].scrollTop);



        },2000)
        this.setState({
            showPlus: false
        })
    }
   /*显示发送图片*/
    showPlus() {
        document.getElementById("txt").setAttribute("style", "padding-bottom:"+window.getComputedStyle(document.getElementsByClassName("operation-box")[0]).height
        );
        setTimeout((

        )=>{
            var s=document.getElementsByClassName("content3")[0].scrollHeight;

            document.getElementsByClassName("content3")[0].scrollTop=500000;
            console.log(s,document.getElementsByClassName("content3")[0].scrollTop);



        },2000)

        this.setState({
            showPlus: !this.state.showPlus
        })
    }
   /*生成文件夹*/
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
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })
            });
    }
    base64ToBlob(urlData) {

        var arr = urlData.split(',');
        var ua = navigator.userAgent.toLowerCase();//获取浏览器的userAgent,并转化为小写——注：userAgent是用户可以修改的
        var isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);//判断是否是苹果手机，是则是true
        var  mime ='';
        var bytes;

        //if(isIos){
            mime = arr[0].match(/:(.*?);/)[1] || 'image/png';
            bytes = window.atob(arr[1]);
       // }else{
          //  mime='image/png';
         //   bytes = window.atob(urlData);
      //  }

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
    getJs1() {

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
                            expire:res.data.expire,
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
    /*是否结束咨询*/
    openModal() {
        this.setState({
            isShow: true
        })
    }
   /*不结束咨询*/
    cancel() {
        this.setState({
            isShow: false,
        })
    }
/*结束咨询*/
    sure() {
        
        this.closure();

    }
  /*结束咨询方法*/
    closure() {
        Api.closure({inquiryId: this.state.inquiryId, operator: 'user'})
            .then((res) => {
                this.hideLoading();
                if (res.code == 0) {
                    this.getChat(2);
                    this.setState({
                        isShow: false,
                        isEnd: true,
                        isEvaluate: false,
                    })
                }
            }, (e) => {
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })
            });
    }
    /*显示大图*/
    previewImg(url) {
        const arr = [];
        this.state.list.map(item => {
            if (item.url) {
                arr.push(item.url);
            }
        });
        wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: arr // 需要预览的图片http链接列表
        });
    }

//分数
    setScore(id) {
        this.setState({
            score: id
        })
    }

    sureNo() {
        this.setState({
            isShow: false,
            isOk: false,
        })
    }

//评价标签
    setAppraisal(id) {
        if (id == 1) {
            var t1 = this.state.t1;
            t1.show = !this.state.t1.show;
            this.setState({
                t1: t1
            })
        }
        if (id == 2) {
            var t2 = this.state.t2;
            t2.show = !this.state.t2.show;
            this.setState({
                t2: t2
            })
        }
        if (id == 3) {
            var t3 = this.state.t3;
            t3.show = !this.state.t3.show;
            this.setState({
                t3: t3
            })
        }
        if (id == 4) {
            var t4 = this.state.t4;
            t4.show = !this.state.t4.show;
            this.setState({
                t4: t4
            })
        }
        if (id == 5) {
            var t5 = this.state.t5;
            t5.show = !this.state.t5.show;
            this.setState({
                t5: t5
            })
        }
    }

    setATxt(e) {
        if (this.state.txtNum > 140) {
        }
        this.setState({
            txtNum: e.target.value.length,
            appraisal: e.target.value
        })
    }

    saveContent(e) {
        this.setState({
            txtNum: e.target.value.length,
            appraisal: e.target.value
        })
    }
    /*提交评价*/
    submitEvaluate() {
        var appraisalLabel1 = '';
        if (this.state.t1.show == true) {
            appraisalLabel1 += this.state.t1.text + "-";
            this.setState({
                appraisalLabel: appraisalLabel1
            })
        }
        if (this.state.t2.show == true) {
            appraisalLabel1 += this.state.t2.text + "-";
            this.setState({
                appraisalLabel: appraisalLabel1
            })
        }
        if (this.state.t3.show == true) {
            appraisalLabel1 += this.state.t3.text + "-";
            this.setState({
                appraisalLabel: appraisalLabel1
            })
        }
        if (this.state.t4.show == true) {
            appraisalLabel1 += this.state.t4.text + "-";
            this.setState({
                appraisalLabel: appraisalLabel1
            })
        }
        if (this.state.t5.show == true) {
            appraisalLabel1 += this.state.t5.text + "-";
            this.setState({
                appraisalLabel: appraisalLabel1
            })
        }
        this.setState({
            appraisalLabel: appraisalLabel1.substring(0, appraisalLabel1.length - 1)
        })
        const doctor = this.state.docInfo;
        this.setState({
            doctorName: doctor.doctorName
        })
        const params = {
            hisName: doctor.hisName,
            deptId: doctor.deptId,
            deptName: doctor.deptName,
            doctorId: doctor.doctorId,
            doctorName: doctor.doctorName,
            name: this.state.userInfo.realName,
            appraisal: this.state.appraisal,
            appraisalLabel: appraisalLabel1.substring(0, appraisalLabel1.length - 1),
            score: this.state.score,
            orderId: this.state.orderId,
        };
        if(this.state.score<4&&this.state.appraisal==''){
            this.setState({
                msg:'请输入评价详情且评价详情不能低于10个字',
                showIOS1: true
            })
           
        }else{
            Api.evaluate(params)
            .then((res) => {
                this.hideLoading();
                if (res.code == 0) {
                    this.showToast();
                    this.setState({
                        end: true,
                    })
                   

                }else{
                    this.setState({
                        msg: res.msg,
                        showIOS1: true
                    })
                }
            }, (e) => {
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })
            });
        }
        
    }
   /*播放语音*/
    play(item,list,index) {

        event.stopPropagation();//防止冒泡
        console.log("index",index);
        for (var i = 0; i < this.state.list.length; i++) {
            if (this.state.list[i].voiceTime > 0) {
                var audio = document.getElementById("s" + this.state.list[i].id);
                if (item == "s" + this.state.list[i].id) {
                    if (audio.paused) { //如果当前是暂停状态
                        audio.play(); //播放
                        this.setState({
                            canStop:false,
                        })
                        var curTime=3;
                        var total=list[i].voiceTime;
                        var matList=this.state.match;
                         var tag='';       
                            for(var k=0;k<matList.length;k++){
                                if(item!=="s"+matList[k].id){
                                    matList[k].stopPlay=true;

                                }else{
                                    console.log("k",item,k)
                                    matList[k].stopPlay=false;
                                    tag=k; 
                                }
                            }
                            this.setState({
                                match:matList
                            })
                            
                          this.state.dian=setInterval(() => {
                                 console.log("TIME",curTime);
                                 if(total<1){
                                    matList[tag].stopPlay=true;
                                    matList[tag].play1=false;
                                    matList[tag].play2=false;
                                    matList[tag].play3=false;
                                    total=0;
                                    
                                    this.setState({
                                        match:matList,
                                        canStop:true
                                    });
                                    clearInterval(this.state.dian);
                                 }
                                if(curTime==3){
                                    matList[tag].play1=true;
                                    matList[tag].play2=false;
                                    matList[tag].play3=false;
                                    this.setState({
                                        match:matList
                                    });
                                }
                                if(curTime==2){
                                    matList[tag].play1=true;
                                    matList[tag].play2=true;
                                    matList[tag].play3=false;
                                    this.setState({
                                        match:matList
                                    });
                                }
                                if(curTime==1){
                                    matList[tag].play1=true;
                                    matList[tag].play2=true;
                                    matList[tag].play3=true;
                                    this.setState({
                                        match:matList
                                    });

                                } 
                                this.setState({
                                    match:matList
                                });
                                curTime--;
                                total--;
                                if(curTime<0){
                                    curTime=3;
                                }
      
                          },1000)
                        return;  
                    } else {//当前是播放状态
                        audio.pause(); //暂停
                        this.setState({
                            canStop:true
                        })
                    }
                } else {
                    audio.pause(); //暂停
                }
            }
        }
    }

    alertTxt(e) {
        if (this.state.endding) {
            this.setState({
                isOk: true,
            })
        } else {
            this.getJs1();
            this.setState({
                open: true
            })
        }
    }

    alertTxt1(e) {
        if (this.state.endding) {
            this.setState({
                isOk: true,
                showPlus: false
            })
        }
    }

    imgShow(file){
        this.handleUpload(file)
    }
    S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    guid() {
        var m=this.S4()+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+this.S4()+this.S4();
        nameList[0]=m;
        return m;
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
                imgArr1.push('https://ihoss.oss-cn-beijing.aliyuncs.com/'+filename);
                console.log("ii",imgArr1)

                    this.send({
                        inquiryId: this.state.inquiryId,
                        operator: 'user',
                        url:'https://ihoss.oss-cn-beijing.aliyuncs.com/'+filename,
                    });


            },
            error:(e) =>{
                console.log("this.sate",this.state.imgArr)
            }
        });
    }
    choose(sign){
        var that=this;
        if(!that.state.endding){
            if(that.state.imgArr.length>=4){

                that.setState({
                    msg:'最多只能上传4张图片',
                    showIOS1:true,
                })
            }else{
                wx.ready(function () {
                    wx.chooseImage({
                        count: 4, // 默认9
                        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                        success: function (res) {
                            that.showLoading('发送中');
                            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                            var m=[];

                            for(var i=0;i<localIds.length;i++){
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
                                                imgArr1.push('https://ihoss.oss-cn-beijing.aliyuncs.com/'+filename);
                                                that.send({
                                                    inquiryId: that.state.inquiryId,
                                                    operator: 'user',
                                                    url:'https://ihoss.oss-cn-beijing.aliyuncs.com/'+filename,
                                                });
                                                that.hideLoading();
                                                that.setState({
                                                    imgArr:imgArr1
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
                    });

                });

            }
        }else{
            this.setState({
                isOk: true,
                showPlus: false
            })
        }



    }
    into(id){
        clearInterval(this.state.interval);
        clearInterval(this.state.interval1);
        clearInterval(this.state.interval2);
        console.log("into")
       hashHistory.push({
           pathname:'add/addManage',
           query:{id:id,source:1,orderIdStr:this.state.orderId,inquiryId:this.state.inquiryId,status:this.state.status,doctorName:this.state.doctorName}
       })
    }
    onChange = (files, type, index) => {
        this.setState({
            files,
          });
          var that=this;
          var sign=that.state.sign;
        console.log("length:"+that.state.imgArr)
        
        console.log(files, type, index);
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
            formData.append('file',that.base64ToBlob(files[i].url));
            $.ajax({
                url: 'https://ihoss.oss-cn-beijing.aliyuncs.com',
                method: 'POST',
                processData: false,
                contentType: false,
                cache: false,
                data: formData,
                success: (e) => {
                    imgArr1.push('https://ihoss.oss-cn-beijing.aliyuncs.com/'+filename);
                                                that.send({
                                                    inquiryId: that.state.inquiryId,
                                                    operator: 'user',
                                                    url:'https://ihoss.oss-cn-beijing.aliyuncs.com/'+filename,
                                                });
                                                that.hideLoading();
                                                that.setState({
                                                    imgArr:imgArr1
                                                })
                  
                   
                },
                error:(e) =>{
                    that.hideLoading();
                }
            });
        
    }
      };
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
    const {isEvaluate,files,orderId,list,msgText,isShow,isEnd,docInfo,userInfo,doctorid,deptid,showPlus,interval,
        name,match,userId,showId,uId,patHisNo,score,txtNum,t1,t2,t3,t4,t5,timeShow,numEnd,pics,innerAudioContext,
        canEnd,appraisal,pingShow,newScore,itemList,detail,payBack,isOk,newText ,isDuration,newItem,
        newTime,doctorName,noDoctor,isIos,msg,endding,end,sign,signature,formData,policy,callback,OSSAccessKeyId,key,evaluateTime,isBtn,inputText,isPlay,prevText,nextprevText}=this.state

        return (


            <div style={{height:'100%'}} className="chat">
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons}
                    show={this.state.showIOS1}>
                {msg}
            </Dialog>
            
                <div className="container1"
                    >
                    <div className="home bid" ><span className="jian"
                                                onClick={()=>{
                                    this.context.router.push({
                                    pathname:'inquiry/inquirylist'
                                    })
                                      }}
                        ></span>{doctorName}
                    </div>
                    <Toast icon="success-no-circle" show={this.state.showToast}>评价成功</Toast>
                    

                    {!isEnd && <div className='header'>
                        <div>
                            <div className="time">剩余时间： <span>{timeShow}</span></div>
                            <div className="num">剩余条数： <span>{numEnd}</span> 条</div>
                        </div>
                        <div >
                            <span 
                              className={`${!canEnd?'endGrey':''}`}
                            onClick={()=>{ 
                                if(canEnd){
                                    this.openModal()
                                }
                            

                            }}>结束咨询</span>
                        </div>
                    </div>}
                    {!isEnd && <div className='operation-box'>
                        <div className='top'>
                            <TextArea autosize rows="1" cols="3" value={msgText}
                                
                                      onFocus={(e)=>{
                            this.btnShow(e)

                            }}
                              onBlur={(e)=>{
                    this.btnHide(e)

                    }}
                              onChange={(e)=>{
                    this.input(e)

                        }}

                                  onPressEnter={(e)=>{
                        this.sendMsg(e)

                                }}
                                    />

                            {!isBtn &&
                            <img src='../../../resources/images/plus.png' onClick={()=>{
                            this.showPlus()

                            }}/>
                            }
                            {isBtn && <span className="addBtn" onClick={
                                                    (e)=>{
                                                    e.stopPropagation();
                                                    e.preventDefault();

                                                    this.sendMsg1(e)

                                                    }
                                                    }>发送</span>}
                        </div>
                        {showPlus && <div className='bottom'>
                            {!isIos&&<ImagePicker
                            length="4"
                            files={files}
                            onChange={this.onChange}
                            onImageClick={(index, fs) => console.log(index, fs)}
                            selectable={true}
                        
                            multiple={false}
                        />}
                        {!isIos&&<img src='../../../resources/images/tp.png'/>}

                                {isIos&&<div onClick={(e)=>{
                                                   this.choose(this.state.sign)
                                                        }}> 
                                    <img src='../../../resources/images/tp.png'/>
                                 </div> }

                        </div>}
                    </div>}
                    <div className={`header1 ${isEnd ? '': 'showTxt'}`}>咨询已结束</div>
                    <div  className={`content3 ${isEnd?'contents':''}`}
                         id='content3'
                         onClick={()=>{
                                    this.hidePlus()

                                    }}>
                        <div className='content2' id="content2">
                            {list.reverse() && list.reverse().map((item, index)=> {
                                return (
                                    <div key={index} className="content-item">
                                        {item.type == 'SYSTEM' && item.userIsShow == '1' &&
                                        <div
                                            className={`msg ${item.content.indexOf("text")!=-1?'redColor':''}`}>
                                            {item.content.indexOf("text")!=-1?item.content.substring(26,item.content.length-7):item.content}
                                        </div>}

                                        {item.type == 'BIZ' && item.userIsShow == '1' &&
                                        <div className='date'>{item.createTime}</div>}
                                        {item.type == 'BIZ' && item.direction == 'TO_USER' && item.userIsShow == '1' && item.voiceTime == 0 &&
                                        <div className='left'
                                            >
                                            <div className='img'>
                                                <span style={{fontSize:'10px'}}> {doctorName}</span>
                                            </div>
                                            {item.content && <div className='text'>{item.content}</div>}
                                            {item.url && item.action !== 'add' &&item.action !== 'addcheck'&& <div
                                                className='image'
                                                onClick={()=>{
                                                                    this.previewImg(item.url)

                                                                    }}
                                                >
                                                <i/><img src={item.url&&item.url.indexOf("ihoss")=='-1'?item.url:item.url+"?x-oss-process=image/resize,w_105"}/>
                                            </div>}
                                            {item.url && item.action == 'add' && <div
                                                className='image'
                                                onClick={()=>{
                                                                        this.into(item.actionTrigger)

                                                                        }}
                                                >
                                                <i/><img src={item.url} style={{width:'223px',height:'86px',maxWidth:'223px'}}/>
                                            </div>}
                                            {item.url && <div className='flex'></div>}
                                        </div>}
                                        {item.voiceTime > 0 && <div id="a" className='left slide'>
                                            <div className='img'>
                                                <span style={{fontSize:'10px'}}> {doctorName}</span>
                                            </div>
                                            {item.voiceTime && <div
                                                onClick={()=>{
                                                        this.play('s'+item.id,item,index)

                                                        }}
                                                className={`text radio ${item.voiceTime<5?'wid5':''} ${item.voiceTime<10&&item.voiceTime>=5?'wid6':''} ${item.voiceTime<20&&item.voiceTime>=10?'wid7':''} ${item.voiceTime>=20?'wid8':''}`}>
                                               
                                                 {
                                                     //match&&!!match[index].stopPlay&&<img className="rd" src="../../../resources/images/rd.png"
                                                //     />}
                                                //     {match&&!!!match[index].stopPlay&&<div style='position:relative' >  
                                                //        {match&&!!match[index].play1&&<image    src="../../../resources/images/r1.png" style={{'width':'8px','height':'8px','position':'absolute','right':'14px','top':'17px'}}/>}
                                                //        {match&&!!match[index].play2&&<image  src="../../../resources/images/r2.png" style={{'width':'8px','height':'24px','position':'absolute','right':'18px','top':'13px'}}/>}
                                                //        {match&&!!match[index].play3&&<image   src="../../../resources/images/r3.png" style={{'width':'10px','height':'36px','position':'absolute','right':'22px','top':'10px'}}/>}
                                                //    </div>    
                                            } 
          
                                                  {match[index]&&match[index].stopPlay&&<img className="rd" src="../../../resources/images/rd.png"
                                                    />} 
                                                    {match[index]&&!match[index].stopPlay&&<div style={{position:'relative'}} >  
                                                       {match[index]&&match[index].play1&&<img    src="../../../resources/images/r1.png"  style={{width:'4px',height:'4px',position:'absolute',left:'15px',top:'18px'}}/>}
                                                       {match[index]&&match[index].play2&&<img  src="../../../resources/images/r2.png"   style={{width:'4px',height:'12px',position:'absolute',left:'20px',top:'14px'}}/>}
                                                       {match[index]&&match[index].play3&&<img   src="../../../resources/images/r3.png"  style={{width:'5px',height:'18px',position:'absolute',left:'24px',top:'11px'}}/>}
                                                   </div>    }
 
                                                <audio id={'s'+item.id}>
                                                    <source src={item.url} type="audio/mp3"/>
                                                </audio>
                                                <span
                                                    className={`${isDuration?'duration':'dura'}`}>{item.voiceTime}</span>
                                            </div>}
                                            {item.url && <div className='flex'></div>}
                                        </div>}
                                        {item.type == 'BIZ' &&item.direction == 'TO_DOCTOR'&&item.userIsShow== '1'&&
                                        <div id="s" className='right'>
                                            <div className='flex'></div>
                                            {item.url && item.action !== 'add' &&item.action !== 'addcheck' &&  <div className='image'
                                                                                       onClick={()=>{
                                                                                    this.previewImg(item.url)
                                                                                    }}
                                                >
                                                <img src={item.url&&item.url.indexOf("ihoss")=='-1'?item.url:item.url+"?x-oss-process=image/resize,w_105"}/>

                                            </div>}
                                            {item.url && item.action == 'add' && <div
                                             className='image'
                                             onClick={()=>{
                                                this.into(item.actionTrigger)

                                                }}
                                             >
                                                <img src={item.url} style={{width:'223px',height:'86px',maxWidth:'223px'}}/>

                                            </div>}
                                            {item.content && <div className='text'>
                                                {item.content}
                                            </div>}  
                                            <div className='img'>
                                                <img src={userInfo.headImage||'./././resources/images/defautImg.png'}/>
                                            </div>
                                        </div>}
                                    </div>
                                )
                            })}
                            <div className="content-item" id="txt" ></div>
                        </div>
                        {isEnd&&!isEvaluate&&payBack&&noDoctor&& <div className="card" style={{height:'250px'}}></div>}
                       
                    </div>
                    {isOk && <div className='modal'>
                        <div className='modal-body'>
                            <div className='modal-title'>提示</div>
                            <div className='modal-content'>您本次咨询条数已用完，如需再次咨询请重新选择咨询</div>
                            <div className='modal-footer'>
                                    <span onClick={()=>{
                                    this.sureNo()
                                    }}>确定</span>
                            </div>
                        </div>
                    </div>}
                    {isShow && <div className='modal'>
                        <div className='modal-body'>
                            <div className='modal-title'>是否结束咨询会话？</div>
                            {noDoctor&&<div className='modal-content'>结束咨询会话后您可以对本次咨询进行评分</div>}
                            <div className='modal-footer'>
                                        <span onClick={()=>{
                                        this.cancel()

                                        }}>继续咨询</span>
                                        <span onClick={()=>{
                                        this.sure()

                                        }}>结束</span>
                            </div>
                        </div>
                    </div>}
                   

                </div>
                {isEvaluate &&payBack&&<div className={`pingJia2  ${isEnd &&isEvaluate&&payBack ? '': 'showTxt' }`}>
                    <div className="title">患者评价</div>
                    <div className="ping">
                        <div className="xing">星级：
                            <div className="star">
                                {newScore < 1 && <img src="../../../resources/images/starH.png"/>}
                                {newScore >= 1 && <img src="../../../resources/images/starS.png"/>}

                            </div>
                            <div className="star">
                                {newScore < 2 && <img src="../../../resources/images/starH.png"/>}
                                {newScore >= 2 && <img src="../../../resources/images/starS.png"/>}

                            </div>
                            <div className="star">
                                {newScore < 3 && <img src="../../../resources/images/starH.png"/>}
                                {newScore >= 3 && <img src="../../../resources/images/starS.png"/>}
                            </div>
                            <div className="star">
                                {newScore < 4 && <img src="../../../resources/images/starH.png"/>}
                                {newScore >= 4 && <img src="../../../resources/images/starS.png"/>}
                            </div>
                            <div className="star">
                                {newScore < 5 && <img src="../../../resources/images/starH.png"/>}
                                {newScore >= 5 && <img src="../../../resources/images/starS.png"/>}
                            </div>
                        </div>
                    </div>
                    <div
                        className={`ping-content ${itemList>=1&&itemList<=3?'conmidHeight':''} ${itemList==0?'conminHeight':''}`}>
                        <div className={`active ${t1.show ? '': 'showTxt' }`}>{t1.text}</div>
                        <div className={`active ${t2.show ? '': 'showTxt' }`}>{t2.text}</div>
                        <div className={`active ${t3.show ? '': 'showTxt' }`}>{t3.text}</div>
                        <div className={`active ${t4.show ? '': 'showTxt' }`}>{t4.text}</div>
                        <div className={`active ${t5.show ? '': 'showTxt' }`}>{t5.text}</div>
                    </div>
                    <div className="ping-info">
                        <span className="text1">评价详情：</span>
                        <span className="text2">{!!newText ? newText : '无'}</span>
                    </div>
                    <div className="ping-time">
                        <span className="text1">评价时间：</span>
                        <span className="text2">{newTime}</span>
                    </div>
                    <div className="consult-again">
                        <Link className="again"
                              to={{
                                    pathname:'/consult/deptdetail',
                                    query:{doctorId:doctorid,deptId:deptid}
                                    }}
                            >再次咨询</Link>
                    </div>

                </div>}

                {!isEvaluate &&payBack&&noDoctor&& <div className={`pingJia ${isEnd&&!isEvaluate&&!end&&payBack ? '': 'showTxt'}`}>
                    <div className="title">请对本次咨询进行评价</div>
                    <div className="ping">
                        <div className="xing">星级：
                            <div className="star"
                                 onClick={()=>{
                                                this.setScore(1)
                                                }}>
                                {score < 1 && <img src="../../../resources/images/starH.png"/>}
                                {score >= 1 && <img src="../../../resources/images/starS.png"/>}

                            </div>
                            <div className="star"
                                 onClick={()=>{
                                            this.setScore(2)
                                            }}>
                                {score < 2 && <img src="../../../resources/images/starH.png"/>}
                                {score >= 2 && <img src="../../../resources/images/starS.png"/>}
                            </div>
                            <div className="star"
                                 onClick={()=>{
                                                this.setScore(3)
                                                }}>
                                {score < 3 && <img src="../../../resources/images/starH.png"/>}
                                {score >= 3 && <img src="../../../resources/images/starS.png"/>}
                            </div>
                            <div className="star"
                                 onClick={()=>{
                                        this.setScore(4)
                                        }}>
                                {score < 4 && <img src="../../../resources/images/starH.png"/>}
                                {score >= 4 && <img src="../../../resources/images/starS.png"/>}
                            </div>
                            <div className="star"
                                 onClick={()=>{
                                                this.setScore(5)
                                                }}>
                                {score < 5 && <img src="../../../resources/images/starH.png"/>}
                                {score >= 5 && <img src="../../../resources/images/starS.png"/>}
                            </div>
                        </div>
                        <div className="xing-dian">点击星星评分</div>
                    </div>
                    <div className="ping-content">
                        <div className={`${t1.show ? 'active' : ''}`} onClick={()=>{
                            this.setAppraisal(1)

                            }}>{t1.text}
                        </div>
                        <div className={`${t2.show ? 'active' : ''}`} onClick={()=>{
                                    this.setAppraisal(2)

                                    }}>{t2.text}
                        </div>
                        <div className={`${t3.show ? 'active' : ''}`} onClick={()=>{
                                                this.setAppraisal(3)

                                                }}>{t3.text}
                        </div>
                        <div className={`${t4.show ? 'active' : ''}`} onClick={()=>{
                                        this.setAppraisal(4)

                                        }}>{t4.text}
                        </div>
                        <div className={`${t5.show ? 'active' : ''}`} onClick={()=>{
                                            this.setAppraisal(5)

                                            }}>{t5.text}
                        </div>
                    </div>
                    <div className="ping-area">
                            <TextArea value={appraisal}
                                      placeholder="请输入您要评价的内容"
                                      onBlur={()=>{
                                          window.scrollTo(0,0)
                                      }}
                                      onChange={(e)=>{
                            this.setATxt(e)
                            }}
                              maxLength="140"
                              onPressEnter={(e)=>{
                    this.saveContent(e)
                    }}
                        />
                        <div><span>{txtNum}</span><span>/140</span></div>
                    </div>
                    <div className="ping-btn">
                        <button className="btn1"
                                onClick={()=>{
                                this.submitEvaluate()

                                }}> 确定评价
                        </button>
                        <Link
                            to={{
                                pathname:'/consult/deptdetail',
                                query:{doctorId:doctorid,deptId:deptid}
                                }}
                            className="btn2 again">再次咨询</Link>
                    </div>
                </div>}
            </div>
        );
    }
}

export default Connect()(Widget);
