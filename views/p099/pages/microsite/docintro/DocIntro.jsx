import React, { Component } from 'react';

import Connect from '../../../components/connect/Connect';
import NoResult from '../../../components/noresult/NoResult';

import * as Api from './docIntroApi';
import './style/index.scss';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docIntro: {},
      noResult: {
        msg: '暂未获取到医生信息',
        show: false,
      },
    };
  }

  componentDidMount() {
    this.getDoctorInfo();
  }

  getDoctorInfo() {
    const param = this.props.location.query;
    const { noResult } = this.state;
    this.showLoading();
    Api
      .getDoctorInfo(param)
      .then((res) => {
        this.hideLoading();
        const listData = res.data;
        if (listData) {
          this.setState({
            docIntro: listData,
          });
        } else {
          noResult.show = true;
          this.setState({ noResult });
        }
      }, (e) => {
        this.hideLoading();
        noResult.show = true;
        this.setState({ noResult });
        this.showPopup({ content: e.msg });
      });
  }

  render() {
    const { docIntro, noResult } = this.state;

    return (
      <div className="wgt-page page-site-docintro">
        <div className="g-info">
          <div className="m-info weui-flex ui-border-bottom">
            <div className="info-item weui-flex weui-flex__item">
              <div>
                {
                  docIntro.doctorImg ?
                    <img src={docIntro.doctorImg} className="wgt-header-img"/>
                    :
                    <img src="/media/images/header/neutral.png" className="wgt-header-img"/>
                }
              </div>
              <div className="f-ml-15">
                <div className="f-fs-16 f-color-title">{docIntro.doctorName}</div>
                <div className="f-fs-14 f-color-text">{docIntro.doctorTitle}</div>
                <div className="f-fs-12 f-color-text">{docIntro.deptName}</div>
              </div>
            </div>
          </div>

          {
            (docIntro.desc || docIntro.summary) &&
            <div className="m-detail ui-border-top f-bg-white f-pd-15">
              <div className="f-fs-16 f-color-title f-mb-5">擅长</div>
              <div className="f-fs-14 f-color-text">{docIntro.desc}</div>
              <div className="f-fs-16 f-color-title f-mb-5 f-mt-15">介绍</div>
              <div
                className="wgt-common-article f-fs-14 f-color-text f-wrap"
                dangerouslySetInnerHTML={{ __html: docIntro.summary }}
              />
            </div>
          }

          <NoResult {...noResult} />
        </div>
      </div>
    );
  }
}

export default Connect()(Widget);
