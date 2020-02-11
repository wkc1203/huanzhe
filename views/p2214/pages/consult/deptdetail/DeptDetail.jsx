import React, { Component } from 'react';
import { Link } from 'react-router';
import { Button, Toptips, Switch, Dialog, Toast } from 'react-weui';
import DoctorInfo1 from './component/DoctorInfo1';
import DoctorInfo from './component/DoctorInfo';
import DataItems from './component/DataItems';
import DoctorIntro from './component/DoctorIntro';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import * as Utils from '../../../utils/utils';
import * as Api from '../../../components/Api/Api';
import 'style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
            hidden: false,
            isShowTip: false,
            footShow: false,
            isShowProtocol: false,
            isFavorite: false,
            doctorId: '1',
            showToast: false,
            showLoading: false,
            toastTimer: null,
            toastTitle: '',
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
                title: '你还有对当前医生的咨询未完成',
                buttons: [
                    {
                        type: 'default',
                        label: '取消',
                        onClick: Utils.hideDialog.bind(this)
                    },
                    {
                        type: 'primary',
                        label: '继续咨询',
                        onClick: this.goInquiry.bind(this)
                    }
                ]
            },
            msg: '',
            deptId: '1',
            docInfo: {},
            evaluate: [],
            currentPage: 1,
            pageCount: 1,
            pageNum: 1,
            t1: { text: '态度好', show: false },
            t2: { text: '及时回复', show: false },
            t3: { text: '解答详细', show: false },
            t4: { text: '很专业', show: false },
            t5: { text: '非常感谢', show: false },
            totalCount: 0,
            totalFee: 0,
            leftTime: 7,
            inquiryId: '',
            type: '1',
            stopDocter:"" //停用医生弹窗
        };
    }
    componentDidMount() {
        //console.log(this.props.location.query,"this.props.location.query")
        
        if (window.localStorage.login_access_token) {
            window.localStorage.login_access_token1 = window.localStorage.login_access_token;
        }
        if (this.props.location.query.resource == 5) {
            this.sum1(2, this.props.location.query.doctorId);
        }
        ;
        if (!!window.localStorage.openId) {
            Utils.sum('doctor', 1)
        } else {
            var code = '';
            if (window.location.origin == 'https://tih.cqkqinfo.com') {
                code = 'ff80808165b46560016817f20bbc00b3';

            } else {
                code = 'ff80808165b46560016817f30cc500b4';
            }
            var storage = window.localStorage;
            //加入缓存
            storage.isOpenId = 1;
            window.location.href = "https://wx.cqkqinfo.com/wx/wechat/authorize/" + code + "?scope=snsapi_base";
            // return false;
            var storage = window.localStorage;
            //加入缓存
            storage.url = window.location.href;
        }
        this.getJs();
        document.getElementById("home").scrollIntoView();
        this.setState({
            doctorId: this.props.location.query.doctorId,
            deptId: this.props.location.query.deptId,
        })
        this.getDeptDetail(this.props.location.query.doctorId, this.props.location.query.deptId);
        this.getEvaluateList(1, this.props.location.query.doctorId, this.props.location.query.deptId);
        if(window.localStorage.showTip==1){
            this.jumpConfirminfo(window.localStorage.remune?window.localStorage.remune:1)
        }
        
    }
    changeStyle() {
        this.setState({
            hidden: false
        })
    }
    showToast() {
        this.setState({ showToast: true });
        this.state.toastTimer = setTimeout(() => {
            this.setState({ showToast: false });
        }, 2000);
    }
    sum1(type, doctorId) {
        Api
            .getSum({
                hisId: '2214',
                type: type,
                doctorId: doctorId,
            })
            .then((res) => {
            }, (e) => {
            });
    }
    goInquiry() {
        this.setState({
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            showAndroid2: false,
        });
        this.context.router.push({
            pathname: '/inquiry/chat',
            query: { inquiryId: this.state.inquiryId }
        })
    }
    getJs() {
        Api
            .getJsApiConfig({ url: window.location.href.substring(0, window.location.href.indexOf("#")) })
            .then((res) => {
                console.log(res);
                if (res.code == 0) {   
                    //写入b字段
                    console.log("str", res.data);
                    wx.config({ 
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: res.data.appId, // 必填，公众号的唯一标识
                        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: res.data.noncestr, // 必填，生成签名的随机串
                        signature: res.data.signature,// 必填，签名
                        jsApiList: ['updateTimelineShareData', 'onMenuShareAppMessage', 'hideMenuItems', 'showMenuItems', 'updateTimelineShareData'] // 必填，需要使用的JS接口列表
                    });
                    wx.ready(function () {
                        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                        wx.showMenuItems({
                            menuList: ["menuItem:copyUrl", "menuItem:openWithQQBrowser", "menuItem:share:appMessage", "menuItem:share:timeline"
                                , "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:favorite", "menuItem:share:QZone",
                                "menuItem:openWithSafari"] // 要显示的菜单项，所有menu项见附录3
                        });
                    });
                }
            }, (e) => {
            });
    }

    /*获取医生信息*/
    getDeptDetail(doctorId, deptId) {
        this.showLoading(); 
        Api
            .getDeptDetail({ doctorId: doctorId, deptId: deptId })
            .then((res) => {
                console.log(res,"ressss")
                this.hideLoading();
                this.setState({
                    stopDocter:res.code,
                    isFavorite: res.data.isFavorite,
                    docInfo: res.data.doctor,
                    
                });
                console.log(this.state.stopDocter,"stopDocter");
                
                this.setState({
                    type: res.data.doctor.type == '2' ? '2' : '1'
                })
                var that = this;
                var pm = res.data.doctor;
                var url = location.href;
                if (location.href.indexOf('resource') != -1) {
                    if (location.href.substring(location.href.indexOf('resource') + 9, location.href.indexOf('resource') + 10) == '2') {
                        url = location.href.substring(0, location.href.indexOf('resource') + 9) + '2' + location.href.substring(location.href.indexOf('resource') + 10, location.href.length);
                    }
                }
                wx.ready(function () {
                    var name='';
                     if(pm.type=='1'){
                       name='医生';
                     }else{
                        name='护士';
                     }
                    //需在用户可能点击分享按钮前就先调用
                    wx.onMenuShareAppMessage({
                        title: pm.name + "|" + pm.hisName + "|" + pm.level, // 分享标题
                        desc:'我刚刚咨询了'+pm.name+name+'，推荐给大家，点击链接可以直接在线咨询', // 分享描述
                        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: pm.image, // 分享图标 
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                            // 用户点击了分享后执行的回调函数 
                        }
                    });
                    wx.updateTimelineShareData({
                        title: pm.name + "|" + pm.hisName + "|" + pm.level,  // 分享标题
                        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: pm.image, // 分享图标
                        success: function () {
                            // 用户点击了分享后执行的回调函数
                        },
                    })

                })
            }, (e) => {
                this.hideLoading();
                this.setState({
                    stopDocter:e.code,
                })
                console.log(e,11111)
                
            });
    }
    /*获取评价列表*/
    getEvaluateList(pageNum, doctorId, deptId) {
        Api
            .getEvaluateDet({ pageNum: pageNum, doctorId: doctorId, deptId: deptId })
            .then((res) => {
                this.hideLoading();
                this.setState({
                    currentPage: res.data.currentPage,
                    pageCount: res.data.pageCount,
                    totalCount: res.data.totalCount,
                    evaluate: this.state.evaluate.concat(res.data.recordList)
                });
                var eList = [];
                eList = this.state.evaluate;
                for (var i = 0; i < eList.length; i++) {
                    if (eList[i].appraisalLabel) {
                        var str = [];
                        if (eList[i].appraisalLabel.indexOf("-") != -1) {
                            str = eList[i].appraisalLabel.split('-');
                        } else {
                            str = eList[i].appraisalLabel.split('/');
                        }
                        var strs = [];
                        for (var j = 0; j < str.length; j++) {
                            if (str[j] != '') {
                                if (str[j] == "undefined态度好") {
                                    str[j] = "态度好";
                                }
                                strs.push(str[j]);
                            }
                        }
                        eList[i].ping = strs;
                    }
                }
                this.setState({
                    evaluate: eList
                })
            }, (e) => {
            });
    }
    /*倒计时*/
    clock() {
        this.clockTimer = setTimeout(() => {
            var leftTime = this.state.leftTime;
            --leftTime;
            if (leftTime <= 0) {
                this.setState({
                    footShow: true
                })
                clearTimeout(this.clockTimer);
            } else {
                this.setState({
                    leftTime: leftTime
                })
                this.clock();
            }
        }, 1000);
    }
    /*是否关闭须知*/
    switchTip(flag) {
        this.setState({
            isShowTip: flag == '1'
        })
    }
    /*获取用户信息*/
    getUser(remune) {

        Api
            .getUser()
            .then((res) => {
                if (res.code == 0) {
                    this.setState({
                        userInfo: res.data,
                        userId: res.data.id
                    })
                    var storage = window.localStorage;
                    //加入缓存
                    storage.userInfo = JSON.stringify(res.data);
                    this.setState({
                        isShowProtocol: true,
                        totalFee: remune
                        // totalFee:res.data.doctor.inquirys[0].remune
                    });
                    var html = document.getElementsByTagName('html')[0];
                    var body = document.getElementsByTagName('body')[0];
                    html.setAttribute('style', 'height:100%;overflow:hidden;');
                    body.setAttribute('style', 'height:100%;overflow:hidden;');
                    this.clock();
                }
            }, (e) => {
            });
    }
    /*进入新建咨询页面*/
    jumpConfirminfo(remune) {
        console.log('remune=',remune)
        this.showLoading();
        Api
            .isRegister()
            .then((res) => {
                if (res.code == 0) {
                    if (res.msg == 'hasBind') {
                        this.hideLoading();
                        window.localStorage.showTip=0;
                        this.getUser(remune);
                    } else {
                        var code = '';
                        if (window.location.origin == 'https://tih.cqkqinfo.com') {
                            code = 'ff80808165b465600168276e19d200e6';
                        } else {
                            code = 'ff80808165b46560016827701f7e00e7';
                        }
                        var storage = window.localStorage;
                        //加入缓存
                        storage.isOpenId = 1;
                        storage.showTip=1;
                        storage.remune=remune;
                        window.location.href = "https://wx.cqkqinfo.com/wx/wechat/authorize/" + code + "?scope=snsapi_base";
                        // return false;
                        var storage = window.localStorage;
                        //加入缓存
                        storage.url = window.location.href;
                    }
                }else{
                    window.localStorage.showTip=1;
                    window.localStorage.remune=remune;
                }
            }, (e) => {
                this.hideLoading();
                window.localStorage.showTip=1;
                window.localStorage.remune=remune;
            });
    }
    componentWillUnmount() {
        var html = document.getElementsByTagName('html')[0];
        var body = document.getElementsByTagName('body')[0];
        html.setAttribute('style', 'background:#F2F2F2');
        body.setAttribute('style', 'background:#F2F2F2');
    }
    /*关闭须知*/
    cancelModal() {
        this.setState({
            isShowProtocol: false,
            footShow: false
        })
        var html = document.getElementsByTagName('html')[0];
        var body = document.getElementsByTagName('body')[0];
        html.setAttribute('style', 'background:#F2F2F2');
        body.setAttribute('style', 'background:#F2F2F2');
    }
    /*显示更多评价*/
    addMore(cur) {
        this.getEvaluateList(cur + 1, this.state.doctorId, this.state.deptId);
    }
    /*收藏*/
    switchCollect(isFavorite) {
        const { doctorId, deptId } = this.state;
        if (!isFavorite) {
            Api
                .addCollect({ doctorId, deptId })
                .then((res) => {
                    if (res.code == 0) {
                        this.showToast();
                        this.setState({
                            isFavorite: true,
                            toastTitle: "收藏成功"
                        });
                    }
                }, e => {
                });
        } else {
            Api
                .cancelCollect({ doctorId, deptId })
                .then((res) => {
                    if (res.code == 0) {
                        this.showToast();

                        this.setState({
                            isFavorite: false,
                            toastTitle: "取消收藏成功"
                        });
                    }
                }, e => {
                });
        }
    }
    
    render() {
        const { docInfo, isShowTip, msg, footShow, isShowProtocol, isFavorite, evaluate, currentPage, pageCount,
            totalCount, totalFee, leftTime, toastTitle, type,stopDocter } = this.state;
        console.log('33333')
        console.log("doc11", docInfo)
        return (

            <div className="page-dept-detail container1" style={{height:'auto'}}>
                <div className='share ' onClick={()=>{                  
                    this.setState({
                        hidden:false     
                    })
                }} style={{display:this.state.hidden?'block':'none'}}>
                    <img src='./././resources/images/djfx@2x.png' />
                </div>
                <div className='adviceDoctor'>
                    <img className='adviceDoctor1'
                        onClick={() => {
                            if (!window.localStorage.login_access_token) {
                                var code;
                                if (window.location.origin == 'https://tih.cqkqinfo.com') {
                                    code = 'ff80808165b46560016817f20bbc00b3';
                                } else {
                                    code = 'ff80808165b46560016817f30cc500b4';
                                }
                                var storage = window.localStorage;
                                //加入缓存
                                storage.isOpenId = 1;
                                window.location.href = "https://wx.cqkqinfo.com/wx/wechat/authorize/" + code + "?scope=snsapi_base";
                                // return false;
                                var storage = window.localStorage;
                                //加入缓存
                                storage.url = window.location.href;
                            } else {
                                this.context.router.push({
                                    pathname: '/usercenter/mysuggestion',
                                    query: { type: 1, deptName: docInfo.deptName, deptId: docInfo.deptId, doctorName: docInfo.name, doctorId: docInfo.doctorId, resource: this.props.location.resource,docType:type }
                                })
                            }
                        }}
                        src='./././resources/images/jy@2x.png' />
                </div>

                <div className="home" id="home"><span className="jian"
                    onClick={() => {
                        if (this.props.location.query.resource == 2) {

                            this.context.router.goBack();

                        } else {
                            this.context.router.push({
                                pathname: 'home/index'
                            })
                        }
                    }}
                ></span>  {type == '2' ? '护士名片' : '专家名片'}
                </div>
                <Toast icon="success-no-circle" show={this.state.showToast}>{toastTitle}</Toast>
                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons}
                    show={this.state.showIOS1}>
                    {msg}
                </Dialog>
                <Dialog type="ios" title={this.state.style2.title} buttons={this.state.style2.buttons}
                    show={this.state.showIOS2}>
                    {msg}
                </Dialog>
                <div className='header2' id="head">
                    <img src='./././resources/images/fx@2x.png' className='adviceimg' onClick={()=>{
                        this.setState({
                            hidden:true
                        })
                    }}/>
                    <span className='fx'>分享</span>

                  
                     <img className='advice1img'
                        onClick={() => {
                            console.log("1")
                            this.switchCollect(isFavorite)
                        }}
                        src='./././resources/images/sc@2x.png' />
                        {isFavorite &&<span className='sc' style={{right:'52px'}}>已收藏</span>}
                        {!isFavorite &&<span className='sc'>收藏</span>}
                    <div className='doctor2'>
                        <img className="doc-img" src={docInfo.image && docInfo.image.indexOf("ihoss") == '-1' ? docInfo.image : docInfo.image + "?x-oss-process=image/resize,w_105"} alt="医生头像" />
                        <div className='text1-box'>
                            <div>
                                <a style={{ fontWeight: 'bold', fontSize: '16px', paddingRight: '15px' }}>{docInfo.name}</a>
                            </div>
                            <div style={{ fontSize: '12px' }}> <a >{docInfo.deptName} | {docInfo.level}</a></div>
                            <div style={{ fontSize: '13px' }}>{docInfo.hisName}</div>
                        </div>
                    </div>
                    <div className='data'>
                        <DataItems serviceTimes={docInfo.serviceTimes} dan='人' txt='服务'>  </DataItems>
                        <DataItems serviceTimes='98' txt='好评率' dan='%'>  </DataItems>
                        <DataItems serviceTimes={docInfo.workingLife} dan='年' txt='从业年限'>  </DataItems>
                    </div>
                </div>
                <div className="open">
                    <img
                        src='./././resources/images/doctor-open.png' />
                    <span> 您好，很高兴为您服务！</span>
                </div>
                <div className='content'>
                    <div className='d-tab'>
                        <div className="main-func">
                            {docInfo.inquirys && docInfo.inquirys.map((item1, index1) => {
                                return (
                                    <div key={index1}
                                        onClick={
                                            () => {
                                                this.jumpConfirminfo(item1.remune)
                                            }
                                        }
                                        className={` ${item1.type == '1' && item1.isOnDuty == '1' && item1.isFull == '0' ? 'inquity-item' : 'disNo'}`}>
                                        <div className='icon'>
                                            <img src="./././resources/images/doctor-picture.png" />
                                        </div>
                                        <div className='text'>
                                            <div>图文咨询</div>
                                        </div>
                                        <div className='des-fee'>￥{(item1.remune / 100).toFixed(2)}<span>/次</span></div>
                                    </div>
                                )
                            })}
                            {docInfo.inquirys && docInfo.inquirys.map((item2, index2) => {
                                return (
                                    <div
                                        key={index2}
                                        className={`${item2.type == '1' && item2.isFull == '1' && item2.isOnDuty !== '0' ? 'inquity-item' : 'disNo'}`}>
                                        <div className='icon no-data2'>
                                            <span>已满</span>
                                            <img src="./././resources/images/doctor-picture.png" />
                                        </div>
                                        <div className='text'>
                                            <div>
                                                <text className="f-color-gray">图文咨询</text>
                                            </div>
                                        </div>
                                        <div className='des'>￥{(item2.remune / 100).toFixed(2)}<span>/次</span></div>
                                    </div>
                                )
                            }
                            )}
                            {docInfo.inquirys && docInfo.inquirys.map((item2, index2) => {
                                return (
                                    <div
                                        key={index2}
                                        className={`${item2.type == '1' && item2.isOnDuty == '0' ? 'inquity-item' : 'disNo'}`}>
                                        <div className='icon no-data1'>
                                            <span>离线</span>
                                            <img src="./././resources/images/doctor-picture.png" />
                                        </div>
                                        <div className='text'>
                                            <div>
                                                <text className="f-color-gray">图文咨询</text>
                                            </div>
                                        </div>
                                        <div className='des'>￥{(item2.remune / 100).toFixed(2)}<span>/次</span></div>
                                    </div>
                                )
                            }
                            )}
                            <DoctorInfo img='./././resources/images/doctor-phone.png' txt='电话咨询'></DoctorInfo>
                            <DoctorInfo img='./././resources/images/doctor-vedio.png' txt='视频咨询'></DoctorInfo>
                        </div>
                        {type == '1' && <div className="main-func1">
                            {docInfo.freeReport == '1' && <DoctorInfo1 img='./././resources/images/doctor_report_open.png' txt='报告解读' txt1='免费报告解读' url='/consult/report' doctorId={docInfo.doctorId} deptId={docInfo.deptId} com='2'></DoctorInfo1>}
                            {docInfo.freeReport !== '1' && <DoctorInfo1 img='./././resources/images/doctor-report.png' txt='报告解读' txt1='免费报告解读' url=''></DoctorInfo1>}
                            <DoctorInfo1 img='./././resources/images/doctor-check.png' txt='检验检查' txt1='在线申请检验检查' url=''></DoctorInfo1>
                            {(docInfo.doctorId== '900' || docInfo.doctorId== '001') && <DoctorInfo1 img='./././resources/images/describe_mb.png' txt='慢病/处方' txt1='在线申请处方' url='/consult/describe' doctorId={docInfo.doctorId} deptId={docInfo.deptId} com='2'></DoctorInfo1>}
                            {(docInfo.doctorId!= '900' && docInfo.doctorId!= '001') && <DoctorInfo1 img='./././resources/images/doctor-check.png' txt='慢病/处方' txt1='在线申请处方' url=''></DoctorInfo1>
                            }
                        </div>}
                    </div>
                    <DoctorIntro img='./././resources/images/doctor-special.png' txt='认证信息' txt1={docInfo.doctorInfoVo?'医生执业证书编码：'+docInfo.doctorInfoVo.practiceNumber :'暂未认证'}  txt2={docInfo.doctorInfoVo?'医生执业范围：'+docInfo.doctorInfoVo.practiceScope : ''} txt3={docInfo.doctorInfoVo?'已认证':"未认证"}></DoctorIntro>
                    <DoctorIntro img='./././resources/images/doctor-special.png' txt='擅长领域' txt1={docInfo.specialty || '暂无描述'} ></DoctorIntro>
                    <DoctorIntro img='./././resources/images/doctor-intro.png' txt={type == '2' ? '护士介绍' : '医生介绍'} txt1={docInfo.introduction || '暂无介绍'} ></DoctorIntro>
                </div>
                <div className='evaluate'>
                    <div className='eva-title'>
                        <div>
                        </div>
                        患者评价<span>共{totalCount || '0'}次</span></div>
                    {evaluate.map((item3, index3) => {
                        return (
                            <div className='eva-content' key={index3}>
                                <div>{item3.nameStr}
                                    {item3.score < 1 &&
                                        <img src="./././resources/images/star.png"
                                            alt="" />}
                                    {item3.score >= 1 &&
                                        <img src="./././resources/images/star-active.png"
                                            alt="" />}
                                    {item3.score < 2 &&
                                        <img src="./././resources/images/star.png"
                                            alt="" />}
                                    {item3.score >= 2 &&
                                        <img src="./././resources/images/star-active.png"
                                            alt="" />}
                                    {item3.score < 3 &&
                                        <img src="./././resources/images/star.png"
                                            alt="" />}
                                    {item3.score >= 3 &&
                                        <img src="./././resources/images/star-active.png"
                                            alt="" />}
                                    {item3.score < 4 &&
                                        <img src="./././resources/images/star.png"
                                            alt="" />}
                                    {item3.score >= 4 &&
                                        <img src="./././resources/images/star-active.png"
                                            alt="" />}
                                    {item3.score < 5 &&
                                        <img src="./././resources/images/star.png"
                                            alt="" />}
                                    {item3.score >= 5 &&
                                        <img src="./././resources/images/star-active.png"
                                            alt="" />}
                                    <span>{item3.createTimeStr}</span></div>
                                <div>{item3.appraisal}</div>
                                {item3.appraisalLabel &&
                                    <div className="ping-content">
                                        {item3.ping && item3.ping.map((item4, index4) => {
                                            return (
                                                <div className={`${item4 == '' ? 'disNo' : ''}`}
                                                    key={index4}
                                                    style={{ marginRight: '10px' }}>
                                                    {item4}
                                                </div>
                                            )
                                        }
                                        )
                                        }
                                    </div>}
                            </div>
                        )
                    })}
                    {evaluate.length <= 0 &&
                        <div className="wgt-empty-box">
                            <img className="wgt-empty-img" src="./././resources/images/no-result.png" alt=""></img>
                            <div className="wgt-empty-txt">暂未查询到相关信息
                        </div>
                        </div>
                    }
                    {currentPage < pageCount &&
                        <div className='more'
                            onClick={() => {
                                this.addMore(currentPage)
                            }}
                        >查看更多评价
                    </div>}
                </div>
                {isShowProtocol && <div className='modal1'>
                    <div className='modal-body-protocol'>
                        <div className='modal-title'>温馨提示</div>
                        <div className='modal-content-protocol'>
                            <div className="content">
                                <div className="content-item">您即将向{docInfo.name}{type == '2' ? '护士' : '医生'}进行图文咨询，
                                {
                                    totalFee!=0?
                                    <span>试运行期间<span
                                        className="f-color-red">咨询费{(totalFee / 100).toFixed(2)}元/次,</span></span>:null
                                }
                                <span className="f-color-red">每次咨询可追问4个问题，若{type == '2' ? '护士' : '医生'}回复咨询，有效期为48小时。</span>
                                若{type == '2' ? '护士' : '医生'}未在24小时内回复您的咨询，系统将自动关闭本次咨询并自动为您退款，因{type == '2' ? '护士' : '医生'}回复咨询需一定的时间，<span className="f-color-red">如需急诊的患者，请自行前往医院就诊。</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {footShow && <div className='modal-footer'> 
                        <span onClick={() => {
                            this.cancelModal()
                        }}>取消</span>
                        <Link
                            to={{
                                pathname: 'consult/confirminfo',
                                query: { doctorId: docInfo.doctorId, deptId: docInfo.deptId, totalFee: totalFee, com: 2, type: this.state.type }
                            }}
                        >确认</Link>
                    </div>}
                    {!footShow && <div className='modal-footer'>
                        <div className="cutdown-time">请阅读 {leftTime} s</div>
                    </div>}
                </div>}

                {stopDocter==-1 && <div className='modal1'>
                    <div className='modal-body-protocol matop'>
                        <div className='modal-title'>温馨提示</div>
                        <div className='modal-content-protocol'>
                            <div className="contentStop">
                            您好，<span>{docInfo.name}</span>医生暂未加入咨询平台，如需咨询可选择在线医生进行咨询，更多科室和医生将会陆续上线，请您留意！给您带来的不便，敬请谅解
                            </div>
                        </div>
                    </div>
                    <div className='modal-footer'> 
                        <Link
                            to={{
                                pathname: '/home/index',
                                query: { doctorId: docInfo.doctorId, deptId: docInfo.deptId, totalFee: totalFee, com: 2, type: this.state.type }
                            }}
                        >确认</Link>
                    </div>
                </div>}
                { stopDocter==-1&&
                    <div className="write">

                    </div>
                }
            </div>
        );
    }
}
export default Connect()(Widget);
