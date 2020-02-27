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
        maxPage:'',
        describePage:1,
        maxPage1:'',
        isLoadingMore: false,
        // 咨询列表查询 页码
        listPageNum:1,
        // 咨询列表 查询全部还某个个
        listPatCardNo:'',
        // 加号查询 页码
        registerPageNum:1,
        // 锁
        lock:false,
        // 滚动是否继续加重-显示
        listPageStus:false,
        // 滚动是否显示 没有数据了
        jiahaoPageStus:false
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
            searchPage:1,
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
        this.getmdtList();
        
    }
    if(this.props.location.query.busType=='describe'){
        this.setState({
            item1Show:false,
            item2Show:false,
            item3Show:false,
            item4Show:false,
            item5Show:true,
        })
        this.getdescribeList(this.state.describePage);
        
    }

    /*let timeCount;
    window.addEventListener('scroll', function () {
        if (this.state.isLoadingMore) {
            return ;
        }
        if (timeCount) {
            clearTimeout(timeCount); 
        }
        timeCount = setTimeout(this.callback(), 5000);
    }.bind(this), false);*/
    window.scrollTo(0,0);
    window.addEventListener('scroll',this.scrollEvent)
  }

  componentWillUnmount() {
      this.setState({
          patList:[],
          patientName:'全部就诊人',
          isPatShow:false,
          orderList:[]
      })
    // 离开页面时结束所有可能异步逻辑
    window.removeEventListener('scroll',this.scrollEvent)
  }

  delayScrollFunc(fn, delay) {
      const now = new Date().getTime();
      if (now - this.lastScrollCall < delay) return;
      this.lastScrollCall = now;
      setTimeout(() => {
        fn;
      }, 500);
    }
  scrollEvent=()=>{

    var scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    //滚动条滚动距离
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    //窗口可视范围高度
    var clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight,document.body.clientHeight);
    console.log('heiig=',scrollHeight,scrollTop,clientHeight)
    if(clientHeight + scrollTop >= scrollHeight&&scrollTop!=44){
      if(!this.state.lock){
        this.setState({lock:true})
        if(this.state.item1Show&&!this.state.listPageStus){
            console.log('yyy')
            this.delayScrollFunc(this.getOrderList(this.state.listPatCardNo,this.state.listPageNum+1),4000)
        }
        if(this.state.item2Show&&!this.state.jiahaoPageStus){
            this.delayScrollFunc(this.getList(this.state.listPatCardNo,this.state.registerPageNum+1),4000)
        }
        if(this.state.item3Show&&this.state.searchPage<=this.state.maxPage){
            this.delayScrollFunc(this.loadMoreDataFn(),4000)
        }
        if(this.state.item5Show&&this.state.describePage!=555){
            this.delayScrollFunc(this.loadMoreDataFn1(),4000)
            
        }

      }
    }
    
  }
 /* callback() {
    const wrapper = this.refs.wrapper;
    const loadMoreDataFn = this.loadMoreDataFn;
    const top = wrapper?wrapper.getBoundingClientRect().top:0;
    const windowHeight = window.screen.height;
    const that = this; // 为解决不同context的问题
    if (top && top < windowHeight) { 
        if(this.state.item1Show){
            this.getOrderList(this.state.listPageNum+1);
        }
        if(this.state.item2Show){
            this.getList('全部',this.state.registerPageNum+1)
        }
        // 当 wrapper 已经被滚动到页面可视范围之内触发
        if(that.state.item3Show&&that.state.searchPage<=this.state.maxPage){
            that.loadMoreDataFn();
        }
        if(that.state.item5Show&&that.state.describePage!=555){
            that.loadMoreDataFn1();
        }

    }  
  }*/
    loadMoreDataFn() { 
       
        this.setState({
            searchPage:this.state.searchPage+1
        })
        if(this.state.searchPage+1<=this.state.maxPage){
            this.getCheckList(this.state.patCard,this.state.searchPage)
        }
       
    }
    loadMoreDataFn1() { 
        this.setState({
            describePage:this.state.describePage+1
        })
        if(this.state.describePage<=this.state.maxPage1){
            this.getdescribeList(this.state.describePage)
        }
    }
    showToast() {
        this.setState({showToast: true});
        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
    }
    getdescribeList(page=1){
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
              this.setState({lock:false})
                if (res.code == 0&&res.data&&res.data.recordList&&res.data.recordList.length>0) {
                     this.hideLoading();
                         this.setState({
                             maxPage1:res.data.pageCount
                         })
                   
                   var checkList=res.data.recordList;
                   for(var i=0;i<checkList.length;i++){
                        checkList[i].drugList=!!checkList[i].recipelList?JSON.parse(checkList[i].recipelList):[];
                            checkList[i].showMore=false;
                   }
                   if(page==1){
                    this.setState({
                        describeList:checkList || []
                    })
                   }else{
                    this.setState({
                        describeList:this.state.describeList.concat(checkList) || []
                    })
                   }
                 
                }else{
                    this.hideLoading();
                    this.setState({
                        describeList: []
                    })
                }
            }, e=> {
                this.hideLoading();
                this.setState({
                    describeList: [],
                    msg:e.msg,
                    showIOS1:true,
                    lock:false
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
              this.setState({lock:false})
                if (res.code == 0&&res.data.recordList.length>0) {
                     this.hideLoading();
                     //if(page>=){
                         this.setState({
                             maxPage:res.data.pageCount
                         })
                     
                     
                   var checkList=res.data.recordList;
                   for(var i=0;i<checkList.length;i++){
                    checkList[i].timeText=Utils.dateTime(checkList[i].updateTime);
                  }
                  if(page==1){
                    this.setState({
                        checkList:checkList || []
                    })
                 }else{
                    this.setState({
                        checkList:this.state.checkList.concat(checkList) || []
                    })
                 }
                 
                }else{
                    this.hideLoading();
                    this.setState({
                        checkList: []
                    })
                }
            }, e=> {
                this.hideLoading();
                this.setState({
                    checkList: [],
                    msg:e.msg,
                    showIOS1:true,
                    lock:false
                })
            });
   }
  
    selectPat(patCardNo, patientName) {
        this.setState({
            patientName:patientName,
            isPatShow:false,
            listPageNum:1,
            listPageStus:false,
            listPatCardNo:patCardNo
        })
        this.getOrderList(patCardNo,1);
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
     getOrderList(patCardNo = '',pageNum=1) {
         this.showLoading();
         Api
             .getOrderListByCardList({patCardNo:patCardNo,type:'inquiry',pageNum})
             .then((res) => {
                this.setState({lock:false})
                this.hideLoading();

                 if (res.code == 0&&res.data&&res.data.recordList.length>0) {
                    
                     const objStatus = { '-1': '待付款', '0': '问诊中', '1': '问诊中', '3': '已完成' };
                     var items = res.data.recordList.map((item, index) => {
                         item.statusName = objStatus[item.status];
                         return item;
                     });
                     // console.log('this.state=',this.state,items)
                     if(pageNum==1){
                        this.setState({ orderList: items});
                    }else{
                     this.setState({ orderList: this.state.orderList.concat(items),listPageNum:pageNum});
                    }
                 }else{
                  if(pageNum==1){
                    this.setState({ orderList: []});
                  }else{
                    if(this.state.orderList.length>0){
                      this.setState({listPageStus:true})
                    }
                  }
                 }
             }, e=> {
                 this.hideLoading();
                 this.setState({ orderList: []});
                 this.setState({
                     msg:e.msg,
                     showIOS1:true,
                     lock:false
                 })
             });
    }
  getList(id,registerPageNum=1){

   console.log('id=',id)
   if(this.state.listPatCardNo==''&&id==''){
       this.showLoading();
       Api
           .getRegisterList({userId:window.localStorage.userId,type:'subscribe',pageNum:registerPageNum})
           .then((res) => {
              this.setState({lock:false})
                this.hideLoading();
               if(res.code==0&&res.data&&res.data.recordList&&res.data.recordList.length>0){
                   // if(){
                  if(registerPageNum==1){
                     this.setState({
                         manageList:res.data.recordList
                     })
                  }else{
                    this.setState({
                         manageList:this.state.manageList.concat(res.data.recordList),
                         registerPageNum
                     })
                  }
                   // }
               }else{
                if(registerPageNum==1){
                    this.setState({
                      manageList:[]
                  })
                }else{
                  if(this.state.manageList.length>0){
                    this.setState({
                      jiahaoPageStus:true
                    })

                  }
                }
               }
           }, (e) => {
               this.hideLoading();
               this.setState({
                manageList:[],
                lock:false
            })
           });
   }else{
       this.showLoading();
       Api
           .getRegisterList({userId:window.localStorage.userId, orderCarNo:id||this.state.listPatCardNo,type:'subscribe',pageNum:registerPageNum})
           .then((res) => {
              this.hideLoading();
              this.setState({lock:false})
               // if(){
                   if(res.code==0&&res.data&&res.data.recordList&&res.data.recordList.length>0){
                      
                      if(registerPageNum==1){
                         this.setState({
                             manageList:res.data.recordList
                         })
                      }else{
                        this.setState({
                             manageList:this.state.manageList.concat(res.data.recordList),
                             registerPageNum
                         })
                      }
                   }else{
                    if(registerPageNum==1){
                        this.setState({
                          manageList:[]
                      })
                    }else{
                      if(this.state.manageList.length>0){
                        this.setState({
                          jiahaoPageStus:true
                        })

                      }
                    }
                   }
               // }
           }, (e) => {
               this.hideLoading();
                this.setState({
                    manageList:[],
                    lock:false
                })
           });
   }
}
switchStatus(type,index){
   if(type=='全部'){
        this.setState({
            active111:true,
            registerPageNum:1,
            jiahaoPageStus:false
        })
       this.getList('',1);
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
           active111:false,
           registerPageNum:1,
           jiahaoPageStus:false,
           listPatCardNo:type
       })
       this.getList(type,1);
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
                // for (var i = 0; i < list.length; i++) {
                    this.getList('',1);
                // }
                this.setState({
                    userId:window.localStorage.userId,
                    list:list,
                    registerPageNum:1,
                    jiahaoPageStus:false
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
                item5Show:false,
                lock:false,
                jiahaoPageStus:false,
                listPageStus:false,
            })
            }
            if(type==2){
                
                this.getAddCardList();
                this.setState({
                    item2Show:true,
                    item1Show:false,
                    item3Show:false,
                    item4Show:false,
                    item5Show:false,
                    lock:false,
                    listPageStus:false,
                    jiahaoPageStus:false
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
                    item5Show:false,
                    lock:false,
                    listPageStus:false,
                    jiahaoPageStus:false

                })
            }
            if(type==4){
            this.getmdtList();
                this.setState({
                    item2Show:false,
                    clickItem:555,
                    item1Show:false,
                    item3Show:false,
                    item4Show:true,
                    item5Show:false,
                    lock:false,
                    listPageStus:false,
                    jiahaoPageStus:false
                })

            }
            if(type==5){
                this.getdescribeList(this.state.describePage);
                this.setState({
                    item2Show:false,
                    clickItem:555,
                    item1Show:false,
                    item3Show:false,
                    item4Show:false,
                    item5Show:true,
                    lock:false,
                    listPageStus:false,
                    jiahaoPageStus:false
                    // describePage:1
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
    // 诊断处理
    chuliDiagnosis=(diagnosis)=>{
      let diagnosisArr = diagnosis?diagnosis.split(";"):[];
      let content = "";
      if(diagnosisArr.length>0){
        for (let i=0;i<diagnosisArr.length;i++) {
            content += ((i+1)+'.');
            let diagnosisInfo = diagnosisArr[i].split("|");
            if (diagnosisInfo[0] != "无") {
                content += diagnosisInfo[0]+' ' ;
            }
            if(diagnosisInfo[1]){
              content += diagnosisInfo[1];
            }
            if (diagnosisInfo[2]&&diagnosisInfo[2] != "无") {
                content += (' '+diagnosisInfo[2]);
            }
            content += ";";
        }
      }
      return content
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
              }}>问诊
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
                {this.state.jiahaoPageStus&&<div className="no-des displaytextcenter">
                            <img src='./././resources/images/mygddl.png'/>     
                            <p>没有更多的了</p>
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
                                 clickItem:555,
                                })}}
                        >全部就诊人</li>
                    {patList&&patList.map((item,index)=>{
                        return(
                            <li
                                key={index}
                                onClick={()=>{
                                this.setState({
                                 clickItem:index,
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
            {this.state.listPageStus&&<div className="no-des displaytextcenter">
                            <img src='./././resources/images/mygddl.png'/>     
                            <p>没有更多的了</p>
                </div>}
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
            {this.state.maxPage==this.state.searchPage&&checkList.length > 0&&<div className="no-des">
                            <img src='./././resources/images/mygddl.png'/>     
                            <p>没有更多的了</p>
                </div>}
            </div>
        }

        {item3Show&&<div className="loadMore" ref="wrapper"  ></div>}
        {item4Show&&
            <div className='reportlist'>
               {mdtList&&mdtList!='1'&&mdtList.length>0&&mdtList.map((item,index)=>{
                        return(
                            <div className="describe-item" key={index} onClick={()=>{
                                // if(item.status!=='1'){
                                    this.context.router.push({
                                        pathname:'ordermng/mdtdetail', 
                                        query:{id:item.id}
                                    }) 
                                // }
                            }}>
                               <div className="des-basic" 
                            //    style={item.status=='1'?{border:'none'}:{}}
                               >
                                    <div className="des">
                                        <p className="left">就诊人：<span>{item.patientName}</span></p>
                                        {/* <p className={`right ${item.status=='1'||item.status=='2'?'dai':item.status=='0'||item.status=='3'||item.status=='4'?'on':''}`}>{item.status=='1'?item.auditName:item.status=='5'?item.reportName:item.statusName}</p> */}
                                        <p className={`right ${item.status=='13'||item.status=='10'||item.status=='9'||item.status=='1'||item.status=='2'?'dai':
                                                            item.status=='3'||item.status=='4'||item.status=='5'||item.status=='7'||item.status=='0'?'on'
                                                            :item.status=='8'||item.status=='13'||item.status=='6'?'no':''}`}>
                                            {item.status=='1'?'待审核':
                                            item.status=='2'?'待缴费':
                                            item.status=='3'||item.status=='4'||item.status=='5'||item.status=='7'||item.status=='0'?'缴费成功':
                                            item.status=='6'?'申请审核未通过':
                                            item.status=='8'?'已取消':
                                            item.status=='9'?'缴费失败':
                                            item.status=='10'?'缴费异常':
                                            item.status=='13'?'超时自动取消':''
                                            }
                                        </p>
                                    </div>
                                    <div className="des">
                                        <p className="left">会诊名称：<span>{item.teamName}</span></p>
                                    </div>
                                    <div className="des">
                                      <p className="left">申请时间：<span>{item.applyTimeName}</span></p>
                                    </div>
                                </div>
                                {/* {item.status!=='1'&&<div className="des-detail"> */}
                                <div className="des-detail">
                                   查看详情
                                   <img src='./././resources/images/des_xyjt.png'/> 
                                </div>
                            </div>
                        )
               })}
               {<div className="no-des">
                       <img src='./././resources/images/mygddl.png'/>     
                       <p>没有更多的了</p>
             </div>}
            {/* checkList.length <= 0&&checkList!='1'&&<NoResult  msg='暂未查询到相关信息'/> */}
            </div>
        }
        {item5Show&&!!describeList&&describeList.length>0&&describeList!='1'&&
            <div className='reportlist'>
            {describeList.map((item,index)=>{
                // const diagnosis = item.diagnosis.split('|').length>2?item.diagnosis.split('|').splice(0,item.diagnosis.split('|').length-1).join('|') :item.diagnosis
                let  diagnosis = this.chuliDiagnosis(item.diagnosis)
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
                                <p className="right">{!!item.prescDate?item.prescDate:item.submitPrescDate}</p>
                            </div>
                            <div className="des">
                                <p className="left">就诊科室：<span>{item.deptName}</span></p>
                                <p className="right status">{item.statusName}</p>
                            </div> 
                            <div className="des">
                              <p className="left">诊断：<span>{diagnosis}</span></p>
                            
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
            {item5Show&&<div className="loadMore" ref="wrapper"  ></div>}

            {this.state.describePage>=this.state.maxPage1&&<div className="no-des">
                       <img src='./././resources/images/mygddl.png'/>     
                       <p>没有更多了</p>
             </div>}
            {/* checkList.length <= 0&&checkList!='1'&&<NoResult  msg='暂未查询到相关信息'/> */}
            </div>
        }
        
    </div>
    );
  }
}
export default Connect()(Widget);