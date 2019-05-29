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
    const { orderId,id,docImg,doctorName,deptName,level,hisName,createTime,totalFee,} = this.props;
    return (
      
      <div className='doc-item' key={index}>
                       <Link to={{
                       pathname:'/ordermng/orderdetail',
                       query:{orderId:id,userId:userId}
                       }}>
                           <div className="doc-info">
                               <img className="doc-img" src={doctorImg || '../../../resources/images/doc.png'} alt="医生头像" />
                               <div className="text-box11">
                                   <div className='doc-name'>{doctorName}</div>
                                   <div className='doc-des'>{deptName} {level ? '|' : ''}  {level}</div>
                                   <div className='doc-des'>{hisName}</div>
                               </div>
                           </div>
                           <div className='msg-box'>
                               <div>
                                   <div>咨询时间：{createTime}</div>
                                   <div>完成时间：{finishTime || '暂无完成时间' }  </div>
                               </div>
                               <div className='price-box'>
                                   ￥{(totalFee/100).toFixed(2)}
                               </div>
                           </div>
                       </Link>
                       
                   </div>
    );
  }
}

export default Connect()(Widget);

