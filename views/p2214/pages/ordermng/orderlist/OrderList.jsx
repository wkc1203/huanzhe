import React, { Component } from 'react';
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
        orderList:'1',
        showToast: false,
        showLoading: false,
        toastTimer: null,
        loadingTimer: null,
        showIOS1: false,
        showIOS2: false,
        showAndroid1: false,
        showAndroid2: false,
        manageList:'1',
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
        patList:'',
        item1Show:true,//咨询显示
        item2Show:false,//加号显示
        item3Show:false,//检查单显示
        item4Show:false,//mdt
        item5Show:false,//慢病续方显示
        checkList:'1',//查检单列表
        describeList:'1',//处方申请列表
        mdtList:'1',//MDT列表
        describeList:'1',//处方申请列表
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
           userId:window.localStorage.userId
       })
     this.getCardList();
     this.getOrderList();
     if(this.props.location.query.busType=='consult'){
        this.setState({
            item1Show:true,
            item2Show:false,
            item3Show:false,
            item4Show:false,
            item5Show:false,
        }) 
    }
     if(this.props.location.query.busType=='add'){
         this.setState({
             item1Show:false,
             item2Show:true,
             item3Show:false,
             item4Show:false,
         })
         this.getAddCardList();
     }
     if(this.props.location.query.busType=='check'){
        this.setState({
            item1Show:false,
            item2Show:false,
            item3Show:true,
            item4Show:false,
            item5Show:false,
        })
        this.getCheckList(this.state.patCard,this.state.searchPage);
    } 
    if(this.props.location.query.busType=='mdt'){
        this.setState({
            item1Show:false,
            item2Show:false,
            item3Show:false,
            item4Show:true,
            item5Show:false,
        })
        this.getmdtList(this.state.searchPage);
        
    }
    if(this.props.location.query.busType=='describe'){
        this.setState({
            item1Show:false,
            item2Show:false,
            item3Show:false,
            item4Show:false,
            item5Show:true,
        })
        this.getdescribeList(this.state.searchPage);
        
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
    getdescribeList(page){
        this.showLoading();
        Api 
            .getDescribeList({
                userId:window.localStorage.userId,
                hisId:2214,
                platformId:2214,
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
                     this.setState({
                        describeList:[]
                    })
                   console.log("red",res);
                   var checkList=res.data.recordList;
                   for(var i=0;i<checkList.length;i++){
                        checkList[i].drugList=!!checkList[i].recipelList?JSON.parse(checkList[i].recipelList):[];
                            checkList[i].showMore=false;
                   }
                  this.setState({
                    describeList:this.state.describeList.concat(checkList) || []
                })
                }else{
                    this.hideLoading();
                    this.setState({
                        describeList: []
                    })
                }
            }, e=> {
                this.hideLoading();
                this.setState({
                    describeList: []
                })
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });
    }
    getCheckList(patCardNo,page) {
        this.showLoading();
        Api 
            .getCheckOrderList({
                userId:window.localStorage.userId,
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
                     this.setState({
                        checkList:[]
                    })
                   var checkList=res.data.recordList;
                   for(var i=0;i<checkList.length;i++){
                    checkList[i].timeText=Utils.dateTime(checkList[i].updateTime);
                  }
                  this.setState({
                    checkList:this.state.checkList.concat(checkList) || []
                })
                }else{
                    this.hideLoading();
                    this.setState({
                        checkList: []
                    })
                }
            }, e=> {
                this.hideLoading();
                this.setState({
                    checkList: []
                })
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
                      this.setState({ 
                          patList: res.data.cardList
                      });
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
             .getOrderListByCard({patCardNo:patCardNo,type:'inquiry'})
             .then((res) => {
                this.hideLoading();
                 if (res.code == 0&&res.data.length>0) {
                    
                     const objStatus = { '-1': '待付款', '0': '咨询中', '1': '咨询中', '3': '已完成' };
                     var items = res.data.map((item, index) => {
                         item.statusName = objStatus[item.status];
                         return item;
                     });
                     this.setState({ orderList: items});
                 }else{
                    this.setState({ orderList: []});
                 }
             }, e=> {
                 this.hideLoading();
                 this.setState({ orderList: []});
                 this.setState({
                     msg:e.msg,
                     showIOS1:true
                 })
             });
    }
  getList(id){
   if(this.state.manageList.length>=1){
       this.setState({
           manageList:[]
       })
   }
   if(id=='全部'){
       
       Api
           .getRegister({userId:window.localStorage.userId,type:'subscribe'})
           .then((res) => {
               if(res.code==0){
                this.hideLoading();
                   if(res.data!=null){
                    
                       this.setState({
                           manageList:res.data
                       })
                   }
               }else{
                this.setState({
                    manageList:[]
                })
               }
           }, (e) => {
               this.hideLoading();
               this.setState({
                manageList:[]
            })
           });
   }else{
       
       Api
           .getRegister({userId:window.localStorage.userId, orderCarNo:id,type:'subscribe'})
           .then((res) => {
              this.hideLoading();
               if(res.code==0){
                   if(res.data!=null){
                      
                       this.setState({
                           manageList:res.data
                       })
                       console.log(this.state.manageList)
                   }else{
                    this.setState({
                        manageList:[]
                    })
                   }
               }
           }, (e) => {
               this.hideLoading();
                this.setState({
                    manageList:[]
                })
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
    this.showLoading();
    Api
        .getCardList()
        .then((res) => {
            if(res.code==0){
                
                var list=res.data.cardList;
                for (var i = 0; i < list.length; i++) {
                    list[i].active = false;
                }
                for (var i = 0; i < list.length; i++) {
                    this.getList('全部');
                }
                this.setState({
                    userId:window.localStorage.userId,
                    list:list
                })
            }
        },(e) => {
        });
}
getmdtList() {
    this.showLoading();
    Api
        .mdtList({userId:window.localStorage.userId})
        .then((res) => {
            this.hideLoading();
            if(res.code==0){ 
                this.setState({
                    mdtList:res.data
                })
            }
        },(e) => {
            this.hideLoading();
            
        });
}
    //切换显示内容
    changeShow(type){
        if(type==1){
            this.setState({
                item1Show:true,
                item2Show:false,
                item3Show:false,
                item4Show:false,
                item5Show:false
            })
            }
            if(type==2){
                
                this.getAddCardList();
                this.setState({
                    item2Show:true,
                    item1Show:false,
                    item3Show:false,
                    item4Show:false,
                    item5Show:false
                })
            }
            if(type==3){
                this.getCheckList('',this.state.searchPage);
                this.setState({
                    item2Show:false,
                    clickItem:555,
                    item1Show:false,
                    item3Show:true,
                    item4Show:false,
                    item5Show:false

                })
            }
            if(type==4){
            this.getmdtList(this.state.searchPage);
                this.setState({
                    item2Show:false,
                    clickItem:555,
                    item1Show:false,
                    item3Show:false,
                    item4Show:true,
                    item5Show:false
                })

            }
            if(type==5){
                this.getdescribeList(this.state.searchPage);
                this.setState({
                    item2Show:false,
                    clickItem:555,
                    item1Show:false,
                    item3Show:false,
                    item4Show:false,
                    item5Show:true,
                })
            
            }

            }   
    hide(index){
        var list=this.state.describeList;

    for(var i=0;i<list.length;i++){
            if(index==i){
                list[i].showMore=!list[i].showMore;
            }
    } 
    this.setState({
        describeList:list
    })
    }
  render() {
    const {mdtList,describeList,checkList,manageList,item1Show,item2Show,item3Show,item4Show,item5Show,clickItem,isPatShow,orderList,patList,msg}=this.state;
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
              {!item1Show&&<img src='./././resources/images/order-chat1s.png'/>}
              {item1Show&&<img src='./././resources/images/order-chat1.png'/>}
           </p>
          <p className={`${item2Show?'item-active':''}`} onClick={()=>{
              this.changeShow(2)
              }}>加号
              {item2Show&&<img src='./././resources/images/order-add1.png'/>}
              {!item2Show&&<img src='./././resources/images/order-add1s.png'/>}
           </p>
          <p className={`${item3Show?'item-active':''}`}
             onClick={()=>{
              this.changeShow(3)
              }}>检验检查
              {!item3Show&&<img src='./././resources/images/order-check1s.png'/>}
              {item3Show&&<img src='./././resources/images/order-check1.png'/>}
           </p>
           <p className={`${item4Show?'item-active':''}`}
             onClick={()=>{
              this.changeShow(4)
              }}>会诊
              {!item4Show&&<img src='./././resources/images/ddglhz.png'/>}
              {item4Show&&<img src='./././resources/images/ddglhzys.png'/>}
           </p>
           <p className={`${item5Show?'item-active':''}`}
           onClick={()=>{
            this.changeShow(5)
            }}>慢病续方
            {!item5Show&&<img src='./././resources/images/order-prescribes.png'/>}
            {item5Show&&<img src='./././resources/images/order-prescribe.png'/>}
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
                {manageList.length>0&&manageList!='1'&&manageList&&manageList.map((item,index)=>{
                   return(
                       <div className="doctorInfo" key={index}>
                         <Add {...item}/>
                       </div>
                   ) })
                }
                {manageList.length<=0&&manageList!='1'&&<div  style={{marginTop:'25%'}}>
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
            {!!orderList&&orderList.length>0&&orderList!='1'&&orderList.map((item,index)=>{
               return(
                   <div className='doc-item' key={index}>
                        <Inquiry  {...item} />
                        <Patient {...item} />
                   </div>
               )
            })}
            {orderList.length <= 0&&orderList!='1'&&<NoResult  msg='暂未查询到相关信息'/>
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
                checkList.length >0&&
                <div className='checkContent'>
                {!!checkList&&checkList.length>0&&checkList!='1'&&checkList.map((item,index)=>{
                    return(
                        <Check  index={index}  key={index} 
                        timeText={item.timeText} patientName={item.patientName}
                        visitDate={item.visitDate} doctorName={item.doctorName} id={item.id}
                        status={item.status} />
                    )
                })}
            </div>
            }
            {checkList.length <= 0&&checkList!='1'&&<NoResult  msg='暂未查询到相关信息'/>}
            </div>
        }

        {item3Show&&<div className="loadMore" ref="wrapper"  ></div>}
        {item4Show&&
            <div className='reportlist'>
               {mdtList&&mdtList!='1'&&mdtList.length>0&&mdtList.map((item,index)=>{
                        return(
                            <div className="describe-item" key={index} onClick={()=>{
                                if(item.status!=='1'){
                                    this.context.router.push({
                                        pathname:'ordermng/mdtdetail', 
                                        query:{id:item.id}
                                    }) 
                                }
                            }}>
                               <div className="des-basic" style={item.status=='1'?{border:'none'}:{}}>
                                    <div className="des">
                                        <p className="left">就诊人：<span>{item.patientName}</span></p>
                                        <p className={`right ${item.status=='1'||item.status=='2'?'dai':item.status=='0'||item.status=='3'||item.status=='4'?'on':''}`}>{item.status=='5'?item.reportName:item.statusName}</p>
                                    </div>
                                    <div className="des">
                                        <p className="left">会诊名称：<span>{item.teamName}</span></p>
                                    </div>
                                    <div className="des">
                                      <p className="left">申请时间：<span>{item.applyTimeName}</span></p>
                                    </div>
                                </div>
                                {item.status!=='1'&&<div className="des-detail">
                                   查看详情
                                   <img src='./././resources/images/des_xyjt.png'/> 
                                </div>}
                            </div>
                        )
               })}
            <div className="no-des">
                       <img src='./././resources/images/mygddl.png'/>     
                       <p>没有更多的了</p>
             </div>
            {/* checkList.length <= 0&&checkList!='1'&&<NoResult  msg='暂未查询到相关信息'/> */}
            </div>
        }
        {item5Show&&!!describeList&&describeList.length>0&&describeList!='1'&&
            <div className='reportlist'>
            {describeList.map((item,index)=>{
                return(
                    <div className="describe-item" key={index} onClick={(e)=>{
                        e.stopPropagation();
                        e.preventDefault();
                        this.context.router.push({
                            pathname:'ordermng/describedetail',
                            query:{id:item.id}    
                        })  
                    }}>
                       <div className="des-basic">
                            <div className="des">
                                <p className="left">就诊人：<span>{item.patientName}</span></p>
                                <p className="right">{item.createDate}</p>
                            </div>
                            <div className="des">
                                <p className="left">就诊科室：<span>{item.deptName}</span></p>
                                <p className="right status">{item.statusName}</p>
                            </div> 
                            <div className="des">
                              <p className="left">诊断：<span>{item.diagnosis}</span></p>
                            
                            </div>
                        </div>
                        {!!item.drugList&&item.drugList.length>0&&<div className='drug' onClick={(e)=>{
                            e.stopPropagation();
                            e.preventDefault();
                           this.hide(index)
                       }}>
                             <div className="drug-tip">
                               <img src='./././resources/images/describe-icon.png'/>药品处方
                             </div>
                             <div className="drug-tab" >
                               {!item.showMore&&<img src='./././resources/images/des_xyjt.png' />}
                               {!!item.showMore&&<img src='./././resources/images/des_jt.png' style={{width:'18px',height:'10px'}} />}
                             </div>
                        </div>}
                        {!!item.drugList&&item.drugList.length>0&&item.showMore&&<div className="more-info">
                            <div className="drug-info">
                              {item.drugList&&item.drugList.map((item1,index1)=>{
                                  return(
                                    <div className="drug-item" key={index1}>
                                        <div className="name">
                                            <p className="left">{item1.Drug_name}</p>
                                            <p className="right">￥{Math.floor(item1.Retail_price*100)/100}</p>
                                        </div>
                                        <div className="dose">
                                            <p className="dose-item">{item1.Freq_desc}</p>
                                            <p className="dose-item">{item1.Administration}</p>
                                            <p className="dose-item">{item1.Drug_spec}</p>
                                            <p className="dose-item">用法：{item1.Dosage+item1.Dosage_unit}</p>
                                        </div>
                                    </div>
                                  )   
                              })}
                            </div>
                            <div className="desdoc-info">
                                <p className="left">医生：{item.doctorName}（{item.doctorTitle}）</p>
                                <p className="right">合计：￥{item.totalFee/100}</p>
                            </div>
                        </div>}
                    </div>
                )
            })
                
                
            }
            <div className="no-des">
                       <img src='./././resources/images/mygddl.png'/>     
                       <p>没有更多了</p>
             </div>
            {/* checkList.length <= 0&&checkList!='1'&&<NoResult  msg='暂未查询到相关信息'/> */}
            </div>
        }
        
    </div>
    );
  }
}
export default Connect()(Widget);