import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';
import * as Api from './checkInfoApi';
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
        checkInfo:[],//检查项详情
    }
  }
  componentDidMount() {
      console.log(this.props.location.query.content)
     this.setState({
         checkInfo:JSON.parse(this.props.location.query.content)
     })
     console.log("sds");
      this.getJs();
      //this.getCardList();
      //this.getOrderList();
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
    const {checkInfo,msg}=this.state
    console.log(checkInfo)
    return (
    <div className="container page-check-info">
        <div className="home" style={{position:'fixed',width:'100%',top:'0'}}><span className="jian"
                                    onClick={()=>{
                                      this.context.router.goBack();
                                      }}
            ></span>我的检验检查单
        </div>
        <Toast icon="success-no-circle" show={this.state.showToast}>修改成功</Toast>
        <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
            {msg}
        </Dialog>
        <div className='reportInfo'>
           <div className='infoTop'>
              <p>重庆儿童互联网医院检查单（拿报告时出示）</p>
               <div className='qrCode'>
                 <img src='../../../resources/images/qCode.jpg' alt=""/>
               </div>
           </div>
           <div className='infoBasic'>
             <div>
               <p>申请序号：{checkInfo.applyNo}</p>
               <p>ID号：{checkInfo.IDCard}</p>
             </div>
             <div>
                <p>就诊号：{checkInfo.inquiryNo}</p>
                <p>开单序号：{checkInfo.billNo}</p>
             </div>
            <div>
                <p>执行科室：{checkInfo.executeDept}</p>
                <p>申请科室：{checkInfo.applyDept}</p>
            </div>
           </div>
           <div className='userInfo'>
                <div>
                    <p>就诊人：{checkInfo.patName}</p>
                    <p>性别：{checkInfo.patSex='M'?'男':'女'}</p>
                </div>
                <div>
                    <p>就诊卡：{checkInfo.patCardNo}</p>
                    <p>年龄：{checkInfo.patAge}</p>
                </div>
           </div>
           <div className='itemInfo'>
             <div>标本：{checkInfo.specimen}</div>
             <div>标本说明 ： {checkInfo.specimenDesc}</div>
             <div>化验项目 ：{checkInfo.project_name}</div>

           </div>
           <div className='payFee'>
              金额：<span>￥{(checkInfo.price / 100).toFixed(2)}</span>
           </div>
           <div className='totalFee'></div>
            <div className='doctorInfo'>
              <p>医生：{this.props.location.query.doctorName}</p>
               <div className='net'>
                  <p className='name'>{this.props.location.query.doctorName}</p>
                  <p>{this.props.location.query.hisName} {this.props.location.query.deptName}</p>
                  <p>{this.props.location.query.time}</p>
               </div>
                  
            </div>
        
        </div>  
    </div>
    );
  }
}
export default Connect()(Widget);