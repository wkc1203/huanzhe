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
    const { img,txt,txt1} = this.props;
    
    
     return(
      <div className='doc-intro'>
      <div>
          <img src={img} />

              {txt}
      </div>
      <div className="ski-des">
          {txt1}
      </div>

  </div>
    );
  }
}

export default Connect()(Widget);

