import React, { Component } from 'react';
import { InfiniteLoader, LoadMore } from 'react-weui';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import NoResult from '../../../components/noresult/NoResult';

import * as Api from './sameCardApi';
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
        <div>
        <div className="title">
            已检测到您在重医儿童医院微信公众号绑定了以下就诊人，请选择是否进行同步
        </div>
      {/*<div className="title" wx:if="{{cardList.length>0}}">
       已检测到您在重医儿童医院微信公众号绑定了以下就诊人，请选择是否进行同步
       </div>*/}
      <div className="card-item"  >
          <div className="collect"  >
              <img src="../../../resources/images/com.png"></img>
          </div>
          <div className="card-info">
              <div>就诊人  <span>name</span></div>
              <div>就诊卡 <span>patCardNo</span>  </div>
          </div>
      </div>
      <div className="card-item" >
          <div className="collect">
              <img src="../../../resources/images/default.png"/>
          </div>
          <div className="card-info no">
          <div >就诊人name</div>
          <div>就诊卡patCardNo</div>
          </div>
          </div>
      {/*<block wx:for="{{cardList}}" wx:for-index="idx" wx:for-item="card" wx:key="{{idx}}"  >
       <div className="card-item"  wx:if="{{card.accountId==null}}"  @tap="select1({{idx}})">
       <div className="collect"  >
       <img src="../../../resources/images/com.png" wx:if="{{card.isSelect}}"></img>
       <img src="../../../resources/images/nocom.png" wx:if="{{!card.isSelect}}"></img>
       </div>
       <div className="card-info">
       <div>就诊人  <span>{{card.name}}</span></div>
       <div>就诊卡 <span>{{card.patCardNo}}</span>  </div>
       </div>
       </div>
       <div className="card-item" wx:if="{{card.accountId!=null}}">
       <div className="collect">
       <img src="../../../resources/images/default.png"/>
       </div>
       <div className="card-info no">
       <div >就诊人 {{card.name}}</div>
       <div>就诊卡 {{card.patCardNo}}</div>
       </div>
       </div>
       </block>*/}


      <div className="same">
          同步就诊人
      </div>
      <div className="bind" >
          绑定新就诊人
      {/*<div className="same" @tap="add" wx:if="{{cardList.length>0}}">
       同步就诊人
       </div>
       <div className="bind" @tap="goNext" wx:if="{{cardList.length>0}}">
       绑定新就诊人
       </div>*/}
          </div>
              </div>


                    );
  }
}

export default Connect()(Widget);
