import React from 'react';
import { Router, Route } from 'react-router';
import hashHistory from 'react-router/lib/hashHistory';
import IndexRedirect from 'react-router/lib/IndexRedirect';
import Redirect from 'react-router/lib/Redirect';

import Root from '../../components/root/Root';
import Connect from '../../components/connect/Connect';

import * as Api from './routerApi';
import { setTitle } from '../../utils/utils';
import { INHOSP, TREAT } from '../../config/constant/constant';

/**
 * 权限
 */
import GetUserInfo from '../../pages/auth/getuserinfo/GetuserInfo';
import Developing from '../../pages/auth/developing/Developing';



/**
 * 咨询
 */
import Inquiry from '../../pages/inquiry/inquirylist/InquiryList';
import ChatIndex from '../../pages/inquiry/chat/ChatIndex';


/**
 * 订单
 */
import Evaluate from '../../pages/ordermng/evaluate/Evaluate';
import OrderDetail from '../../pages/ordermng/orderdetail/OrderDetail';
import OrderList from '../../pages/ordermng/orderlist/OrderList';

/**
 * 科室医生
 */
import ConfirmInfo from '../../pages/consult/confirminfo/ConfirmInfo';
import DeptDetail from '../../pages/consult/deptdetail/DeptDetail';
import DeptList from '../../pages/consult/deptlist/DeptList';
import AllDeptList from '../../pages/consult/alldeptlist/AllDeptList';
import Pay from '../../pages/consult/pay/Pay';
import Waiting from '../../pages/consult/waiting/Waiting';



/**
 * 门诊加号
 */
import AddManage from '../../pages/add/addManage/AddManage';
import CardTip from '../../pages/add/cardtip/CardTip';
import ManageList from '../../pages/add/manageList/ManageList';

/**
 * 门诊加号
 */
import MicroIndex from '../../pages/home/index/Index';

/**
 * 登录
 */

import LoginIndex from '../../pages/login/loginindex/LoginIndex';
import NoRegister from '../../pages/login/noRegister/noRegister';

/**
 * 常用服务
 */
import DeptInfo from '../../pages/microweb/deptinfo/DeptInfo';
import MDeptList from '../../pages/microweb/deptlist/DeptList';
import DeptListForDoc from '../../pages/microweb/deptlistfordoc/DeptlistForDoc';
import MDoctorInfo from '../../pages/microweb/doctorinfo/DoctorInfo';
import News from '../../pages/microweb/news/News';
import ArticleIndex from '../../pages/microweb/article/ArticleIndex';


/**
 * 个人中心
 */
import IUHome from '../../pages/usercenter/home/Home';
import AddCard from '../../pages/usercenter/addcard/AddCard';
import ICardTip from '../../pages/usercenter/cardtip/CardTip';
import ICollect from '../../pages/usercenter/collect/CollectIndex';
import IComplain from '../../pages/usercenter/complain/ComplainIndex';
import NewPhone from '../../pages/usercenter/newphone/NewPhone';
import SameCard from '../../pages/usercenter/samecard/SameCard';
import UserList from '../../pages/usercenter/userlist/UserList';
import UserInfo from '../../pages/usercenter/userinfo/UserInfo';




