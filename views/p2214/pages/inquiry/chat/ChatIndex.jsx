import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import { Link } from 'react-router';
import { ImagePicker } from 'antd-mobile';
import { Input,Upload,Anchor,Icon, Modal} from 'antd';
const { TextArea } = Input;
import hashHistory from 'react-router/lib/hashHistory';
import * as Utils from '../../../utils/utils';
import { getTodayDate } from '../../../utils/utils';
import tanhao from '../../../resources/images/tanhao.png';
import * as Api from '../../../components/Api/Api';
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
var socket='';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
            reportDate:'',
            userData:'',
            btnHideTime:'',
            inputTime:'',
            btnTime:'',
            socketTime:'',
            chatTime:'',
            hideTime:'',
            isEvaluate: false,
            orderId: '',
            list: [],
            msgText: '', 
            isShow: false,
            isEnd: false,
            docInfo: {},
            userInfo: JSON.parse(window.localStorage.getItem('userInfo')),
            doctorid: '',
            deptid: '',
            doctorType:"",
            inquiryList:0,
            doctorName: '',
            deptName:"",
            type:"",
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
            interval:'',
            interval1:'',
            patHisNo: '',
            docScore: 5,
            hisScore:5,
            txtNum: 0,
            txtNum1: 0,
            docList:[
                 {text: '态度好', show: false},
                 {text: '及时回复', show: false},
                 {text: '解答详细', show: false},
                 {text: '很专业', show: false},
                 {text: '非常感谢', show: false},
            ],
            hisList:[
                {text: '服务完善', show: false},
                {text: '价格合理', show: false},
                {text: '制度规范', show: false},
                {text: '流程简单', show: false},
                {text: '系统稳定', show: false},
           ],
            appraisalLabel: '',
            appraisalLabel1: '',
            appraisal: '',
            appraisal1: '',
            pingShow: true,
            newScore: '',
            // 医院评价星级
            newHisScore:'',
            // 医生评价详情
            doctorPingjia:'',
            // 医院评价详情
            newHisText:'',
            // 管理员回复
            gmPingJia:'',
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
                        onClick: Utils.hideDialog.bind(this)
                    }
                ]
            },
            style2: {
                title: '提示',
                buttons: [
                    {
                        type: 'default',
                        label: '取消',
                        onClick: Utils.hideDialog.bind(this)
                    },
                    {
                        type: 'primary',
                        label: '确定',
                        onClick: Utils.hideDialog.bind(this)
                    }
                ]
            },
            msg: '',
            scroll:true,
            match:[],
            files:[],
            canEnd:false,//是否可以结束
            noDoctor:false,//医生是否回复
            tipShow:false,//时间没到提示不可结束
            isIos:false,
            freeReport:false,//是否是免费报告解读
            hieghtMore:false,//发送按钮位置
            docPlace:false,//是否显示输入
            hisPlace:false,
            isadvise:false,//建议按钮
            // 评价显示
            isPingJia:false,
            // 没有发送出去，内容存储、
            secondInputText:[],
            // 没法送出去的文字次数
            untextsendNumN:0,
            // 图片没发送出去，内容存储
            imgFormData:[],
            // 没法送出去的图片base64
            unsendImg:[],
            // 没法送出去的图片名称
            filenames:[],
            // 没法送出去的图片次数
            unimgsendNumN:0,
            // 图片，文字没发出去的次数
            // unsendNum:0,
            // 图片，文字没发出去的对象内容
            unsendList:[],
        };
    }
    componentDidMount() {
       // document.getElementsByClassName("content2").scrollIntoView()  
        imgList=[];
        var ua = navigator.userAgent.toLowerCase();//获取浏览器的userAgent,并转化为小写——注：userAgent是用户可以修改的
        var isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);//判断是否是苹果手机，是则是true
        this.setState({
            isIos:isIos
        });
        var storage=window.localStorage;
        //写入b字段
        storage.loc='2';
           //隐藏分享等按钮
      Utils.getJsByHide();
        this.getJs1();
        this.setState({
            userInfo: JSON.parse(window.localStorage.getItem('userInfo')),
            name: this.props.location.query.name,
            inquiryId: this.props.location.query.inquiryId,
            isEvaluate: this.props.location.query.status ==3,

        })
        this.getChat(3);
        this.getAIReport();
        document.getElementById("txt").setAttribute("style", "padding-bottom:"+window.getComputedStyle(document.getElementsByClassName("operation-box")[0]).height);
      //  this.toBottom()
    }
 
  
    componentWillMount(){
        this.mounted = true;
    }
    componentWillUnmount() {
        
        this.mounted = false;
        imgList=[];
        if(this.mounted){
            this.setState({
                imgArr:[],
                imgArr1:[],
            })  
        }
        clearTimeout(this.state.btnHideTime);
        clearTimeout(this.state.btnTime);
        clearTimeout(this.state.inputTime);
        clearTimeout(this.state.socketTime);
        clearTimeout(this.state.chatTime);
        clearTimeout(this.state.hideTime);
        clearInterval(this.state.interval);
        clearInterval(this.state.interval1);
        clearInterval(this.state.interval2);
        clearInterval(interval);
        clearInterval(interval1); 
        clearInterval(interval2);
          document.getElementsByTagName("body")[0].setAttribute("style", "position:inherit")
    }
    timestampFordate(timeStamp, type = 'Y-M-D H:I:S', auto = false){
        let time = (timeStamp + '').length === 10 ? new Date(parseInt(timeStamp) * 1000) : new Date(parseInt(timeStamp));
        let _year = time.getFullYear();
        let _month = (time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1);
        let _date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
        let _hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
        let _minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
        let _secconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
        let formatTime = '';
        let distinctTime = new Date().getTime() - time.getTime();
        if (auto) {
            if (distinctTime <= (1 * 60 * 1000)) {
                // console.log('一分钟以内，以秒数计算');
                let _s = Math.floor((distinctTime / 1000) % 60);
                formatTime = _s + '秒前';
            } else if (distinctTime <= (1 * 3600 * 1000)) {
                // console.log('一小时以内,以分钟计算');
                let _m = Math.floor((distinctTime / (60 * 1000)) % 60);
                formatTime = _m + '分钟前';
            } else if (distinctTime <= (24 * 3600 * 1000)) {
                // console.log('一天以内，以小时计算');
                let _h = Math.floor((distinctTime / (60 * 60 * 1000)) % 24);
                formatTime = _h + '小时前';
            } else if (distinctTime <= (30 * 24 * 3600 * 1000)) {
                let _d = Math.floor((distinctTime / (24 * 60 * 60 * 1000)) % 30);
                formatTime = _d + '天前';
                // console.log('30天以内,以天数计算');
            } else {
                // 30天以外只显示年月日
                formatTime = _year + '-' + _month + '-' + _date;
            }
        } else {
            switch (type) {
                case 'Y-M-D H:I:S':
                    formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours + ':' + _minutes + ':' + _secconds;
                    break;
                case 'Y-M-D H:I:S zh':
                    formatTime = _year + '年' + _month + '月' + _date + '日  ' + _hours + ':' + _minutes + ':' + _secconds;
                    break;
                case 'Y-M-D H:I':
                    formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours + ':' + _minutes;
                    break;
                case 'Y-M-D H':
                    formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours;
                    break;
                case 'Y-M-D':
                    formatTime = _year + '-' + _month + '-' + _date;
                    break;
                case 'Y-M-D zh':
                    formatTime = _year + '年' + _month + '月' + _date + '日';
                    break;
                case 'Y-M':
                    formatTime = _year + '-' + _month;
                    break;
                case 'Y':
                    formatTime = _year;
                    break;
                case 'M':
                    formatTime = _month;
                    break;
                case 'D':
                    formatTime = _date;
                    break;
                case 'H':
                    formatTime = _hours;
                    break;
                case 'I':
                    formatTime = _minutes;
                    break;
                case 'S':
                    formatTime = _secconds;
                    break;
                default:
                    formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours + ':' + _minutes + ':' + _secconds;
                    break;
            }
        }
        // 返回格式化的日期字符串
        return formatTime;
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

    //滑动到页面底部
    toBottom(){
        console.log(111)
        document.getElementsByClassName("content2")[0].scrollIntoView(false)
    }
    /*获取咨询信息*/
    getChat(type) {
        if(type==3){
            console.log(333,type)
            this.showLoading();
           
        }
        if(this.state.showPlus&&window.location.hash.indexOf('chat')!=-1){
            document.getElementById("txt").setAttribute("style", "padding-bottom:"+window.getComputedStyle(document.getElementsByClassName("operation-box")[0]).height
            );
            var s=document.getElementsByClassName("content3")[0].scrollHeight;
            console.log("ssstate8888");
            document.getElementsByClassName("content3")[0].scrollTop=500000;
        }
        Api
            .getChat({inquiryId: this.props.location.query.inquiryId, operator: 'user'})
            .then((res) => {
                if (res.code == 0) {
                     console.log("resdata",res)
                     this.toBottom()
                    if(this.mounted){
                        this.setState({
                            userData:res.data.patient,
                            patientName: res.data.inquiry.patientName,
                            patCardNo: res.data.inquiry.patCardNo,
                            userId: res.data.inquiry.userId,
                            uId: res.data.inquiry.userId,
                            orderId: res.data.inquiry.orderId,
                            patHisNo: !!res.data.patient&&res.data.patient.patHisNo,
                            status: res.data.inquiry.status, 
                            freeReport:res.data.inquiry.purposeType=='9'?true:false,
                            doctorid:res.data.inquiry.doctorId,
                            deptid: res.data.inquiry.deptId,
                            doctorType: res.data.inquiry.doctorType,
                            deptName:res.data.inquiry.deptName,
                            doctorName:res.data.inquiry.doctorName,
                            type:res.data.inquiry.type
                        })
                        if(this.state.status=="2" || this.state.status=="3"){
                            this.setState({
                                isadvise:true
                            })
                        }
                       
                    }
                    if(type==3){
                        console.log(30,type)
                        console.log(res.data.inquiry.orderId,"orderId")
                       // this.getDocDet(res.data.inquiry.orderId,res.data.inquiry.doctorId);
                    }
                    if(res.data.inquiry.status!='0'&&res.data.inquiry.status!='1') {
                        this.getEvaluate(res.data.inquiry.orderId);
                    }
                      interval1 = setInterval(() => {
                        if(this.state.freeReport){
                            if(res.data.inquiry.finishTime){
                                var dd = 172800000 + res.data.inquiry.finishTime;
                                var d = new Date().getTime();
                                if(this.mounted){
                                this.setState({
                                    timeShow: !!this.MillisecondToDate(dd - d).toString() ? this.MillisecondToDate(dd - d).toString() : '',
                                    totalNum: 5
                                })
                            }
                        }
                        }else{
                            var dd = 172800000 + res.data.inquiry.createTime;
                            var d = new Date().getTime();
                            if(this.mounted){
                            this.setState({
                                timeShow: !!this.MillisecondToDate(dd - d).toString() ? this.MillisecondToDate(dd - d).toString() : '',
                                totalNum: 5
                            })
                        }
                    }
                      }, 1000);
                      if(this.mounted){
                    this.setState({
                            interval:interval,
                            interval1:interval1
                    })   
                }           
                if (res.data.items.length > 0) {
                    if(this.mounted){
                        this.setState({
                            isEvaluate: res.data.inquiry.status == '3',
                            totalNum: 5,
                            orderId: res.data.inquiry.orderId
                        })
                    }
                    for (let i = 0; i < res.data.items.length; i++) {
                        if(res.data.items[i].action=='applyChronic'){
                            this.setState({
                                totalNum:11,
                            })
                            break;
                        }
                    }
                }
                    var items = res.data.items;
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].direction == 'TO_DOCTOR' && !!items[i].content && items[i].type == 'BIZ'&&items[i].content.indexOf('checkItem')==-1&&items[i].action!='mdt') {
                            var totalNum = this.state.totalNum;
                            totalNum--; 
                            var numEnd = totalNum;
                            if(this.mounted){
                                this.setState({
                                    totalNum: totalNum,
                                    numEnd: numEnd
                                })
                            }
                        }
                    }
                    if (!this.state.endding && res.data.inquiry.status != '3' && res.data.inquiry.status != '2') {
                        if (this.state.numEnd <= 0) {
                            if(this.mounted){
                            this.setState({
                                numEnd: 0,
                                endding: true,
                            })
                        }
                    }
                    }
                    if (res.code == 0) {
                        if(this.mounted){
                        this.setState({
                            list: res.data.items.reverse(),
                            fee: res.data.inquiry.totalFee,
                            orderId: res.data.inquiry.orderId,
                            doctorName: res.data.inquiry.doctorName,
                        })
                    }
                    var list=res.data.items;
                    for(var index=0;index<list.length;index++){
                        console.log(list[index].action)
                      if(!!list[index].action&&list[index].action=='addChecklist'&&list[index].content!=''){
                          var cont=list[index].content.replace(/'/g, '"');
                          list[index].checkContent=JSON.parse(cont);
                          var s='';
                          for(var i=0;i<JSON.parse(cont).checkItem.length;i++){
                              if(i==0){
                                s=s+JSON.parse(cont).checkItem[i];
                              }else{
                                s=s+' 、'+JSON.parse(cont).checkItem[i]
                              }  
                          }  
                          list[index].checkContent.checkItem=s;
                      }
                      console.log("aaapply")  
                      if(!!list[index].action&&list[index].action=='reportApply'&&list[index].content!=''){
                      
                        var cont=list[index].content.replace(/'/g, '"');
                            list[index].checkContent=JSON.parse(cont);
                            
                        }
                        if(!!list[index].action&&list[index].action=='mdt'&&list[index].content!=''){
                      
                            var cont=list[index].content.replace(/'/g, '"');
                                list[index].checkContent=JSON.parse(cont);
                                list[index].checkContent.dept=JSON.parse(cont).dept.join(',')
                                
                            }
                        if(!!list[index].action&&list[index].action=='applyChronic'&&list[index].content!=''){
                            list[index].checkContent=JSON.parse(list[index].content);
                            
                        }
                        if(!!list[index].action&&list[index].action=='receiveChronic'&&list[index].content!=''){
                  
                            list[index].checkContent=JSON.parse(list[index].content);
                            
                        }
                        /*if(!!list[index].content &&list[index].action !== 'addChecklist'&&list[index].action!='reportApply'&&
                            list[index].action!='add'&&list[index].action!='mdt'&&list[index].action!='applyChronic'&&list[index].action!='receiveChronic'){
                            list[index].content=this.tiaozhuan(list[index].content)
                        }*/
                    
                    }
                    // 追加页面未发送的数据
                  this.setState({
                    list: list.concat(this.state.unsendList),
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
                                     canEnd:false,
                                    
                                 })
                                
                             }else{
                               
                                this.setState({
                                    canEnd:true,
                                    
                                })
                            
                             }  
                        }else{
                           
                            this.setState({
                                canEnd:true,
                        
                            })
                        
                        }
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
                              if(this.mounted){
                           this.setState({
                               match:match
                           })
                        }
                       }
                        this.state.chatTime=setTimeout(()=>{
                            var strheight = window.getComputedStyle(document.getElementById("content2")).webkitLogicalHeight;
                            var height = strheight.substring(0, strheight.length - 2);
                            if (this.state.status != "2" &&this.state.status != "3") {
                                if(this.state.inquiryList<res.data.items.length||type==2||type==3){
                                    if(window.location.hash.indexOf('chat')!=-1){
                                        var s=document.getElementsByClassName("content3")[0].scrollHeight;
                                        document.getElementsByClassName("content3")[0].scrollTop=500000;
                                        console.log(s,document.getElementsByClassName("content3")[0].scrollTop);
                                        console.log("ssstate111111");
                                    }
                                    
                                    if(this.mounted){
                                    this.setState({
                                        inquiryList:res.data.items.length
                                    })
                                }
                                    if(type==3){
                                        this.hideLoading();
                                    }
                                }else{
                                    if(this.mounted){
                                    this.setState({
                                        scroll:true
                                    })
                                }
                            }
                                if (height < 500) {
                                    document.getElementsByTagName("body")[0].setAttribute("style", "position:fixed")
                                } else {
                                    document.getElementsByTagName("body")[0].setAttribute("style", "position:inherit")
                                }
                            } else {
                                    document.getElementsByTagName("body")[0].setAttribute("style", "position:inherit")
                            }
                        },1000)
                        if (res.data.inquiry.refundStatus ==1) {
                            if(this.mounted){
                            this.setState({
                                payBack: false
                            })
                        }
                        }
                        if (res.data.inquiry.status != 1 && res.data.inquiry.status != 0) {
                            
                            if(this.mounted){
                            this.setState({
                                isEnd: true
                            })
                        }
                           clearInterval(this.state.interval);
                           clearInterval(this.state.interval1);
                        }
                        else{ 
                             var that=this; 
                              if(type==3){
                              //  socket = io.connect('wss://tih.cqkqinfo.com/?inquiryId=1551686053952&doctorId=doctor900');
                               socket = io.connect("wss://"+window.location.host+"/?inquiryId="+that.props.location.query.inquiryId+"&userId=user"+that.state.userId,{'reconnect': true });
                                  console.log("socket1",socket);
                               socket.on('inquiry_withdraw',function(data){ 
                                that.getChat(1);
                            })   
                               socket.on("inquiry_message",function(data){
                                    that.getChat(1)
                                })
                                socket.on("inquiry_close",function(data){
                                    console.log("ccclosehaha")
                               that.state.socketTime= setTimeout(function(){
                                      console.log(data);
                                      if(data.inquiryId=that.state.inquiryId){
                                        that.getChat();
                                       // socket.disconnect();
                                      }
                                },1000)
                           })
                          }   
                     }  
                    }
                    
                }
                        
            }, (e) => {
                this.hideLoading();
            });
    }
    showToast() {
        if(this.mounted){
        this.setState({showToast: true});
        }
        this.state.toastTimer = setTimeout(()=> {
            if(this.mounted){
            this.setState({showToast: false});
            }
        }, 1000);
    }
   /*获取评价*/
    getEvaluate(orderId) {
        Api
            .evaluate1({orderId: orderId})
            .then((res) => {
                if (res.data.length > 0) {
                    this.setState({
                        isPingJia:true,
                        isEvaluate: true,
                        newScore: res.data[0].score ? res.data[0].score : '',
                        newHisScore: res.data[0].hisScore ? res.data[0].hisScore : '',
                        newText: res.data[0].appraisal ? res.data[0].appraisal : '',
                        gmPingJia: res.data[0].replyAppraisal?JSON.parse(res.data[0].replyAppraisal):'',
                        newHisText:res.data[0].hisAppraisal ? res.data[0].hisAppraisal : '',
                        newHisItem:res.data[0].hisAppraisalLabel ? res.data[0].hisAppraisalLabel : '',
                        newItem: res.data[0].appraisalLabel ? res.data[0].appraisalLabel : '',
                        newTime: this.dateTime(res.data[0].createTime ? res.data[0].createTime : ''),
                    })
                    this.setState({
                        newTime: this.dateTime(res.data[0].createTime ? res.data[0].createTime : ''),
                    });
                    var str = this.state.newItem;
                    var s = [];
                    s = str.split("-");
                    console.log('hisAppraisalLabel=',res.data[0].appraisalLabel)
                    if(res.data[0].appraisalLabel&&res.data[0].appraisalLabel.length>0){
                      let newitem=s.map((item,index)=>{
                        return "#".concat(item,'#')
                      })
                      this.setState({
                        doctorPingjia:newitem.concat(res.data[0].appraisal)
                      })
                    }
                    
                    let hisPinjia=this.state.newHisItem
                    if(hisPinjia&&hisPinjia.split("-").length>0){
                      let newhisitem=hisPinjia.split("-").map((item,index)=>{
                        return "#".concat(item,'#')
                      })
                      this.setState({
                        historyPingjia:newhisitem.concat(res.data[0].hisAppraisal)
                      })
                    }
                    console.log('doctorPingjia=',this.state)
                    this.setState({
                        itemList: 0,
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
    getDocDet(orderId,doctorId) {
     console.log(orderId,doctorId,"11111111")
        Api
            .getDocDet({orderId,doctorId})
            .then((res) => {
                console.log("rrrrr",res)
                if (res.code == 0) {
                    this.setState({
                        docInfo: res.data,
                        // doctorid: res.data.doctorId,
                        // deptid: res.data.deptId
                    })
                   // console.log("doctoriddddd", res.data.doctorId)
                    // console.log("doctoriddddd", res.data.doctorId)
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
        this.setState({
            showPlus:false,
            hieghtMore:false
        })
        console.log("input",this.state.msgText); 
        if(this.state.msgText!=''){
            this.setState({
                isBtn:true
            }) 
        }else{
            this.setState({
                isBtn:false
            }) 
        }
        if(window.location.hash.indexOf('chat')!=-1){
            interval2 = setInterval(function() {
                document.body.scrollTop = document.body.scrollHeight;
                console.log("ssstate22222");
            }, 1000)  
            e.stopPropagation(); 
            e.preventDefault();
            this.state.btnTime=setTimeout((
            )=>{
                var s=document.getElementsByClassName("content3")[0].scrollHeight;
                document.getElementsByClassName("content3")[0].scrollTop=s;
                console.log("ssstate33333");
                console.log(s,document.getElementsByClassName("content3")[0].scrollTop);
            },1000)

        }
     
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
           this.state.btnHideTime = setTimeout(()=> {
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
        this.showLoading("发送中");
        if (!this.state.endding) {
            if (this.state.inputText != '') {
                if(this.mounted){
                this.setState({
                    msgText: this.state.msgText == null ? '' : null
                })}
                this.send({
                    inquiryId: this.state.inquiryId,
                    operator: 'user',
                    content: this.state.inputText,
                });
                this.hideLoading();
                if(this.mounted){
                 this.setState({
                     msg:'一次只能发送4张图片',
                     showIOS1: true,
                 })
                /*this.setState({
                    inputText: ''
                })*/
            }
            }
        } else {
            this.hideLoading();
            if(this.mounted){
            this.setState({
                isOk: true
            })
        }
        }
    }
    /*发送信息*/
    sendMsg1(e) {
        console.log("e",this.state.msgText)
        e.stopPropagation();
        e.preventDefault();
        window.scrollTo(0,0);
      
        if (!this.state.endding) {
            if (this.state.inputText != '') {
                if(this.mounted){
                this.setState({
                    msgText: this.state.msgText == null ? '' : null
                })
            }   
            this.showLoading("发送中");
                this.send({
                    inquiryId: this.state.inquiryId,
                    operator: 'user',
                    content: this.state.inputText,
                });
                // this.setState({
                //     inputText:''
                // })
            }
       } else {
             if(this.mounted){
            this.setState({
                isOk: true
            })
        } 
        }
    }
   /*获取焦点事件*/
    input(e) {
        this.setState({
            inputText: e.target.value,
            msgText: e.target.value,
        })
        if(e.target.value!=''){
            this.setState({
                isBtn:true
            }) 
        }else{
            this.setState({
                isBtn:false
            }) 
        }
        if(parseInt(window.getComputedStyle(document.getElementById("inputText")).height.substring(0,window.getComputedStyle(document.getElementById("inputText")).height.length-2))>50){
            this.setState({
                hieghtMore:true
            })
        }else{
            this.setState({
                hieghtMore:false
            })
        }
        document.getElementById("txt").setAttribute("style", "padding-bottom:"+window.getComputedStyle(document.getElementsByClassName("operation-box")[0]).height
        );
        if(window.location.hash.indexOf('chat')!=-1){
            this.state.inputTime=setTimeout((
                )=>{
                    var s=document.getElementsByClassName("content3")[0].scrollHeight;
                    document.getElementsByClassName("content3")[0].scrollTop=500000;
                    console.log("ssstate444444");
                },1000)
                e.stopPropagation();
                e.preventDefault();

        }
        
    }
   /*发送*/
    send(param,qufen,formDatat,filenamet) {
        // this.showLoading('发送中');
        Api.sendMsg(param)
            .then((res) => {
                const {
                    unsendList
                } = this.state
                for(let i=0;i<unsendList.length;i++){
                    if(unsendList[i].content&&unsendList[i].content==qufen){
                        unsendList.splice(i,1)
                    }
                    if(unsendList[i]&&unsendList[i].url&&unsendList[i].url==qufen){
                        unsendList.splice(i,1)
                    }
                }
                if(this.mounted){
                    this.setState({
                        isBtn: false,
                        inputText: '',
                    })
                } 
                this.hideLoading();
                if (res.code == 0) {
                    if(this.mounted){
                    this.setState({
                        imgArr:[]
                    })
                }
                    imgList=[];
                   this.getChat(2);
                }
            }, (e) => {
                // this.getChat(2);
                console.log('e=',e)
                if(!e.code){
                    const {
                        formData,
                        unsendImg,
                        filenames,
                        secondInputText
                    } = this.state
                    if(param&&param.content&&param.content!=''){
                        let flg=false
                        for(let i=0;i<secondInputText.length;i++){
                            if(secondInputText[i]==qufen){
                                flg=true
                            }
                        }
                        if(!flg){
                            let newNoSend={
                                'content': param.content,
                                'untextsendNumN':this.state.untextsendNumN,
                                'createTime': getTodayDate(),
                                'direction': "TO_DOCTOR",
                                'doctorIsShow': "1",
                                // id: 2002051000000017
                                // inquiryId: 2002053000000003
                                'type': "BIZ",
                                // updateTime: "2020-02-05 10:14:50"
                                // userId: 1477
                                'userIsShow': "1",
                                'isUnSend':true,
                                'voiceTime': 0,
                            }
                            console.log('this.state.list=',this.state)
                            let newList=this.state.list.reverse().unshift(newNoSend)
                            let secondInputTextNew=this.state.secondInputText.push(param.content)
                            let unsendListNew=this.state.unsendList.push(newNoSend)
                            // console.log('newList=',newList)
                            console.log('param=',secondInputTextNew)
                            this.setState({
                                list:this.state.list.reverse(),
                                // secondInputText:secondInputTextNew,
                                untextsendNumN:this.state.untextsendNumN+1,
                                unsendNum:this.state.unsendNum+1,
                                // unsendList:this.state.unsendList.push(newNoSend),
                                inputText:'',
                            })
                            console.log('this.state.input=',this.state)
                        }
                    }
                    if(param&&param.url&&param.url!=''){
                        let flg=false
                        for(let i=0;i<unsendImg.length;i++){
                            if(unsendImg[i]==qufen){
                                flg=true
                            }
                        }
                        if(!flg){
                            let newNoSend={
                                'createTime': getTodayDate(),
                                'direction': "TO_DOCTOR",
                                'unimgsendNumN':this.state.unimgsendNumN,
                                'doctorIsShow': "1",
                                'type': "BIZ",
                                'url': param.url,
                                'userIsShow': "1",
                                'voiceTime': 0,
                                'isUnSend':true
                            }
                            let newList=this.state.list.reverse().unshift(newNoSend)
                            this.state.imgFormData.push(formDatat)
                            this.state.unsendImg.push(base64)
                            this.state.filenames.push(filenamet)
                            this.state.unsendList.push(newNoSend)
                            this.setState({
                                list:this.state.list.reverse(),
                                // unsendNum:this.state.unsendNum+1,
                                unimgsendNumN:this.state.unimgsendNumN+1,
                                // imgFormData:this.state.imgFormData.push(formDatat),
                                // unsendImg:this.state.unsendImg.push(base64),
                                // filenames:this.state.filename.push(filenamet),
                                // unsendList:this.state.unsendList.push(newNoSend)
                            })
                        }
                    }

                }

                this.hideLoading();
                /*if(this.mounted){
                    this.setState({
                        msg: e.msg,
                        showIOS1: true
                    })
                }*/
            });
    }
    // 发送失败-再次发送
    secondSend=(num)=>{
        console.log('num=',num,this.state)
        const {
            inquiryId,
            secondInputText,
            numEnd
        } = this.state
        if(numEnd>0){
            this.send({
                inquiryId: inquiryId,
                operator: 'user',
                content: secondInputText[num],
            },secondInputText[num]);
        }else{
            if(this.mounted){
                this.setState({
                    isOk: true
                })
            }
        }
    }
    // 发送失败-再次发送图片
    secondSendImg=(num)=>{
        console.log('imgnum=',num,this.state)
        const {
            imgFormData,
            filenames,
            unsendImg
        } = this.state
        let that=this
        const formData = new FormData();
        formData.append('key',imgFormData[num].key);
        formData.append("policy",imgFormData[num].policy);
        formData.append("callback",imgFormData[num].callback);
        formData.append("signature",imgFormData[num].signature);
        formData.append("OSSAccessKeyId",imgFormData[num].OSSAccessKeyId); 
        formData.append('file',this.base64ToBlob(imgFormData[num].file)); 
        // this.showLoading('发送中');
         $.ajax({
             url: 'https://ihoss.oss-cn-beijing.aliyuncs.com', 
             method: 'POST',
             processData: false,
             contentType: false,
             cache: false,
             data: formData,
             success: (e) => {
                
                 imgList.push('https://ihoss.oss-cn-beijing.aliyuncs.com/'+filenames[num]);
                // alert("us")
                 //alert(this.isHasImg('https://ihoss.oss-cn-beijing.aliyuncs.com/'+filename));
                 if(that.isHasImg('https://ihoss.oss-cn-beijing.aliyuncs.com/'+filenames[num])){
                     
                     that.send({
                         inquiryId: that.state.inquiryId,
                         operator: 'user',
                         url:'https://ihoss.oss-cn-beijing.aliyuncs.com/'+filenames[num],
                     },unsendImg[num]);
                     that.hideLoading();
                     that.setState({
                         imgArr:Array.from(new Set(imgList)),
                         /*imgFormData:{},
                         unsendImg:'',
                         filename:'',*/
                     })
                 }else{
                    var  intervals = setInterval(() => that.isHas('https://ihoss.oss-cn-beijing.aliyuncs.com/'+filenames[num],imgList), 500);
                    that.setState({
                        intervals:intervals
                    })
                     
                 }
            },
             error:(e) =>{
                console.log('eee=',e)
                that.hideLoading();
             }
        });
    }
   /*隐藏添加图片*/
    hidePlus() {
        document.getElementById("txt").setAttribute("style", "padding-bottom:50px");
        if(window.location.hash.indexOf('chat')!=-1){
            this.state.hideTime=setTimeout((
                )=>{
                    var s=document.getElementsByClassName("content3")[0].scrollHeight; 
                    console.log("ssstate55555");
                    document.getElementsByClassName("content3")[0].scrollTop=500000;
                    console.log(s,document.getElementsByClassName("content3")[0].scrollTop);
                      clearTimeout(this.state.hideTime)
                },1000)
                this.setState({  
                    showPlus: false
                })

        }
       
    }
   /*显示发送图片*/
    showPlus() {
        this.setState({
            showPlus: !this.state.showPlus
        })
        if(window.location.hash.indexOf('chat')!=-1){

       
        if(!this.state.showPlus){
            document.getElementById("txt").setAttribute("style", "padding-bottom:"+window.getComputedStyle(document.getElementsByClassName("operation-box")[0]).height
            );
            console.log("ss")
                var s=document.getElementsByClassName("content3")[0].scrollHeight;
                console.log("ssstate6666");
                document.getElementsByClassName("content3")[0].scrollTop=500000;
                console.log(s,document.getElementsByClassName("content3")[0].scrollTop);
        }else{
            console.log("s1")
            document.getElementById("txt").setAttribute("style", "padding-bottom:50px");
            var s=document.getElementsByClassName("content3")[0].scrollHeight;
            console.log("ssstate77777");
            document.getElementsByClassName("content3")[0].scrollTop=500000;
            console.log(s,document.getElementsByClassName("content3")[0].scrollTop);
        }
    }
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
    // openModal() {
    //     console.log("结束咨询")
    //     this.setState({
    //        // isShow: true,
    //        tipShow:true
    //     })
    // }
   /*不结束咨询*/
    cancel() {
        this.setState({
            isShow: false,
            tipShow:false,
        })
    }
/*结束咨询*/
    sure() {
        this.setState({
          isShow: false,
          isadvise:true,
        })
        this.closure();
    }
  /*结束咨询方法*/
    closure() {
        this.showLoading();
        Api.closure({inquiryId: this.state.inquiryId, operator: 'user'})
            .then((res) => {
                if (res.code == 0) {
                    this.hideLoading();
                    this.getChat(2);
                    this.setState({
                        //isShow: false,
                        isEnd: true,
                        isEvaluate: false,
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
    setScore1(id) {
        this.setState({
            docScore: id
        })
    }
    setScore(id) {
        this.setState({
            hisScore: id
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
        var doc=this.state.docList;
        var flag=0;
         for(var i=0;i<doc.length;i++){
             if(id==i){
                 doc[i].show=!doc[i].show;
             }
             if(doc[i].show){ 
                flag=1;
                this.setState({
                   docPlace:true
               })
            }
         }
         if(flag==0){
            this.setState({
                docPlace:false
            })
           
        }
         this.setState({
             docList:doc
         })
         
    }
    setAppraisal1(id) {
        var his=this.state.hisList;
        var flag=0;
         for(var i=0;i<his.length;i++){
             if(id==i){
                 his[i].show=!his[i].show;
             }
             if(his[i].show){
                flag=1;
                 this.setState({
                    hisPlace:true
                })
             }
         }
         if(flag==0){
            this.setState({
                hisPlace:false
            })
            
        }
         this.setState({
             hisList:his
         })
    }
    setATxt(e) {
        if (this.state.txtNum > 140) {
        }
        this.setState({
            txtNum: e.target.value.length,
            appraisal: e.target.value
        })
    }
    setATxt1(e) {
        if (this.state.txtNum1 > 140) {
        }
        this.setState({
            txtNum1: e.target.value.length,
            appraisal1: e.target.value
        })
    }
    saveContent(e) {
        this.setState({
            txtNum: e.target.value.length,
            appraisal: e.target.value
        })
    }
    // 评价弹框关闭
    closePingJia(){
      this.setState({
        isPingJia:false
      })
    }
    saveContent1(e) {
        this.setState({
            txtNum1: e.target.value.length,
            appraisal1: e.target.value
        })
    }
    /*提交评价*/
    submitEvaluate(e) {
        e.stopPropagation();
        e.preventDefault();
        var appraisalLabel1 = '';
        for(var i=0;i<this.state.docList.length;i++){
            if(this.state.docList[i].show){
                if(appraisalLabel1==''){
                    appraisalLabel1 =this.state.docList[i].text;
                }else{
                    appraisalLabel1 += "-"+ this.state.docList[i].text;

                }
            }
        }
        this.setState({
            appraisalLabel: appraisalLabel1
        })
        var appraisalLabel2 = '';
        for(var i=0;i<this.state.hisList.length;i++){
            if(this.state.hisList[i].show){
                if(appraisalLabel2==''){
                    appraisalLabel2 =this.state.hisList[i].text;
                }else{
                    appraisalLabel2 +="-"+this.state.hisList[i].text ;

                }
            }
        }
        this.setState({
            appraisalLabel1: appraisalLabel2
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
            hisAppraisal:this.state.appraisal1,
            appraisalLabel: appraisalLabel1,
            hisAppraisalLabel: appraisalLabel2,
            hisScore:this.state.hisScore,
            score: this.state.docScore,
            orderId: this.state.orderId,
        };
        if(this.state.docScore<4&&this.state.appraisal==''){
            this.setState({
                msg:'请输入医生评价详情且评价详情不能低于10个字',
                showIOS1: true
            })
            return false;
        }
        if(this.state.docScore<4&&this.state.appraisal.length<10){
            this.setState({
                msg:'医生评价详情不能低于10个字',
                showIOS1: true
            })
            return false;
        }
        if(this.state.hisScore<4&&this.state.appraisal1==''){
            this.setState({
                msg:'请输入医院评价详情且评价详情不能低于10个字',
                showIOS1: true
            })
            return false;
        }
        if(this.state.hisScore<4&&this.state.appraisal1.length<10){
            this.setState({
                msg:'医院评价详情不能低于10个字',
                showIOS1: true
            })
            return false;
        }
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
   /*播放语音*/
    play(item,list,index) {
        event.stopPropagation();//防止冒泡
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
                        var total=this.state.list[i].voiceTime;
                        var matList=this.state.match;
                         var tag='';       
                            for(var k=0;k<matList.length;k++){
                                if(item!=="s"+matList[k].id){
                                    matList[k].stopPlay=true;
                                }else{
                                    matList[k].stopPlay=false;
                                    tag=k; 
                                }
                            }
                            this.setState({
                                match:matList
                            })
                          this.state.dian=setInterval(() => {
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
        filename=this.randomName() + this.guid()+file.name.substring(file.name.indexOf("."),file.name.length)
        formData.append('key', filename);
        formData.append("policy",this.state.sign.policy);
        formData.append("callback",this.state.sign.callback);
        formData.append("signature",this.state.sign.signature);
        formData.append("OSSAccessKeyId",this.state.sign.OSSAccessKeyId);
        formData.append('file', file);
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
                var flag=this.validateImage('https://ihoss.oss-cn-beijing.aliyuncs.com/'+filename);
                while(!this.validateImage('https://ihoss.oss-cn-beijing.aliyuncs.com/'+filename)){
                }
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
                                        var filename=that.randomName()+Utils.uuid()+'.png';
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
                                                    imgArr:imgArr1,
                                                })
                                            },
                                            error:(e) =>{
                                                that.hideLoading();
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
        clearInterval(interval);
        clearInterval(interval1);
        clearInterval(interval2);
        console.log("into")
       hashHistory.push({
           pathname:'add/addManage',
           query:{id:id,source:1,orderIdStr:this.state.orderId,inquiryId:this.state.inquiryId,status:this.state.status,doctorName:this.state.doctorName}
       })
    }
     validateImage(url)
    {    
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
        console.log('status',xmlHttp.status)
        if(xmlHttp.status==404)
        return false;
        else
        return true;
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
onChange = (files,file,index) => {
   if(!!file){
         
     console.log(files,file,index)
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
                         
                         that.send({
                             inquiryId: that.state.inquiryId,
                             operator: 'user',
                             url:'https://ihoss.oss-cn-beijing.aliyuncs.com/'+filename,
                         },base64,{
                            'key':filename,
                            "policy":sign.policy,
                            "callback":sign.callback,
                            "signature":sign.signature,
                            "OSSAccessKeyId":sign.OSSAccessKeyId,
                            'file':base64
                         },filename);
                         that.hideLoading();
                         that.setState({
                             imgArr:Array.from(new Set(imgList)),
                             /*imgFormData:{},
                             unsendImg:'',
                             filename:''*/
                         })
                     }else{
                        var  intervals = setInterval(() => that.isHas('https://ihoss.oss-cn-beijing.aliyuncs.com/'+filename,imgList), 500);
                        that.setState({
                            intervals:intervals
                        })
                         
                     }
                },
                 error:(e) =>{
                    
                    console.log(8989898)
                    console.log('that.state.unsendImg=',that.state.unsendImg)
                    if(base64!=''){
                        let newNoSend={
                            'createTime': getTodayDate(),
                            'direction': "TO_DOCTOR",
                            'unimgsendNumN':that.state.unimgsendNumN,
                            'doctorIsShow': "1",
                            // id: 2002051000000025
                            // inquiryId: 2002053000000003
                            'type': "BIZ",
                            // updateTime: "2020-02-05 14:05:29"
                            'url': base64,
                            // userId: 1477
                            'userIsShow': "1",
                            'voiceTime': 0,
                            'isUnSend':true
                        }
                        let newList=that.state.list.reverse().unshift(newNoSend)

                        let newForm={
                            'key':filename,
                            "policy":sign.policy,
                            "callback":sign.callback,
                            "signature":sign.signature,
                            "OSSAccessKeyId":sign.OSSAccessKeyId,
                            'file':base64
                         }
                        that.state.imgFormData.push(newForm)
                        that.state.unsendImg.push(base64)
                        that.state.filenames.push(filename)
                        that.state.unsendList.push(newNoSend)
                        that.setState({
                            list:that.state.list.reverse(),
                            unimgsendNumN:that.state.unimgsendNumN+1,
                            // unsendNum:that.state.unsendNum+1,
                            // imgFormData:that.state.imgFormData.push(formData),
                            // unsendImg:that.state.unsendImg.push(base64),
                            // filenames:that.state.filename.push(filename),
                            // unsendList:that.state.unsendList.push(newNoSend)
                        })
                        console.log('this.state.input=',that.state)
                    }
                    that.hideLoading();
                 }
            });
        };

    }
   }
    
  };
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


  getAIReport(){

    Api
    .getReport(
        {"inquiryId":this.props.location.query.inquiryId||''}
    )
    .then((datereg) => {
        // this.hideLoading()
        console.log(datereg,'datereg....')
        if(datereg.code==0&&datereg.data){
            
            this.setState({
                reportDate:datereg.data    
            })
        }
    },

    (e)=>{
        // this.hideLoading();
        // this.setState({
        //     msg: e.msg,
        //     showIOS1: true
        // })

        console.log(e,'getReport')
    })
    
  }

  // 查看跳转链接
  tiaozhuanList=(content)=>{
    let returnContent=content
    if(content&&content.length>0){
        let textR = content;
        let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
        let pipeiList= textR.match(reg);
        let weizhi=[]
        if(pipeiList&&pipeiList.length>0){
           returnContent= this.digui(content,pipeiList,pipeiList.length,0)
        }
    }
    return returnContent
  }
  // digui
  digui=(neirong,fenge,count,cunm)=>{
    let content=''
    if(neirong&&neirong!=''){
        count--;
        let nt=neirong.split(fenge[cunm])
        content += nt[0]
        content += `<a href=${fenge[cunm]}>${fenge[cunm]}</a>`
        cunm++;
        if(nt.length>1){
            for(let i=1;i<nt.length;i++){
                content+=nt[i]
            }
        }
        // this.digui(neirong.slice(neirong.indexOf(fenge[cunm])+fenge[cunm].length),fenge,fenge.length,cunm)

    }
    return content
    
  }

  // 对话中的链接跳转
  tiaozhuan=(content)=>{
    if(content&&content.length>0){
        let textR = content;
        let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
        let pipeiList= textR.match(reg);
        // content= textR.replace(reg, "<a href='$1$2'>$1$2</a>");
        if(pipeiList&&pipeiList.length>0){
            window.location.href=pipeiList[0]
        }

    }
  }
      
    render() {
    const {isPingJia,userData,reportDate,isEvaluate,files,freeReport,list,msgText,isShow,isEnd,docInfo,userInfo,doctorid,deptid,showPlus,interval,
        name,match,hieghtMore,docList,uId,hisList,score,txtNum,txtNum1,t1,t2,t3,t4,t5,timeShow,numEnd,pics,innerAudioContext,
        canEnd,appraisal,appraisal1,pingShow,newScore,newHisScore,itemList,detail,payBack,isOk,newText ,newHisText,doctorPingjia,gmPingJia,isDuration,newItem,status,
        hisPlace,docPlace,newTime,doctorName,deptName,noDoctor,tipShow,docScore,msg,hisScore,end,sign,signature,formData,policy,callback,OSSAccessKeyId,key,
        evaluateTime,isBtn,inputText,isPlay,prevText,nextprevText,isadvise,doctorType,type,historyPingjia}=this.state
        return (
            <div style={{height:'100%'}} className="chat">
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons}
                    show={this.state.showIOS1}>
                {msg}
            </Dialog>
            <div className="containers" >
            <div className="home bid" ><span className="jian"
                                        onClick={()=>{
                                            if(this.props.location.query.resource=='report'){
                                                this.context.router.goBack()
                                            }else{
                                                this.context.router.push({
                                                    pathname:'inquiry/inquirylist'
                                                    })
                                            }
                              }}
                ></span>{doctorName}
            </div>
            <Toast icon="success-no-circle" show={this.state.showToast}>评价成功</Toast>
            {!isEnd && <div className='header'>
                <div>
                {timeShow&&<div className="time">剩余时间： <span>{timeShow}</span></div>}
                    <div className="num">剩余条数： <span>{numEnd}</span> 条</div>
                </div>
                <div >
                    <span 
                    className={`${!canEnd&&freeReport?'endGrey':''}`}
                    onClick={()=>{ 
                        // console.log(canEnd);  
                        // if(canEnd){ 
                        //     this.openModal()
                        // }
                        if(canEnd==false){
                            console.log(canEnd,"canEnd")
                             this.setState({
                                tipShow:true
                             })
                        }else {
                            this.setState({
                                tipShow:false,
                                isShow:true
                             })
                        }

                      

                    }}>结束咨询</span>
                </div>
            </div>}
            {
                isadvise &&
               <img  className='isadvise' src='./././resources/images/jy@2x.png'
                onClick={()=>{
                    console.log("docInfo.type",docInfo.type)
                                this.context.router.push({
                                    pathname:'/usercenter/mysuggestion',
                                    query:{type,deptName,deptId:deptid,doctorName,doctorId:doctorid,docType:doctorType}
                                })
                                }}
               />
            }
            {  status==3  &&
                    <div className="consult-agains">
                    <Link className="agains"
                         onClick={()=>{
                             Utils.sums('inquiry_again',2,1);
                         }}
                          to={{ 
                                pathname:'/consult/deptdetail',
                                query:{doctorId:doctorid,deptId:deptid,}
                                }}
                        >再次咨询</Link>
                        {
                          isPingJia?
                        <div className={`modal-pingJia ${isPingJia?'':'showTxt'}`} onClick={e=>this.closePingJia(e)}>
                          <div className="pingJia" style={{height: 'auto',position: 'fixed',top: 'auto',paddingBottom: '0px'}}>
                            <div className="title">我的评价</div>
                            <div className="ping">
                              <div className="xing">
                                <span>医生评价:</span>
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
                              <div className="xing">
                                <span>医院评价:</span>
                                <div className="star">
                                    {newHisScore < 1 && <img src="../../../resources/images/starH.png"/>}
                                    {newHisScore >= 1 && <img src="../../../resources/images/starS.png"/>}
                                </div>
                                <div className="star">
                                    {newHisScore < 2 && <img src="../../../resources/images/starH.png"/>}
                                    {newHisScore >= 2 && <img src="../../../resources/images/starS.png"/>}
                                </div>
                                <div className="star">
                                    {newHisScore < 3 && <img src="../../../resources/images/starH.png"/>}
                                    {newHisScore >= 3 && <img src="../../../resources/images/starS.png"/>}
                                </div>
                                <div className="star">
                                    {newHisScore < 4 && <img src="../../../resources/images/starH.png"/>}
                                    {newHisScore >= 4 && <img src="../../../resources/images/starS.png"/>}
                                </div>
                                <div className="star">
                                    {newHisScore < 5 && <img src="../../../resources/images/starH.png"/>}
                                    {newHisScore >= 5 && <img src="../../../resources/images/starS.png"/>}
                                </div>
                              </div>
                              <div className="heightAuto">
                                <span>医生评价详情:</span>
                                <span className="text2 wordLine">{!!doctorPingjia ? doctorPingjia : '无'}</span>
                              </div>
                              <div className="heightAuto">
                                <span>医院评价详情:</span>
                                <span className="text2 wordLine">{!!historyPingjia ? historyPingjia : '无'}</span>
                              </div>
                              <div className="xing">
                                <span>评价时间:</span>
                                <span className="text2">{newTime}</span>
                              </div>
                              {
                                gmPingJia?
                                  <div>
                                    <div className="xing">
                                      <span className='fontWeight'>医院小助手<span className='xing-title-biaoqian'>官方</span></span>
                                      <span className='xing-title-time'>{gmPingJia.replyTime}</span>
                                    </div>
                                    <div className='xing-content'>
                                      {
                                        gmPingJia.replyContent
                                      }
                                    </div>
                                    </div>:null
                              }
                            </div>
                            <Button
                                onClick={(e)=>{
                                this.closePingJia(e)
                                }}> 关闭
                            </Button>
                          </div>
                          
                        </div>:null
                        }
                    </div>
                }
            {!isEnd && <div className='operation-box'>
            
                <div className='top'>
                    <TextArea autosize rows="1" cols="3" value={msgText} id="inputText"
                              onFocus={(e)=>{ this.btnShow(e)}}
                              maxLength='150'
                      onBlur={(e)=>{ this.btnHide(e) }}
                      onChange={(e)=>{ this.input(e)}}  />
                    {!isBtn &&
                    <img src='../../../resources/images/jiahao.png' onClick={()=>{
                    this.showPlus()
                    }}/>  
                    }
                    {isBtn&&!hieghtMore&& <span className="addBtn"
                    style={{marginBottom:'6px'}} 
                    onClick={ (e)=>{
                                            e.stopPropagation();
                                            e.preventDefault();
                                            this.sendMsg1(e)
                                            }
                                            }>发送</span>}
                {isBtn&&hieghtMore&&<span className="addBtn"
                onClick={
                                        (e)=>{
                                        e.stopPropagation();
                                        e.preventDefault();
                                        this.sendMsg1(e)
                                        }
                                        }>发送</span>}
                </div>
                
                
                {showPlus && 
                 <div className='bottom'>
                    <div className='allow'>
                         {<div  className='img'>
                             <input type="file" id="file"  onChange={(e) => {           
                                        this.onChange(e.target.files,e.target.files[0],0)
                                    }} accept="image/*" />
                                   
                                    <img  className=' imgs' src='./././resources/images/plusImg.png'/>
                                    </div>
                                    } 
                                    {/* isIos&&<div  className='img' onClick={(e)=>{
                                               this.choose(this.state.sign)
                                            }}> 
                                        

                                            <img  src='./././resources/images/plusImg.png'/>
                                   </div> */}
                         <p className='text'>图片</p>
                    </div> 
                    <div className='allow'>
                      <div className='img'>
                            <img src='./././resources/images/plusSample.png'
                            onClick={()=>{
                                
                                this.context.router.push({
                                    pathname:'/usercenter/mysuggestion',
                                    query:{type:2,deptName,deptId:deptid,doctorName,doctorId:doctorid,docType:doctorType}
                                })
                                }}
                            />
                        </div>
                        <p className='text'>意见反馈</p>
                    </div>
                </div>}

            </div>}
            <div className={`header1 ${isEnd ? '': 'showTxt'}`}>咨询已结束</div>
            <div  className={`content3 ${isEnd?'contents':''}`}
                 id='content3'
                 onClick={(e)=>{
                    e.stopPropagation();
                    e.preventDefault();
                       if(this.state.showPlus){
                        this.hidePlus()
                       }
                            }}>
              {/* { status=="3"  &&
                    <div className="consult-agains">
                    <Link className="agains"
                          to={{
                                pathname:'/consult/deptdetail',
                                query:{doctorId:doctorid,deptId:deptid}
                                }}
                        >再次咨询</Link>
                    </div>
                } */}
                <div className='content2' id="content2">

                


                {!!reportDate&&<div className="reasons" >
                        <div className="pre_content">
                            <div className="pre_pat">
                                <p className="lefts">问诊报告</p>
                                {reportDate&&reportDate.createTime&&<p className="right f12">生成时间：{reportDate&&reportDate.createTime.substr(0,10)}</p>}
                            </div>
                            <div className="pre_pat">
                                <p className="lefts"><span>患者信息：</span><span>{userData.name}|{reportDate.sex=='0'?'男':'女'}|{reportDate.age}岁</span></p>
                                {/* <p className="right">初/复诊：<span>{reportDate.visiting_status==2?'复诊':'初诊'}</span></p> */}
                            </div>
                            <div className="pre_pat">
                                <p className="lefts"><span>患者自述：</span><span>{reportDate&&reportDate.query}</span></p>
                            </div>
                            
                        </div>

                        {reportDate&&reportDate.currentHistory&&<div className="pre-more">
                        <div className="pre_title"> 
                                <span></span>现病史
                        </div>
                        <div className="pre_info">
                        {reportDate&&reportDate.currentHistory}
                        </div>
                        </div>}

                        {reportDate&&reportDate.pastHistory&&<div className="pre-more">
                        <div className="pre_title"> 
                                <span></span>既往史
                        </div>
                        <div className="pre_info">
                        {reportDate&&reportDate.pastHistory}
                        
                        </div>
                        </div>}

                        {reportDate&&reportDate.marriageHistory&&<div className="pre-more">
                        <div className="pre_title"> 
                                <span></span>婚育史
                        </div>
                        <div className="pre_info">
                        {reportDate&&reportDate.marriageHistory}
                        
                        </div>
                        </div>}


                        {reportDate&&reportDate.familyHistory&&<div className="pre-more">
                        <div className="pre_title"> 
                                <span></span>家族史
                        </div>
                        <div className="pre_info">
                        {reportDate&&reportDate.familyHistory}
                        
                        </div>
                        </div>}


                        {reportDate&&reportDate.birthHistory&&<div className="pre-more">
                        <div className="pre_title"> 
                                <span></span>出生史
                        </div>
                        <div className="pre_info">
                        {reportDate&&reportDate.birthHistory}
                        
                        </div>
                        </div>}

                        {reportDate&&reportDate.feedingHistory&&<div className="pre-more">
                        <div className="pre_title"> 
                                <span></span>喂养史
                        </div>
                        <div className="pre_info">
                        {reportDate&&reportDate.feedingHistory}
                        
                        </div>
                        </div>}

                        {reportDate&&reportDate.menstrualHistory&&<div className="pre-more">
                        <div className="pre_title"> 
                                <span></span>月经史
                        </div>
                        <div className="pre_info">
                        {reportDate&&reportDate.menstrualHistory}
                        
                        </div>
                        </div>}
                            
                        {reportDate&&reportDate.medicalTreatment&&<div className="pre-more">
                        <div className="pre_title"> 
                                <span></span>诊疗经过
                        </div>
                        <div className="pre_info">
                        {reportDate&&reportDate.medicalTreatment}
                        
                        </div>
                        </div>}

                    </div>}



                    {list && list.map((item, index)=> {
                        return (
                            <div key={index} className="content-item" id="content-item">
                                {item.type == 'SYSTEM' && item.userIsShow == '1' &&
                                <div
                                    className={`msg ${item.content.indexOf("text")!=-1?'redColor':''}`}>
                                    {item.content.indexOf("text")!=-1?item.content.substring(26,item.content.length-7):item.content}
                                </div>}
                                {item.type == 'BIZ' && item.userIsShow == '1' &&
                                <div className='date'>{item.createTime}</div>}
                                {item.type == 'BIZ' && item.userIsShow == '0' &&item.doctorIsShow == '0'&&
                                <div className='date'>{item.updateTime}</div>}
                                {item.type == 'BIZ' && item.userIsShow == '0' &&item.doctorIsShow == '0'&&
                                <div
                                    className={`msg `} style={{textAlign:'center',color:'#ccc',background:'#f2f2f2'}}>
                                    医生撤回了一条消息
                                </div>}
                                {item.type == 'BIZ' && item.direction == 'TO_USER' && item.userIsShow == '1' && item.voiceTime == 0 &&
                                <div className='left'
                                    >
                                    <Link  to={{
                                        pathname:'consult/deptdetail',
                                        query:{doctorId:doctorid,deptId:deptid,resource:2}
                                    }}>
                                    <div className='img'>
                                        <span style={{fontSize:'10px'}}> {doctorName}</span>
                                    </div>
                                    </Link>
                                    {item.content &&item.action !== 'addChecklist'&&item.action!='reportApply'&&item.action!='add'&&item.action!='mdt'&&item.action!='applyChronic'&&item.action!='receiveChronic'&&
                                        <div className='text'id="text" onClick={()=>this.tiaozhuan(item.content)}>
                                        <div dangerouslySetInnerHTML = {{ __html: this.tiaozhuanList(item.content) }} />
                                        <span className='angle'></span>
                                    </div>}
                                    { item.content &&item.action == 'receiveChronic' && <div className='text' 
                                            onClick={()=>{
                                                this.context.router.push({
                                                    pathname:'/ordermng/describedetail',
                                                    query:{id:item.actionTrigger,source:'inquiry'}
                                                   })
                                             }}
                                            style={{width:'220px',height:'auto',background:'white'}} >
                                            <p className='doctort'>{!!item.checkContent&&item.checkContent.title}</p>
                                        <div className='check-info'>
                                            <div className='check-img'>
                                            <img  src="./././resources/images/chat-check.png"/>
                                            </div>
                                            <div className='info'>
                                                <p className='fee'>￥{!!item.checkContent&&item.checkContent.totalFee/100}</p>
                                                <p className='context'></p>
                                            </div>
                                        </div>
                                        <p className='search'>查看详情</p>
                                 </div>}
                                    {item.content &&item.action == 'addChecklist'&&
                                       <div className='text' 
                                       onClick={()=>{
                                        this.context.router.push({
                                            pathname:'/ordermng/checkdetail',
                                            query:{id:item.actionTrigger}
                                           })
                                     }}
                                       style={{width:'220px',height:'auto',background:'white'}} >
                                        <p className='doctort'>{!!item.checkContent&&item.checkContent.title}</p>
                                            <div className='check-info'>
                                               <div className='check-img'>
                                               <img  src="./././resources/images/chat-check.png"/>
                                               </div>
                                               <div className='info'>
                                                   <p className='fee'>￥{!!item.checkContent&&item.checkContent.price}</p>
                                                   <p className='context'>{!!item.checkContent&&item.checkContent.checkItem}</p>
                                               </div>
                                            </div>
                                            <p className='search'
                                            >查看详情</p>
                                            </div>}

                                            { item.content &&item.action == 'applyChronic' && <div className='text' 
                                            onClick={()=>{
                                                this.context.router.push({
                                                    pathname:'/ordermng/describedetail',
                                                    query:{id:item.actionTrigger,source:'inquiry'}
                                                   })
                                             }}
                                            style={{width:'250px',padding:'10px 0',height:'auto',background:'white'}} >
                                            <p className='apply-title'>{!!item.checkContent&&item.checkContent.title}</p>
                                                    <div className='apply-info'>
                                                      
                                                       <div className='info'>
                                                           <p className='info-item'>就诊时间：<span>{!!item.checkContent&&!!item.checkContent.visitDate&&item.checkContent.visitDate}</span></p>
                                                           <p className='info-item'>就诊科室：<span>{!!item.checkContent&&!!item.checkContent.deptName&&item.checkContent.deptName}</span></p>
                                                           <p className='info-item'>就诊医生：<span>{!!item.checkContent&&!!item.checkContent.doctorName&&item.checkContent.doctorName}</span></p>
                                                           <p className='info-item'>诊    断：<span>{!!item.checkContent&&!!item.checkContent.diagnosis&&item.checkContent.diagnosis}</span></p>
                                                           <p className='f12'><span style={{color:'red'}}>医师接诊后，网络门诊费不予退费；</span>若<span style={{color:'red'}}>24h内</span>医生未接诊，系统将在<span style={{color:'red'}}>3个工作日内</span>自动为您退回网络门诊费</p>
                                                       </div>
                                                    </div>
                                                    <p className='apply-search'>查看详情</p>  
                                                     </div>}

                                            
                                            {item.content &&item.action == 'reportApply'&&
                                            <div className='text apply' 
                                            onClick={()=>{
                                                
                                            }}
                                            style={{width:'220px',height:'auto',background:'white'}} >
                                            <p className='doctort'>{!!item.checkContent&&item.checkContent.title}</p>
                                                <div className='check-info' style={{paddingRight:'5px'}}>
                                                <div className='check-img'>
                                                <img  style={{paddingTop:'12px'}} src={!!item.checkContent&&item.checkContent.img}/>
                                                </div>
                                                <div className='info'>
                                                        <p className='context' style={{lineHeight:'20px',paddingBottom:'0',height:'50px',paddingTop:'7px'}}>

                                                        {!!item.checkContent&&!!item.checkContent.content?item.checkContent.content:''}</p>
                                                        </div>
                                                </div>
                                               
                                                {status=='1'&&<div className='btn' >
                                                    <div style={{color:'#666'}} >已同意</div>      
                                                 </div> } 
                                                </div>} 
                                                { item.content &&item.action == 'mdt' && <div className='text' 
                                    onClick={()=>{
                                        this.context.router.push({
                                            pathname:'/ordermng/mdtdetail',
                                            query:{id:item.actionTrigger,resource:1}
                                           })
                                     }}
                                    style={{width:'220px',height:'auto',background:'white'}} >
                                    <p className='doctort'>{!!item.checkContent&&item.checkContent.title}</p>
                                            <div className='check-info'>
                                               <div className='check-img'>
                                               <img  src="./././resources/images/chat-check.png"/>
                                               </div>
                                               <div className='info'>
                                                   <p className='context'>{!!item.checkContent&&item.checkContent.dept}</p>
                                               </div>
                                            </div>
                                            <p className='search'>查看详情</p>
                                             </div>}
                                    {item.type == 'BIZ' && item.direction == 'TO_USER'&&item.action!='mdt' && item.userIsShow == '1' &&item.url && item.action !== 'add' &&item.action !== 'addChecklist'&&item.action!='applyChronic'&& item.action!='receiveChronic'&& <div
                                        className='image'
                                        onClick={()=>{this.previewImg(item.url)
                                                            }}
                                        >
                                        <i/><img  
                                        src={item.url&&item.url.indexOf("ihoss")=='-1'?item.url:item.url+"?x-oss-process=image/resize,w_105"}/>
                                    </div>}
                                    {item.url && item.action == 'add' && <div
                                        className='image'
                                        onClick={()=>{ this.into(item.actionTrigger) }}>
                                        <i/><img src={item.url} style={{width:'223px',height:'86px',maxWidth:'223px'}}/>
                                    </div>}
                                    {item.url && item.action == 'addChecklist' && <div
                                    className='image'>
                                    <i/>
                                     <Link to={{  pathname:'/check/confirmCheck',
                                     query:{id:item.actionTrigger,orderId:this.state.orderId,inquiryId:this.state.inquiryId,status:this.state.status}}}>
                                    <img 
                                         style={{width:'223px',height:'86px',maxWidth:'223px'}}
                                    src={item.url}/></Link>
                                </div>}                                          
                                  {item.url && <div className='flex'></div>}
                                </div>}
                                {item.type == 'BIZ' && item.direction == 'TO_USER' && item.userIsShow == '1' &&item.voiceTime > 0 && <div id="a" className='left slide'>

                                    <Link  to={{
                                        pathname:'consult/deptdetail',
                                        query:{doctorId:doctorid,deptId:deptid,resource:2}
                                    }}>
                                    <div className='img'>
                                        <span style={{fontSize:'10px'}}> {doctorName}</span>
                                    </div>
                                    </Link>

                                    {item.voiceTime && <div
                                        onClick={()=>{
                                                this.play('s'+item.id,item,index)
                                                }}
                                        className={`text radio ${item.voiceTime<5?'wid5':''} ${item.voiceTime<10&&item.voiceTime>=5?'wid6':''} ${item.voiceTime<20&&item.voiceTime>=10?'wid7':''} ${item.voiceTime>=20?'wid8':''}`}>                                            
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
                                    {item.url && item.action !== 'add' &&item.action !== 'addChecklist'&&item.action!='applyChronic'&& item.action!='receiveChronic' &&  <div className='image sendtd-di'
                                                                               onClick={()=>{
                                                                            this.previewImg(item.url)
                                                                             }} >
                                        {
                                            item.isUnSend?
                                            <div className='send-di' onClick={e=>{e.stopPropagation();this.secondSendImg(item.unimgsendNumN)}}>
                                                <img src={tanhao} className='second-fen' />
                                            </div>:null
                                        }
                                        <div><img  className='send-img'
                                         src={item.url&&item.url.indexOf("ihoss")=='-1'?item.url:item.url+"?x-oss-process=image/resize,w_105"}/></div>
                                    </div>}

                                    {item.url && item.action == 'add' && <div
                                     className='image sendtd-di'
                                     onClick={()=>{
                                        this.into(item.actionTrigger)
                                        }}
                                     ><img src={item.url} style={{width:'223px',height:'86px',maxWidth:'223px'}}/>
                                        </div>}
                                    {item.content &&item.action !== 'addChecklist' &&item.action!='reportApply'&&item.action!='mdt'&&item.action!='add'&&item.action!='applyChronic'&&item.action!='receiveChronic'&& <div className='send-di'>
                                        {item.isUnSend?<div className='send-di' onClick={e=>{e.stopPropagation();this.secondSend(item.untextsendNumN)}}><img src={tanhao} className='second-fen' /></div>:null}
                                        <div className='text' onClick={()=>this.tiaozhuan(item.content)}>
                                            <div dangerouslySetInnerHTML = {{ __html: this.tiaozhuanList(item.content) }} />
                                            <span className='angle'></span>
                                        </div>
                                    </div>}  
                                    { item.content &&item.action == 'addChecklist' && <div className='text' 
                                    onClick={()=>{
                                        this.context.router.push({
                                            pathname:'/ordermng/checkdetail',
                                            query:{id:item.actionTrigger}
                                           })
                                     }}
                                    style={{width:'220px',height:'auto',background:'white'}} >
                                    <p className='doctort'>{!!item.checkContent&&item.checkContent.title}</p>
                                            <div className='check-info'>
                                               <div className='check-img'>
                                               <img  src="./././resources/images/chat-check.png"/>
                                               </div>
                                               <div className='info'>
                                                   <p className='fee'>￥{!!item.checkContent&&item.checkContent.price}</p>
                                                   <p className='context'>{!!item.checkContent&&item.checkContent.checkItem}</p>
                                               </div>
                                            </div>
                                            <p className='search'>查看详情</p>
                                             </div>}
                                             { item.content &&item.action == 'receiveChronic' && <div className='text' 
                                            onClick={()=>{
                                                this.context.router.push({
                                                    pathname:'/ordermng/describedetail',
                                                    query:{id:item.actionTrigger,source:'inquiry'}
                                                   })
                                             }}
                                            style={{width:'220px',height:'auto',background:'white'}} >
                                            <p className='doctort'>{!!item.checkContent&&item.checkContent.title}</p>
                                                    <div className='check-info'>
                                                       <div className='check-img'>
                                                       <img  src="./././resources/images/chat-check.png"/>
                                                       </div>
                                                       <div className='info'>
                                                           <p className='fee'>￥{!!item.checkContent&&item.checkContent.totalFee/100}</p>
                                                           <p className='context'></p>
                                                       </div>
                                                    </div>
                                                    <p className='search'>查看详情</p>
                                                     </div>}

                                                     { item.content &&item.action == 'applyChronic' && <div className='text' 
                                                    onClick={()=>{
                                                this.context.router.push({
                                                    pathname:'/ordermng/describedetail',
                                                    query:{id:item.actionTrigger,source:'inquiry'}
                                                   })
                                             }}
                                            style={{width:'250px',padding:'10px 0',height:'auto',background:'white'}} >
                                            <p className='apply-title'>{!!item.checkContent&&item.checkContent.title}</p>
                                                    <div className='apply-info'>
                                                       <div className='info'>
                                                           <p className='info-item'>就诊时间：<span>{!!item.checkContent&&!!item.checkContent.visitDate&&item.checkContent.visitDate}</span></p>
                                                           <p className='info-item'>就诊科室：<span>{!!item.checkContent&&!!item.checkContent.deptName&&item.checkContent.deptName}</span></p>
                                                           <p className='info-item'>就诊医生：<span>{!!item.checkContent&&!!item.checkContent.doctorName&&item.checkContent.doctorName}</span></p>
                                                           <p className='info-item'>诊    断：<span>{!!item.checkContent&&!!item.checkContent.diagnosis&&item.checkContent.diagnosis}</span></p>
                                                           <p className='f12'><span style={{color:'red'}}>医师接诊后，网络门诊费不予退费；</span>若<span style={{color:'red'}}>24h内</span>医生未接诊，系统将在<span style={{color:'red'}}>3个工作日内</span>自动为您退回网络门诊费</p>

                                                       </div>
                                                    </div>
                                                    <p className='apply-search'>查看详情</p>  
                                                     </div>}


                                             {item.content &&item.action == 'reportApply'&&
                                             <div className='text apply' 
                                             onClick={()=>{ 
                                                 
                                             }}
                                             style={{width:'220px',height:'auto',background:'white'}} >
                                             <p className='doctort'>{!!item.checkContent&&item.checkContent.title}</p>
                                                 <div className='check-info' style={{paddingRight:'5px'}}>
                                                 <div className='check-img'>
                                                 <img  style={{paddingTop:'12px'}} src={!!item.checkContent&&item.checkContent.img}/>
                                                 </div>
                                                 <div className='info'>
                                                         <p className='context' style={{lineHeight:'20px',paddingBottom:'0',height:'50px',paddingTop:'7px'}}>

                                                         {!!item.checkContent&&!!item.checkContent.content?item.checkContent.content:''}</p>
                                                     </div>
                                                 </div>
                                               
                                                 {status=='1'&&<div className='btn' >
                                                    <div style={{color:'#666'}} >已同意</div>      
                                                 </div> }
                                                 </div>}
                                                 { item.content &&item.action == 'mdt' && item.userIsShow == '1'&& <div className='text' 
                                                 onClick={()=>{
                                                     this.context.router.push({
                                                         pathname:'/ordermng/mdtdetail',
                                                         query:{id:item.actionTrigger,resource:1}
                                                        })
                                                  }}
                                                 style={{width:'220px',height:'auto',background:'white'}} >
                                                 <p className='doctort'>{!!item.checkContent&&item.checkContent.title}</p>
                                                         <div className='check-info'>
                                                            <div className='check-img'>
                                                            <img  src="./././resources/images/chat-check.png"/>
                                                            </div>
                                                            <div className='info'>
                                                                <p className='context'>{!!item.checkContent&&item.checkContent.dept}</p>
                                                            </div>
                                                         </div>
                                                         <p className='search'>查看详情</p>
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
                            <div className='modal-title'>确定取消咨询吗？</div>
                             <p></p>
                            {noDoctor&&<div className='modal-content'>结束问诊后您可以对本次咨询进行评分</div>}
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
                    {tipShow && <div className='modal'>
                        <div className='modal-body nocancel'>
                            <div className='modal-title'>医生回复咨询需一定时间，建议耐心等待，若医生未在10小时内回复咨询，您可主动结束咨询，关闭后系统将自动为您退款。</div>
                            {/* {noDoctor&&<div className='modal-content'>结束咨询会话后您可以对本次咨询进行评分</div>} */}
                            <div className='modal-footer topborder'>
                                        <span onClick={()=>{
                                        this.cancel()
                                        }}>确定</span>
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
                     { /* <div
                        className={`ping-content ${itemList>=1&&itemList<=3?'conmidHeight':''} ${itemList==0?'conminHeight':''}`}>
                      <div className={`active ${t1.show ? '': 'showTxt' }`}>{t1.text}</div>
                        <div className={`active ${t2.show ? '': 'showTxt' }`}>{t2.text}</div>
                        <div className={`active ${t3.show ? '': 'showTxt' }`}>{t3.text}</div>
                        <div className={`active ${t4.show ? '': 'showTxt' }`}>{t4.text}</div>
                        <div className={`active ${t5.show ? '': 'showTxt' }`}>{t5.text}</div>
                                   </div> */ }
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
                        onClick={()=>{
                             Utils.sums('inquiry_again',2,1);
                        }}
                              to={{
                                    pathname:'/consult/deptdetail',
                                    query:{doctorId:doctorid,deptId:deptid}
                                    }}
                            >再次咨询</Link>
                    </div>
                </div>}
               
                {!isEvaluate &&payBack&&noDoctor&&isEnd&&!end&&pingShow&&
                    <div className='modal-pingJia' onClick={(e)=>{
                        e.stopPropagation();
                        e.preventDefault();
                        this.setState({
                           pingShow:false 
                        })
                    }}>
                    <div className={`pingJia ${isEnd&&!isEvaluate&&!end&&payBack ? '': 'showTxt'}`}
                    onClick={(e)=>{
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                    >
                       <div className="title">请对本次咨询评价</div>
                       <div className="ping">
                          <div className="xing">
                           <span>医生评价</span>
                            <div className="star"
                                 onClick={()=>{this.setScore1(1)
                                                }}>
                                {docScore < 1 && <img src="../../../resources/images/starH.png"/>}
                                {docScore >=1 && <img src="../../../resources/images/starS.png"/>}
                            </div>
                            <div className="star"
                                 onClick={()=>{
                                            this.setScore1(2)
                                            }}>
                                {docScore < 2 && <img src="../../../resources/images/starH.png"/>}
                                {docScore >= 2 && <img src="../../../resources/images/starS.png"/>}
                            </div>
                            <div className="star"
                                 onClick={()=>{
                                                this.setScore1(3)
                                                }}>
                                {docScore < 3 && <img src="../../../resources/images/starH.png"/>}
                                {docScore >= 3 && <img src="../../../resources/images/starS.png"/>}
                            </div>
                            <div className="star"
                                 onClick={()=>{
                                        this.setScore1(4)
                                        }}>
                                {docScore < 4 && <img src="../../../resources/images/starH.png"/>}
                                {docScore >= 4 && <img src="../../../resources/images/starS.png"/>}
                            </div>
                            <div className="star"
                                 onClick={()=>{
                                                this.setScore1(5)
                                                }}>
                                {docScore < 5 && <img src="../../../resources/images/starH.png"/>}
                                {docScore >= 5 && <img src="../../../resources/images/starS.png"/>}
                            </div>  
                        </div>
                        <div className="xing">
                            <span>医院评价</span>
                            <div className="star"
                                 onClick={()=>{
                                                this.setScore(1)
                                                }}>
                                {hisScore < 1 && <img src="../../../resources/images/starH.png"/>}
                                {hisScore >= 1 && <img src="../../../resources/images/starS.png"/>}
                            </div>
                            <div className="star"
                                 onClick={()=>{
                                            this.setScore(2)
                                            }}>
                                {hisScore < 2 && <img src="../../../resources/images/starH.png"/>}
                                {hisScore >= 2 && <img src="../../../resources/images/starS.png"/>}
                            </div>
                            <div className="star"
                                 onClick={()=>{
                                                this.setScore(3)
                                                }}>
                                {hisScore < 3 && <img src="../../../resources/images/starH.png"/>}
                                {hisScore >= 3 && <img src="../../../resources/images/starS.png"/>}
                            </div>
                            <div className="star"
                                 onClick={()=>{
                                        this.setScore(4)
                                        }}>
                                {hisScore < 4 && <img src="../../../resources/images/starH.png"/>}
                                {hisScore >= 4 && <img src="../../../resources/images/starS.png"/>}
                            </div>
                            <div className="star"
                                 onClick={()=>{
                                                this.setScore(5)
                                                }}>
                                {hisScore < 5 && <img src="../../../resources/images/starH.png"/>}
                                {hisScore >= 5 && <img src="../../../resources/images/starS.png"/>}
                            </div>
                        </div>
                    </div>
                    <div className="ping-content">
                    {docList.length>0&&docList.map((item,index)=>{
                        return(
                            <div key={index} className={`${item.show ? 'active' : ''}`} onClick={()=>{
                                this.setAppraisal(index)
                                }}>{item.text}
                            </div>
                        )
                    })}
                    </div>
                    <div className="ping-area">
                            <TextArea value={appraisal}
                                      placeholder={!docPlace?"请输入您对医生评价的内容":'具体描述一下吧，对医生帮助更大哦'}
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
                       
                    </div>
                    <div className="ping-content">
                    {hisList.length>0&&hisList.map((item,index)=>{
                        return(
                            <div key={index} className={`${item.show ? 'active' : ''}`} onClick={()=>{
                                this.setAppraisal1(index)
                                }}>{item.text}
                            </div>
                        )
                    })}
                    </div>
                    <div className="ping-area">
                            <TextArea value={appraisal1}
                            placeholder={!hisPlace?"请输入您对医院评价的内容":'具体描述一下吧，对医院帮助更大哦'}
                                      onBlur={()=>{
                                          window.scrollTo(0,0)
                                      }}
                                      onChange={(e)=>{
                            this.setATxt1(e)
                            }}
                              maxLength="140"
                              onPressEnter={(e)=>{
                    this.saveContent1(e)
                    }}
                        />
                      
                    </div>
                    
                    </div>
                    <div className="ping-btn">
                        <button className="btn1"
                                onClick={(e)=>{
                                this.submitEvaluate(e)
                                }}> 确定评价
                        </button>
                        <Link
                        onClick={()=>{
                            Utils.sums('inquiry_again',2,1);
                        }}
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
