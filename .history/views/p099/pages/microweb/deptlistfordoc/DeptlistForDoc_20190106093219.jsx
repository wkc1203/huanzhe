import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';
import hashHistory from 'react-router/lib/hashHistory';
import * as Api from './deptlistForDocApi';
import './style/index.scss';
class Widget extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      docList: [],
      // 科室列表
      deptList: [],
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
      // 选中tab
      activeIdx: -2,
      // 显示历史记录
      showHistory: false,
      // 功能类型(科室介绍: dept, 医生介绍: doctor)
      funType: 'doctor',
    };
  }
  componentDidMount() {
       this.getJs();
    this.deptListFull();
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
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId:res.data.appId, // 必填，公众号的唯一标识
                        timestamp:res.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr:res.data.noncestr, // 必填，生成签名的随机串
                        signature:res.data.signature,// 必填，签名
                        jsApiList: ['hideMenuItems','showMenuItems'] // 必填，需要使用的JS接口列表
                    });
                    wx.ready(function(){
                        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                        wx.showMenuItems({
                            menuList: ["menuItem:copyUrl","menuItem:openWithQQBrowser","menuItem:share:appMessage", "menuItem:share:timeline"
                                ,"menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:QZone",
                                "menuItem:openWithSafari"] // 要显示的菜单项，所有menu项见附录3
                        });
                    });

                }
            }, (e) => {
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
        this.setState({
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            showAndroid2: false,
        });
    }
  deptListFull() {
    Api
        .deptListFull()
        .then((res) => {
          if(res.code==0){
            this.setState({
              activeIdx:0,
              deptList:res.data
            })
            this.getDocList(0);
          }
        }, e=> {
            this.setState({
                msg:e.msg,
                showIOS1:true
            })
        });

  }
  getDocList(index){
    const  no = this.state.deptList[index].no || {};
    Api
        .docListFull({pdeptId: no})
        .then((res) => {
          this.setState({ docList: res.data.doctors });
        }, e=> {
            this.setState({
                msg:e.msg,
                showIOS1:true
            })
        });
  }
  bindChangeIndex(index) {
     this.setState({
       activeIdx:index.index
     })
    this.getDocList(index.index);
  }
  bindTapDept(doctorId){
    this.context.router.replace({
      pathname: '/microweb/doctorinfo',
      query:{doctorId:doctorId}
    });

  }

  render() {
      const {searchFocus,msg,deptList,docList,activeIdx}=this.state
    return (
        <div className={`dfc-page ${searchFocus ? 'unscroll' : ''} `}>
            <div className="home" ><span className="jian"
                                        onClick={()=>{
                                      this.context.router.push({
                                       pathname:'home/index'
                                      })
                                      }}
                ></span>科室列表
            </div>
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
          <div className="g-list">
            <div className="m-list">
              <div className="list-box">
                <div className="list-lt-box">
                  <div className="list-lt">
                    {
                        deptList.length>0&&deptList.map((item,index)=>{
                          return(
                              <div  className={`lt-item ${activeIdx === index ? 'active' : ''}`} key={index}
                                  onClick={()=>{
                                  this.bindChangeIndex({index})
                                  }}>
                                {item.name}
                              </div>
                          )
                        })
                    }
                  </div>
                </div>
                <div className="list-rt-box">
                  <div className="list-rt">
                    {docList.length>0&&<div
                          className="rt-sec active"
                          >
                          {docList.map((item1,index1)=>{
                            return(
                                <Link
                                   to={{ pathname: '/microweb/doctorinfo',
                                    query:{doctorId:item1.doctorId}
                                    }}
                                    className="sec-li"

                                    key={index1}>
                                  <div className="doc-info">
                                    <img className="doc-img" src={item1.image || '/resources/images/doc.png'} alt="医生头像" />
                                    <div className="text-box">
                                      <div className='doc-name'>{item1.name}</div>
                                      <div className='doc-des'>{item1.level}</div>
                                    </div>
                                    <div className="unit-arrow"></div>
                                  </div>
                                </Link>
                            )
                          })
                              }
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

    );
  }
}
export default Connect()(Widget);