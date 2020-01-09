import React, { Component } from 'react';
import hashHistory from 'react-router/lib/hashHistory';
import { Button,Tab, NavBar, NavBarItem, TabBody, Dialog, Article, Cells, Cell, CellHeader, CellBody, CellFooter, Select,Label as Rlabel,Input } from 'react-weui';
import { Form } from 'antd';
import { Modal,Button as Buttona,Checkbox, Tabs, Flex, List, InputItem, Radio, Toast } from 'antd-mobile';
// 组件
// import TabCardComponent from '../tabcardcommond/tab/index'
// import TabCardSelect from '../tabcardcommond/select/index'
import AddForm from '../tabcardcommond/tabcardForm/index'
import Connect from '../../../components/connect/Connect';
// 图表
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';  //折线图是line,饼图改为pie,柱形图改为bar
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';

import * as Utils from '../../../utils/utils';
import * as Api from '../../../components/Api/Api';
import './style/index.scss';

import locale from 'antd/lib/date-picker/locale/zh_CN';

// const alert = Modal.alert;
const AgreeItem = Checkbox.AgreeItem
const echartTheme ={
    color: [
        '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
        '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
        '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
        '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
    ]
}
const now=new Date()
const year=now.getFullYear()
const month=now.getMonth()+1
const totleDay=(new Date(now.getFullYear(), parseInt(now.getMonth() + 1), 0)).getDate();
// 明天
const today=now.getDate()
// 当月第一天
const firstDate=year+'-'+month+'-'+'1'
// 当月最后一天
const lastDate=year+'-'+month+'-'+totleDay
// 当天
const todayDate=year+'-'+month+'-'+today
class UserCardJianChe extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }
  constructor(props){
    super(props)
    this.state = {
      tab:0,
      // 弹框是否显示
      isShow:false,
      celiangtime:'',
      cheliangzhi:'',
      qiehuan:false,
      valueList:[],
      // 历史数据查询选中,糖尿病，身高，体重
      historyTypevalue:'',
      // 
      option:{},
      // 提醒勾选提示
      confirmTitle:'',
      // 
      tixingChecked:true,
      // 图标是否显示
      historyDataIsShow:false,
      msg:'',
        patList:[],
        status:'0',
        cardNo:'',
        // 随访id
        followedId:'',
        // 患者id
        patientId:'',
        // 监测单项id
        monitorId:'',
        // 监测名称
        monitorName:'',
        // 标签名称
        tiaojianContent:'',
        // 标签列表
        tiaojianList:[],
        // 标签列表和监控单项列表对应
        daxiangItemDuiList:[],
        show1:false,
        show2:false,
        show3:false,
        diseases:{},
        dept:{},
        recordList:[],
        deptList:[],
        diseasesList:[],
        // 判断是否是第一次点击进入
        count:0,
        renyuanId:'',
        // 历史数据查询开始时间
        historytime:todayDate,
        // 历史数据查询结束时间
        // endHistorytime:lastDate,
        // 历史数据-监测单项列表
        jianceList:[],
        // 历史数据-监测单项所有数据
        historyDanXiang:[],
        // 历史数据-睡前睡后列表
        historyIsSleep:[],
        historyIsSleepValue:'',
        // 今日数据添加-监测单项列表
        jianceListToday:[],
        // 历史数据图表
        historyChartData:[],
        historyChartTimeData:[],
        // 开始月份
        monthStart:'',
        style1: {
            buttons: [
                {
                    label: '确定',
                    onClick: this.hideDialog.bind(this)
                }
            ]
        },
        style2: { 
            buttons: [
                {
                    type: 'default',
                    label: '取消',
                    onClick: this.quxiao.bind(this)
                },
                {
                    type: 'primary',
                    label: '确定',
                    onClick: this.baocun.bind(this)
                }
            ]
        },
        style3: { 
            buttons: [
                {
                    type: 'default',
                    label: '取消',
                    onClick: this.Confirmcancel.bind(this)
                },
                {
                    type: 'primary',
                    label: '确定',
                    onClick: this.ConfirmQueDing.bind(this)
                }
            ]
        },
    }
  }

  componentDidMount(){
    Utils.getJsByHide();
    // let time = new Date()
    // let startMonth=time.getMonth()+1+'月'+''
    if(!!window.localStorage.openId){
        this.getDept();
        this.getHistoryData()
     }else{
        var code='';
        if(window.location.origin=='https://tih.cqkqinfo.com'){
            code='ff8080816b4bfb65016bb08126130000';
      
          }else{
            code='ff8080816b4bfb65016bb08186d70001';
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
    
  }

  componentWillMount(){
     echarts.registerTheme('Imooc',echartTheme);
     window.addEventListener("resize", function() {
          barChart.resize();
        });
  }
  getOption =()=> {
    const {
      historyChartTimeData,
      historyChartDataName,
      historyChartData
    }=this.state
    console.log('getOption=',this.state)
    let option = {
      title:{
        text:'',
        x:'center'
      },
      tooltip:{
        trigger:'axis',
      },
      xAxis:{
        data:historyChartTimeData
      },
      yAxis:{
        type:'value'
      },
      series:[
        {
          name:`${historyChartDataName}`,
          type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
          data:historyChartData
        }
      ]
    }
   this.setState({
    option:option
   })
  }

  // 获取监测单项-历史
  danxianGetById(){
    this.setState({
      jianceList:[],
      historyTypevalue:'',
      historyIsSleep:[],
      historyIsSleepValue:'',
      historyDanXiang:[]
    })
    Api
    .danxianGetById({
      patientCardNo:this.state.cardNo,
      hisId:'2214',
      deptId:this.state.dept.deptId,
      diseasesId:this.state.diseases.diseasesId
    }).then((res)=>{
      if(res.code==0&&res.data.length>0){
        let danxiangListHistory=[]
        for(let it=0;it<res.data.length;it++){
          let daxiangHistoryItem={value:res.data[it].id,label:res.data[it].name}

          if(res.data[it].conditionArray.length>0){
            let ctb=[]
            for(let itb=0;itb<res.data[it].conditionArray.length;itb++){
              let isSleep={value:itb,label:res.data[it].conditionArray[itb]}
              ctb.push(isSleep)
            }
            daxiangHistoryItem.isSleep=ctb
          }
          
          danxiangListHistory.push(daxiangHistoryItem)
        }
        console.log('historyIsSleep=',danxiangListHistory[0].isSleep)
        console.log('historyIsSleep=',danxiangListHistory[0].isSleep[0])
        console.log('historyIsSleep=',danxiangListHistory[0].isSleep[0].label)
        this.setState({
          jianceList:danxiangListHistory,
          historyTypevalue:danxiangListHistory[0].value,
          historyIsSleep:danxiangListHistory[0].isSleep,
          historyIsSleepValue:danxiangListHistory[0].isSleep[0].label,
          historyDanXiang:res.data
        },()=>{
          console.log('historystate=',this.state)
          this.getHistoryDat()
        })
      }else{
        Toast.info('未获取到监测单项数据',1)
      }
    },e=>{
      Toast.info('未获取到监测单项数据',1)
    })
  }
  // 获取历史数据
  getHistoryData (){
    this.danxianGetById()
    this.getHistoryDat()
    
    // new Promise()
  }
  // 获取历史监测数据
  getHistoryDat(){
    console.log('historyIsSleepValue=',this.state.historyIsSleepValue)
    const {
      cardNo,
      historyTypevalue,
      historyIsSleepValue,
      historytime,
      // endHistorytime
    }=this.state
    Api
    .getHistoryData({
      patientCardNo:cardNo,
      hisId:'2214',
      deptId:this.state.dept.deptId,
      diseasesId:this.state.diseases.diseasesId,
      monitorId:historyTypevalue,
      
      monitorCondition:historyIsSleepValue,
      statisticsType:'',
      // startDate:historytime,
      endDate:historytime
    }).then((res)=>{
      if(res.code==0&&res.data&&res.data.length>0){
        // console.log('data=',res.data)
        Toast.info('查询成功',2)
        let histData=[]
        let hisTimeData=[]
        // res.data.map((item,index)=>{
        //   histData.push(item.monitorValue)
        //   hisTimeData.push(item.monitorTime)
        // })
        for(let i=0;i<res.data.length;i++){
          let dt=res.data[i]
          histData.push(dt.monitorValue)
          let nianyue=''
          if(dt.monitorTime){
            nianyue=dt.monitorTime.split(' ')[0]
          }
          hisTimeData.push(nianyue)
        }
        this.setState({
          historyDataIsShow:true,
          historyChartData:histData,
          historyChartDataName:res.data[0].monitorName,
          historyChartTimeData:hisTimeData
        })
        this.getOption()
      }else{
        Toast.info('未查询到该时间段内的测量值',2)
        this.setState({
          historyDataIsShow:false,
        })
      }
    })
  }
  // 取消
    quxiao(){
      this.setState({
        showIOS2: false
      })
    }
    // 增加监测数据
    baocun(){
      var numType=document.getElementsByTagName('select')[0].value
      const {
        celiangtime,
        cheliangzhi,
        cardNo
      } = this.state
      if (cheliangzhi.trim()==''){
        this.setState({
          showIOS2:false,
          qiehuan:true,
          showIOS1:true,
          msg:'请输入测量值'
        })
        return
      }
      if (celiangtime==''){
        this.setState({
          showIOS2:false,
          qiehuan:true,
          showIOS1:true,
          msg:'请输入测量时间'
        })
        return
      }
      if (cheliangzhi&&cheliangzhi.toString().indexOf('e')>=0) {
        this.setState({
          showIOS2:false,
          qiehuan:true,
          showIOS1:true,
          msg:'测量请输入数字'
        })
        return
      }
      this.setState({
        showIOS2: false
      })
      // let weizhiT=celiangtime.indexOf('T')
      // let requestTime=celiangtime.substring(0,weizhiT).concat(' ',celiangtime.substring(weizhiT+1),':00')
      let weizhiTime=new Date(celiangtime)
      let requestTime=weizhiTime.getFullYear()+'-'+(weizhiTime.getMonth()+1)+'-'+weizhiTime.getDate()+' '+weizhiTime.getHours()+":"
        +weizhiTime.getMinutes()+':'+(weizhiTime.getSeconds()>10?weizhiTime.getSeconds():'0'+weizhiTime.getSeconds())
      // 发送请求
      Api
      .addTodayData({
        hisId:'2214',
        deptId:this.state.dept.deptId,
        deptName:this.state.dept.deptName,
        monitorId:this.state.monitorId,
        monitorName:this.state.monitorName,
        monitorValue:cheliangzhi,
        monitorTime:requestTime,
        monitorCondition:this.state.tiaojianContent,
        patientId:this.state.patientId,
        followedId:this.state.followedId,
      }).then((res)=>{
        console.log(res)
        if(res.code==0){
          Toast.info('添加成功',2)
          this.setState({
            cheliangzhi:'',
          })
          this.getTodayDat()
        }else{
          Toast.info('添加失败',2)
        }
      },(e) => {
        this.setState({
            showIOS1:true,
            msg:'未添加成功',
            cheliangzhi:'',
        })
      })
      
    }
    // 添加数据-下拉选
    danxiangOnChange(ite){
      var mId=ite[ite.selectedIndex].value
      var mName=ite[ite.selectedIndex].label
      console.log('ite=',ite)
      const {
        daxiangItemDuiList
      }=this.state
      for(let i=0;i<daxiangItemDuiList.length;i++){
        if(mId==daxiangItemDuiList[i].value){
          if(daxiangItemDuiList[i].contArr){
            this.setState({
              tiaojianList:daxiangItemDuiList[i].contArr,
              // tiaojianContent:daxiangItemDuiList[i].contArr[0].label
              tiaojianContent:daxiangItemDuiList[i].contArrString
            })
          }else{
            this.setState({
              tiaojianList:[],
              tiaojianContent:''
            })
          }
        }

      }
      this.setState({
        monitorId:mId,
        monitorName:mName,
      })
    }
    // 添加数据-标签下拉选
    // biaoqianOnChange(ite){
    //   this.setState({tiaojianContent:ite[ite.selectedIndex].label})
    // }

  // 发送添加数据请求
  getDept(){
    Api
    .getDeseaseType({
        hisId:'2214',
        openid:window.localStorage.openId
    })
    .then((res) => {
        console.log(res)
        if(res.code==0&&res.data&&res.data.patientList.length>0){
            var list=res.data.patientList;
            console.log('list=',list)
            console.log('patientCardNo=',list[0].patientCardNo)
            console.log('dept=',list[0].deptList[0])
            console.log('diseases=',list[0].deptList[0].diseasesList[0])
            console.log(969696)
            for(var i=0;i<list.length;i++){
                if(i==0){
                    list[i].active=true;
                }else{
                    list[i].active=false;
                }
            }
            this.setState({
                patList:list,
                cardNo:list[0].patientCardNo,
                followedId:list[0].followedId,
                patientId:list[0].patientId,
                dept:list[0].deptList[0],
                diseases:list[0].deptList[0].diseasesList[0],
            },()=>{
              console.log('list.state=',this.state)
            })
            
            console.log(66625252)
            console.log(list[0].deptList,list[0].deptList[0].diseasesList)
            var list1=list[0].deptList;
            var list2=list[0].deptList[0].diseasesList;
            for(var i=0;i<list1.length;i++){
                if(i==0){
                    list1[i].active=true;
                }else{
                    list1[i].active=false;
                }
            }
            for(var i=0;i<list2.length;i++){
                if(i==0){
                    list2[i].active=true;
                }else{
                    list2[i].active=false;
                }
            }
            this.setState({
                deptList:list1,
                diseasesList:list2
            })

            this.getTodayDat()

        }else{
          this.setState({
              showIOS1:true,
              msg:'未获取到数据'
          })
        }
      
    }, (e) => {
      this.setState({
          showIOS1:true,
          msg:'未获取到数据',
      })
    });
  }

  // 提醒确定
  ConfirmQueDing(){
    console.log('555555',this.state)
    this.setState({
      show3:false
    })
    Api
    .getTodayFlag({
      patCardNo:this.state.cardNo,
      hisId:'2214',
      deptId:this.state.dept.deptId,
      diseasesId:this.state.diseases.diseasesId,
      monitorNotifyFlag:this.state.tixingChecked?1:0
    })
    .then((res)=>{
      if(res.code==0){
        Toast.info('修改成功',2)
        this.setState({
          tixingChecked:!this.state.tixingChecked,
        })
      }else{

        Toast.info('修改失败',2)
      }
    })
  }
  // 提醒取消
  Confirmcancel(){
    this.setState({
      // tixingChecked:!this.state.tixingChecked,
      show3:false,
    })
  }

  // 今日数据提醒
  setTodayFlag=(e)=>{
     console.log('e=',e.target.checked)
     let title=''
    if(!e.target.checked){
      title='您确定要取消提醒？'
    }else{
      title='开启后，系统会根据护士建议的测量频次进行提醒'
    }
    this.setState({
        show3:true,
        // tixingChecked:e.target.checked,
        confirmTitle:title
      })

  }

  // 获取今日数据
  async getTodayDat(){
    console.log(55555)
    console.log('555state=',this.state)
    this.setState({
      monitorName:'',
      monitorId:'',
      jianceListToday:'',
      valueList:[]
    })
    const res =await Api
      .getByTodayData({
        patientCardNo:this.state.cardNo,
        hisId:'2214',
        deptId:this.state.dept.deptId,
        diseasesId:this.state.diseases.diseasesId
      })
    if(res.code==0&&res.data&&res.data.length>0){
      console.log('6666666')
      console.log('rest=',res)
      console.log('rest=',res.data)
      console.log('rest=',res.data.length)
      // if(res.code==0&&res.data&&res.data.length>0){
        console.log('858588') 
        let danxiangList=[]
        let daxiangItemDuiList=[]
        
        for(let it=0;it<res.data.length;it++){
          let daxiangItemDui={value:res.data[it].id} 
          let daxiangItem={value:res.data[it].id,label:res.data[it].name}
          danxiangList.push(daxiangItem)
          // 存储标签
          let tiaojianList=[]  
          let tiaojianDat=res.data[it].conditionArray
          if(tiaojianDat){
            for(let itd=0;itd<tiaojianDat.length;itd++){
              let tiaojianItem={value:itd,label:tiaojianDat[itd]}
              tiaojianList.push(tiaojianItem)
            }
            daxiangItemDui.contArr=tiaojianList
            // contArr只有label的字符串 '测试，是一iidasdsa；侧阿达；车阿萨法萨芬；的撒的撒；奥术大师多撒；大大'
            daxiangItemDui.contArrString=res.data[it].conditions
          }
            daxiangItemDuiList.push(daxiangItemDui)
        }
        // 获取今日时间
        let datTime=new Date()
        let tondayMonth=parseInt(datTime.getMonth())+1>=10?parseInt(datTime.getMonth())+1+'':'0'+parseInt(datTime.getMonth())+1
        let todayDay=datTime.getDate()>=10?datTime.getDate()+'':'0'+datTime.getDate()
        let todayDat=datTime.getFullYear().toString().concat(".",tondayMonth,'.',todayDay)
        // 第一次标签赋值
        this.setState({
          monitorName:danxiangList[0].label,
          monitorId:danxiangList[0].value,
          jianceListToday:danxiangList,
          valueList:res.data,
          daxiangItemDuiList,
          todayTime:todayDat
        })
        if(daxiangItemDuiList.length>0&&daxiangItemDuiList[0].contArr){
          this.setState({
            tiaojianList:daxiangItemDuiList[0].contArr,
            // tiaojianContent:daxiangItemDuiList[0].contArr[0].label
            tiaojianContent:daxiangItemDuiList[0].contArrString
          })
        }

      // }
    }else{
      console.log('666666688888888888')
       console.log('rest=',res)

    }
    // Api
    // .getByTodayData({
    //   patientCardNo:this.state.cardNo,
    //   hisId:'2214',
    //   deptId:this.state.dept.deptId,
    //   diseasesId:this.state.diseases.diseasesId
    // })
    // .then((res)=>{
    //   console.log('rest=',res)
    // }, (e) => {
    //   console.log('e=',e)
    //   this.setState({
    //     showIOS1:true,
    //     msg:'未获取到数据',
    //   })
    // })
  }
  showDept(id,item){
        var list=this.state.deptList;
        console.log('typeitme=',item)
        console.log('typestate=',this.state)
        for(var i=0;i<list.length;i++){
            if(id==list[i].deptId){
                this.setState({
                    dept:list[i]
                })
                list[i].active=true;
            }else{
               list[i].active=false;
            }
        }
        
        this.setState({
            deptList:list,
         
        })
        this.getTodayDat(this.state.status,this.state.cardNo)

  }
  showDiseases(id){
      console.log("id",id,this.state.diseasesList)
      var list=this.state.diseasesList;
      var flag;
      for(var i=0;i<list.length;i++){
           console.log(id,list[i].diseasesId)
          if(id==list[i].diseasesId){
              console.log("i",i)
              flag=i;
              this.setState({
                  diseases:list[i]
              })
              list[i].active=true;
          }else{
             list[i].active=false;
          }
      }
      this.setState({
          diseasesList:list,
          diseases:list[flag]
      },()=>{
        this.getTodayDat(this.state.cardNo)
      })

  }
  // 切换就诊卡
  selectPat(id,item){
      console.log("id",id)
      console.log("idt",item)
      console.log("itemstate=",this.state)
      var list=this.state.patList;
      var data=[];
      var dt=item.deptList
      var deptListd=[]
      for(var i=0;i<list.length;i++){
          if(list[i].patientCardNo==id){
              list[i].active=true;
               
              var list1=list[i].deptList;
              var list2=list[i].deptList[0].diseasesList;
              console.log(7777777)
              // console.log('deptListd=',deptListd)
              console.log('is=',deptListd.indexOf(this.state.dept.deptId))
              console.log('deptqian=',this.state.dept)
              // console.log('td,',deptListd.length>0&&deptListd.indexOf(this.state.dept.deptId)<0)
              console.log('list1=',list1)
              
              for(var j=0;j<list1.length;j++){
                  if(j==0){
                      list1[j].active=true;
                  }else{
                      list1[j].active=false;
                  }
              }
              for(var z=0;z<list2.length;z++){
                  if(z==0){
                      list2[z].active=true;
                  }else{
                      list2[z].active=false;
                  }
              }
             
          }else{
              list[i].active=false;
          }

      }


         this.setState({
          dept:item.deptList[0],
          deptList:item.deptList,
          diseasesList:item.deptList[0].diseasesList,
          diseases:item.deptList[0].diseasesList[0],
          cardNo:id,
          followedId:item.followedId,
          patientId:item.patientId,
        },()=>{
          console.log("state6666=",this.state)
          if(this.state.status=='0'){
            this.getTodayDat()
          }else{
            this.getHistoryData()
          }
        })


      // this.setState({
      //     patList:list,

      // })

  }
  // 时间转换显示
  changeTime(time){
    let hours=''
    let minutes=''
    // console.log('time=',time)
    if(time&&time!=''){
      // let date=new Date(time)
      time = time.replace(/-/g,':').replace(' ',':');
      time = time.split(':');
      // console.log('tie',time)
      // var date = new Date(time[0],(time[1]-1),time[2],time[3],time[4],time[5])
      // hours=date.getHours()>=10?String(date.getHours()):'0'+String(date.getHours())
      // minutes=date.getMinutes()>=10?String(date.getHours()):'0'+String(date.getHours())
      hours=time[3]
      minutes=time[4]
    }
    return hours!=''?hours.concat(":",minutes):'-'
  }

  hideDialog() {
    this.setState({
      showIOS1: false,
      showAndroid1: false,
      showAndroid2: false,
    });
    if(this.state.qiehuan){
      this.setState({
        showIOS2:true,
        qiehuan:false
      })
    }
  }

  // 历史记录查询选中-单项
  typeOnChange=(item)=>{
    console.log('checked=',item)
    this.setState({
      historyTypevalue:item.value,
      historyIsSleep:item.isSleep,
      historyIsSleepValue:item.isSleep[0].label
    },()=>{
      // 获取历史数据
      this.getHistoryDat()
    })
  }
  // 历史记录查询选中-睡前睡后
  sleepOnChange=(item)=>{
    console.log('sleepitem=',item)
    this.setState({
      historyIsSleepValue:item.label
    },()=>{
      // 获取历史数据
      this.getHistoryDat()
    })
  }
  // 历史记录查询选中-开始时间
  dateOnChange=(item)=>{
    console.log('datachange=',item)
    this.setState({
      historytime:item
    },()=>{
      // 获取历史数据
      this.getHistoryDat()
    })
  }

  


  render() {
    const {
      kemudata,
      valueList,
      isShow,
      jianceList,
      jianceListToday,
      historyTypevalue,
      tiaojianList,
      todayTime,
      msg,
       deptList,
       patList,
       show1,
       show2,
       recordList,
       status,
       diseases,
       dept,
       diseasesList,
       celiangtime,
       cheliangzhi,
       historytime,
       historyIsSleep,
       historyDataIsShow
    } = this.state
    console.log('this.state555=',this.state)
    return(
      <div className="page-ask-indext">
        {show1&&<div className='selectDept' onClick={()=>{
            this.setState({show1:false})
        }}> 
           {!!deptList&&deptList.length>0&&<div className='contents'>
                <div className='titles sp'>请选择科室</div>
                {!!deptList&&deptList.length>0&&deptList.map((item,index)=>{
                    if(item.active){
                        return(
                            <div className='sp'  key={index}
                            onClick={()=>{
                                this.showDept(item.deptId,item)
                            }} style={{color:'#4cabcf'}}>{item.deptName}</div>
                           )
                    }else{
                        return(
                            <div className='sp'  key={index}
                            onClick={()=>{
                                this.showDept(item.deptId,item)
                            }} >{item.deptName}</div>
                           )
                    }
                   
                  
                })}
               
            </div>}
        </div>}
        {show2&&!!diseasesList&&diseasesList.length>0&&<div className='selectDept' onClick={()=>{
            this.setState({show2:false})
        }}> 
           <div className='contents'>
                <div className='titles sp'>请选择病种</div>
                {!!diseasesList&&diseasesList.length>0&&diseasesList.map((item,index)=>{
                    if(item.active){
                        return(
                            <div className='sp' key={index}
                            onClick={()=>{
                                this.showDiseases(item.diseasesId)
                            }} style={{color:'#4cabcf'}}>{item.diseasesName}</div>
    
                        )
                    }else{
                        return(
                            <div className='sp' key={index}
                            onClick={()=>{
                                this.showDiseases(item.diseasesId)
                            }} >{item.diseasesName}</div>
    
                        )
                    }
                })}
            </div>
        </div>}
        <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
            {msg}
        </Dialog>
        <Dialog type="ios"  buttons={this.state.style3.buttons} show={this.state.show3}>
            {this.state.confirmTitle}
        </Dialog>
        <Dialog type="ios" buttons={this.state.style2.buttons} show={this.state.showIOS2} className='jianche-dialog'>
            <Flex className='dialog'>
              <Flex.Item>
                  <Rlabel>数据类型</Rlabel>
              </Flex.Item>
              <Flex.Item className='add-form-flex bbt'>
                  <List>
                  <select className='add-form-select' onChange={e=>{this.danxiangOnChange(e.target)}}>
                  {
                    jianceListToday&&jianceListToday.map((jianceListTodayIt,jianceListTodayIn)=>{
                      return(
                        <option value={jianceListTodayIt.value}>{jianceListTodayIt.label}</option>
                      )
                    })
                  }
                  </select>
                  <span className='add-form-flex-jiantoutype'></span>
                </List>
              </Flex.Item>
            </Flex>
            {
              tiaojianList&&tiaojianList.length>0?
              <Flex className='dialog'>
                <Flex.Item>
                    <Rlabel>标签</Rlabel>
                </Flex.Item>
                <Flex.Item className='dialog-biaoqian'>
                    {
                        tiaojianList.map((tiaojItem,tiaojIndex)=>{
                          if(tiaojIndex<5)
                           return(
                              <div key={tiaojIndex}>
                                {tiaojItem.label}
                              </div>
                            )
                        })
                    }
                </Flex.Item>
              </Flex>:null
            }
            <Flex className='add-data'>
              <Flex.Item>
                  <Rlabel>测量值</Rlabel>
              </Flex.Item>
              <Flex.Item className='add-form-flex'>
                  <input type="number" className='add-data-celiangzhi' value={cheliangzhi} pattern="[0-9]*" name='cheliangzhi' placeholder="请输入测量值" onChange={ e=> {this.setState({cheliangzhi:e.target.value})}}/>
              </Flex.Item>
            </Flex>
            <Flex className='add-form-oneflex'>
              <Flex.Item>
                  <Rlabel>测量时间</Rlabel>
              </Flex.Item>
              <Flex.Item className='add-form-flex'>
                  <Input type="datetime-local" defaultValue='' onChange={ e => {this.setState({celiangtime:e.target.value})}}/>
                  <span className='add-form-flex-jiantou'></span>
              </Flex.Item>
            </Flex>
            
        </Dialog>
        {
            !!patList&&patList.length<=0&& <div  className='no-data' style={{background:'white'}}>
            <img src='../../../resources/images/no-result.png'/>
            <div style={{paddingBottom:'350px'}}>暂未查询到相关信息</div>
            </div>
          }
          {!!patList&&patList.length>0&&<div className="manageInfo">
             <div className="patient">
               {!!patList&&patList.length>0&&patList.map((item,index)=>{
                     return(
                        <div className={`${item.active?'pat-item active':'pat-item'}`} key={index}
                        onClick={()=>{
                            this.selectPat(item.patientCardNo,item)
                        }}>
                         {item.patientName}
                        <span></span>
                      </div>
                     )
                  })
                }
              </div>
                <div className="infot">
                  <div className="dept" >
                    <div className="dept-item" onClick={()=>{
                        this.setState({show1:true})
                    }}>
                        科室：{dept.deptName}
                        <img 
                        src="./././resources/images/csf_xl.png"
                            alt=""
                            /> 
                    </div>
                    <div className="dept-item"  onClick={()=>{
                        this.setState({show2:true})
                    }}>
                        病种：{diseases.diseasesName}
                        <img 
                        src="./././resources/images/csf_xl.png"
                            alt=""
                            /> 
                    </div>
                </div>
                <div className="type">
                  <div className={`type-item ${status=='0'?'active':''}`} onClick={()=>{
                    
                      this.setState({status:'0'})
                      this.getTodayDat()
                  }}>
                    <div className='type-item-today'>
                      今日数据
                    </div>
                    <div className='type-item-riqi'>
                      {todayTime}
                    </div>
                  </div>
                  <div className={`type-item ${status=='1'?'active':''}`} onClick={()=>{
                    this.setState({status:'1'})
                    this.getHistoryData()
                }}>
                   历史数据
                  </div>
                </div>

                <div>
                  <div className={`${status=='0'?'jianche-type':'jianche-yinchang'}`}>
                    {
                      valueList&&valueList.length>0?valueList.map((itemt,inde) => {
                        return (
                          <div key = {inde} >
                            <div >
                              <h4>{itemt.name}</h4>
                            </div>
                            <Cells className='type-list'>
                              {
                                itemt.fillinVos&&itemt.fillinVos.length>0?
                                  itemt.fillinVos.map((item,index) => {
                                    return (
                                      <Flex key={index} className='jianche-flex-list'>
                                        <img src="./././resources/images/xtzx@2x.png" />
                                        <span>{ item.monitorValue }</span>
                                        <div className='jianche-flex-list-modile'>
                                          {
                                            item.monitorCondition&&item.monitorCondition.split('；').length>0?
                                              item.monitorCondition.split('；').map((mItem,mIndex)=>{
                                                return (<span key={mIndex} className='jianche-flex-list-span'>{ mItem }</span>)
                                              }):null
                                          }
                                        </div>
                                        <Flex.Item className='jianche-flex-list-item'>
                                          { this.changeTime(item.monitorTime) }
                                        </Flex.Item >
                                      </Flex>
                                    )
                                  }):
                                  <div className='jianche-type-neirong'>
                                    <span>暂未添加数据</span>
                                  </div>
                              }
                            </Cells>
                          </div>
                          )
                        }):null
                        
                    }
                    {
                      valueList&&valueList.length>0?
                        <div>
                          <div>
                            <Button type='primary' onClick = { ()=>{this.setState({showIOS2:true,cheliangzhi:'',})} }>添加数据</Button>
                          </div>
                          <div>
                            <AgreeItem data-seed="logId" checked={this.state.tixingChecked} onChange={e => this.setTodayFlag(e)} >
                              数据监测提醒
                            </AgreeItem>
                          </div>
                        </div>:
                        <div className='jianche-type-neirong'>
                          <span>暂未添加数据</span>
                        </div>
                    }
                        
                  <div>

                  </div>
                </div>
                <div className={`${status=='1'?'jianche-shuju':'jianche-yinchang'}`}>
                  <div>
                    <Flex className='history-data'>
                        {
                          jianceList?jianceList.map((typeItem,typeIndex)=>{
                              return(
                                <div className={`history-data-biaoqian ${historyTypevalue==typeItem.value?'addcolor':''}`} key={typeItem.value} onClick={()=>this.typeOnChange(typeItem)}>
                                  {typeItem.label}
                                </div>
                              )
                          }):
                          <div className='jianche-type-neirong'>
                            <span>暂未添加数据</span>
                          </div>
                        }
                    </Flex>
                    {
                      jianceList&&jianceList.length>0?
                        <div>
                        <Flex className='history-data'>
                          <Flex.Item className='history-data-suimian'>
                            <List>
                              
                                <select className='history-form-select' onChange={e=>{this.sleepOnChange(e.target)}}>
                                {
                                  historyIsSleep&&historyIsSleep.map((historyIsSleepIt,historyIsSleepIn)=>{
                                    return(
                                      <option value={historyIsSleepIt.value}>{historyIsSleepIt.label}</option>
                                    )
                                  })
                                }
                                </select>
                                <span className='history-form-flex-jiantoutype'></span>
                            </List>
                          </Flex.Item>
                          <Flex.Item className='history-data-flex bbc'>
                            <Input type="date" defaultValue={historytime} onChange={ e => {this.dateOnChange(e.target.value)}}/>
                            <span className='history-form-flex-jiantou'></span>
                          </Flex.Item>
                        </Flex>
                        </div>
                        :
                        <div className='jianche-type-neirong'>
                          <span>暂未添加数据</span>
                        </div>
                    }
                  </div>
                  {/*<div id='quxiaotu'>
                  </div>*/}
                  {
                    historyDataIsShow?
                      <div title="历史数据">
                          <ReactEcharts option={this.state.option} theme="Imooc"  style={{height:'400px'}}/>
                      </div>:null
                  }
                </div>
           </div>
        </div>
          
        </div>
         }
      </div>
    )
  }
}
export default Connect()(UserCardJianChe);