import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';

import * as Api from './manageListApi';
import 'style/index.scss';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hospInfo: {},
    };
  }

  componentDidMount() {

  }

  getHospIntro() {
    this.showLoading();
    Api
      .getHisInfo()
      .then((res) => {
        this.hideLoading();
        this.setState({ hospInfo: res.data });
      }, (e) => {
        this.hideLoading();
        this.showPopup({ content: e.msg });
      });
  }

  render() {

    return (
    <div className="page-add-confirm">
        <div className="container">
            <div className="personInfo">
                <div ><p className="">全部</p></div>

                <div ><p className="">patientName</p></div>

    </div>
    <div className="doctorInfo">
          <Link
              to={{pathname:'/usercenter/userinfo'}}
              >
              <div className="img"><img src="../../../resources/images/noData.png"/></div>
              <div className="basic">
                  <div><span>doctorName</span> 主任医师</div>
                  <div>item.hisName</div>
                  <div className="registerTime">预约时间：2018-09-10 11:00-11:30</div>
              </div>
              <div className="status"> <p>待就诊</p></div>

          </Link>
          </div>


          <div  style={{marginTop:'25%',display:'none'}}>
              <img src="../../../resources/images/noData.png" style={{marginTop:'25%',marginLeft:'35%',width:'162px',height:'162px',margin:'0 auto',display:'block'}}></img>
              <div style={{width:'auto',height:'120px',lineHeight:'30px',textAlign:'center',padding:'40px',color:'#b1b1b1'}}>
                  暂时还没有加号信息。向医生咨询时，可向医生提出加号请求，医生会根据咨询情况判断，向您开出加号。
              </div>
          </div>
          </div>
          </div>
    );
  }
}

export default Connect()(Widget);
