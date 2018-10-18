import React, { Component } from 'react';

import Connect from '../../../components/connect/Connect';
import NoResult from '../../../components/noresult/NoResult';

import * as Api from './deptIntroApi';
import './style/index.scss';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deptIntro: {},
      noResult: {
        msg: '暂未获取到科室信息',
        show: false,
      },
    };
  }

  componentDidMount() {
    this.getDeptIntro();
  }

  getDeptIntro() {
    const param = this.props.location.query;
    const { noResult } = this.state;
    this.showLoading();
    Api
      .getDeptInfo(param)
      .then((res) => {
        this.hideLoading();
        if (res.data) {
          this.setState({ deptIntro: res.data });
          noResult.show = !res.data.summary;
        } else {
          noResult.show = true;
        }
        this.setState({ noResult });
      }, (e) => {
        this.hideLoading();
        noResult.show = true;
        this.setState({ noResult });
        this.showPopup({ content: e.msg });
      });
  }

  render() {
    const { state } = this;
    const { deptIntro, noResult } = this.state;
    return (
      <div className="wgt-page page-site-deptintro">
        <div className="g-info">
          <div className="m-info">
            <div className=" f-tac f-fs-16 f-color-white">{deptIntro.deptName}</div>
            <div className="info">
              <div className="info-item">
                <div className="item-label">科室位置</div>
                <div className="item-add">{deptIntro.address}</div>
              </div>
              <div className="info-item">
                <div className="item-label">咨询电话</div>
                <a href={`tel:${deptIntro.tel}`} className="item-phone">{deptIntro.tel}</a>
              </div>
            </div>
          </div>
          {
            deptIntro.summary &&
            <div
              className="wgt-common-article m-detail ui-border-top f-wrap"
              dangerouslySetInnerHTML={{ __html: deptIntro.summary }}
            />
          }
          {
            <div className={`f-plr-15 ${noResult.show ? '' : 'f-none'}`}>
              <NoResult {...noResult} />
            </div>
          }
        </div>
      </div>
    );
  }
}

export default Connect()(Widget);
