/**
 * 科室列表
 */
import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../../components/connect/Connect';
import * as Api from '../userInfoApi';

class Widget extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  };
  constructor(props) {
    super(props);
  }
  componentDidMount() {
  }
  render() {
    const { txt,name} = this.props;
    return (
      <div className="userinfo-item" >
              <div className="item-tit">{txt}</div>
              <div className="item-txt">{name}</div>
      </div>
    );
  }
}

export default Connect()(Widget);

