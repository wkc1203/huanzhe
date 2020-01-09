import React, { Component } from 'react';
import { Button, Tab, NavBar, NavBarItem, TabBody, Article, TabBarItem } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { Tabs, TabBar } from 'antd-mobile';
// 组件
import UserCardMap from '../tabcardmap/index'
import UserCardWenJuan from '../tabcardwenjuan/index'
import TabCardComponent from '../tabcardcommond/tab/index'
import TabCardSelect from '../tabcardcommond/select/index'
import * as Utils from '../../../utils/utils';
import * as Api from '../../../components/Api/Api';
import './style/index.scss';

const tabc=[
  {
    title:<div>王小二</div>
  },
  {
    title:<div>王小二2</div>
  }
]
const daitianxielist = [
  {
    title:'内分泌科糖尿病第四次随访',
    time:'2019.2.18'
  },
  {
    title:'内分泌科糖尿病第五次随访',
    time:'2019.2.18'
  },
  {
    title:'内分泌科糖尿病第六次随访',
    time:'2019.2.18'
  }
]
const finishtianxielist = [
  {
    title:'内分泌科糖尿病第四次随访',
    time:'2019.2.18'
  },
  {
    title:'内分泌科糖尿病第五次随访',
    time:'2019.2.18'
  },
  {
    title:'内分泌科糖尿病第六次随访',
    time:'2019.2.18'
  }
]
const tabst=[
  {
    title:<div>待填写问卷</div>
  },
  {
    title:<div>历史问卷</div>
  }
]
const tabs2 = [
  { title: 'First Tab', sub: '1' },
  { title: 'Second Tab', sub: '2' },
  { title: 'Third Tab', sub: '3' },
];
class TabCard extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = {
      tab:0,
      patList:[],
      cardNo:'',
      dept:[],
      diseases:[]
    }
  }
  componentDidMount (){
    console.log(888888)
    // Utils.getJsByHide();
    // if(!!window.localStorage.openId){
    //     this.getDept();
    //  }else{
    //     var code='';
    //     if(window.location.origin=='https://tih.cqkqinfo.com'){
    //         code='ff8080816b4bfb65016bb08126130000'
    //     }else{
    //       code='ff8080816b4bfb65016bb08186d70001';
    //     }
    //     var storage=window.localStorage;
    //     //加入缓存
    //     storage.isOpenId=1;
    //     window.location.href = "https://wx.cqkqinfo.com/wx/wechat/authorize/"+code+"?scope=snsapi_base";
    //     // return false;
    //     var storage=window.localStorage;
    //     //加入缓存
    //     storage.url=window.location.href;
    //  }
  }

    // getDept(){
    //   Api
    //   .getDeseaseType({
    //       hisId:'2214',
    //       openid:window.localStorage.openId
    //   })
    //   .then((res) => {
    //     console.log(res)
    //     if(res.code==0&&res.data&&res.data.patientList.length>0){
    //       const list=res.data.patientList;
    //       this.setState({
    //         patList:list,
    //         cardNo:list[0].patientCardNo,
    //         dept:list[0].deptList[0],
    //         diseases:list[0].deptList[0].diseasesList[0],
    //       })
    //     }
    //   })
    // }


  // 切换tab
  qiehuan = (tab, index) => {
    console.log(index,66666)
    this.setState({tab:index})
  }

  render() {
    return(
      <Tab type="tabbar">
        <TabBarItem icon={<img src="./././resources/images/report.png"/>} label="随访管理">
          <Article style = { { backgroundColor:'#ccc'} }>
            <TabCardComponent
              tabs={tabst}
            >
              <TabCardSelect>
                <UserCardWenJuan
                  daiwen={daitianxielist}
                  historywen={finishtianxielist}
                  tabs={tabst}
                />
              </TabCardSelect>
              <TabCardSelect>
                <UserCardWenJuan
                  daiwen={daitianxielist}
                  historywen={finishtianxielist}
                  tabs={tabst}
                />
              </TabCardSelect>
            </TabCardComponent>
          </Article>
        </TabBarItem>
        <TabBarItem icon={<img src="./././resources/images/report.png"/>} label="我的">
          <Article style = { { backgroundColor:'#ccc'} }>
            <UserCardMap/>
          </Article>
        </TabBarItem>
      </Tab>

    )
  }
}
export default Connect()(TabCard);