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
  
  

  render() {
    const { txt,url,img,txt1,href} = this.props;
    return (
      <div>
        {url!=''&&<Link  
        to={{ pathname: url }}>
          <div className='icon'>
            <img src={img} alt=""  />
          </div>
          <div className='text'>
              <div>{txt}</div>
              <div>{txt1}</div>
          </div>
                
      </Link>}
        {url==''&&<Link  onClick={()=>{
          window.location.href=href;
        }}>
          <div className='icon'>
            <img src={img} alt=""  />
          </div>
          <div className='text'>
              <div>{txt}</div>
              <div>{txt1}</div>
          </div>
                
      </Link>}
      </div>
      
    );
  }
}

export default Connect()(Widget);

