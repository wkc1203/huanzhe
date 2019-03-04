import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';
import * as Api from './orderListApi';
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
        isSure:false,
        manageList:[],
        list:[],
        isLoad:true,
        active111:true,
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
        checkList:[],//查检单列表
    }
  }
  componentDidMount() {
      this.showLoading();
     console.log("sds");
        this.getJs();
      this.getCardList();
      this.getOrderList();
      
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
    getCheckList() {
        this.showLoading();
        Api
            .getcheckList({userId:this.props.location.query.userId,hisId:2214,platformId:2214})
            .then((res) => {
                if (res.code == 0) {
                     this.hideLoading();
                   console.log("red",res);
                   this.setState({
                       checkList:res.data.recordList
                   })

                }
            }, e=> {
                this.hideLoading();
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
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
    selectPat(patCardNo, patientName) {
        this.setState({
            patientName:patientName,
            isPatShow:false,
        })
        this.getOrderList(patCardNo);
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
     getOrderList(patCardNo = '') {
         this.showLoading();
         Api
             .getOrderList({patCardNo:patCardNo})
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
  getList(id){
    this.showLoading();

   if(this.state.manageList.length>=1){
       this.setState({
           manageList:[]
       })
   }
   if(id=='全部'){
       this.setState({
           manageList:[]
       })
       Api
           .getRegister({userId:""})
           .then((res) => {
               if(res.code==0){
                   if(res.data!=null){
                       this.hideLoading();
                       this.setState({
                           manageList:res.data
                       })
                   }
               }

           }, (e) => {
               this.hideLoading();
           });
   }else{
       this.setState({
           manageList:[]
       })
       Api
           .getRegister({userId:this.state.userId, patientId:id,})
           .then((res) => {
               if(res.code==0){
                   if(res.data!=null){
                       this.hideLoading();
                       this.setState({
                           manageList:res.data
                       })
                   }
               }

           }, (e) => {
               this.hideLoading();
           });
   }
}
switchStatus(type,index){
   if(type=='全部'){
        this.setState({
            active111:true
        })
       this.getList(type);
   }else{
       var list=this.state.list;
       for(var i=0;i<list.length;i++){
           if(index==i){
               list[i].active=true;
           }else{
               list[i].active=false;
           }

       }
       this.setState({
           list:list,
           active111:false
       })
       this.getList(type);
   }
}
sure()
{
   this.setState({
       isSure:true
   })
}
sure1(){
    this.context.router.push({
        pathname:'inquiry/chat'
    })
 }
  getAddCardList() {
    Api
        .getCardList()
        .then((res) => {
            this.hideLoading();
            if(res.code==0){
                this.setState({
                    pList:res.data.cardList
                })
                var list=res.data.cardList;
                for (var i = 0; i < list.length; i++) {
                    list[i].active = false;
                }
                for (var i = 0; i < list.length; i++) {
                    this.getList('全部');
                }

                this.setState({
                    userId:this.props.location.query.userId,
                    list:list
                })
            }
        },(e) => {

        });
}
    //切换显示内容
    changeShow(type){
        
       if(type==1){
          
           
                    this.setState({
                        item1Show:true,
                        item2Show:false,
                        item3Show:false,
                    })
           
           
       }
        if(type==2){
            this.getAddCardList();
            this.setState({
                item2Show:true,
                item1Show:false,
                item3Show:false
            })
        }
        if(type==3){
            this.setState({
                showIOS1:true,
                msg:'该功能正在建设中'
            })
            this.setState({
                item2Show:false,
                item1Show:false,
                item3Show:true
            })
        }

    }

  render() {
    const {checkList,item1Show,item2Show,item3Show,clickItem,isPatShow,orderList,patList,msg,manageList,list,active111}=this.state
    return (
    <div className="container page-order-list">
        <div className="home" style={{position:'fixed',width:'100%',top:'0'}}><span className="jian"
                                    onClick={()=>{
                                      this.context.router.push({
                                       pathname:'usercenter/home'
                                      })
                                      }}
            ></span>订单管理
        </div>
        <Toast icon="success-no-circle" show={this.state.showToast}>修改成功</Toast>
        <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
            {msg}
        </Dialog>
        <div className="classify">
          <p className={`${item1Show?'item-active':''}`}
              onClick={()=>{
              this.changeShow(1)

              }}>咨询 <span></span></p>
          <p className={`${item2Show?'item-active':''}`} onClick={()=>{
              this.changeShow(2)

              }}>加号<span></span></p>
          <p className={`${item3Show?'item-active':''}`}
             onClick={()=>{
              this.changeShow(3)

              }}>病历<span></span></p>
        </div>
        {item2Show&&
            <div className="page-add-confirm">
            <div className="container">
              
                {
                    //<div className="personInfo">
                //     <div
                //         onClick={()=>{
                //        this.switchStatus('全部',111)
                //         }}
                //     >
                //         <p className={`${active111?'active':''}`}>全部就诊人</p>
                //     </div>
                //         {list&&list.map((item,index)=>{
                //             return(
                //                 <div  key={index} onClick={()=>{this.switchStatus(item.patientId,index)}}>
                //                     <p className={`${item.active?'active':''}`}>
                //                         {item.patientName}
                //                     </p>
                //                 </div>
                //                 )
                //             })}

                // </div>
            }
            <div style={{height:'44px',marginBottom:'10px',width:'100%',background:'white'}}>
                <ul >
                    <li className={`${clickItem==555?'isShowColor':'default-item1'} `}
                        onClick={()=>{
                              this.openList()
                                this.setState({
                                 clickItem:555,isPatShow:false,
                                })}}
                        >全部就诊人</li>
                    {patList&&patList.map((item,index)=>{
                        return(
                            <li
                                key={index}
                                onClick={()=>{
                                this.setState({
                                 clickItem:index,
                                 isPatShow:false,
                                })
                         this.switchStatus(item.patientId,index)
                        }}
                                className={`${clickItem==index?'showColor':''} ${isPatShow ? 'active' : 'default-item'}`}>{item.patientName}</li>
                        )
                    })}
                </ul>
            </div>
           
            {isPatShow&&<div className='modal2' >
                <div className='modal-body'>
                    <div  className='showColor modal-list'
                        onClick={()=>{
                        this.switchStatus('全部',111)
                        }}
                        >全部就诊人</div>
                    {patList&&patList.map((item,index)=>{
                       return(
                           <div
                               key={index}
                               onClick={()=>{
                                this.setState({
                                 clickItem:index,
                                 isPatShow:false,
                                })
                        this.switchStatus(item.patientId,index)
                        }}
                               className='modal-list'>{item.patientName}</div>
                       )
                    })}
                </div>
            </div>}

                {manageList&&manageList.map((item,index)=>{
                   return(
                       <div className="doctorInfo" key={index}>
                           <Link
                               to={{
                               pathname:'add/addManage',
                               query:{id:item.hospitalTradeno}
                             
                               }}>
                               <div className="img"><img src={item.doctorImg}></img></div>
                               <div className="basic">
                                   <div><span>{item.doctorName}</span> 主任医师</div>
                                   <div>{item.hisName}</div>
                                   <div className="registerTime">预约时间：{item.orderDate} {item.times=='上午'?'11:00-11:30':item.hospitalDistrict=='礼嘉分院'?'15:30-16:00':'17:00-17:30'}</div>
                               </div>
                               {item.isVisit=='0'&&item.isPay=='1'&&<div  className="status"> <p>待就诊</p></div>}
                               {item.isVisit=='0'&&item.isPay=='0'&&<div  className="status"><p>未付款</p></div>}
                               {item.isVisit=='2'&&<div  className="status"> <p  className="disNo">已过期</p></div>}
                               {item.isVisit=='3'&&<div className="status"><p className="disNo" >已退号</p></div>}
                               {item.isVisit=='1'&&<div  className="status"> <p className="disNo">已就诊</p></div>}
                           </Link>
                       </div>
                   ) })
                }
                {manageList.length<1&&<div  style={{marginTop:'25%'}}>
                    <img src="../../../resources/images/noData.png"
                         style={{marginTop:'25%',marginLeft:'35%',width:'112px',height:'112px',margin:'0 auto',display:'block'}}></img>
                    <div className='return' >
                        暂时还没有加号信息。向医生咨询时，可向医生提出加号请求，医生会根据咨询情况判断，向您开出加号。
                    </div>
                </div>}
            </div>
        </div>}
        {item1Show&&<div>
            <div style={{height:'44px',marginBottom:'10px',width:'100%',background:'white'}}>
                <ul >
                    <li className={`${clickItem==555?'isShowColor':'default-item1'} `}
                        onClick={()=>{
                              this.openList()
                                this.setState({
                                 clickItem:555
                                })}}
                        >全部就诊人</li>
                    {patList&&patList.map((item,index)=>{
                        return(
                            <li
                                key={index}
                                onClick={()=>{
                                this.setState({
                                 clickItem:index
                                })
                         this.selectPat(item.patCardNo,item.patientName)
                        }}
                                className={`${clickItem==index?'showColor':''} ${isPatShow ? 'active' : 'default-item'}`}>{item.patientName}</li>
                        )
                    })}
                </ul>
            </div>
           
            {isPatShow&&<div className='modal2' >
                <div className='modal-body'>
                    <div  className='showColor modal-list'
                        onClick={()=>{
                        this.selectPat('','全部就诊人')
                        }}
                        >全部就诊人</div>
                    {patList&&patList.map((item,index)=>{
                       return(
                           <div
                               key={index}
                               onClick={()=>{
                                this.setState({
                                 clickItem:index
                                })
                        this.selectPat(item.patCardNo,item.patientName)
                        }}
                               className='modal-list'>{item.patientName}</div>
                       )
                    })}
                </div>
            </div>}
            {orderList&&orderList.map((item,index)=>{
               return(
                   <div className='doc-item' key={index}>
                       <Link to={{
                       pathname:'/ordermng/orderdetail',
                       query:{orderId:item.id}
                       }}>
                           <div className="doc-info">
                               <img className="doc-img" src={item.doctorImgUrl || '../../../resources/images/doc.png'} alt="医生头像" />
                               <div className="text-box11">
                                   <div className='doc-name'>{item.doctorName}</div>
                                   <div className='doc-des'>{item.deptName} {item.level ? '|' : ''}  {item.level}</div>
                                   <div className='doc-des'>{item.hisName}</div>
                               </div>
                           </div>
                           <div className='msg-box'>
                               <div>
                                   <div>咨询时间：{item.createTime}</div>
                                   <div>完成时间：{item.finishTime || '暂无完成时间' }  </div>
                               </div>
                               <div className='price-box'>
                                   ￥{(item.totalFee/100).toFixed(2)}
                               </div>
                           </div>
                       </Link>
                       <div className="oper-box">
                           <div className="pat-item">{item.typeName} | 就诊人：{item.patientName}</div>
                           {item.status != '2'&&<div className="status-name">{item.statusName}</div>}
                           {item.status == '2'&&<div className="status-name">已完成</div>}
                           {item.status == '2'&&item.refundStatus!=1&&<div className="eva-item" >
                               <Link
                                   to={{
                                   pathname:'/ordermng/evaluate',
                                   query:{orderId:item.id}
                                   }}
                                   className='evaluate'
                                   >
                                   评价
                               </Link>
                           </div>}
                       </div>
                   </div>
               )
            })}
            {orderList.length <= 0&&
            <div  className='no-data'>
              <img src='../../../resources/images/no-result.png'/>
              <div>暂未查询到相关信息</div>
            </div>}
         </div>}
        {item3Show&&
            <div className='reportlist'>

            {
               // checkList&&checkList.map((item,index)=>{
            //     return(
            //         <div className='report-item'>
            //         <span className='report-status'>
            //         {item.status=='2'?'已付款':'未付款'}
            //         </span>

            //         <div className='report-info' onClick={()=>{
            //             this.context.router.push({
            //                 pathname:'/check/confirmCheck',
            //                 query:{id:item.id,orderId:item.orerIdStr,resource:'1',inquiryId:item.inquiryId}
            //             })
            //         }}>
            //             <p>就诊人：{item.patientName}</p>
            //             <p>医生：{item.doctorName}</p>
            //             <p>申请时间：{item.createTime}</p>
            //         </div>
            //         <div className='report-oper'>
            //            <span onClick={()=>{
            //                this.context.router.push({
            //                    pathname:'/check/checkList',
            //                    query:{content:JSON.stringify(item)}
            //                })
            //            }}>查看检查单</span>
            //         </div>
            //     </div>
            //     )
            // })
        }
            {checkList.length <= 0&&
                <div  className='no-data'>
                  <img src='../../../resources/images/no-result.png'/>
                  <div>暂未查询到相关信息</div>
                </div>}
            </div>
        }
    </div>
    );
  }
}
export default Connect()(Widget);