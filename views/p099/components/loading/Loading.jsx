import React, { Component } from 'react';

export default class Widget extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { show } = this.props;
    return (
      <div className={`wgt-getdata ${show ? '' : 'f-none'}`}>
        <img src="/media/images/common/loading_pay.gif" width="80" alt="" />
      </div>
    );
  }
}
