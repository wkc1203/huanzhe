import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast ,Popup, Picker, CityPicker, Form, FormCell, CellBody, CellHeader, Label, Input } from 'react-weui';
import { Link } from 'react-router';
import {getBirthdayByIdCard,validators} from '../../../utils/validator';
import hashHistory from 'react-router/lib/hashHistory';
import Connect from '../../../components/connect/Connect';
import NoResult from '../../../components/noresult/NoResult';
//import zhCN from 'antd/lib/date-picker/locale/zh_CN';
import * as Api from './addpatientapi';
import './style/index.scss';

class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
  constructor(props) {
    super(props);
    this.state = {
        validateCode: '',
        phone:'',
        isSendValidate: false,
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
        city_show: false,
        city_value: '',
        leftTime: 120,
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
        city:[
               "重庆","万州"
            ]
    };
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
        console.log(window.location.href.substring(0,window.location.href.indexOf("#")-1))
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
                     this.showToast();
                     const timer = setTimeout(() => {
                         console.log('type',this.props.location.query.type)
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
            },
            phone: {
                regexp: /^1\d{10}$/,
                errTip: '请输入正确的手机号'
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
        var type = e.target.id;
        if (type == 'name') {
            this.setState({
                name: e.target.value
            })
        }
        if (type == 'idNo') {
            this.setState({
                idNo: e.target.value
            })
        }
        if (type == 'phone') {
            this.setState({
                phone: e.target.value
            })
        }
        if (type == 'validateCode') {
            this.setState({
                validateCode: e.target.value
            })
        }
    }
    // userIO(e) {
    //     const id = e.target.id;
    //     const value = e.target.value;
    //     if(id=='patientName'){
    //         this.setState({
    //             patientName:value
    //         })
    //     }
    //     if(id=='idNo'){
    //         this.setState({
    //             idNo:value
    //         })
    //     }
    //     if (type == 'phone') {
    //         this.setState({
    //             phone: e.target.value
    //         })
    //     }
    //     if (type == 'cardAdd') {
    //         this.setState({
    //             validateCode: e.target.value
    //         })
    //     }
    //     // if(id=='patCardNo'){
    //     //     this.setState({
    //     //         patCardNo:value
    //     //     })
    //     // }
    //     if(this.state.phone!=''&&this.state.idNo!=''&&this.state.patientName!=''){
    //         this.setState({
    //             kong:false,
    //         })
    //     }
    // }
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
    /*重置*/
    resetThisError(e) {
        const id = e.target.id;
        var elements = this.state.errorElement;
        elements[id] = false;
        this.setState({
            errorElement: elements
        })
    }
    // resetThisError(e) {
    //     const id  = e.target.id;
    //     var  errorElement=this.state.errorElement;
    //     errorElement[id] = false;
    //     this.setState({
    //         errorElement:errorElement
    //     })

    // }
    /**
     * 倒计时
     */
    clock() {
        var clockTimer = setTimeout(() => {
            var leftTime1 = this.state.leftTime;
            --leftTime1;
            this.setState({
                leftTime: leftTime1
            })
            if (leftTime1 <= 0) {
// 查询超时，跳转详情页面
                this.setState({
                    isSendValidate: false,
                })
            } else {
                this.setState({
                    leftTime: leftTime1
                })
                this.clock();
            }
        }, 1000);
    }
    getValidate() {
       // console.log(this.state.errorElement['phone'],this.state.phone ,"jjjj")
        if (this.state.errorElement['phone'] || !this.state.phone) {
            this.setState({
                toptip: '请填写正确的手机号码'
            })
            const errTimer = setTimeout(() => {
                this.setState({
                    toptip: ''
                })
                clearTimeout(errTimer);
            }, 2000);
            return '';
        }
        Api
            .getValidate({type:'cardAdd',phone: this.state.phone})
            .then((res) => {
                this.hideLoading();
                if (res.code == 0) {
                    this.setState({
                        isSendValidate: true,
                    })
                    this.setState({
                        leftTime:120,
                    })
                    this.clock();
                }else{
                    if(!!res.data){
                        this.setState({
                            isSendValidate: true,
                        })
                        this.setState({
                            leftTime:res.data,
                        })
                        this.clock();
                     }else{
                        this.setState({
                            msg:res.msg,
                            showIOS1: true
                        })
                     }
                }
            }, (e) => {
                if(e.code!=990&&e.code!=999){
                      this.setState({
                          msg:e.msg,
                          showIOS1: true
                      })
                }else{
                    if(!!e.data){
                        this.setState({
                            isSendValidate: true,
                        })
                        this.setState({
                            leftTime:e.data,
                        })
                        this.clock();
                     }else{
                        this.setState({
                            msg:e.msg,
                            showIOS1: true
                        })
                     }

                }
            });
    }
    render() {
    const {msg,patCardNo,idNo,patientName,toptip,kong,errorElement,phone,validateCode,isSendValidate ,leftTime}=this.state;
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
                ></span>添加就诊人
            </div>
            <Toast icon="success-no-circle" show={this.state.showToast}>添加成功</Toast>
            {/* <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog> */}
            <Toptips type="warn" show={toptip!=''}>{toptip}</Toptips>
        <div >
           
            <div className="container page-login patientadd">  
            <div className="register-input">
            <div className="register-list">
                <div className="register-listitem1">
                    <div className="listitem-head">
                        <text className="list-title">姓名</text>
                    </div>
                    <div className="listitem-body">
                        <input
                            className={`m1-content ${errorElement.patientName ? 'o-error' : ''}`} placeholder="请输入姓名"
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
                <div className="register-listitem1">
                    <div className="listitem-head">
                        <div className="list-title">身份证号</div>
                    </div>
                    <div className="listitem-body">
                        <input
                            className={`m1-content ${errorElement.idNo ? 'o-error' : ''}`} placeholder="请输入身份证号码"
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
        
                <div className="register-listitem1">
                    <div className="listitem-head">
                        <text className="list-title">地址</text>
                    </div>
                    <div className="listitem-body ">
                            <Input type="text"
                            className="m1-content inputs"
                                value={this.state.city_value}
                                onClick={ e=> {
                                    e.preventDefault();
                                    this.setState({city_show: true})
                                }}
                                placeholder="请选择所在地区"
                                readOnly={true}
                            />

                        <CityPicker
                            data={this.state.city}
                            onCancel={e=>this.setState({city_show: false})}
                            onChange={text=>this.setState({city_value: text, city_show: false})}
                            show={this.state.city_show}
                        />
                </div>
            </div>
            <div className=" register-listitem1 ">
                    <div className="listitem-head ">
                        <text className="list-title">详细地址</text>
                    </div>
                    {/* <div className="complain-suggest">
                    <div className="suggest-title">请输入投诉或建议的内容</div>
                    <div className="area-box">
                        <textarea placeholder="请输入详细地址信息，如道路门牌号、小区、楼栋号、单元室等"
                            onChange={(e) => {
                                this.saveContent(e)
                            }} />
                    </div>
                </div> */}
                    <div className="listitem-body">
                        <textarea
                            className={`m1-content adddetail ${errorElement.idNo ? 'o-error' : ''}`}  placeholder="请输入详细地址信息，如道路门牌号、小区、楼栋号、单元室等"
                           // Columns="50" 
                            //TextMode="MultiLine" 
                            // maxLength='15'
                            MultiLine="true"
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
            <div className="height20"></div>
            <div className="register-listitem1 ">
                {/* is-card m-mt-20 */}
                                <div className="listitem-head">
                                    <div className="list-title">手机号</div>
                                </div>
                                <div className="listitem-bd">
                                    <input className="m1-content phone" placeholder="请输入手机号码"
                                           id="phone" value={phone}
                                           className={`m1-content ${errorElement.phone?'o-error':''}`}
                                           type="number"
                                           onBlur={(e)=>{
                                            window.scrollTo(0,0);         
                                            this.validator1('phone')
                                            }}
                                           onFocus={(e)=>{
                                                    this.resetThisError(e)
                                                    }}
                                           onChange={(e)=>{
                                                        this.userIO(e)
                                                        }}
                                        />
                                        {!isSendValidate && <div className="listitems-ft"
                                                         onClick={(e)=>{
                                                            this.getValidate(e)
                                                            }}
                                    >获取验证码</div>}
                                {isSendValidate && <div className="listitems-ft ft-disabled ">
                                    {leftTime} s 后重试
                                </div>}
                                </div>
                            </div>
                            <div className="register-listitem1">
                                <div className="listitem-head">
                                    <div className="list-title">验证码</div>
                                </div>
                                <div className="listitem-body">
                                    <input className="m1-content" placeholder="请输入验证码"
                                           type="number"
                                           id="validateCode"
                                           className={`m1-content ${errorElement.validateCode?'o-error':''}`}
                                           value={validateCode}
                                           maxLength="6"
                                           onBlur={(e)=>{
                                            window.scrollTo(0,0);         
                                                    this.validator1(e)
                                                    }}
                                           onFocus={(e)=>{
                                                        this.resetThisError(e)
                                                        }}
                                           onChange={(e)=>{
                                                            this.userIO(e)
                                                            }}
                                        />
                                </div>
                                
                            </div>
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
                    className="binduser-btn_line" >提交</button>
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
