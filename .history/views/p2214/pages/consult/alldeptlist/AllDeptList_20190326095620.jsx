import React, { Component } from 'react';
import { Link } from 'react-router';
import hashHistory from 'react-router/lib/hashHistory';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import * as Api from './allDeptListApi';
import 'style/index.scss';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object
    };
    constructor(props) {
        super(props);
        this.state = {
            deptName: '筛选科室',
            deptList: [],
            isFunnel: true,
            searchFocus: false,
            searchValue: '',
            docList: [],
            doctorShow: false,
            searchList: [],
            searchDoctorList: [],
            deptId: '',
            search1: false,
            searchShow: true,
            current:'',
            cur:'',
            currentiInquiry:'',
            incur:'',
            incurrent:'',
            has:false,
            maxinquiryPage:'',//总页数
            maxsearchPage:'',//
            searchPage:1,//查询页
            inquiryPage:1
        };
    }
    componentDidMount() {
        window.localStorage.deptShow='1';
        if(window.localStorage.deptAllShow=='2'&&window.localStorage.deptAllListStatus){
            var deptAllListStatus=JSON.parse(window.localStorage.deptAllListStatus);
            this.setState({
                deptName:deptAllListStatus.deptName,
                deptList:deptAllListStatus.deptList,
                isFunnel: deptAllListStatus.isFunnel,
                searchFocus:deptAllListStatus.searchFocus,
                searchValue: deptAllListStatus.searchValue,
                docList: deptAllListStatus.docList,
                doctorShow: deptAllListStatus.doctorShow,
                searchList:deptAllListStatus.searchList,
                searchDoctorList:deptAllListStatus.searchDoctorList,
                deptId: deptAllListStatus.deptId,
                search1:deptAllListStatus.search1,
                searchShow: deptAllListStatus.searchShow,
                current:deptAllListStatus.current,
                cur:deptAllListStatus.cur,
                currentiInquiry:deptAllListStatus.currentiInquiry,
                incur:deptAllListStatus.incur,
                incurrent:deptAllListStatus.incurrent,
                has:deptAllListStatus.has,
                maxinquiryPage:deptAllListStatus.maxinquiryPage,//总页数
                maxsearchPage:deptAllListStatus.maxsearchPage,//
                searchPage:deptAllListStatus.searchPage,//查询页
                inquiryPage:deptAllListStatus.inquiryPage

            })
            console.log('height',window.localStorage.scrollYY,window.localStorage.scrollXX)
            window.scrollTo(window.localStorage.scrollXX,window.localStorage.scrollYY);
        }else{
            window.localStorage.deptAllShow='1';
            this.getDocList('',1);
            this.getDeptList();
        }
        const that = this; // 为解决不同context的问题
        let timeCount;
        this.sum('dept',1);
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
    }
    sum(code,type){
        Api
        .getSum({
            hisId:'2214',
            code:code,
            type:type
        })
        .then((res) => {

          
        }, (e) => {

        });
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
    /*获取科室列表*/
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
                this.showPopup({content: e.msg});
            });
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
    /*获取输入文本*/
    bindSearchInput() {
        alert("get");
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
    /*得到焦点*/
    bindSearchFocus(e) {
        alert("get")
        this.setState({
            searchFocus: true,
        })
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
    componentWillUnmount(){
        if(this.state.has){
            window.localStorage.login_access_token=window.localStorage.login_access_token1;
        }
        window.localStorage.deptAllListStatus=JSON.stringify(this.state);
        
    }
    /*监控输入文本*/
    getValue(e) {
        alert( e.target.value)
        this.setState({
            searchValue: e.target.value,
           
        })
        console.log("search",this.state.inquiryPage)
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
        console.log("search",this.state.inquiryPage)

// 获取搜索结果
        clearTimeout(this.searchTimer || '');
        if(e.keyCode!==13){
            this.searchTimer = setTimeout(() => {
                this.search(this.state.searchValue,this.state.deptId,1);
            }, 200);
        }
        

    }

    render() {
        const {deptList,isFunnel,canAdd,searchValue,searchList,search1,searchDoctorList}=this.state;
        console.log("ss",searchList)
        return (
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
           
        );
    }
}
export default Connect()(Widget);
