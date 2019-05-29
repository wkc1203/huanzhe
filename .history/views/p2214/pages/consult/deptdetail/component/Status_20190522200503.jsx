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
  //跳转到报告列表（登录是否过期）
  
  

  render() {
    const { type,isOnDuty,isFull,txt,img,txt1,remune} = this.props;
    
     return(
      <div
        key={index2}
        className={`${type=='1'&&isOnDuty=='0'&&isFull!=='1'?'inquity-item':'disNo'}`}>

        <div className='icon no-data1'>
        <span>{txt}</span>
            <img src={img} />
        </div>
        <div className='text'>
            <div>
                <text className="f-color-gray">{txt1}</text>
            </div>
        </div>
        <div className='des'>￥{(remune / 100).toFixed(2)}<span>/次</span></div>
    </div>
    );
  }
}

export default Connect()(Widget);

