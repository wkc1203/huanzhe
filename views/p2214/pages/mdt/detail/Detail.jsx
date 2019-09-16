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
            showIOS3: false,
            showAndroid1: false,
            showAndroid2: false,
            style1: {
                title: '温馨提示',
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
                        onClick: this.mdtApply.bind(this)
                    }
                ]
            },
            msg:'',
            detail:{},
           
        };
    }
    componentDidMount(){
      this.getDetail();
      Utils.getJsByHide();
      //还未申请
      sessionStorage.setItem('isApplyInfo',0)
    }
    /* 申请会诊 */
    mdtApply(){
      //清空session
       sessionStorage.removeItem('imgList');
       sessionStorage.removeItem('imgLength');
       sessionStorage.removeItem('applyInfo');
        this.context.router.push({
            pathname:'/mdt/apply',
            query:{mdtDetail:JSON.stringify(this.state.detail)}
        })
    }
    /* 获取团队详情 */
    getDetail(){
      this.showLoading();
      Api
      .getMdtDetail({hisId:'2214',id:this.props.location.query.id})
      .then((res) => {
           this.hideLoading();
           if(res.data){
                this.setState({
                  detail:res.data
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
        const {msg,detail}=this.state
        return (
            <div className="page-mdt-detail">
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
                <Dialog type="ios" title={this.state.style3.title} buttons={this.state.style3.buttons} show={this.state.showIOS3}>
                    {msg}
                </Dialog>
                
               <div className="mdt-detail-info">
                  <div className="info-item">
                    <p className="detail-info-title">
                      <img src="../../../resources/images/detail-bz.png" alt="" width='12px' height='14px' />
                      病种名称
                    </p>
                    <div className="info">
                      {detail.name}
                    </div>
                  </div>
                  <div className="info-item">
                    <p className="detail-info-title">
                      <img src="../../../resources/images/detail-jjnr.png" alt="" width='12px' height='14px' />
                       简介
                    </p>
                    <div className="info">
                      {detail.introduction}
                    </div>
                  </div>
                  <div className="info-item">
                    <p className="detail-info-title">
                      <img src="../../../resources/images/list-czzj.png" width='15px' height='13px' alt=""/>
                      出诊专家
                    </p>
                    <div className="info info-doc">
                       {!!detail&&!!detail.mdtDoctorList&&detail.mdtDoctorList.length>0&&detail.mdtDoctorList.map((item,index)=>{
                         return(
                          <div className="doctor" key={index}>
                            <img src={item.image} alt=""/>
                            <p className="name">{item.name}</p>
                            <p className="dept">{item.deptName}</p>
                          </div>
                         )
                       })}
                    </div>
                  </div>
                  {!!detail&&!!detail.visitingTime&&<div className="info-item">
                    <p className="detail-info-title">
                      <img src="../../../resources/images/detail-czsj.png" width='12px' height='12px' alt=""/>
                       出诊时间
                    </p>
                    <div className="info">
                       {detail.visitingTime}
                    </div>
                  </div>}
                  <div className="info-item">
                    <p className="detail-info-title">
                      <img src="../../../resources/images/list-czrs.png" width='13px' height='12px' alt=""/>
                       已接诊人数
                    </p>
                    <div className="info">
                    {detail.mdtCount}人
                    </div>
                
                </div>
               </div>
               <div className="btn-detail" onClick={()=>{
                   this.setState({
                       showIOS2:true,
                   })
               }}>
                立即申请
               </div>
               {this.state.showIOS2&&<div className='modal1'>
                    <div className='modal-body-protocol'>
                        <div className='modal-title'>温馨提示</div>
                        <div className='modal-content-protocol'>
                            <div className="content">
                                <div className="content-item">
                                1.在线申请MDT会诊，您需先填写和补充完整申请信息；
                                </div>
                                <div className="content-item">
                                2.提交申请后，需等待工作人员审核（1-3个工作日内完成审核）；
                                  </div>
                                  <div className="content-item">
                                  3.审核人员将根据您所提供的病情资料为你推荐合理的会诊团队，故您所选择的团队会存在变更；
                                  </div>
                                  <div className="content-item">
                                  4.审核通过后，请咨询查阅订单信息与会诊知情同意书；
                                  </div>
                                  <div className="content-item">
                                  5、支付会诊订单费用，进入网络会诊室；
                                  </div>
                                  <div className="content-item">
                                  6、会诊专家团队在会诊时间内在线为您提供会诊服务，出具会诊报告。
                                  </div>
                            </div>  
                        </div>
                    </div>
                   <div className='modal-footer'>
                    <span onClick={()=>{
                        this.setState({
                            showIOS2:false
                        })
                        }}>取消</span>
                        <div
                          onClick={()=>{
                            this.setState({
                              showIOS2:false
                            })
                              this.mdtApply()
                          }}
                            className='sure'
                            >确定</div>
                    </div>
                    </div>}
               
            </div>
        );
    }
}
export default Connect()(Widget);
