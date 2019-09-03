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
  switchTip(flag) {
    this.setState({
        isShowTip: flag == '1'
    })
}
  render() {
    const { img,txt,txt1,txt2,txt3} = this.props;
     return(
      <div className='doc-intro'>
        <div>
            <img src={img} />

                {txt}
        </div>
        <div className="ski-des">
           {<p>{txt1}</p> }
           {txt2?<p>{txt2}</p>:''}
           {txt3?<span className = {txt3=='已认证'?'':'Certified'}>{txt3}</span>:'' }
        </div>
     </div>
    );
  }
}
export default Connect()(Widget);

