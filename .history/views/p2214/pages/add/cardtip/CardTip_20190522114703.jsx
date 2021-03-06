import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import * as Utils from '../../../utils/utils';
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
                        onClick: Utils.hideDialog.bind(this)
                    }
                ]
            },
            style2: {
                title: '提示',
                buttons: [
                    {
                        type: 'default',
                        label: '取消',
                        onClick: Utils.hideDialog.bind(this)
                    },
                    {
                        type: 'primary',
                        label: '确定',
                        onClick: Utils.hideDialog.bind(this)
                    }
                ]
            },
            msg: '',
    };
  }

  componentDidMount() {
    this.getJs();
  }
  sure(){
      this.setState({
        isSure:false
    })
    this.context.router.push({
        pathname:'consult/pay',
        query:{orderId:this.props.location.query.orderId,source:this.props.location.query.source,hospitalUserId:this.props.location.query.hospitalUserId,hospitalTradeno:this.props.location.query.hospitalTradeno}
    })
  }
  getJs() {
    Api
        .getJsApiConfig({url:location.href.split('#')[0]})
        .then((res) => {
            if (res.code == 0) {
//写入b字段
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: res.data.appId, // 必填，公众号的唯一标识
                    timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: res.data.noncestr, // 必填，生成签名的随机串
                    signature: res.data.signature,// 必填，签名
                    jsApiList: ['previewImage','chooseImage','getLocalImgData','hideMenuItems', 'showMenuItems','uploadImage','downloadImage'] // 必填，需要使用的JS接口列表
                });
                wx.ready(function () {
//批量隐藏功能
                    wx.hideMenuItems({
                        menuList: ["menuItem:share:QZone", "menuItem:share:facebook", "menuItem:favorite", "menuItem:share:weiboApp", "menuItem:share:qq", "menuItem:share:timeline", "menuItem:share:appMessage", "menuItem:copyUrl", "menuItem:openWithSafari", "menuItem:openWithQQBrowser"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                    });
                });
            }
        }, (e) => {

        });
}
  addInfo(){
    Api
        .addInfo({
            hospitalTradeno:this.props.location.query.hospitalTradeno,
            type:1,
            inquiryId:this.props.location.query.inquiryId,
            userId:this.props.location.query.userId,
            orderId:this.props.location.query.orderId,

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
              this.context.router.goBack();
                                    
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
          <span>预约时间：</span>  {this.props.location.query.time} {this.props.location.query.times}
        </div>
        <div className='tip-content'>
            <p>1：本系统目前仅支持自费卡用户；</p>
            <p>2：请在预约加号后当日23：00内完成支付，超出时间后系统将做超时处理，加号失败；</p>
            <p>3：若无法按时就诊，请于就诊时间前一天取消预约，就诊当日不能取消预约和退费；</p>
            <p>4：目前暂不支持线下窗口退费，请在线上完成退款操作；</p>
            <p>5：加号成功后，于就诊当日到医生所在门诊等待叫号即可，请携带就诊卡或电子就诊卡</p>

        </div>
       </div>
       <div className='tip-btn'>
           
           <span className='confirm'
               onClick={()=>{
                if(this.props.location.query.status==0){
                  this.addInfo();
                  }else{
                        this.sure();
                  }
               }}

           >同意并预约</span>
       </div>


      </div>
    );
  }
}

export default Connect()(Widget);
