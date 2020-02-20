import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';

import * as Api from './indexApi';
import './style/index.scss';

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
        /*首页*/
      <div className="page-home ">
         <div className="header">
           <img
               src="../../../resources/images/head-img.png"
               alt=""
               />
         </div>
         <div className="content">
           <div className="head-des">
              <div className="f-pa">
                <Link className="d-tab"
                      to={{ pathname: '/usercenter/userinfo' }}
                    >
                  <div>
                     <div className="icon">
                       <img
                           src="../../../resources/images/inquiry-bg.png"
                           alt=""
                           />
                     </div>
                     <div className="text">
                       <div>图文问诊</div>
                       <div>医生将在24小时内回复</div>
                     </div>
                  </div>
                </Link>
                <div className="d-tab">
                  <div>
                    <div className="icon">
                      <img
                          src="../../../resources/images/video.png"
                          alt=""
                          />
                    </div>
                    <div className='text'>
                      <div>视频咨询</div>
                      <div>一对一视频咨询</div>
                    </div>
                  </div>
                </div>
                <div className="d-tab">
                  <div>
                    <div className="icon">
                      <img
                          src="../../../resources/images/phone.png"
                          alt=""
                          />
                    </div>
                    <div className='text'>
                      <div>电话咨询</div>
                      <div>一对一电话咨询</div>
                    </div>
                  </div>
                </div>
              </div>
           </div>
           <div className='title'>常用服务</div>
           <div className='b-tab'>
             <Link
                 to={{ pathname: '/usercenter/userinfo' }}
                 >
               <div className='text'>
                 <div>科室介绍</div>
                 <div>了解医院科室</div>
               </div>
               <div className='icon'>
                 <img
                     src="../../../resources/images/dept-info.png"
                     alt=""
                     />

               </div>
             </Link>
             <Link
                 to={{ pathname: '/usercenter/userinfo' }}
                 >
               <div className='text'>
                 <div>专家介绍</div>
                 <div>了解专家信息</div>
               </div>
               <div className='icon'>
                 <img
                     src="../../../resources/images/master.png"
                     alt=""
                     />
               </div>
             </Link>
             <Link
                 to={{ pathname: '/usercenter/userinfo' }}
                 >
               <div className='text'>
                 <div>健康宣教</div>
                 <div>儿童护理知识</div>
               </div>
               <div className='icon'>
                 <img
                     src="../../../resources/images/conduct.png"
                     alt=""
                     />
               </div>
             </Link>
             <Link
                 to={{ pathname: '/usercenter/userinfo' }}
                 >
               <div className='text'>
                 <div>咨询公告</div>
                 <div>查看最新公告</div>
               </div>
               <div className='icon'>
                 <img
                     src="../../../resources/images/news.png"
                     alt=""
                     />
               </div>
             </Link>
           </div>
         </div>
          <div className="tarbar">
              <div >
                  <img
                      src="../../../resources/images/index-active.png"
                      />
                  <div style={{color:'#4FABCA'}}>首页</div>
              </div>
              <div >
                  <img
                      src="../../../resources/images/inquiry.png"/>
                  <div>咨询会话</div>
              </div>
              <div>
                  <img
                      src="../../../resources/images/my.png"/>
                  <div>我的</div>
              </div>
          </div>
      </div>

    );
  }
}

export default Connect()(Widget);
