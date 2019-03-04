import React, { Component } from 'react';

export default class Widget extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { show, msg } = this.props;
    return (
      <div className={`wgt-noresult ${show ? '' : 'f-none'}`}>
        <div className="wgt-noresult-img" ><img src="/media/images/common/no_record.png" width="100" alt="" /></div>
        <div className="wgt-noresult-txt">
        <p>
          该科室暂未开放
        </p>
          <p>
            VIP会员中心请电话预约:
          </p>
          <p>023-88602316（冉家坝）</p>
          <p>023-89031056（上清寺）</p>
          <p>全口义齿诊疗室请电话预约：</p>
          <p>023-88602475（冉家坝）</p>
        </div>

      </div>
    );
  }
}