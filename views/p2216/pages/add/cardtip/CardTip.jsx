import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';

import * as Api from './cardTipApi';
import 'style/index.scss';

class Widget extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      hospInfo: {},
    };
  }

  componentDidMount() {

  }

   goPrev1() {
       this.context.router.goBack()
  }

  render() {

    return (
    <div className="tip">
        <img  src="../../../resources/images/payTip.png" className='bindTip'/>
        <img onClick={()=>{
        this.goPrev1()
        }}  className="know" src="../../../resources/images/knowPay.png"/>

    </div>
    );
  }
}

export default Connect()(Widget);
