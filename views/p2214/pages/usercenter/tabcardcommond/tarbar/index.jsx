import React, { Component } from 'react';
import Connect from '../../../../components/connect/Connect';
import * as Utils from '../../../../utils/utils';
import * as Api from '../../../../components/Api/Api';
import './index.scss';

class TarbarNav extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  componentDidMount(){

  }

  render(){
    const {
      children,
      first,
      second
    } = this.props
    return(
      <div className="suifang-tarbar" style={{background: '#f2f2f2;'}}>
            <div  onClick={first}>
              <img  src="./././resources/images/complain.png"/>
              <div>随访</div>
            </div>
            <div onClick={second}>  
              <img  src="./././resources/images/report.png"/>
              <div style={{color:'#4FABCA'}}>我的</div>
            </div>
            <div className='suifang-tarbar-second'>
            </div>
      </div>
    )
  }
}
export default Connect()(TarbarNav);