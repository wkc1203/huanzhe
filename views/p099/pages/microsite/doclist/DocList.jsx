import React, { Component } from 'react';
import Link from 'react-router/lib/Link';

import Connect from '../../../components/connect/Connect';
import NoResult from '../../../components/noresult/NoResult';

import * as Api from './docListApi';
import './style/index.scss';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: {
        doctorlist: [],
      },
      noResult: {
        msg: '暂未获取到医生列表',
        show: false,
      },
    };
  }

  componentDidMount() {
    this.getDocList();
  }

  getDocList() {
    const param = this.props.location.query;
    const { noResult } = this.state;
    this.showLoading();
    Api
      .getDocList(param)
      .then((res) => {
        this.hideLoading();
        if (res.data.doctorlist && res.data.doctorlist.length > 0) {
          this.setState({ listData: res.data });
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
    const { listData, noResult } = this.state;
    return (
      <div className="wgt-page page-site-doclist">
        <div className="m-title">
          <div className="f-bg-primary f-pd-10 f-tac f-fs-16 f-color-white">{listData.deptName}共
            <span className="f-fs-20 f-lh-1">
              {listData.doctorlist && listData.doctorlist.length}
            </span>名医生
          </div>
        </div>
        <div className="weui-cells f-bg-white f-mt-0">
          {
            listData.doctorlist.length > 0 && listData.doctorlist.map((item, key) => {
              return (
                <Link
                  key={key} className="weui-cell"
                  to={{
                    pathname: '/microsite/docintro',
                    query: { doctorId: item.doctorId, deptId: item.deptId }
                  }}
                >
                  <div className="weui-cell__hd">
                    {
                      item.doctorImg ?
                        <img src={item.doctorImg} className="wgt-header-img"/>
                        :
                        <img src="/media/images/header/neutral.png" className="wgt-header-img"/>
                    }
                  </div>
                  <div className="weui-cell__bd f-pl-15">
                    <div className="f-fs-16 f-color-title">{item.doctorName}|{item.doctorTitle}</div>
                    <div className="f-fs-14 f-mt-5 f-color-text">{item.deptName}</div>
                  </div>
                </Link>
              );
            })
          }

        </div>

        <NoResult {...noResult} />
      </div>
    );
  }
}

export default Connect()(Widget);

