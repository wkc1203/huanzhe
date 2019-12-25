import React, { Component } from 'react';
// import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../components/connect/Connect';
import './index.scss';
// import hashHistory from 'react-router/lib/hashHistory';

class QueSheng extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
  };
  constructor(props) {
    super(props);
  }
  render(){
    return(
      <div className='queshen'>
        <img className='queshen-img' src='../../resources/images/quesheng.jpg' />
        <div>
          请在手机微信客户端打开链接
        </div>
      </div>
    )
  }
}
export default Connect()(QueSheng);