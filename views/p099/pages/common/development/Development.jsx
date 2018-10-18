import React, { Component } from 'react';

import Connect from '../../../components/connect/Connect';
import './style/index.scss';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="wgt-page page-devl-box">
        <div className="con-block">
            <img src="../../../resources/images/development.png" className="f-mb-25" width="100%"/>
            <div className="f-mb-15 f-tac">
                <p className="f-fs-18 f-mt-15 f-mb-15 f-color-primary">系统正在维护中</p>
                <p className="f-fs-18 f-mb-15 f-color-primary">请耐心等待~</p>
                <p className="f-fs-18 f-mb-15 f-color-primary"></p>
            </div>
        </div>
      </div>

    );
  }
}

export default Connect()(Widget);
