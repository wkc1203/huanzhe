import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import { Link } from 'react-router';
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
            msgList: [],
            quiryNum: 0,
            showToast: false,
            showLoading: false,
            toastTimer: null,
            loadingTimer: null,
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            no:3,
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
            msg: '',
        };
    }
    componentDidMount() {
      
        this.getInquiryList();
        Utils.getJsByHide();
    }
    getMsg() {
        Api
            .getMsg()
            .then((res) => {
                if (res.code == 0 && res.data != null) {
                    this.setState({
                        quiryNum: res.data.length
                    })
                }
            }, (e) => {
                this.hideLoading();
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })
            });
    }
    showToast() {
        this.setState({showToast: true});
        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
    }
   /*获取咨询列表*/
    getInquiryList() {
        this.showLoading();
        Api
            .getInquiryList()
            .then((res) => {
                if (res.code == 0) {
                    this.hideLoading();
                    var data=[];
                    for(var i=0;i<res.data.length;i++){
                        if(res.data[i].status!='4'&&res.data[i].status!='5'){
                            data.push(res.data[i])
                        }
                    }
                    this.setState({
                        msgList: data
                    })
                    if(this.props.location.query.inquiryId&&this.props.location.query.s!=1){
                        window.location.href=window.location.href+"&s=1";
                        this.context.router.push({
                            pathname:'inquiry/chat',
                            query:{
                                inquiryId:this.props.location.query.inquiryId,
                                orderId:this.props.location.query.orderId,
                                status:this.props.location.query.status,
                                no:1
                            }
                        })
                    }
                }
            }, (e) => {
                this.hideLoading();
            });
    }
    toNext(type) {
        if (type == 1) {
            this.context.router.replace({
                pathname: '/home/index'
            });
        }
        if (type == 3) {
            this.context.router.replace({
                pathname: '/usercenter/home'
            });
        }
    }
    render() {
        const {msgList,msg}=this.state
        return (
            <div className="container page-inquiry-list">
                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons}
                        show={this.state.showIOS1}>
                    {msg}
                </Dialog>
                {msgList && msgList.map((item, index)=> {
                    return (
                        <div className='doc-item' key={index}>
                            <div className="doc-img">
                                <img className="doc-img2"
                                src={(!!item.doctor&&!!item.doctor.image?item.doctor.image:'./././resources/images/doc.png') || '../../../resources/images/doc.png'}
                                alt="医生头像"/>
                            </div>
                            <div className="chat-info">
                                 <div className="dName">
                                       <p className="name">{item.doctorName}</p>
                                       <p className="name">{item.createDate}</p>
                                 </div>
                                 <div className="dDept">
                                   {item.deptName} {item.doctor.level ? '|' : ''} {item.doctor.level}
                                 </div>
                                 <div className="dDept">
                                    就诊人：{item.patientName}  |  图文咨询 
                                 </div>
                                 <div className="content-text">
                                 {item.content ? item.content.indexOf('checkItem')!=-1?'[检查单]':item.content: '[图片]'}
                                 </div>
                                 {(item.status == '0' || item.status == '1') &&item.userReaded !== '0' &&
                                <div className="status-inquiry"> 咨询中</div>}
                                {item.status == '3' &&item.refundStatus == '0'&&
                                item.userReaded !== '0' &&
                                <div className="status-inquiry complete">已完成</div>}
                                {(item.status == '3' || item.status == '2') &&item.refundStatus == '1'&&
                                item.userReaded !== '0' &&
                                <div className="status-inquiry complete">有退费</div>}
                                {item.status == '2' &&item.refundStatus!=1&&item.userReaded !== '0' &&
                                <div className="status-inquiry complete">评价</div>}

                                {item.userReaded == '0' && <div className="read-status">未读</div>}
                            </div>
                           {/* <Link
                                to={{ pathname:'inquiry/chat',
                                        query:{inquiryId:item.id,orderId:item.orderIdStr,name:item.doctorName,status:item.status}
                                        }}>
                                <div className="doc-info">
                                    <img className="doc-img2"
                                         src={(!!item.doctor&&!!item.doctor.image?item.doctor.image:'./././resources/images/doc.png') || '../../../resources/images/doc.png'}
                                         alt="医生头像"/>
                                    <div className="text-box">
                                        <div className='doc-name'>{item.doctorName}</div>
                                        {item.doctor && <div
                                            className='doc-des'>{item.deptName} {item.doctor.level ? '|' : ''} {item.doctor.level}</div>}
                                    </div>
                                    {(item.status == '0' || item.status == '1') &&
                                    <div className="status-inquiry"> 咨询中</div>}
                                    {(item.status == '3' || item.status == '2') &&item.refundStatus == '0'&&
                                    <div className="status-inquiry complete">已完成</div>}
                                    {(item.status == '3' || item.status == '2') &&item.refundStatus == '1'&&
                                    <div className="status-inquiry complete">有退费</div>}
                                </div>
                                <div className="msg-item">
                                    <div className='msg-box'>
                                        <div className='msg-text'>{item.content ? item.content.indexOf('checkItem')!=-1?'[检查单]':item.content: '[图片]'}</div>
                                        {item.userReaded == '0' && <div className="read-status">未读</div>}
                                    </div>
                                    <div className="msg-date">{item.createDate}</div>
                                </div>
                            </Link> */}
                           {/* <div className="oper-box">
                                <div>
                                    图文咨询 | 就诊人：{item.patientName}
                                </div>
                                {item.status == '2' &&item.refundStatus!=1&&<div className="evaluate-item">
                                    <Link className='evaluate'
                                          to={{
                                                pathname:'/ordermng/evaluate',
                                                query:{orderId:item.orderIdStr}
                                                }}
                                        >评价</Link>
                                </div>}
                                            </div> */}
                        </div>)
                })}
                {msgList.length <= 0 && <div className='no-data'>
                    <img src='../../../resources/images/no-result.png'/>
                    <div>暂未查询到相关信息</div>
                </div>}
                <div className="tarbar">
                    <div onClick={()=>{this.toNext(1)} }>
                        <img src="../../../resources/images/index.png"/>
                        <div>首页</div>
                    </div>
                    <div>
                        <img
                            src="../../../resources/images/inquiry-active.png"/>
                        <div style={{color:'#4FABCA'}}>咨询会话</div>
                    </div>
                    <div onClick={()=>{ this.toNext(3)}}>
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
