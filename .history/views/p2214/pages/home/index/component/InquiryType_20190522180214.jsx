/**
 * 科室列表
 */
import React, { Component } from 'react';
import { Link } from 'react-router';
import * as Utils from '../../../../utils/utils';
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
    const { txt,url,img,txt1,href} = this.props;
    
     return(
      <div className="d-tab"
        onClick={()=>{
          Utils.sum('index_inquiry_img',2);
            this.context.router.push({
                pathname: url
            })
        }}
          >
             <div className="icon">
               <img  src={img} alt=""  />
             </div>
             <div className='text1 text-acitve'>{txt} </div>
             <div className='text2'>{txt1}</div>
             
      </div>
        
    
      
    );
  }
}

export default Connect()(Widget);

