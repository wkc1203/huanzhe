import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';

import * as Api from './developingApi';
import 'style/index.scss';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hospInfo: {},
    };
  }

  componentDidMount() {

  }

  getHospIntro() {
    this.showLoading();
    Api
      .getHisInfo()
      .then((res) => {
        this.hideLoading();
        this.setState({ hospInfo: res.data });
      }, (e) => {
        this.hideLoading();
        this.showPopup({ content: e.msg });
      });
  }

  render() {

    return (
        <div className="develop-page">
            <div className="m-develop">
                <div className="develop-img">
                    {/*<img  src="REPLACE_IMG_DOMAIN/his-miniapp/icon/common/developing.png"/>*/}
                </div>
                <div className="develop-txt">功能正在建设中，即将开放，敬请期待</div>
            </div>
        </div>

    );
  }
}

export default Connect()(Widget);
