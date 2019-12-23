import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast,Select } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import { Link } from 'react-router';
import { ImagePicker,PickerView  } from 'antd-mobile';
import { Input,Upload,Anchor,Icon, Modal} from 'antd';
const { TextArea } = Input;
import hashHistory from 'react-router/lib/hashHistory';
import * as Utils from '../../../utils/utils';
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
var content=[];
var choice=[];
var choiceTime=[]
var sendList=[]
let PickerTime = [
    [
      {
        label: '1',
        value: '1',
      },
    ],
    [
      {
        label: '时',
        value: '时',
      },
    ],
];


let sexage=[
    [
        {
            label: '男',
            value: '0',
        },
        {
            label: '女',
            value: '1',
        },

    ]
]

let agessss = []
for(let i =1 ; i<=120; i++){
    agessss.push({
        label: i,
        value: i,
    })
}

sexage.push(agessss)

const appheight = document.getElementById("app").offsetHeight;
 
console.log(appheight,'appheight')

class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
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
            inquiryList:0,
            doctorName: '',
            dian:'',
            status: '',
            canStop:true,
            expire:'',
            showPlus: false,
            name: this.props.location.query.name,
            mdtId: '',
            userId: window.localStorage.getItem('userId'),
            showId: '',
            uId: '',
            interval:'',
            interval1:'', 
            patHisNo: '',
            score: 5,
            txtNum: 0,
            t1: {p: '态度好', show: false},
            t2: {p: '及时回复', show: false},
            t3: {p: '解答详细', show: false},
            t4: {p: '很专业', show: false},
            t5: {p: '非常感谢', show: false},
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
            isIos:false,
            freeReport:false,//是否是免费报告解读
            hieghtMore:false,//发送按钮位置
            mdtDetail:{}

            ,PickerView:'',
            datetime:["分钟",'1'],
            prediagnosishead:"",
            prediagnosisDate:"",
            request_id:'', 
            session_id:'',
            questions:'',

            sexageval:[this.props.location.query.sex=='男'?0:1,this.props.location.query.age||18],
            // age:20,
            sex:[this.props.location.query.sex=='男'?0:1,this.props.location.query.age||18],
            sexStr:this.props.location.query.sex||'女',
            showsex:false,
            reportDate:''

        };
    }

    componentDidMount() {
        console.log(this.props.location.query,"age88888")
          imgList=[];
          content=[];
          choice=[];
          sendList=[];
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
            mdtId: this.props.location.query.mdtId,
        })

        this.getAccessInfo();
        if(this.isAndroid()){
            document.getElementById("container1").style.overflow = 'hidden!important';
            document.getElementById("container1").style.position = 'relative';
        }

    }

    getAccessInfo(){
        Api
            .getAccessInfo()
            .then((res) => {
                console.log(res,'getAccessInfo')
                if(res.code==0){
                    this.setState({
                        prediagnosishead:res.data
                    })
                }
              
            },
            (e)=>{
                console.log(e,'getAccessInfo')
            })
    }

    showsex(){
        this.setState({
            showsex:!this.state.showsex
        })
    }

    prediagnosis(options){
        
        const { msgText="",prediagnosishead,sex,age,questions,session_id} = this.state;
        const _self = this;

        const param = {
            
            "header": {"hospital_id":!!prediagnosishead.hospitalId?prediagnosishead.hospitalId:''}, 

            "data": {
                "query":msgText||"你好",

                "patient_base_info":{
                    "sex":sex[0]||"",
                    "age":sex[1]||"",
                    "identity":-1, 
                    "open_id":"",
                     "case_id" : !!prediagnosishead.inquiryId?prediagnosishead.inquiryId:""
                },

                "session_id":session_id||'',

                "options": !!options?[options]:[],

                "visiting_status": !!this.props.location.query.visiting_status?this.props.location.query.visiting_status:1

            }
            
            
        }
        
        console.log(param,'paramparam')

        if(prediagnosishead){
            this.showLoading('发送中...')
            Api
            .prediagnosis(param)
            .then((res) => {
                this.hideLoading()
                console.log(this.state.msgText,"ooooo")
                if(res.code==0){

                    if(res.data.data.status==0){

                        if(res.data.data.questions.type==4){
                            PickerTime=[];
                            
                            console.log(res.data.data.questions.options,'options')

                            const option=res.data.data.questions.options;

                            let b=[];
                            for(let i=0;i<option.length;i++){
                                let children=[]
                                
                                console.log(option[i],'option')

                                for(let j=1;j<=option[i].range_item.end;j++ ){
                                    children.push({
                                        label:j,
                                        value:j,
                                    })

                                }

                                console.log(children,'children')

                                b.push({
                                    label:option[i].name,
                                    value:option[i].name,
                                    children
                                })

                            }

                            console.log(b,'bbbbbbbbb')

                            if(b.length>0){
                                PickerTime=b
                            }

                        }

                       

                        this.setState({
                            prediagnosisDate:res.data||'',
                            request_id:res.data.request_id||'', 
                            session_id:res.data.data.session_id||'',
                            questions:res.data.data.questions||'',
                            msgText:''
                        })
                        _self.addLeft(res.data.data.questions.query||'')

                    }else if(res.data.data.status==2){

                        this.setState({
                            msgText:'',
                            questions:'',
                            report_id:res.data.data.report_id
                        })
                        this.showLoading('报告生成中...')

                        // report_id
                        Api
                        .getReport(
                            {"inquiryId":!!prediagnosishead.inquiryId?prediagnosishead.inquiryId:""}
                        )
                        .then((datereg) => {
                            this.hideLoading()
                            console.log(datereg,'datereg....')
                            if(datereg.code==0){
                                this.setState({
                                    reportDate:datereg.data    
                                },()=>{
                                    document.getElementById("container1").style.height = 'auto';
                                    // _self.addReport()
                                })
                            }
                        },

                        (e)=>{
                            this.hideLoading();
                            this.setState({
                                msg: e.msg,
                                showIOS1: true
                            })
                            console.log(e,'getReport')
                        })

                    }
                }
              let questionsData=res.data.data.questions.options
              let choice=[]
               for(let i=0;i<questionsData.length;i++){
                    choice.push(questionsData[i].name)
                   
               } 
               if(res.data.data.questions.can_skip&&res.data.data.questions.type!=4&&res.data.data.questions.type!=6){
                        choice.push("不清楚","没有")
                    }
                console.log(res,'prediagnosissss')
                console.log(choice,"jjjj")
                console.log(res.data.data.questions.query,"qqqqqqqqqq")
                let obj={
                    content:res.data.data.questions.query,
                    choice:choice.toString(),
                    choiceTime:"",
                    type:1,
                    prediagnosisId:this.state.reportDate.id || "",
                    inquiryId:this.state.prediagnosishead.inquiryId,
                }
                sendList.push(obj)
            },
            (e)=>{
                this.hideLoading();
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })

                console.log(e,'prediagnosis222')
            })
        }else{
            console.log('获取inquiryId失败')
        }

     
    }


    questionsbtn(item){

        console.log(item,typeof(item),"iiiitem")
        const current=this.getCurrentDate()
        if(typeof item == 'object'){
             console.log("object",item)
            let obj={
                content:item.name,
                choice:"",
                choiceTime:current,
                type:2,
                prediagnosisId:this.state.reportDate.id || "",
                inquiryId:this.state.prediagnosishead.inquiryId,
            }
            sendList.push(obj)
            this.setState({
                msgText:item.name
            },()=>{
                this.addRight();
                this.prediagnosis({opt_id:item.opt_id,name:item.name})
            })
        }else if(typeof item == 'string' ){
            console.log("string",item)
            let obj={
                content:item,
                choice:"",
                choiceTime:current,
                type:2,
                prediagnosisId:this.state.reportDate.id || "",
                inquiryId:this.state.prediagnosishead.inquiryId,
            }
            sendList.push(obj)
            this.setState({
                msgText:item
            },()=>{
                this.addRight();
                this.prediagnosis()
            })

        }


    }

    addReport(){
        const {reportDate,prediagnosishead} = this.state;

        reportDate.visiting_status = !!this.props.location.query.visiting_status?this.props.location.query.visiting_status:1;

        const _this =this;

    //     `<div className="reportDate">
    //     <div className="report-tit">报告结果</div>
    //     {reportDate.inqueryId&&<div>报告ID：{reportDate.inqueryId}</div>}
    //     <div>年龄：{reportDate.age}</div>
    //     <div>性别：{reportDate.sex==0?'男':'女'}</div>
    //     {reportDate.birthHistory&&<div>{reportDate.birthHistory}</div>}
    //     {reportDate.currentHistory&&<div>{reportDate.currentHistory}</div>}
    //     {reportDate.familyHistory&&<div>{reportDate.familyHistory}</div>}
    //     {reportDate.feedingHistory&&<div>{reportDate.feedingHistory}</div>}
    //     {reportDate.marriageHistory&&<div>{reportDate.marriageHistory}</div>}
    //     {reportDate.medicalTreatment&&<div>{reportDate.medicalTreatment}</div>}
    //     {reportDate.menstrualHistory&&<div>{reportDate.menstrualHistory}</div>}
    //     {reportDate.pastHistory&&<div>{reportDate.pastHistory}</div>}
    //     {reportDate.createTime&&<div>创建时间：{reportDate.createTime}</div>}
    //     {reportDate.updateTime&&<div>更新时间：{reportDate.updateTime}</div>}
    
    // </div>`

    const div_item = document.createElement('div');
    div_item.className="reportDate";


    const div_tit = document.createElement('div');
    div_tit.className="report-tit";
    div_tit.innerHTML="报告结果";

    div_item.appendChild(div_tit)


    const div_id = document.createElement('div');
    // div_id.className="report-id";
    div_id.innerHTML="报告ID："+reportDate.inqueryId;

    div_item.appendChild(div_id)


    const div_age = document.createElement('div');
    div_age.innerHTML="年龄："+ reportDate.age;
    div_item.appendChild(div_age)

    const _sex = reportDate.sex==1?'女':reportDate.sex==0?'男':'';
    const div_sex = document.createElement('div');
    div_sex.innerHTML="性别："+ _sex ;
    div_item.appendChild(div_sex)

    

    if(reportDate.query){

        const div_query = document.createElement('div');
        div_query.innerHTML= '患者自述：'+reportDate.query;
        div_item.appendChild(div_query)

    }


    if(reportDate.birthHistory){

        const div_birthHistory = document.createElement('div');
        div_birthHistory.innerHTML= '出生史'+ reportDate.birthHistory;
        div_item.appendChild(div_birthHistory)

    }


    if(reportDate.currentHistory){

        const div_currentHistory = document.createElement('div');
        div_currentHistory.innerHTML= '现病史：'+reportDate.currentHistory;
        div_item.appendChild(div_currentHistory)

    }


    if(reportDate.familyHistory){

        const div_familyHistory = document.createElement('div');
        div_familyHistory.innerHTML= '家族史'+ reportDate.familyHistory;
        div_item.appendChild(div_familyHistory)

    }


    if(reportDate.feedingHistory){

        const div_feedingHistory = document.createElement('div');
        div_feedingHistory.innerHTML= '喂养史'+ reportDate.feedingHistory;
        div_item.appendChild(div_feedingHistory)

    }


    if(reportDate.marriageHistory){

        const div_marriageHistory = document.createElement('div');
        div_marriageHistory.innerHTML= '婚育史'+ reportDate.marriageHistory;
        div_item.appendChild(div_marriageHistory)

    }


    if(reportDate.medicalTreatment){

        const div_medicalTreatment = document.createElement('div');
        div_medicalTreatment.innerHTML= '诊疗经过'+ reportDate.medicalTreatment;
        div_item.appendChild(div_medicalTreatment)

    }


    if(reportDate.menstrualHistory){

        const div_menstrualHistory = document.createElement('div');
        div_menstrualHistory.innerHTML= '月经史'+ reportDate.menstrualHistory;
        div_item.appendChild(div_menstrualHistory)

    }    
    
    if(reportDate.pastHistory){

        const div_pastHistory = document.createElement('div');
        div_pastHistory.innerHTML= '既往病史：'+reportDate.pastHistory;
        div_item.appendChild(div_pastHistory)

    }    
    
    
    if(reportDate.createTime){

        const div_createTime = document.createElement('div');
        div_createTime.innerHTML= '创建时间：'+reportDate.createTime;
        div_item.appendChild(div_createTime)

    }


    const div_btn = document.createElement('div');

    div_btn.className="report-btn";
    div_btn.innerHTML="确定";

    div_btn.addEventListener("click", function(){
        // alert("成功");
 
        _this.context.router.push({
            pathname: '/consult/confirminfo',
            query: { inquiryId: prediagnosishead.inquiryId||'',
                reportDate:JSON.stringify(reportDate),
                doctorId: _this.props.location.query.doctorId||'',
                deptId: _this.props.location.query.deptId||'',
                totalFee: _this.props.location.query.totalFee||'',
                selectPatientId:_this.props.location.query.selectPatientId||'',
            }
        })

    });


    div_item.appendChild(div_btn)


    document.getElementById("content2").appendChild(div_item)


    
        let h11 = document.getElementById("getDatechnagBox").offsetHeight;
        let h12 = document.getElementById("peopleMessage-my").offsetHeight;
        let h133 = document.getElementById("container1").offsetHeight;

        
        
        document.getElementById("content3").style.height= (h133-h12-h11 - 44)+'px'



        document.getElementsByClassName("content3")[0].scrollTop=500000;

      
       
    }

