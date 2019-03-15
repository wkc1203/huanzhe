import React, { Component } from 'react';
import { Button, Toptips } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';
import hashHistory from 'react-router/lib/hashHistory';

import * as Api from './newsApi';
import './style/index.scss';
class Widget extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
      this.getJs();

  }
  componentWillUnmount() {
    // 离开页面时结束所有可能异步逻辑

  }
  getJs(){
    Api
        .getJsApiConfig({url:window.location.href.substring(0,window.location.href.indexOf("#"))})
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
              // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
              wx.showMenuItems({
                menuList: ["menuItem:copyUrl","menuItem:openWithQQBrowser","menuItem:share:appMessage", "menuItem:share:timeline"
                  ,"menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:QZone",
                  "menuItem:openWithSafari"] // 要显示的菜单项，所有menu项见附录3
              });
            });

          }
        }, (e) => {
        });
  }

  render() {
    return (
        <div className="page-news">
          <div className="home"><span className="jian"
                                      onClick={()=>{
                                      this.context.router.push({
                                       pathname:'home/index'
                                      })
                                      }}
              ></span>健康宣教
          </div>
          <div className="m-tab">
            <div className="unit-tab">
              <div
                  className="unit-tab-li tab-li active"
                  >健康宣教
              </div>
            </div>
          </div>
          <a  href='https://mp.weixin.qq.com/s/4qcdnerKbc3qUiwLOojHaw'>
            <div className="item-box">
             
              <div className="list-box">
                <div className='list-title'>孩子"撕开肚皮"吃,竟吃成"小糖人" ?</div>
                <div className='list-time'>重医儿童医院</div>
              </div>
              <div className="img-box">
              <img src="./././resources/images/newsFirst.jpg" alt="医生头像" />
            </div>
            </div>
          </a>
          <a  href='https://mp.weixin.qq.com/s/4NDBWvHD-_yvjaEj_D7PgA'>
          <div className="item-box">
            
            <div className="list-box">
              <div className='list-title'>无辜的米花糖,惹祸啦!</div>
              <div className='list-time'>重医儿童医院</div>
            </div>
            <div className="img-box">
              <img src="./././resources/images/newsSencod.jpg" alt="医生头像" />
            </div>
          </div>
        </a>
          {/* <div className="wgt-empty-box">
            <img className="wgt-empty-img" src="../../../resources/images/no-result.png" alt=""></img>

            <div className="wgt-empty-txt">暂未查询到相关信息
            </div>
         </div> */}
          
        </div>

    );
  }
}
export default Connect()(Widget);