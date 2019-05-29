/**
 * 科室列表
 */
import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../../components/connect/Connect';
import * as Api from '../homeApi';

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
  checkTime(){
    Api
       .checkTime()
       .then((res) => {
           this.hideLoading();
           if (res.code == 0) {
                //成功 跳转
               this.context.router.push({
                   pathname:'/report/reportList'
               })
           }else{
               this.hideLoading();
               this.setState({
                   phoneShow:true
                })
           }
       }, (e) => {
                this.hideLoading();
                this.setState({
                   phoneShow:true
                })

       });
}
  

  render() {
    const { url,img,userId,name} = this.props;
    return (
      <div>
      <div className="m-function">
        {url!=''&&<Link className="function-list"  to={{
          pathname:url,
          query:{userId:userId}
          }} >
            <div className="list-item">
                <div className="item">
                    <div className="item-icon">
                      <img style={{width:'18px',height:'18px;'}}
                      src={img}></img>
                    </div>
                    <div className="item-main">
                      <div className="main-title">{name}</div>
                    </div>
                </div>
            </div>
        </Link>}
        {url==''&&<Link className="function-list"  onClick={()=>{
          this.checkTime()
        }}>
            <div className="list-item">
                <div className="item">
                    <div className="item-icon">
                      <img style={{width:'18px',height:'18px;'}}
                      src={img}></img>
                    </div>
                    <div className="item-main">
                      <div className="main-title">{name}</div>
                    </div>
                </div>
            </div>
        </Link>}
    </div>
    {phoneShow && <div className='modal' onClick={()=>{
      this.setState({
          phoneShow:false
      })
      }} >
          <div className='modal-body'
              onClick={(e)=>{
              e.stopPropagation()
              }}>
              <div className='modal-content'>
                <div className='modal-title'>
                   <p className='title'>短信验证</p>
                   <p className='subTitle'>为了你的隐私，请先短信验证</p>
                </div>
                <div className='inputItem'>
                   <input type="text" maxLength={11}  readOnly value={mobile}/>
                   <p></p>
                   <input type="text" maxLength={6} placeholder='请输入验证码'
                   onBlur={(e)=>{
                      window.scrollTo(0,0);         
                  }}
                      onChange={(e)=>{
                          this.setState({
                              validatePass:e.target.value
                          })
                          }}      
                              
                    value={validatePass}/> <p></p>
                   {!isSendValidate &&<span
                      onClick={(e)=>{
                          this.getValidate(e)
                          }}
                      >获取验证码</span>}
                      {isSendValidate && <span >
                      {leftTime} s 后重试
                  </span>}  
                 </div>
                <div className='submitBtn '>
                   <p onClick={(e)=>{
                       this.checkPassword(e)
                   }} className={`${validatePass.length!==6?'grey':''}`}>确定</p>
                </div>

              </div>
            
          </div>
          
      </div>}
      </div>
    );
  }
}

export default Connect()(Widget);

