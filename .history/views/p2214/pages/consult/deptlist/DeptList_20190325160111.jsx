import React, { Component } from 'react';
import { Link } from 'react-router';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import ReactPullToRefresh  from 'react-pull-to-refresh';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import * as Api from './deptListApi';
import 'style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
            deptName: '筛选科室',
            deptList: [],
            isFunnel: true,
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
            msg: '',
            searchFocus: false,
            searchValue: '',
            docList: [],
            doctorShow: false,
            searchDoctorList: [],
            deptId: '',
            search1: false,
            searchShow: true,
            searchPage:1,//查询页
            searchList: [],
            maxinquiryPage:'',//总页数
            maxsearchPage:'',//
            data: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
            isLoadingMore: false,
            inquiryPage:1,
            scrollTop:'',
            current:'',
            cur:'',
            has:false,
            incur:'',
            incurrent:'',
            currentiInquiry:'',
            canAdd:false,//可以加载
           
        };
    }
     callback() {
        const wrapper = this.refs.wrapper;
        const loadMoreDataFn = this.loadMoreDataFn;
        const top = wrapper?wrapper.getBoundingClientRect().top:0;
        const windowHeight = window.screen.height;
        const that = this; // 为解决不同context的问题
        if (top && top < windowHeight) {
            // 当 wrapper 已经被滚动到页面可视范围之内触发
            console.log("window"+top+"kk  "+windowHeight)
            that.loadMoreDataFn();
        }
    }
    
    componentDidMount(){
        const that = this; // 为解决不同context的问题
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
      
         this.getJs();
        if(window.localStorage.deptShow=='2'&&window.localStorage.deptListStatus){
            var deptListStatus=JSON.parse(window.localStorage.deptListStatus);
            this.setState({
                msg: deptListStatus.msg,
                searchFocus:  deptListStatus.searchFocus,
                searchValue:  deptListStatus.searchValue,
                docList: deptListStatus.docList,
                doctorShow: deptListStatus.doctorShow,
                searchDoctorList:  deptListStatus.searchDoctorList,
                deptId: deptListStatus.deptId,
                search1: deptListStatus.search1,
                searchShow: deptListStatus.searchShow,
                searchPage: deptListStatus.searchPage,//查询页
                searchList: deptListStatus.searchList,
                maxinquiryPage: deptListStatus.maxinquiryPage,//总页数
                maxsearchPage: deptListStatus.maxsearchPage,//
                data: deptListStatus.data,
                isLoadingMore: deptListStatus.isLoadingMore,
                inquiryPage: deptListStatus.inquiryPage,
                scrollTop: deptListStatus.scrollTop,
                current: deptListStatus.current,
                cur: deptListStatus.cur,
                has: deptListStatus.has,
                incur: deptListStatus.incurrent,
                incurrent: deptListStatus.incurrent,
                currentiInquiry: deptListStatus.currentiInquiry,
                canAdd: deptListStatus.canAdd,//可以加载

            })
            console.log('height',window.localStorage.scrollY,window.localStorage.scrollX)
            window.scrollTo(window.localStorage.scrollX,window.localStorage.scrollY);
          
        }else{
            window.localStorage.deptShow='1';
            var type = this.props.location.query.type || '';
            if (type == 1) {
                this.selectDept('全部科室', '',this.state.searchPage);
            } else {
                this.setState({
                    deptId:this.props.location.query.deptId
                })
                console.log(this.state.deptId,this.props.location.query.deptId)
                this.selectDept(this.props.location.query.deptName, this.props.location.query.deptId,this.state.searchPage)
            }
        }

        
        
       
    }
    
    componentWillUnmount(){
        if(this.state.has){
            window.localStorage.login_access_token=window.localStorage.login_access_token1;
        }
        window.localStorage.deptListStatus=JSON.stringify(this.state);
        
    }
    loadMoreDataFn() { 
         if(this.state.searchValue!=''&&this.state.search1){
            console.log("this.state.inquiryPage",this.state.inquiryPage,this.state.maxinquiryPage)
            
             if(this.state.inquiryPage<=this.state.maxinquiryPage){
               // alert(this.state.currentiInquiry+"-----"+this.state.inquiryPage)
                if(this.state.currentiInquiry!=this.state.inquiryPage){
                    this.search(this.state.searchValue,this.state.deptId,this.state.inquiryPage);
                }
             }

         }else{  
             console.log("seaerchmax",this.state.searchPage,this.state.maxsearchPage)
             if(this.state.searchPage<=this.state.maxsearchPage){
               // alert(this.state.current+"-----"+this.state.searchPage)
                 if(this.state.current!=this.state.searchPage){
                    this.selectDept(this.props.location.query.deptName, this.state.deptId,this.state.searchPage)

                 }
              //   var cur=this.state.current;
               //  this.setState({
              //       cur:cur
              //   })
                
                 
            }
         }
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
  
    getDeptList() { 
        Api
            .getDeptList()
            .then((res) => {
                if (res.code == 0 && res.data != null) {
                    this.setState({
                        deptList: res.data || [],
                    })
                }
            }, (e) => {
                this.setState({
                    msg: e.msg||'系统错误',
                    showIOS1: true
                })
            });

    }
    /*查询科室*/
    selectDept(deptName, deptId,page) {
        
        this.setState({
            isFunnel: false,
            deptName: deptName,
            searchDoctorList:[],
            searchList:[],
            deptId:deptId
        })
        this.getDocList(deptId,page);
        this.setState({
            searchFocus: false,
           
        })
    }
    /*获取医生列表*/
    getDocList(deptId = '',page) {
        if(page==1){
            this.setState({
                docList:[],
                searchPage:1
            })
        } 
        this.setState({
            deptId:deptId,          
            current:page,
            
        })
            console.log("eee",this.state.docList,page)
            this.showLoading();
         
            Api
                .getInfo({numPerPage:10, deptId, vagueName: '',pageNum:page})
                .then((res) => {
                    this.hideLoading();
                     
                    if (res.code == 0 && res.data != null) {
                        console.log("aaa",page)
                        var currentPage=page+1; 
                        this.setState({
                         
                            current:page,
                            
                        })
                       // if(page<=res.data.pageCount){
                        //     currentPage++;
                       // }
                        if(currentPage>res.data.pageCount){
                            this.setState({
                                canAdd:false
                            })
                        }else{
                            this.setState({
                                canAdd:true
                            })
                        }
                        console.log("pages",res.data.currentPage,currentPage)
                        //if(res.data.currentPage==1&&currentPage-1!=1){
                         //   location.reload();
                          //  this.setState({
                          //      searchPage:1
                          //  })
                       // }
                        console.log("current",currentPage,this.state.docList);
                        if(res.data.sessionId.length>0&&!window.localStorage.login_access_token){
                            this.setState({
                                has:true
                            })
                            window.localStorage.login_access_token=res.data.sessionId;
                        }
                       if(this.state.searchPage==1){

                        this.setState({
                            docList:this.state.docList.concat(res.data.doctors) || [],
                            search1: false,
                            isDefaultImg: true,
                            doctorShow: true,
                            current:page,
                            searchPage:currentPage,
                            maxsearchPage:res.data.pageCount
                        })
                       }else{
                        this.setState({
                            docList:this.state.docList.concat(res.data.doctors) || [],
                            isDefaultImg: true,
                            current:page,
                            searchPage:currentPage,
                            maxsearchPage:res.data.pageCount
                        })
                       }
                        
                    }
                }, (e) => {
                    this.hideLoading();
                    this.setState({
                        msg: e.msg||'系统错误',
                        showIOS1: true
                    })
                });
        
        
    }
   /*获取焦点事件*/
    bindSearchInput() {

        this.setState({
            searchValue: this.state.searchValue,
            search1: true,
            
        })
      
        if (this.state.searchValue != '') {
            this.setState({
                search1: true,
                inquiryPage:1,
            })
        } else {
            this.setState({
                search1: true,
            })
        }
        if (!this.state.searchValue) {
            this.setState({
                searchList: [],
                searchDoctorList: []
            })
        }
        console.log("bibnd",this.state.inquiryPage)

// 获取搜索结果
        clearTimeout(this.searchTimer || '');
        this.searchTimer = setTimeout(() => {
            this.search(this.state.searchValue,this.state.deptId,1);
        }, 200);
    }
   /*搜索*/
    search(value,deptId,page) {
        this.setState({
            currentiInquiry:page,
        })
         if(this.state.inquiryPage==1){
             this.setState({
                 searchList:[]
             })
         }
         this.showLoading();
         console.log("yyy",this.state.inquiryPage,deptId,this.state.incurrent)
            Api
            .getInfo({numPerPage:10,deptId:deptId||'', vagueName:value,pageNum:page })
            .then((res) => {
                if (res.code == 0 && res.data != null) {
                     this.hideLoading();
                    var  currentPage=page+1;
                   // if(this.state.inquiryPage<=res.data.pageCount){
                       // currentPage++;

                   //}
                   this.setState({
                    currentiInquiry:page,
                })
                  
                   if(currentPage>res.data.pageCount){
                    this.setState({
                        canAdd:false
                    })
                }else{
                    this.setState({
                        canAdd:true
                    })
                }
              //  if(res.data.currentPage==1&&this.state.inquiryPage!=1){
                   // location.reload();
                   // this.setState({
                        searchPage:1
                  //  })
               // }
                   console.log("state",this.state.inquiryPage,currentPage)
                    this.setState({
                        inquiryPage:currentPage,
                        maxinquiryPage:res.data.pageCount,
                        currentiInquiry:page,
                        searchList: this.state.searchList.concat(res.data.doctors) || [],
                    })
                    if(res.data.sessionId.length>0&&!window.localStorage.login_access_token){
                        this.setState({
                            has:true
                        })
                        window.localStorage.login_access_token=res.data.sessionId;
                    }
                    
                }
            }, (e) => {
                this.hideLoading();
                this.setState({
                    msg: e.msg||'系统错误',
                    showIOS1: true
                })
            });  
             
       
        Api
            .getDeptList({numPerPage: 10, searchName: !!value ? value : ' '})
            .then((res) => {
                if (res.code == 0 && res.data != null) {
                    this.setState({
                        searchDoctorList: res.data || []
                    })
                }
            }, (e) => {
                this.setState({
                    msg: e.msg||'系统错误',
                    showIOS1: true
                })
            });
        if (value !== '') {
            this.setState({
                search1: true,
            })
        } else {
            this.setState({
                search1: false,
            })
        }
    }

    bindSearchFocus(e) {
        this.setState({
            searchFocus: true,
        })
        console.log("search000000",this.state.inquiryPage)

        if (e.detail.value != '') {
            this.setState({
                search1: true,
                inquiryPage:1,
            })
        } else {
            this.setState({
                search1: false,
            })
        }
    }

    getValue(e) {
        this.setState({
            searchValue: e.target.value,
           
        })
        console.log("search1",this.state.inquiryPage)
        if (e.target.value!= '') {
            this.setState({
                search1: true,
                inquiryPage:1,
            })
        } else {
            this.setState({
                search1: true,
            })
        }
        if (!this.state.searchValue) {
            this.setState({
                searchList: [],
                searchDoctorList: []
            })
        }
       
// 获取搜索结果
        clearTimeout(this.searchTimer || '');
        if(e.keyCode!==13){
          //  alert("1")
           // alert("event"+event.keyCode);
            this.searchTimer = setTimeout(() => {
                this.search(this.state.searchValue,this.state.deptId,1);
            }, 200);
        }
    

    }

    render() {
        const {msg,docList,canAdd,searchValue,searchList,search1,searchDoctorList,doctorShow}=this.state;
      
        return (
            <div className='dept'>
                <div className="home"><span className="jian"
                                            onClick={()=>{
                                            if(this.props.location.query.source==1){
                                            this.context.router.push({
                                              pathname:'consult/alldeptlist'
                                            })
                                            } else
                                            {
                                            this.context.router.push({
                                              pathname:'home/index'
                                            })
                                            }


                                      }}
                    ></span>找专家咨询
                </div>

            <div className="allSearch">

                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons}
                        show={this.state.showIOS1}>
                    {msg}
                </Dialog>
                <div className="m-search active">
                    <div className="search-ipt">
                        <div className="ipt-icon">
                            <img src="../../../resources/images/search.png"/>
                        </div>
                        <form action="/" method="post" onSubmit={
                                (e) => {
                                e.preventDefault();
                                this.bindSearchInput();
                                }
                                }
                            >
                            <input className="ipt"
                                   value={searchValue}
                                   placeholder="点击搜索科室/医生"
                                   onFocus={(e)=>{
                                            this.bindSearchFocus(e)

                                            }}
                                   onChange={(e)=>{
                                            this.getValue(e)

                                            }}
                                  
                                />
                        </form>
                    </div>
                </div>
                <div className="page-dept-list">
                    {search1 &&
                    <div className="m-search-content">
                        {searchList.length <= 0 && searchDoctorList.length <= 0 &&
                        <div className="wgt-empty-box">
                            <img className="wgt-empty-img" src="../../../resources/images/no-result.png" alt=""></img>

                            <div className="wgt-empty-txt">暂未查询到相关信息
                            </div>
                        </div>}
                        {(searchList.length >= 0 || searchDoctorList.length >= 0) &&
                        <div className="search-content">
                            {searchDoctorList.length > 0 &&
                            <div className="content">
                                {searchDoctorList.length > 0 &&
                                <div className="title2">科室
                                </div>}
                                {searchDoctorList.length > 0 && searchDoctorList.map((item, index)=> {
                                    return (
                                        <div className="title1"
                                             key={index}
                                             onClick={()=>{
                                                    this.getDocList(item.no,1);
                                                    this.setState({
                                                        search1:false,
                                                        doctorShow:true,
                                                        searchFocus:false,
                                                    })
                                                    }}
                                            >{item.name}</div>
                                    )
                                })}
                            </div>}
                            <div className="space"></div>
                            {searchList.length > 0 && <div className="title2">
                                医生
                            </div>}
                            {searchList.map((item1, index1)=> {
                                return (
                                    <div 
                                     onClick={()=>{
                                        window.localStorage.deptShow='2'; 
                                        window.localStorage.scrollY=window.scrollY;
                                        window.localStorage.scrollX=window.scrollX;
                                        this.context.router.push({
                                            pathname:'/consult/deptdetail',
                                            query:{doctorId:item1.doctorId,deptId:item1.deptId,resource:2}

                                         })
                                     }}
                                   
                                          key={index1}
                                          className='doc-item'>
                                        <div className="doc-info">
                                            <div className='docImg'>
                                                <img className="doc-img"  alt="医生头像" src={item1.image!=null&&item1.image.indexOf("ihoss")=='-1'?item1.image:item1.image+"?x-oss-process=image/resize,w_105"} />
                                            </div>
                                            <div className="text-box">
                                                <div className="doc-item1">
                                                    <div className='doc-name'>{item1.name}
                                                    </div>
                                                    {item1.replyLabel=='1'&&<div className='speed'>
                                                      回答快
                                                    </div>}
                                                    {/* item1.evaluationLabel=='1'&&<div className='appraise'>
                                                        评价高
                                                    </div> */}
                                                    <div className='rate'>好评率：<span>{/* item1.favoriteRate */ }98%</span></div>
                                                </div>
                                                <div className='doc-des2'>{item1.deptName}  {item1.level}</div>
                                                <div
                                                    className='doc-des ellipsis'>{item1.specialty ? item1.specialty : '暂无描述'}</div>
                                                <div className='pinfen'>
                                                    <span>咨询人数：{item1.serviceTimes}</span>平均回复时长:  {item1.replyTime}</div>
                                               <div>
                                               </div>
                                                <div className='oper-box'>
                                                    {item1.inquirys.map((item2, index2)=> {
                                                        return (
                                                            <div key={index2}
                                                                 className={`${item2.type!=='1'?'disNo':'flex22'} ${item2.isFull != '1' &&item2.type=='1'&&item2.isOnDuty == '1'?'status-item1':'grey-item1'}`}>
                                                                {item2.isFull =='1' &&item2.type=='1'&& item2.isOnDuty=='1'&&
                                                                <div>图文咨询(满)</div>}
                                                                {item2.isFull != '1' &&item2.type=='1'&& item2.isOnDuty == '1' &&
                                                                <div>图文咨询</div>}
                                                                {item2.type=='1'&& item2.isOnDuty == '0' &&
                                                                <div>图文咨询(离)</div>}
                                                            </div>
                                                        )
                                                    })
                                                    }
                                                    <div className='grey-item1'>电话咨询<p>(待上线)</p></div>
                                                    <div className='grey-item1' style={{marginRight:'0'}}>视频咨询<p>(待上线)</p></div>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                )
                            }
                            )
                            }
                    </div>}
                </div>
                }
                {doctorShow && !search1 &&
                <div className="m-search-content">
                    {docList.length <= 0 && <div className='no-data'>
                        <img src='../../../resources/images/no-result.png'/>

                        <div>暂未查询到相关信息</div>
                    </div>}
                    {docList.length > 0 && docList.map((item, index)=> {
                            return (
                                <div 
                                onClick={()=>{
                                    window.localStorage.deptShow='2'; 
                                    window.localStorage.scrollY=window.scrollY;
                                    window.localStorage.scrollX=window.scrollX;
                                    this.context.router.push({
                                       pathname:'/consult/deptdetail',
                                       query:{doctorId:item.doctorId,deptId:item.deptId,resource:2}

                                    })
                                }}
                               
                                      key={index}
                                      className='doc-item'>
                                    <div className="doc-info">
                                        <div className='docImg'>
                                            <img className="doc-img" src={item.image&&item.image.indexOf("ihoss")=='-1'?item.image:item.image+"?x-oss-process=image/resize,w_105"}  alt="医生头像"/>
                                        </div>


                                        <div className="text-box">
                                            <div className="doc-item1">
                                                <div className='doc-name'>{item.name}
                                                </div>
                                                {item.replyLabel=='1'&&<div className='speed'>
                                                    回答快
                                                </div>}
                                                {/* item.evaluationLabel=='1'&&<div className='appraise'>
                                                    评价高
                                                </div> */}
                                                <div className='rate'>好评率：<span>{/* item.favoriteRate */}98%</span></div>
                                            </div>
                                            <div className='doc-des2'>{item.deptName}  {item.level}</div>
                                            <div
                                                className='doc-des ellipsis'>{item.specialty ? item.specialty : '暂无描述'}</div>
                                            <div className='pinfen'>
                                                <span>咨询人数：{item.serviceTimes}</span>平均回复时长:  {item.replyTime}</div>
                                            <div>
                                            </div>
                                            <div className='oper-box'>
                                                {item.inquirys.map((item1, index1)=> {
                                                    return (
                                                        <div key={index1}
                                                             className={`${item1.type!=='1'?'disNo':'flex22'} ${item1.isFull != '1' &&item1.type=='1'&&item1.isOnDuty == '1'?'status-item1':'grey-item1'}`}>
                                                             {item1.isFull =='1' &&item1.type=='1'&& item1.isOnDuty=='1'&&
                                                             <div>图文咨询(满)</div>}
                                                             {item1.isFull != '1' &&item1.type=='1'&& item1.isOnDuty == '1' &&
                                                             <div>图文咨询</div>}
                                                             {item1.type=='1'&& item1.isOnDuty == '0' &&
                                                             <div>图文咨询(离)</div>}
                                                        </div>
                                                    )
                                                })
                                                }
                                                <div className='grey-item1'>电话咨询<p>(待上线)</p></div>
                                                <div className='grey-item1' style={{marginRight:'0'}}>视频咨询<p>(待上线)</p></div>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            )
                        }
                    )}
                </div>
                }
            </div>
            
        {canAdd&&<div className="loadMore" ref="wrapper"  ></div>}
            </div>
            </div>
        );
    }
}

export default Connect()(Widget);
