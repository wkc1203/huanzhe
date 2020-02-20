
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
    const { userId,id,doctorImgUrl,doctorName,deptName,level,hisName,createTime,finishTime,totalFee,} = this.props;
    return (
       <Link to={{
                       pathname:'/ordermng/orderdetail',
                       query:{orderId:id,userId:userId}
                       }}>
                           <div className="doc-info">
                               <img className="doc-img" src={doctorImgUrl || '../../../resources/images/doc.png'} alt="医生头像" />
                               <div className="text-box11">
                                   <div className='doc-name'>{doctorName}</div>
                                   <div className='doc-des'>{deptName} {level ? '|' : ''}  {level}</div>
                                   <div className='doc-des'>{hisName}</div>
                               </div>
                           </div>
                           <div className='msg-box'>
                               <div>
                                   <div>问诊时间：{createTime}</div>
                                   <div>完成时间：{finishTime || '暂无完成时间' }  </div>
                               </div>
                               <div className='price-box'>
                                   ￥{(totalFee/100).toFixed(2)}
                               </div>
                           </div>
                       </Link>
    );
  }
}
export default Connect()(Widget);

