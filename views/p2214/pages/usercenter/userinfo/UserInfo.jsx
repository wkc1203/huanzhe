import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import { Link } from 'react-router';
import hashHistory from 'react-router/lib/hashHistory';
import Connect from '../../../components/connect/Connect';
import UserItem from './component/UserItem';
const QRCode = require('qrcode.react');
import JsBarcode from 'jsbarcode';
import * as Api from '../../../components/Api/Api';
import './style/index.scss';
import * as Utils from '../../../utils/utils';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
            showToast: false,
            showToast1:false,
            showLoading: false,
            toastTimer: null,
            loadingTimer: null,
            showIOS1: false,
            showIOS2: false,
            cardNo:'',
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
                        label: '暂不删除',
                        onClick: Utils.hideDialog.bind(this)
                    },
                    {
                        type: 'primary',
                        label: '确定删除',
                        onClick: Utils.hideDialog.bind(this)
                    }
                ]
            },
            msg:'',
            popConfig: {
                show: false,
                title: '提示',
                cancelText: '取消',
                submitText: '确定'
            },
            userInfo: {},
        };
    }
    componentDidMount() {
        //在当前页面的微信内隐藏分享按钮
         Utils.getJsByHide();
        //获取就诊人详情
        this.getUserInfo({ 
            patientId: this.props.location.query.patientId 
        });
    }
    showToast1() {
        this.setState({showToast1: true});
        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast1: false});
        }, 2000);
    }
    //获取就诊人详情 参数为就诊人id
    getUserInfo(param) {
        Api
            .getUserInfo(param)
            .then((res) => {
                if(res.code==0){
                    this.setState({
                        userInfo:res.data,
                        cardNo:res.data.patCardNo
                    })
                    //生成条形码
                    JsBarcode(this._barcodeSVG, res.data.patCardNo,
                        {
                            displayValue: false,  //  不显示原始值
                            textMargin:5,//设置条形码和文本之间的间距
                            fontSize:15,//设置文本的大小
                            width: 3  // 线条宽度
                        }
                    );
                }
            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });
    }
    componentWillUnmount() {
    }
    /*设置默认就诊人 传入参数就诊人id*/
    setDefault() {
        //如果当前用户不是默认就诊人
        if (this.state.userInfo.isDefalut != 1) {

            Api
                .setDefault({ id: this.props.location.query.patientId })
                .then((res) => {
                    if (res.code == 0) {
                        //设置成功
                        this.showToast1();
                        console.log(res.code);
                        var userInfo=this.state.userInfo;
                       //将就诊人设置为默认
                        userInfo.isDefalut = 1;
                        this.setState({
                            userInfo:userInfo
                        })
                         //回到个人中心
                        const timer = setTimeout(() => {
                            clearTimeout(timer);
                            this.context.router.replace({
                                pathname:'/usercenter/home'
                            })
                        }, 2000);
                    }

                }, (e) => {
                    this.setState({
                        msg:e.msg,
                        showIOS1:true
                    })
                });
        }
    }
    render() {
        const {userInfo,msg,cardNo}=this.state
        return (
            <div className="ui-page">
               {//返回
                    <div className="home">
                        <span className="jian"
                            onClick={()=>{
                                    if(this.props.location.query.source!='1'){
                                    this.context.router.push({
                                        pathname:'usercenter/userlist'
                                        })
                                    }else{
                                        this.context.router.goBack();
                                    }
                            }}
                            >
                            </span>就诊人详情
                    </div>
                    }
                <Toast icon="success-no-circle" show={this.state.showToast1}>设置成功</Toast>
                <Toast icon="success-no-circle" show={this.state.showToast}>删除成功</Toast>
                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                    {msg}
                </Dialog>
                <Dialog type="ios" title={this.state.style2.title} buttons={this.state.style2.buttons} show={this.state.showIOS2}>
                    {msg}
                </Dialog>
                {//条形码和二维码
                 <div className='code'>
                    <div className='qrcode'>
                        {userInfo&&<QRCode value={cardNo} size={120} />}
                    </div>
                    <div className='barcode'>
                        <svg ref={(ref)=>this._barcodeSVG = ref}></svg>
                    </div>
                 </div>
                }
                {//就诊卡
                    <div className="mu-card">
                        <div className="card-info">
                            <div className="info-main">
                                <div className="main-name">
                                    <div className="name">{userInfo.name}</div>
                                    {userInfo.isDefalut == 1&&<div className="status" >默认</div>}
                                </div>
                            </div>
                            <div className="info-extra">
                                {userInfo.patCardTypeName || '就诊卡'}：{userInfo.patCardNo||userInfo.idNo}
                            </div>
                        </div>
                    </div>
                }
               { //就诊人基本信息
                    <div className="m-userinfo">
                        {userInfo.sex&&<UserItem  txt='性别' name={userInfo.sex=== 'M' ? '男' : '女'}/>}
                        {userInfo.birthday&&<UserItem  txt='出生日期' name={userInfo.birth}/>}
                        {userInfo.idNo&&<UserItem  txt='身份证号' name={userInfo.idNo}/>}
                        {userInfo.mobile&&<UserItem  txt='手机号' name={userInfo.mobile}/>}
                        {userInfo.patCardNo&&<UserItem  txt='就诊卡号' name={userInfo.patCardNo||userInfo.idNo}/>}                   
                    </div>
                }
                { //设置默认就诊人
                    this.props.location.query.source!='1'&&<div className="mu-list">
                    {userInfo.isDefalut == 0&&<div className="list-item" >
                        <div className="item">
                            <div className="item-hd"
                                >设为默认就诊人</div>
                            <div className="item-bd disabled"
                                 onClick={()=>{
                            this.setDefault()
                            }}>
                                <Switch checked={userInfo.isDefalut == 1} disabled color="#3ECDB5" />
                            </div>
                        </div>
                    </div>}
                    <div className="m-btn">
                    </div>
                </div>}
            </div>
        );
    }
}
export default Connect()(Widget);
