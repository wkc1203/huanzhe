﻿import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';
import * as Api from '../../../components/Api/Api';
import * as Utils from '../../../utils/utils';
import './style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
  constructor(props) {
    super(props);
    this.state = {
      scrollerId:'-1',
      pingList:[],
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
        msg:'',
      deptList:[],
    };
  }
  componentDidMount() {
        this.getJs();
    this.deptListFull();
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
   deptListFull() {
       this.showLoading();
    Api
        .deptListFull()
        .then((res) => {
          if(res.code == 0){
              this.hideLoading();
              this.setState({ deptList:res.data});
            var pingList1=[];
              var m=res.data;
            for(let o in m){
              pingList1.push(o);
            }
            this.setState({
              pingList:pingList1
            })
          }
        }, e=> {
            this.hideLoading();
            this.setState({
                msg:e.msg,
                showIOS1:true
            })
        });
  }
    charScroller(scrollerId) {
        var s=document.getElementsByClassName(scrollerId)[0].offsetTop;
        document.getElementsByClassName("d-page")[0].scrollTop=s;
        this.setState({
            scrollerId:scrollerId
        })
    }
  render() {
     const {deptList,pingList,scrollerId,msg}=this.state;
    return (
        <div className="d-page">
            <div className="home"><span className="jian"
                                        onClick={()=>{
                                      this.context.router.push({
                                       pathname:'home/index'
                                      })
                                      }}
                ></span>科室列表
            </div>
          {pingList.length>0&&pingList.map((item,index)=>{
          return (
              <div className='main-content'>
                  <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                      {msg}
                  </Dialog>
                <div className={`letters-item ${item?item:''} ${item==scrollerId?'active1':''}`} key={index} id={index} >{item}</div>
                  <div className="item-box1">
                     { deptList[item].map((item1,index1)=>{
                         return(
                          <Link
                              to={{
                              pathname:'/microweb/deptinfo',
                              query:{no:item1.no}
                              }}
                              className="list-item" key={index1} >{item1.name}</Link>
                         )
                      })}
               </div>
              </div>
          )
          })
          }
          <div className="right-list">
              {pingList.length > 0 && pingList.map((item2, index2)=> {
                  return (
                      <div key={index2}
                           onClick={()=>{
                               console.log("sss")
                            this.charScroller(item2)
                           }}
                           className={`char-item ${scrollerId == item2 ? 'active' : ''}`}>{item2}</div>
                  )
              })
              }
          </div>
          {!deptList&&<div className='no-data'  >
            <img src='../../../resources/images/no-result.png' />
            <div>暂未查询到相关信息</div>
          </div>}
        </div>
    );
  }
}
export default Connect()(Widget);