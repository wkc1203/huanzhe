import React, { Component } from 'react';
import { Link } from 'react-router';
import { Carousel } from 'antd-mobile';
import { Button, Toptips, Switch, Dialog, Toast } from 'react-weui';
import HomeIndex from '../../consult/deptdetail/component/HomeIndex';
import Connect from '../../../components/connect/Connect';
import Func from './component/Func';
import * as Api from '../../../components/Api/Api';
import './style/index.scss';
import { ImagePicker } from 'antd-mobile';
import * as Utils from '../../../utils/utils';
import hashHistory from 'react-router/lib/hashHistory';
var files = new Array();
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
           
            hasMsg: false,
            isOpen: false,
            isShowHome:true,
            doc: false,
            docList: [],
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
            msg: '',
            allShow: false,
            show: false,
            img: '',
        };
    }
    componentDidMount() {
       
        console.log("id", this.props.location.query.userId)
        if (!!this.props.location.query.userId) {


            var storage = window.localStorage;

            storage.hasUserId = this.props.location.query.userId;
        }
        if (!!window.localStorage.openId) {
            Utils.sum('index', 1);
            Utils.sum('index_inquiry_img', 1);
            Utils.sum('index_good_more', 1);
            Utils.sums('inquiry_img_banner', 2, 1);
            Utils.sums('online_checkList', 2, 1);
        } else {
            /* var code='';
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
                storage.url=window.location.href; */
        }
        window.localStorage.deptShow = '1';
        window.localStorage.deptAllShow = '1';
        // window.location.reload();
        window.localStorage.back = '0';
        this.selectDept('全部科室', '144');
        this.getJs();
        this.getMsg();
    }
    componentWillUnmount() {
        // 离开页面时结束所有可能异步逻辑
    }
    show() {
        wx.ready(function () {
            wx.chooseImage({
                count: 4, // 默认9
                sizeType: ['original', 'compress'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    // that.showLoading('上传中');
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    this.setState({
                        img: localIds[0]
                    })
                }
            })
        })
    }
    /*获取未读条数*/
    getMsg() {
        Api
            .getMsg()
            .then((res) => {
                if (res.code == 0 && res.data != null) {
                    if (res.data.length > 0) {
                        for (var i = 0; i < res.data.length; i++)
                            if (res.data[i].userReaded == '0') {
                                this.setState({
                                    hasMsg: true
                                })
                            }
                    }
                }
            }, (e) => {

            });
    }
    getJs() {
        Api
            .getJsApiConfig({ url: window.location.href.substring(0, window.location.href.indexOf("#")) })
            .then((res) => {
                if (res.code == 0) {
                    //写入b字段
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: res.data.appId, // 必填，公众号的唯一标识
                        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: res.data.noncestr, // 必填，生成签名的随机串
                        signature: res.data.signature,// 必填，签名
                        jsApiList: ['updateTimelineShareData', 'onMenuShareAppMessage', 'previewImage', 'hideMenuItems', 'showMenuItems', 'chooseImage', 'getLocalImgData', 'hideMenuItems', 'showMenuItems', 'previewImage', 'uploadImage', 'downloadImage'] // 必填，需要使用的JS接口列表
                    });
                    wx.ready(function () {
                        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                        wx.showMenuItems({
                            menuList: ["menuItem:copyUrl", "menuItem:openWithQQBrowser", "menuItem:share:appMessage", "menuItem:share:timeline"
                                , "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:favorite", "menuItem:share:QZone",
                                "menuItem:openWithSafari"] // 要显示的菜单项，所有menu项见附录3
                        });
                        wx.updateTimelineShareData({
                            title: '重医儿童医院互联网医院', // 分享标题
                            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: 'http://ihoss.oss-cn-beijing.aliyuncs.com/PIC/hospital/logo-2214.png', // 分享图标
                            success: function () {
                            }
                        })
                        wx.onMenuShareAppMessage({
                            title: '重医儿童医院互联网医院', // 分享标题
                            desc: '重庆首家公立互联网医院，新型冠状病毒感染肺炎免费在线咨询！', // 分享描述
                            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: 'http://ihoss.oss-cn-beijing.aliyuncs.com/PIC/hospital/logo-2214.png', // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {
                                // 用户点击了分享后执行的回调函数
                            }
                        });
                    });
                }
            }, (e) => {
            });
    }
    //底部跳转
    toNext(type) {
        if (type == 2) {
            hashHistory.replace({
                pathname: '/inquiry/inquirylist'
            });
        }
        if (type == 3) {
            hashHistory.replace({
                pathname: '/usercenter/home'
            });
        }
    }
    /*查询推荐医生*/
    selectDept(deptName, deptId) {
        this.setState({
            deptName: deptName
        })
        this.getDocList(deptId);
    }
    getDocList(deptId = '') {
        Api
            .getInfo({ numPerPage: 10, deptId, vagueName: '', pageNum: 1, type: '1' })
            .then((res) => {
                this.setState({
                    show: true,
                })
                if (res.code == 0 && res.data != null) {

                    var docList = [];
                    var data = [];
                    for (var i = 0; i < res.data.doctors.length; i++) {
                        if (res.data.doctors[i].type == '1') {
                            data.push(res.data.doctors[i])
                        }
                    }
                    if (data.length >= 5) {
                        for (var i = 0; i < 5; i++) {

                            docList.push(data[i]);
                        }
                        this.setState({
                            docList: docList,
                            doc: true,
                        });
                    } else {
                        for (var i = 0; i < data.length; i++) {
                            docList.push(data[i]);
                        }
                        this.setState({
                            docList: docList,
                            doc: true,
                        });
                    }

                }
            }, (e) => {
                this.setState({
                    msg: e.msg,
                    doc: true,
                    showIOS1: true
                })
            });
    }
    //统计
    //显示/隐藏正在建设中
    switchOpen(type) {
        if (type == 1) {
            this.setState({
                isOpen: true
            })
        } else {
            this.setState({
                isOpen: false
            })
        }
    }
    /*跳转到咨询列表*/
    switchInquiry() {
        this.context.router.push({
            pathname: '/inquiry/inquirylist',
        })
    }
    /*查看更多医生*/
    goDoctor() {
        Utils.sum('index_good_more', 2);
        this.context.router.push({
            pathname: '/consult/deptlist',
            query: { type: 1, source: 0,deptId:'144' }
        })
    }
    render() {
        const {
            isOpen,
            isShowHome,
            show,
            docList,
            doc,
            img,
            msg,
            hasMsg,
        } = this.state;
        return (
            /*首页*/
            <div className="page-home ">
                {/* img&&<img src={img}  />  <input type="file" id="file" class="filepath" onchange="changepic(this)" accept="image/*" />*/}


                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                    {msg}
                </Dialog>
                {<div className="header" >
                    <img
                        src="./././resources/images/index-banner-new.jpg"
                        alt=""
                    />
                    {<span className='moreInformation'
                        onClick={() => {
                            this.context.router.push({
                                pathname: '/hospitalInformation'
                            })
                        }}>更多信息</span>}
                </div>}
                {<div className="content">
                    <div className="head-des">
                        <div className="f-pa">
                            <div className="d-tab" onClick={() => {
                                Utils.sum('index_inquiry_img');
                                this.context.router.push({
                                    pathname:'/consult/deptlist',
                                    query:{deptName:'新型冠状病毒感染肺炎',deptId:144,source:1,type:1}
                                })
                            }}>
                                <div className="icon">
                                    <img
                                        src="./././resources/images/gzzx.png"
                                        alt=""
                                    />
                                     <img
                                        className="news"
                                        src="./././resources/images/new.png"
                                        alt=""
                                    />
                                </div>
                                <div className='text1 text-acitve'>新冠肺炎咨询</div>
                                {/*<div className='text2'>新型冠状病毒免费咨询</div>*/}
                                {/*<HomeIndex img='./././resources/images/doctor-phone.png' txt='慢病复诊'></HomeIndex>
                                <HomeIndex img='./././resources/images/doctor-phone.png' txt='多学科会诊'></HomeIndex>*/}
                            </div>
                            <div className="d-tab"
                                onClick={() => {
                                    Utils.sum('index_inquiry_img');
                                    this.context.router.push({
                                        pathname: '/consult/alldeptlist'
                                    })
                                }}>
                                <div className="icon">
                                    <img
                                        src="./././resources/images/zaixianwenzhen.png"
                                        alt=""
                                    />
                                   
                                </div>
                                <div className='text1 text-acitve'>在线问诊 </div>
                                {/*<div className='text2'>健康问题问医生</div>*/}
                            </div>
                            <div className="d-tab"
                                onClick={() => {
                                    this.setState({
                                        isShowHome:false
                                    })
                                    this.switchOpen(1)
                                }}>
                                <div className="icon">
                                    <img
                                        src="./././resources/images/fuzhengzhihui.png"
                                        alt=""
                                    />
                                   
                                </div>
                                <div className='text1'>诊后复诊 </div>
                                {/*<div className='text2'>健康问题问医生</div>*/}
                            </div>
                             <div className="d-tab" onClick={()=>{
                                this.setState({
                                    isShowHome:false
                                })
                                this.switchOpen(1)
                                }}>
                                    <div className="icon">
                                      <img
                                          src="./././resources/images/manbin.png"
                                          alt=""
                                          />
                                    </div>
                                      <div className='text1'>慢病诊疗</div>
                                      {/*<div className='text2'>合理用药问药师</div>*/}
                                </div>
                            <div className="d-tab" onClick={()=>{
                                this.setState({
                                    isShowHome:false
                                })
                                this.switchOpen(1) 
                       }}>
                        <div className="icon">
                        <img
                            src="./././resources/images/huizhen.png"
                            alt=""
                            />
                      </div>
                      <div className='text1'>多学科会诊</div>
                      {/*<div className='text2'>健康护理问护士</div>*/}
                </div>
                        </div>
                    </div>
                    <div className='title1 rightTab'><img
                        src="./././resources/images/index-more.png"
                        alt=""
                    />专家推荐<div onClick={() => {
                        this.goDoctor()
                    }}>更多</div></div>
                    <div className='doctor'>
                        <div style={{ height: '100%', width: '100%' }}>
                            <div className='content1' >
                                {!doc &&
                                    <div style={{ textAlign: 'center', paddingTop: '57px' }}>
                                        推荐医生加载中...
                             </div>
                                }
                                {
                                    doc && docList.length == 0 && <div style={{ textAlign: 'center', paddingTop: '57px' }}>
                                        {msg}
                                    </div>
                                }
                                {
                                    doc && docList.map((item, index) => {
                                        return (
                                            <div key={index} >
                                                <Link to={{
                                                    pathname: 'consult/deptdetail',
                                                    query: { doctorId: item.doctorId, deptId: item.deptId, resource: 1 }

                                                }}>
                                                    <img src={item.image && item.image.indexOf("ihoss") == '-1' ? item.image : item.image + "?x-oss-process=image/resize,w_105"}></img>
                                                    <div className="txt1">{item.name}</div>
                                                    <div className="txt2">{item.deptName}</div>
                                                </Link>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className='index-banner'>
                        <Carousel autoplay={true}
                            infinite={true}
                            dots={true}
                            effect={'fade'}
                        >
                            {/* <div>
                    <img src="./././resources/images/index-search.png" alt=""
                    onClick={()=>{
                         Utils.sums('inquiry_img_banner',2,1);
                        this.context.router.push({
                            pathname: '/consult/alldeptlist'
                        })
                    }}  />
                </div> */}
                            <div>
                                <img src="./././resources/images/gznanner.png" alt=""
                                    onClick={() => {
                                        Utils.sums('inquiry_img_banner', 2, 1);
                                        this.context.router.push({
                                            pathname:'/consult/deptlist',
                                            query:{deptName:'新型冠状病毒感染肺炎',deptId:144,source:1,type:1}
                                        })
                                    }} />
                            </div>
                            <div>
                                <img src="./././resources/images/second.jpg" alt=""
                                    onClick={() => {
                                        Utils.sums('online_checkList', 2, 1);
                                        this.context.router.push({
                                            // pathname: '/report/reportlist'
                                            pathname:'/consult/alldeptlist',
                                            query:{deptName:'新型冠状病毒感染肺炎',deptId:144,source:1,type:1}
                                        })
                                    }} />
                            </div>
                        </Carousel>
                    </div>
                    <div className='titleh'>
                        <img
                            src="./././resources/images/index-title-icon.png"
                            alt=""
                        />更多服务</div>
                    <div className='b-tab'>
                        <Func url='/microweb/deptlist' img='./././resources/images/index-dept.png' txt='科室介绍' txt1='了解医院科室' />
                        <Func url='/microweb/deptlistfordoc' img='./././resources/images/index-doctor.png' txt='专家介绍' txt1='了解专家信息' />
                        <Func url='/microweb/news' img='./././resources/images/index-advice.png' txt='健康宣教' txt1='儿童护理知识' />
                        {/* <Func url='' href='https://mp.weixin.qq.com/s/QtsB23jZXQtem5HFDy-GVA' img='./././resources/images/index-inform.png' txt='咨询公告' txt1='查看最新公告' /> */}
                        {/* <Func url='mdt/list'  img='./././resources/images/mdt.png' txt='MDT' txt1='多学科联合会诊' /> */}
                    </div>
                </div>}
                {isOpen && <div className='modal-tip1' onClick={(e) => {
                    this.setState({
                        isOpen: false
                    })
                }}>
                    <div className='modal-body-tip' onClick={(e) => {
                        e.stopPropagation()
                    }}>
                        <div className='modal-content-tip'>
                            <div className="content-item">{isShowHome?'该医生暂未开通此服务...':'正在努力建设中...'}</div>
                            <div className="img">
                                <img src="./././resources/images/no-open.png" alt=""></img>
                            </div>
                            <div className="btn-close">
                                <p onClick={(e) => {
                                    this.setState({
                                        isOpen: false
                                    })
                                }}>确定</p>
                            </div>
                        </div>
                    </div>
                </div>
                }
                <div className="tarbar">
                    <div  >
                        <img
                            src="./././resources/images/index-active.png"
                        />
                        <div style={{ color: '#4FABCA' }}>首页</div>
                    </div>
                    <div className='inquiry'
                        onClick={
                            () => {
                                this.toNext(2)
                            }
                        }>  {hasMsg && <span></span>}
                        <img
                            src="./././resources/images/inquiry.png" />
                        <div>咨询会话</div>
                    </div>
                    <div onClick={
                        () => {
                            this.toNext(3)
                        }
                    }>
                        <img
                            src="./././resources/images/my.png" />
                        <div>我的</div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Connect()(Widget);
