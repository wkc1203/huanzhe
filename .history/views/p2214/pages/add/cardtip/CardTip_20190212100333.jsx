import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';

import * as Api from './cardTipApi';
import 'style/index.scss';

class Widget extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      hospInfo: {},
    };
  }

  componentDidMount() {

  }

   goPrev1() {
       this.context.router.goBack()
  }

  render() {

    return (
      <div className='add-tip'>
        <div className="home bid" >
        <span className="jian"
            onClick={()=>{
                if(this.props.location.query.source==1){
                    this.context.router.push({
                        pathname:'inquiry/chat',
                        query:{inquiryId:this.state.inquiryId}
                    });
                }else{
                    this.context.router.push({
                        pathname:'ordermng/orderlist',
                        query:{userId:info.userId,busType:'add'}
                    });
                }
                                    
            }}
        ></span>温馨提示
       </div>

       <div className="main">

        <div>
          <span>预约时间：</span>  2018-08-27 11：30
        </div>
        <div className='tip-content'>
            <p>1：本系统目前仅支持自费卡用户；</p>
            <p>2：请在预约加号后当日23：00内完成支付，超出时间后系统将做超时处理，加号失败；</p>
            <p>3：若无法按时就诊，请于就诊时间前一天取消预约，就诊当日不能取消预约和退费；</p>
            <p>4：目前暂不支持线下窗口退费；</p>
            <p>5：加号成功后，于就诊当日到医生所在门诊等待叫号即可，请携带就诊卡或电子就诊卡</p>

        </div>
       </div>
       <div>
           <span>取消预约</span>
           <span>立即预约</span>
       </div>


      </div>
    );
  }
}

export default Connect()(Widget);
