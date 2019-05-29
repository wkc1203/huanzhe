
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
    const { hospitalTradeno,doctorImg,doctorName,doctorLever,deptName,hisName,orderDate,times,hospitalDistrict,isVisit,isPay,orederStatus} = this.props;
    return (
      <Link
          to={{
          pathname:'add/addManage',
          query:{id:hospitalTradeno,source:2}
          }}>
          <div className="img"><img src={doctorImg}></img></div>
          <div className="basic">
          <div><span>{doctorName}</span> {doctorLever} | {deptName}</div>
          <div>{hisName} </div>
              <div className="registerTime">预约时间：{orderDate.substring(0,10)} {times=='上午'?'11:00-11:30':hospitalDistrict=='礼嘉分院'?'15:30-16:00':'17:00-17:30'}</div>
          </div>
          {orederStatus=='1'&&isPay=='1'&&isVisit=='0'&&<div  className="status"> <p>待就诊</p></div>}
          {orederStatus=='1'&&isPay=='0'&&isVisit=='0'&&<div   className="status"><p>待付款</p></div>}
          {orederStatus=='1'&&isPay=='1'&&isVisit=='2'&&<div  className="status"> <p  className="disNo"  >已过期</p></div>}
          {orederStatus=='1'&&isPay=='1'&&isVisit=='3'&&<div  className="status"><p className="disNo"  >已退号</p></div>}
          {orederStatus=='1'&&isPay=='1'&&isVisit=='1'&&<div className="status"> <p className="disNo">已就诊</p></div>}
          {orederStatus=='3'&&isPay=='2'&&isVisit=='0'&&<div className="status"> <p className="disNo">加号失败</p></div>}
          {orederStatus=='2'&&isPay=='0'&&isVisit=='0'&&<div className="status"> <p className="disNo">已超时</p></div>}
          {orederStatus=='4'&&isPay=='1'&&isVisit=='0'&&<div className="status"> <p className="disNo">申请中</p></div>}
      </Link> 
    );
  }
}

export default Connect()(Widget);

