import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import { Link } from 'react-router';
import hashHistory from 'react-router/lib/hashHistory';
import Connect from '../../../components/connect/Connect';
import NoResult from '../../../components/noresult/NoResult';
import * as Api from './sameCardApi';
import './style/index.scss';

class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
  constructor(props) {
    super(props);
    this.state = {
        userInfo: {},
        cardList: [],
        cardList1:[],
        showTip:false,
        leftBindNum:'',
        cardNew:[],
        showToast: false,
        showLoading: false,
        toastTimer: null,
        loadingTimer: null,
        showIOS1: false,
        showIOS2: false,
        showAndroid1: false,
        showAndroid2: false,
        style1: {
            title:'提示',
            buttons: [
                {
                    label: '确定',
                    onClick: this.hideDialog.bind(this)
                }
            ]
        },
        style3: {
            title:'您一共只能绑定两张就诊卡',
            buttons: [
                {
                    label: '我知道了',
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
      this.getJs();
      this.getCardList1();
      this.setState({
          leftBindNum:this.props.location.query.left
      })

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
     getCardList1(){
         this.showLoading();
         Api
             .getCardList1()
             .then((res) => {
                 this.hideLoading();
                 this.setState({
                     cardNew:res.data
                 })
                 if (res.code == 0) {
                     this.setState({
                         cardList:res.data
                     })
                 }
                 var cardList=res.data;
                 for(var i=0;i<cardList.length;i++){
                     cardList[i].isSelect=false;
                 }
                 this.setState({
                     cardList:cardList
                 })
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
    select1(index){
        var cardList=this.state.cardList;
        for(var i=0;i<cardList.length;i++)
        {
            if(index==i){
                cardList[i].isSelect=!cardList[i].isSelect;
            }
        }
       this.setState({
           cardList:cardList
       })
    }
    add(){
        this.showLoading();
        var flag=0;
        var s=this.state.cardList;
        for(var i=0;i<this.state.cardList.length;i++){
            if(this.state.cardList[i].isSelect==true){
                flag++;
                s[i].isSelect=true;
            }
        }
      this.setState({
          cardList:s
      })
        if(flag>this.state.leftBindNum){
            this.hideLoading();
                   this.setState({
                       showIOS2:true
                   })
        }else{
            var cardList=this.state.cardList;

            var  cardNew=this.state.cardNew;
            for(var i=0;i<cardList.length;i++){
                if(cardList[i].isSelect==true){

                    for (var val in cardNew[i]) {
                        if(cardNew[i][val]==null){
                            delete cardNew[i][val];
                        }
                        cardNew[i].isDefalut=0;
                       this.setState({
                           cardNew:cardNew,
                           cardList:cardList
                       })
                    }
                    this.addPerson(this.state.cardNew[i]);
                }
            }
        }
    }
     addPerson(param){
         Api
             .sameCard(param)
             .then((res) => {
                 if (res.code == 0) {
                     this.hideLoading();
                            this.showToast();
                     const timer = setTimeout(() => {
                         clearTimeout(timer);
                        this.context.router.goBack();
                     }, 2000);
                 }
             }, (e) => {
                 this.setState({
                     msg:e.msg,
                     showIOS1:true
                 })
             });

    }
    goNext(){
        this.context.router.push({
            pathname:'usercenter/addcard',
            query:{type:1}
        })

    }
  render() {
     const{cardList,msg}=this.state;
    return (
        <div>
            <Toast icon="success-no-circle" show={this.state.showToast}>同步成功</Toast>

            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
            {msg}
          </Dialog>
            <Dialog type="ios" title={this.state.style3.title} buttons={this.state.style3.buttons} show={this.state.showIOS2}>
            </Dialog>
            {cardList.length>0&&<div className="title">
            已检测到您在重医儿童医院微信公众号绑定了以下就诊人，请选择是否进行同步
        </div>}
            {cardList&&cardList.map((item,index)=>{
                return(
                    <div key={index}>
                       { item.accountId==null&&<div className="card-item"  onClick={()=>{
                       this.select1(index)

                       }}>
                            <div className="collect"  >
                                <img src={item.isSelect?"./././resources/images/com.png":"./././resources/images/nocom.png"}></img>

                            </div>
                            <div className="card-info">
                                <div>就诊人  {item.name}</div>
                                <div>就诊卡{item.patCardNo} </div>
                            </div>
                        </div>}
                        { item.accountId!=null&&<div className="card-item"  >
                            <div className="collect"  >
                                <img src="../../../resources/images/default.png"></img>

                            </div>
                            <div className="card-info">
                                <div>就诊人 {item.name}</div>
                                <div>就诊卡{item.patCardNo} </div>
                            </div>
                        </div>}
                    </div>

                )

            })}

            {cardList.length>0&&<div className="same"
                                     onClick={()=>{
                this.add()

                }}>
          同步就诊人
      </div>}
            {cardList.length>0&&
            <div className="bind"
                onClick={()=>{
                this.goNext()

                }}>
          绑定新就诊人
          </div>}
              </div>

                    );
  }
}

export default Connect()(Widget);