//确定
    isgoReport(){
        // for(let i=0;i<choice.length;i++){
        //     if(choice[i]==""){
        //         choice.splice(i,1)
        //     } 

        // }
        // console.log("choice111",choice)
        const {reportDate,prediagnosishead} = this.state;
       // console.log("11reportDate",reportDate,prediagnosishead)
        reportDate.visiting_status = !!this.props.location.query.visiting_status?this.props.location.query.visiting_status:1;

        const _this =this;

        _this.context.router.push({
            pathname: '/consult/confirminfo',
            query: { inquiryId: prediagnosishead.inquiryId||'',
                reportDate:JSON.stringify(reportDate),
                doctorId: _this.props.location.query.doctorId||'',
                deptId: _this.props.location.query.deptId||'',
                totalFee: _this.props.location.query.totalFee||'',
                selectPatientId:_this.props.location.query.selectPatientId||'',
            }
        })
        // const newsendList=sendList.map((item,i)=>{
        //     return (
        //        item["prediagnosisId"]=this.state.reportDate.id || "" 
        //     )
            
        // })
        for(let i=0;i<sendList.length;i++){
            sendList[i]["prediagnosisId"]=reportDate.id || ""
            if(i==sendList.length-1){
               sendList.splice(i,1) 
            }
            
        }
        console.log(sendList,"newsendList")
        const param=sendList
        Api
        .saveItem(param)
        .then((res) => {
            if(res.code==0){
                //console.log("success")
            }
        },
        (e)=>{
            console.log(e,'res222')
        })
      
      
    }


    componentWillMount(){
        this.mounted = true;
    }
    componentWillUnmount() {
        
        this.mounted = false;
    }

    
    
    

    sexage(e){
        console.log(e,'sexage')
        this.setState({
            sexageval:e,
            // PickerView:e[1].toString()+e[0].toString(),
        })
    }

    hidesex(e){
        e.stopPropagation();
        e.preventDefault();
        this.setState({
            showsex:false
        })
    }
    
    bntsexage(){
        const {sexageval} = this.state;
        
        this.setState({
            sex:sexageval,
            sexStr:sexageval[0]==1?'女':'男',
            showsex:false
        })
    }

    PickerView(e){
      
        console.log(e,'PickerView')
        this.setState({
            datetime:e,
            PickerView:e[1].toString()+e[0].toString(),
        })
    }
    
    bntPickerTime(){
        
        const {PickerView} = this.state;
        this.setState({
            msgText:PickerView
        },()=>{
            this.addRight();
            this.prediagnosis()
        })
        console.log("PickerViewsss" ,PickerView)
        let current=this.getCurrentDate()
        let obj={
            content:PickerView,
            choice:"",
            choiceTime:current,
            type:2,
            inquiryId:this.state.prediagnosishead.inquiryId,
        }
        sendList.push(obj)
    }
    
    addLeft(msgText=''){

        if(msgText){
            const div_item = document.createElement('div');
            div_item.className="content-item";
    
            const div_right = document.createElement('div');
            div_right.className="left";
    
    
            const span_meuser = document.createElement('span');
            span_meuser.innerHTML="智能医生";
            span_meuser.className="ainame";
    
    
            const div_text = document.createElement('div');
            div_text.innerHTML=msgText;
            div_text.className="text";
    
            div_right.appendChild(span_meuser)
            div_right.appendChild(div_text)
            div_item.appendChild(div_right)
    
          
    
            document.getElementById("content2").appendChild(div_item)
   
         
            let h11 = document.getElementById("getDatechnagBox").offsetHeight;
            let h12 = document.getElementById("peopleMessage-my").offsetHeight;
            let h133 = document.getElementById("container1").offsetHeight;
    
            console.log(h133,h12,h11,'hhhhhhhhhh')
            
            
            document.getElementById("content3").style.height= (h133-h12-h11 - 44)+'px'
    
    
    
            document.getElementsByClassName("content3")[0].scrollTop=500000;

        }
       
    }

    addRight(){

        const div_item = document.createElement('div');
        div_item.className="content-item";

        const div_right = document.createElement('div');
        div_right.className="right";


        const div_flex = document.createElement('div');

        div_flex.className="flex";

        const span_meuser = document.createElement('span');
        span_meuser.innerHTML="我";
        span_meuser.className="meuser";


        const div_text = document.createElement('div');
        div_text.innerHTML=this.state.msgText;
        div_text.className="text";

        div_right.appendChild(div_flex)
        div_right.appendChild(span_meuser)
        div_right.appendChild(div_text)
        div_item.appendChild(div_right)

      

        document.getElementById("content2").appendChild(div_item)

        
        let h11 = document.getElementById("getDatechnagBox").offsetHeight;
        let h12 = document.getElementById("peopleMessage-my").offsetHeight;
        let h133 = document.getElementById("container1").offsetHeight;

        console.log(h133,h12,h11,'hhhhhhhhhh')
        
        
        document.getElementById("content3").style.height= (h133-h12-h11 - 44)+'px'
        



        document.getElementsByClassName("content3")[0].scrollTop=500000;

    }
