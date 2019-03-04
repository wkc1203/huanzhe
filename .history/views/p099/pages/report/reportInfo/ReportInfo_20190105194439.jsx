import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';
import * as Api from './reportInfoApi';
import './style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };  
  constructor(props) {
    super(props);
    this.state = {
        patientName: '全部就诊人',
        isPatShow: false,
        orderList: [],
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
        clickItem:555,
        patList: [],
        item1Show:true,//咨询显示
        item3Show:false,//检查单显示
    }
  }
  componentDidMount() {
      this.showLoading();
     console.log("sds");
        //this.getJs();
      this.getCardList();
      this.getOrderList();
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
    getJs() {
        console.log(window.location.href.substring(0,window.location.href.indexOf("#")-1))
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
      this.setState({
          patList:[],
          patientName:'全部就诊人',
          isPatShow:false,
          orderList:[]
      })
    // 离开页面时结束所有可能异步逻辑

  }
    selectPat(patientId, patientName) {
        this.setState({
            patientName:patientName,
            isPatShow:false,
        })
        this.getOrderList(patientId);
    }
    openList() {
        this.setState({
            isPatShow:!this.state.isPatShow,
        })
    }
     getCardList() {
         Api
             .getCardList()
             .then((res) => {
                  if(res.code==0){

                      this.setState({ patList: res.data.cardList });
                  }
                  }, e=> {
                 this.setState({
                     msg:e.msg,
                     showIOS1:true
                 })
             });
    }
    /*获取订单列表*/
     getOrderList(patientId = '') {
         this.showLoading();
         Api
             .getOrderList({patientId:patientId})
             .then((res) => {
                 if (res.code == 0) {
                      this.hideLoading();
                     const objStatus = { '-1': '待付款', '0': '咨询中', '1': '咨询中', '3': '已完成' };
                     var items = res.data.map((item, index) => {
                         item.statusName = objStatus[item.status];
                         return item;
                     });


                     this.setState({ orderList: items});
                 }
             }, e=> {
                 this.hideLoading();
                 this.setState({
                     msg:e.msg,
                     showIOS1:true
                 })
             });

    }
  getUser() { // 获取实名制

      Api
      .getUser()
      .then((res) => {
        this.setState({ user: res.data });
      }, e=> {
            this.setState({
                msg:e.msg,
                showIOS1:true
            })
      });
  }
    //切换显示内容
    changeShow(type){
       if(type==1){
           this.setState({
               item1Show:true,
               item2Show:false,
               item3Show:false
           })
       }
        if(type==2){
            alert("正在建设中")
            this.setState({
                item2Show:true,
                item1Show:false,
                item3Show:false
            })
        }
        if(type==3){
            this.setState({
                item3Show:true,
                item2Show:false,
                item1Show:false
            })
        }

    }

  render() {
    const {item1Show,item2Show,item3Show,clickItem,isPatShow,orderList,patList,msg}=this.state
    return (
    <div className="container page-report-info">
        <div className="home" style={{position:'fixed',width:'100%',top:'0'}}><span className="jian"
                                    onClick={()=>{
                                      this.context.router.push({
                                       pathname:'usercenter/home'
                                      })
                                      }}
            ></span>订单管理
        </div>
        <Toast icon="success-no-circle" show={this.state.showToast}>修改成功</Toast>
        <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
            {msg}
        </Dialog>
        <div className='reportInfo'>
           <div className='infoTop'>
              <p>条形码（用于医院拿实体报告）</p>
               <div className='qrCode'>
                 <img src="" alt=""/>
               </div>
           </div>
           <div className='infoBasic'>
                    <div>
                    <p>姓名：张大大</p>
                    <p>性别：男</p>
                    </div>
                    <div>
                        <p>出生日期：2018-09-12</p>
                        <p>检查科室：血液分析</p>
                    </div>
                    <div>
                        <p>检查时间：2014-05-15 14：12</p>
                        <p>标本类型：拇指血</p>
                    </div>
                    <div>
                        <p>送检项目：血液分析</p>
                        <p>发布时间：2017-06-18 14：52</p>
                </div>
                    <div>
                        <p>样本编号：1452222</p>
                        <p>流水号：125222</p>
                </div>
                    <div>
                        <p>执行医生：国庆</p>
                </div>

              <div className='img'>
              </div>
           </div>
           <div className='reportResult'>
             <p>检查结果</p>
             <div className='resultInfo'>
               <div className='name'>
                 白细胞
               </div>
               <div className='number'>
                 参考值 4.0-1.0*12
               </div>
             </div>
           </div>
           
        
        </div>  
    </div>
    );
  }
}
export default Connect()(Widget);