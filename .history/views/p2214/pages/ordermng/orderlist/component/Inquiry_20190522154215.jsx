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
    const { inquiryUr,orderId,userId,docImg,doctorName,deptName,level,hisName,createTime,totalFee,} = this.props;
    return (
      
      <div className='doc-item' key={index}>
                       <Link to={{
                       pathname:'/ordermng/orderdetail',
                       query:{orderId:item.id,userId:this.props.location.query.userId}
                       }}>
                           <div className="doc-info">
                               <img className="doc-img" src={item.doctorImgUrl || '../../../resources/images/doc.png'} alt="医生头像" />
                               <div className="text-box11">
                                   <div className='doc-name'>{item.doctorName}</div>
                                   <div className='doc-des'>{item.deptName} {item.level ? '|' : ''}  {item.level}</div>
                                   <div className='doc-des'>{item.hisName}</div>
                               </div>
                           </div>
                           <div className='msg-box'>
                               <div>
                                   <div>咨询时间：{item.createTime}</div>
                                   <div>完成时间：{item.finishTime || '暂无完成时间' }  </div>
                               </div>
                               <div className='price-box'>
                                   ￥{(item.totalFee/100).toFixed(2)}
                               </div>
                           </div>
                       </Link>
                       
                   </div>
    );
  }
}

export default Connect()(Widget);