//获取当前时间

getCurrentDate(){
              var timeStr = '-';
              var curDate = new Date();
              var curYear =curDate.getFullYear();  //获取完整的年份(4位,1970-????)
              var curMonth = curDate.getMonth()+1;
                if(curMonth<10) {
                    curMonth = '0'+curMonth;
                } //获取当前月份(0-11,0代表1月)
 
              var curDay = curDate.getDate(); 
                if(curDay<10) {
                    curDay = '0'+curDay;
                }  //获取当前日(1-31)
            //  var curWeekDay = curDate.getDay();    //获取当前星期X(0-6,0代表星期天)
              var curHour = curDate.getHours(); 
                 if(curHour<10) {
                    curHour = '0'+curHour;
                }     //获取当前小时数(0-23)
              var curMinute = curDate.getMinutes();
                if(curMinute<10) {
                    curMinute = '0'+curMinute;
                }   // 获取当前分钟数(0-59)
              var curSec =curDate.getSeconds();      //获取当前秒数(0-59)
                if(curSec<10) {
                    curSec = '0'+curSec;
                }
              var Current= curYear+timeStr+curMonth+timeStr+curDay+' '+curHour+':'+curMinute+':'+curSec;
              console.log(Current);
              // this.datetime=Current;
              return Current;
    }
    /*发送信息*/
    sendMsg1(e) {
        console.log('e',e)
        e.stopPropagation();
        e.preventDefault();
        window.scrollTo(0,0);
        let current=this.getCurrentDate()
        console.log(current,"发送current")
        console.log(this.state.inputText, this.state.msgText,' this.state.msgText')    
        //console.log(e.target.value,"e.target.value")
        if(this.state.inputText!=''){
            this.addRight();
            this.prediagnosis()
            let obj={
                content:this.state.inputText,
                choice:"",
                choiceTime:current,
                type:2,
                prediagnosisId:this.state.reportDate.id || "",
                inquiryId:this.state.prediagnosishead.inquiryId,
            }
            sendList.push(obj)
            this.setState({
                inputText:'',
                msgText:'',
            })

            var s=document.getElementsByClassName("content3")[0].scrollHeight;
            var h=document.getElementsByClassName("content3")[0].scrollTop;

            console.log("ssss",s, h);
        }
    }

   /*获取焦点事件*/
    input(e) {
        e.stopPropagation(); 
        e.preventDefault();
        this.setState({
            inputText: e.target.value,
            msgText: e.target.value,
        })
    }

    bodyheight(e){

       

        if(this.isAndroid()){
            // document.getElementsByTagName("body")[0].style.height = appheight+'px';

            let h11 = document.getElementById("getDatechnagBox").offsetHeight;
            let h12 = document.getElementById("peopleMessage-my").offsetHeight;
            // let h133 = document.getElementById("container1").offsetHeight;
            document.getElementById("content3").style.marginBottom = '0px'
            document.getElementById("content3").style.height= (appheight-h12-h11 - 44)+'px'
        }

    }

    isAndroid(){
        var u = navigator.userAgent, app = navigator.appVersion;
        return  u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    }

    bodyheightauto(e){

        if(this.isAndroid()){
            let h11 = document.getElementById("getDatechnagBox").offsetHeight;

            document.getElementById("content3").style.marginBottom = h11+'px'
            // document.getElementsByTagName("body")[0].style.height = 'auto';
            
        }

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
   
   /*隐藏添加图片*/
    hidePlus() {
        document.getElementById("txt").setAttribute("style", "padding-bottom:50px");
        if(window.location.hash.indexOf('aiInquiry')!=-1){
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
        if(window.location.hash.indexOf('aiInquiry')!=-1){

       
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
                        mdtId: this.state.mdtId,
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
                                                    roomId: that.state.mdtId,
                                                    userId:that.state.userId,
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
        clearInterval(this.state.interval2);
        console.log("into")
       hashHistory.push({
           pathname:'add/addManage',
           query:{id:id,source:1,orderIdStr:this.state.orderId,mdtId:this.state.mdtId,status:this.state.status,doctorName:this.state.doctorName}
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
         var filename=that.randomName()+uuid+'.png';
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
                        roomId: that.state.mdtId,
                        userId:that.state.userId,
                         url:'https://ihoss.oss-cn-beijing.aliyuncs.com/'+filename,
                     });
                     that.hideLoading();
                     that.setState({
                         imgArr:Array.from(new Set(imgList))
                     })
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
      details=()=>{
          if(!!this.state.mdtDetail.report){
            this.context.router.push({
                pathname:'/mdt/upload',
                query:{id:this.state.mdtDetail.id}
            })
          }else{
              this.context.router.push({
                  pathname:'/ordermng/mdtdetail',
                  query:{id:this.state.mdtDetail.id,resource:1}
              })
          }
      }



    render() {
        const {reportDate, showsex,sexageval,sex,sexStr,report_id,datetime,questions,mdtDetail,list=[{},{}],msgText,isShow,isEnd,docInfo,userInfo,doctorid,deptid,showPlus,interval,
        name,match,hieghtMore,showId,uId,patHisNo,score,txtNum,t1,t2,t3,t4,t5,timeShow,numEnd,pics,innerAudioContext,
        canEnd,appraisal,pingShow,newScore,itemList,detail,payBack,isOk,newText ,isDuration,newItem,status,
        newTime,doctorName,noDoctor,isIos,msg,endding,end,sign,signature,formData,policy,callback,OSSAccessKeyId,key,evaluateTime,isBtn,inputText,isPlay,prevText,nextprevText}=this.state

        const { selectName,visiting_status } = this.props.location.query

        console.log('selectName22',selectName)
        
        return (
            <div style={{height:'100%'}} className="chat">
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons}
                    show={this.state.showIOS1}>
                {msg}
            </Dialog>

                <div className="container1" id="container1" >
                    <div className="home bid" ><span className="jian"
                                                onClick={()=>{
                                                    this.context.router.goBack()

                                                    // if(this.props.location.query.resource=='report'){
                                                    //     this.context.router.goBack()
                                                    // }else{
                                                    //     this.context.router.push({
                                                    //         pathname:'inquiry/inquirylist',
                                                    //         query:{type:'mdt'}
                                                    //         })
                                                    // }
                                      }}
                        ></span>AI预问诊
                    </div>
                    <div className="peopleMessage-my" id="peopleMessage-my" >  

                            <img className="img-bj" src="./././resources/images/bl@2x.png" alt=""/>

                            <div>
                                <img className="img-jqr" src="./././resources/images/jqr@2x.png" alt=""/>
                            
                                <div className="ai-tit-btn" onClick={()=>{
                                    this.showsex()
                                }}>
                                    <span>{sexStr}</span>|<span>{sex[1]}</span>
                                </div>
                            </div>
                    </div> 
                    {showsex&&<div className="zhezao" onClick={(e)=>{this.hidesex(e)}} ></div>}
                    {showsex&&<div className="sexageBox">

                        <PickerView
                            onChange={(e)=>this.sexage(e)}
                            defaultValue={sexageval[0]}
                            defaultData={sexageval[1]}
                            value={sexageval}
                            data={sexage}
                            cascade={false}
                        />
                        <button className="isdatetime" onClick={()=>this.bntsexage()}>确定</button>

                        </div>}
                    

                    
                    {!!!reportDate&&<div className='operation-box-my'>
                        <div className='top' id="getDatechnagBox" style={{backgroundColor:"#fff"}}>

                            {!!!report_id&&(!!!questions||questions.type==2)&&<div className="inputmysad">
                            
                                
                                <TextArea autosize rows="1" cols="3" value={msgText} id="inputText"
                                    onChange={(e)=>{ this.input(e)}}
                                    onFocus={(e)=>{ this.bodyheightauto(e)}}
                                     onBlur={(e)=>{ this.bodyheight(e) }}

                                    />

                                <span className="addBtn"
                                    style={{marginBottom:'6px'}} 
                                    onClick={ (e)=>{
                                        e.stopPropagation();
                                        e.preventDefault();
                                        
                                        this.sendMsg1(e)
                                       
                                    }}
                                >发送</span>

                            </div>
                            }


                            {questions&& <div className="questionsBox">


                                {
                                    !!questions.options&&questions.type!=4&&questions.options.length>0&&questions.options.map((item,index)=>{

                                        return(
                                            <div className="questionsbtn" key={index} onClick={()=>{
                                                this.questionsbtn(item)
                                            }}>
                                                {item.name}
                                            </div>
                                        )
                                    })

                                }

                                {questions.can_skip&&questions.type!=4&&questions.type!=6&&<div className="questionsbtn"  onClick={()=>{
                                                this.questionsbtn('不清楚')
                                            }}>
                                                不清楚
                                            </div>
                                }

                                {questions.can_skip&&questions.type!=4&&questions.type!=6&&<div className="questionsbtn"  onClick={()=>{
                                                this.questionsbtn('没有')
                                            }}>
                                                没有
                                            </div>
                                }



                                </div>


                            
                            
                            }


                            {!!questions.options&&questions.type==4&&<div>

                                <PickerView
                                    onChange={(e)=>this.PickerView(e)}
                                    value={datetime}
                                    data={PickerTime}
                                    cols={2}
                                    // cascade={false}
                                />
                                <button className="isdatetime" onClick={()=>this.bntPickerTime()}>确定</button>

                            </div>}

                        </div>

                    </div>}


                    {!!!reportDate&&<div  className={`content3 contents `} id='content3'>

                             <div className='content2' id="content2">
                            
                                    <div className="content-item" id="txt" >

                                        <div className='left'>

                                            <span className="ainame">智能医生</span>

                                            <div className='text'>
                                                您可以输入您的症状开始预问诊
                                            </div>

                                        </div>

                                    </div>

            

                            </div>

                    </div>}


                    {!!reportDate&&<div className="reason" >
                        <div className="pre_content">
                            <div className="pre_pat">
                                <p className="left">问诊报告</p>
                                {reportDate&&reportDate.createTime&&<p className="right">生成时间：{reportDate&&reportDate.createTime.substr(0,10)}</p>}
                            </div>
                            <div className="pre_pat">
                                <p className="left">患者信息：<span>{!!selectName?selectName:''}|{sexStr}|{sex[1]}岁</span></p>
                                {/* <p className="right">初/复诊：<span>{visiting_status==2?'复诊':'初诊'}</span></p> */}
                            </div>
                            <div className="pre_pat">
                                <p className="left">患者自述：<span>{reportDate&&reportDate.query}</span></p>
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

                        {/* {reportDate&&reportDate.pastHistory&&<div className="pre-more">
                        <div className="pre_title"> 
                                <span></span>既往史
                        </div>
                        <div className="pre_info">
                        {reportDate&&reportDate.pastHistory}
                        
                        </div>
                        </div>} */}

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


                        <div className="report-btn" onClick={()=>{this.isgoReport()}}>确定</div>


                    </div>}

                </div>
                
            </div>
        );
    }
}
export default Connect()(Widget);