class Routers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CLOSE_FUNCTION: [],
      apiLoading: true,
    };
  }

  componentDidMount() {
    //this.getHisFunction();
    this.hideLoading();
    console.log(this.state);
    this.setState({ apiLoading: false });
  }



  render(){
    const { CLOSE_FUNCTION, apiLoading } = this.state;
    return (
      apiLoading ? <div /> :
      <Router history={hashHistory}>
        {/*入口*/}
        <Route
          path="/"
          component={Root}
          onEnter={
            (nextRoute) => {
              const title = nextRoute && nextRoute.routes && nextRoute.routes.length > 0 ? (nextRoute.routes[nextRoute.routes.length - 1].title || '') : '';
              setTitle(title);
            }
          }
          onChange={
            (oldRoute, nextRoute) => {
              const title = nextRoute && nextRoute.routes && nextRoute.routes.length > 0 ? (nextRoute.routes[nextRoute.routes.length - 1].title || '') : '';
              setTitle(title);
            }
          }
        >
          <IndexRedirect to="/home/index" />
          {
            CLOSE_FUNCTION.map((v, k) => <Redirect from={v.regexp} to="/common/development" key={k} />)
          }
          {/* 科室医生 */}
          <Route path="/consult">
            <IndexRedirect to="/consult/confirminfo" />
            <Route path="/consult/confirminfo" component={ConfirmInfo} title='图文问诊' />
            <Route path="/consult/deptdetail" component={DeptDetail} title='专家名片' />
            <Route path="/consult/alldeptlist" component={AllDeptList} title='找专家咨询' />
            <Route path="/consult/deptlist" component={DeptList} title='找专家咨询' />
            <Route path="/consult/waiting" component={Waiting} title='支付处理中' />
            <Route path="/consult/pay" component={Pay} title='收银台' />

          </Route>
          {/* 订单*/}
          <Route path="/ordermng">
            <IndexRedirect to="/ordermng/evaluate" />
            <Route path="/ordermng/evaluate" component={Evaluate} title='服务评价' />
            <Route path="/ordermng/orderdetail" component={OrderDetail} title='互联网医院' />
            <Route path="/ordermng/orderlist" component={OrderList} title='咨询管理' />
          </Route>


          {/* 登录 */}
          <Route path="/login">
            <IndexRedirect to="/login/loginindex" />
            <Route path="/login/loginindex" component={LoginIndex} title='注册信息' />
            <Route path="/login/noregister" component={NoRegister} title='关注公众号' />

          </Route>
          {/* 常用服务 */}
          <Route path="/microweb">
            <IndexRedirect to="/microweb/deptinfo" />
            <Route path="/microweb/deptinfo" component={DeptInfo} title='科室信息' />
            <Route path="/microweb/deptlist" component={MDeptList} title='科室列表' />
            <Route path="/microweb/deptlistfordoc" component={DeptListForDoc} title='科室列表' />
            <Route path="/microweb/doctorinfo" component={MDoctorInfo} title='医生简介' />
            <Route path="/microweb/news" component={News} title='健康宣教' />
            <Route path="/microweb/article" component={ArticleIndex} title='新闻公告' />
          </Route>

          {/* 权限 */}
          <Route path="/auth">
            <IndexRedirect to="/auth/getuserinfo" />
            <Route path="/auth/getuserinfo" component={GetUserInfo} title='授权登录' />
            <Route path="/auth/developing" component={Developing} title='即将开放' />
          </Route>
          {/* 咨询 */}
          <Route path="/inquiry">
            <IndexRedirect to="/inquiry/inquirylist" />
            <Route path="/inquiry/inquirylist" component={Inquiry} title='咨询会话' />
            <Route path="/inquiry/chat" component={ChatIndex} title='问诊详情' />
          </Route>
          {/* 门诊加号 */}
          <Route path="/add">
            <IndexRedirect to="/add/addManage" />
            <Route path="/add/addManage" component={AddManage} title='加号详情' />
            <Route path="/add/cardtip" component={CardTip} title='如何支付' />
            <Route path="/add/manageList" component={ManageList} title='加号管理' />
          </Route>

          {/* 个人中心 */}
          <Route path="/usercenter">
            <IndexRedirect to="/usercenter/home" />
            <Route path="/usercenter/home" component={IUHome} title='个人中心' />
            <Route path="/usercenter/addcard" component={AddCard} title='绑定就诊卡' />
            <Route path="/usercenter/cardtip" component={ICardTip} title='如何绑卡' />
            <Route path="/usercenter/complain" component={IComplain} title='投诉建议' />
            <Route path="/usercenter/collect" component={ICollect} title='我的收藏' />
            <Route path="/usercenter/newphone" component={NewPhone} title='修改手机号码' />
            <Route path="/usercenter/samecard" component={SameCard} title='同步就诊人' />
            <Route path="/usercenter/userinfo" component={UserInfo} title='就诊人详情' />
            <Route path="/usercenter/userlist" component={UserList} title='我的就诊人' />
          </Route>

          {/* 首页 */}
          <Route path="/home">
            <IndexRedirect to="/home/index" />
            <Route path="/home/index" component={MicroIndex} title='医患在线' />
          </Route>

        </Route>
      </Router>
    );
  }
}

export default Connect()(Routers);