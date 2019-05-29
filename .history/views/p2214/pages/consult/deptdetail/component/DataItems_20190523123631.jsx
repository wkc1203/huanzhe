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
    const { serviceTimes,txt} = this.props;    
     return(
      <div className='item'>
        <div>{serviceTimes}<a style={{fontSize:'12px'}}>人</a></div>
        <div>{txt}</div>
    </div>
    );
  }
}
export default Connect()(Widget);

