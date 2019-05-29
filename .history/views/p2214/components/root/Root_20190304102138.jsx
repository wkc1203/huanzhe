/**
 * 根节点
 */
import React, { Component } from 'react';
import { Link } from 'react-router';

import * as Constant from '../../config/constant/constant';


export default class Root extends Component {
  constructor(props) {
    super(props);
  }

  noFooter() {
    const { pathname } = this.props.location;
    return Constant.NOFOOTER.indexOf(pathname) >= 0;
  }

  render() {
    const { children } = this.props;
    const noFooter = this.noFooter();

    return (
      <div className="wgt-app">
        <div className="wgt-container" style={{height:'100%'}}>
          {children}

        </div>
      </div>
    );
  }
}