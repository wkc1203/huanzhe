import React, { Component } from 'react';
import { InfiniteLoader, LoadMore } from 'react-weui';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import NoResult from '../../../components/noresult/NoResult';

import * as Api from './userInfoApi';
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
        <div className="ui-page">

            <div className="mu-card">
                <div className="card-info">
                    <div className="info-main">
                        <div className="main-name">
                            <div className="name">name</div>
                            <div className="status" >默认</div>
                        </div>
                    </div>
                    <div className="info-extra">patCardType   patCardNo</div>



                    {/*<div className="name">{{userInfo.name}}</div>
                     <div className="status" wx:if="{{userInfo.isDefalut == 1}}">默认</div>
                     </div>
                     </div>
                     <div className="info-extra">{{userInfo.patCardTypeName || '就诊卡'}}：{{userInfo.patCardNo||userInfo.idNo}}</div><!-- 协商后台考虑无卡情况 -->
                     */}
                </div>
            </div>

            <div className="m-userinfo">

                <div className="userinfo-item" >
                    <div className="item-tit">性别</div>
                    <div className="item-txt">女</div>
                </div>
                <div className="userinfo-item" >
                    <div className="item-tit">出生日期</div>
                    <div className="item-txt">birth</div>
                </div>
                <div className="userinfo-item" >
                    <div className="item-tit">身份证号</div>
                    <div className="item-txt">idNo</div>
                </div>
                <div className="userinfo-item">
                    <div className="item-tit">手机号</div>
                    <div className="item-txt">mobile</div>
                </div>
                <div className="userinfo-item">
                    <div className="item-tit">就诊卡号</div>
                    <div className="item-txt">patCardNo</div>
                </div>
            </div>

            {/*<div className="userinfo-item" wx:if="{{userInfo.sex}}">
             <div className="item-tit">性别</div>
             <div className="item-txt">{{userInfo.sex === 'M' ? '男' : '女'}}</div>
             </div>
             <div className="userinfo-item" wx:if="{{userInfo.birthday}}">
             <div className="item-tit">出生日期</div>
             <div className="item-txt">{{userInfo.birth}}</div>
             </div>
             <div className="userinfo-item" wx:if="{{userInfo.idNo}}">
             <div className="item-tit">身份证号</div>
             <div className="item-txt">{{userInfo.idNo}}</div>
             </div>
             <div className="userinfo-item">
             <div className="item-tit">手机号</div>
             <div className="item-txt">{{userInfo.mobile}}</div>
             </div>
             <div className="userinfo-item">
             <div className="item-tit">就诊卡号</div>
             <div className="item-txt">{{userInfo.patCardNo||userInfo.idNo}}</div>
             </div>
             </div>*/}

            <div className="mu-list">
                <div className="list-item" >
                    <div className="item">
                        <div className="item-hd">设为默认就诊人</div>
                        <div className="item-bd disabled" >
                            <switch checked="" disabled color="#3ECDB5" />
                        </div>
                    </div>
                </div>
                {/*<div className="list-item" wx:if="{{userInfo.isDefalut == 0}}">
                 <div className="item">
                 <div className="item-hd">设为默认就诊人</div>
                 <div className="item-bd disabled" @tap="setDefault">
                 <switch checked="{{userInfo.isDefalut == 1}}" disabled color="#3ECDB5" />
                 </div>
                 </div>
                 </div>*/}

                <div className="m-btn">

                    <div className="btn-item default-btn" >删除就诊人</div>
                </div>

            </div>

        </div>


    );
  }
}

export default Connect()(Widget);
