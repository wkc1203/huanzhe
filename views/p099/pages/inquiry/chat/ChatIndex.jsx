import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import { Link } from 'react-router';
import { Input,Upload,Anchor,Icon, Modal} from 'antd';
const { TextArea } = Input;
var uuList = [];
var imgList = [];
import * as Api from './chatIndexApi';
import './style/index.scss';
var interval = '';
var interval1 = '';
var interval2='';
var upload=true;
var opens = false;
class Widget extends Component {
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
            status: '',
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
            payBack: true,
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

        };
    }
    componentDidMount() {

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
        if(this.props.location.query.status==0||this.props.location.query.status==1){
        document.getElementById("txt").setAttribute("style", "padding-bottom:"+window.getComputedStyle(document.getElementsByClassName("operation-box")[0]).height
        );
        
            interval = setInterval(() => this.getChat(1), 1000);
        }

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
                   /* wx.ready(function () {
//批量隐藏功能
                        wx.hideMenuItems({
                            menuList: ["menuItem:share:QZone", "menuItem:share:facebook", "menuItem:favorite", "menuItem:share:weiboApp", "menuItem:share:qq", "menuItem:share:timeline", "menuItem:share:appMessage", "menuItem:copyUrl", "menuItem:openWithSafari", "menuItem:openWithQQBrowser"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                        });
                    });*/
                }
            }, (e) => {
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })
            });
    }
    componentWillUnmount() {
        document.getElementsByTagName("body")[0].setAttribute("style", "position:inherit")
        clearInterval(interval);
        clearInterval(interval1);
        clearInterval(interval2);
    }
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

                        if (res.data.inquiry.refundStatus == '1') {
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

    getHospIntro() {
        this.showLoading();
        Api.getHisInfo()
            .then((res) => {
                this.hideLoading();
                if (res.data) {
                    this.setState({hospInfo: res.data});
                }
            }, (e) => {
                this.hideLoading();
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })
            });
    }

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

    btnHide(e) {
       clearInterval(interval2);
        if(this.state.inputText==''){
            e.stopPropagation();
            e.preventDefault();
            var time = setTimeout(()=> {
                this.setState({
                    isBtn: false
                })
            }, 200)
        }

    }

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

    sendMsg1(e) {
        e.stopPropagation();
        e.preventDefault();
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
                this.setState({
                    isBtn: false,
                    inputText: '',
                })
            }
        } else {
            this.setState({
                isOk: true
            })
        }
    }

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

    send(param) {
        this.showLoading();
        Api.sendMsg(param)
            .then((res) => {
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

    randomName() {
        if (this.state.open) {
            var myDate = new Date();
            var ossPath = 'PIC/';
            var fileRandName = Date.now();
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
        }}


    getJs() {

        Api
            .getJsApiConfig({url: 'https://tih.cqkqinfo.com/views/p099/'})
            .then((res) => {
                if (res.code == 0) {
//写入b字段
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: res.data.appId, // 必填，公众号的唯一标识
                        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: res.data.noncestr, // 必填，生成签名的随机串
                        signature: res.data.signature,// 必填，签名
                        jsApiList: ['hideMenuItems', 'showMenuItems', 'previewImage', 'uploadImage', 'downloadImage'] // 必填，需要使用的JS接口列表
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
    validateImage(pathImg)
    {
        var ImgObj=new Image();
        ImgObj.src= pathImg;
        if(ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0))
        {
            return true;
        } else {
            return false;
        }
    }
    validate(imgList){
        var datas = [];
        var m=0;
        for(var i=0;i<imgList.length;i++){
            if(this.validateImage(imgList[i])){
                console.log(1);
                datas.push(imgList[i]);
                m=i+1;
            }
        }
        if(m==imgList.length){
            clearInterval(interval1);
            this.hideLoading();
            upload=false;
            if (datas.length >= 4) {
                this.setState({
                    open1: true
                })
                for (var i = 0;i< 4; i++) {
                    datas[i]=datas[i];
                    m=i+1;
                }
                this.setState({
                    imgArr: datas,
                })
                for(var j=0;j<this.state.imgArr.length;j++){
                    this.send({
                        inquiryId: this.state.inquiryId,
                        operator: 'user',
                        url:this.state.imgArr[j],
                    });
                }

                this.setState({
                    imgArr:[],
                })
                imgList=[];
            } else {
                this.setState({
                    imgArr: datas,
                    datas:[],
                })
                for(var j=0;j<this.state.imgArr.length;j++){
                    this.send({
                        inquiryId: this.state.inquiryId,
                        operator: 'user',
                        url:this.state.imgArr[j],
                    });
                }
                this.setState({
                    imgArr:[],
                    datas:[],
                })

            }
            clearInterval(interval1);
            imgList=[];
        }


    }
    handleChange = (info) => {
        imgList.push('https://ihoss.oss-cn-beijing.aliyuncs.com/'+uuList[0]+info.file.name)+"?x-oss-process=image/resize,w_105";
        this.showLoading('发送中');

        if(upload){
            interval1 = setInterval(() => this.validate(imgList), 1000);

        }        console.log(imgList);

    }
    openModal() {
        this.setState({
            isShow: true
        })
    }

    cancel() {
        this.setState({
            isShow: false,
        })
    }

    sure() {
        this.setState({
            isShow: false,
            isEnd: true,
            isEvaluate: false,
        })
        this.closure();

    }

    closure() {
        Api.closure({inquiryId: this.state.inquiryId, operator: 'user'})
            .then((res) => {
                this.hideLoading();
                if (res.code == 0) {
                    this.getChat(2);
                    this.setState({
                        isEvaluate: false
                    })
                }
            }, (e) => {
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })
            });
    }

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
        Api.evaluate(params)
            .then((res) => {
                this.hideLoading();
                if (res.code == 0) {
                    this.showToast();
                    this.end = true;
                    this.setState({
                        end: true,
                    })

                }
            }, (e) => {
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })
            });
    }

    play(item) {
        event.stopPropagation();//防止冒泡
        for (var i = 0; i < this.state.list.length; i++) {
            if (this.state.list[i].voiceTime > 0) {
                var audio = document.getElementById("s" + this.state.list[i].id);
                if (item == "s" + this.state.list[i].id) {
                    if (audio.paused) { //如果当前是暂停状态
                        audio.play(); //播放
                        return;
                    } else {//当前是播放状态
                        audio.pause(); //暂停
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


    render() {
    const {isEvaluate,orderId,list,msgText,isShow,isEnd,docInfo,userInfo,doctorid,deptid,showPlus,interval,
        name,inquiryId,userId,showId,uId,patHisNo,score,txtNum,t1,t2,t3,t4,t5,timeShow,numEnd,pics,innerAudioContext,
        appraisalLabel,appraisal,pingShow,newScore,itemList,detail,payBack,isOk,newText ,isDuration,newItem,
        newTime,doctorName,open1,status,msg,endding,end,sign,signature,formData,policy,callback,OSSAccessKeyId,key,evaluateTime,isBtn,inputText,isPlay,prevText,nextprevText}=this.state
        const props = {
            action: 'https://ihoss.oss-cn-beijing.aliyuncs.com',
            onChange: this.handleChange,
            multiple: true,
            data: {
                ...sign,
                key: this.randomName() + '${filename}'
            }

        };
        return (
            <div style={{height:'100%'}} className="chat">
                <div className="container1"
                    >
                    <Toast icon="success-no-circle" show={this.state.showToast}>评价成功</Toast>
                    <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons}
                            show={this.state.showIOS1}>
                        {msg}
                    </Dialog>
                    {!isEnd && <div className='header'>
                        <div>
                            <div className="time">剩余时间： <span>{timeShow}</span></div>
                            <div className="num">剩余条数： <span>{numEnd}</span> 条</div>
                        </div>
                        <div>
                            <span onClick={()=>{
                            this.openModal()

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

                            {!endding && <Upload
                                {...props} fileList={this.state.fileList}>
                                <div onClick={(e)=>{
                                                        this.alertTxt(e)
                                                        }}>
                                    <img src='../../../resources/images/tp.png'/>
                                </div>
                            </Upload>}
                            {endding && <div
                                >
                                <div onClick={(e)=>{
                                                this.alertTxt1(e)
                                                }}>
                                    <img src='../../../resources/images/tp.png'/>
                                </div>
                            </div>}

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
                                            {item.url && item.action !== 'add' && <div
                                                className='image'
                                                onClick={()=>{
                                                                    this.previewImg(item.url)

                                                                    }}
                                                >
                                                <i/><img src={item.url}/>
                                            </div>}
                                            {item.url && item.action == 'add' && <div
                                                className='image'
                                                onClick={()=>{
                                                                        this.into(item.actionTrigger)

                                                                        }}
                                                >
                                                <i/><img src={item.url} />
                                            </div>}
                                            {item.url && <div className='flex'></div>}
                                        </div>}
                                        {item.voiceTime > 0 && <div id="a" className='left slide'>
                                            <div className='img'>
                                                <span style={{fontSize:'10px'}}> {doctorName}</span>
                                            </div>
                                            {item.voiceTime && <div
                                                onClick={()=>{
                                                        this.play('s'+item.id)

                                                        }}
                                                className={`text radio ${item.voiceTime<5?'wid5':''} ${item.voiceTime<10&&item.voiceTime>=5?'wid6':''} ${item.voiceTime<20&&item.voiceTime>=10?'wid7':''} ${item.voiceTime>=20?'wid8':''}`}>
                                                <img className="rd" src="../../../resources/images/rd.png"
                                                    />
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
                                            {item.url && item.action !== 'add' && <div className='image'
                                                                                       onClick={()=>{
                                                                                    this.previewImg(item.url)
                                                                                    }}
                                                >
                                                <img src={item.url} />

                                            </div>}
                                            {item.url && item.action == 'add' && <div className='image'>
                                                <img src={item.url}/>

                                            </div>}
                                            {item.content && <div className='text'>
                                                {item.content}
                                            </div>}
                                            <div className='img'>
                                                <img src={userInfo.headImage}/>
                                            </div>
                                        </div>}
                                    </div>
                                )
                            })}
                            <div className="content-item" id="txt" ></div>
                        </div>
                        {isEnd && <div className="card" sytle={{height:'450px'}}></div>}
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
                            <div className='modal-content'>结束咨询会话后您可以对本次咨询进行评分</div>
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
                {isEvaluate && <div className={`pingJia2  ${isEnd &&isEvaluate&&payBack ? '': 'showTxt' }`}>
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
                {!isEvaluate && <div className={`pingJia ${isEnd&&!isEvaluate&&!end&&payBack ? '': 'showTxt'}`}>
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
                                      placeholder="请输入您需要咨询的内容"
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
