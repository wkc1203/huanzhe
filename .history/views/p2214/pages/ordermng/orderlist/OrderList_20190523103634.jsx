﻿import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import NoResult from '../../../components/noresult/NoResult';
import Inquiry from './component/Inquiry';
import Patient from './component/Patient';
import Check from './component/Check';
import Add from './component/Add';
import Link from 'react-router/lib/Link';
import * as Api from '../../../components/Api/Api';
import './style/index.scss';
import * as Utils from '../../../utils/utils';
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
        showToast: false,
        showLoading: false,
        toastTimer: null,
        loadingTimer: null,
        showIOS1: false,
        showIOS2: false,
        showAndroid1: false,
        showAndroid2: false,
        manageList:[],
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
        clickItem:555,
        patList: [],
        item1Show:true,//咨询显示
        item2Show:false,//加号显示
        item3Show:false,//检查单显示
        checkList:[],//查检单列表
        patCard:'',
        searchPage:1, 
        isLoadingMore: false,
    }
  }
  componentDidMount() {
    this.showLoading(); 
       //隐藏分享等按钮
       Utils.getJsByHide();
       this.setState({
           userId:this.props.location.query.userId
       })

     this.getCardList();
     this.getOrderList();
     
     if(this.props.location.query.busType=='consult'){
        this.setState({
            item1Show:true,
            item2Show:false,
            item3Show:false,
        }) 
     
    }
     if(this.props.location.query.busType=='add'){
         this.setState({
             item1Show:false,
             item2Show:true,
             item3Show:false,
         })
         this.getAddCardList();
     }
     if(this.props.location.query.busType=='check'){
        this.setState({
            item1Show:false,
            item2Show:false,
            item3Show:true,
        })
        this.getCheckList(this.state.patCard,this.state.searchPage);
         
    }  
    let timeCount;
    window.addEventListener('scroll', function () {
        if (this.state.isLoadingMore) {
            return ;
        }
        if (timeCount) {
            clearTimeout(timeCount);
        }
        timeCount = setTimeout(this.callback(), 5000);
    }.bind(this), false);

      
  }
  callback() {
    const wrapper = this.refs.wrapper;
    const loadMoreDataFn = this.loadMoreDataFn;
    const top = wrapper?wrapper.getBoundingClientRect().top:0;
    const windowHeight = window.screen.height;
    //console.log("window"+top+"kk  "+windowHeight); 
    
    const that = this; // 为解决不同context的问题
    if (top && top < windowHeight) { 
        // 当 wrapper 已经被滚动到页面可视范围之内触发
        if(that.state.item3Show&&that.state.searchPage!=555){
            that.loadMoreDataFn();
        }
    }  
    }
    loadMoreDataFn() { 
        this.setState({
            searchPage:this.state.searchPage+1
        })
        this.getCheckList(this.state.patCard,this.state.searchPage)

    }
    showToast() {
        this.setState({showToast: true});
        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
    }
   
    
    getCheckList(patCardNo,page) {
        this.showLoading();
        Api 
            .getcheckList({
                userId:this.props.location.query.userId,
                hisId:2214,
                platformId:2214,
                patCardNo:patCardNo,
                pageNum:page,
                numPerPage:10
            })
            .then((res) => {
                if (res.code == 0&&res.data.recordList.length>0) {
                     this.hideLoading();
                     if(page>=res.data.pageCount){
                         this.setState({
                             searchPage:555
                         })
                     }
                   console.log("red",res);
                   var checkList=res.data.recordList;
                   for(var i=0;i<checkList.length;i++){
                    checkList[i].timeText=Utils.dateTime(checkList[i].updateTime);
                  }
                  this.setState({
                    checkList:this.state.checkList.concat(checkList) || []
                })
                }else{
                    this.hideLoading();
                }
            }, e=> {
                
                this.setState({
                    msg:e.msg,
                    showIOS1:true
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
             .getOrderList({patCardNo:patCardNo,type:'inquiry'})
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
           .getRegister({userId:this.state.userId,type:'subscribe'})
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
           .getRegister({userId:this.state.userId, orderCarNo:id,type:'subscribe'})
           .then((res) => {
               if(res.code==0){
                   if(res.data!=null){
                       this.hideLoading();
                       this.setState({
                           manageList:res.data
                       })
                       console.log(this.state.manageList)
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
switchStatus3(type,index){
    console.log("type",type)
    if(type=='全部'){
         this.setState({
             active111:true,
             patCard:'',
             searchPage:1,
             checkList:[],
         })
        this.getCheckList('',1);
    }else{
        var list=this.state.patList;
        for(var i=0;i<list.length;i++){
            if(index==i){
                list[i].active=true;
            }else{
                list[i].active=false;
            }
 
        }
        this.setState({
            patList:list,
            list:list,
            active111:false,
            patCard:type,
            searchPage:1, 
             checkList:[],

        })
        this.getCheckList(type,1);
    }
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
   
    this.getCheckList('',this.state.searchPage);
    this.setState({
        item2Show:false,
        clickItem:555,
        item1Show:false,
        item3Show:true
    })
    
}

}

  render() {
    const {checkList,manageList,item1Show,item2Show,item3Show,clickItem,isPatShow,orderList,patList,msg}=this.state
    return (
    <div className="container page-order-list">
        <div className="home" style={{position:'fixed',width:'100%',top:'0'}}>
          <span className="jian"
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

              }}>咨询 
              {!item1Show&&<img src='./././resources/images/order-chats.png'/>}

              {item1Show&&<img src='./././resources/images/order-chat.png'/>}
           </p>
          <p className={`${item2Show?'item-active':''}`} onClick={()=>{
              this.changeShow(2)

              }}>加号
              {item2Show&&<img src='./././resources/images/order-add.png'/>}

              {!item2Show&&<img src='./././resources/images/order-adds.png'/>}
           </p>
          <p className={`${item3Show?'item-active':''}`}
             onClick={()=>{
              this.changeShow(3)

              }}>检验检查
              {!item3Show&&<img src='./././resources/images/order-checks.png'/>}

              {item3Show&&<img src='./././resources/images/order-check.png'/>}
           </p>
        </div>
        {item2Show&&
            <div className="page-add-confirm">
            <div className="container">
              
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
                                 clickItem:index,
                                 isPatShow:false,
                                })
                         this.switchStatus(item.patCardNo,index)
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
                        this.switchStatus('全部',111);
                        this.setState({
                            isPatShow:false,
                           })
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
                        this.switchStatus(item.patCardNo,index)
                        }}
                               className='modal-list'>{item.patientName}</div>
                       )
                    })}
                </div>
            </div>}

                {manageList&&manageList.map((item,index)=>{
                   return(
                       <div className="doctorInfo" key={index}>
                         <Add {...item}/>
                          
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
                        <Inquiry  {...item} />
                        <Patient {...item} />

                   </div>
               )
            })}
            {orderList.length <= 0&&<NoResult  msg='暂未查询到相关信息'/>
            }
         </div>}
        {item3Show&&
            <div className='reportlist'>
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
                             clickItem:index,
                             isPatShow:false,
                            })
                     this.switchStatus3(item.patCardNo,index)
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
                            this.switchStatus3('全部',111);
                            this.setState({
                                isPatShow:false,
                            })
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
                            this.switchStatus3(item.patCardNo,index)
                            }}
                                className='modal-list'>{item.patientName}</div>
                        )
                        })}
                    </div>
                </div>}

            {
                checkList.length >= 0&&
                <div className='checkContent'>
                {checkList&&checkList.map((item,index)=>{
                    return(
                        <Check  index={index}  key={index} 
                        timeText={item.timeText} patientName={item.patientName}
                        visitDate={item.visitDate} doctorName={item.doctorName} id={item.id}
                        status={item.status} />
                    )
                })}
                       
            </div>
            }
            {checkList.length <= 0&&<NoResult  msg='暂未查询到相关信息'/>}
            </div>
        }
        {item3Show&&<div className="loadMore" ref="wrapper"  ></div>}
    </div>
    );
  }
}
export default Connect()(Widget);