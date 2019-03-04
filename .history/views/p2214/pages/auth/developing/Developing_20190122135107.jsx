import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';

import * as Api from './developingApi';
import 'style/index.scss';

class Widget extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
};
  constructor(props) {
    super(props);
    this.state = {
      hospInfo: {},
    };
  }

  componentDidMount() {

  }

  render() {

    return (
        <div className="develop-page">
            <div className="m-develop">
                <div className="develop-img">
                    <img  src="../../../resources/images/no-result.png"/>
                </div>
                <div className="develop-txt">{this.props.location.query.msg}</div>
            </div>
        </div>

    );
  }
}

export default Connect()(Widget);
