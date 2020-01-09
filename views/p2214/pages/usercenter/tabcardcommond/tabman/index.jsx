import React, { Component } from 'react';
import { Button, Tab, NavBar, NavBarItem, TabBody, Article, TabBarItem } from 'react-weui';
import Connect from '../../../../components/connect/Connect';
import { Tabs } from 'antd-mobile'
import * as Utils from '../../../../utils/utils';
import * as Api from '../../../../components/Api/Api';
import './index.scss';

class TabManNav extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = {
      tab:0,
      patList:[],
      dept:{},
      deptList:[],
      cardNo:''
    }
  }
  componentDidMount(){
    Utils.getJsByHide();
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
  // 选项点击
  selectPat(id,item) {
    console.log(item)
    const list=this.state.patList;
    var data=[];
    var dt=item.deptList
    var flg=false
    var deptListd=[]
    for(var i=0;i<list.length;i++){
      if(list[i].patientCardNo==id){
        list[i].active=true;
        var list1=list[i].deptList;
        var list2=list[i].deptList[0].diseasesList;
        Object.keys(dt).forEach((key)=>{
          deptListd.push(dt[key].deptId)
        })
        if(deptListd.length>0&&deptListd.indexOf(this.state.dept.deptId)<0){
          this.setState({
            dept:item.deptList[0],
            deptList:item.deptList
          },()=>{this.getPersonInfo(this.state.status,id)})
          
          return
        }
        // console.log('depthou=',this.state.dept)
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

        this.setState({
            deptList:list1,
            // diseases:list2[0],
            // diseasesList:list2,
        })
      }else{
        list[i].active=false;
      }
      this.setState({
          cardNo:id,
      })
      // 获取个人信息
      this.getPersonInfo()
    }
  }
  // 个人信息
  getPersonInfo(){
    console.log('geren')
  }
  // 获取人物nav
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
                    dept:list[0].deptList[0],
                    diseases:list[0].deptList[0].diseasesList[0],
                })
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
                this.getXuanJiaoList()
        }
    })
  }
  render(){
    const {
      patList
    } = this.state
    const {
      children
    } = this.props
    return(
      <div className="patient">
       {!!patList&&patList.length>0&&patList.map((item,index)=>{
         return(
            <div className={`${item.active?'pat-item active':'pat-item'}`} key={index}
              onClick={()=>{
                  this.selectPat(item.patientCardNo,item)
              }}>
               {item.patientName}
              <span>{children}</span>
            </div>
           )
        })
      }
     </div>
    )
  }
}
export default Connect()(TabManNav);