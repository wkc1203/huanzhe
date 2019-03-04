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

        </div>
      </div>

    );
  }
}

export default Connect()(Widget);
