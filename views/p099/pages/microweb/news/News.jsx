import React, { Component } from 'react';
import { Button, Toptips } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';

import * as Api from './newsApi';
import './style/index.scss';
class Widget extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      config: {},
      sexOption: [
        {
          dictKey: 'M',
          dictValue: '男',
        },
        {
          dictKey: 'F',
          dictValue: '女',
        },
      ],
      viewData: {
        onSubmit: false,
        showToptips: false,
        toptips: '',
        isNewCard: '0',
        noresult: {
          msg: '暂未获取到医院配置信息',
          show: false,
        },
        isloading: 0,
      },
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
                this.hideLoading();
                alert("r"+JSON.stringify(e));
                //this.showPopup({ content: e.msg });
            });



    }

  render() {
 
    return (
        <div className="page-news">
          <div className="m-tab">
            <div className="unit-tab">
              <div
                  className="unit-tab-li tab-li active"
                  >健康宣教
              </div>

              {/*<div
               className="unit-tab-li tab-li {{tabIndex == 1 ? 'active' : ''}}"
               @tap="bindChangeTabIndex({{1}})"
               >健康宣教
               </div>*/}



            </div>
          </div>

          <Link  to={{pathname:'/microweb/article'}}>
            <div className="item-box">
              <div className="img-box">
                <img src="../../../resources/images/doc.png" alt="医生头像" />
              </div>
              <div className="list-box">
                <div className='list-title'>2018年“两江国际儿科论坛”在重庆隆重举行！</div>
                <div className='list-time'>时间：2018-07-03</div>
              </div>
            </div>
          </Link>
          {/*<navigator url="/pages/microweb/news/artical/news/index" hidden="{{tabIndex == 0}}">
           <div className="item-box">
           <div className="img-box">
           <img src="{{item.doctor.img || '../../../resources/images/doc.png'}}" alt="医生头像" />
           </div>
           <div className="list-box">
           <div className='list-title'>2018年“两江国际儿科论坛”在重庆隆重举行！</div>
           <div className='list-time'>时间：2018-07-03</div>
           </div>
           </div>
           </navigator>*/}
        </div>

    );
  }
}
export default Connect()(Widget);