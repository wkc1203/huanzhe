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
        };
    }
    componentDidMount() {
        this.getDocList();
        this.getDeptList();
        this.getJs();
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
    getDocList(deptId = '') {
        Api
            .getInfo({numPerPage: 100, deptId,vagueName: ''})
            .then((res) => {
                if (res.code == 0 && res.data != null) {
                    this.setState({
                        docList: res.data.doctors || [],
                        search1: false,
                        isDefaultImg: true,
                        doctorShow: true
                    })
                }

            }, (e) => {
                this.showPopup({content: e.msg});
            });
    }
    /*获取输入文本*/
    bindSearchInput() {
        this.setState({
            searchValue: this.state.searchValue,
            search1: true,
        })
        if (this.state.searchValue != '') {
            this.setState({
                search1: true,
            })
        } else {
            this.setState({
                search1: true,
            })
        }
        console.log(this.state.search1 + "d1");
        if (!this.state.searchValue) {
            this.setState({
                searchList: [],
                searchDoctorList: []
            })
        }
// 获取搜索结果
        clearTimeout(this.searchTimer || '');
        this.searchTimer = setTimeout(() => {
            this.search(this.state.searchValue);
        }, 200);
    }
    /*搜索*/
    search(value) {
        if(this.state.inquiryPage==1){
            this.setState({
                searchList:[]
            })
        }
       Api
           .getInfo({numPerPage: 10, vagueName:value,pageNum:this.state.inquiryPage })
           .then((res) => {
               if (res.code == 0 && res.data != null) {
                   var  currentPage=this.state.inquiryPage;
                   if(this.state.inquiryPage<=res.data.pageCount){
                       currentPage++;
                  }
                 
                  if(currentPage>res.data.pageCount){
                   this.setState({
                       canAdd:false
                   })
               }else{
                   this.setState({
                       canAdd:true
                   })
               }
                  console.log("state",this.state.inquiryPage,currentPage)
                   this.setState({
                       inquiryPage:currentPage,
                       maxinquiryPage:res.data.pageCount,
                       searchList: this.state.searchList.concat(res.data.doctors) || [],
                   })
               }
           }, (e) => {
               this.setState({
                   msg: e.msg,
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
                   msg: e.msg,
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
    /*监控输入文本*/
    getValue(e) {
        this.setState({
            searchValue: e.target.value,
           
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

// 获取搜索结果
        clearTimeout(this.searchTimer || '');
        this.searchTimer = setTimeout(() => {
            this.search(this.state.searchValue);
        }, 200);

    }

    render() {
        const {deptList,isFunnel,canAdd,searchValue,searchList,search1,searchDoctorList}=this.state;
        console.log("ss",searchList)
        return (
            <div className='alldept'>
                <div className="home"><span className="jian"
                                            onClick={()=>{
                                      this.context.router.push({
                                      pathname:'home/index'
                                      })
                                      }}
                    ></span>
                    找专家咨询
                </div>

            <div className="allSearch">

                <div className="m-search active">
                    <div className="search-ipt">
                        <div className="ipt-icon">
                            <img src="../../../resources/images/search.png"/>
                        </div>
                        <form action="/" method="post" onSubmit={
                            (e) => {
                            e.preventDefault();
                            this.bindSearchInput();
                            }}
                            >
                            <input className="ipt"
                                   value={searchValue}
                                   placeholder="点击搜索科室/医生"
                                   type="search"
                                   onFocus={(e)=>{
                                        this.bindSearchFocus(e)
                                        }}
                                   onChange={(e)=>{
                                        this.getValue(e)
                                        }}
                                   onKeyPress={(e)=>{
                                        this.bindSearchInput(e)
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
                            {(searchDoctorList.length > 0||searchList.length >0) &&
                            <div className="content">
                                {searchDoctorList.length > 0 &&
                                <div className="title2">科室
                                </div>}
                                {searchDoctorList.length > 0 && searchDoctorList.map((item, index)=> {
                                    return (
                                        <Link className="title1"
                                              key={index}
                                              to={{
                                                    pathname:'/consult/deptlist',
                                                    query:{deptName:item.name,deptId:item.no,source:1}
                                                    }}
                                            >{item.name}</Link>
                                    )
                                })}
                                <div className="space"></div>
                                {searchList.length > 0 && <div className="title2">
                                    医生
                                </div>}
                                {searchList.map((item1, index1)=> {
                                        return (
                                            <Link to={{
                                            pathname:'/consult/deptdetail',
                                            query:{doctorId:item1.doctorId,deptId:item1.deptId,resource:2}

                                            }}
                                                  key={index1}
                                                  className='doc-item'>
                                                <div className="doc-info">
                                                    <div className='docImg'>
                                                        <img className="doc-img" src={item1.image!=null&&item1.image.indexOf("ihoss")=='-1'?item1.image:item1.image+"?x-oss-process=image/resize,w_105"} alt="医生头像"/>
                                                    </div>

                                                    <div className="text-box">
                                                        <div className="doc-item1">
                                                            <div className='doc-name'>{item1.name}
                                                            </div>
                                                            {item1.replyLabel=='1'&&<div className='speed'>
                                                                回答快
                                                            </div>}
                                                            {item1.evaluationLabel=='1'&&<div className='appraise'>
                                                                评价高
                                                            </div>}
                                                            <div className='rate'>好评率：<span>{item1.favoriteRate}</span></div>
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

                                            </Link>
                                        )
                                }
                                )
                                }
                        </div>
                        }
                    </div>}
                </div>
                }
                {isFunnel && !search1 && <div className="dept-modal">
                    <div className="modal-pop">
                        <div className="modal-his-list">
                            <div className="list-item">重医儿童医院</div>
                        </div>
                        <div className="modal-dept-list">
                            <Link className="list-item"
                                  to={{
                                    pathname:'/consult/deptlist',
                                    query:{deptName:'全部科室',deptId:'',source:1}
                                    }}
                                >全部科室</Link>
                            { deptList.map((item, index)=> {
                                return (
                                    <Link className="list-item"
                                          key={index}
                                          to={{
                                                pathname:'/consult/deptlist',
                                                query:{deptName:item.name,deptId:item.no,source:1}
                                                }}>{item.name} </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
                }
            </div>
            {canAdd&&<div className="loadMore" ref="wrapper"  style={{textAlign:'center'}}>加载更多</div>}

            </div>
            </div>
        );
    }
}
export default Connect()(Widget);
