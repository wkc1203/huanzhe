import React, { Component } from 'react';
import hashHistory from 'react-router/lib/hashHistory';
import { Tab, NavBar,Button as ButtonN, NavBarItem, TabBody, Dialog, Article, Cells, Cell, CellHeader, CellBody, CellFooter, Select,Label as Rlabel,Input } from 'react-weui';
import { Form } from 'antd';
import { Button, Checkbox, Tabs, Flex, List, InputItem, Radio, Toast } from 'antd-mobile';
// 组件
// import TabCardComponent from '../tabcardcommond/tab/index'
// import TabCardSelect from '../tabcardcommond/select/index'
import AddForm from '../tabcardcommond/tabcardForm/index'
import Connect from '../../../components/connect/Connect';
// 图表
// import Hightcharts from 'highcharts';

import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts/lib/echarts';
import * as Utils from '../../../utils/utils';
import * as Api from '../../../components/Api/Api';
import './style/index.scss';

const AgreeItem = Checkbox.AgreeItem

var now = new Date();
var nowMonth = now.getMonth(); //当前月 
var nowYear = now.getFullYear(); //当前年 
//本月的开始时间
var monthStartDate = new Date(nowYear, nowMonth, 1).getDate(); 
//本月的结束时间
var monthEndDate = new Date(nowYear, nowMonth+1, 0).getDate();
// 当月
let currentMonth=(nowMonth+1)>=10?(nowMonth+1):'0'+(nowMonth+1)
// 当天
let currentDay=monthStartDate>=10?monthStartDate:'0'+monthStartDate
let firstDay=nowYear+'-'+currentMonth+'-'+currentDay
let endDay=nowYear+'-'+currentMonth+'-'+monthEndDate
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
        // 标签数组字符串
        tianjiaContentData:'',
        // 今日数据提醒
        isShowXuanZhong:true,
        show1:false,
        show2:false,
        showIOS3:false,
        diseases:{},
        dept:{},
        recordList:[],
        deptList:[],
        diseasesList:[],
        // 判断是否是第一次点击进入
        count:0,
        renyuanId:'',
        // 历史数据查询当日时间
        historytime:'',
        // 历史数据-监测单项列表
        jianceList:[],
        // 历史数据-监测单项所有数据
        historyDanXiang:[],
        // 历史数据-睡前睡后列表
        historyIsSleep:[],
        historyIsSleepValue:'',
        // 查询默认时间
        todayHistoryDat:'',
        // 今日数据添加-监测单项列表
        jianceListToday:[],
        // 添加数据 选中标签
        tiaojianListChecked:[],
        // 历史数据图表
        historyChartData:[],
        historyChartTimeData:[],
        // 添加数据-数值单位
        unit:'',
        // 开始月份
        monthStart:'',
        // 历史数据时间
        todayHistoryDatStart:firstDay,
        todayHistoryDatEnd:endDay,
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
                    onClick: this.tixingquxiao.bind(this)
                },
                {
                    type: 'primary',
                    label: '确定',
                    onClick: this.tixingbaocun.bind(this)
                }
            ]
        },
        option:{},
        // 最高值
        normalHigh:0,
        normalLow:0,
        // 历史数据展示
        isShowHistoryTu:false,
    }
  }

  componentDidMount(){
    window.scrollTo(0, 0);
    console.log('test this question')
    Utils.getJsByHide();
    let time = new Date()
    // let startMonth=time.getMonth()+1+'月'+''
    if(!!window.localStorage.openId){
        this.getDept();
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
    
  }

  // 绘制历史数据图标 myEchart.resize()
  setHistoryMap=(histData,hisTimeData,normalHigh,normalLow)=>{
    this.setState({
      isShowHistoryTu:true,
    })
    // const {
    //   normalHigh,
    //   normalLow
    // } = this.state
    console.log('this.state55566=',normalHigh,normalLow)
    let option = {
      tooltip: {
          trigger: 'axis'
      },
      legend: {
          data:['最高','最低']
      },
      // toolbox: {
      //     show: true,
      //     feature: {
      //         dataZoom: {
      //             yAxisIndex: 'none'
      //         },
      //         dataView: {readOnly: false},
      //         magicType: {type: ['line', 'bar']},
      //         restore: {},
      //         saveAsImage: {}
      //     }
      // },
      xAxis:  {
          type: 'category',
          boundaryGap: false,
          data: hisTimeData
      },
      yAxis: {
          type: 'value',
          axisLabel: {
              formatter: '{value}'
          }
      },
      series: [
          {
              name:'测量值',
              type:'line',
              data:histData,
              color:'#4cabcf',
              markLine: {
                  symbol:"none",
                  label:{
                    position:'end'
                  },
                  data: [
                      {name: '最高值', yAxis: normalHigh, lineStyle:{type:'dotted',color:'red'}},
                      { name: '最低值',yAxis: normalLow, lineStyle:{type:'dotted',color:'red'}},
                  ]
              }
          }
      ]
    };
    this.setState({
      option,
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
            daxiangHistoryItem.normalLow=res.data[it].normalLow
            daxiangHistoryItem.normalHigh=res.data[it].normalHigh
          }
          
          danxiangListHistory.push(daxiangHistoryItem)
        }
        console.log('historyIsSleep=',danxiangListHistory[0].isSleep)
        console.log('historyIsSleep=',danxiangListHistory[0].isSleep[0])
        // console.log('historyIsSleep=',danxiangListHistory[0].isSleep[0].label)
        this.setState({
          jianceList:danxiangListHistory,
          normalLow:danxiangListHistory[0].normalLow,
          normalHigh:danxiangListHistory[0].normalHigh,
          historyTypevalue:danxiangListHistory[0].value,
          historyIsSleep:danxiangListHistory[0].isSleep,
          historyIsSleepValue:danxiangListHistory[0].isSleep[0].label,
          historyDanXiang:res.data
        })
          this.getHistoryDat()
      }else{
        Toast.info('未获取到监测单项数据',2)
      }
    },e=>{
      Toast.info('未切换到监测单项数据',2)
    })
  }
  // 获取历史数据
  getHistoryData (){
    this.danxianGetById()
    // this.getHistoryDat()
    
    // new Promise()
  }
  // 获取历史监测数据
  getHistoryDat(){
    console.log('historyIsSleepValue=',this.state.historyIsSleepValue)
    const {
      todayHistoryDatStart,
      todayHistoryDatEnd,
      normalHigh,
      normalLow
    } = this.state
    Api
    .getHistoryData({
      patientCardNo:this.state.cardNo,
      hisId:'2214',
      deptId:this.state.dept.deptId,
      diseasesId:this.state.diseases.diseasesId,
      monitorId:this.state.historyTypevalue,
      
      monitorCondition:this.state.historyIsSleepValue,
      statisticsType:'',
      startDate:todayHistoryDatStart,
      endDate:todayHistoryDatEnd,
    }).then((res)=>{
      let histData=[]
      let hisTimeData=[]
      if(res.code==0&&res.data&&res.data.length>0){
        console.log('data=',res.data)
        for(let i=0;i<res.data.length;i++){
          histData.push(res.data[i].monitorValue)
          let time=res.data[i].monitorTime.split(' ')
          let t=time.length>0?time[0]:''
          hisTimeData.push(t)
        }
        console.log('histData=',histData)
        // this.setState({
        //   historyChartData:histData,
        //   historyChartTimeData:hisTimeData
        // })
          
          this.setHistoryMap(histData,hisTimeData,normalHigh,normalLow)
      }else{
        this.setState({
          isShowHistoryTu:false
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
        tiaojianListChecked,
        cardNo
      } = this.state
      if(tiaojianListChecked.length<=0){
         this.setState({
          showIOS2:false,
          qiehuan:true,
          showIOS1:true,
          msg:'请选择一个标签'
        })
        return
      }
      if (cheliangzhi==''){
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
        // monitorCondition:this.state.tianjiaContentData,
        monitorCondition:tiaojianListChecked[0].label,
        patientId:this.state.patientId,
        followedId:this.state.followedId,
      }).then((res)=>{
        console.log(res)
        if(res.code==0){
          Toast.info('提交成功',2)
          this.setState({
            cheliangzhi:''
          })
          this.getTodayDat()
        }else{
          this.setState({
            showIOS1:true,
            msg:'添加失败',
          })
        }
      },(e) => {
        this.setState({
            showIOS1:true,
            msg:'未添加成功',
        })
      })
      
    }
    // 添加数据-下拉选 
    danxiangOnChange(ite){
      
      var mId=ite[ite.selectedIndex].value
      var mName=ite[ite.selectedIndex].label
      var mUnit=ite[ite.selectedIndex].unit
      console.log('ite=',ite)
      const {
        daxiangItemDuiList
      }=this.state
      console.log('daxiangItemDuiList===',daxiangItemDuiList)
      for(let i=0;i<daxiangItemDuiList.length;i++){
        if(mId==daxiangItemDuiList[i].value){
          if(daxiangItemDuiList[i].contArr){
            this.setState({
              tiaojianList:daxiangItemDuiList[i].contArr,
              tiaojianContent:daxiangItemDuiList[i].contArr[0].label,
              tianjiaContentData:daxiangItemDuiList[i].contentArr
            })
          }else{
            this.setState({
              tiaojianList:[],
              tiaojianContent:'',
              tianjiaContentData:''
            })
          }
        }
      }
      this.setState({
        monitorId:mId,
        monitorName:mName,
        unit:mUnit
      })
      this.getHistoryDat()
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

  // 获取今日数据
  async getTodayDat(){
    console.log(55555)
    console.log('555state=',this.state)
    // 获取今日时间
    let datTime=new Date()
    let tondayMonth=parseInt(datTime.getMonth())+1>=10?parseInt(datTime.getMonth())+1+'':'0'+(parseInt(datTime.getMonth())+1)
    let todayDay=datTime.getDate()>=10?datTime.getDate()+'':'0'+datTime.getDate()
    let todayDat=datTime.getFullYear().toString().concat(".",tondayMonth,'.',todayDay)
    let todayHistoryDat=datTime.getFullYear().toString().concat("-",tondayMonth,'-',todayDay)
    this.setState({
      monitorName:'',
      monitorId:'',
      jianceListToday:'',
      todayTime:todayDat,
      todayHistoryDat,
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
      console.log('rest=',res.data[0].conditions)
      // if(res.code==0&&res.data&&res.data.length>0){
        console.log('858588') 
        let danxiangList=[]
        let daxiangItemDuiList=[]
        
        for(let it=0;it<res.data.length;it++){
          let daxiangItemDui={value:res.data[it].id} 
          let daxiangItem={value:res.data[it].id,label:res.data[it].name,unit:res.data[it].unit}
          danxiangList.push(daxiangItem)
          // 存储标签
          let tiaojianList=[]  
          let tiaojianDat=res.data[it].conditionArray
          if(tiaojianDat){
            for(let itd=0;itd<tiaojianDat.length;itd++){
              let tiaojianItem={value:itd,label:tiaojianDat[itd],isCheck:false}
              if(itd==0){
                  tiaojianItem.isCheck=true
              }
              tiaojianList.push(tiaojianItem)
            }
            daxiangItemDui.contArr=tiaojianList
            daxiangItemDui.contentArr=res.data[it].conditions
          }
            daxiangItemDuiList.push(daxiangItemDui)
        }
        
        // 第一次标签赋值
        this.setState({
          monitorName:danxiangList[0].label,
          monitorId:danxiangList[0].value,
          jianceListToday:danxiangList,
          unit:danxiangList[0].unit,
          valueList:res.data,
          daxiangItemDuiList,
          
          tianjiaContentData:res.data.length>0?res.data[0].conditions:''
        })
        if(daxiangItemDuiList.length>0&&daxiangItemDuiList[0].contArr){
          console.log('daxiangItemDuiList=',daxiangItemDuiList[0])
          let firstBiaoQianList=[]
          firstBiaoQianList.push(daxiangItemDuiList[0].contArr[0])
          this.setState({
            tiaojianListChecked:firstBiaoQianList,
            tiaojianList:daxiangItemDuiList[0].contArr,
            tiaojianContent:daxiangItemDuiList[0].contArr[0].label
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
  // 添加数据 标签点击选中
  biaoqianClick=(e)=>{
    const { tiaojianList } = this.state
    console.log('e=',e)
    let tiaojianListChecked=[]
    let newList=tiaojianList.map((item,index)=>{
      if(item.value==e.value){
        item.isCheck=true
        tiaojianListChecked.push(item)
      }else{
        item.isCheck=false
      }
      return item
    })
    this.setState({
      tiaojianList:newList,
      tiaojianListChecked
    })
  }
  //  提醒
  tixing=(e)=>{
    console.log('eeeee=',e.target.checked)
    let msg=''
    if(!this.state.isShowXuanZhong){
      msg='开启后，系统会根据护士建议的测量频次进行提醒'
    }else{
      msg='取消后，系统将不进行提醒'
    }
    this.setState({
      msg,
      showIOS3:true
    })
    
  }
  // 提醒取消
  tixingquxiao=()=>{
    this.setState({
      showIOS3:false,
    })
  }
  // 确定提醒
  tixingbaocun=()=>{
    Api
    .getnotifyFlag({
      patCardNo:this.state.cardNo,
      hisId:'2214',
      deptId:this.state.dept.deptId,
      diseasesId:this.state.diseases.diseasesId,
      monitorNotifyFlag:!this.state.isShowXuanZhong?1:0
    }).then((res)=>{
      Toast.info('提交成功',2)
      this.setState({
        showIOS3:false,
        isShowXuanZhong:!this.state.isShowXuanZhong
      })
    })
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

              // this.setState({
              //     deptList:list1,
              //     diseases:list2[0],
              //     diseasesList:list2,
              //     cardNo:id,
              //     followedId:item.followedId,
              //     patientId:item.patientId,
              // })
             
          }else{
              list[i].active=false;
          }

      }
      // this.setState({
      //     cardNo:id,
      //     followedId:item.followedId,
      //     patientId:item.patientId,
      // })

      // Object.keys(dt).forEach((key)=>{
      //     console.log('dt[key]=',dt[key])
      //     deptListd.push(dt[key].deptId)
      //   })
      // if(deptListd.length>0&&deptListd.indexOf(this.state.dept.deptId)<0){
      //   console.log(888888)
      //   this.setState({
      //     dept:item.deptList[0],
      //     deptList:item.deptList,
      //     diseases:list2[0],
      //     diseasesList:list2,
      //     cardNo:id,
      //     followedId:item.followedId,
      //     patientId:item.patientId,
      //   })
      //   this.getTodayDat()
      //   return
      // }

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
      // hours=date.getHours()>=10?date.getHours()+'':'0'.concat(date.getHours())
      // minutes=date.getMinutes()>=10?date.getMinutes()+'':'0'.concat(date.getMinutes())
      let date = time.replace(/-/g,":").replace(' ',':').split(":");
      hours=date[3]
      minutes=date[4]
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
      normalHigh:item.normalHigh,
      normalLow:item.normalLow,
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
    console.log('sleepitem=',item.value)
    this.setState({
      historyIsSleepValue:item.value
    },()=>{
      // 获取历史数据
      this.getHistoryDat()
    })
  }
  // 历史记录查询选中-时间
  dateOnChangeStart=(item)=>{
    console.log('datachange=',item)
    this.setState({
      todayHistoryDatStart:item
    },()=>{
      // 获取历史数据
      this.getHistoryDat()
    })
  }
  // 历史记录查询选中结束时间
  dateOnChangeEnd=(item)=>{
    console.log('item=',item)
    this.setState({
      todayHistoryDatEnd:item
    },()=>{
      // 获取历史数据
      this.getHistoryDat()
    })
  }

  render() {
    const {
      isShowXuanZhong,
      kemudata,
      valueList,
      isShow,
      jianceList,
      jianceListToday,
      historyTypevalue,
      tiaojianList,
      todayTime,
      todayHistoryDat,
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
       isShowHistoryTu,
       todayHistoryDatEnd,
       todayHistoryDatStart,
       unit
    } = this.state
    console.log('msg====',this.state)
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
        <Dialog type="ios" buttons={this.state.style3.buttons} show={this.state.showIOS3}>
            {msg}
        </Dialog>
        <Dialog type="ios" buttons={this.state.style2.buttons} show={this.state.showIOS2} className='jianche-dialog'>
            <Flex className='dialog'>
              <Flex.Item>
                  <Rlabel>数据类型</Rlabel>
              </Flex.Item>
              <Flex.Item className='add-form-flex'>
                  {/*ist>
                  <Select className='add-form-select' data={jianceListToday} onChange={e=>{this.danxiangOnChange(e.target)}}/>
                </List>*/}
                <select className='add-form-select historyDingwei' onChange={e=>{this.danxiangOnChange(e.target)}}>
                  {
                    jianceListToday&&jianceListToday.length>0?
                    jianceListToday.map((item,index)=>{
                      return(
                        <option key={index} value={item.value}>{item.label}</option>
                      )
                    }):null
                  }
                </select>
                <span className='add-form-select-jiantou'></span>
              </Flex.Item>
            </Flex>
            {
              tiaojianList&&tiaojianList.length>0?
              <Flex className='dialog'>
                <Flex.Item>
                    <Rlabel>标签</Rlabel>
                </Flex.Item>
                  <Flex className='add-form-flex-biaoqian'>
                    {
                        tiaojianList.map((tiaojItem,tiaojIndex)=>{
                          if(tiaojIndex<5)
                           return(
                              <div key={tiaojIndex} className={`add-form-flex-div ${tiaojItem.isCheck?'checkColor':'unCheckColor'}`} onClick={e=>this.biaoqianClick(tiaojItem)}>
                                {tiaojItem.label}
                              </div>
                            )
                        })
                    }
                  </Flex>
              </Flex>:null
            }
            <Flex className='add-data'>
              <Flex.Item>
                  <Rlabel>测量值</Rlabel>
              </Flex.Item>
              <Flex.Item className='add-form-flex'>
                  <Input type="number" pattern="[0-9]*" name='cheliangzhi' value={cheliangzhi} placeholder={unit} onChange={ e=> {this.setState({cheliangzhi:e.target.value})}}/>
              </Flex.Item>
            </Flex>
            <Flex className='add-form-oneflex'>
              <Flex.Item>
                  <Rlabel>测量时间</Rlabel>
              </Flex.Item>
              <Flex.Item className='add-form-flex'>
                  <Input type="datetime-local" defaultValue='' onChange={ e => {console.log(e.target.value);this.setState({celiangtime:e.target.value})}}/>
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
                                            <div>{ item.monitorValue }{itemt.unit}</div>
                                        <Flex.Item>
                                          <div>
                                            <div className='jianche-flex-list-biaoqian'>{
                                              item.monitorCondition&&item.monitorCondition.split('；').map((itemt,index)=>{
                                                return(
                                                  <span className='jianche-flex-list-span'>{itemt}</span>
                                                )
                                              })
                                            }</div>
                                          </div>
                                        </Flex.Item >
                                        <div className='jianche-flex-list-item'>
                                          { this.changeTime(item.monitorTime) }
                                        </div >  
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
                            <ButtonN type='primary' onClick = { ()=>{this.setState({showIOS2:true})} }>添加数据</ButtonN>
                          </div>
                          <div className='tixing'>
                            <AgreeItem data-seed="logId" checked={isShowXuanZhong} defaultChecked={true} onChange={this.tixing} >
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
                                <div className={`history-data-flex ${historyTypevalue==typeItem.value?'addcolor':''}`} key={typeItem.value} onClick={()=>this.typeOnChange(typeItem)}>
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
                        <Flex className='history-data'>
                          <span>开始时间：</span>
                          <Flex.Item className='history-data-flex historyDingwei historyStart'>
                            <Input type="date" defaultValue={todayHistoryDatStart} onChange={ e => { this.dateOnChangeStart(e.target.value)}}/>
                            <span className='add-form-select-input-jiantou'></span>
                          </Flex.Item>
                          <span>结束时间：</span>
                          <Flex.Item className='history-data-flex historyDingwei historyStart'>
                            <Input type="date" defaultValue={todayHistoryDatEnd} onChange={ e => { this.dateOnChangeEnd(e.target.value)}}/>
                            <span className='add-form-select-input-jiantou'></span>
                          </Flex.Item>
                          
                        </Flex>:
                        <div className='jianche-type-neirong'>
                          <span>暂未添加数据</span>
                        </div>
                    }
                    {
                      jianceList?
                      <Flex className='history-data historyDingwei'>
                        <Flex.Item>
                          {/*<List>
                            <Select className='history-form-select' data={historyIsSleep} onChange={e=>{this.sleepOnChange(e.target)}}/>
                          </List>*/}
                          <select className='history-form-select' onChange={e=>{this.sleepOnChange(e.target)}}>
                            {
                              historyIsSleep&&historyIsSleep.length>0?
                              historyIsSleep.map((item,index)=>{
                                return(
                                  <option key={index} value={item.label}>{item.label}</option>
                                )
                              }):null
                            }
                          </select>
                          <span className='add-form-select-jiantou'></span>
                        </Flex.Item>
                      </Flex>:null
                    }
                  </div>
                  {
                    !isShowHistoryTu?
                    <div className='jianche-type-neirong'>
                      <span>暂未添加数据</span>
                    </div>:
                    <ReactEcharts option={this.state.option} height={300}/>
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