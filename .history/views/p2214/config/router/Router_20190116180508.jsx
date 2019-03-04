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
 * 检查单
 */
import ConfirmCheck from '../../pages/check/confirmCheck/ConfirmCheck';
import RegisterInfo from '../../pages/check/registerInfo/RegisterInfo';
import CheckPay from '../../pages/check/checkPay/CheckPay';
import CheckInfo from '../../pages/check/checkInfo/CheckInfo';
import CheckList from '../../pages/check/checkList/CheckList';




  

/**
 * 权限
 */
import GetUserInfo from '../../pages/auth/getuserinfo/GetuserInfo';
import Developing from '../../pages/auth/developing/Developing';

import userLogin from '../../pages/auth/login/Login';


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
import OrderList from '../../pages/ordermng/orderlist/OrderList';//咨询订单

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
    this.hideLoading();
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
            CLOSE_FUNCTION.map((v, k) => <Redirect from={v.regexp} to="/common/development"  />)
          }
          {/* 检查单 */}
          <Route path="/check">
            <IndexRedirect to="/check/confirmCheck" />
            <Route path="/check/confirmCheck" component={ConfirmCheck} title='重医儿童医院互联网医院' />
            <Route path="/check/checkInfo" component={CheckInfo} title='重医儿童医院互联网医院' />
            <Route path="/check/registerInfo" component={RegisterInfo} title='重医儿童医院互联网医院' />
            <Route path="/check/checkPay" component={CheckPay} title='重医儿童医院互联网医院' />
            <Route path="/check/checkList" component={CheckList} title='重医儿童医院互联网医院' />
   
          </Route>
          {/* 科室医生 */}
          <Route path="/consult">
            <IndexRedirect to="/consult/confirminfo" />
            <Route path="/consult/confirminfo" component={ConfirmInfo} title='重医儿童医院互联网医院' />
            <Route path="/consult/deptdetail" component={DeptDetail} title='重医儿童医院互联网医院' />
            <Route path="/consult/alldeptlist" component={AllDeptList} title='重医儿童医院互联网医院' />
            <Route path="/consult/deptlist" component={DeptList} title='重医儿童医院互联网医院' />
            <Route path="/consult/waiting" component={Waiting} title='支付处理中' />
            <Route path="/consult/pay" component={Pay} title='重医儿童医院互联网医院' />
          </Route>
          {/* 订单*/}
          <Route path="/ordermng">
            <IndexRedirect to="/ordermng/evaluate" />
            <Route path="/ordermng/evaluate" component={Evaluate} title='重医儿童医院互联网医院' />
            <Route path="/ordermng/orderdetail" component={OrderDetail} title='重医儿童医院互联网医院' />
            <Route path="/ordermng/orderlist" component={OrderList} title='重医儿童医院互联网医院' />
          </Route>


          {/* 登录 */}
          <Route path="/login">
            <IndexRedirect to="/login/loginindex" />
            <Route path="/login/loginindex" component={LoginIndex} title='重医儿童医院互联网医院' />
            <Route path="/login/noregister" component={NoRegister} title='重医儿童医院互联网医院' />
          </Route>
         
          {/* 常用服务 */}
          <Route path="/microweb">
            <IndexRedirect to="/microweb/deptinfo" />
            <Route path="/microweb/deptinfo" component={DeptInfo} title='重医儿童医院互联网医院' />
            <Route path="/microweb/deptlist" component={MDeptList} title='重医儿童医院互联网医院' />
            <Route path="/microweb/deptlistfordoc" component={DeptListForDoc} title='重医儿童医院互联网医院' />
            <Route path="/microweb/doctorinfo" component={MDoctorInfo} title='重医儿童医院互联网医院' />
            <Route path="/microweb/news" component={News} title='重医儿童医院互联网医院' />
            <Route path="/microweb/article" component={ArticleIndex} title='重医儿童医院互联网医院' />
          </Route>

          {/* 权限 */}
          <Route path="/auth">
            <IndexRedirect to="/auth/getuserinfo" />
            <Route path="/auth/getuserinfo" component={GetUserInfo} title='重医儿童医院互联网医院' />
            <Route path="/auth/developing" component={Developing} title='重医儿童医院互联网医院' />
            <Route path="/auth/login" component={userLogin} title='登录' />

          </Route>
          {/* 咨询 */}
          <Route path="/inquiry">
            <IndexRedirect to="/inquiry/inquirylist" />
            <Route path="/inquiry/inquirylist" component={Inquiry} title='咨询会话' />
            <Route path="/inquiry/chat" component={ChatIndex} title='重医儿童医院互联网医院' />
          </Route>
          {/* 门诊加号 */}
          <Route path="/add">
            <IndexRedirect to="/add/addManage" />
            <Route path="/add/addManage" component={AddManage} title='重医儿童医院互联网医院' />
            <Route path="/add/cardtip" component={CardTip} title='重医儿童医院互联网医院' />
            <Route path="/add/manageList" component={ManageList} title='重医儿童医院互联网医院' />
          </Route>

          {/* 个人中心 */}
          <Route path="/usercenter">
            <IndexRedirect to="/usercenter/home" />
            <Route path="/usercenter/home" component={IUHome} title='个人中心' />
            <Route path="/usercenter/addcard" component={AddCard} title='重医儿童医院互联网医院' />
            <Route path="/usercenter/cardtip" component={ICardTip} title='重医儿童医院互联网医院' />
            <Route path="/usercenter/complain" component={IComplain} title='重医儿童医院互联网医院' />
            <Route path="/usercenter/collect" component={ICollect} title='重医儿童医院互联网医院' />
            <Route path="/usercenter/newphone" component={NewPhone} title='重医儿童医院互联网医院' />
            <Route path="/usercenter/samecard" component={SameCard} title='重医儿童医院互联网医院' />
            <Route path="/usercenter/userinfo" component={UserInfo} title='重医儿童医院互联网医院' />
            <Route path="/usercenter/userlist" component={UserList} title='重医儿童医院互联网医院' />
          </Route>

          {/* 首页 */}
          <Route path="/home">
            <IndexRedirect to="/home/index" />
            <Route path="/home/index" component={MicroIndex} title='重医儿童医院互联网医院' />
          </Route>

        </Route>
      </Router>
    );
  }
}

export default Connect()(Routers);