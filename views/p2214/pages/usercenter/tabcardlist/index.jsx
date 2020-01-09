import React, { Component } from 'react';
import hashHistory from 'react-router/lib/hashHistory';
import { Tab, TabBarItem, Article, CellsTitle, Cells, Cell, CellBody, CellFooter, Input } from 'react-weui';
import { Button } from 'antd-mobile';
import Connect from '../../../components/connect/Connect';
// 组件
import TabCardComponent from '../tabcardcommond/tab/index';
import TabCardPerson from '../tabcardcommond/person/index'
import UserCardMap from '../tabcardmap/index';
import * as Utils from '../../../utils/utils';
import * as Api from '../../../components/Api/Api';
import './style/index.scss';


const tabs=[
  {
    title:<div>王小二</div>
  },
  {
    title:<div>王小二2</div>
  }
]
// 个人信息
class UserCardList extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = {
      showLoading: false,
      patList:[],
      // 姓名，性别，年龄
      personGuDing:[],
      height:'',
      weight:'',
      isAlone: '',
      // 修改状态
      xiugaistatus:false,
      // 需要修改的字段
      daixiugaiList:[],
      // 不需要修改
      otherContent:'',
      // 模板ID
      patientTemplateId:0,
      msg:'',
      patList:[],
      status:'0',
      cardNo:'',
      show1:false,
      show2:false,
      diseases:{},
      dept:{},
      recordList:[],
      deptList:[],
      diseasesList:[],
    }
  }

  componentDidMount (){
    console.log('state=',this.state)
    let getValue=Utils.getRequestParamt()
    console.log(66666666666)
    console.log('getValue=',getValue)
    let getPatientId=''
    if(getValue&&getValue.patientCardNo){
        getPatientId=getValue.patientCardNo
    }
    this.getDept(getPatientId);
  }
  // 获取人物nav
  getDept(getPatientId){
    Api
    .getDeseaseType({
        hisId:'2214',
        openid:window.localStorage.openId
    })
    .then((res) => {
      console.log(res)
      if(res.code==0&&res.data&&res.data.patientList.length>0){
        var list=res.data.patientList;
        for(var i=0;i<list.length;i++){
          if(getPatientId!=''){
            if(list[i].patientCardNo==getPatientId){
              list[i].active=true;
            }else{
                list[i].active=false;
            }
          }else{
            if(i==0){
              list[i].active=true;
            }else{
                list[i].active=false;
            }
          }
          
        }
        if(getPatientId!=''){
          this.setState({
            patList:list,
            cardNo:getPatientId,
          })
        }else{
          this.setState({
            patList:list,
            cardNo:list[0].patientCardNo,
          })
        }
        this.getPersonInfo()
      }
    })
  }
  // 获取个人信息
  getPersonInfo(){
    this.showLoading()
    console.log(999)
    Api
    .getPersonInfo({
      hisId:'2214',
      patientCardNo:this.state.cardNo
    })
    .then((res)=>{
      this.hideLoading();
      console.log('res=',res)
      if(res.code==0&&res.data){
        const {
          patientName,
          patientSex,
          patientAge,
          patientCardNo,
          patientTemplateId
          // options,
          // otherContent
        } = res.data
        const personObj=[
          {name:'姓名',value:patientName},
          {name:'性别',value:patientSex},
          {name:'年龄',value:patientAge}
          ]
        var daixiuList=[]
        var otherContentList=[]
        if(res.data.otherContent&&res.data.options){
          console.log('res.data.otherContent=',res.data.otherContent)
          const otherContentObj=JSON.parse(res.data.otherContent)
          console.log('res.data.otherContent=',otherContentObj)

          Object.keys(otherContentObj).forEach((key)=>{
            let objItem={name:key,value:otherContentObj[key]}
            otherContentList.push(objItem)
          })

          if(res.data.options&&res.data.options.length>0){
            for(let it=0;it<res.data.options.length;it++){
              res.data.options[it].value=otherContentObj[res.data.options[it].title]
              if(res.data.options[it].title=='是否独生子女'){
                res.data.options[it].value=otherContentObj['是否独生子女']
              }

              daixiuList.push(res.data.options[it])
            }
          }

        }else if(res.data.options&&!res.data.otherContent){
          if(res.data.options&&res.data.options.length>0){
            for(let it=0;it<res.data.options.length;it++){
              res.data.options[it].value=''
              daixiuList.push(res.data.options[it])
            }
          }
        }
        this.setState({
          daixiugaiList:daixiuList,
          otherContent:otherContentList,
          personGuDing:personObj,
          cardNo:patientCardNo,
          patientTemplateId,
          status:'1'
        })

      }
    },e=>{
      console.log('e=',e)
      this.hideLoading();
    })
    console.log(25555)
  }

  xiugai = () => {
    this.setState({
      xiugaistatus:true
    })
  }
  // 保存
  baocun = () => {
    console.log('baocun')
    this.setState({
      xiugaistatus:false
    })
    this.getPersonInfo()

    // window.location.reload()
  }
  // 选项点击
  selectPat(id,item) {
    console.log(item)
    console.log('setstatepat=',this.state)
    this.setState({
      patientCardNo:item.patientCardNo
    })
    const list=this.state.patList;
    var data=[];
    var dt=item.deptList
    var flg=false
    var deptListd=[]
    for(var i=0;i<list.length;i++){
      if(list[i].patientCardNo==id){
        list[i].active=true;
      }else{
        list[i].active=false;
      }
    }
    this.setState({
        xiugaistatus:false,
        cardNo:id,
        daixiugaiList:[],
        otherContent:[]
    },()=>{
      // 获取个人信息
      this.getPersonInfo()

    })
    console.log(666898)
  }
  // 返回
  setXiuGaiFlg = (flg) => {
    this.setState({
      xiugaistatus:flg
    })
  }
  showLoading() {
    this.setState({showLoading: true});

    this.state.loadingTimer = setTimeout(()=> {
        this.setState({showLoading: false});
    }, 2000);
  }
  render () {
    const {
      patList,
      personGuDing,
      daixiugaiList,
      otherContent,
      status,
      cardNo,
      xiugaistatus,
      patientTemplateId
    } = this.state
    return (
      <div>
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
        {
          status=='1'?
            <TabCardPerson
              key={cardNo}
              patientTemplateId={patientTemplateId}
              xiugaistatus={xiugaistatus}
              personGuDing={personGuDing}
              daixiugaiList={daixiugaiList}
              otherContent={otherContent}
              patientCardNo={cardNo}
              baocun={this.baocun}
              setXiuGaiFlg ={this.setXiuGaiFlg}
            />:<div className='queshengye'>未获取到用户信息</div>
        }
      </div>
    )
  }
}
export default Connect()(UserCardList);