import React, { Component } from 'react';
import { Link } from 'react-router';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import * as Api from '../../../components/Api/Api';
import 'style/index.scss';
import * as Utils from '../../../utils/utils';

import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
  constructor(props) {
    super(props);
    this.state = {
        docList: [],
        deptId: '',
        showToast: false,
        showLoading: false,
        toastTimer: null,
        loadingTimer: null,
        showIOS1: false,
        showIOS2: false,
        toastTitle:'',
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
    };
  }

  componentDidMount() {
         //隐藏分享等按钮
      Utils.getJsByHide();
      this.getCollectList();
  }
    
    showToast() {
        console.log("hhhh")
        this.setState({showToast: true});
        console.log(this.state.showToast)
      
        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
      }
    /*选择收藏*/
    switchCollect(deptId, doctorId){
        Api
            .cancelCollect({ doctorId:doctorId, deptId:deptId })
            .then((res) => {
                if(res.code == 0) {

                    this.showToast();
                    this.getCollectList();
                    return false;
                }
            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });
    }
    /*收藏列表*/
     getCollectList() {
         Api
             .getCollectList()
             .then((res) => {
                 if (res.code == 0){

                     this.setState({
                         docList: res.data
                     })
                 }
             }, (e) => {
                 this.setState({
                     msg:e.msg,
                     showIOS1:true
                 })
             });
    }
  render() {
    const {docList,deptId,msg}=this.state
    return (
        <div className="p-page">
            <div className="home"><span className="jian"
                                        onClick={()=>{
                                      this.context.router.push({
                                       pathname:'usercenter/home'
                                      })
                                      }}
                ></span>我的收藏
            </div>
            <Toast icon="success-no-circle" show={this.state.showToast}>修改成功</Toast>
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
            <div className="m-search-content">

                {docList.length <= 0&&
                 <div className='no-data'>
                 <img src='../../../resources/images/no-result.png' />
                 <div>暂未查询到相关信息</div>
                 </div>
              }
                {docList.length>0&&docList&&docList.map((item,index)=>{
                   return(
                       <Link  className='doc-item'
                           to={{
                            pathname:'/consult/deptdetail',
                            query:{doctorId:item.doctorId,deptId:item.deptId,resource:2}
                           }}
                              key={index}
                           >
                           <div className="doc-info1">
                               <img className="doc-img" src={item.image || '../../../resources/images/doc.png'} alt="医生头像" />
                               <div className="text-box">
                                   <div className='doc-name'>
                                       {item.name}<div className="img-box"><img
                                       onClick={(e)=>{

                                      this.switchCollect(item.deptId,item.doctorId);
                                        e.preventDefault();
                                       }}
                                       src="../../../resources/images/collect1.png" /></div>
                                   </div>
                                   <div className='doc-des'>{item.deptName} | {item.level}</div>
                                   <div className='pinfen'>
                                       <span>好评率：{item.favoriteRate}</span>咨询人数：{item.completed}</div>
                                   <div className='doc-des ellipsis'>{item.specialty ? item.specialty : '暂无描述'}</div>
                               </div>
                           </div>
                           <div className='oper-box'>
                              {item.inquirys&&item.inquirys.map((item1,index1)=>{
                                  return(
                                      <div key={index1}>
                                          {item1.type=='1'&&<c>图文咨询</c>}
                                          {item1.type=='1'&&<span className="fee-des">￥{(item1.remune/100).toFixed(2)}元/次 </span>}
                                      </div>
                                  )
                              }) }
                               {item.type == '2'&&<div>
                                   <span>|</span>
                                   视频问诊<span className="fee-des">￥{(item1.remune/100).toFixed(2)}元/次 </span>
                               </div>}
                           {item.type == '3'&&<div>
                               <span>|</span>
                               电话问诊<span className="fee-des">￥{(item1.remune/100).toFixed(2)}元/次 </span>

                       </div>}
                           </div>
                       </Link>
                   )

                })}


                </div>
            </div>


            );
  }
}

export default Connect()(Widget);
