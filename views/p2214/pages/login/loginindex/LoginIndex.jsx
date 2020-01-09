import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import { Link } from 'react-router';
import * as Api from '../../../components/Api/Api';
import {validators} from '../../../utils/validator';
import * as Utils from '../../../utils/utils';
import './style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    constructor(props) {
        super(props);
        window.resetChoose=this.resetChoose.bind(this)
        this.state = {
            hospInfo: {},
            showToast: false,
            showToast1: false,
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
            msg: '',
            isShowProtocol: false,
            hasErr: true,// 是否存在校验错误
            errorElement: {}, // 发生错误的元素
            name: '',
            idNo: '',
            leftTime: 120,
            isChecked: true,
            phone: '',
            validateCode: '',
            toptip: '',
            isSendValidate: false,
        };
    }
   componentWillMount(){
      
   }
   resetChoose(){
       console.log("122");
   }
    componentDidMount() {  
        if(!!window.localStorage.openId){
            Utils.sum('register',1);
       
            var lastURL=document.URL;
	window.addEventListener("hashchange",function(event){
		Object.defineProperty(event,"oldURL",{enumerable:true,configurable:true,value:lastURL});
		Object.defineProperty(event,"newURL",{enumerable:true,configurable:true,value:"https://"+window.location.host+"/views/p2214/#/home/index?_k=bkxnk2"});
        lastURL=document.URL;

        console.log(event);
	});

         }else{
             var code='';
            if(window.location.hostname=='tih.cqkqinfo.com'){
                code='ff80808165b46560016817f20bbc00b3';
          
              }else{
                code='ff80808165b46560016817f30cc500b4';
              }
              var storage=window.localStorage;
              //加入缓存
              storage.isOpenId=1;
            
              window.location.href = "https://wx.cqkqinfo.com/wx/wechat/authorize/"+code+"?scope=snsapi_base";
              // return false;
                 var storage=window.localStorage;
                 //加入缓存
                 storage.url=window.location.href;            
         }
         //隐藏分享等按钮

          Utils.getJsByHide();
         
           
    }
     pushHistory() {
        var state = {
        title: "title",
        url: "#/login/loginindex"
        };
        window.history.pushState(state, "title", "#/login/loginindex");
        console.log("wein",window.history)
        }
    showToast() {
        this.setState({showToast: true});
        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
    }
    showToast1() {
        this.setState({showToast1: true});
        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast1: false});
              
                if(window.localStorage.report_register=='1'){
                   window.localStorage.report_register=='0';
                   this.context.router.push({
                       pathname:'usercenter/home',
                   })
                   
                }else{
                   this.context.router.goBack();
                }
               
     
        }, 1000);
    }
    getHospIntro() {
        this.showLoading();
        Api.getHisInfo()
            .then((res) => {
                this.hideLoading();
                if (res.data) {
                    this.setState({hospInfo: res.data});
                }
            }, (e) => {
                this.hideLoading();
                this.showPopup({content: e.msg});
            });
    }
    validator(id) {
        const validate = {
            name: {
                regexp: /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,8}$/,
                errTip: '请输入2-8位合法姓名'
            },
            idNo: {
                regexp: (() => {
                    const regexp = validators.idCard;
                    if (typeof regexp === 'function') {
                        return val => regexp(val.idNo);
                    } else {
                        return /^\S+$/;
                    }
                })(),
                errTip: '请输入正确的身份证'
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
                        if (id && id == o) {
                            var elements = this.state.errorElement;
                            elements[id] = true;
                            this.setState({
                                errorElement: elements,
                            })
                        }
                    }
                } else {
                    if (
                        typeof obj.regexp.test === 'function' && !obj.regexp.test(value[o])
                    ) {
                        hasErr = true;
                        thisErr = true;
                        if (id && id == o) {
                            var elements = this.state.errorElement;
                            elements[id] = true;
                            this.setState({
                                errorElement: elements,
                            })
                        }
                    }
                }
                if (
                    (!id && hasErr) ||
                    (obj.errTarget && obj.errTarget == id && thisErr)
                ) {
                    var elements = this.state.errorElement;
                    elements[obj.errTarget || o] = true;
                    this.setState({
                        errorElement: elements,
                        toptip: obj.errTip || ''
                    })
                    const errTimer = setTimeout(() => {
                        this.setState({
                            toptip: ''
                        })
                        clearTimeout(errTimer);
                    }, 2000);
                    break;
                }
            }
        }
        return hasErr;
    }
    validator1(id) {
        this.setState({
            hasErr: this.validator(id)
        })
    }
    getFormData() {
        const { name, idNo, phone, validateCode } = this.state;
        return {
            name,
            idNo,
            phone,
            validateCode
        };
    }
    resetThisError(e) {
        const id = e.target.id;
        var elements = this.state.errorElement;
        elements[id] = false;
        this.setState({
            errorElement: elements
        })
    }
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
    showProp(type) {
        if (type == 1) {
            this.setState({
                isShowProtocol: true,
            })
        } else {
            this.setState({
                isShowProtocol: false,
            })
        }
    }
    getValidate() {
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
            .getMsgValidate({type:'login',phone: this.state.phone})
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
    formSubmit(e) {
        const hasErr = this.validator();
        if (hasErr) {
            return false;
        }
        if (!this.state.isChecked) {
            this.setState({
                toptip: '您未同意互联网医院患者知情同意书'
            })
            const errTimer = setTimeout(() => {
                this.setState({
                    toptip: ''
                })
                clearTimeout(errTimer);
            }, 2000);
            return false;
        }
        this.pushData();
    }
    pushData() {
        this.showLoading();
        const value = this.getFormData();
        Api
            .register(value)
            .then((res) => {
                if (res.code == 0) {
                    this.hideLoading();
                    if(res.userType=='old'){
                        this.showToast1();    
                                 

                    }else{
                        this.showToast();
                        setTimeout(()=> {
                             if(window.localStorage.report_register=='1'){
                                window.localStorage.report_register=='0';
                                this.context.router.push({
                                    pathname:'usercenter/home',
                                })
                                
                             }else{
                                this.context.router.goBack();
                             }
                            
                        }, 1000);
                    }                  
                } else if (res.code == 995) {
                    Api
                        .validateImg()
                        .then((res) => {
                        }, (e) => {
                        });
                }
            }, (e) => {
                this.hideLoading();
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })
            });
    }
    switch() {
        if (this.state.isChecked) {
            this.setState({
                isChecked: false
            })
        } else {
            this.setState({
                isChecked: true
            })
        }
    }
    render() {
        const {isShowProtocol,name,msg,idNo,phone,errorElement,hasErr,leftTime,validateCode,isSendValidate,isChecked,toptip}=this.state;
        return (
            <div className="container page-login">
                <Toast icon="success-no-circle" show={this.state.showToast}>注册成功</Toast>
                <Toast icon="success-no-circle" show={this.state.showToast1}>检测到你曾经使用过儿童医院小程序，账户已同步。</Toast>
                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons}
                        show={this.state.showIOS1}>
                    {msg}
                </Dialog>
                <div className="logo-img">
                    <img src="../../../resources/images/logo.png"/>
                </div>
                <div className="register-input">
                    <div >
                        <div className="register-list">
                            <div className="register-listitem1">
                                <div className="listitem-head">
                                    <div className="list-title">姓名</div>
                                </div>
                                <div className="listitem-body">
                                    <input
                                        className={`m-content ${errorElement.name?'o-error':''}`} placeholder="请输入姓名"
                                        id="name" value={name}
                                        onBlur={(e)=>{           window.scrollTo(0,0);         
                                                            this.validator1('name')
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
                            <div className="register-listitem1">
                                <div className="listitem-head">
                                    <div className="list-title">身份证</div>
                                </div>
                                <div className="listitem-body">
                                    <input
                                        className={`m-content ${errorElement.idNo?'o-error':''}`} placeholder="请输入身份证号"
                                        type="text"
                                        id="idNo" value={idNo}
                                        onBlur={(e)=>{
                                            window.scrollTo(0,0);         
                                            this.validator1('idNo')
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
                            <div className="register-listitem1">
                                <div className="listitem-head">
                                    <div className="list-title">手机号</div>
                                </div>
                                <div className="listitem-bd">
                                    <input className="m-content" placeholder="请输入手机号码"
                                           id="phone" value={phone}
                                           className={`m-content ${errorElement.phone?'o-error':''}`}
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
                                </div>
                            </div>
                            <div className="register-listitem1">
                                <div className="listitem-head">
                                    <div className="list-title">验证码</div>
                                </div>
                                <div className="listitem-body">
                                    <input className="m-content" placeholder="请输入验证码"
                                           type="number"
                                           id="validateCode"
                                           className={`m-content ${errorElement.validateCode?'o-error':''}`}
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
                                {!isSendValidate && <div className="listitem-ft"
                                                         onClick={(e)=>{
                                                            this.getValidate(e)
                                                            }}
                                    >获取验证码</div>}
                                {isSendValidate && <div className="listitem-ft ft-disabled">
                                    {leftTime} s 后重试
                                </div>}
                            </div>
                        </div>
                        <div className="check-box">
                            <label className="weui-agree">
                                <input type="checkbox" defaultChecked={isChecked} className="weui-agree__checkbox"
                                       onClick={(e) => {
                                    this.switch()
                                    }}/>
                            </label>
                            同意 <span onClick={
                                ()=>{
                                this.showProp(1);
                                }
                            }>重医儿童医院互联网医院患者知情同意书</span>
                        </div>
                        <div className="btn">
                            <div className={`submit-btn ${!hasErr&&isChecked?'':'o-disabled'}`}
                                    onClick={(e)=>{
                                    this.formSubmit(e)
                                    }}>立即注册
                            </div>
                        </div>
                    </div>
                </div>
                <Toptips type="warn" show={toptip!=''}>{toptip}</Toptips>
                {isShowProtocol && 
                    <div className='modal'>
                        <div className='modal-body-protocol'>
                            <div className='modal-title'  style={{fontSize:'16px'}}>重医儿童医院互联网医院患者知情同意书</div>
                            <div className='modal-content-protocol'>
                                <div >                        
                                    <div className="content-item" style={{textIndent:'2em'}}>尊敬的用户：</div>
                                    <div className="content-item" style={{textIndent:'2em'}}>欢迎使用重医儿童医院互联网医院！（以下简称互联网医院）
                                    </div>
                                    <div className="content-item" style={{textIndent:'2em'}}>服务协议说明：本协议是用户与互联网医院之间关于使用本服务所订立的协议，技术支持由重庆凯桥信息有限公司提供。用户确认本服务协议后，本服务协议即在用户和互联网医院产生法律效力。请用户务必在注册、使用提供的服务之前认真阅读全部服务协议内容，如有任何疑问，可向互联网医院客服咨询。
                                    </div>
                                    <div className="content-item" style={{textIndent:'2em'}}>注册提醒：平台服务于18周岁以下患者，但注册用户只能是患者监护人，监护人必须认真阅读本协议。本协议一旦签署即默认签署人是监护人。无论用户是否阅读完本服务协议，只要按照平台注册流程成功注册，即表示用户与互联网医院达成一致，成为互联网医院平台用户。用户的注册行为将被认为是对本协议全部条款接受和遵守。阅读本协议的过程中，如果用户不同意本协议或其中任何条款约定，用户应立即停止注册流程。
                                    </div>
                                    <div className="content-item" style={{textIndent:'2em'}}>互联网医院：指重庆医科大学附属儿童医院的网络医院，依托微信平台建立在我院公众号内的互联网医院，暂无其他合作医院及平台。
                                    </div>
                                    <div className="content-item" style={{textIndent:'2em'}}>互联网医院管理规定：平台服务的医生、药师、工作人员均属于重庆医科大学附属儿童医院员工，不涉及外聘其他医院专家等情况。
                                    </div>                               
                                    <div className="content-title" >一、 用户及注册：</div>
                                    
                                    <div className="content-item">(一)	互联网医院提供用户注册。用户的帐号和密码由用户自行保管；用户应当对以用户的帐号进行的所有活动和事件负法律责任。
                                   </div>
                                    <div className="content-item" >(二)	用户注册时，在账号名称、头像和简介等注册信息中不得出现违法和不良信息，否则互联网医院有权拒绝提供服务，并删除该账号。
                                   </div>
                                    <div className="content-item" >(三)	注册用户即为患者监护人，是具备完全民事行为能力的自然人。无民事行为能力人、限制民事行为能力人的个人不当注册，如使用了平台收费服务，其与互联网医院之间的服务协议自始无效，一经发现，互联网医院有权立即注销该用户，并追究其使用互联网医院“服务”的一切法律责任。                                    
                                    </div>
                                    <div className="content-item" >(四)	用户有权利要求在互联网医院上所填写的个人信息完全保密（不包含网络使用名，网名不允许使用真实姓名）。一旦发现用户提供的个人信息中有虚假，互联网医院有权立即终止向用户提供的所有服务，并冻结用户，并有权要求用户承担因为提供虚假信息给医生及平台造成的损失。 
                                    </div>
                                    <div className="content-item" >(五)	用户在平台选择服务时，根据自己的情况选择并判断适合自己的咨询科室，平台提供智能导诊服务。 
                                    </div>
                                    <div className="content-title" >二、互联网医院服务内容：</div>

                                    <div className="content-item" >1.	互联网医院服务的具体内容由互联网医院经营者提供，互联网医院经营者保留随时变更、中断或终止部分或全部网络服务的权利。</div>

                                    <div className="content-item" >2.	互联网医院作为医生、患者间交流互通平台，用户通过互联网医院发表的各种言论（包括但不仅限于咨询问题、就医经验、感谢信等），并不代表互联网医院赞同用户的观点或证实其内容的真实性。
                                    </div>
                                    <div className="content-item" >3.	用户在互联网医院上获得的医生答复、医学文章信息等，不能作为用户采取治疗方案的直接依据。如确有必要，用户应当联系医生进行面对面的诊疗。平台提供在线加号服务。
                                    </div>
                                    <div className="content-item">4.	互联网医院提供部分常见病、慢性病患者复诊服务，并为在我院线下平台明确诊断为某种或某几种常见病、慢性病后的患者，可针对相同诊断的疾病在线开具处方。为低龄儿童（6 岁以下）开具互联网儿童用药处方时，患儿应有监护人和相关专业医师陪伴。
                                    </div>
                                    <div className="content-item">5.	互联网医院在提供网络服务时，可能会对部分服务收取一定费用，互联网医院将会对收费服务给予明确的提示，如用户拒绝支付此类费用，互联网医院有权不提供相关服务。
                                    </div>
                                    <div className="content-item" >6.	互联网医院仅收取提供相关服务的费用，除此之外与服务有关的设备（如电脑、手机、调制解调器及其他与接入互联网有关的装置）及所需的费用（如为接入互联网而支付的电话费及上网费）均应由用户自行负担。
                                    </div>
                                    <div className="content-item" >7.	因不可抗力、网络状况、通讯线路、用户自身技术过错等原因，或其他不可控原因导致用户不能正常使用互联网医院服务，互联网医院不承担相应责任。
                                    </div>
                                    <div className="content-title" >三、互联网医院退款规则：</div>

                                    <div className="content-item" >1.	互联网医院对部分服务收取费用后，可能会因无法提供正常服务而退款，如医生超出24小时未接诊时，系统将会自动关闭该服务并自动为用户退款。
                                    </div>
                                    <div className="content-item">2.	用户在平台选择服务时，可根据自己的情况选择并判断适合自己的咨询科室，因用户选择咨询医生不对专业时，医生有权拒绝提供该次服务，服务被拒后系统将自动为用户退款。
                                    </div>
                                    <div className="content-item">3.	患者在互联网医院申请慢病续方时需缴纳网络门诊费，如医生24小时内接诊但评估患者病情无需开方后，因医生诊疗服务已经产生，网络门诊费不可退还。
                                    </div>
                                    <div className="content-item" >4.	医生在互联网医院为患者开具慢病处方或检查单，用户支付相关费用后，因医生诊疗服务已产生，如用户需退款仅可申请退药品或检查费用，网络门诊费不予退还。
                                    </div>
                                       
                                    <div className="content-title" >四、用户的权利和责任：</div>

                                    <div className="content-item" >1.	用户有权利拥有自己在互联网医院的用户名及密码，并有权利使用自己的用户名及密码随时登陆互联网医院服务。
                                    </div>
                                    <div className="content-item">2.	用户不得以任何形式转让或授权他人使用自己的互联网医院用户名，亦不得盗用他人帐号，由以上行为造成的后果由用户自行承担。
                                    </div>
                                    <div className="content-item" > 3.	用户有权根据互联网医院管理规定发布、获取信息，进行医患互通交流等。因互联网医院电话咨询及图文咨询均只限于用户的主观描述，不能面诊，所以用户在平台上提供的咨询信息必须保证真实，有效，不得提供虚假信息，否则有可能造成医生、药师的错误判断以及错误结果。医生尽可能利用医学知识及临床经验给予一定的解惑及如何就医方面的建议，不保证满足患者要求的诊断、治疗方面的建议一定能获得，也不保证这次咨询一定达到用户的预期目的。擅自将网上医生建议做为处方使用的，后果自负，与医生及互联网医院平台无关。
                                    </div>
                                    <div className="content-item" >4.	用户在咨询过程中要语言文明，尊重医生，平等交流。如有对医生恶意中伤，语言不文明，医生有权立即中断服务，此类服务，用户无权要求退款。
                                    </div>
                                    <div className="content-item">5.	咨询过程中遇到医生有紧急事情处理时（医生职业要求），要给予理解，暂停咨询，向互联网医院客服申报，以便安排重新咨询的具体时间。
                                    </div>
                                    <div className="content-item" >6.	用户必须遵守国家关于互联网信息发布的相关法律法规，用户对自己在互联网医院上发布的信息承担责任，用户不得发布违法信息，不得恶意评价其他用户。用户承诺自己在使用互联网医院时实施的所有行为均遵守国家法律、法规和互联网医院管理规定以及社会公共利益或公共道德。 如用户违反上述任一规则，导致相应法律后果的发生，用户将以自己的名义独立承担所有法律责任。
                                    </div>
                                    <div className="content-item">7.	用户在互联网医院上使用收费服务过程中如遇服务纠纷，或是发现医生没按服务要求进行咨询服务的，可与互联网医院平台客服联系。如用户因收费服务与其他用户产生诉讼的，用户有权通过司法部门要求互联网医院平台提供相关资料。</div>

                                    <div className="content-item">8.	本互联网医院用户在线问诊时，不得将涉及医疗纠纷的问题或其它有责任争议的问题在互联网医院发布，关于医疗纠纷的问题，请另行咨询律师或相关主管部门寻求援助，互联网医院有权将此类信息删除。</div>

                                    <div className="content-title">五、互联网医院的权利和责任：</div>

                                    <div className="content-item">1.	互联网医院平台有义务在现有技术上维护平台服务的正常进行，并努力提升技术及改进技术，使网站服务更优化。</div>
                                    <div className="content-item">2.	互联网医院对用户在使用收费服务过程中遇到的与服务相关的任何问题给予回复及解答；当用户顺利使用完收费咨询服务后不得因为咨询服务中的内容不满意要求退款。</div>
                                    <div className="content-item">3.	互联网医院有权对用户的注册数据及咨询的内容进行查阅，发现注册数据或咨询内容中存在任何问题或互联网医院认为应当终止服务的情况，均有权直接作出删除或者终止服务等处理，而无需征得用户的同意 。</div>
                                    <div className="content-item">4.	互联网医院平台没有义务对所有用户的注册数据、所有的活动行为以及与之有关的其它事项进行事先审查，但如存在下列情况，互联网医院有权根据不同情况选择保留或删除相关信息或继续、停止对该用户提供服务，并追究相关法律责任。
                                    1）用户或其它第三方通知互联网医院，认为某个具体用户、具体行为、具体事项可能存在重大问题；
                                    2）用户或其它第三方向互联网医院告知网络平台上有违法或不当行为的，互联网医院以普通非专业医疗人员的知识水平标准对相关内容进行判别，可以明显认为这些内容或行为具有违法或不当性质的。
                                    </div>
                                    <div className="content-item">5.	用户在互联网医院上如与其它用户产生纠纷，请求互联网医院从中予以调解，经互联网医院审核后，互联网医院有权向纠纷双方了解情况，并将所了解的情况互相通知对方；互联网医院所作出的调解行为不具有法律效力，调解结果由纠纷双方自愿作出，互联网医院仅协助提供信息的沟通，不对调解结果承担相应法律责任。</div>
                                    <div className="content-item">6.	因不可抗力（如自然灾害、火灾、水灾、战争、恐怖袭击暴动、黑客攻击等）导致互联网医院的服务中断或者用户数据损坏、丢失等，互联网医院不承担任何责任。</div>


                                    <div className="content-title">六、隐私声明：</div>

                                    <div className="content-item" style={{textIndent:'2em'}}>保护用户的隐私是互联网医院的一项基本政策，互联网医院保证不对外公开或向第三方提供用户的注册资料及用户在使用网络服务时存储的非公开内容，但下列情况除外：事先获得用户的明确授权；根据有关的法律法规要求；按照相关政府主管部门的要求；为维护社会公众的利益；为维护互联网医院的合法权益。
                                    </div>
                                    <div className="content-item" >1.	隐私范围
                                    1)	注册互联网医院时，根据网站要求提供的个人信息；
                                    2)	用户使用互联网医院服务、参加相关活动、访问网站网页（或移动客户端）时，网站自动接收并记录用户浏览器上的服务器数据，包括但不限于IP地址、网站Cookie中的资料及用户要求取用的网页记录；
                                    3)	用户使用互联网医院时，上传的非公开的病历资料、基本情况、诊疗方案等文字、图片、数据信息。
                                    </div>
                                    <div className="content-item" >2.	隐私使用：
                                    1)	在不透露用户的保密信息的前提下，互联网医院有权对整个用户数据库进行分析并对用户数据库进行分析，用于产品改进、提升服务质量、降低成本。
                                    2)	为服务用户的目的，互联网医院可能通过使用用户的个人信息向用户提供服务，包括但不限于向用户发出活动和服务信息等。
                                    </div>

                                    <div className="content-title" >七、服务条款修改：</div>
                                    <div className="content-item" >1.	互联网医院有权根据服务情况变更、终止互联网医院管理规定的各项条款，互联网医院将会通过适当方式向用户提示修改内容。
                                    </div>
                                    <div className="content-item" >2.	如果用户不同意互联网医院管理规定所做的修改，有权停止使用网络服务。如果用户继续使用网络服务，则视为用户接受互联网医院对服务协议相关条款所做的修改。
                                    </div>                               
                                    <div className="content-title" >八、法律管辖：</div>
                                    <div className="content-item" >1.	本服务协议的效力、变更、执行和解释及争议的解决均应适用中华人民共和国法律，没有相关法律规定的，参照通用国际商业惯例和（或）行业惯例。
                                    </div>
                                    <div className="content-item" >2.	如双方就本服务协议内容或其执行发生任何争议，双方应尽量友好协商解决；协商不成时，任何一方均可向互联网医院经营者所在地的人民法院提起诉讼。
                                    </div>
                                    <div className="content-title" >九、其他规定：
                                    </div>
                                    <div className="content-item" style={{textIndent:'2em'}}>您对本协议理解和认同，即是对本协议所有组成部分的内容理解并认同，一旦您使用平台提供的服务，您和互联网医院即受本协议所有组成部分的约束。本协议中的部分条款被有管辖权的法院认定为无效时的，不因此影响其他协议内容的效力。
                                    </div>                                                          
                                </div>
                            </div>                            
                        </div>
                        <div className='modal-footer-protocol'>
                                <span onClick={
                                ()=>{
                                this.showProp(2);
                                }
                                }>我知道了</span>
                            </div>
                    </div>
                }
            </div>
        );
    }
}
export default Connect()(Widget);
