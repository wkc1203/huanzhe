import React, { Component, PropTypes } from 'react';

import { Toast } from 'react-weui';
import * as Api from './hospFloorImgApi';
import PopUp from '../../../components/popup/PopUp';
import NoResult from '../../../components/noresult/NoResult';
import Connect from '../../../components/connect/Connect';

class HospIntro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      floorimg: {},
      noresult: {
        msg: '暂未获取到楼群分布图',
        show: false,
      },
    };
  }
  componentDidMount() {
    this.getFloorImg();
  }

  getFloorImg() {
    const { noresult } = this.state;
    this.showLoading();
    Api.getFloorImg()
      .then((res) => {
        this.hideLoading();
        if (!!res.data.floorImgUrl) {
          this.setState({ floorimg: res.data });
        } else {
          noresult.show = true;
          this.setState({ noresult });
        }
      }, (e) => {
        this.hideLoading();
        noresult.show = true;
        this.setState({ noresult });
        this.showPopup({ content: e.msg });
      });
  }

  render() {
    const { floorimg, toastConfig, noresult, toastText, popupConfig, popupText } = this.state;
    return (
      <div className="wgt-page page-site-hospfloorimg">
        <div className="m-banner" style={{ overflow: 'auto' }}>
          <img src={floorimg.floorImgUrl && floorimg.floorImgUrl} style={{ minWidth: '100%' }} alt="" />
        </div>
        <NoResult {...noresult} />
      </div>
    );
  }
}

HospIntro.propTypes = {};

export default Connect()(HospIntro);