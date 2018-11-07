import React, { Component } from 'react';
import { Link } from 'react-router';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';

import * as Api from './deptListApi';
import 'style/index.scss';

class Widget extends Component {
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
        msg:'',
        searchFocus: false,
        searchValue: '',
        docList: [],
        doctorShow:false,
        searchDoctorList:[],
        deptId: '',
        search1:false,
        searchShow:true,
        searchList: []
    };
  }

  componentDidMount() {
       var type=this.props.location.query.type||'';
      console.log("dsds",this.props.location.query.deptId);
      console.log("deptname",this.props.location.query.deptName)
       if(type==1){
         this.selectDept('全部科室','');
       }else{
           this.selectDept(this.props.location.query.deptName,this.props.location.query.deptId)
       }
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
        console.log(this.state);
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
                    msg:e.msg,
                    showIOS1:true
                })
            });

    }

selectDept(deptName,deptId){
     this.setState({
         isFunnel:false,
         deptName:deptName,
     })
    this.getDocList(deptId);
    this.setState({
        searchFocus:false,
        search1:true,
    })
}
getDocList(deptId = ''){
    Api
        .getDocList({numPerPage: 100, deptId, name: '' })
        .then((res) => {
            if (res.code == 0 && res.data != null) {
                this.setState({
                    docList: res.data.doctors || [],
                    search1:false,
                    isDefaultImg:true,
                    doctorShow:true
                })
            }

        }, (e) => {
            this.setState({
                msg:e.msg,
                showIOS1:true
            })
            
        });

}
    bindSearchInput() {

        this.setState({
            searchValue:this.state.searchValue,
            search1:true,
        })
        if(this.state.searchValue!=''){
            this.setState({
                search1:true,
            })
        }else{
            this.setState({
                search1:true,
            })
        }
        console.log(this.state.search1+"d1");
        if (!this.state.searchValue) {
            this.setState({
                searchList:[],
                searchDoctorList:[]
            })
        }

        // 获取搜索结果
        clearTimeout(this.searchTimer || '');
        this.searchTimer = setTimeout(() => {
            this.search(this.state.searchValue);
        }, 200);
    }
    search(value) {
        Api
            .getDocList({numPerPage: 100, name: value })
            .then((res) => {
                if (res.code == 0 && res.data != null) {
                    this.setState({
                        searchList: res.data.doctors || [],
                    })
                }
            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });
        Api
            .getDeptList({numPerPage: 100,searchName: !!value?value:' ' })
            .then((res) => {
                if (res.code == 0 && res.data != null) {

                    this.setState({
                        searchDoctorList: res.data || [],

                    })
                }

            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });
        if(value!=='')
        {
            this.setState({
                search1:true,
            })
            console.log(this.search1+"search5");
        }else{
            this.setState({
                search1:false,
            })
            console.log(this.search1+"search6");
        }
    }
    bindSearchFocus(e) {
        this.setState({
            searchFocus:true,
        })
        if(e.detail.value!=''){
            this.setState({
                search1:true,
            })
        }else{
            this.setState({
                search1:false,
            })
        }
        console.log(this.state.search1+"d");
    }
    getValue(e){
        console.log(e.target.value);
        this.setState({
            searchValue:e.target.value
        })

        if(this.state.searchValue!=''){
            this.setState({
                search1:true,
            })
        }else{
            this.setState({
                search1:true,
            })
        }
        console.log(this.state.search1+"d1");
        if (!this.state.searchValue) {
            this.setState({
                searchList:[],
                searchDoctorList:[]
            })
        }

        // 获取搜索结果
        clearTimeout(this.searchTimer || '');
        this.searchTimer = setTimeout(() => {
            this.search(this.state.searchValue);
        }, 200);

    }

  render() {
      const {deptList,isFunnel,msg,docList,searchValue,searchList,searchShow,search1,deptId,searchDoctorList,doctorShow,searchFocus}=this.state;
      console.log("search1",isFunnel);
      console.log("searchList",searchList);
      console.log("searchDoctorList",searchDoctorList);
      return (
        <div className="allSearch">
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
    <div className="m-search active" >
        <div className="search-ipt">
            <div className="ipt-icon">
                <img src="../../../resources/images/search.png" />
            </div>
            <form  action="/" method="post" onSubmit={
                                  (e) => {
                                    e.preventDefault();
                                    this.bindSearchInput();
                                  }
                                }
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
        {search1&&
        <div className="m-search-content" >
            {searchList.length <= 0&&searchDoctorList.length<=0&&
            <div className="wgt-empty-box">
                <img  className="wgt-empty-img" src="../../../resources/images/no-result.png" alt=""></img>
                <div className="wgt-empty-txt">暂未查询到相关信息
                </div>
            </div>}
            {(searchList.length >= 0||searchDoctorList.length>=0)&&
            <div className="search-content">
                {searchDoctorList.length>0&&
                <div className="content">
                    {searchDoctorList.length>0&&
                    <div className="title2">科室
                    </div>}
                    {searchDoctorList.length>0&&searchDoctorList.map((item,index)=>{
                        return(
                            <div className="title1"
                                 key={index}
                                 onClick={()=>{
                                                     this.selectDept(item.name,item.no)
                                                     }}
                                >{item.name}</div>
                        )
                    })}
                </div>}
                    <div className="space"></div>
                    {searchList.length>0&&<div className="title2">
                        医生
                    </div>}
                    {searchList.map((item1,index1)=>{
                        return(
                            <Link to={{
                                              pathname:'/consult/deptdetail',
                                              query:{doctorId:item1.doctorId,deptId:item1.deptId}

                                            }}
                                  key={index1}
                                  className='doc-item'>
                                <div className="doc-info">
                                    <img className="doc-img" src={item1.image} alt="医生头像" />
                                    <div className="text-box">
                                        <div className='doc-name'>{item1.name}
                                            {item1.inquirys.map((item2,index2)=>{
                                                return(
                                                    <div key={index2} className={`status-item1 ${item2.type=='1'?'':'disNo'}`}>
                                                        {item2.isFull == '1'&&
                                                        <div className="status-item">已满</div>}
                                                        {item2.isFull != '1' && item2.isOnDuty == '1'&&
                                                        <div className="status-active" >在线</div>}
                                                        {item2.isFull != '1' && item2.isOnDuty == '0'&&
                                                        <div className="status-item" >离线</div>}
                                                    </div>
                                                )
                                            })
                                            }
                                        </div>
                                        <div className='doc-des'>{item1.deptName}} | {item1.level}</div>
                                        <div className='pinfen'>
                                            <span>好评率：{item1.favoriteRate}</span>咨询人数：{item1.serviceTimes}</div>
                                        <div className='doc-des ellipsis'>{item1.specialty ? item1.specialty : '暂无描述'}</div>
                                    </div>

                                </div>
                                <div className='oper-box'>
                                    {item1.inquirys.map((item3,index3)=>{
                                        return(
                                            <div  key={index3}>
                                                { item3.type=='1'&&
                                                <text className={`${item3.isOnDuty == '0' ? 'f-color-gray' : ''}`}>
                                                    图文咨询
                                                </text>}
                                                {item3.isOnDuty == '1'&&item3.type=='1'&&<span className="fee-des" >
                                                                         ￥{(item3.remune/100).toFixed(2)}元/次
                                                                    </span>}
                                                {item3.isOnDuty == '0'&&item3.type=='1'&&<span className="f-color-gray" >
                                                                        ￥{(item3.remune/100).toFixed(2)}元/次

                                                                    </span>}
                                                {/*item3.type=='2'&&<div>
                                                 <span>|</span>
                                                 视频问诊<span className="fee-des"> ￥{(item3.remune/100).toFixed(2)}元/次 </span>
                                                 </div>*/}
                                                {item3.type=='3'&&<div>
                                                    <span>|</span>
                                                    电话问诊<span className="fee-des"> ￥{(item3.remune/100).toFixed(2)}元/次 </span>
                                                </div>}
                                            </div>
                                        )

                                    })
                                    }
                                </div>
                            </Link>
                        )
                    }
                    )


            }
        </div>}
    </div>
            }

            {doctorShow&&!search1&&
           <div className="m-search-content">
              {docList.length<=0&&<div className='no-data'>
                  <img src='../../../resources/images/no-result.png' />
                  <div>暂未查询到相关信息</div>
              </div>}
              {docList.length>0&&docList.map((item,index)=>{
                     return(
                     <Link key={index}  className='doc-item'
                            to={{
              pathname:'/consult/deptdetail',
              query:{doctorId:item.doctorId,deptId:item.deptId}
              }}>
                         <div className="doc-info">
                             <img className="doc-img" src={item.image} alt="医生头像" />
                             <div className="text-box1">
                                 <div className='doc-name'>{item.name}
                                     {item.inquirys.map((item1,index1)=>{
                                        return(
                                            <div key={index1} className={`status-item1 ${item1.type == '1'?'':'disNo'} `}>
                                                {item1.isFull=='1'&&item1.type == '1'&&<div className="status-item">已满</div>}
                                                {item1.isFull!= '1' && item1.isOnDuty == '1'&&item1.type == '1'&&<div className="status-active">在线</div>}
                                                {item1.isFull!= '1' && item1.isOnDuty == '0'&&item1.type == '1'&&<div className="status-item">离线</div>}
                                            </div>
                                            )
                                     })}
                                  </div>
                                 <div className='doc-des1'>{item.deptName} | {item.level}</div>
                                 <div className='pinfen'>
                                     <span>好评率：{item.favoriteRate}</span>咨询人数：{item.serviceTimes}</div>
                                 <div className='doc-des1 ellipsis'>{item.specialty ? item.specialty : '暂无描述'}</div>
                             </div>
                         </div>
                         <div className='oper-box'>
                             {item.inquirys.map((item1,index1)=>{
                                 return(
                                     <div key={index1}>
                                        {item1.type=='1'&&
                                        <text  className={`${item1.isOnDuty == '0' ? 'f-color-gray' : ''}`}>
                                            图文咨询</text>}
                                        {item1.isOnDuty == '1'&&item1.type=='1'&&<span className="fee-des">￥{(item1.remune/100).toFixed(2)}元/次 </span>}
                                        {item1.isOnDuty == '0'&&item1.type=='1'&&
                                        <span className="f-color-gray" >
                                            ￥{(item1.remune/100).toFixed(2)}元/次
                                        </span>}
                                         {item.type == '2'&&<div>
                                             <span>|</span>
                                             视频问诊
                                             <span className="fee-des">
                                                 ￥{(item1.remune/100).toFixed(2)}元/次
                                             </span>
                                         </div>
                                             }
                                         {item.type == '3'&&<div>
                                             <span>|</span>
                                             电话问诊<span className="fee-des">
                                         ￥{(item1.remune/100).toFixed(2)}元/次
                                         </span>
                                         </div>}
                                     </div>
                                 )

                             })
                                 }
                         </div>
                     </Link>
                     )

                  }
                  )}


            </div>
            }
        </div>
   </div>
    );
  }
}

export default Connect()(Widget);
