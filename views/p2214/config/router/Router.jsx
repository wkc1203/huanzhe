import React from 'react';
import { Router, Route,Switch } from 'react-router';
import hashHistory from 'react-router/lib/hashHistory';
import IndexRedirect from 'react-router/lib/IndexRedirect';
import Redirect from 'react-router/lib/Redirect';

import Root from '../../components/root/Root';
import Connect from '../../components/connect/Connect';

import { setTitle,getIsWeiXin } from '../../utils/utils';
import { INHOSP, TREAT } from '../../config/constant/constant';

/**
 * 医院信息
 */
import HospitalInformation from '../../pages/hospitalInformation/hospitalInformation/hospitalInformation';

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

/* mdt */

import MdtList from '../../pages/mdt/list/List';
import MdtDetail from '../../pages/mdt/detail/Detail';
import MdtApply from '../../pages/mdt/apply/Apply';
import MdtUpload from '../../pages/mdt/upload/Upload';
import MdtReport from '../../pages/mdt/report/report';  


/**
 * 权限
 */
import GetUserInfo from '../../pages/auth/getuserinfo/GetuserInfo';
import Developing from '../../pages/auth/developing/Developing';
import Follow from '../../pages/auth/follow/Follow';

import userLogin from '../../pages/auth/login/Login';


/**
 * 咨询
 */
import Inquiry from '../../pages/inquiry/inquirylist/InquiryList';
import ChatIndex from '../../pages/inquiry/chat/ChatIndex';
import MdtInquiry from '../../pages/inquiry/mdtInquiry/MdtIndex';
import AiInquiry from '../../pages/inquiry/aiInquiry/AIIndex';


/**
 * 订单
 */
import Evaluate from '../../pages/ordermng/evaluate/Evaluate';
import OrderDetail from '../../pages/ordermng/orderdetail/OrderDetail';
import OrderList from '../../pages/ordermng/orderlist/OrderList';//咨询订单
import CheckDetail from '../../pages/ordermng/checkdetail/CheckDetail';
import CheckOrder from '../../pages/ordermng/checkorder/CheckOrder';
import CheckAdd from '../../pages/ordermng/checkadd/CheckAdd';
import MdtOrder from '../../pages/ordermng/mdtdetail/MdtDetail';//检查单订单
import DescribeDetail from '../../pages/ordermng/describedetail/DescribeDetail';
import DescribeInfo from '../../pages/ordermng/describeinfo/DescribeInfo';

/**
 * 科室医生
 */
import FreeReport from '../../pages/consult/report/Report';
import ConfirmInfo from '../../pages/consult/confirminfo/ConfirmInfo';
import DeptDetail from '../../pages/consult/deptdetail/DeptDetail';
import DeptList from '../../pages/consult/deptlist/DeptList';
import DeptListTest from '../../pages/consult/deptlist/DeptListTest';
import AllDeptList from '../../pages/consult/alldeptlist/AllDeptList';
import Pay from '../../pages/consult/pay/Pay';
import Waiting from '../../pages/consult/waiting/Waiting';
import Describe from '../../pages/consult/describe/Describe';
import SubmitDesc from '../../pages/consult/submitdesc/SubmitDesc';



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
 * 随访
 */
import AskIndex from '../../pages/ask/index/Index';
import AskLogin from '../../pages/ask/login/Login';
import AskQuestion from '../../pages/ask/question/Question';


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
import Notice from '../../pages/microweb/notice/NoticeIndex';


/**
 * 个人中心
 */
