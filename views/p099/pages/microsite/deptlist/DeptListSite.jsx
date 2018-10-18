import React, { Component } from 'react';
import Link from 'react-router/lib/Link';

import Connect from '../../../components/connect/Connect';
import NoResult from '../../../components/noresult/NoResult';

import './style/index.scss';
import * as Api from './deptListSiteApi';

class Widget extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      listData: {
        deptList: [],
      },
      activeDept: '0',
      noResult: {
        msg: '暂未获取到科室列表',
        show: false,
      },
    };
  }

  componentDidMount() {
    const { noResult } = this.state;
    this.showLoading();
    Api
      .getDeptList()
      .then((res) => {
        this.hideLoading();
        if (res.data.deptList && res.data.deptList.length > 0) {
          this.setState({
            listData: res.data,
            expandIds: {},
          });
        } else {
          noResult.show = true;
          this.setState({ noResult });
        }
      }, (e) => {
        this.hideLoading();
        this.showPopup({ content: e.msg });
        noResult.show = true;
        this.setState({ noResult });
      });
  }

  // 切换一级科室tab
  changeDept(index) {
    if (this.state.activeDept == index) {
      return;
    }
    this.setState({
      activeDept: index,
    });
  }

  // 展开三级科室
  expandList(deptId) {
    const { expandIds } = this.state;
    expandIds[deptId] = !expandIds[deptId];
    this.setState({
      expandIds: expandIds,
    });
  }

  render() {
    const { listData, activeDept, noResult } = this.state;
    return (
      <div className="wgt-page page-site-deptlist">
        <div className="g-layout-abs">
          <div className="g-layout">
            <div className="m-deptlist">
              <div className="g-dept-list">
                {
                  listData && listData.levelDept <= 1 &&
                  <div className="m-list">
                    <div className="list-rt">
                      <div className="list-rt-wrap">
                        <ul className="sec-list">
                          {
                            listData.deptList && listData.deptList.map((item, index) => {
                              return (
                                <li className="sec-list-li" key={index}>
                                  <div className="sec-li-name">
                                    <Link
                                      to={{
                                        pathname: '/microsite/deptintro',
                                        query: { deptId: item.deptId },
                                      }}
                                    >
                                      <div className="name">{item.deptName }</div>
                                      <i className="ui-arrow ui-arrow-right" />
                                    </Link>
                                  </div>
                                </li>
                              );
                            })
                          }
                        </ul>
                      </div>
                    </div>
                  </div>
                }
                {
                  listData && listData.levelDept > 1 &&
                  <div className="m-list">
                    <div className="list-lt">
                      <div className="list-lt-wrap">
                        {
                          listData.deptList && listData.deptList.map((item, index) => {
                            if(item.deptList && item.deptList.length > 0){
                              return (
                                <div
                                  onClick={() => {
                                    this.changeDept(index);
                                  }}
                                  key={index}
                                  className={`list-lt-li ${activeDept == index ? 'active' : ''}`}
                                >
                                  {item.deptName}
                                </div>
                              );
                            }else{
                              return (
                                <div
                                  onClick={
                                    ()=> {
                                      this.context.router.push({
                                        pathname: '/microsite/deptintro',
                                        query: { deptId: item.deptId, deptName: item.deptName || '' }
                                      });
                                    }
                                  }
                                  key={index}
                                  className={`list-lt-li ${activeDept == index ? 'active' : ''}`}
                                >
                                  {item.deptName}
                                </div>
                              );
                            }
                          })
                        }
                      </div>
                    </div>
                    <div className="list-rt">
                      <div className="list-rt-wrap">
                        <ul className="sec-list">
                          {
                            listData.deptList && listData.deptList[activeDept].deptList &&
                            listData.deptList[activeDept].deptList.map((item, index) => {
                              if (item.deptList && item.deptList.length > 0) {
                                return (
                                  <li
                                    className={`sec-list-li ${
                                      this.state.expandIds[item.deptId] ? 'active' : ''}`}
                                    key={index}
                                  >
                                    <div className="sec-li-name">
                                      <a
                                        href="javascript:;"
                                        onClick={() => {
                                          this.expandList(item.deptId);
                                        }}
                                      >
                                        <div className="name">{item.deptName}</div>
                                        <i
                                          className={`ui-arrow-circle ui-arrow-primary ${
                                            this.state.expandIds[item.deptId] ? 'ui-arrow-bottom' : 'ui-arrow-right'
                                            }`}
                                        />
                                      </a>
                                    </div>
                                    <ul className="trd-list">
                                      {
                                        item.deptList.map((itm, idx) => {
                                          return (
                                            <li className="trd-list-li" key={idx}>
                                              <Link
                                                to={{
                                                  pathname: '/microsite/deptintro',
                                                  query: { deptId: itm.deptId },
                                                }}
                                              >
                                                <div className="name">{itm.deptName}</div>
                                                <i className="arrow" />
                                              </Link>
                                            </li>
                                          );
                                        })
                                      }
                                    </ul>
                                  </li>
                                );
                              } else {
                                return (
                                  <li className="sec-list-li" key={index}>
                                    <div className="sec-li-name">
                                      <Link
                                        to={{
                                          pathname: '/microsite/deptintro',
                                          query: { deptId: item.deptId },
                                        }}
                                      >
                                        <div className="name">{item.deptName}</div>
                                        <i className="ui-arrow ui-arrow-right" />
                                      </Link>
                                    </div>
                                  </li>
                                );
                              }
                            })
                          }
                        </ul>
                      </div>
                    </div>
                  </div>
                }

                <NoResult {...noResult} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Connect()(Widget);


