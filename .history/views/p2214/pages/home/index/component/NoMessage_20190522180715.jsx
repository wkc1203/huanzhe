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
    const { txt,url,img,txt1,href} = this.props;
    
     return(
   <div className='modal-tip1' onClick={(e)=>{
        this.setState({
            isOpen:false
        })
        }}>
        <div className='modal-body-tip'  onClick={(e)=>{
            e.stopPropagation()
            }}>
            <div className='modal-content-tip'>
                
                    <div className="content-item">正在努力建设中...</div>
                
                 <div className="img">
                   <img  src="./././resources/images/no-open.png" alt=""></img>

                 </div>
                 <div className="btn-close">
                             <p onClick={(e)=>{
                                this.setState({
                                    isOpen:false
                                })
                                }}>确定</p>
                          </div>
            </div>
            
        </div>
    </div>
      
        
    
      
    );
  }
}

export default Connect()(Widget);

