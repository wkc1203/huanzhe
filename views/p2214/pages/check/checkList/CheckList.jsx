import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import { Link } from 'react-router';
import * as Utils from '../../../utils/utils';
import * as Api from './checkListApi';
import './style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
            msgList: [],
            quiryNum: 0,
            showToast: false,
            showLoading: false,
            toastTimer: null,
            loadingTimer: null,
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            no:3,
            showAndroid2: false,
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
            msg: '',
            checkInfo:[],//订单详情
            itemList:[],//检查项
            patientTel:'',//就诊人电话
            time:'',//申请时间
        };
    }
    componentDidMount() {
         
          this.setState({
              checkInfo:JSON.parse(this.props.location.query.content)
          })
          Utils.getJsByHide();
    }
    //确认
    confrim(){
        if(this.state.checkInfo.status=='1'){
            var replaceUrl=window.location.origin+"/views/p2214/#/consult/pay?orderId="+this.state.checkInfo.orderIdStr+"&totalFee="+
            this.state.checkInfo.totalFee+"&inquiryId="+this.state.checkInfo.inquiryId+"&doctorName="+this.state.checkInfo.doctorName+"&deptName="+this.state.checkInfo.deptName+
            "&patientCard="+this.state.checkInfo.patCardNo+"&patientName="+this.state.checkInfo.patientName;
       top.window.location.replace(replaceUrl);
        }else{
            Api 
            .confirm({hisId:2214,platformId:2214,id:this.state.checkInfo.id,patientTel:this.state.patientTel})
            .then((res) => {
                if (res.code == 0) {
                     var replaceUrl=window.location.origin+"/views/p2214/#/consult/pay?orderId="+this.state.checkInfo.orderIdStr+"&totalFee="+
                     this.state.checkInfo.totalFee+"&inquiryId="+this.state.checkInfo.inquiryId+"&doctorName="+this.state.checkInfo.doctorName+"&deptName="+this.state.checkInfo.deptName+
                     "&patientCard="+this.state.checkInfo.patCardNo+"&patientName="+this.state.checkInfo.patientName;
                top.window.location.replace(replaceUrl);
                     
                }
            }, (e) => {
                this.hideLoading();
            
            });
        }
        
    }
    //获取检查单信息
    getCheckInfo(id,orderId,inquiryId){
        Api 
        .getCheckInfo({hisId:2214,platformId:3,id:id,inquiryId:this.props.location.query.inquiryId})
        .then((res) => {
            if (res.code == 0 && res.data != null) {
                 var dateee = new Date(res.data.createTime).toJSON();

        
             var date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')  
                 this.setState({
                     checkInfo:res.data,
                     itemList:JSON.parse(res.data.checkItem),
                     patientTel:res.data.patientTel,
                     time:date
                 })
            }
        }, (e) => {
            this.hideLoading();
           
        });
    }

   
    getMsg() {
        Api
            .getMsg()
            .then((res) => {
                if (res.code == 0 && res.data != null) {
                    this.setState({
                        quiryNum: res.data.length
                    })
                }
            }, (e) => {
                this.hideLoading();
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })
            });
    }
    showToast() {
        this.setState({showToast: true});
        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
    }

   /*获取咨询列表*/
    getInquiryList() {
        this.showLoading();
        Api
            .getInquiryList()
            .then((res) => {
                if (res.code == 0) {
                    this.hideLoading();

                    this.setState({
                        msgList: res.data
                    })

                    if(this.props.location.query.inquiryId&&this.props.location.query.s!=1){
                        window.location.href=window.location.href+"&s=1";
                        this.context.router.push({
                            pathname:'inquiry/chat',
                            query:{
                                inquiryId:this.props.location.query.inquiryId,
                                orderId:this.props.location.query.orderId,
                                status:this.props.location.query.status,
                                no:1
                            }
                        })
                    }
                }
            }, (e) => {
                this.hideLoading();
            });
    }

    toNext(type) {
        if (type == 1) {
            this.context.router.replace({
                pathname: '/home/index'
            });
        }
        if (type == 3) {
            this.context.router.replace({
                pathname: '/usercenter/home'
            });
        }
    }
    render() {
        const {time,patientTel,checkInfo,itemList,msgList,msg}=this.state;
        return (
            <div className="container page-list-check">
                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons}
                        show={this.state.showIOS1}>
                    {msg}
                </Dialog>
                <div className="home" style={{position:'relative',width:'100%',top:'0'}}><span className="jian"
                onClick={()=>{
                  this.context.router.goBack();
                  }}
                        ></span>检验检查单
                        </div>
                <div className='check-status'>
                <div className='status-item register-info rightTab' onClick={()=>{
                    this.context.router.push({
                        pathname:'/check/registerInfo'
                    })
                }}>
                   如何到医院拿报告？
                  
                  </div>
                  <div className='status-item register-info' style={{marginTop:'10px'}} >
                就诊人：{checkInfo.patientName}
                  
                  </div>
                  { checkInfo.checkItem&&JSON.parse(checkInfo.checkItem).map((item, index)=> {
                    return (
                        <div className='status-item register-info rightTab' onClick={()=>{
                            this.context.router.push({
                                pathname:'/check/checkInfo',
                                query:{doctorName:checkInfo.doctorName,content:JSON.stringify(item),time:checkInfo.createTime,hisName:checkInfo.hisName,deptName:checkInfo.deptName}
                            })
                        }}>
                          检查项：{item.project_name}
                          
                          </div>
                    )
               
        
            })
        }
                </div>
               

            </div>
        );
    }
}

export default Connect()(Widget);
