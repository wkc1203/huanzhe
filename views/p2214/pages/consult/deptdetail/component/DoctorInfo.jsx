
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
      phoneShow:false,
      isShowTip:false,
     
    };
  }
  componentDidMount() {
  }
  //跳转到报告列表（登录是否过期）
  /*是否关闭须知*/
  switchTip(flag) {
    this.setState({
        isShowTip: flag == '1'
    })
}
  render() {
    const { serviceTimes,img,txt} = this.props;
    const {isShowTip}=this.state;    
     return(
       <div>
       {isShowTip && <div className='modal-tip1' onClick={(e)=>{
        this.setState({
            isShowTip:false
        })
        }}>
        <div className='modal-body-tip'  onClick={(e)=>{
            e.stopPropagation()
            }}>
            <div className='modal-content-tip'>
                    <div className="content-item">该医生暂未开通此服务...</div>
                 <div className="img">
                   <img  src="./././resources/images/no-open.png" alt=""></img>
                 </div>
                  <div className="btn-close">
                     <p onClick={(e)=>{
                        this.setState({
                            isShowTip:false
                        })
                        }}>确定</p>
                  </div>
            </div>            
        </div>
    </div>}
    <div className="inquity-item"
    onClick={
      ()=>{
      this.switchTip(1)
      }
      }>
      <div className='icon'>
          <img src={img} />
      </div>
      <div className='text grey'>
          <div className='grey'>{txt}</div>
      </div>
      <div className='des-fee grey'>￥0.01<span>/次</span></div>
    </div>
       </div>     
    );
  }
}
export default Connect()(Widget);

