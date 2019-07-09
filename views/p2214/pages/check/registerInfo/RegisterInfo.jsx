import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import { Link } from 'react-router';
import * as Api from './registerInfoApi';
import * as Utils from '../../../utils/utils';
import './style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
            msgList: [],
            quiryNum: 0,
            showToast: false,
            showLoading: false,
            toastTimer: null,
            loadingTimer: null,
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            no:3,
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
        };
    }
    componentDidMount() {
     
    }

  
    render() {
        const {msgList,msg}=this.state
        return (
            <div className="container page-register-info">
                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons}
                        show={this.state.showIOS1}>
                    {msg}
                </Dialog>
                <div className="home" style={{position:'relative',width:'100%',top:'0'}}><span className="jian"
                                    onClick={()=>{
                                      this.context.router.goBack();
                                      }}
            ></span>就诊指引
        </div>
                <div className='info'>
                   <p className='register-title'>
                    如何检查
                   </p>
                   <p className='register-text'>
                     按照检查单项目，到检查科室，出示您的实体就诊卡，若没有实体就诊卡，
                     出示您 的电子就诊卡二维码
                   </p>
                </div>
                <div className='info'>
                   <p className='register-title'>
                    如何查看报告
                   </p>
                   <p className='register-text'>
                     在报告出来后，在个人中心查看我的检验检查报告
                   </p>
                </div>
                <div className='info'>
                   <p className='register-title'>
                    如何取实体报告
                   </p>
                   <p className='register-text'>
                     在报告出来后，在拿报告窗口，出示您的检查单条形码。
                     检查单条形码就在检验检查报告页面个人中心>病历记录>检查单
                   </p>
                </div>
            </div>
        );
    }
}

export default Connect()(Widget);
