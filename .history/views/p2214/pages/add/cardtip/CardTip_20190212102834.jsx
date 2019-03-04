import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';

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
      isSure:false,
      showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            showAndroid2: false,
            style1: {
                buttons: [
                    {
                        label: '确定',
                        onClick: this.hideDialog.bind(this)
                    }
                ]
            },
            style2: {
                title: '提示',
                buttons: [
                    {
                        type: 'default',
                        label: '取消',
                        onClick: this.hideDialog.bind(this)
                    },
                    {
                        type: 'primary',
                        label: '确定',
                        onClick: this.hideDialog.bind(this)
                    }
                ]
            },
            msg: '',
    };
  }

  componentDidMount() {
            
  }
  sure(){
      this.setState({
        isSure:false
    })
    this.context.router.push({
        pathname:'consult/pay',
        query:{orderId:this.state.orderId,source:this.props.location.query.source,hospitalUserId:this.state.hospitalUserId,hospitalTradeno:this.state.hospitalTradeno}
    })
  }
  addInfo(){
    Api
        .addInfo({
            hospitalTradeno:this.state.id,
            type:1,
            inquiryId:this.state.inquiryId,
            userId:this.state.userId,
            orderId:this.state.orderId,

        })
        .then((res) => {
            if(res.code==0){
               
                this.sure();
            }
        }, (e) => {
            this.setState({
                msg:e.msg,
                showIOS1: true
            })
        });
}
showToast() {
  this.setState({showToast: true});

  this.state.toastTimer = setTimeout(()=> {
      this.setState({showToast: false});
  }, 2000);
}
showLoading() {
  this.setState({showLoading: true});

  this.state.loadingTimer = setTimeout(()=> {
      this.setState({showLoading: false});
  }, 2000);
}

hideDialog() {
  this.setState({
      showIOS1: false,
      showIOS2: false,
      showAndroid1: false,
      showAndroid2: false,
  });
}
   goPrev1() {
       this.context.router.goBack()
  }

  render() {
    const {isAdd,isSure,info,leftTime,time,canBack,msg}=this.state;
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
       <Toast icon="success-no-circle" show={this.state.showToast}>加号成功</Toast>
       <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons}
               show={this.state.showIOS1}>
           {msg}
       </Dialog>
       {isSure&&<div className='modal' >
                        <div className='modal-body'>
                            <div className='modal-title'>提示</div>
                            <div className='modal-content'>您已确认加号</div>
                            <div className='modal-footer'>
                                <span onClick={()=>{
                                this.sure1()

                                }}>确定</span>
                            </div>
                        </div>
                    </div>}
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
       <div className='tip-btn'>
           <span className='cancel' onClick={()=>{
             this.context.router.goBack();
           }}>取消预约</span>
           <span className='confirm'
               onClick={()=>{
                if(this.props.location.query.status==0){
                  this.addInfo();
                  }else{
                        this.sure();
                  }
               }}
           >立即预约</span>
       </div>


      </div>
    );
  }
}

export default Connect()(Widget);