import IUHome from '../../pages/usercenter/home/Home';
import AddCard from '../../pages/usercenter/addcard/AddCard';
import ICardTip from '../../pages/usercenter/cardtip/CardTip';
import ICollect from '../../pages/usercenter/collect/CollectIndex';
// import IComplain from '../../pages/usercenter/complain/ComplainIndex';
import NewPhone from '../../pages/usercenter/newphone/NewPhone';
import SameCard from '../../pages/usercenter/samecard/SameCard';
import UserList from '../../pages/usercenter/userlist/UserList';
import UserInfo from '../../pages/usercenter/userinfo/UserInfo';
// //投诉建议
// import suggestDetail from '../../pages/usercenter/suggestDetail/suggestDetail';
import Suggestion from '../../pages/usercenter/mySuggestion/mySuggestion'; 
// import Replay from '../../pages/usercenter/replay/replay';
// 随访记录-首页
import Tabcard from '../../pages/usercenter/tabcard/index'
import UserCardInfo from '../../pages/usercenter/tabcardmap/index'
import UserCardList from '../../pages/usercenter/tabcardlist/index'
import UserCardXuanJiaoList from '../../pages/usercenter/tabcardjiankangList/index'
import UserCardJianCheList from '../../pages/usercenter/tabcardjianche/index'
import XuanJiaoDetail from '../../pages/usercenter/tabcardxuanjiaodetail/index'
import UserCardWenJuan from '../../pages/usercenter/tabcardwenjuan/index'

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
            CLOSE_FUNCTION.map((v, k) => <Redirect from={v.regexp} to="/common/development"  />)
          }
          {/* 医院信息 */}
          <Route path="/hospitalInformation">
            <IndexRedirect to="/hospitalInformation/hospitalInformation" />
            <Route path="/hospitalInformation/hospitalInformation" component={HospitalInformation} title='重医儿童医院咨询平台' />
          </Route>
          {/* 科室医生 */}
          {/* 检查单 */}
          <Route path="/check">
            <IndexRedirect to="/check/confirmCheck" />
            <Route path="/check/confirmCheck" component={ConfirmCheck} title='重医儿童医院咨询平台' />
            <Route path="/check/checkInfo" component={CheckInfo} title='重医儿童医院咨询平台' />
            <Route path="/check/registerInfo" component={RegisterInfo} title='重医儿童医院咨询平台' />
            <Route path="/check/checkPay" component={CheckPay} title='重医儿童医院咨询平台' />
            <Route path="/check/checkList" component={CheckList} title='重医儿童医院咨询平台' />
           
          </Route>
          {/* 医院信息 */}
          <Route path="/hospitalInformation">
            <IndexRedirect to="/hospitalInformation/hospitalInformation" />
            <Route path="/hospitalInformation/hospitalInformation" component={HospitalInformation} title='重医儿童医院咨询平台' />
          </Route>
          {/* 科室医生 */}
          <Route path="/consult">
            <IndexRedirect to="/consult/confirminfo" />
            <Route path="/consult/confirminfo" component={ConfirmInfo} title='重医儿童医院咨询平台' />
            <Route path="/consult/deptdetail" component={DeptDetail} title='重医儿童医院咨询平台' />
            <Route path="/consult/alldeptlist" component={AllDeptList} title='重医儿童医院咨询平台' />
            <Route path="/consult/deptlist" component={DeptListTest} title='重医儿童医院咨询平台' />
            {/* <Route path="/consult/deptlistest" component={DeptListTest} title='重医儿童医院咨询平台' /> */}
            <Route path="/consult/waiting" component={Waiting} title='支付处理中' />
            <Route path="/consult/pay" component={Pay} title='重医儿童医院咨询平台' />
            <Route path="/consult/report" component={FreeReport} title='重医儿童医院咨询平台' />
            <Route path="/consult/describe" component={Describe} title='重医儿童医院咨询平台' />
            <Route path="/consult/submitdesc" component={SubmitDesc} title='重医儿童医院咨询平台' />

            </Route>
          
          {/* mdt*/}
          <Route path="/mdt">
            <IndexRedirect to="/mdt/list" />
              <Route path="/mdt/list" component={MdtList} title='重医儿童医院咨询平台' />
              <Route path="/mdt/detail" component={MdtDetail} title='重医儿童医院咨询平台' />
              <Route path="/mdt/apply" component={MdtApply} title='重医儿童医院咨询平台' />
              <Route path="/mdt/upload" component={MdtUpload} title='重医儿童医院咨询平台' />
              <Route path="/mdt/report" component={MdtReport} title='重医儿童医院咨询平台' />

            </Route>
          <Route path="/ordermng">
            <IndexRedirect to="/ordermng/evaluate" />
            <Route path="/ordermng/evaluate" component={Evaluate} title='重医儿童医院咨询平台' />
            <Route path="/ordermng/orderdetail" component={OrderDetail} title='重医儿童医院咨询平台' />
            <Route path="/ordermng/orderlist" component={OrderList} title='重医儿童医院咨询平台' />
            <Route path="/ordermng/checkdetail" component={CheckDetail} title='重医儿童医院咨询平台' />
            <Route path="/ordermng/checkorder" component={CheckOrder} title='重医儿童医院咨询平台' />
            <Route path="/ordermng/checkadd" component={CheckAdd} title='重医儿童医院咨询平台' />
            {<Route path="/ordermng/mdtdetail" component={MdtOrder} title='重医儿童医院咨询平台' />}
            <Route path="/ordermng/describedetail" component={DescribeDetail} title='重医儿童医院咨询平台' />
            <Route path="/ordermng/describeinfo" component={DescribeInfo} title='重医儿童医院咨询平台' />     
            </Route>


          {/* 登录 */}
          <Route path="/login">
            <IndexRedirect to="/login/loginindex" />
            <Route path="/login/loginindex" component={LoginIndex} title='重医儿童医院咨询平台' />
            <Route path="/login/noregister" component={NoRegister} title='重医儿童医院咨询平台' />
          </Route>
          {/* 报告 */}
          <Route path="/report">
            <IndexRedirect to="/report/reportList" />
            <Route path="/report/reportList" component={ReportList} title='重医儿童医院咨询平台' />
            <Route path="/report/reportInfo" component={ReportInfo} title='重医儿童医院咨询平台' />
          </Route>
          {/* 常用服务 */}
          <Route path="/microweb">
            <IndexRedirect to="/microweb/deptinfo" />
            <Route path="/microweb/deptinfo" component={DeptInfo} title='重医儿童医院咨询平台' />
            <Route path="/microweb/deptlist" component={MDeptList} title='重医儿童医院咨询平台' />
            <Route path="/microweb/deptlistfordoc" component={DeptListForDoc} title='重医儿童医院咨询平台' />
            <Route path="/microweb/doctorinfo" component={MDoctorInfo} title='重医儿童医院咨询平台' />
            <Route path="/microweb/news" component={News} title='重医儿童医院咨询平台' />
            <Route path="/microweb/notice" component={Notice} title='重医儿童医院咨询平台' />
            <Route path="/microweb/article" component={ArticleIndex} title='重医儿童医院咨询平台' />
          </Route>

          {/* 权限 */}
          <Route path="/auth">
            <IndexRedirect to="/auth/getuserinfo" />
            <Route path="/auth/getuserinfo" component={GetUserInfo} title='重医儿童医院咨询平台' />
            <Route path="/auth/developing" component={Developing} title='重医儿童医院咨询平台' />
            <Route path="/auth/follow" component={Follow} title='重医儿童医院咨询平台' />
            <Route path="/auth/login" component={userLogin} title='订阅' />

          </Route>
          {/* 咨询 */}
          <Route path="/inquiry">
            <IndexRedirect to="/inquiry/inquirylist" />
            <Route path="/inquiry/inquirylist" component={Inquiry} title='咨询会话' />
            <Route path="/inquiry/chat" component={ChatIndex} title='重医儿童医院咨询平台' />
            <Route path="/inquiry/mdtInquiry" component={MdtInquiry} title='重医儿童医院咨询平台' />
            <Route path="/inquiry/AiInquiry" component={AiInquiry} title='重医儿童医院咨询平台' />

            
          
            </Route>
          {/* 门诊加号 */}
          <Route path="/add">
            <IndexRedirect to="/add/addManage" />
            <Route path="/add/addManage" component={AddManage} title='重医儿童医院咨询平台' />
            <Route path="/add/cardtip" component={CardTip} title='重医儿童医院咨询平台' />
            <Route path="/add/manageList" component={ManageList} title='重医儿童医院咨询平台' />
          </Route>

          {/* 个人中心 */}
          <Route path="/usercenter">
            <IndexRedirect to="/usercenter/home" />
            <Route path="/usercenter/home" component={IUHome} title='个人中心' />
            <Route path="/usercenter/addcard" component={AddCard} title='重医儿童医院咨询平台' />
            <Route path="/usercenter/cardtip" component={ICardTip} title='重医儿童医院咨询平台' />
            {/* <Route path="/usercenter/complain" component={IComplain} title='重医儿童医院咨询平台' /> */}
            <Route path="/usercenter/collect" component={ICollect} title='重医儿童医院咨询平台' />
            <Route path="/usercenter/newphone" component={NewPhone} title='重医儿童医院咨询平台' />
            <Route path="/usercenter/samecard" component={SameCard} title='重医儿童医院咨询平台' />
            <Route path="/usercenter/userinfo" component={UserInfo} title='重医儿童医院咨询平台' />
            <Route path="/usercenter/userlist" component={UserList} title='重医儿童医院咨询平台' />
             {/* 投诉建议 */}
             {/* <Route path="/usercenter/suggestdetail" component={suggestDetail} title='重医儿童医院咨询平台' /> */}
            <Route path="/usercenter/mysuggestion" component={Suggestion} title='重医儿童医院咨询平台' /> 
            {/* <Route path="/usercenter/replay" component={Replay} title='重医儿童医院咨询平台' /> */}
          </Route>

          {/* 首页 */}
          <Route path="/home">
            <IndexRedirect to="/home/index" />
            <Route path="/home/index" component={MicroIndex} title='重医儿童医院咨询平台' />
          </Route>
          {/* 随访 */}
          <Route path="/ask">
            <IndexRedirect to="/ask/index" />
            <Route path="/ask/index" component={AskIndex} title='随访管理' />
            <Route path="/ask/login" component={AskLogin} title='欢迎加入随访计划' />
            <Route path="/ask/question" component={AskQuestion} title='重医儿童医院' />

            // 随访记录-首页
            <Route path="/usercenter/tabcard" component={Tabcard} title='随访管理' />
            // 随访记录-我的
            <Route path="/usercenter/mytabcard" component={UserCardInfo} title='随访管理' />
            // 随访记录-个人信息详情
            <Route path="/usercenter/usercardlist" component={UserCardList} title='我的' />
            // 随访记录-健康宣教 UserCardXuanJiaoList
            <Route path="/usercenter/usercardxuanjiaolist" component={UserCardXuanJiaoList} title='健康宣教' />
            // 随访记录-健康监测 usercardjianchelist
            <Route path="/usercenter/usercardjianchelist" component={UserCardJianCheList} title='健康监测' />
            // 随访记录-宣教详情 XuanJiaoDetail
            <Route path="/usercenter/usercardxuanjiangdetail" component={XuanJiaoDetail} title='健康宣教' />
            // 随访记录-问卷填写 UserCardWenJuan
            <Route path="/usercenter/usercardwenjuan" component={UserCardWenJuan} title='健康宣教' />
            </Route>

        </Route>
      </Router>
    );
  }
}

export default Connect()(Routers);