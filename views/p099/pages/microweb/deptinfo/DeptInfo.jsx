import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';

import * as Api from './deptInfoApi';
import './style/index.scss';
class Widget extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
        showToast: false,
        showLoading: false,
        toastTimer: null,
        loadingTimer: null,
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
        msg:'',
      deptInfo:[]
    };
  }
  componentDidMount() {
    //this.getJs();
    console.log(this.props.location.query.no);
    this.getDepInfo({no:this.props.location.query.no});
  }
  componentWillUnmount() {
    // 离开页面时结束所有可能异步逻辑

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
        console.log(this.state);
        this.setState({
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            showAndroid2: false,
        });
    }
  getJs(){

    Api
        .getJsApiConfig({url:'https://tih.cqkqinfo.com/views/p099/'})
        .then((res) => {
          console.log(res);
          if(res.code==0){
            //写入b字段
            console.log("str",res.data);
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId:res.data.appId, // 必填，公众号的唯一标识
              timestamp:res.data.timestamp, // 必填，生成签名的时间戳
              nonceStr:res.data.noncestr, // 必填，生成签名的随机串
              signature:res.data.signature,// 必填，签名
              jsApiList: ['hideMenuItems','showMenuItems'] // 必填，需要使用的JS接口列表
            });
            wx.ready(function(){
              //批量隐藏功能
              wx.hideMenuItems({
                menuList: ["menuItem:copyUrl", "menuItem:openWithSafari","menuItem:openWithQQBrowser"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
              });
            });

          }


          //this.setState({ hospInfo: res.data });
        }, (e) => {
            this.setState({
                msg:e.msg,
                showIOS1:true
            })
        });



  }
   getDepInfo(param){
    Api
        .getDepInfo(param)
        .then((res) => {
          console.log(res);
          if(res.code == 0){
            this.setState({ deptInfo: res.data });
          }
        }, e=> {
            this.setState({
                msg:e.msg,
                showIOS1:true
            })
        });

  }

  render() {
    const {deptInfo,msg}=this.state;
    console.log('kl',deptInfo.length)
    return (
        <div className="p-page">
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
          {!!deptInfo&&<div className="m-deptname">{deptInfo.name}</div>}
          {!!deptInfo&&<div className="m-deptinfo">
              <div className="m-blockinfo" >
                <div className="m-title">科室介绍</div>
                <div className="m-summary">{deptInfo.summary ? deptInfo.summary : '暂无简介'}</div>
              </div>
          </div>}

          {/*</block>
           <div className='no-data' wx:if="{{!deptInfo}}">*/}
          {!deptInfo&&<div className='no-data'  >
            <img src='../../../resources/images/no-result.png' />
            <div>暂未查询到相关信息</div>
          </div>}
        </div>

    );
  }
}
export default Connect()(Widget);