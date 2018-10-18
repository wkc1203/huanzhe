import React, { Component } from 'react';
import { Button, Toptips } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';

import * as Api from './doctorInfoApi';
import './style/index.scss';
class Widget extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      config: {},
      sexOption: [
        {
          dictKey: 'M',
          dictValue: '男',
        },
        {
          dictKey: 'F',
          dictValue: '女',
        },
      ],
      viewData: {
        onSubmit: false,
        showToptips: false,
        toptips: '',
        isNewCard: '0',
        noresult: {
          msg: '暂未获取到医院配置信息',
          show: false,
        },
        isloading: 0,
      },
    };
  }
  componentDidMount() {
   
  }
  componentWillUnmount() {
    // 离开页面时结束所有可能异步逻辑

  }
  getUser() { // 获取实名制
    Api
      .getUser()
      .then((res) => {
        console.log(res);
        this.setState({ user: res.data });
      }, e=> {
        console.log(e);
      });
  }
  getHisConfig() {
    const { viewData } = this.state;
    viewData.isloading = 1;
    this.setState({ viewData });
    this.showLoading();
    Api
      .getHisConfig()
      .then((res) => {
        this.hideLoading();
        viewData.isloading = 0;
        // 添加身份证的验证规则
        res.data.idTypes = res.data.idTypes.map((v) => {
          if (v.dictKey === '1') {
            v.validator = `[{'required':'',tip:'${v.dictValue}不能为空'},{'idcard':'',tip:'${v.dictValue}格式错误'}]`;
            v.maxLength = 18;
          } else {
            v.validator = `[{'required':'',tip:'${v.dictValue}不能为空'}]`;
            v.maxLength = 30;
          }
          return v;
        });
        this.setState({ viewData, config: res.data });
      }, (e) => {
        this.hideLoading();
        this.showPopup({ content: e.msg });
        viewData.isloading = 2;
        viewData.noresult.show = true;
        this.setState({ viewData });
      });
  }
  isZfb() {
    const { platformSource } = window.CONSTANT_CONFIG;
    return platformSource == 2;
  }
  switchPatientType(v) {
    this.setState({
      patientType: v,
    });
  }
  submitData(onSubmit) {
    if (onSubmit) {
      return false;
    }
    const ret = Validator(this.refs.dataForm);
    if (ret.result.length > 0) {
      this.setState({
        showToptips: true,
        toptips: ret.result[0].tip,
      });
      this.state.errorTimer = setTimeout(() => {
        this.setState({
          showToptips: false,
        });
      }, 2000);
      return false;
    }
    const { viewData } = this.state;
    viewData.onSubmit = true;
    this.setState({ viewData });
    this.showLoading();
    Api
      .addPatients(ret.data)
      .then(() => {
        viewData.onSubmit = false;
        this.setState({ viewData });
        this.showSuccess({
          title: '绑定成功',
          duration: 1500,
          complete: ()=>{
            this.context.router.goBack();
          }
        });
      }, (e) => {
        this.hideLoading();
        this.showPopup({ content: e.msg });
        viewData.onSubmit = false;
        this.setState({ viewData });
      });
  }
  isNewCard(e) {
    const { viewData } = this.state;
    viewData.isNewCard = e.target.value;
    this.setState({ viewData });
  }
  isSelf(relationType) {
    this.setState({
      isSelf: relationType.toString() === '1',
    });
  }
  isZfbSelf() {
    const { isSelf } = this.state;
    return this.isZfb() && isSelf;
  }
  filterChildWhenSelf() {
    const { config, isSelf } = this.state;
    const { patientTypes = [] } = config;
    if (isSelf) {
      return patientTypes.filter((v) => {
        return v && v.dictKey && v.dictKey.toString() !== '1';
      });
    } else {
      return patientTypes;
    }
  }
  render() {
 
    return (
        <div className="di-page">
          <div className="container">
            <div className='headerp'>
              <div className='doctor'>
                <img className="doc-img" src="../../../resources/images/doc.png" alt="医生头像" />
                {/*<img className="doc-img" src="{{doctor.img || '../../../resources/images/doc.png'}}" alt="医生头像" />*/}
                <div className='text-box'>

                  <div>
                    name
                    <img  src="../../../resources/images/collect-none.png" />
                  </div>
                  <div>grade grade  level</div>
                  <div>deptName</div>

                  {/*<div>
                   {{doctor.name}}
                   <img @tap="switchCollect({{isFavorite}})" src="{{isFavorite ? '../../../resources/images/collect-none.png' : '../../../resources/images/collect-active.png'}}" />
                   </div>
                   <div>{{doctor.grade || ''}} {{doctor.grade ? '|' : '' }}  {{doctor.level}}</div>
                   <div>{{doctor.deptName}}</div>*/}

                </div>
              </div>
            </div>

            <div className="m-oper">

              <Link className="oper-item active">
                <div><img src="../../../resources/images/inquiry-bg.png" /></div>
                <div>图文咨询</div>
              </Link>
              <div className="oper-item" >
                <div><img src="../../../resources/images/inquiry-gray.png" /></div>
                <div>图文咨询</div>
                <div>（离线）</div>
              </div>

              <div className="oper-item" >
                <div><img src="../../../resources/images/video.png" /></div>
                <div>视频咨询</div>
              </div>
              <div className="oper-item" >
                <div><img src="../../../resources/images/phone.png" /></div>
                <div>电话咨询</div>
              </div>
              {/*<block wx:for="{{doctor.inquirys}}" wx:for-index="idx" wx:for-item="item" wx:key="{{idx}}">
               <navigator className="oper-item active" url="/pages/consult/confirminfo/confirminfo?doctorId={{doctor.doctorId}}&deptId={{doctor.deptId}}&totalFee={{item.remune}}" wx:if="{{item.type == '1' && item.isOnDuty == '1'}}">
               <div><img src="../../../resources/images/inquiry-bg.png" /></div>
               <div>图文咨询</div>
               </navigator>
               <div className="oper-item" wx:if="{{item.type == '1' && item.isOnDuty == '0'}}">
               <div><img src="../../../resources/images/inquiry-gray.png" /></div>
               <div>图文咨询</div>
               <div>（离线）</div>
               </div>
               </block>
               <div className="oper-item" @tap="switchTip(1)">
               <div><img src="../../../resources/images/video.png" /></div>
               <div>视频咨询</div>
               </div>
               <div className="oper-item" @tap="switchTip(1)">
               <div><img src="../../../resources/images/phone.png" /></div>
               <div>电话咨询</div>
               </div>*/}
            </div>
              <div className="m-deptinfo">
                <div className="m-blockinfo">
                  <div className="m-title">擅长领域</div>
                  <div className="m-summary">specialty</div>
                  {/*<div className="m-summary">{{doctor.specialty ? doctor.specialty : '暂无描述'}}</div>*/}
                </div>
              </div>
              <div className="m-deptinfo">
                <div className="m-blockinfo">
                  <div className="m-title">医生简介</div>
                  <div className="m-summary">introduction</div>
                  {/*<div className="m-summary">{{doctor.introduction ? doctor.introduction : '暂无介绍'}}</div>*/}
                </div>
              </div>
            </div>
            <div className='modal-tip' style={{display:'none'}}>
              {/*<div className='modal-tip' wx:if="{{isShowTip}}">*/}
              <div className='modal-body-tip'>
                <div className='modal-title'>温馨提示</div>
                <div className='modal-content-tip'>
                  <div slot="content">
                    <div className="content-item">该功能正在努力建设中！</div>
                  </div>
                </div>
                <div className='modal-footer-tip'>
                  <span >我知道了</span>
                  {/* <span bindtap="sure" @tap="switchTip(0)">我知道了</span>*/}
                </div>
              </div>
            </div>
          </div>
    );
  }
}
export default Connect()(Widget);