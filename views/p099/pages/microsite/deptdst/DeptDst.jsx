import React, { Component } from 'react';

import Connect from '../../../components/connect/Connect';
import NoResult from '../../../components/noresult/NoResult';

import * as Api from './deptDstApi';
import './style/index.scss';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buildList: [],
      floorList: [],
      isSlide: false,
      activeFloor: '0',
      isLoading: false,
      noResult: {
        msg: '暂未获取到楼层信息',
        show: false,
      },
    };
  }

  componentDidMount() {
    this.getDeptBuildList();
  }

  componentWillUnmount() {
    this.state.Timer && clearTimeout(this.state.Timer);
  }

  getDeptBuildList() {
    const { noResult } = this.state;
    this.showLoading();
    Api
      .getDeptBuildList()
      .then((res) => {
        this.hideLoading();
        if (!!res.data.buildList && res.data.buildList.length > 0) {
          const buildListData = res.data.buildList;
          this.setState({ buildList: buildListData });
          this.getDeptBuildDetail({ buildId: buildListData[0].buildId });
        } else {
          noResult.show = true;
          this.setState({ noResult });
        }
        if (this.refs.buildList.clientWidth < this.refs.buildList.scrollWidth) {
          this.setState({ isSlide: true });
          this.state.Timer = setTimeout(() => {
            this.setState({ isSlide: false });
          }, 2000);
        }
      }, (e) => {
        this.hideLoading();
        noResult.show = true;
        this.setState({ noResult });
        this.showPopup({ content: e.msg });
      });
  }

  getDeptBuildDetail(param) {
    const { noResult } = this.state;
    this.showLoading();
    Api
      .getDeptBuildDetail(param)
      .then((res) => {
        this.hideLoading();
        if (!!res.data.floorList && res.data.floorList.length > 0) {
          noResult.show = false;
          this.setState({ floorList: res.data.floorList });
        } else {
          noResult.show = true;
          this.setState({ floorList: [] });
        }
        this.setState({ noResult });
      }, (e) => {
        this.hideLoading();
        this.showPopup({ content: e.msg });
        noResult.show = true;
        this.setState({
          noResult,
          floorList: [],
        });
      });
  }

  changeFloor(key, chooseBuildId) {
    if (this.state.activeFloor == key) {
      return;
    }
    this.getDeptBuildDetail({ buildId: chooseBuildId });
    this.setState({
      activeFloor: key,
    });
  }

  render() {
    const {
      buildList,
      floorList,
      activeFloor,
      isSlide,
      noResult,
    } = this.state;
    return (
      <div className="wgt-page page-site-deptdst">
        <div className={`m-slide ${isSlide ? 'm-slide-animal' : 'f-none'}`} ref="slide">
          <img alt="" src="/media/images/common/slide.png" />
        </div>
        <div className="m-list-box">
          <ul className="m-list" ref="buildList">
            {
              buildList.length > 0 && buildList.map((item, key) => {
                return (
                  <li
                    key={key} className={`list-item ${activeFloor == key ? 'active' : ''}`}
                    onClick={() => {
                      this.changeFloor(key, item.buildId);
                    }}
                  >
                    <div className="item">{item.buildName}</div>
                  </li>
                );
              })
            }
          </ul>
        </div>
        <div className="m-detail f-pb-15">
          {
            floorList.length > 0 &&
            <table className="detail-table ui-table ui-table-primary">
              <thead>
              <tr>
                <th width="20%">
                  <div className="f-tac f-fs-14">楼层</div>
                </th>
                <th>
                  <div className="f-tac f-fs-14">所在科室</div>
                </th>
              </tr>
              </thead>
              <tbody>
              {
                floorList.map((item, key) => {
                  return (
                    <tr key={key}>
                      <td>
                        <div className="f-tac"><span className="detail-icon">{item.floorName}</span></div>
                      </td>
                      <td>
                        <div className="f-tal">{item.floorDept}</div>
                      </td>
                    </tr>
                  );
                })
              }
              </tbody>
            </table>
          }
          <NoResult {...noResult} />
        </div>
      </div>
    );
  }
}

export default Connect()(Widget);
