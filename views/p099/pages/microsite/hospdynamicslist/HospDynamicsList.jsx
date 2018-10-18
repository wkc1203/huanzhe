import React, { Component } from 'react';
import { InfiniteLoader, LoadMore } from 'react-weui';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import NoResult from '../../../components/noresult/NoResult';

import * as Api from './hospDynamicsListApi';
import './style/index.scss';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noResult: {
        msg: '暂未获取到相关信息',
        show: false,
      },
      articleTypeList: [],
      articleData: {},
    };
  }

  componentDidMount() {
    //this.getArticleTypeList();
  }

  componentWillUnmount() {
    this.state.Timer && clearTimeout(this.state.Timer);
  }

  /**
   * 根据医院id获取文章类型列表
   */
  getArticleTypeList() {
    const param = this.props.location.query;
    const { noResult } = this.state;
    this.showLoading();
    Api
      .getArticleTypeList(param)
      .then((res) => {
        this.hideLoading();
        const articleTypeList = res.data;
        if (articleTypeList && articleTypeList.length > 0) {
          this.setState({
            articleTypeList,
          });

          const typeId = this.props.location.query.typeId || articleTypeList[0].typeId;
          if (typeId) {
            this.setState({ typeId });
          }
          this.getHospDynamics(typeId);
          this.tabScrollIntoView();
          this.showAnimation();
        } else {
          noResult.show = true;
          this.setState({ noResult });
        }
      }, (e) => {
        this.hideLoading();
        noResult.show = true;
        this.setState({ noResult });
        this.showPopup({ content: e.msg });
      });
  }

  /**
   * 获取文章列表
   * @param type {Number} 文章类型
   * @param currentPage {Number} 要获取的页码数
   * @param resolve {Object} 滚动拉取组件隐藏loading样式的回调
   */
  getHospDynamics(type = 1, currentPage = 1, resolve = () => null) {
    const param = this.props.location.query;
    Object.assign(param, { typeId: type, pageNum: currentPage });
    this.showLoading();
    const { noResult, articleData } = this.state;
    Api
      .getHospDynamics(param)
      .then((res) => {
        this.hideLoading();
        const listData = res.data || {};
        if (listData.recordList && listData.recordList.length > 0) {
          // 合并相同类型数据
          const listName = type;
          const currentArticle = articleData[listName];
          if (currentArticle && currentArticle.currentPage > 0
            && parseFloat(currentArticle.currentPage) + 1 !== parseFloat(listData.currentPage)) {
            // 不是本次要的数据
            return;
          }
          if (!currentArticle) {
            // 无数据 直接赋值
            articleData[listName] = listData;
            this.setState({ articleData }, () => resolve());
          } else {
            // 原来有数据 concat数组内容 其它分页数据(如当前页数，总页数)使用本次获取到的
            let newArticleList = (currentArticle.recordList && currentArticle.recordList.length > 0)
              ? currentArticle.recordList : [];
            newArticleList = newArticleList.concat(listData.recordList);

            articleData[param.typeId] = { ...listData, recordList: newArticleList };
            this.setState({ articleData }, () => resolve());
          }
        } else {
          noResult.show = true;
          this.setState({ noResult }, () => resolve());
        }
      }, (e) => {
        this.hideLoading();
        noResult.show = true;
        this.setState({ noResult }, () => resolve());
        this.showPopup({ content: e.msg });
      });
  }

  /**
   * 改变显示文章的类型
   * @param type {String} 文章类型
   */
  changeType(type) {
    const { articleData, typeId } = this.state;
    if (type === typeId) {
      return;
    }

    this.setState({ typeId: type });
    this.tabScrollIntoView();
    // 判断是否已经查找过该类型
    if (Object.keys(articleData).indexOf(type) < 0) {
      // 没查找过前往查找
      this.getHospDynamics(type);
    }
  }

  tabScrollIntoView() {
    window.setTimeout(() => {
      this.refs.activeTab.scrollIntoView();
    }, 100);
  }

  /**
   * 显示滑动动画
   */
  showAnimation() {
    const tabList = this.refs.tabList;
    if (tabList.scrollWidth > tabList.clientWidth) {
      this.setState({ isSlide: true });
      this.state.Timer = setTimeout(() => {
        this.setState({ isSlide: false });
      }, 2000);
    }
  }

  render() {

    return (
        <div className="p-page">

          <div className="m-wxinfo">
            <div className="user-info">
              <img className="m-wxicon" src="https://wx.qlogo.cn/mmopen/vi_32/Xs2sfhYMjXhvZ460SWkoMcFD5rJ5VTP85Iy3qgNemyUR1OicaD9Pr0lJKFricVIib1HAI3gRUuLQ7VPcibVabW0Q4Q/132" />
              <div className="m-nickname" >realName</div>
              <Link className="m-nickname unlogin" >注册</Link>
              <div className="m-phone" >mobile<img src="../../../resources/images/edit.png" /></div>

              {/*<img className="m-wxicon" src="{{userInfo.headimg}}" />
               <div className="m-nickname" wx:if="{{userInfo.realName}}">{{userInfo.realName}}</div>
               <navigator className="m-nickname unlogin" url="/pages/login/login" wx:if="{{!userInfo.realName}}">注册</navigator>
               <div className="m-phone" @tap="modalOpen" wx:if="{{userInfo.mobile}}">{{userInfo.mobile || ''}}<img src="../../../resources/images/edit.png" /></div>
               */}
            </div>
          </div>
          <Link className="m-mycard" >我的就诊人(patNum人)</Link>
          <div className="m-card">
            <div className="card-info">
              <div className="info-main">
                <div className="main-name">
                  <div className="name">patientName</div>
                  </div>
                  </div>
                  <div className="info-extra">patCardTypeName：patCardNo</div>
                  </div>
                  </div>
                    {/*<block wx:if="{{leftBindNum <2}}">
                     <navigator className="m-mycard" url="/pages/usercenter/userlist/index">我的就诊人({{patNum}}人)</navigator>
                     <div className="m-card">
                     <div className="card-info">
                     <div className="info-main">
                     <div className="main-name">
                     <div className="name">{{defaultUser.patientName}}</div>
                     <!--<div className="status">医保卡</div>-->
                     </div>
                     </div>
                     <div className="info-extra">{{defaultUser.patCardTypeName || '就诊卡'}}：{{defaultUser.patCardNo}}</div>
                     </div>
                     </div>
                     </block>*/}

                     <div className="m-nocard" hidden>
                     <div className="t1">绑定就诊卡</div>
                     <div  className="t2">绑定就诊卡立即享重医儿童医院专家为您一对一服务</div>
                     </div>

          {/*</block>*/}
                     <div className="m-function">
                     <Link className="function-list" >
                     <div className="list-item">
                     <div className="item">
                     <div className="item-icon">
                     <img style={{width:'18px',height:'18px;'}}
                     src="../../../resources/images/inquiry-mng.png"></img>
                     </div>
                     <div className="item-main">
                     <div className="main-title">咨询管理</div>
                     </div>
                     </div>
                     </div>
                     </Link>
                     {/*<block wx:if="{{leftBindNum==2}}">*/}
                    {/*<div className="m-nocard" @tap="isRegister">
                     <div className="t1">绑定就诊卡</div>
                     <div  className="t2">绑定就诊卡立即享重医儿童医院专家为您一对一服务</div>
                     </div>

                     </block>
                     <div className="m-function">
                     <navigator className="function-list" url="/pages/ordermng/orderlist/orderlist">
                     <div className="list-item">
                     <div className="item">
                     <div className="item-icon">
                     <img style="width:36rpx;height:36rpx;"
                     src="../../../resources/images/inquiry-mng.png"></img>
                     </div>
                     <div className="item-main">
                     <div className="main-title">咨询管理</div>
                     </div>
                     </div>
                     </div>
                     </navigator>*/}
                  </div>
                  <div className="m-function">
                    <Link className="function-list">
                    {/*<navigator className="function-list" url="/pages/add/manageList/manageList?pList={{pList}}&userId={{userId}}">*/}
                      <div className="list-item">
                        <div className="item">
                          <div className="item-icon">
                            <img style={{width:'18px',height:'18px;'}}
                          src="../../../resources/images/add2.png"></img>
                          </div>
                          <div className="item-main">
                          <div className="main-title">加号管理</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  {/*</navigator>*/}
                    </div>
                    <div className="m-function">
                    <Link className="function-list">
                    {/*<navigator className="function-list" url="/pages/usercenter/collect/index">*/}
                    <div className="list-item">
                    <div className="item">
                    <div className="item-icon">
                      <img style={{width:'18px',height:'18px;'}}
                    src="../../../resources/images/collect.png"></img>
                    </div>
                    <div className="item-main">
                    <div className="main-title">我的收藏</div>
                    </div>
                    </div>
                    </div>
                    </Link>
                    {/*</navigator>*/}
                    </div>
                    <div className="m-function">
                    <Link className="function-list">
                    {/*<navigator className="function-list" url="/pages/usercenter/complain/index">*/}
                    <div className="list-item">
                    <div className="item">
                    <div className="item-icon">
                      <img style={{width:'18px',height:'18px;'}}
                    src="../../../resources/images/complain.png"></img>
                    </div>
                    <div className="item-main">
                    <div className="main-title">投诉建议</div>
                    </div>
                    </div>
                    </div>
                    </Link>
                    {/*</navigator>*/}

                    </div>
                    <div className='modal' >
                    {/*<div className='modal' wx:if="{{isShow}}">*/}
                    <div className='modal-body'>
                    <div className='modal-img'><img src="../../../resources/images/mobile.png" /></div>
                    <div className='modal-content'>您的手机号：mobile</div>
                    {/*<div className='modal-content'>您的手机号：{{userInfo.mobile}}</div>*/}

                    <div className='modal-btn'>
                    <div>更换手机号</div>
                    {/*<div @tap="updateMobile">更换手机号</div>*/}

                    </div>
                    </div>
                    <div className="modal-close">
                    <div className="modal-close-line"></div>
                    <div className="modal-close-icon" >
                    {/*<div className="modal-close-icon" @tap="modalClose">*/}

                    <img mode="widthFix" src="../../../resources/images/close.png"></img>
                    </div>
                    </div>

                    </div>
                    <div className='modal'>

                    <img className="bindTip" src="../../../resources/images/bindTip.png"></img>
                    <img  className="know" src="../../../resources/images/know.png"></img>

                    {/* <div className='modal' wx:if="{{showTip}}">

                     <img className="bindTip" src="../../../resources/images/bindTip.png"></img>
                     <img @tap="hideTip" className="know" src="../../../resources/images/know.png"></img>
                     */}
                    </div>
          <div className="tarbar">
            <div >
              <img
                  src="../../../resources/images/index.png"
                  />
              <div >首页</div>
            </div>
            <div >
              <img
                  src="../../../resources/images/inquiry.png"/>
              <div >咨询会话</div>

            </div>
            <div>

              <img
                  src="../../../resources/images/my-active.png"/>
              <div style={{color:'#4FABCA'}}>我的</div>
            </div>
          </div>
                    </div>

                    );
  }
}

export default Connect()(Widget);
