import React, { Component } from 'react';
import { InfiniteLoader, LoadMore } from 'react-weui';
import { Link } from 'react-router';
import Connect from '../../../components/connect/Connect';
import NoResult from '../../../components/noresult/NoResult';
import * as Api from './cardTipApi';
import './style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
  constructor(props) {
    super(props);
    this.state = {
      noResult: {
        msg: '暂未获取到相关信息',
        show: false,
      },
      articleTypeList: [],
      articleData: {},
    };
  }
  componentDidMount() {
        this.getJs();
  }
    getJs() {
        Api
            .getJsApiConfig({url:window.location.href.substring(0,window.location.href.indexOf("#")-1)})
            .then((res) => {
                if (res.code == 0) {
//写入b字段
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: res.data.appId, // 必填，公众号的唯一标识
                        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: res.data.noncestr, // 必填，生成签名的随机串
                        signature: res.data.signature,// 必填，签名
                        jsApiList: ['hideMenuItems', 'showMenuItems'] // 必填，需要使用的JS接口列表
                    });
                    wx.ready(function () {
//批量隐藏功能
                        wx.hideMenuItems({
                            menuList: ["menuItem:share:QZone", "menuItem:share:facebook", "menuItem:favorite", "menuItem:share:weiboApp", "menuItem:share:qq", "menuItem:share:timeline", "menuItem:share:appMessage", "menuItem:copyUrl", "menuItem:openWithSafari", "menuItem:openWithQQBrowser"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                        });
                    });
                }
            }, (e) => {
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })
            });
    }
  componentWillUnmount() {
    this.state.Timer && clearTimeout(this.state.Timer);
  }
 /*返回上一页*/
  goPrev1(){
    this.context.router.push({
      pathname:'/usercenter/addcard'
    })
  }

  render() {
    return (
        <div className="tip5">
            <div className="home"><span className="jian"
                                        onClick={()=>{
                                      this.context.router.push({
                                       pathname:'usercenter/addcard'
                                      })
                                      }}
                ></span>如何绑卡
            </div>
            <img className="bindTip" src="../../../resources/images/bindTip.png"></img>
            <img   className="know"
                    onClick={
                    ()=>{
                   this.goPrev1()

                    }
                    }
                   src="../../../resources/images/know.png"></img>

        </div>
                    );
  }
}

export default Connect()(Widget);
