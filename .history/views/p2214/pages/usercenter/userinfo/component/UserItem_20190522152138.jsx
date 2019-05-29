/**
 * 科室列表
 */
import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../../components/connect/Connect';
import * as Api from '../homeApi';

class Widget extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      phoneShow:false
     
    };
  }

  componentDidMount() {
   
  }
  //跳转到报告列表（登录是否过期）
  
  

  render() {
    const { txt,name} = this.props;
    return (
      
      <div className="userinfo-item" >
                            <div className="item-tit">{txt}</div>
                            <div className="item-txt">{name=== 'M' ? '男' : '女'}</div>
      </div>
    );
  }
}

export default Connect()(Widget);

