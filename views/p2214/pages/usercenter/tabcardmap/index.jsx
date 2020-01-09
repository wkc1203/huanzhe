import React, { Component } from 'react';
import hashHistory from 'react-router/lib/hashHistory';
import { Button, CellsTitle, Cells, Cell, CellBody, CellFooter } from 'react-weui';
import Connect from '../../../components/connect/Connect';

// 组件
import UserCardList from '../tabcardlist/index'

import * as Utils from '../../../utils/utils';
import * as Api from '../../../components/Api/Api';
import './style/index.scss';

class UserCardInfo extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  personinfo = () => {
    console.log('gerenxinxi')
    this.context.router.push({
        pathname:'usercenter/usercardlist'
    })
  }
  jiankangxuanjiao = () => {
    console.log('jiankangxuanjiao')
    this.context.router.push({
        pathname:'usercenter/usercardxuanjiaolist'
    })
  }
  jiankangjianche = () => {
    console.log('jiankangjianche')
    this.context.router.push({
        pathname:'usercenter/usercardjianchelist'
    })
  }
  render() {
    return (
      <div>
        <div className = 'user-card-list' onClick = { this.personinfo } >
          <div className = 'user-card-list-img'>
            <img src="./././resources/images/grxx@2x.png" />
          </div>
          <div className = 'user-card-list-info'>
            <h4>个人信息</h4>
            <span>查看并编辑个人信息</span>
          </div>
        </div>
        <div className = 'user-card-list' onClick = { this.jiankangxuanjiao }>
          <div className = 'user-card-list-img'>
            <img src="./././resources/images/jkjc@2x.png"/>
          </div>
          <div className = 'user-card-list-info'>
            <h4>健康宣教</h4>
            <span>儿童护理知识早知道</span>
          </div>
        </div>
        <div className = 'user-card-list' onClick = { this.jiankangjianche }>
          <div className = 'user-card-list-img'>
            <img src="./././resources/images/jkxj@2x.png"/>
          </div>
          <div className = 'user-card-list-info'>
            <h4>健康监测</h4>
            <span>儿童护理知识早知道</span>
          </div>
        </div>
        <div className="tarbar">
          <div  onClick={()=> {hashHistory.replace({pathname:'/ask/index'})}}>
          <img  src="../../../resources/images/suifang.jpg"/>
          <div>随访管理</div>
          </div>
          <div className='inquiry'>
          <img  src="../../../resources/images/hightMy.jpg"/>
          <div>我的</div>
          </div>
          <div style={{display:'none'}}></div>
        </div>
      </div>
      
    )
  }
}
export default Connect()(UserCardInfo);