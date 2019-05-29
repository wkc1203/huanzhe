/**
 * 科室列表
 */
import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../../components/connect/Connect';
import NoResult from '../../../../components/noresult/NoResult';
import Loading from '../../../../components/loading/Loading';

import * as Api from '../deptListApi';

class Widget extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      listData: {},
      activeDept: this.props.query.activeDept || '0',
      deptListInit: false,
    };
  }

  componentDidMount() {
    this.getDeptList();
  }

  getDeptList() {
    const param = {};
    Api.getDeptList(param)
      .then(res => {
        this.setState({
          deptListInit: true,
          listData: res.data || {},
          expandIds: {}
        });
      }, (e) => {
        this.setState({
          deptListInit: true,
          listData: {},
        });
        this.showPopup({ content: e.msg });
      });
  }

  // 切换一级科室tab
  changeDept(index) {
    if (this.state.activeDept == index) {
      return;
    }
    this.context.router.replace({
      pathname: this.props.path,
      query: {
        ...this.props.query,
        activeDept: index
      }
    });
    this.setState({
      activeDept: index
    });
  }

  // 展开三级科室
  expandList(deptId) {
    const { expandIds } = this.state;
    expandIds[deptId] = !expandIds[deptId];
    this.setState({
      expandIds: expandIds
    });
  }

  render() {
    const { props, state } = this;
    return (
      <div className={`g-dept-list ${!props.show ? '' : 'f-none'}`}>

        <Loading show={!state.deptListInit} />
        <NoResult msg="暂未获取到科室信息"
                  show={state.deptListInit && !(state.listData.deptList && state.listData.deptList.length > 0)} />
        {
          !!(state.listData.deptList && state.listData.deptList.length > 0) &&
          state.listData.levelDept <= 1 &&
          <div className={`m-list ${!state.deptListInit ? 'f-none' : ''}`}>
            <div className="list-rt">
              <div className="list-rt-wrap">
                <ul className="sec-list">
                  {
                    state.listData.deptList && state.listData.deptList.map((item, index)=> {
                      return (
                        <li className="sec-list-li" key={index}>
                          <div className="sec-li-name">
                            <Link to={{
                              pathname: '/register/doclist',
                              query: { deptId: item.deptId, deptName: item.deptName || '' }
                            }}>
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
          !!(state.listData.deptList && state.listData.deptList.length > 0) &&
          state.listData.levelDept > 1 &&
          <div className={`m-list ${!state.deptListInit ? 'f-none' : ''}`}>
            <div className="list-lt">
              <div className="list-lt-wrap">
                {
                  state.listData.deptList && state.listData.deptList.map((item, index)=> {
                    if(item.deptList && item.deptList.length > 0){
                      return (
                        <div
                          onClick={
                            ()=> {
                              this.changeDept(index);
                            }
                          }
                          key={index}
                          className={`list-lt-li ${state.activeDept == index ? 'active' : ''}`}
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
                                pathname: '/register/doclist',
                                query: { deptId: item.deptId, deptName: item.deptName || '' }
                              });
                            }
                          }
                          key={index}
                          className={`list-lt-li ${state.activeDept == index ? 'active' : ''}`}
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
                    state.listData.deptList && state.listData.deptList[state.activeDept].deptList &&
                    state.listData.deptList[state.activeDept].deptList.map((item, index)=> {
                      if (item.deptList && item.deptList.length > 0) {
                        return (
                          <li className={`sec-list-li ${this.state.expandIds[item.deptId] ? 'active' : ''}`}
                              key={index}>
                            <div className="sec-li-name">
                              <a href="javascript:;" onClick={
                                ()=> {
                                  this.expandList(item.deptId)
                                }
                              }>
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
                                item.deptList.map((itm, idx)=> {
                                  return (
                                    <li className="trd-list-li" key={idx}>
                                      <Link to={{
                                        pathname: '/register/doclist',
                                        query: { deptId: itm.deptId, deptName: itm.deptName || '' }
                                      }}>
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
                              <Link to={{
                                pathname: '/register/doclist',
                                query: { deptId: item.deptId, deptName: item.deptName || '' }
                              }}>
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
      </div>
    );
  }
}

export default Connect()(Widget);

