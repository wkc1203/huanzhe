import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import { Link } from 'react-router';
import * as Api from '../../../components/Api/Api';
import * as Utils from '../../../utils/utils';
import './style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';


    var throttle = function(func, delay) {            
    　　var prev = Date.now();            
    　　return function() {                
    　　　　var context = this;                
    　　　　var args = arguments;                
    　　　　var now = Date.now();                
    　　　　if (now - prev >= delay) {                    
    　　　　　　func.apply(context, args);                    
    　　　　　　prev = Date.now();                
    　　　　}            
    　　}        
    }   
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
            msgList: '1',
            quiryNum: 0,
            showToast: false,
            showLoading: false,
            toastTimer: null,
            loadingTimer: null,
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            // 分页
            pageNum:1,
            // 锁
            lock:false,
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
            orderType:1,
            // 是否继续加载，请求
            ismsgList:true
        };
    }
    componentDidMount() {
        console.log("id",this.props.location.query.userId)
        if(!!this.props.location.query.userId){
          var storage=window.localStorage;
          
          storage.hasUserId=this.props.location.query.userId; 
        }
        if(this.props.location.query.type=='mdt'){
            this.getMdtList();
            this.setState({
                orderType:'2'
            })
        }else{
            this.getInquiryList();
        }
        // window.addEventListener('scroll',this.pageList)
        let timeCount;
        window.addEventListener('scroll',this.pageList)

        Utils.getJsByHide();
    }
    componentWillUnmount(){
        window.removeEventListener('scroll',this.pageList)
    }


    delayScrollFunc(fn, delay) {
      const now = new Date().getTime();
      if (now - this.lastScrollCall < delay) return;
      this.lastScrollCall = now;
      setTimeout(() => {
        fn();
      }, 500);
    }

    pageList=()=>{
        var scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        //滚动条滚动距离
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        //窗口可视范围高度
        var clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight,document.body.clientHeight);
        
        if(clientHeight + scrollTop >= scrollHeight){
            if(!this.state.lock&&this.state.ismsgList){
                this.setState({lock:true})
                throttle(this.getInquiryList(this.state.pageNum+1),2000)
            }
            
        }
    }
    getType(type){
        console.log(type)
        this.setState({
            orderType:type
        })
        if(type==1){
            this.getInquiryList();
        }else{
            this.getMdtList();
        }
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
    getInquiryList(pageNum=1) {
        this.showLoading();
        Api
            .getInquiryList({pageNum})
            .then((res) => {
                this.setState({lock:false})
                this.hideLoading();
                if (res.code == 0&&res.data&&res.data.recordList&&res.data.recordList.length>0) {
                    
                    var data=[];
                    for(var i=0;i<res.data.recordList.length;i++){
                        if(res.data.recordList[i].status!='4'&&res.data.recordList[i].status!='5'){
                            data.push(res.data.recordList[i])
                        }
                    }
                    if(pageNum>1){
                        this.setState({
                            pageNum,
                            msgList: this.state.msgList.concat(data)
                        })
                    }else{
                        this.setState({
                            msgList: data
                        })
                    }
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
                }else{
                    if(pageNum==1){
                        this.setState({msgList: []})
                    }else{
                        this.setState({ismsgList:false})
                    }
                }
            }, (e) => {
                this.hideLoading();
                this.setState({
                    msgList: [],
                    lock:false
                })
            });
    }
    /*获取mdt列表*/
    getMdtList() {
        this.showLoading();
        Api
            .getMdt({
                userId:window.localStorage.getItem('userId'),
                source:'chat'
            })
            .then((res) => {
                this.hideLoading();
                if (res.code == 0&&res.data.length>0) {
                    
                    var data=[];
                    for(var i=0;i<res.data.length;i++){
                            data.push(res.data[i])
                        
                    }
                    this.setState({
                        msgList: data
                    })
                   /*  if(this.props.location.query.inquiryId&&this.props.location.query.s!=1){
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
                    }  */
                }else{
                    this.setState({
                        msgList: []
                    })
                }
            }, (e) => {
                this.hideLoading();
                this.setState({
                    msgList: []
                })
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
        const {msgList,msg,orderType}=this.state
        return (
            <div className="container page-inquiry-list">
                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons}
                        show={this.state.showIOS1}>
                    {msg}
                </Dialog>
                <div className="orderType">
                    <div className={`${orderType=='1'?'active':''}`} onClick={()=>{
                        this.getType(1)
                    }}>在线咨询
                    <span></span></div>
                    <div className={`${orderType=='2'?'active':''}`} onClick={()=>{
                        this.getType(2)
                    }}>医生会诊
                    <span></span></div>
                </div>
                {msgList&&msgList.length>0&&msgList!='1'&&orderType=='1' && msgList.map((item, index)=> {
                    return (
                        <div className='doc-item' key={index} onClick={(e)=>{
                            e.stopPropagation();
                            e.preventDefault();
                            this.context.router.push({
                                pathname:'inquiry/chat',
                                        query:{inquiryId:item.id,orderId:item.orderIdStr,name:item.doctorName,status:item.status}
                                        
                            })
                        }}>
                            <div className="doc-imgs">
                                <img className="doc-img2"
                                src={(!!item.doctor&&!!item.doctor.image?item.doctor.image:'./././resources/images/doc.png') || '../../../resources/images/doc.png'}
                                alt="医生头像"/>
                            </div> 
                            <div className="chat-info">
                                 <div className="dName">
                                       <p className="name">{item.doctorName}</p>
                                       <p className="time">{!!item.createDate&&item.createDate.substring(0,16)}</p>

                                 </div>
                              
                                 <div className="dDept">
                                   {item.deptName} {!!item.doctor&&!!item.doctor.level ? '|' : ''} {!!item.doctor&&!!item.doctor.level?item.doctor.level:''}
                                 </div>
                                 <div className="dPat">
                                    就诊人：{item.patientName}  |  图文咨询 
                                 </div>
                                 <div className="content-text">
                                 {item.content&&item.content.indexOf('checkItem')!=-1?'[检查单]':item.content&&item.content.indexOf('PIC')!=-1?'[图片]':item.content&&item.content.indexOf('.mp3')!=-1?'[语音]':item.content&&item.content.indexOf('recipelList')!=-1?'[慢病续方]':item.content&&item.content.indexOf('慢病续方')!='-1'?'[慢病续方]':item.content&&item.content.indexOf('dept')!='-1'?'[专家会诊]':item.content&&item.content.length>0?item.content:'  '}
                                 </div>
                                 {(item.status == '0' || item.status == '1') &&item.userReaded !== '0' &&
                                <div className="status-inquiry" style={{color:'white',background:'#4cabcf',border:'none'}}> 咨询中</div>}
                                {item.status == '3' &&item.refundStatus == '0'&&
                                
                                <div className="status-inquiry complete" style={{color:'white',background:'#ccc',border:'none'}}>已完成</div>}
                                {(item.status == '3' || item.status == '2') &&item.refundStatus == '1'&&
                                item.userReaded !== '0' &&
                                <div className="status-inquiry complete" style={{color:'white',background:'#ccc',border:'none'}}>有退费</div>}
                                {item.status == '2' &&item.refundStatus!=1&&
                                <div className="status-inquiry " >评价</div>}

                                {item.userReaded == '0' &&(item.status == '0' || item.status == '1') && <div className="status-inquiry read-status" style={{color:'white',background:'#ea6ea4',border:'none'}}>未读</div>}
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
                {msgList&&msgList.length>0&&msgList!='1'&&orderType=='2' && msgList.map((item, index)=> {
                    return (
                        <div className='doc-item' key={index} onClick={(e)=>{
                            e.stopPropagation();
                            e.preventDefault();
                            this.context.router.push({
                                pathname:'inquiry/mdtInquiry',
                                        query:{mdtId:item.id}
                                        
                            }) 
                        }}>
                            <div className="doc-imgs">
                                <img className="doc-img2"
                                src={'./././resources/images/mtd-icon.png'}
                                alt="头像"/>
                            </div>
                            <div className="chat-info">
                                 <div className="dName">
                                       <p className="name">{item.teamName}</p>
                                 </div>
                                 <div className="dName">
                                        <p className="name" style={{fontSize:'13px',fontWeight:'normal',color:'#666'}}>{item.applyTimeName}</p>
                                </div>
                                 <div className="dDept"> 
                                   {item.docInfoShow} 
                                 </div>
                                 <div className="dPat">
                                    就诊人：{item.patientName}  |  MDT 
                                 </div>
                                 {item.recentContent&&<p className="dtext">
                                     {item.recentContent}
                                 </p>}
                                 {item.content&&<div className="content-text">
                                 {item.content&&item.content.indexOf('checkItem')!=-1?'[检查单]':item.content&&item.content.indexOf('PIC')!=-1?'[图片]':item.content&&item.content.indexOf('.mp3')!=-1?'[语音]':item.content&&item.content.indexOf('recipelList')!=-1?'[慢病续方]':item.content&&item.content.indexOf('慢病续方')!='-1'?'[慢病续方]':item.content&&item.content.indexOf('dept')!='-1'?'[专家会诊]':item.content&&item.content.length>0?item.content:'  '}
                                 </div>}
                                 {item.status !== '0'  &&
                                <div className="status-inquiry top30" style={{color:'white',background:'#4cabcf',border:'none'}}> {item.status=='5'?item.reportName:item.statusName}</div>}
                                {item.status == '0' &&
                                <div className="status-inquiry top30 complete" style={{color:'white',background:'#ccc',border:'none'}}>{item.status=='5'?item.reportName:item.statusName}</div>}
                            </div>
                        </div>)
                })}
                {msgList.length <= 0 &&msgList!='1'&& <div className='no-data'>
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
