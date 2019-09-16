import React, { Component } from 'react';
import { Link } from 'react-router';
import { Upload } from 'antd';
import { Button, Toptips,Switch,Dialog,Toast,Icon } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { ImagePicker } from 'antd-mobile';
import * as Utils from '../../../utils/utils';
import { addressMap } from '../../../config/constant/constant';
import * as Api from '../../../components/Api/Api';
import hashHistory from 'react-router/lib/hashHistory';
import 'style/index.scss';
var imgArr1=[];
var uuList=[];
var nameList=[];
var maxLength=0;
var imgList=[];
var success=[];
var interval1='';
var upload=true;
var files = new Array();
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
            showToast: false,
            showLoading: false,
            toastTimer: null,
            loadingTimer: null,
            showIOS1: false,
            showIOS2: false,
            showIOS3:false,
            showAndroid1: false,
            showAndroid2: false,
            style1: {
                buttons: [
                    {
                        label: '确定',
                        onClick: Utils.hideDialog.bind(this)
                    }
                ]
            },
            style3: {
                title: '温馨提示',
                buttons: [
                    {
                        label: '确定',
                        onClick:  Utils.hideDialog.bind(this)
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
            mdtList:[]

        };
    }
    componentDidMount(){
        this.getList();
    }
    /* 查询团队列表 */
    getList(){
         this.showLoading();
        Api
        .getMdtList()
        .then((res) => {
             this.hideLoading();
             if(res.data.recordList.length>0){
                 this.setState({
                     mdtList:res.data.recordList
                 })
             }
        }, (e) => {
            this.hideLoading();
            this.setState({
                showIOS3:true,
                msg:e.msg
            })
        });
    }
   
    render() {
        const {toptip,imgArr,reasonList,isSub,isIos,mdtList}=this.state
        const { msg} = this.state;
        return (
            <div className="page-mdt">
                <div className="home"><span className="jian"
                                            onClick={()=>{
                                   this.context.router.goBack();
                                      }}
                    ></span>MDT门诊
                </div>
                <Toast icon="success-no-circle" show={this.state.showToast}>{msg}</Toast>
                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                    {msg}
                </Dialog>
                
                <div className="mdt-list">
                  {mdtList&&mdtList.length>0&&mdtList.map((item,index)=>{
                      return(
                        <div className="mdt-item" key={index} onClick={()=>{
                            this.context.router.push({
                                pathname:'/mdt/detail',
                                query:{id:item.id}
                            })
                        }}>
                           <p className="mdt-title">{item.name}</p>
                           <p className="detail">简介：{item.introduction} </p>
                           <div className="person">
                               <p className="left">
                                <img src="../../../resources/images/list-czzj.png" alt=""/>
                                团队人数：<span>{item.doctorCount}</span>人
                               </p>
                               <p className="right">
                                <img src="../../../resources/images/list-czrs.png" alt=""/>
                                  已会诊：<span>{item.mdtCount}</span>人
                               </p>
                           </div>
                        </div>
                      )
                  })}
                   
                   
                </div>
                <div className="no-mdt">
                     <img src="../../../resources/images/mygdl.png" alt=""/>
                     <p>没有更多的了...</p>

                </div>
               
            </div>
        );
    }
}
export default Connect()(Widget);
