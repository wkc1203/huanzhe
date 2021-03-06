﻿import React, { Component } from 'react';
import { Button, Toptips } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';
import hashHistory from 'react-router/lib/hashHistory';
import * as Api from '../../../components/Api/Api';
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
            //写入b字段
            console.log("str",res.data);
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId:res.data.appId, // 必填，公众号的唯一标识
                timestamp:res.data.timestamp, // 必填，生成签名的时间戳
                nonceStr:res.data.noncestr, // 必填，生成签名的随机串
                signature:res.data.signature,// 必填，签名
                jsApiList: ['updateTimelineShareData','onMenuShareAppMessage','hideMenuItems','showMenuItems'] // 必填，需要使用的JS接口列表
            });
            wx.ready(function(){
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                wx.showMenuItems({
                    menuList: ["menuItem:copyUrl","menuItem:openWithQQBrowser","menuItem:share:appMessage", "menuItem:share:timeline"
                        ,"menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:QZone",
                        "menuItem:openWithSafari"] // 要显示的菜单项，所有menu项见附录3
                });
                wx.updateTimelineShareData({ 
                    title: '重医儿童医院咨询平台', // 分享标题
                    link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: 'http://ihoss.oss-cn-beijing.aliyuncs.com/PIC/hospital/logo-2214.png', // 分享图标
                    success: function () {
                       
                    }
                })
                wx.onMenuShareAppMessage({
                    title:'重医儿童医院咨询平台', // 分享标题
                    desc:'', // 分享描述
                    link:location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl:'http://ihoss.oss-cn-beijing.aliyuncs.com/PIC/hospital/logo-2214.png', // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                      // 用户点击了分享后执行的回调函数
                    }
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
          <a  href='https://mp.weixin.qq.com/s/u5DWYUA2XuGTqvtltWhb4A'>
          <div className="item-box">           
            <div className="list-box" style={{paddingRight:'10px',paddingLeft:'0px'}}>
              <div className='list-title' style={{paddingBottom:'10px'}}>先别急着给孩子减衣裤，“倒春寒”来啦！</div>
              <div className='list-time' style={{paddingTop:'5px'}}>重医儿童医院  <span style={{fontSize:'12px',paddingLeft:'5px'}}>2019年3月29日</span></div>
            </div>
            <div className="img-box">
            <img src="./././resources/images/20181229.jpg"   style={{width:'80px'}}/>
          </div>
          </div>
        </a>
          <a  href='https://mp.weixin.qq.com/s/NqYygP-WT1G291Ay4XihGw'>
          <div className="item-box">        
            <div className="list-box" style={{paddingRight:'10px',paddingLeft:'0px'}}>
              <div className='list-title' style={{paddingBottom:'10px'}}>背诵唐诗的起跑线在哪里？</div>
              <div className='list-time' style={{paddingTop:'5px'}}>重医儿童医院  <span style={{fontSize:'12px',paddingLeft:'5px'}}>2019年3月22日</span></div>
            </div>
            <div className="img-box">
            <img src="./././resources/images/run.jpg"   style={{width:'80px'}}/>
          </div>
          </div>
        </a>
        <a  href='https://mp.weixin.qq.com/s/YsSP1lxo0z4-MOxw4cZDwg'>
        <div className="item-box">         
          <div className="list-box" style={{paddingRight:'10px',paddingLeft:'0px'}}>
            <div className='list-title'>孩子“只吃不长”，小心被甲亢“大魔王”盯上！</div>
            <div className='list-time' style={{paddingTop:'5px'}}>重医儿童医院  <span style={{fontSize:'12px',paddingLeft:'5px'}}>2019年3月22日</span></div>
          </div>
          <div className="img-box">
          <img src="./././resources/images/tang.jpg"   style={{width:'80px'}}/>
        </div>
        </div>
      </a>       
      <a  href='https://mp.weixin.qq.com/s/4xeTQ3XZcEwpMQNfMOTD8g'>
            <div className="item-box">             
              <div className="list-box" style={{paddingRight:'10px',paddingLeft:'0px'}}>
                <div className='list-title'>【健康中国 儿院医生讲科普】高能预警！儿童也会得肾结石？</div>
                <div className='list-time' style={{paddingTop:'5px'}}>重医儿童医院  <span style={{fontSize:'12px',paddingLeft:'5px'}}>2019年2月28日</span></div>
              </div>
              <div className="img-box">
              <img src="./././resources/images/seng.jpg"   style={{width:'80px'}}/>
            </div>
            </div>
          </a>          
          <a  href='https://mp.weixin.qq.com/s?__biz=MzAxMjUyMzAzOA==&mid=2665292374&idx=3&sn=e8b552d2b906dbd8d400c550b3157db9&chksm=80990127b7ee8831fedc1ef6a673cf26cca7fc197848fe685494d7bf0b477e22f268711a7633&bizpsid=0&scene=126&subscene=0&ascene=3&devicetype=android-28&version=2700033b&nettype=cmnet&abtest_cookie=BAABAAoACwASABMABQAjlx4AVpkeANOZHgDcmR4A3pkeAAAA&lang=zh_CN&pass_ticket=gyJshHoa5YsqHSuwRy0QvameXUo91JijEdmSazjdmERz9oiHN2sv0pqqQPs95o3e&wx_header=1'>
            <div className="item-box">             
              <div className="list-box" style={{paddingRight:'10px',paddingLeft:'0px'}}>
                <div className='list-title'>【健康中国 儿院医生讲科普】孩子"撕开肚皮"吃,竟吃成"小糖人" ?</div>
                <div className='list-time' style={{paddingTop:'5px'}}>重医儿童医院  <span style={{fontSize:'12px',paddingLeft:'5px'}}>2019年2月28日</span></div>
              </div>
              <div className="img-box">
              <img src="./././resources/images/newsSencod.jpg"   style={{width:'80px'}}/>
            </div>
            </div>
          </a>
          <a  href='https://mp.weixin.qq.com/s?__biz=MzAxMjUyMzAzOA==&mid=2665292374&idx=4&sn=564f7baaa26cce6855fefaaff48eae0e&chksm=80990127b7ee88319b4168ebc76aa68e9d1a973ab43b3e5ed57552d90325ed85e21422c178bf&scene=4&subscene=126&ascene=0&devicetype=android-28&version=2700033b&nettype=cmnet&abtest_cookie=BAABAAoACwASABMABQAjlx4AVpkeANOZHgDcmR4A3pkeAAAA&lang=zh_CN&pass_ticket=gyJshHoa5YsqHSuwRy0QvameXUo91JijEdmSazjdmERz9oiHN2sv0pqqQPs95o3e&wx_header=1'>
          <div className="item-box">            
            <div className="list-box" style={{paddingRight:'10px',paddingLeft:'0px'}}>
              <div className='list-title' >【健康中国 儿院医生讲科普】无辜的米花糖,惹祸啦!</div>
              <div className='list-time' style={{paddingTop:'5px'}}>重医儿童医院  <span style={{fontSize:'12px',paddingLeft:'5px'}}>2019年2月28日</span></div>
            </div>
            <div className="img-box">
              <img src="./././resources/images/newsFirst.jpg"  />
            </div>
          </div>
        </a>
        <a  href='https://mp.weixin.qq.com/s/fkEOBOclmD6TTlvEiHEeXA'>
          <div className="item-box">            
            <div className="list-box" style={{paddingRight:'10px',paddingLeft:'0px'}}>
              <div className='list-title' >【健康中国 儿院医生讲科普】血常规——简单看，有妙招</div>
              <div className='list-time' style={{paddingTop:'5px'}}>重医儿童医院  <span style={{fontSize:'12px',paddingLeft:'5px'}}>2018年12月29日</span></div>
            </div>
            <div className="img-box">
              <img src="./././resources/images/2019330.jpg" />
            </div>
          </div>
        </a>
        <a  href='https://mp.weixin.qq.com/s/datF7a72iCvYIce-BfnoTA'>
          <div className="item-box">            
            <div className="list-box" style={{paddingRight:'10px',paddingLeft:'0px'}}>
              <div className='list-title' >【健康中国 儿院医生讲科普】宝宝便秘 如何处理？</div>
              <div className='list-time' style={{paddingTop:'5px'}}>重医儿童医院  <span style={{fontSize:'12px',paddingLeft:'5px'}}>2018年9月14日</span></div>
            </div>
            <div className="img-box">
              <img src="./././resources/images/bianmi.jpg" />
            </div>
          </div>
        </a>
        </div>  
    );
  }
}
export default Connect()(Widget);