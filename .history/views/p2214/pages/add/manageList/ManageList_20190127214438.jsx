import React, { Component } from 'react';
import { Link } from 'react-router';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';

import * as Api from './manageListApi';
import 'style/index.scss';

class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
  constructor(props) {
    super(props);
    this.state = {
        isSure:false,
        manageList:[],
        list:[],
        isLoad:true,
        active111:true,
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
    };
  }

  componentDidMount() {
      this.getCardList();

  }
    showToast() {
        this.setState({showToast: true});

        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
    }
    getCardList() {
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
  render() {
    const {manageList,list,active111}=this.state;
    return (
        <div className="page-add-confirmlist">
            <div className="container">
                <div className="personInfo">
                    <div
                        onClick={()=>{
                       this.switchStatus('全部',111)
                        }}
                    >
                        <p className={`${active111?'active':''}`}>全部</p>
                    </div>
                        {list&&list.map((item,index)=>{
                            return(
                                <div  key={index} onClick={()=>{this.switchStatus(item.patientId,index)}}>
                                    <p className={`${item.active?'active':''}`}>
                                        {item.patientName}
                                    </p>
                                </div>
                                )
                            })}

                </div>
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
                                   <div>{item.hisName}  {item.deptName}</div>
                                   <div className="registerTime">预约时间：{item.orderDate} {item.times=='上午'?'11:00-11:30':item.hospitalDistrict=='礼嘉分院'?'15:30-16:00':'17:00-17:30'}</div>
                               </div>
                               {info.orederStatus=='1'&&info.isPay=='1'&&info.isVisit=='0'&&<div  className="status"> <p>待就诊</p></div>}
                               {info.orederStatus=='1'&&info.isPay=='0'&&info.isVisit=='0'&&<div   className="status"><p>待付款</p></div>}
                               {info.orederStatus=='1'&&info.isPay=='1'&&info.isVisit=='2'&&<div  className="status"> <p  className="disNo"  >已过期</p></div>}
                               {info.orederStatus=='1'&&info.isPay=='1'&&info.isVisit=='3'&&<div  className="status"><p className="disNo"  >已退号</p></div>}
                               {info.orederStatus=='1'&&info.isPay=='1'&&info.isVisit=='1'&&<div className="status"> <p className="disNo">已就诊</p></div>}
                               {info.orederStatus=='3'&&info.isPay=='2'&&info.isVisit=='0'&&<div className="status"> <p className="disNo">加号失败</p></div>}
                               {info.orederStatus=='2'&&info.isPay=='0'&&info.isVisit=='0'&&<div className="status"> <p className="disNo">已超时</p></div>}
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
        </div>
    );
  }
}

export default Connect()(Widget);
