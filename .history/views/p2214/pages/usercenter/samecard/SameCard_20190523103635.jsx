import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import { Link } from 'react-router';
import hashHistory from 'react-router/lib/hashHistory';
import Connect from '../../../components/connect/Connect';
import * as Utils from '../../../utils/utils';
import NoResult from '../../../components/noresult/NoResult';
import * as Api from '../../../components/Api/Api';

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
        showToast1: false,
        showLoading: false,
        toastTimer: null,
        loadingTimer: null,
        showIOS1: false,
        showIOS2: false,
        showIOS3: false,
        showAndroid1: false,
        showAndroid2: false,
        style1: {
            title:'提示',
            buttons: [
                {
                    label: '确定',
                    onClick: Utils.hideDialog.bind(this)
                }
            ]
        },
        style3: {
            title:'您一共只能绑定两张就诊卡',
            buttons: [
                {
                    label: '我知道了',
                    onClick: Utils.hideDialog.bind(this)
                }
            ]
        },
        style2: {
            title: '添加就诊人',
            buttons: [
                {
                    type: 'primary',
                    label: '已有就诊卡',
                    onClick: this.isAdd.bind(this)
                },
                {
                    type: 'primary',
                    label: '申请就诊卡',
                    onClick: this.goMain.bind(this)
                }
            ]
        },
        msg:'',
    }
  }

  componentDidMount() {
       //在当前页面的微信内隐藏分享按钮
      Utils.getJsByHide();
      this.getCardList1();
      this.setState({
          leftBindNum:this.props.location.query.left
      })
      var that=this;
      document.addEventListener('click',function(e){

          console.log( e.target.className);
          if(e.target.className=='weui-mask'){
              that.setState({
                  showIOS3:false
              })
          }
      });

  }
    goMain(){
        window.location.href='http://wx.cqkqinfo.com/wx3/p/03/p/card_choose.cgi'
    }
    isAdd(){
        this.setState({
            showIOS2:false
        })
        this.context.router.push({
            pathname:'usercenter/addcard',
            query:{
                type:this.props.location.query.type==3?3:0,
            }
        })

    }
    showToast() {
        this.setState({showToast: true});
        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
    }
    showToast1() {
        this.setState({showToast1: true});
        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast1: false});
        }, 2000);
    }
  
   
    /*获取就诊人列表*/
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
                     if(res.data.length>0){
                         this.setState({
                             cardList:res.data
                         })
                         var cardList=res.data;
                         for(var i=0;i<cardList.length;i++){
                             cardList[i].isSelect=false;
                         }
                         this.setState({
                             cardList:cardList
                         })
                     }else{
                         if(this.props.location.query.url!=null&&this.props.location.query.syn==1){
                             window.location.href=this.props.location.query.url;
                             top.window.location.replace(this.props.location.query.url);
                         }
                     }

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
    /*勾选*/
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
    /*选择要添加的人*/
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
        console.log("flag",flag);
        if(flag==0){
            console.log("fff")
            this.hideLoading();
            this.setState({
                showIOS1:true,
                msg:'请选择您要同步的就诊人'
            })
        }else{
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

    }
    /*同步就诊人*/
     addPerson(param){

         Api
             .sameCard(param)
             .then((res) => {
                 if (res.code == 0) {
                     this.hideLoading();
                            this.showToast();
                     if(this.props.location.query.url!=null&&this.props.location.query.syn==1){
                          window.location.href=this.props.location.query.url;
                         top.window.location.replace(this.props.location.query.url);
                     }else{
                         const timer = setTimeout(() => {
                             clearTimeout(timer);
                             this.context.router.goBack();
                         }, 2000);
                     }

                 }
             }, (e) => {
                 this.setState({
                     msg:e.msg,
                     showIOS1:true
                 })
             });
    }
    /*返回添加页面*/
    goNext(){
        this.setState({
            showIOS3: true
        })

    }
  render() {
     const{cardList,msg}=this.state;
    return (
        <div>
            <div className="home"><span className="jian"
                                        onClick={()=>{
                                      this.context.router.push({
                                       pathname:'usercenter/userlist'
                                      })
                                      }}
                ></span>同步就诊人
            </div>
            <Toast icon="success-no-circle" show={this.state.showToast}>同步成功</Toast>
            <Toast icon="success-no-circle" show={this.state.showToast1}>请选择需要同步的就诊人</Toast>

            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
            {msg}
          </Dialog>
            <Dialog type="ios" title={this.state.style3.title} buttons={this.state.style3.buttons} show={this.state.showIOS2}>
            </Dialog>
            <Dialog type="ios" title={this.state.style2.title} buttons={this.state.style2.buttons} show={this.state.showIOS3}>
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

            {cardList.length>0&&<div className="bind"
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
