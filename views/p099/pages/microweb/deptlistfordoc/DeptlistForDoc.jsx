import React, { Component } from 'react';
import { Button, Toptips } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';

import * as Api from './deptlistForDocApi';
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
        <div className="dfc-page">
          {/*<div className="p-page {{searchFocus ? 'unscroll' : ''}}">*/}
          <div className="g-list">
            <div className="m-list">
              <div className="list-box">
                <div className="list-lt-box">
                  <div className="list-lt">
                    <div
                        className="lt-item "
                        >name
                    </div>
                    {/*<block wx:if="{{deptList.length > 0}}">
                     <block
                     wx:for="{{deptList || []}}"
                     wx:key="index"
                     >
                     <div
                     className="lt-item {{activeIdx === index ? 'active' : ''}}"
                     bindtap="bindChangeIndex({{index}})"
                     >{{item.name}}
                     </div>
                     </block>
                     </block>     */}

                  </div>
                </div>
                <div className="list-rt-box">
                  <div className="list-rt">

                    {/*<div
                     className="rt-sec active"
                     wx:if="{{docList.length > 0}}"
                     >*/}
                    <div
                        className="rt-sec active"
                        >

                      {/*<block
                       wx:for="{{docList}}"
                       wx:key="index"
                       >

                       <div
                       className="sec-li"
                       bindtap="bindTapDept('{{item.doctorId}}')"
                       >*/}

                      <div
                          className="sec-li"

                          >

                        <div className="doc-info">
                          <img className="doc-img" src="../../../resources/images/doc.png" alt="医生头像" />
                          <div className="text-box">
                            <div className='doc-name'>name</div>
                            <div className='doc-des'>level</div>
                          </div>
                          <div className="unit-arrow"></div>
                        </div>
                      </div>

                      {/*<div className="doc-info">
                       <img className="doc-img" src="{{item.img || '../../../resources/images/doc.png'}}" alt="医生头像" />
                       <div className="text-box">
                       <div className='doc-name'>{{item.name}}</div>
                       <div className='doc-des'>{{item.level}}</div>
                       </div>
                       <div className="unit-arrow"></div>
                       </div>
                       </div>
                       </block>*/}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

    );
  }
}
export default Connect()(Widget);