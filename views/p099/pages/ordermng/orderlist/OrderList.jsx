import React, { Component } from 'react';
import { Button, Toptips } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';

import * as Api from './orderListApi';
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
    <div className="container page-order-list">
        <div>

            <ul >
                <li className="active">patientName</li>
            </ul>
            {/*<ul @tap="openList">
             <li className="{{isPatShow ? 'active' : 'default-item'}}">{{patientName}}</li>
             </ul>*/}

        </div>
        <div className='modal' >
            <div className='modal-body'>
                <div  className='modal-list'>全部就诊人</div>
                <div  className='modal-list'>patientName</div>

            </div>
            {/*<div className='modal' wx:if="{{isPatShow}}">
             <div className='modal-body'>
             <div @tap="selectPat('','全部就诊人')" className='modal-list'>全部就诊人</div>
             <block wx:for="{{patList}}" wx:for-index="idx" wx:for-item="item" wx:key="{{idx}}">
             <div @tap="selectPat('{{item.patientId}}','{{item.patientName}}')" className='modal-list'>{{item.patientName}}</div>
             </block>
             </div>*/}

        </div>

        {/*<block wx:for="{{orderList}}" wx:for-index="idx" wx:for-item="item" wx:key="{{idx}}">*/}
        <div className='doc-item'>

            <Link>
                <div className="doc-info">
                    <img className="doc-img" src="../../../resources/images/doc.png" alt="医生头像" />
                    <div className="text-box">
                        <div className='doc-name'>doctorName</div>
                        <div className='doc-des'>deptName  level</div>
                        <div className='doc-des'>hisName</div>
                    </div>
                </div>
                <div className='msg-box'>
                    <div>
                        <div>咨询时间：createTime</div>
                        <div>完成时间：finishTime  </div>
                    </div>
                    <div className='price-box'>
                        ￥100
                    </div>
                </div>
            </Link>

            {/*<navigator url="/pages/ordermng/orderdetail/orderdetail?orderId={{item.id}}">
             <div className="doc-info">
             <img className="doc-img" src="{{item.doctorImgUrl || '../../../resources/images/doc.png'}}" alt="医生头像" />
             <div className="text-box">
             <div className='doc-name'>{{item.doctorName}}</div>
             <div className='doc-des'>{{item.deptName}} {{item.level ? '|' : ''}} {{item.level}}</div>
             <div className='doc-des'>{{item.hisName}}</div>
             </div>
             </div>
             <div className='msg-box'>
             <div>
             <div>咨询时间：{{item.createTime}}</div>
             <div>完成时间：{{item.finishTime || '暂无完成时间' }}</div>
             </div>
             <div className='price-box'>
             ￥{{WxsUtils.formatMoney(item.totalFee,100)}}
             </div>
             </div>
             </navigator>*/}


            <div className="oper-box">
                <div className="pat-item">typeName | 就诊人：patientName</div>
                <div className="status-name">statusName</div>


                {/*<div className="oper-box">
                 <div className="pat-item">{{item.typeName}} | 就诊人：{{item.patientName}}</div>
                 <div className="status-name" wx:if="{{item.status != '2'}}">{{item.statusName}}</div>
                 <div className="status-name" wx:if="{{item.status == '2'}}">已完成</div>
                 <div className="eva-item" wx:if="{{item.status == '2'}}">
                 <navigator url="/pages/ordermng/evaluate/evaluate?orderId={{item.id}}" className='evaluate'>评价</navigator>
                 </div>*/}


            </div>
        </div>

    <div  className='no-data' style={{display:'none'}}>
          <img src='../../../resources/images/no-result.png' />
          <div>暂未查询到相关信息</div>
          </div>
              <div className='modal' >
                  <div className='modal-body'>
                      <div className='modal-list'>全部服务text</div>
                      <div className='modal-list'>专家问诊text</div>
                      <div className='modal-list'>视频问诊text</div>
                  </div>
              </div>
              {/*<div wx:if="{{orderList.length <= 0}}" className='no-data'>
               <img src='../../../resources/images/no-result.png' />
               <div>暂未查询到相关信息</div>
               </div>
               <div className='modal' wx:if="{{isTypShow}}">
               <div className='modal-body'>
               <div className='modal-list'>全部服务{{typeList.text}}</div>
               <div className='modal-list'>专家问诊{{typeList.text}}</div>
               <div className='modal-list'>视频问诊{{typeList.text}}</div>
               </div>
               </div>*/}
          </div>
    );
  }
}
export default Connect()(Widget);