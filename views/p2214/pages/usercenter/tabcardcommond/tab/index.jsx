import React, { Component } from 'react';
import { Button, Tab, NavBar, NavBarItem, TabBody, Article, TabBarItem } from 'react-weui';
import Connect from '../../../../components/connect/Connect';
import { Tabs } from 'antd-mobile'
import * as Utils from '../../../../utils/utils';
import * as Api from '../../../../components/Api/Api';

const tabc=[
  {
    title:<div>王小二</div>
  },
  {
    title:<div>王小二2</div>
  }
]
class TabCardComponent extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = {
      tab:0
    }
  }
  componentDidMount (){
    console.log(676868)
    console.log(this.props)
  }
  // 切换tab
  qiehuan = (tab, index) => {
    console.log(index,66666)
    this.setState({tab:index})
  }

  render() {
    const {
      tabs,
      children
    } = this.props
    return(
      <Tabs
        tabs={tabs}
        page={this.state.tab}
        onChange={(tab, index) => {this.qiehuan(tab, index)}}
      >
       {
        children
       }
      </Tabs>
    )
  }
}
export default Connect()(TabCardComponent);