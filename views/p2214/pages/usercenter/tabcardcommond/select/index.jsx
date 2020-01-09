import React, { Component } from 'react';
import { Button, Tab, NavBar, NavBarItem, TabBody, Article, TabBarItem } from 'react-weui';
import Connect from '../../../../components/connect/Connect';
import { Tabs, TabBar } from 'antd-mobile'
import * as Utils from '../../../../utils/utils';
import * as Api from '../../../../components/Api/Api';
import 'index.scss';


class TabCardSelect extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = {
      tab:0
    }
  }
  // 切换tab
  qiehuan = (tab, index) => {
    console.log(index,66666)
    this.setState({tab:index})
  }

  render() {
    const {
      children
    } = this.props
    return(
      <div className='name-action'>
        <div className='name-select'>
          <select name='keshi' className='name-select-option'>
            <option name='keshi' value='1'>内科</option>
            <option name='keshi' value='2'>分泌科</option>
          </select>
          <select name='binglei' className='name-select-option'>
            <option name='binglei' value='1'>糖尿病</option>
            <option name='binglei' value='2'>高血压</option>
          </select>
        </div>
        <div className='name-tabone'>
          {
            children
          }
        </div>
      </div>
    )
  }
}
export default Connect()(TabCardSelect);