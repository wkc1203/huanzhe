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
    const { doctorId,deptId,image,name,deptName,level,inquirys,specialty,serviceTimes,replyTime,replyLabel} = this.props;
    
     return(
      <div 
      onClick={()=>{
        window.localStorage.deptShow='2'; 
          window.localStorage.scrollYY=window.scrollY;
            window.localStorage.scrollXX=window.scrollX;
          this.context.router.push({
              pathname:'/consult/deptdetail',
              query:{doctorId:doctorId,deptId:deptId,resource:2}

          })
      }}
            
            className='doc-item'>
          <div className="doc-info">
              <div className='docImg'>
                  <img className="doc-img" src={image!=null&&image.indexOf("ihoss")=='-1'?image:image+"?x-oss-process=image/resize,w_105"} alt="医生头像"/>
              </div>
              <div className="text-box">
                  <div className="doc-item1">
                      <div className='doc-name'>{name}
                      </div>
                      {replyLabel=='1'&&<div className='speed'>
                          回答快
                      </div>}
                      <div className='rate'>好评率：<span>{/* favoriteRate */ }98%</span></div>
                  </div>
                  <div className='doc-des2'>{deptName}  {level}</div>
                  <div
                      className='doc-des ellipsis'>{specialty ? specialty : '暂无描述'}</div>
                  <div className='pinfen'>
                      <span>咨询人数：{serviceTimes}</span>平均回复时长:  {replyTime}</div>
                  <div>
                  </div>
                  <div className='oper-box'>
                      {inquirys.map((item2, index2)=> {
                          return (
                              <div key={index2}
                                   className={`${item2.type!=='1'?'disNo':'flex22'} ${item2.isFull != '1' &&item2.type=='1'&&item2.isOnDuty == '1'?'status-item1':'grey-item1'}`}>
                                   {item2.isFull =='1' &&item2.type=='1'&& item2.isOnDuty=='1'&&
                                   <div>图文咨询(满)</div>}
                                   {item2.isFull != '1' &&item2.type=='1'&& item2.isOnDuty == '1' &&
                                   <div>图文咨询</div>}
                                   {item2.type=='1'&& item2.isOnDuty == '0' &&
                                   <div>图文咨询(离)</div>}
                              </div>
                          )
                      })
                      }
                      <div className='grey-item1'>电话咨询<p>(待上线)</p></div>
                      <div className='grey-item1' style={{marginRight:'0'}}>视频咨询<p>(待上线)</p></div>
                  </div>
              </div>

          </div>

      </div>
        
    
      
    );
  }
}

export default Connect()(Widget);

