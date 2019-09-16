

import React, { Component } from 'react';
import { Link } from 'react-router';
import Connect from '../../../../components/connect/Connect';
class PureChildComponent extends React.PureComponent{
  render(){
      console.log("pure")
      return <div className='hh'>{this.props.nameTxt}</div>
  }
}
export default Connect()(PureChildComponent);

