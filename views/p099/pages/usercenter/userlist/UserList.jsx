import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import { Link } from 'react-router';
import hashHistory from 'react-router/lib/hashHistory';

import Connect from '../../../components/connect/Connect';
import NoResult from '../../../components/noresult/NoResult';

import * as Api from './userListApi';
import './style/index.scss';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
        userInfo: {},
        cardList: [],
        leftBindNum: 0,
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
    }
  }

  componentDidMount() {
    //this.getArticleTypeList();
      this.setState({
          userInfo:{},
          cardList:[],
          leftBindNum:0
      })
      //this.getJs();
      this.getCardList();
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
                        jsApiList: ['hideMenuItems','showMenuItems','previewImage','uploadImage','downloadImage'] // 必填，需要使用的JS接口列表
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
                this.hideLoading();
                alert("r"+JSON.stringify(e));
                //this.showPopup({ content: e.msg });
            });



    }
     getCardList(){
         Api
             .getCardList()
             .then((res) => {
                 if (res.code == 0) {
                      this.setState({
                          cardList:res.data.cardList,
                          leftBindNum:res.data.leftBindNum || 0
                 })
                 }
             }, (e) => {

             });

    }
    isRegister() {
        Api
            .isRegister()
            .then((res) => {
                if (res.code == 0) {
                    Api
                        .getCardList1()
                        .then((res) => {
                            if(res.data.length > 0){
                                hashHistory.push({
                                    pathname:'usercenter/samecard',
                                    query:{
                                        left:this.state.leftBindNum,

                                    }
                                })

                            }else{
                                hashHistory.push({
                                    pathname:'usercenter/addcard',
                                    query:{
                                        type:0,
                                    }
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
            }, (e) => {
                this.hideLoading();
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });
    }
  componentWillUnmount() {
    this.state.Timer && clearTimeout(this.state.Timer);
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

  render() {
    const {userInfo,cardList,leftBindNum,msg}=this.state;

    return (
        <div className="u-page">
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
            {cardList&&cardList.map((item,index)=>{
               return(
                   <Link className="m-card"
                       key={index}
                       to={{
                       pathname:'/usercenter/userinfo',
                       query:{patientId:item.patientId}
                       }}>
                       <div className="card-info">
                           <div className="info-main">
                               <div className="main-name">
                                   <div className="name">{item.patientName}</div>
                                   {item.isDefault == 1&&<div className="status" >默认</div>}
                               </div>
                           </div>
                           <div className="info-extra">{item.patCardTypeName || '就诊卡'}：{item.patCardNo}</div>
                           <div className="info-extra">电话号码：{item.patientMobile}</div>
                       </div>
                   </Link>
               )

            })}


            {2-cardList.length>0&&<div  className="m-adduser" onClick={()=>{
           this.isRegister()
            }}>
                <div><img src="../../../resources/images/plus.png" /></div>
                <div>
                    <div className="add-title">添加就诊人</div>
                    <div className="add-text">还可添加{2-cardList.length}人</div>
                </div>
            </div>}
            {/*<div @tap="isRegister" className="m-adduser" wx:if="{{2-cardList.length>0}}">
             <div><img src="../../../resources/images/plus.png" /></div>
             <div>
             <div className="add-title">添加就诊人</div>
             <div className="add-text">还可添加{{2-cardList.length}}人</div>
             </div>
             </div>
             */}
            <div className="bandTip">
                您只能绑定两张就诊卡，如果已有两张就诊卡,
            </div>
            <div className="bandTip">
                需要删除以后才能绑定新的就诊卡
            </div>

        </div>


    );
  }
}

export default Connect()(Widget);
