import React, { Component } from 'react';
import { Link } from 'react-router';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';

import * as Api from './deptDetailApi';
import 'style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
            isShowTip: false,
            footShow: false,
            isShowProtocol: false,
            isFavorite: false,
            doctorId: '1',
            showToast: false,
            showLoading: false,
            toastTimer: null,
            toastTitle:'',
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
            deptId: '1',
            docInfo: {},
            evaluate: [],
            currentPage: 1,
            pageCount: 1,
            pageNum: 1,
            t1: {text: '态度好', show: false},
            t2: {text: '及时回复', show: false},
            t3: {text: '解答详细', show: false},
            t4: {text: '很专业', show: false},
            t5: {text: '非常感谢', show: false},
            totalCount: 0,
            totalFee: 0,
            leftTime: 7,
        };
    }

    componentDidMount() {

          this.getJs();
        document.getElementById("home").scrollIntoView();
        this.setState({
            doctorId: this.props.location.query.doctorId,
            deptId: this.props.location.query.deptId,
        })
        this.getDeptDetail(this.props.location.query.doctorId, this.props.location.query.deptId);
        this.getEvaluateList(1, this.props.location.query.doctorId, this.props.location.query.deptId);
    }
    showToast() {
        this.setState({showToast: true});

        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
    }
    getJs(){
        Api
            .getJsApiConfig({url:window.location.href.substring(0,window.location.href.indexOf("#"))})
            .then((res) => {
                console.log(res);
                if(res.code==0){
                    //写入b字段
                    console.log("str",res.data);
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId:res.data.appId, // 必填，公众号的唯一标识
                        timestamp:res.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr:res.data.noncestr, // 必填，生成签名的随机串
                        signature:res.data.signature,// 必填，签名
                        jsApiList: ['onMenuShareAppMessage','hideMenuItems','showMenuItems'] // 必填，需要使用的JS接口列表
                    });
                    wx.ready(function(){
                        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                        wx.showMenuItems({
                            menuList: ["menuItem:copyUrl","menuItem:openWithQQBrowser","menuItem:share:appMessage", "menuItem:share:timeline"
                                ,"menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:QZone",
                                "menuItem:openWithSafari"] // 要显示的菜单项，所有menu项见附录3
                        });
                    });
                }
            }, (e) => {
            });
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
    /*获取医生信息*/
    getDeptDetail(doctorId, deptId) {
        this.showLoading();
        Api
            .getDeptDetail({doctorId: doctorId, deptId: deptId})
            .then((res) => {
                this.hideLoading();
                this.setState({
                    isFavorite: res.data.isFavorite,
                    docInfo: res.data.doctor
                });
                var that=this;
                var pm=res.data.doctor;
                wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
                    wx.onMenuShareAppMessage({
                        title:pm.name, // 分享标题
                        desc:pm.introduction+"擅长："+pm.specialty, // 分享描述
                        link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl:pm.image, // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                          // 用户点击了分享后执行的回调函数
                        }
                    });
                })
            }, (e) => {
                this.hideLoading();
            });
    }

    /*获取评价列表*/
    getEvaluateList(pageNum, doctorId, deptId) {
        Api
            .getEvaluateDet({pageNum: pageNum, doctorId: doctorId, deptId: deptId})
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
                        var str=[];
                        if(eList[i].appraisalLabel.indexOf("-")!=-1){
                            str = eList[i].appraisalLabel.split('-');
                        }else{
                            str = eList[i].appraisalLabel.split('/');
                        }

                        console.log(str)
                        var strs=[];
                        for(var j=0;j<str.length;j++){
                                  if(str[j]!=''){
                                  if(str[j]=="undefined态度好"){
                                      str[j]="态度好";
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
    /*进入新建咨询页面*/
    jumpConfirminfo(remune) {
        this.showLoading();
        Api
            .isRegister()
            .then((res) => {
                if (res.code == 0) {
                    this.hideLoading();
                    this.setState({
                        isShowProtocol: true,
                        totalFee: remune
                    });
                    var html = document.getElementsByTagName('html')[0];
                    var body = document.getElementsByTagName('body')[0];
                    html.setAttribute('style', 'height:100%;overflow:hidden;');
                    body.setAttribute('style', 'height:100%;overflow:hidden;');

                    this.clock();
                }
            }, (e) => {
                this.hideLoading();
            });
    }

    componentWillUnmount(){
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
                .addCollect({doctorId, deptId})
                .then((res) => {
                    if (res.code == 0) {
                        this.showToast();
                        this.setState({
                            isFavorite: true,
                            toastTitle:"收藏成功"
                        });
                    }
                }, e=> {
                });
        } else {
            Api
                .cancelCollect({doctorId, deptId})
                .then((res) => {
                    if (res.code == 0) {
                        this.showToast();

                        this.setState({
                            isFavorite: false,
                            toastTitle:"取消收藏成功"
                        });
                    }
                }, e=> {
                });
        }
    }
    render() {
        const {docInfo,isShowTip,msg,footShow,isShowProtocol,isFavorite,evaluate,currentPage,pageCount,
            totalCount,totalFee,leftTime,toastTitle}=this.state;
        return (
            <div className="page-dept-detail container1">
                <div className="home" id="home"><span className="jian"
                                            onClick={()=>{
                                            console.log("p",this.props.location.query.resource)
                                            if(this.props.location.query.resource==2){
                                            
                                            if(window.location.href.indexOf('from')!=-1){
                                                this.context.router.push({
                                                    pathname:'home/index'
                                                    })
                                            }else{
                                                this.context.router.goBack();
                                            }
                                            }else{
                                               this.context.router.push({
                                              pathname:'home/index'
                                              })
                                            }

                                      }}
                    ></span>专家名片
                </div>
                <Toast icon="success-no-circle" show={this.state.showToast}>{toastTitle}</Toast>

                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons}
                        show={this.state.showIOS1}>
                    {msg}
                </Dialog>

                <div className='header2' id="head">
                    <div className='doctor2'>
                        <img className="doc-img" src={docInfo.image} alt="医生头像"/>

                        <div className='text1-box'>
                            <div>
                                {docInfo.name}
                                {
                                    docInfo.inquirys && docInfo.inquirys.map((item, index)=> {
                                        return (
                                            <div key={index}
                                                 className={`${item.type=='1'&&item.isOnDuty=='0'?'status-item1':'disNo'}
                                                  ${item.type=='1'&&item.isOnDuty=='1'?'status-active1':'disNo'}`}>
                                                {item.isFull !== '1' &&item.type == '1' && item.isOnDuty == '1' ? '在线' : ''}
                                                {item.isFull !== '1' &&item.type == '1' && item.isOnDuty == '0' ? '离线' : ''}
                                                {item.isFull == '1' &&item.type == '1' && item.isOnDuty == '0' ? '已满' : ''}
                                            </div>

                                        )

                                    })
                                }
                                {isFavorite && <img
                                    onClick={()=>{
                                            this.switchCollect(isFavorite)
                                            }}
                                    src='../../../resources/images/collect-none.png'/>}
                                {!isFavorite && <img
                                    onClick={()=>{
                                            this.switchCollect(isFavorite)
                                            }}
                                    src='../../../resources/images/collect-active.png'/>}
                            </div>
                            <div>{docInfo.hisName}</div>
                            <div>{docInfo.deptName} | {docInfo.level}</div>
                        </div>
                    </div>
                </div>
                <div className='data'>
                    <div className='item'>
                        <div>服务</div>

                        <div>{docInfo.completed}人</div>
                    </div>
                    <div className='item'>
                        <div>好评率</div>
                        <div>{docInfo.favoriteRate}</div>
                    </div>
                    <div className='item'>
                        <div>从业年限</div>
                        <div>{docInfo.workingLife}年</div>
                    </div>
                </div>
                <div className='content'>
                    <div className='d-tab'>
                        { docInfo.inquirys && docInfo.inquirys.map((item1, index1)=> {
                            return (
                                <div key={index1}
                                     onClick={
                                            ()=>{
                                            this.jumpConfirminfo(item1.remune)
                                            }
                                            }
                                     className={` ${item1.type=='1'&&item1.isOnDuty=='1'?'inquity-item':'disNo'}`}>
                                    <div className='icon'>
                                        <img src="../../../resources/images/inquiry-bg.png"/>
                                    </div>
                                    <div className='text'>
                                        <div>图文咨询</div>
                                        <div>使用图片、文字等咨询医生</div>
                                    </div>
                                    <div className='des-fee'>￥{(item1.remune / 100).toFixed(2)}<span>/次</span></div>
                                </div>
                            )
                        })}
                        { docInfo.inquirys && docInfo.inquirys.map((item2, index2)=> {
                                return (
                                    <div
                                        key={index2}
                                        className={`${item2.type=='1'&&item2.isOnDuty=='0'?'inquity-item':'disNo'}`}>

                                        <div className='icon'>
                                            <img src="../../../resources/images/inquiry-gray.png"/>
                                        </div>
                                        <div className='text'>
                                            <div>
                                                <text className="f-color-gray">图文咨询</text>
                                            </div>
                                            <div>使用图片、文字等咨询医生</div>
                                        </div>
                                        <div className='des'>￥{(item2.remune / 100).toFixed(2)}<span>/次</span></div>
                                    </div>
                                )
                            }
                        )}

                        <div className="inquity-item"
                             onClick={
                                ()=>{
                                this.switchTip(1)
                                }
                                }>
                            <div className='icon'>
                                <img src='../../../resources/images/video.png'/>
                            </div>
                            <div className='text'>
                                <div>视频咨询</div>
                                <div>一对一电话咨询</div>
                            </div>
                        </div>
                        <div className="inquity-item"
                             onClick={
                                    ()=>{
                                    this.switchTip(1)
                                    }
                                    }>
                            <div className='icon'>
                                <img src='../../../resources/images/phone.png'/>
                            </div>
                            <div className='text'>
                                <div>电话咨询</div>
                                <div>一对一电话咨询</div>
                            </div>
                        </div>
                    </div>
                    <div className='doc-intro'>
                        <div>
                            擅长领域
                        </div>
                        <div className="ski-des">
                            {docInfo.specialty || '暂无描述'}
                        </div>

                    </div>
                    <div className='doc-intro'>
                        <div>
                            医生介绍
                        </div>
                        <div className="ski-des">
                            {docInfo.introduction || '暂无介绍'}
                        </div>
                    </div>
                </div>
                <div className='evaluate'>
                    <div className='eva-title'>
                        <div>
                        </div>
                        患者评价<span>共{totalCount || '0'}次</span></div>
                    {evaluate.map((item3, index3)=> {
                        return (
                            <div className='eva-content' key={index3}>
                                <div>{item3.nameStr}

                                    {item3.score<1&&
                                    <img src="../../../resources/images/star.png"
                                         alt=""/>}
                                    { item3.score>=1 &&
                                    <img src="../../../resources/images/star-active.png"
                                         alt=""/>}
                                    { item3.score<2 &&
                                    <img src="../../../resources/images/star.png"
                                         alt=""/>}
                                    {item3.score>= 2 &&
                                    <img src="../../../resources/images/star-active.png"
                                         alt=""/>}

                                    { item3.score<3  &&
                                    <img src="../../../resources/images/star.png"
                                         alt=""/>}
                                    {  item3.score>= 3&&
                                    <img src="../../../resources/images/star-active.png"
                                         alt=""/>}

                                    { item3.score< 4&&
                                    <img src="../../../resources/images/star.png"
                                         alt=""/>}
                                    { item3.score>=4&&
                                    <img src="../../../resources/images/star-active.png"
                                         alt=""/>}

                                    {item3.score<5&&
                                    <img src="../../../resources/images/star.png"
                                         alt=""/>}
                                    {item3.score>= 5&&
                                    <img src="../../../resources/images/star-active.png"
                                         alt=""/>}

                                    <span>{item3.createTimeStr}</span></div>
                                <div>{item3.appraisal}</div>
                                {item3.appraisalLabel &&
                                <div className="ping-content">

                                    { item3.ping && item3.ping.map((item4, index4)=> {
                                            return (
                                                <div className={`${item4==''?'disNo':''}`}
                                                     key={index4}
                                                     style={{marginRight:'10px'}}>
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
                        <img className="wgt-empty-img" src="../../../resources/images/no-result.png" alt=""></img>

                        <div className="wgt-empty-txt">暂未查询到相关信息
                        </div>
                    </div>
                    }
                    {currentPage < pageCount &&
                    <div className='more'
                         onClick={()=>{
                            this.addMore(currentPage)
                            }}
                        >查看更多评价
                    </div>}
                </div>
                {isShowProtocol && <div className='modal1'>
                    <div className='modal-body-protocol'>
                        <div className='modal-title'>温馨提示：</div>
                        <div className='modal-content-protocol'>
                            <div className="content">
                                <div className="content-item">1、您即将向{docInfo.name}医生进行图文咨询，<span
                                    className="f-color-red">试运行期间咨询费{(totalFee / 100).toFixed(2)}元/次，平台正式上线后将调整咨询费</span>，本次咨询有效期48小时，有效期内您可以对咨询问题进行补充；
                                </div>
                                <div className="content-item">2、付款成功后，医生将在24小时内回复您的咨询，<span className="f-color-red">若医生未在24小时内回复您的咨询，系统将自动关闭本次咨询并自动为您退款；</span>
                                </div>
                                <div className="content-item">3、咨询过程中您需提供真实、完整、详细的信息，医生将尽可能利用所掌握的医学知识及临床经验给予一定的解惑，<span
                                    className="f-color-red">如需获得更详细、全方位和更确切的医疗信息和诊疗服务，请前往医院挂号就诊；</span></div>
                                <div className="content-item">4、因医生回复咨询需一定的时间，<span className="f-color-red">如需急诊的患者，请自行前往医院就诊。</span>
                                </div>
                            </div>
                        </div>

                    </div>
                    {footShow && <div className='modal-footer'>
                        <span onClick={()=>{
                        this.cancelModal()
                        }}>取消</span>
                        <Link
                            to={{
                                pathname:'consult/confirminfo',
                                query:{doctorId:docInfo.doctorId,deptId:docInfo.deptId,totalFee:totalFee,com:2}
                                }}
                            >确认</Link>
                    </div>}
                    {!footShow && <div className='modal-footer'>
                        <div className="cutdown-time">请阅读 {leftTime} s</div>
                    </div>}
                </div>}


                {isShowTip && <div className='modal-tip1'>

                    <div className='modal-body-tip'>
                        <div className='modal-title'>温馨提示</div>
                        <div className='modal-content-tip'>
                            <div className="content">
                                <div className="content-item">该功能正在努力建设中</div>
                            </div>
                        </div>
                        <div className='modal-footer-tip'>
                            <span
                                onClick={()=>{
                            this.switchTip(0)
                            }}>
                                我知道了
                            </span>
                        </div>
                    </div>
                </div>}
            </div>
        );
    }
}

export default Connect()(Widget);
