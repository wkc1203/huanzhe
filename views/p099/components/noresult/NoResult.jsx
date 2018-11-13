import React, { Component } from 'react';

export default class Widget extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { show, msg } = this.props;
    return (
        <div className={`wgt-noresult ${show ? '' : 'f-none'}`}>
          <div className="wgt-noresult-img"><img src="/media/images/common/no_record.png" width="100" alt="" /></div>
          <div className="wgt-noresult-txt">{msg}</div>
        </div>
    );
  }
}