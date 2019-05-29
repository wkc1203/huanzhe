import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import { Link } from 'react-router';
import Connect from '../../../components/connect/Connect';
import NoResult from '../../../components/noresult/NoResult';
import hashHistory from 'react-router/lib/hashHistory';
import * as Api from './newPhoneApi';
import './style/index.scss';
import * as Utils from '../../../utils/utils';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
            leftTime: 120,
            phone: '',
            toptip: '',
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
            validateCode: '',
            msg:'',
            isSendValidate: false,
            errorElement: {}, // 发生错误的元素
            hasErr: true // 是否存在校验错
        };
    }

    componentDidMount() {
          //隐藏分享等按钮
      Utils.getJsByHide();
    }

    componentWillUnmount() {
        this.state.Timer && clearTimeout(this.state.Timer);
    }
    
   
    /*设置值*/
    userIO(e) {
        var type=e.target.id;
        if(type=='name'){
            this.setState({
                name:e.target.value
            })
        }
        if(type=='idNo'){
            this.setState({
                idNo:e.target.value
            })
        }
        if(type=='phone'){
            this.setState({
                phone:e.target.value
            })
        }
        if(type=='validateCode'){
            this.setState({
                validateCode:e.target.value
            })
        }

    }
    validator1(id) {
        this.setState({
            hasErr:this.validator(id)
        })

    }
    /*验证*/
    validator(id) {
        const validate = {
            phone: {
                regexp: /^1\d{10}$/,
                errTip: '请输入正确的手机号'
            },
            validateCode: {
                regexp: /^\d{6}$/,
                errTip: '请输入正确的验证码'
            }
        };

        const value = {};
        value.phone = this.state.phone;
        value.validateCode = this.state.validateCode;

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
                        if (id && id == o) {
                            var elements=this.state.errorElement;
                            elements[id] = true;
                            this.setState({
                                errorElement:elements,
                            })

                        }

                    }
                } else {
                    if (
                        typeof obj.regexp.test === 'function' &&
                        !obj.regexp.test(value[o])
                    ) {
                        hasErr = true;
                        thisErr = true;
                        if (id && id == o) {
                            var elements=this.state.errorElement;
                            elements[id] = true;
                            this.setState({
                                errorElement:elements,
                            })
                        }
                    }
                }
                if (
                    (!id && hasErr) ||
                    (obj.errTarget && obj.errTarget == id && thisErr)
                ) {
                    // 提交时弹框提示

                    var elements=this.state.errorElement;
                    elements[obj.errTarget || o] = true;

                    this.setState({
                        errorElement:elements,
                        toptip:obj.errTip || ''
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
    resetThisError(e) {
        const id = e.target.id;
        var elements=this.state.errorElement;
        elements[id]=false;
        this.setState({
            errorElement:elements
        })
    }
    /*验证并提交*/
    submitData() {
        const hasErr = this.validator();
        if (hasErr) {
            return false;
        }
        this.pushData();
    }
    /**
     * 倒计时
     */
    clock() {
        var clockTimer = setTimeout(() => {
            var  leftTime1= this.state.leftTime;
            --leftTime1;
            this.setState({
                leftTime:leftTime1
            })
            if (leftTime1 <= 0) {
                // 查询超时，跳转详情页面
                this.setState({
                    isSendValidate:false,
                })
            } else {
                this.setState({
                    leftTime:leftTime1
                })
                this.clock();
            }
        }, 1000);
    }
    showToast() {
        console.log("hhhh")
        this.setState({showToast: true});
        console.log(this.state.showToast)
      
        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
      }
    /*提示数据*/
    pushData(){
        const value = {};
        value.phone = this.state.phone;
        value.validateCode = this.state.validateCode;
        Api
            .modifyPhone(value)
            .then((res) => {
                this.hideLoading();
                if (res.code == 0) {
                    this.showToast;
                    const timer = setTimeout(() => {
                        clearTimeout(timer);
                        this.context.router.replace({
                            pathname:'usercenter/home'
                       })
                    }, 2000);
                }
            }, (e) => {
                this.hideLoading();
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });

    }
    /*获取验证码*/
    getValidate() {
        if (this.state.errorElement['phone'] || !this.state.phone) {
            this.setState({
                toptip:'请填写正确的手机号码'
            })
            const errTimer = setTimeout(() => {
                this.setState({
                    toptip:''
                })
                clearTimeout(errTimer);
            }, 2000);
            return '';
        }

        Api
            .getValidate({ phone: this.state.phone })
            .then((res) => {
                this.hideLoading();
                if(res.code==0){
                    this.setState({
                        isSendValidate:true,
                    })
                    this.clock();
                }
            }, (e) => {
                this.hideLoading();
                this.showPopup({ content: e.msg });
            });

    }

    render() {
        const {leftTime,phone,validateCode,msg,isSendValidate,errorElement,hasErr}=this.state;
        return (
            <div>
                <div className="home"><span className="jian"
                                            onClick={()=>{
                                      this.context.router.push({
                                       pathname:'usercenter/home'
                                      })
                                      }}
                    ></span>修改手机号码
                </div>
                <Toast icon="success-no-circle" show={this.state.showToast}>修改成功</Toast>
                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                    {msg}
                </Dialog>
                <div className="page-phone">

                    {isSendValidate&&<div className="warm-tip">短信已发送至您{phone}的手机</div>}
                    {!isSendValidate&&<div className="warm-tip">请输入新的手机号，填写验证码</div>}

                    <div>
                        <div className="register-listitem">
                            <div className="listitem-head">
                                <text className="list-title">手机号</text>
                            </div>
                            <div className="listitem-bd">
                                <input className="m-content"  placeholder="请输入手机号码"
                                       id="phone" value={phone}
                                       className={`m-content ${errorElement.phone?'o-error':''}`}
                                       type="number"
                                       onBlur={(e)=>{
                                    this.validator1('phone')
                                    }}
                                       onFocus={(e)=>{
                                    this.resetThisError(e)
                                    }}
                                       onChange={(e)=>{
                                    this.userIO(e)
                                    }}
                                    />

                            </div>
                            {!isSendValidate&&<div  className="listitem-ft" onClick={()=>{this.getValidate()}} >获取验证码</div>}
                            {isSendValidate&&<div  className="listitem-ft">{leftTime}s 后重试</div>}


                        </div>
                        <div className="register-listitem">
                            <div className="listitem-head">
                                <div className="list-title">验证码</div>
                            </div>

                            <div className="listitem-body">
                                <input   placeholder="请输入验证码"
                                         type="number"
                                         id="validateCode"
                                         className={`m-content ${errorElement.validateCode?'o-error':''}`}
                                         value={validateCode}
                                         maxLength="6"
                                         onBlur={(e)=>{
                                    this.validator1("validateCode")
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
                <div className="btn">
                    <button className="submit-btn" onClick={()=>{
            this.submitData()

            }}>提交</button>
                </div>
            </div>

        );
    }
}

export default Connect()(Widget);
