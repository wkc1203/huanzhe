import React, { Component } from 'react';

import Connect from '../../../components/connect/Connect';
import NoResult from '../../../components/noresult/NoResult';

import * as Api from './hospDynamicsDetailApi';
import './style/index.scss';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articleData: '',
      noResult: {
        msg: '暂未获取到内容',
        show: false,
      },
    };
  }

  componentDidMount() {
    this.getHospDynamicsDetail();
  }

  getHospDynamicsDetail() {
    const param = this.props.location.query;
    const { noResult } = this.state;
    this.showLoading();
    Api
      .getHospDynamicsDetail(param)
      .then((res) => {
        this.hideLoading();
        const listData = res.data;
        if (listData) {
          this.setState({
            articleData: listData,
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
    const { articleData, noResult } = this.state;

    return (
      <div className="wgt-page page-site-dynamics">
        <div className="g-info">
          {
            articleData && articleData.content &&
            <div className="m-detail ui-border-top f-bg-white f-pd-15">
              <h1 className="m-title">{ articleData.title }</h1>
              {/*<h4 className="m-time">{ articleData.createTime ? articleData.createTime : '暂无时间' }</h4>*/}
              <div className="content" dangerouslySetInnerHTML={{ __html: articleData.content }} />
            </div>
          }

          <NoResult {...noResult} />
        </div>
      </div>
    );
  }
}

export default Connect()(Widget);
