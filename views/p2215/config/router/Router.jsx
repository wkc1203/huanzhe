import React from 'react';
import { Router, Route } from 'react-router';
import hashHistory from 'react-router/lib/hashHistory';
import IndexRedirect from 'react-router/lib/IndexRedirect';
import Redirect from 'react-router/lib/Redirect';

import Root from '../../components/root/Root';
import Connect from '../../components/connect/Connect';

import * as Api from './routerApi';
import { setTitle,getIsWeiXin } from '../../utils/utils';
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
 * 报告
 */
import ReportList from '../../pages/report/reportList/ReportList';
import ReportInfo from '../../pages/report/reportInfo/ReportInfo';

  

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
import ReportOrderList from '../../pages/ordermng/reportOrderList/ReportOrderList';//检查单订单

/**
 * 科室医生
 */
import ConfirmInfo from '../../pages/consult/confirminfo/ConfirmInfo';
import DeptDetail from '../../pages/consult/deptdetail/DeptDetail';
import DeptList from '../../pages/consult/deptlist/DeptList';
import AllDeptList from '../../pages/consult/alldeptlist/AllDeptList';
import Pay from '../../pages/consult/pay/Pay';
import Waiting from '../../pages/consult/waiting/Waiting';
import PatientInfo from '../../pages/consult/patientinfo/patientinfo';
import addPatient from '../../pages/consult/addpatient/addpatient'



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

// 缺省页
import Queshengye from '../../pages/queshengye/index'


class Routers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CLOSE_FUNCTION: [],
      apiLoading: true,
      isWeiXin:true
    };
  }

  componentDidMount() {
    //this.getHisFunction();
    this.hideLoading();
    console.log(this.state);
    const isWeiXin=getIsWeiXin()
    if(!isWeiXin){
      this.setState({
        isWeiXin:false
      })
    }
    this.setState({ apiLoading: false });
  }



  render(){
    const { CLOSE_FUNCTION, apiLoading,isWeiXin } = this.state;
    return (
      !isWeiXin?
      <Router history={hashHistory}>
          <Route path="/*" component={Queshengye}/>
      </Router>
      :
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
          {/* 检查单 */}
          <Route path="/check">
            <IndexRedirect to="/check/confirmCheck" />
            <Route path="/check/confirmCheck" component={ConfirmCheck} title='在线咨询' />
            <Route path="/check/checkInfo" component={CheckInfo} title='在线咨询' />
            <Route path="/check/registerInfo" component={RegisterInfo} title='在线咨询' />
            <Route path="/check/checkPay" component={CheckPay} title='在线咨询' />
            <Route path="/check/checkList" component={CheckList} title='在线咨询' />

          </Route>
          {/* 科室医生 */}
          <Route path="/consult">
            <IndexRedirect to="/consult/confirminfo" />
            <Route path="/consult/confirminfo" component={ConfirmInfo} title='在线咨询' />
            <Route path="/consult/deptdetail" component={DeptDetail} title='在线咨询' />
            <Route path="/consult/alldeptlist" component={AllDeptList} title='在线咨询' />
            <Route path="/consult/deptlist" component={DeptList} title='在线咨询' />
            <Route path="/consult/waiting" component={Waiting} title='支付处理中' />
            <Route path="/consult/pay" component={Pay} title='在线咨询' />
            <Route path="/consult/patientinfo" component={PatientInfo} title='在线咨询' />
            <Route path="/consult/addpatient" component={addPatient} title='在线咨询' />

          </Route>
          {/* 订单*/}
          <Route path="/ordermng">
            <IndexRedirect to="/ordermng/evaluate" />
            <Route path="/ordermng/evaluate" component={Evaluate} title='在线咨询' />
            <Route path="/ordermng/orderdetail" component={OrderDetail} title='在线咨询' />
            <Route path="/ordermng/orderlist" component={OrderList} title='在线咨询' />
            <Route path="/ordermng/reportOrderlist" component={ReportOrderList} title='在线咨询' />
          </Route>


          {/* 登录 */}
          <Route path="/login">
            <IndexRedirect to="/login/loginindex" />
            <Route path="/login/loginindex" component={LoginIndex} title='在线咨询' />
            <Route path="/login/noregister" component={NoRegister} title='在线咨询' />
          </Route>
          {/* 报告 */}
          <Route path="/report">
            <IndexRedirect to="/report/reportList" />
            <Route path="/report/reportList" component={ReportList} title='在线咨询' />
            <Route path="/report/reportInfo" component={ReportInfo} title='在线咨询' />
          </Route>
          {/* 常用服务 */}
          <Route path="/microweb">
            <IndexRedirect to="/microweb/deptinfo" />
            <Route path="/microweb/deptinfo" component={DeptInfo} title='在线咨询' />
            <Route path="/microweb/deptlist" component={MDeptList} title='在线咨询' />
            <Route path="/microweb/deptlistfordoc" component={DeptListForDoc} title='在线咨询' />
            <Route path="/microweb/doctorinfo" component={MDoctorInfo} title='在线咨询' />
            <Route path="/microweb/news" component={News} title='在线咨询' />
            <Route path="/microweb/article" component={ArticleIndex} title='在线咨询' />
          </Route>

          {/* 权限 */}
          <Route path="/auth">
            <IndexRedirect to="/auth/getuserinfo" />
            <Route path="/auth/getuserinfo" component={GetUserInfo} title='在线咨询' />
            <Route path="/auth/developing" component={Developing} title='在线咨询' />
            <Route path="/auth/login" component={userLogin} title='订阅' />

          </Route>
          {/* 咨询 */}
          <Route path="/inquiry">
            <IndexRedirect to="/inquiry/inquirylist" />
            <Route path="/inquiry/inquirylist" component={Inquiry} title='咨询会话' />
            <Route path="/inquiry/chat" component={ChatIndex} title='在线咨询' />
          </Route>
          {/* 门诊加号 */}
          <Route path="/add">
            <IndexRedirect to="/add/addManage" />
            <Route path="/add/addManage" component={AddManage} title='在线咨询' />
            <Route path="/add/cardtip" component={CardTip} title='在线咨询' />
            <Route path="/add/manageList" component={ManageList} title='在线咨询' />
          </Route>

          {/* 个人中心 */}
          <Route path="/usercenter">
            <IndexRedirect to="/usercenter/home" />
            <Route path="/usercenter/home" component={IUHome} title='个人中心' />
            <Route path="/usercenter/addcard" component={AddCard} title='在线咨询' />
            <Route path="/usercenter/cardtip" component={ICardTip} title='在线咨询' />
            <Route path="/usercenter/complain" component={IComplain} title='在线咨询' />
            <Route path="/usercenter/collect" component={ICollect} title='在线咨询' />
            <Route path="/usercenter/newphone" component={NewPhone} title='在线咨询' />
            <Route path="/usercenter/samecard" component={SameCard} title='在线咨询' />
            <Route path="/usercenter/userinfo" component={UserInfo} title='在线咨询' />
            <Route path="/usercenter/userlist" component={UserList} title='在线咨询' />
            

          </Route>

          {/* 首页 */}
          <Route path="/home">
            <IndexRedirect to="/home/index" />
            <Route path="/home/index" component={MicroIndex} title='在线咨询' />
          </Route>

        </Route>
      </Router>
    );
  }
}

export default Connect()(Routers);