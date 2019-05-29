/**
 * 科室列表
 */
import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../../components/connect/Connect';

class Widget extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  };
  constructor(props) {
    super(props);
    this.state = {
      phoneShow:false
     
    };
  }
  componentDidMount() {
  }
  render() {
    const { img,txt,name} = this.props;
     return(
      <div className="list-item">
          <div className="item-label">
            <img src={img}/>{txt}
          </div>
          <div className="item-value">{name}</div>
      </div>
    );
  }
}
export default Connect()(Widget);

