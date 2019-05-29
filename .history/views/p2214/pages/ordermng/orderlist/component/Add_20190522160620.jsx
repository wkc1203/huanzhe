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
    const { index,timeText,patientName,visitDate,doctorName,id,status,} = this.props;
    return (
      <div className='check-item' key={index}> 
          <p className='register-time'><span>{timeText}</span></p>   
          <div className='main-content'>
            <div className='basic-info'>
                <div>
                    <p>就诊人:<span>{patientName}</span></p>
                </div>
                <div>
                    <p>就诊时间:<span>{visitDate}</span></p>
                </div>

                <div>
                    <p>医生:<span>{doctorName}</span></p>
                </div>
              </div>
              <div className='basic-status' onClick={()=>{
                this.context.router.push({
                  pathname:'/ordermng/checkdetail',
                  query:{id:id}
                })}}>
                <p 
                >查看详情 </p>
                {(status=='0'||status=='1')&&<p >待付款</p>}
                {status=='2'&&<p style={{color:"#4cabcf"}}>支付成功</p>}
                {status=='3'&&<p  style={{color:"#999"}}>已取消</p>}
                {status=='7'&&<p  style={{color:"#999"}}>已退款</p>}
                {status=='4'&&<p  style={{color:"#999"}}>已取消</p>}
                {status=='5'&&<p  style={{color:"#f57f17"}}>支付异常</p>}
                {status=='6'&&<p  style={{color:"red"}}>支付失败</p>}
              </div>
          </div>
    </div>
                 
    );
  }
}

export default Connect()(Widget);

