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
     
    };
  }

  componentDidMount() {
   
  }
  

  render() {
    const { url,img,userId,name} = this.props;
    return (
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
    );
  }
}

export default Connect()(Widget);

