/**
 * 科室列表
 */
import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../../components/connect/Connect';
import * as Api from '../userInfoApi';

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
    const { typeName,patientName,status,statusName,refundStatus,id} = this.props;
    return (
      
      <div className="oper-box">
                           <div className="pat-item">{typeName} | 就诊人：{patientName}</div>
                           {status != '2'&&<div className="status-name">{statusName}</div>}
                           {status == '2'&&<div className="status-name">已完成</div>}
                           {status == '2'&&refundStatus!=1&&<div className="eva-item" >
                               <Link
                                   to={{
                                   pathname:'/ordermng/evaluate',
                                   query:{orderId:id}
                                   }}
                                   className='evaluate'
                                   >
                                   评价
                               </Link>
                           </div>}
    </div>
    );
  }
}

export default Connect()(Widget);

