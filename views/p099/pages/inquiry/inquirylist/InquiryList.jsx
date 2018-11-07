import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import { Link } from 'react-router';
import hashHistory from 'react-router/lib/hashHistory';

import * as Api from './inquiryListApi';
import './style/index.scss';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgList: [],
      quiryNum:0,
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
    };
  }

  componentDidMount() {
    this.getInquiryList();
      //this.getJs();
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
                        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId:res.data.appId, // 必填，公众号的唯一标识
                        timestamp:res.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr:res.data.noncestr, // 必填，生成签名的随机串
                        signature:res.data.signature,// 必填，签名
                        jsApiList: ['hideMenuItems','showMenuItems'] // 必填，需要使用的JS接口列表
                    });
                    wx.ready(function(){
                        //批量隐藏功能
                        wx.hideMenuItems({
                            menuList: ["menuItem:share:QZone","menuItem:share:facebook","menuItem:favorite","menuItem:share:weiboApp","menuItem:share:qq","menuItem:share:timeline","menuItem:share:appMessage","menuItem:copyUrl", "menuItem:openWithSafari","menuItem:openWithQQBrowser"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
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
  getMsg() {
    Api
        .getMsg()
        .then((res) => {
          if(res.code == 0&&res.data!=null){
            this.setState({
              quiryNum:res.data.length
            })
          }
        }, (e) => {
          this.hideLoading();
            this.setState({
                msg:e.msg,
                showIOS1:true
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
        console.log(this.state);
        this.setState({
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            showAndroid2: false,
        });
    }
  getInquiryList() {
      this.showLoading();
    Api
        .getInquiryList()
        .then((res) => {
          if(res.code == 0){
              this.hideLoading();

              this.setState({
              msgList:res.data
            })
          }
        }, (e) => {
          this.hideLoading();
            this.setState({
                msg:e.msg,
                showIOS1:true
            })
        });


  }
  toNext(type){
    if(type==1){

      hashHistory.replace({
        pathname: '/home/index'
      });
    }
    if(type==3){
      hashHistory.replace({
        pathname: '/usercenter/home'
      });
    }


  }
  render() {
     const {msgList,msg}=this.state
    return (
        <div className="container page-inquiry-list">
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
          {/*<block wx:for="{{msgList}}" wx:for-index="idx" wx:for-item="item" wx:key="{{idx}}" wx:if="{{item.type == '1'}}">*/}
          {msgList&&msgList.map((item,index)=>{
           return(
               <div className='doc-item' key={index}>
                 <Link
                     to={{
                     pathname:'inquiry/chat',
                     query:{inquiryId:item.id,orderId:item.orderIdStr,name:item.doctorName,status:item.status}
                     }}>

                   <div className="doc-info">
                     <img className="doc-img2"
                          src={(!!item.doctor&&!!item.doctor.image?item.doctor.image:'../../../resources/images/doc.png') || '../../../resources/images/doc.png'} alt="医生头像" />
                     <div className="text-box">
                       <div className='doc-name'>{item.doctorName}</div>
                       {item.doctor&&<div className='doc-des'>{item.deptName} {item.doctor.level ? '|' : ''} {item.doctor.level}</div>}

                     </div>
                     {(item.status == '0' || item.status == '1')&&<div className="status-inquiry"> 咨询中</div>}
                      {(item.status == '3' || item.status == '2')&&<div className="status-inquiry complete" >已完成</div>}
                   </div>
                   <div className="msg-item">
                     <div className='msg-box'>
                       <div className='msg-text'>{item.content ? item.content : '[图片]'}</div>
                       {item.userReaded == '0'&&<div className="read-status" >未读</div>}

                     </div>
                     <div className="msg-date">{item.createDate}</div>
                   </div>
                 </Link>
                 <div className="oper-box">
                   <div>
                     图文咨询 | 就诊人：{item.patientName}
                   </div>
                   {item.status == '2'&&<div className="evaluate-item" >
                     <Link  className='evaluate'
                         to={{
                         pathname:'/ordermng/evaluate',
                         query:{orderId:item.orderIdStr}
                         }}
                         >评价</Link>
                   </div>}

                 </div>
               </div>)
          })}
          {msgList.length <= 0&&<div  className='no-data'>
              <img src='../../../resources/images/no-result.png' />
              <div>暂未查询到相关信息</div>
            </div>}

          <div className="tarbar">
            <div  onClick={
             ()=>{
             this.toNext(1)

             }
            } >
              <img
                  src="../../../resources/images/index.png"
                  />
              <div >首页</div>
            </div>
            <div >
              <img
                  src="../../../resources/images/inquiry-active.png"/>
              <div style={{color:'#4FABCA'}}>咨询会话</div>
            </div>
            <div  onClick={
             ()=>{
             this.toNext(3)

             }
            } >
              <img
                  src="../../../resources/images/my.png"/>
              <div>我的</div>
            </div>
          </div>
          </div>

          );
  }
}

export default Connect()(Widget);
