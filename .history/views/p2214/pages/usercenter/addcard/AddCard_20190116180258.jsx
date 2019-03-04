import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import { Link } from 'react-router';
import {getBirthdayByIdCard,validators} from '../../../utils/validator';
import hashHistory from 'react-router/lib/hashHistory';
import Connect from '../../../components/connect/Connect';
import NoResult from '../../../components/noresult/NoResult';
import * as Api from './addCardApi';
import './style/index.scss';

class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
  constructor(props) {
    super(props);
    this.state = {
        type:0,
        errorElement: {}, // 发生错误的元素
        hasErr: true, // 是否存在校验错误
        toptip: '',
        idTypesIdx: 0,
        patCardsIdx: 0,
        CURSOR_SPACING: '100',
        isNewCard: 0,
        isNoCard: 0,
        isDefault: false,
        patientName: '',
        idType: '1',
        birthday: '',
        idNo: '',
        patCardNo: '',
        patientMobile: '',
        relationType: '5',
        patientType: '0',
        relationA:false,
        relationB:false,
        kong:true,
        relationAll:'',
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
    };
  }
  hideDialog(){
    Utils.hideDialog();
}
  componentDidMount() {
        this.getJs();
      this.setState({
          type:this.props.location.query.type
      })
  }
  componentWillUnmount() {
    this.state.Timer && clearTimeout(this.state.Timer);
  }
    getJs() {
        Api
            .getJsApiConfig({url:window.location.href.substring(0,window.location.href.indexOf("#")-1)})
            .then((res) => {
                if (res.code == 0) {
//写入b字段
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: res.data.appId, // 必填，公众号的唯一标识
                        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: res.data.noncestr, // 必填，生成签名的随机串
                        signature: res.data.signature,// 必填，签名
                        jsApiList: ['hideMenuItems', 'showMenuItems'] // 必填，需要使用的JS接口列表
                    });
                    wx.ready(function () {
//批量隐藏功能
                        wx.hideMenuItems({
                            menuList: ["menuItem:share:QZone", "menuItem:share:facebook", "menuItem:favorite", "menuItem:share:weiboApp", "menuItem:share:qq", "menuItem:share:timeline", "menuItem:share:appMessage", "menuItem:copyUrl", "menuItem:openWithSafari", "menuItem:openWithQQBrowser"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                        });
                    });
                }
            }, (e) => {
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })
            });
    }
    formSubmit() {
        const hasErr = this.validator1();
        if (hasErr) {
            return false;
        }
        this.pushData();
    }
    validator(e) {
        const  id  = e.target.value;
        this.setState({
            hasErr:this.validator1(id)
        })

    }

     pushData() {
        // 绑卡
        this.showLoading();
        const value = this.getFormData();
        value.isDefault = this.state.isDefault ? '1' : '0';
         Api
           .bindCard(value)
           .then((res)=>{
                 if (res.code == 0) {
                   this.hideLoading();
                     Utils.showToast();
                     const timer = setTimeout(() => {
                         if(this.props.location.query.type==1){
                             this.context.router.go(-1);
                         }else{
                              if(this.props.location.query.type==3){
                                this.context.router.go(-2);
                              }else{
                                this.context.router.push({
                                    pathname:'/usercenter/userlist'
                                })
                              }
                            
                         }

                         clearTimeout(timer);

                     }, 2000);
                 }
             }
           ,(e)=>{
                 this.hideLoading();
                 this.setState({
                     msg:e.msg,
                     showIOS1:true
                 })
         })
    }
    /*验证*/
    validator1(id) {
        const validate = {
            patientName: {
                regexp: /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,8}$/,
                errTip: '请输入2-8位合法姓名'
            },
            idNo: {
                regexp: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                errTip: '请输入18位身份证'
            },
            patCardNo: {
                regexp: (() => {
                    if (this.state.isNewCard == 1) {
                        return {};
                    } else {
                        return /^[_a-zA-Z0-9]{2,10}$/ || /^\S+$/;
                    }
                })(),
                errTip: '请输入2-10位就诊卡号'
            }
        };
        const value = this.getFormData();
        let hasErr = false;
        for (let o in value) {
            const obj = validate[o];
            if (obj && obj.regexp) {
                let thisErr = false;
                if (typeof obj.regexp === 'function') {
                    const retObj = obj.regexp(value);
                    if (!retObj.ret) {
                        hasErr = true;
                        thisErr = true;
                        var  errorElement=this.state.errorElement;
                        if (id && id == o) {
                            errorElement[id] = true;
                        }
                        this.setState({
                            errorElement:errorElement
                        })
                    }
                } else {
                    if (
                        typeof obj.regexp.test === 'function' &&
                        !obj.regexp.test(value[o])
                    ) {
                        hasErr = true;
                        thisErr = true;
                        var  errorElement=this.state.errorElement;
                        if (id && id == o) {
                            errorElement[id] = true;
                        }
                        this.setState({
                            errorElement:errorElement
                        })
                    }
                }
                if (
                    (!id && hasErr) ||
                    (obj.errTarget && obj.errTarget == id && thisErr)
                ) {
                    // 提交时弹框提示
                    var errorElement=this.state.errorElement;
                    errorElement[obj.errTarget || o] = true;
                    var  toptip=this.state.toptip;
                    toptip = obj.errTip || '';
                     this.setState({
                         errorElement:errorElement,
                         toptip:toptip
                     })
                    const errTimer = setTimeout(() => {
                        this.setState({
                            toptip:''
                        })

                        clearTimeout(errTimer);
                    }, 2000);
                    break;
                }
            }
        }
        return hasErr;
    }
    /*提交数据*/
    getFormData() {
        const {
            patientName,
            idNo,
            patCardNo,
            birthday,
            patientMobile,
            isNewCard,
            isNoCard
            } = this.state;
        return {
            patientName:patientName,
            idNo:idNo,
            idType: '1',
            birthday:birthday,
            patCardNo:patCardNo,
            patientMobile:patientMobile,
            relationType: '5',
            patientType: '0',
            patCardType: '21',
            isNewCard:isNewCard,
            isNoCard:isNoCard
        };
    }
    /*展示如何绑卡*/
    showNext(){
       this.context.router.push({
           pathname:'/usercenter/cardtip'
       })
    }
    /*设置值*/
    userIO(e) {
        const id = e.target.id;
        const value = e.target.value;
        if(id=='patientName'){
            this.setState({
                patientName:value
            })
        }
        if(id=='idNo'){
            this.setState({
                idNo:value
            })
        }
        if(id=='patCardNo'){
            this.setState({
                patCardNo:value
            })
        }
        if(this.state.patCardNo!=''&&this.state.idNo!=''&&this.state.patientName!=''){
            this.setState({
                kong:false,
            })
        }
    }
   
    /*重置*/
    resetThisError(e) {
        const id  = e.target.id;
        var  errorElement=this.state.errorElement;
        errorElement[id] = false;
        this.setState({
            errorElement:errorElement
        })

    }
    render() {
    const {msg,patCardNo,idNo,patientName,toptip,kong,errorElement}=this.state;
        return (
        <div>
            <div className="home"><span className="jian"
                                        onClick={()=>{
                                      if(this.props.location.query.type==1){
                                   this.context.router.go(-2);
                                 }else{
                                     this.context.router.push({
                                         pathname:'/usercenter/userlist'
                                     })
                                 }
                                      }}
                ></span>绑定就诊卡
            </div>
            <Toast icon="success-no-circle" show={this.state.showToast}>绑定成功</Toast>
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
            <Toptips type="warn" show={toptip!=''}>{toptip}</Toptips>
        <div >
            <div className="bindcard-list">
                <div className="bindcard-listitem">
                    <div className="listitem-head">
                        <text className="list-title">姓名</text>
                    </div>
                    <div className="listitem-body">
                        <input
                            className={`m1-content ${errorElement.patientName ? 'o-error' : ''}`} placeholder="请输入宝宝姓名"
                            maxLength='8'
                            id="patientName"
                            value={patientName}
                            onBlur={
                            (e)=>{
                            this.validator(e)
                            }

                            }
                            onChange={
                            (e)=>{
                           this.userIO(e)

                            }
                            }
                            onFocus={
                            (e)=>{
                          this.resetThisError(e)

                            }
                            }
                            />
                    </div>
                </div>
            </div>
            <div className="bindcard-list m-mt-20">
                <div className="bindcard-listitem">
                    <div className="listitem-head">
                        <div className="list-title">身份证号</div>
                    </div>
                    <div className="listitem-body">
                        <input
                            className={`m1-content ${errorElement.idNo ? 'o-error' : ''}`} placeholder="请输入宝宝或监护人证件号"
                            maxLength='18'
                            id="idNo"
                            value={idNo}
                            onBlur={
                            (e)=>{
                            this.validator(e)
                            }

                            }
                            onChange={
                            (e)=>{
                           this.userIO(e)

                            }
                            }
                            onFocus={
                            (e)=>{
                          this.resetThisError(e)

                            }
                            }
                            />
                    </div>
                </div>
            </div>
            <div className="bindcard-list is-card m-mt-20">
                <div className="bindcard-listitem">
                    <div className="listitem-head">
                        <text className="list-title">就诊卡</text>
                    </div>
                    <div className="listitem-body">
                        <input
                            className={`m1-content ${errorElement.idNo ? 'o-error' : ''}`} placeholder="请输入就诊卡号"
                            maxLength='15'
                            id="patCardNo"
                            value={patCardNo}
                            name="patCardNo"
                            onBlur={
                            (e)=>{
                            this.validator(e)
                            }

                            }
                            onChange={
                            (e)=>{
                           this.userIO(e)

                            }
                            }
                            onFocus={
                            (e)=>{
                          this.resetThisError(e)

                            }
                            }
                            />
                    </div>
                </div>
            </div>
            <div className="afterscan-operbtnbox">
                <button
                    onClick={
                    ()=>{
                    this.formSubmit()
                    }
                    }
                    className={`binduser-btn_line ${kong ? 'o-disabled' : ''}`} >确定</button>
            </div>
        </div>
            {/*<div  className="tip1"
            onClick={
            ()=>{
           this.showNext()
            }
            }
            >如何申请就诊卡</div>*/}
     </div>
                    );
  }
}

export default Connect()(Widget);
