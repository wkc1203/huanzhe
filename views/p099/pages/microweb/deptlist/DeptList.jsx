import React, { Component } from 'react';
import { Button, Toptips } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';

import * as Api from './deptListApi';
import './style/index.scss';
class Widget extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      scrollerId: '',
      // 科室列表
      deptList:[],
    };
  }
  componentDidMount() {
    this.deptListFull();
  }
  componentWillUnmount() {
    // 离开页面时结束所有可能异步逻辑

  }
   deptListFull() {
    Api
        .deptListFull()
        .then((res) => {
          if(res.code == 0){
            this.setState({ deptList:res.data});
          }
          console.log("gg", this.state.deptList);
        }, e=> {
          console.log(e);
        });
  }
  getList(list) {
    console.log("list",list);
    for(let o in list){
      console.log(list[o]);
    return (
        <div>
          <div className="letters-item" >list[o]</div>
        </div>
    );
    }
  }
  render() {
     const {deptList}=this.state;
      console.log("g",deptList)
    return (
        <div className="d-page">

          {this.getList(deptList)/* for(let o in deptList){
              return(
            <div className="letters-item" >deptList[o]</div>
            )
          }*/
          }

          {/*<scroll-div scroll-with-animation scroll-into-div="{{scrollerId}}" scroll-y className="dept-list" style="height: 100%;">
           <block wx:for="{{deptList}}" wx:for-index="idx" wx:for-item="itemlist" wx:key="{{idx}}">
           <div className="letters-item" id="{{idx}}">{{idx}}</div>
           <div className="item-box">
           <block wx:for="{{itemlist}}" wx:for-index="index" wx:for-item="item" wx:key="{{index}}">
           <navigator url="/pages/microweb/deptinfo/index?no={{item.no}}" className="list-item">{{item.name}}</navigator>
           </block>
           </div>
           </block>
           </scroll-div>*/}

          <div className="right-list">




            {/*<block wx:for="{{deptList}}" wx:for-index="index1" wx:for-item="item1" wx:key="{{index1}}">
             <div @tap="charScroller({{index1}})" className="char-item {{scrollerId == index1 ? 'active' : ''}}">{{index1}}</div>
             </block>
             */}
          </div>
          {!deptList&&<div className='no-data'  >
            <img src='../../../resources/images/no-result.png' />
            <div>暂未查询到相关信息</div>
          </div>}
        </div>

    );
  }
}
export default Connect()(Widget);