import React, { Component } from 'react';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import { Link } from 'react-router';
import { Input,Upload,Anchor,Icon, Modal,Button,Dialog,Toast} from 'antd';
const { TextArea } = Input;
var uuList=[];
var imgList=[];
const { Link1 } = Anchor;

import * as Api from './chatIndexApi';
import './style/index.scss';
var interval='';
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
        userInfo:JSON.parse(window.localStorage.getItem('userInfo')),
        doctorid:'',
        deptid:'',
        doctorName:'',
        showPlus: false,
        name:this.props.location.query.name,
        inquiryId: '',
        userId:'',
        showId: '',
        uId:'',
        patHisNo:'',
        score:5,
        txtNum:0,
        t1:{text:'态度好',show:false},
        t2:{text:'及时回复',show:false},
        t3:{text:'解答详细',show:false},
        t4:{text:'很专业',show:false},
        t5:{text:'非常感谢',show:false},
        appraisalLabel:'',
        appraisal:'',
        pingShow:false,
        newScore:'',
        itemList:0,
        detail:'',
        payBack:true,
        isOk:false,
        newText:'',
        timeShow:'',
        numEnd:'5',
        pics:"",
        innerAudioContext:'',
        isDuration:false,
        newItem:'',
        newTime:'',
        endding:false,
        end:false,
        evaluateTime:'',
        isBtn:false,
        inputText:'',
        isPlay:false,
        prevText:0,
        nextprevText:11111,
        sign:{},
        open:false,
        fileList:[],
        uploading: false,
        formData:{},
        signature:"",
        policy:"",
        callback:"",
        OSSAccessKeyId:"",
        key:"",
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

    };
  }

  componentDidMount() {
      console.log("s11"+document.getElementById("content2").scrollTop);
      document.getElementById("content2").scrollTop=100;
      console.log("ss"+document.getElementById("content2").scrollTop);
      this.getJs();
      this.getJs1();
      this.randomName();
       var height=window.screen.availHeight;
        /*if(document.getElementById("content3").style.height<500){
            document.getElementById("content3").style.height=1800+'px';
        }
*/
      this.setState({
          userInfo:JSON.parse(window.localStorage.getItem('userInfo')),
          name:this.props.location.query.name,
          inquiryId:this.props.location.query.inquiryId,
          orderId:this.props.location.query.orderId,
          isEvaluate:this.props.location.query.status == '3',

      })
      console.log("ev",this.state.isEvaluate);
      this.getDocDet();
      this.getEvaluate(this.props.location.query.orderId);
      this.getChat(2);
      interval = setInterval(() => this.getChat(1), 500);

  }
   componentWillUnmount(){
      clearInterval(interval);
   }
    dateTime(time) {
        // 首先把它换成("2018-03-22 02:24:51.000+0000") 然后截取到秒 再进行转换就可以了
        var newTime= time.replace("T"," ");
        var t=newTime.substr(0,19);
        var now =new Date(t.replace(/-/g,'/'))
        var year = now.getFullYear();
        var month = now.getMonth()+1;
        var date=now.getDate();
        var hour=now.getHours()+8;
        if(hour>23){
            hour=hour-24;
            date+=1;
        }
        var minute=now.getMinutes();
        var second=now.getSeconds();
        if(hour.toString().length == 1){
            hour = "0" + hour;
        }
        var minute=now.getMinutes();
        if(minute.toString().length == 1){
            minute = "0" + minute;
        }
        var second=now.getSeconds();
        if(second.toString().length == 1){
            second = "0" + second;
        }
        return year+"/"+month+"/"+date+" "+hour+":"+minute+":"+second;
    }
    MillisecondToDate(mss){
        var days = parseInt(mss / (1000 * 60 * 60 * 24));
        var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))+days*24;
        var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = parseInt((mss % (1000 * 60)) / 1000);
        var h;
        var m;
        var s;
        if(hours<10){
            h='0'+hours.toString();
        }else{
            h=hours.toString();
        }
        if(minutes<10){
            m='0'+minutes.toString();
        }else{
            m=minutes.toString();
        }
        if(seconds<10){
            s='0'+seconds.toString();
        }else{
            s=seconds.toString();
        }

        return  h + " : " + m + " : " + s;
    }
     getChat(type) {
         Api
             .getChat({ inquiryId: this.props.location.query.inquiryId, operator: 'user' })
             .then((res) => {
                 if(res.code == 0){
                     this.setState({
                         patientName:res.data.inquiry.patientName,
                         patCardNo:res.data.inquiry.patCardNo,
                         userId:res.data.inquiry.userId,
                         uId:res.data.inquiry.userId,
                         patHisNo:res.data.patient.patHisNo,

                     })

                     var dd=172800000+res.data.inquiry.createTime;
                     var d = new Date().getTime();
                     this.setState({
                         timeShow:!!this.MillisecondToDate(dd-d).toString()?this.MillisecondToDate(dd-d).toString():'',
                         totalNum:5
                     })
                    if(res.data.items.length>0){
                        this.setState({
                            isEvaluate:res.data.inquiry.status == '3',
                            totalNum:5,
                            orderId:res.data.inquiry.orderId
                        })
                     }
                     var items=res.data.items;
                     for(var i=0;i<items.length;i++)
                     {
                         if(items[i].direction=='TO_DOCTOR'&&!!items[i].content&&items[i].type=='BIZ'){
                             var totalNum=this.state.totalNum;
                             totalNum--;
                             var numEnd=totalNum;
                             this.setState({
                                 totalNum:totalNum,
                                 numEnd:numEnd
                         })

                         }
                     }
                     if(!this.state.endding&&res.data.inquiry.status != '3'&&res.data.inquiry.status != '2'){
                         if(this.numEnd<=0){
                             this.setState({
                                 numEnd:0,
                                 endding:true,
                                 isOk:true
                             })
                         }
                     }
                     if(type!=1&&(res.data.inquiry.status=="1"||res.data.inquiry.status=="0") ){
                         this.goToTop("txt");
                        // console.log(document.querySelector(".content2").scrollTop);
                        // console.log(document.querySelector(".content2").scrollHeight);
                        // document.querySelector(".content2").scrollTop =document.querySelector(".content2").scrollHeight;

                     }
                     if(type!=1&&(res.data.inquiry.status!="1" &&res.data.inquiry.status!="0") ){
                         console.log("211");
                         document.querySelector(".txt1").scrollIntoView();
                     }

                     if (res.code == 0) {
                         this.setState({
                             list: res.data.items.reverse(),
                             fee: res.data.inquiry.totalFee,
                             orderId: res.data.inquiry.orderId,
                             doctorName: res.data.inquiry.doctorName,
                         })

                         if(res.data.inquiry.refundStatus=='1'){
                             this.setState({
                                 payBack:false
                             })
                         }
                         if (res.data.inquiry.status != 1 && res.data.inquiry.status != 0) {
                             this.setState({
                                 isEnd:true
                             })
                             clearInterval(this.state.interval);
                         }
                     }
                 }
             }, (e) => {
                 this.hideLoading();
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
    getEvaluate(){
        Api
            .evaluate1({orderId: this.props.location.query.orderId})
            .then((res) => {
                if(res.data.length>0){
                    this.setState({
                        pingShow:true,
                        isEvaluate:true,
                        newScore:res.data[0].score?res.data[0].score:'',
                        newText:res.data[0].appraisal?res.data[0].appraisal:'',
                        newItem:res.data[0].appraisalLabel?res.data[0].appraisalLabel:'',
                        newTime:this.dateTime(res.data[0].createTime?res.data[0].createTime:''),

                    })
                    this.setState({
                        newTime:this.dateTime(res.data[0].createTime?res.data[0].createTime:''),


                    });
                    console.log("nn",this.state.newtime,this.dateTime(res.data[0].createTime?res.data[0].createTime:''));
                    var str=this.state.newItem;
                    var s=[];
                    s= str.split("-");
                    this.setState({
                        itemList:0
                    })
                    for(var i=0;i<s.length;i++)
                    {
                        if(s[i]==this.state.t1.text){
                            var t1=this.state.t1;
                            var itemList=this.state.itemList;
                            t1.show=true;
                            itemList+=1;
                            this.setState({
                                t1:t1,
                                itemList:itemList
                            })

                        }
                        if(s[i]==this.state.t2.text){
                            var t2=this.state.t2;
                            var itemList=this.state.itemList;
                            t2.show=true;
                            itemList+=1;
                            this.setState({
                                t2:t2,
                                itemList:itemList
                            })

                        }
                        if(s[i]==this.state.t3.text){
                            var t3=this.state.t3;
                            var itemList=this.state.itemList;
                            t3.show=true;
                            itemList+=1;
                            this.setState({
                                t3:t3,
                                itemList:itemList
                            })

                        }
                        if(s[i]==this.state.t4.text){
                            var t4=this.state.t4;
                            var itemList=this.state.itemList;
                            t4.show=true;
                            itemList+=1;
                            this.setState({
                                t4:t4,
                                itemList:itemList
                            })

                        }
                        if(s[i]==this.state.t5.text){
                            var t5=this.state.t5;
                            var itemList=this.state.itemList;
                            t5.show=true;
                            itemList+=1;
                            this.setState({
                                t5:t5,
                                itemList:itemList
                            })

                        }
                    }
                }
            }, (e) => {
                this.hideLoading();
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });


    }
    getDocDet() {
        Api
            .getDocDet({orderId: this.props.location.query.orderId})
            .then((res) => {
                if(res.code == 0){
                    this.setState({
                        docInfo:res.data,
                        doctorid:res.data.doctorId,
                        deptid:res.data.deptId
                    })
                }
            }, (e) => {
                this.hideLoading();
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });

    }
  getHospIntro() {
    this.showLoading();
    Api.getHisInfo()
      .then((res) => {
        this.hideLoading();
        if (res.data) {
          this.setState({ hospInfo: res.data });
        }
      }, (e) => {
        this.hideLoading();
            this.setState({
                msg:e.msg,
                showIOS1:true
            })
      });
  }
    btnShow(e){
        e.stopPropagation();
        e.preventDefault();
        this.setState({
            isBtn:true
        })
    }
    btnHide(e){
        e.stopPropagation();
        e.preventDefault();
        var time=setTimeout(()=>{
            this.setState({
                isBtn:false
            })
        },200)

    }
    sendMsg(e) {
        e.stopPropagation();
        e.preventDefault();
        if(!this.state.endding){
            if (this.state.inputText!='') {
                this.setState({
                    msgText:this.state.msgText == null ? '' : null
                })
                this.send({
                    inquiryId: this.state.inquiryId,
                    operator: 'user',
                    content: this.state.inputText,
                });
                this.setState({
                    inputText:''
                })
            }
        }else{
            this.setState({
                isOk:true
            })
        }

    }
    sendMsg1(e) {
        e.stopPropagation();
        e.preventDefault();
        console.log("ss"+this.state.endding);
        if(!this.state.endding){
              console.log(this.state.inputText);
            if (this.state.inputText!='') {
                this.setState({
                    msgText:this.state.msgText == null ? '' : null
                })
                this.send({
                    inquiryId: this.state.inquiryId,
                    operator: 'user',
                    content:this.state.inputText,
                });
                this.setState({
                    isBtn:false,
                    inputText:'',
                })
            }
        }else{
            this.setState({
                isOk:true
            })
        }

    }
    input(e){
        e.stopPropagation();
        e.preventDefault();
        console.log(e.target.value);
        this.setState({
            inputText:e.target.value,
            msgText:e.target.value,
        })
    }
     send(param) {
         console.log("param",param);
         this.showLoading();
        //wepy.showLoading({ title: '发送中...', mask: true, });
         Api.sendMsg(param)
             .then((res) => {
                 this.hideLoading();
                 if (res.code == 0) {
                     this.getChat(2);
                 }
             }, (e) => {
                 this.getChat(2);
                 this.hideLoading();
                 this.setState({
                     msg:e.msg,
                     showIOS1:true
                 })
             });


    }
    hidePlus() {
        this.setState({
            showPlus:false
        })
    }
    showPlus() {
        this.setState({
            showPlus:!this.state.showPlus
        })
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
                this.hideLoading();
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });

    }
    handleChange = (info) => {
        console.log("121");
            this.setState({
                open:false
            })
        var imgArr=[];
        for(var i=0;i<=info.fileList.length-1;i++){
            imgList.push('https://ihoss.oss-cn-beijing.aliyuncs.com/'+this.state.key+'/'+uuList[i]+info.fileList[i].name.substring(info.fileList[i].name.length-4,info.fileList[i].name.length))
            imgArr.push('https://ihoss.oss-cn-beijing.aliyuncs.com/'+this.state.key+'/'+uuList[i]+info.fileList[i].name.substring(info.fileList[i].name.length-4,info.fileList[i].name.length));
        }
        let fileList = info.fileList;

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
            console.log(imgArr);
                if(info.fileList[0].status=="done"){
                    this.send({
                        inquiryId: this.state.inquiryId,
                        operator: 'user',
                        url: 'https://ihoss.oss-cn-beijing.aliyuncs.com/'+this.state.key+'/'+uuList[uuList.length-1]+'.png',
                    });
                }



        this.setState({ fileList });




    }
    openModal() {
        this.setState({
            isShow:true
        })

    }
    cancel() {
        this.setState({
            isShow:false,

        })

    }


    sure(){
        this.setState({
            isShow:false,
            isEnd:true,
            isEvaluate:false,

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
                     msg:e.msg,
                     showIOS1:true
                 })
             });
     }
    previewImg(url){
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
            score:id
        })
    }
    //评价标签
    setAppraisal(id){
        if(id==1){
            var t1=this.state.t1;
            t1.show=!this.state.t1.show;
            this.setState({
                t1:t1
            })
        }
        if(id==2){
            var t2=this.state.t2;
            t2.show=!this.state.t2.show;
            this.setState({
                t2:t2
            })        }
        if(id==3){
            var t3=this.state.t3;
            t3.show=!this.state.t3.show;
            this.setState({
                t3:t3
            })
        }
        if(id==4){
            var t4=this.state.t4;
            t4.show=!this.state.t4.show;
            this.setState({
                t4:t4
            })        }
        if(id==5){
            var t5=this.state.t5;
            t5.show=!this.state.t5.show;
            this.setState({
                t5:t5
            })
        }
        console.log("id"+id);

    }
    setATxt(e){
        this.setState({
            txtNum:e.target.value.length,
            appraisal: e.target.value
        })

    }
    saveContent(e){
        this.setState({
            txtNum:e.target.value.length,
            appraisal: e.target.value
        })
    }
    submitEvaluate(){
           var  appraisalLabel1='';
        if(this.state.t1.show==true){
            console.log("t1")
            appraisalLabel1+=this.state.t1.text+"-";
            this.setState({
                appraisalLabel:appraisalLabel1
            })
            console.log(appraisalLabel1)
            console.log(this.state.appraisalLabel)

        }
        if(this.state.t2.show==true){
            console.log("t1")

            appraisalLabel1+=this.state.t2.text+"-";
            this.setState({
                appraisalLabel:appraisalLabel1
            })
        }
        if(this.state.t3.show==true){
            console.log("t1")

            appraisalLabel1+=this.state.t3.text+"-";
            this.setState({
                appraisalLabel:appraisalLabel1
            })
        }
        if(this.state.t4.show==true){
            console.log("t1")

            appraisalLabel1+=this.state.t4.text+"-";
            this.setState({
                appraisalLabel:appraisalLabel1
            })
        }
        if(this.state.t5.show==true){
            console.log("t1")

            appraisalLabel1+=this.state.t5.text+"-";
            this.setState({
                appraisalLabel:appraisalLabel1
            })
        }
        console.log("ss",appraisalLabel1);
        this.setState({
            appraisalLabel:appraisalLabel1.substring(0,appraisalLabel1.length-1)
        })
        console.log("sta",this.state.appraisalLabel);
        const doctor = this.state.docInfo;
        this.setState({
            doctorName:doctor.doctorName
        })
        const params = {
            hisName: doctor.hisName,
            deptId: doctor.deptId,
            deptName: doctor.deptName,
            doctorId: doctor.doctorId,
            doctorName: doctor.doctorName,
            name: this.state.userInfo.realName,
            appraisal: this.state.appraisal,
            appraisalLabel:appraisalLabel1.substring(0,appraisalLabel1.length-1),
            score: this.state.score,
            orderId: this.state.orderId,
        };
        console.log(params);
        Api.evaluate(params)
            .then((res) => {
                this.hideLoading();
                if (res.code == 0) {
                   /* await wepy.showToast({
                        title: '评价成功！',
                        icon: 'success'
                    });
*/
                    this.showToast();
                    console.log(this.state.isEvaluate+"endE3");
                    this.end=true;
                    this.setState({
                        end:true,
                    })
                    this.getEvaluate();
                    console.log(this.state.end+"end");

                }
            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });

    }
    play(item){
        event.stopPropagation();//防止冒泡
        for(var i=0;i<this.state.list.length;i++){
            if(this.state.list[i].voiceTime>0){
                var audio = document.getElementById("s"+this.state.list[i].id);
                if(item=="s"+this.state.list[i].id){
                    if(audio.paused){ //如果当前是暂停状态
                        console.log("1")
                        audio.play(); //播放
                        return;
                    }else{//当前是播放状态
                        console.log("2")
                        audio.pause(); //暂停
                    }
                }else{
                    audio.pause(); //暂停
                }
            }

        }

        /*var audio = document.getElementById(item);
        console.log(item);

        if(audio.paused){ //如果当前是暂停状态
            console.log("1")
            audio.play(); //播放
            return;
        }else{//当前是播放状态
            console.log("2")
            audio.pause(); //暂停
        }*/
/*//                     if(this.flag==0) {
//                         this.innerAudioContext = wx.createAudioContext('myAudio'+item);
//                         this.innerAudioContext.play();
//                         this.innerAudioContext.seek(0);
//                         this.prevText=item;
//
//                         this.flag=1;
//
//
//                     }else {
//                this.prevText=item;

        this.nextprevText=item;
        console.info(this.nextprevText+'------start');

        if(this.nextprevText==this.prevText){
            this.innerAudioContext = wx.createAudioContext('myAudio'+this.prevText);
            this.innerAudioContext.pause();
            this.prevText=11;
        }else{

            console.info(this.prevText+'------');
            console.info(this.nextprevText+'------stop');

            this.innerAudioContext = wx.createAudioContext('myAudio'+this.prevText);
            this.innerAudioContext.pause();
            this.innerAudioContext = wx.createAudioContext('myAudio'+item);
            //this.nextprevText=item;
            this.innerAudioContext.play();
            this.innerAudioContext.seek(0);

            this.flag=0;
//                }

            this.prevText=item;

        }

        /!*var url;
         var id;
         for(var i=0;i<this.list.length;i++){
         if(this.list[i].id==e.currentTarget.dataset.id)
         {
         url=this.list[i].url;
         }
         }
         this.isPlay=!this.isPlay;
         const innerAudioContext=wx.createInnerAudioContext();
         innerAudioContext.src=url;
         if(this.isPlay){
         this.isDuration=true;
         var dd=decodeURIComponent(url);
         var res = wx.getSystemInfoSync();
         if (res.platform == 'ios') {
         innerAudioContext.obeyMuteSwitch=false;
         innerAudioContext.title='play';
         innerAudioContext.startTime=1;
         innerAudioContext.play();
         innerAudioContext.onPlay((res)=>{
         console.log(innerAudioContext.duration);
         });

         } else {
         ;
         innerAudioContext.play();
         console.log(innerAudioContext.duration);

         }
         }else{

         innerAudioContext.onPlay((res)=>{
         innerAudioContext.stop();
         console.log(innerAudioContext.duration);
         });

         }*!/*/
    }
     goToTop(name) {
         //document.body.scrollTop=100000;
         document.getElementById("content2").scrollTop=10900;
         console.log("s"+document.getElementById("content3").scrollTop);
         //console.log("s"+document.body.scrollTop);
         /*var wH=document.body.offsetHeight;
         var sH=document.body.scrollHeight;
         var s=document.getElementById("box").offsetHeight ;
         document.getElementById("box").offsetHeight=sH;
         var s=document.getElementById("box").offsetHeight ;
         console.log(wH,sH,s);*/
         /* setTimeout(()=>{
              element.scrollIntoView();
          },0);
          console.log(document.getElementById("box"));
          var element = document.getElementById("box");
 */

         //element.scrollIntoView(false);
         //element.scrollIntoView({block: "end"});
         //element.scrollIntoView({behavior: "instant", block: "end", inline: "nearest"});
         //document.querySelector("body").animate({scrollTop: document.querySelector(".txt").top}, 500);
        // document.querySelector("html").animate({scrollTop: document.querySelector(".txt").offset().top}, 500);
    }
  render() {
    const {isEvaluate,orderId,list,msgText,isShow,isEnd,docInfo,userInfo,doctorid,deptid,showPlus,interval,
        name,inquiryId,userId,showId,uId,patHisNo,score,txtNum,t1,t2,t3,t4,t5,timeShow,numEnd,pics,innerAudioContext,
        appraisalLabel,appraisal,pingShow,newScore,itemList,detail,payBack,isOk,newText ,isDuration,newItem,
        newTime,doctorName,msg,endding,end,sign,signature,formData,policy,callback,OSSAccessKeyId,key,evaluateTime,isBtn,inputText,isPlay,prevText,nextprevText}=this.state
      const props = {
          action: 'https://ihoss.oss-cn-beijing.aliyuncs.com',
          onChange: this.handleChange,
          multiple: false,
          data:{signature:signature,
                policy:policy,
                callback:callback,
                OSSAccessKeyId:OSSAccessKeyId,
                key:key+"/"+this.getUuid()+".png"}

      };
      return (
    <div style={{height:'100%'}}>
        <div className="container1"
           >
            <Toast icon="success-no-circle" show={this.state.showToast}>评价成功</Toast>
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
          {/*<div className="container" @tap="hidden" >*/}

            {!isEnd&&<div className='header' >
                <div>
                  <div className="time">剩余时间： <span>{timeShow}</span></div>
                  <div className="num">剩余条数： <span>{numEnd}</span> 条</div>
                </div>
                <div>
                  <span  onClick={()=>{
                  this.openModal()

                  }}>结束咨询</span>
                </div>
              </div>}
            {!isEnd&&<div className='operation-box'>
                <div className='top'>
                    <TextArea  autosize  value={msgText}
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

                    {!isBtn&&
                            <img src='../../../resources/images/plus.png'  onClick={()=>{
                            this.showPlus()

                            }}/>

                    }
                    {isBtn&&<span className="addBtn"  onClick={
                  (e)=>{
                      e.stopPropagation();
                      e.preventDefault();

               this.sendMsg1(e)

                  }
                  }>发送</span>}
                </div>
                {showPlus&&<div className='bottom' >

                    <Upload
                        {...props} fileList={this.state.fileList}>
                        <div onClick={()=>{
                                        this.setState({
                                          open:true
                                        })

                                        }}>
                            <img src='../../../resources/images/tp.png' />
                        </div>
                    </Upload>

                </div>}
            </div>}
             <div className={`header1 ${isEnd ? '': 'showTxt'}`}>咨询已结束</div>
             <div    className={`content3 ${isEnd?'contents':''}`}  id='content3'
                 onClick={()=>{
            this.hidePlus()

             }}>

              <div className='content2'  id="content2">
                  {list.reverse()&&list.reverse().map((item,index)=>{
                     return(
                         <div key={index}  className="content-item">
                             {item.type == 'SYSTEM' && item.userIsShow == '1'&&
                             <div  className="msg" >
                                 {item.content}
                                 {/* <wxparser rich-text="{{item.content}}" />*/}
                             </div>}

                             {item.type == 'BIZ'&&item.userIsShow == '1'&&<div className='date' >{item.createTime}</div>}
                             {item.type == 'BIZ'&&item.direction == 'TO_USER' && item.userIsShow == '1'&&item.voiceTime==0&&
                             <div  className='left'
                                   >
                                 <div className='img'>
                                     <span style={{fontSize:'10px'}}> {doctorName}</span>
                                 </div>
                                 {item.content&&<div className='text' >{item.content}</div>}
                                 {item.url&&item.action!=='add'&&<div
                                     className='image'
                                      onClick={()=>{
                                     this.previewImg(item.url)

                                      }}
                                     >
                                     <i/><img src={item.url}  width="105px" height="109px"/>
                                 </div>}
                                 {item.url&&item.action=='add'&&<div
                                     className='image'
                                     onClick={()=>{
                                     this.into(item.actionTrigger)

                                      }}
                                     >
                                     <i/><img src={item.url}   width="105px" height="109px"/>
                                 </div>}
                                 {item.url&&<div className='flex' ></div>}
                             </div>}
                             {item.voiceTime>0&&<div id="a" className='left slide' >
                                 <div className='img'>
                                     <span style={{fontSize:'10px'}}> {doctorName}</span>
                                 </div>
                                 {item.voiceTime&&<div
                                     onClick={()=>{
                                        this.play('s'+item.id)

                                         }}
                                     className={`text radio ${item.voiceTime<5?'wid5':''} ${item.voiceTime<10&&item.voiceTime>=5?'wid6':''} ${item.voiceTime<20&&item.voiceTime>=10?'wid7':''} ${item.voiceTime>=20?'wid8':''}`} >
                                     {/*<i/>@tap="play({{index}})" data-id="{{item.id}}" style="width:{{item.voiceTime*5+25}}rpx"*/}
                                     <img className="rd"  src="../../../resources/images/rd.png"

                                         />
                                     <audio id={'s'+item.id}><source src={item.url} type="audio/mp3" /></audio>


                                     <span className={`${isDuration?'duration':'dura'}`}>{item.voiceTime}</span>
                                 </div>}

                                 {item.url&&<div className='flex' ></div>}

                                {/* <audio  src="{{item.url}}" id="myAudio{{index}}" ></audio>*/}

                             </div>}
                             {item.direction == 'TO_DOCTOR' && item.userIsShow == '1'&&<div id="s"  className='right'>
                                 <div className='flex'></div>
                                 {item.url&&item.action!=='add'&&<div className='image'
                                                                      onClick={()=>{
                                      this.previewImg(item.url)

                                      }}

                                     >
                                     {/*<i/>@tap="previewImg" data-preurl="{{item.url}}" @longpress="longtap({{item.id}})" style="{{item.action=='add'?'width:447rpx;height:173rpx;':''}}"*/}
                                     <img src={item.url}  width="105px" height="109px"/>
                                     {/*<div className="tip no " >
                                        {/*<i/>wx:if="{{chatWxs.isShow(item.id, showId)}}"

                                        {{chatWxs.isRevoke(item.createTime) ? '' : 'nocopy'}}*!/}

                                         <span @tap.stop="delOrRe({{item.id}}, 'del')">删除</span>
                                         <span @tap.stop="delOrRe({{item.id}}, 'revoke')" wx:if="{{chatWxs.isRevoke(item.createTime)}}">撤销</span>
                                     </div>*/}
                                 </div>}
                                 {item.url&&item.action=='add'&&<div className='image' >
                                     {/*<i/>wx:if="{{}}" @tap="into({{item.actionTrigger}})"  data-preurl="{{item.url}}" @longpress="longtap({{item.id}})" style="{{item.action=='add'?'width:447rpx;height:173rpx;':''}}"*/}
                                     <img src={item.url}   width="105px" height="109px"/>
                                     {/*<div className="tip no {{chatWxs.isRevoke(item.createTime) ? '' : 'nocopy'}}" wx:if="{{chatWxs.isShow(item.id, showId)}}">
                                         <i/>
                                         <span @tap.stop="delOrRe({{item.id}}, 'del')">删除</span>
                                         <span @tap.stop="delOrRe({{item.id}}, 'revoke')" wx:if="{{chatWxs.isRevoke(item.createTime)}}">撤销</span>
                                     </div>*/}
                                 </div>}
                                 {item.content&&<div className='text'>
                                     {/*<i/>wx:if="{{}}" @longpress="longtap({{item.id}})"*/}
                                     {item.content}
                                     {/*<div className="tip {{chatWxs.isRevoke(item.createTime) ? '' : 'no'}}" wx:if="{{chatWxs.isShow(item.id, showId)}}">
                                         <i/>
                                         <span @tap="copy({{item.content}})">复制</span>
                                         <span @tap="delOrRe({{item.id}}, 'del')">删除</span>
                                         <span @tap="delOrRe({{item.id}}, 'revoke')" wx:if="{{chatWxs.isRevoke(item.createTime)}}">撤销</span>
                                     </div>*/}
                                 </div>}
                                 <div className='img'>
                                     <img src={userInfo.headImage} />
                                     {/*<open-data type="userAvatarUrl" />*/}
                                 </div>
                             </div>}

                         </div>

                     )

                  })}
                  <div className="txt"   name="txt" style={{height:'30px'}}></div>

              </div>
                 {isEnd&&<div className="card" sytle={{height:'450px'}}></div>}
        </div>


            {isOk&&<div className='modal' >
                <div className='modal-body'>
                    <div className='modal-title'>提示</div>
                    <div className='modal-content'>您本次咨询条数已用完，如需再次咨询请重新选择咨询</div>
                    <div className='modal-footer'>
                    <span  onClick={()=>{
                    this.sureNo()

                    }}>确定</span>
                    </div>
                </div>
            </div>}

            {isShow&&<div className='modal' >
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
        {isEvaluate&&<div className={`pingJia2  ${isEnd &&isEvaluate&&payBack ? '': 'showTxt' }`}>
            <div className="title">患者评价</div>
                  <div className="ping">
                      <div className="xing">星级：
                          <div  className="star">
                            {newScore <1&&<img src="../../../resources/images/starH.png" />}
                              {newScore >=1&&<img src="../../../resources/images/starS.png" />}

                          </div>
                          <div  className="star">
                              {newScore <2&&<img src="../../../resources/images/starH.png" />}
                              {newScore >=2&&<img src="../../../resources/images/starS.png" />}

                          </div>
                          <div  className="star">
                              {newScore <3&&<img src="../../../resources/images/starH.png" />}
                              {newScore >=3&&<img src="../../../resources/images/starS.png" />}
                          </div>
                          <div  className="star">
                              {newScore <4&&<img src="../../../resources/images/starH.png" />}
                              {newScore >=4&&<img src="../../../resources/images/starS.png" />}
                          </div>
                          <div  className="star">
                              {newScore <5&&<img src="../../../resources/images/starH.png" />}
                              {newScore >=5&&<img src="../../../resources/images/starS.png" />}
                          </div>
                      </div>
                  </div>
                  <div className={`ping-content ${itemList>=1&&itemList<=3?'conmidHeight':''} ${itemList==0?'conminHeight':''}`} >
                    <div className={`active ${t1.show ? '': 'showTxt' }`}>{t1.text}</div>
                      <div className={`active ${t2.show ? '': 'showTxt' }`}>{t2.text}</div>
                      <div className={`active ${t3.show ? '': 'showTxt' }`}>{t3.text}</div>
                      <div className={`active ${t4.show ? '': 'showTxt' }`}>{t4.text}</div>
                      <div className={`active ${t5.show ? '': 'showTxt' }`}>{t5.text}</div>
                  </div>
                  <div className="ping-info">
                    <span className="text1">评价详情：</span>
                    <span className="text2">{!!newText?newText:'无'}</span>
                  </div>
                  <div className="ping-time">
                    <span className="text1">评价时间：</span>
                    <span className="text2">{newTime}</span>
                  </div>
                  <div className="consult-again">
                    <Link   className="again"
                        to={{
                        pathname:'/consult/deptdetail',
                        query:{doctorId:doctorid,deptId:deptid}
                        }}
                        >再次咨询</Link>
                  </div>

          </div>}
        {!isEvaluate&&<div className={`pingJia ${isEnd&&!isEvaluate&&!end&&payBack ? '': 'showTxt'}`}>
                 <div className="title">请对本次咨询进行评价</div>
                  <div className="ping">
                    <div className="xing">星级：
                      <div  className="star"
                          onClick={()=>{
                         this.setScore(1)
                          }}>
                          {score <1&&<img src="../../../resources/images/starH.png" />}
                          {score >=1&&<img src="../../../resources/images/starS.png" />}

                      </div>
                        <div  className="star"
                              onClick={()=>{
                         this.setScore(2)
                          }}>
                            {score <2&&<img src="../../../resources/images/starH.png" />}
                            {score >=2&&<img src="../../../resources/images/starS.png" />}

                        </div>
                        <div  className="star"
                              onClick={()=>{
                         this.setScore(3)
                          }}>
                            {score <3&&<img src="../../../resources/images/starH.png" />}
                            {score >=3&&<img src="../../../resources/images/starS.png" />}

                        </div>
                        <div  className="star"
                              onClick={()=>{
                         this.setScore(4)
                          }}>
                            {score <4&&<img src="../../../resources/images/starH.png" />}
                            {score >=4&&<img src="../../../resources/images/starS.png" />}

                        </div>
                        <div  className="star"
                              onClick={()=>{
                         this.setScore(5)
                          }}>
                            {score <5&&<img src="../../../resources/images/starH.png" />}
                            {score >=5&&<img src="../../../resources/images/starS.png" />}

                        </div>
                    </div>
                    <div className="xing-dian">点击星星评分</div>
                  </div>
                  <div className="ping-content">
                    <div  className={`${t1.show ? 'active' : ''}`} onClick={()=>{
                    this.setAppraisal(1)

                    }}>{t1.text}</div>
                      <div  className={`${t2.show ? 'active' : ''}`} onClick={()=>{
                    this.setAppraisal(2)

                    }}>{t2.text}</div>
                      <div  className={`${t3.show ? 'active' : ''}`} onClick={()=>{
                    this.setAppraisal(3)

                    }}>{t3.text}</div>
                      <div  className={`${t4.show ? 'active' : ''}`} onClick={()=>{
                    this.setAppraisal(4)

                    }}>{t4.text}</div>
                      <div  className={`${t5.show ? 'active' : ''}`} onClick={()=>{
                    this.setAppraisal(5)

                    }}>{t5.text}</div>
                  </div>
                  <div className="ping-area">

                      <TextArea value={appraisal}
                                   placeholder="请输入您需要咨询的内容"
                                   onChange={(e)=>{

                                  this.setATxt(e)

                                   }}
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

                        }}> 确定评价 </button>
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
