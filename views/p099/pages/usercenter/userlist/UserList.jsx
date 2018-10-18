import React, { Component } from 'react';
import { InfiniteLoader, LoadMore } from 'react-weui';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import NoResult from '../../../components/noresult/NoResult';

import * as Api from './userListApi';
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
        <div className="u-page">
            <Link className="m-card" >
                <div className="card-info">
                    <div className="info-main">
                        <div className="main-name">
                            <div className="name">patientName</div>
                            <div className="status" >默认</div>
                        </div>
                    </div>
                    <div className="info-extra">patCardTypeName:patCardNo</div>
                    <div className="info-extra">电话号码：patientMobile</div>
                </div>
            </Link>
            {/*<block wx:for="{{cardList}}" wx:for-index="idx" wx:for-item="card" wx:key="{{idx}}">
             <navigator className="m-card" url="/pages/usercenter/userinfo/index?patientId={{card.patientId}}">
             <div className="card-info">
             <div className="info-main">
             <div className="main-name">
             <div className="name">{{card.patientName}}</div>
             <div className="status" wx:if="{{card.isDefault == 1}}">默认</div>
             </div>
             </div>
             <div className="info-extra">{{card.patCardTypeName || '就诊卡'}}：{{card.patCardNo}}</div>
             <div className="info-extra">电话号码：{{card.patientMobile}}</div>
             </div>
             </navigator>
             </block>*/}
            <div  className="m-adduser" >
                <div><img src="../../../resources/images/plus.png" /></div>
                <div>
                    <div className="add-title">添加就诊人</div>
                    <div className="add-text">还可添加2人</div>
                </div>
            </div>
            {/*<div @tap="isRegister" className="m-adduser" wx:if="{{2-cardList.length>0}}">
             <div><img src="../../../resources/images/plus.png" /></div>
             <div>
             <div className="add-title">添加就诊人</div>
             <div className="add-text">还可添加{{2-cardList.length}}人</div>
             </div>
             </div>
             */}
            <div className="bandTip">
                您只能绑定两张就诊卡，如果已有两张就诊卡,
            </div>
            <div className="bandTip">
                需要删除以后才能绑定新的就诊卡
            </div>

        </div>


    );
  }
}

export default Connect()(Widget);
