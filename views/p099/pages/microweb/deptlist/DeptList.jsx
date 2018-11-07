import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';

import * as Api from './deptListApi';
import './style/index.scss';
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
      // 科室列表
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
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
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
                console.log("o",o);
              pingList1.push(o);
            }

            this.setState({
              pingList:pingList1
            })
              console.log(res);
            console.log("gg",pingList1);
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
        this.setState({
            scrollerId:scrollerId
        })
    }
  render() {
     const {deptList,pingList,scrollerId,msg}=this.state;
      console.log("s",scrollerId);
    return (
        <div className="d-page">
          {pingList.length>0&&pingList.map((item,index)=>{
          return (
              <div>
                  <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                      {msg}
                  </Dialog>
                <div className="letters-item" key={index} id={index}>{item}</div>
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
                            this.charScroller(index2)
                           }}
                           className={`char-item ${scrollerId == index2 ? 'active' : ''}`}>{item2}</div>
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