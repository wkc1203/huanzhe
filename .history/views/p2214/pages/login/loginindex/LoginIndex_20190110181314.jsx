import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import { Link } from 'react-router';
import * as Api from './loginIndexApi';
import {validators} from '../../../utils/validator';

import './style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    constructor(props) {
        super(props);
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

    componentDidMount() {
          this.getJs();
          window.addEventListener("popstate", function(e) {
              this.alert("1")
              var stateObj = { foo: "bar" };
              var url=window.location.origin+"/views/p2214/#/home/index?_k=dpmr28";
              history.pushState(stateObj, "", "url");
          
        }, false);
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
               this.context.router.goBack();
        }, 1000);
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
// 提交时弹框提示

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
            .getValidate({type:'login',phone: this.state.phone})
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

                }
            }, (e) => {
                if(e.code!=990&&e.code!=999){
                      this.setState({
                          msg:e.msg,
                          showIOS1: true
                      })
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
                toptip: '您未同意医患在线就诊协议'
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
                            this.context.router.goBack();
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
                                        type="number"
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
                            }>医患在线就诊协议</span>

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
                {isShowProtocol && <div className='modal'>
                    <div className='modal-body-protocol'>
                        <div className='modal-title'>用户协议</div>
                        <div className='modal-content-protocol'>
                            <div >
                                <div className="content-title">
                                    儿童健康圈公众号（以下简称本平台）是由重庆医科大学附属儿童医院提供医疗专家团队，重庆凯桥信息技术有限公司负责建设与运营的儿童健康管理平台。
                                </div>
                                <div className="content-title">一、条款确认</div>
                                <div className="content-item">1.1 用户注册使用前应仔细阅读本《用户协议》（以下简称本协议）。</div>
                                <div className="content-item">1.2
                                    任何使用本平台的某项功能、某一部分，或以其他间接方式使用的行为，均即视为同意并接受本协议，接受本协议所有条款约定和相应法律责任。
                                </div>
                                <div className="content-item">1.3
                                    本平台可根据情况制订、修改本协议及条款，修改后需经用户重新阅读并确认，如用户确认接受修改协议或条款，变更协议和条款自动产生法律效应。
                                </div>
                                <div className="content-title">二、账号管理</div>
                                <div className="content-item">2.1
                                    用户添加就诊人资料时，需提供真实、及时、完整和合法有效的资料，若提供的资料信息并非真实、完整、有效，本平台有权停止、冻结用户的就诊卡并要求用户承担因此造成的法律后果。
                                </div>
                                <div className="content-item">2.2
                                    用户需妥善保管自身就诊卡、微信账号等个人资料，不得以任何方式将就诊卡、微信账号等个人资料转让、告知或借给他人。如因上述或其他缘故导致就诊卡、微信账号等个人资料遗失、被盗或用户信息泄露等情况致使自身相关权益受到损害的，皆有用户独自承担一切后果。
                                </div>
                                <div className="content-item">2.3
                                    用户如发现就诊卡、微信账号等个人资料被非法使用或其他异常状况，请立即通知本平台客服人员，客服人员验证用户有效身份后可暂停该就诊卡、微信账号等的登录和使用，待相关部门查实审核后，如无异常状况即可恢复使用。
                                </div>
                                <div className="content-title">三、服务内容</div>
                                <div className="content-item">3.1
                                    本平台是以（包括但不限于）微信、PC端、APP为依托搭建的新型医患在线，用户和医务人员可通过本平台产生互动，实现线上医患互动、档案管理、慢病管理等功能。
                                </div>
                                <div className="content-item">3.2 用户应当遵循本协议的约定发表言论、提供信息，对以下几类问题医务人员有权不予回复：</div>
                                <div className="content-item">（1）非医疗健康类问题，如动物疾病问题、社会意识形态问题等；</div>
                                <div className="content-item">（2）医疗司法举证或询证问题；</div>
                                <div className="content-item">（3）胎儿性别鉴定问题；</div>
                                <div className="content-item">（4）未按提问要求提问，如提问时未指定医生，却要求具体医生回复；</div>
                                <div className="content-item">（5）有危害他人/自己可能的问题；</div>
                                <div className="content-item">（6）追问医生个人信息的问题；</div>
                                <div className="content-item">（7）故意挑逗、侮辱医生的提问。</div>
                                <div className="content-item">3.3
                                    用户在健康咨询过程中需提供真实、完整、详细的信息，医务人员以此信息为判定基础，并尽可能利用所掌握的医学知识及临床经验给予一定的解惑。如需获得更详细、全方位和更确切的医疗信息和诊治服务，建议选择到医院实地就诊。
                                </div>
                                <div className="content-item">3.4
                                    用户在使用过程中应遵守平台相关规定，且根据病情需要去医院诊疗的患者，请按医院正规流程就诊，并遵守医院相关规定挂号就诊。否则因此造成的一切后果均由用户自行承担。
                                </div>
                                <div className="content-item">3.5
                                    用户在使用过程中的言行需遵守国家法律、法规等，不违背社会公共利益或公共道德，不损害他人的合法权益，不违反本协议所列条款议。
                                </div>
                                <div className="content-title">四、服务的暂停、变更、中止与终止</div>
                                <div className="content-item">4.1 用户如提供虚假信息或实施其他违反本协议的行为，本平台有权立即中止对用户提供全部或部分服务。</div>
                                <div className="content-item">4.2
                                    用户如在使用过程中实施不正当行为，本平台有权终止服务，由此造成的法律和经济后果由用户承担，不正当行为包含但不限于以下方面：
                                </div>
                                <div className="content-item">（1） 用户有发布医托、强烈广告性质的内容的行为；</div>
                                <div className="content-item">（2） 用户从中国境内向外传输技术性资料时违背中国有关法律法规行为；</div>
                                <div className="content-item">（3） 用户使用本服务从事洗钱、窃取商业秘密等非法用途；</div>
                                <div className="content-item">（4）
                                    用户以包括但不限于盗用他人账号、恶意编造或虚构信息、恶意投诉、未经允许进入他人电脑或手机系统等方式干扰或扰乱本服务；
                                </div>
                                <div className="content-item">（5）
                                    用户有传输非法、骚扰性、影射或中伤他人、辱骂性、恐吓性、伤害性、庸俗、带有煽动性、可能引起公众恐慌、淫秽的、散播谣言等信息资料的行为；
                                </div>
                                <div className="content-item">（6）
                                    用户有传输教唆他人构成犯罪行为、危害社会治安、侵害自己或他人人身安全的资料，传输助长国内不利条件和涉及国家安全的资料，传输不符合当地法规、国家法律和国际法律的资料的行为；
                                </div>
                                <div className="content-item">（7） 用户有发布涉及政治、性别、种族歧视或攻击他人的文字、图片或语言等信息；</div>
                                <div className="content-item">（8） 用户有其他发布违法信息、严重违背社会公德、违背本协议或补充协议、违反法律禁止性规定的行为。</div>
                                <div className="content-title">五、用户信息</div>
                                <div className="content-item">5.1
                                    本平台会积极保障用户的个人信息资料（包括个人身份信息及其他信息、用户使用本平台服务过程中提供、形成信息中的非公开内容等）安全并采用必要措施。
                                </div>
                                <div className="content-item">5.2
                                    未经用户许可，本平台不得向任何第三方提供、公开或共享用户注册资料中的姓名、个人有效身份证件号码、联系方式、家庭住址等个人信息资料，但下列情况除外：
                                </div>
                                <div className="content-item">（1） 用户或其监护人授权披露的；</div>
                                <div className="content-item">（2） 司法机关或行政机关基于法定程序要求提供或协助的。</div>
                                <div className="content-title">六、特别授权</div>
                                <div className="content-item">6.1
                                    用户同意并授权本平台为储存、保护用户个人信息资料而与第三方进行合作建立信息数据库，授权本平台为用户提供服务过程中因服务需求与第三方共享个人信息及信息数据库。
                                </div>
                                <div className="content-item">6.2 用户同意并授权本平台在不泄露个人信息资料的前提下，对个人信息数据库进行医学分析及大数据信息收集。</div>
                                <div className="content-item">6.3
                                    用户同意并接受本平台通过短信、电话、电子邮件、即时通信的客户端（网页）或者其他合法方式，向发送包括订单信息、专题推荐、促销活动等信息。
                                </div>
                                <div className="content-title">七、知识产权</div>
                                <div className="content-item">7.1
                                    何单位或个人不得以任何方式全部或部分复制、转载、引用、链接、抓取或以其他方式使用本平台的信息内容，如有违反，本平台有权追究其法律责任。
                                </div>
                                <div className="content-item">7.2
                                    本平台有权对本协议条款不时地进行修改，并在本平台张贴，无须另行通知用户，本平台对本协议及本客户端内容拥有解释权。
                                </div>
                                <div className="content-title">八、协议的中止或终止</div>
                                <div className="content-item">8.1 用户的任何意见和建议均可通过客服电话、微信向工作人员反馈，经协商后双方如达成一致，则对协议相关内容进行调整。
                                </div>
                                <div className="content-item">8.2
                                    若用户违反本协议或相关规定，工作人员多次交涉未果，或因用户的行为造成损失的，本平台有权终止与用户的协议，并冻结用户个人账号。
                                </div>
                                <div className="content-title">九、不可抗力及免责条款</div>
                                <div className="content-item">9.1
                                    因台风、地震、海啸、洪水、停电、战争、恐怖袭击等国际通用不可抗力因素造成的损失（包括但不限于信息损失，服务中断，资料灭失），本平台在法律允许的范围内免责。
                                </div>
                                <div className="content-item">9.2 在法律允许的范围内，对以下情形导致的服务中断或受阻不承担责任：</div>
                                <div className="content-item">1）受到计算机病毒、木马或其他恶意程序、黑客攻击的破坏；</div>
                                <div className="content-item">2）用户或电脑软件、系统、硬件和通信线路出现故障；</div>
                                <div className="content-item">3）用户操作不当；</div>
                                <div className="content-item">4）用户通过非授权的方式使用服务；</div>
                                <div className="content-item">9.3
                                    本服务同大多数互联网服务一样，能受各个环节不稳定因素的影响，比如计算机病毒或者黑客攻击等造成的服务中断或不能满足用户要求的风险，用户须理解和认可，并承担以上风险。
                                </div>
                                <div className="content-item">9.4
                                    在使用本服务的过程中，可能会遇到网络信息或其他用户行为带来的风险，本平台不对任何信息的真实性、适用性、合法性承担责任，也不对因侵权行为给用户造成的损害（包括但不限于信息损失，服务中断，资料灭失）负责。这些风险包括但不限于：
                                </div>
                                <div className="content-item">1）来自他人匿名或冒名的含有威胁、诽谤、令人反感或非法内容的信息；</div>
                                <div className="content-item">2）因使用本协议项下的服务，遭受他人误导、欺骗或其他导致或可能导致的任何心理、生理上的伤害以及经济上的损失；
                                </div>
                                <div className="content-item">3）其他因网络信息或用户行为引起的风险。</div>
                                <div className="content-item">9.5
                                    不论在何种情况下，本平台均不对由于网络连接故障，电脑，通讯或其他系统的故障，电力故障，罢工，劳动争议，暴乱，起义，骚乱，生产力或生产资料不足，火灾，洪水，风暴，爆炸，不可抗力，战争，政府行为，国际、国内法院的命令或第三方的不作为而造成的不能服务或延迟服务承担责任。
                                </div>
                                <div className="content-title">十、法律适用及其他</div>
                                <div className="content-item">10.1
                                    本协议的订立、执行、解释及争议的解决均应适用中国人民共和国法律及法规。如发生本协议部分内容与适用法律相抵触时，此部分协议抵触内容应以适用法律为准，同时此部分协议抵触内容不影响协议其他部分的效力，即协议其他部分继续有效。
                                </div>
                                <div className="content-item">10.2
                                    因本协议产生之争议，由双方协商解决；协商不成的，任何一方都有权向有管辖权的中华人民共和国大陆地区法院提起诉讼。
                                </div>
                                <div className="content-end">儿童健康圈</div>
                                <div className="content-end">二〇一八年七月</div>
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
                </div>
                }
            </div>

        );
    }
}

export default Connect()(Widget);
