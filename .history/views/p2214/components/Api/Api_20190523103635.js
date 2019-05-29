import fetch from '../../utils/fetch';
import fetchs from '../../utils/fetchs';
//获取就诊人列表
export const getCardList = (param) =>  fetch.post('/api/ehis/user/personal/autoSynchronousPatients', param);

//是否注册
export const isRegister = (param) =>  fetch.post('/api/ehis/user/personal/isregistered', param);

//获取公众号就诊人列表
export const getCardList1 = (param) =>  fetch.post('/api/ehis/user/personal/getPatientsFromHosp', param);

//获取微信配置
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

//是否关注
export const getOpenId = (param) => fetch.post('/api/ehis/user/personal/getWxUserInfoByOpenId', param);

//同步
export const sameCard = (param) =>  fetch.post('/api/ehis/user/personal/SynchronousPatients', param);

//获取二维码
export const getCode = (param) =>  fetch.post('/api/ehis/wx/qrcode/follow/list', param);


export const getUserInfo = (param) =>  fetch.post('/api/ehis/user/personal/getpatientinfo', param);

export const unBind = (param) =>  fetch.post('/api/ehis/user/personal/unbindpatient', param);

export const setDefault = (param) =>  fetch.post('/api/ehis/user/personal/setdefaultpatient', param);

export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

export const bindCard = (param) =>  fetch.post('/api/ehis/user/personal/addpatients', param);
export const getCardList1 = (param) =>  fetch.post('/api/ehis/user/personal/getPatientsFromHosp', param);

export const getCardList = (param) =>  fetch.post('/api/ehis/user/personal/getpatientslist', param);

export const sameCard = (param) =>  fetch.post('/api/ehis/user/personal/SynchronousPatients', param);

export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export const getValidate = (param) => fetch.post('/api/ehis/user/personal/sendvalidatecode', param);

export const modifyPhone = (param) => fetch.post('/api/ehis/user/personal/updateuserinfo', param);

export const getUser = (param) => fetch.post('/api/ehis/user/personal/getuser', param);

export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

export const isRegistered = param => fetch.post('/api/ehis/user/personal/isregistered', param);

export const getUser = (param) => fetch.post('/api/ehis/user/personal/getuser', param);

export const getCardList = (param) => fetch.post('/api/ehis/user/personal/autoSynchronousPatients', param);

export const getCardList1 = (param) => fetch.post('/api/ehis/user/personal/getPatientsFromHosp', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export const getOpenId = (param) => fetch.post('/api/ehis/user/personal/getWxUserInfoByOpenId', param);
export const sameCard = (param) =>  fetch.post('/api/ehis/user/personal/SynchronousPatients', param);

export const getCode = (param) =>  fetch.post('/api/ehis/wx/qrcode/follow/list', param);

export const getValidate = param => fetch.post('/api/ehis/user/msg/sendValicode', param);

export const validate = param => fetch.post('/api/ehis/user/msg/checkValicode', param);

export const checkTime = param => fetch.post('/api/ehis/user/personal/userCheckMsgFlag', param);


export const getMsg = (param) => fetch.post('/api/ehis/health/api/inquiry/message', param);
export const getHisInfo = param => fetch.post('api/ehis/common/cache/get/branner_his', param);

export const complain = (param) => fetch.post('/api/ehis/user/complaints/addcomplaintsinfo', param);

export const getSign = (param) => fetch.post('/api/ehis/health/api/file/sign', param);

export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

export const getHisInfo = param => fetch.post('api/ehis/common/cache/get/branner_his', param);


export const getCollectList = (param) =>  fetch.post('/api/ehis/user/favorite/getmyfavoritelist', param);

export const cancelCollect = (param) =>  fetch.post('/api/ehis/user/favorite/cancelmyfavorite', param, false);

export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export const bindCard = (param) => fetch.post('/api/ehis/user/personal/addPatientsNew', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
// 绑定就诊卡
export const getOrderList = (param) => fetch.post('/api/ehis/health/api/checkList/page', param);

export const getCardList = (param) => fetch.post('/api/ehis/user/personal/getpatientslist', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

export const getreportList = (param) => fetch.post('/api/ehis/health/api/reportInterpretation/getPatientReport', param);

export const getDoctor = (param) => fetch.post('/api/ehis/health/api/reportInterpretation/getDoctorByHospitalUserName', param);

export const createOrder = (param) => fetch.post('/api/ehis/health/api/inquiry/add', param);
// 绑定就诊卡
export const getOrderList = (param) => fetch.post('/api/ehis/order/getorderlist', param);

export const getCardList = (param) => fetch.post('/api/ehis/user/personal/getpatientslist', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

export const getInspectReportDetails = param => fetch.post('/api/front/customize/getInspectReportDetails', param);

export const getCheckReportDetailsOld = param => fetch.post('/api/front/customize/getCheckReportDetailsOld', param);

// 绑定就诊卡
export const getOrderList = (param) => fetch.post('/api/ehis/order/getorderlistByCard', param);

export const getCardList = (param) => fetch.post('/api/ehis/user/personal/getpatientslist', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export const getcheckList = (param) => fetch.post('/api/ehis/health/api/onlineCheckList/page', param);

export const getUploadToken = (param) => fetch.post('/api/qiniu/fileUploadToken', param);

export const createOrder = (param) => fetch.post('/api/ehis/health/api/inquiry/add', param);


export const getDocDetail = (param) => fetch.post('/api/ehis/health/api/doctor/doctor', param);

export const isRegister = (param) => fetch.post('/api/ehis/user/personal/isregistered', param);
// export const getResonList = (param) => post('/api/consultationReason/list', param);

export const getRegister= (param) =>fetch.post('/api/ehis/health/api/subscribe/getAllSubscribeByPatient',param);
export const getHisConfig = param => fetch.post('/api/personal/getbindcardprofile', param);
export const getUser = param => fetch.post('/api/personal/getuser', param);
export const getOrderDet = (param) => fetch.post('/api/ehis/order/getorderdetail', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export const getDocDet = (param) => fetch.post('/api/ehis/health/api/appraisal/preAppraisal', param);
export const evaluate = (param) => fetch.post('/api/ehis/health/api/appraisal/appraisal', param);
export const evaluate1 = (param) => fetch.post('/api/ehis/health/api/appraisal/appraisals', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export const getHisConfig = param => fetch.post('/api/personal/getbindcardprofile', param);
export const getUser = param => fetch.post('/api/personal/getuser', param);
export const getOrderDet = (param) => fetch.post('/api/ehis/order/getorderdetail', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export const getHisConfig = param => fetch.post('/api/personal/getbindcardprofile', param);
export const getUser = param => fetch.post('/api/personal/getuser', param);
export const getCheckDetail = (param) => fetch.post('/api/ehis/health/api/onlineCheckList/getById', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export const cancel = param => fetch.post('/api/ehis/health/api/onlineCheckList/returnMoney', param);

export const prePay = param => fetch.post('/api/ehis/health/api/onlineCheckList/hisOrderCreate', param);

export const getHisConfig = param => fetch.post('/api/personal/getbindcardprofile', param);
export const getUser = param => fetch.post('/api/personal/getuser', param);
export const getCheckDetail = (param) => fetch.post('/api/ehis/health/api/onlineCheckList/getById', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export const cancel = param => fetch.post('/api/ehis/health/api/onlineCheckList/returnMoney', param);

export const prePay = param => fetch.post('/api/ehis/health/api/onlineCheckList/hisOrderCreate', param);

export const getDoctorInfo = (param) => fetch.post('/api/ehis/health/api/doctor/doctor', param);

export const addCollect = (param) => fetch.post('/api/ehis/user/favorite/addmyfavorite', param, false);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

export const cancelCollect = (param) => fetch.post('/api/ehis/user/favorite/cancelmyfavorite', param, false);
export const getHisConfig = param => fetch.post('/api/personal/getbindcardprofile', param);
export const getUser = param => fetch.post('/api/personal/getuser', param);
export const deptListFull = param =>  fetch.post('/api/ehis/health/api/dept/getTopDepts', param);
export const docListFull = param =>  fetch.post('/api/ehis/health/api/doctor/page', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export const deptListFull = param => fetch.post('/api/ehis/health/api/dept/getDeptsByInitials', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export const getHisConfig = param => fetch.post('/api/personal/getbindcardprofile', param);
export const getDepInfo = (param) => fetch.post('/api/ehis/health/api/dept/dept', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export const getValidate = param => fetch.post('/api/ehis/user/msg/sendValicode', param);

export const register = param => fetch.post('/api/ehis/user/login/register', param);

export const validateImg = param => fetch.post('/api/ehis/user/personal/defaultKaptcha', param);

export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

export const getSum = (param) =>  fetch.post('/api/ehis/health/api/pageview/savePageviewData', param);
export const getValidate = param => fetch.post('/api/ehis/user/login/valicode', param);
export const register = param => fetch.post('/api/ehis/user/login/register', param);
export const validateImg = param => fetch.post('/api/ehis/user/personal/defaultKaptcha', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export const getHisInfo = param => fetch.post('/api/web/gethisinfo', param);

export const getInquiryList = (param) => fetch.post('/api/ehis/health/api/inquiry/userInquirys', param);

export const getMsg = (param) => fetch.post('/api/ehis/health/api/inquiry/message', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
//获取咨询详情
export const getChat = (param) => fetch.post('/api/ehis/health/api/inquiry/inquirys', param, false, false);
//发送消息
export const sendMsg = (param) => fetch.post('/api/ehis/health/api/inquiry/inquiry', param,false);
//关闭咨询
export const closure = (param) => fetch.post('/api/ehis/health/api/inquiry/closure', param);

export const change = (param) => fetch.post('/api/ehis/health/api/inquiry/change', param);

export const getDocDet = (param) => fetch.post('/api/ehis/health/api/appraisal/preAppraisal', param);
//评价
export const evaluate = (param) => fetch.post('/api/ehis/health/api/appraisal/appraisal', param);
//评价详情
export const evaluate1 = (param) => fetch.post('/api/ehis/health/api/appraisal/appraisals', param);
/* 获取上传到oss的配置 */
export const getSign = (param) => fetch.post('/api/ehis/health/api/file/sign', param);
/* 获取微信接口配置 */
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
/* 获取医生消息的提示消息 */
export const getMsg = (param) => fetch.post('/api/ehis/health/api/inquiry/message', param);

export const getDocList = (param) => fetch.post('/api/ehis/health/api/doctor/page', param);

export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

export const getInfo = (param) => fetch.post('/api/ehis/health/api/doctor/page/v2', param);

export const getStatus = (param) =>  fetch.post('/api/ehis/common/cache/get/system_error', param);

export const getHisInfo = param => fetch.post('api/ehis/common/cache/get/branner_his', param);
export const getChat = (param) => fetch.post('/api/ehis/health/api/inquiry/inquirys', param, false, false);


export const getPayInfo = (param) =>  fetch.post('/api/ehis/health/api/inquiry/pay', param);

export const getConsultDet1 = (param) =>  fetch.post('/api/ehis/health/api/inquiry/prePay', param);

export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

export const orderStatus = (param) => fetch.post('/api/ehis/health/api/inquiry/getOrderStatus', param, false);


export const getStatus = (param) => fetch.post('/api/ehis/health/api/inquiry/getOrderStatus', param, false);

export const getHisInfo = param => fetch.post('api/ehis/common/cache/get/branner_his', param);

export const getPayInfo = (param) =>  fetch.post('/api/ehis/health/api/inquiry/pay', param);

export const getConsultDet1 = (param) =>  fetch.post('/api/ehis/health/api/inquiry/prePay', param);

export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

export const getPayInfo1 = (param) =>  fetch.post('/api/ehis/health/api/checkList/pay', param);

export const getAddInfo = (param) =>  fetch.post('/api/ehis/health/api/subscribe/prePay', param);

export const getSum = (param) =>  fetch.post('/api/ehis/health/api/pageview/savePageviewData', param);

export const getCheckInfo = (param) =>  fetch.post('/api/ehis/health/api/onlineCheckList/prePay', param);

export const orderStatus = (param) => fetch.post('/api/ehis/health/api/inquiry/getOrderStatus', param, false);


export const getInfo = (param) => fetch.post('/api/ehis/health/api/subscribe/getSubscribeDetailsByOrder', param);


export const prePay = param => fetch.post('/api/ehis/health/api/onlineCheckList/hisOrderCreate', param);

export const getInfo1 = (param) => fetch.post('/api/ehis/health/api/subscribe/getSubscribeDetails', param);

export const getCheckDetail = (param) => fetch.post('/api/ehis/health/api/onlineCheckList/getById', param);

export const update = (param) => fetch.post('/api/ehis/health/api/onlineCheckList/updateOnlineCheckList', param);

export const getHisInfo = param => fetch.post('api/ehis/common/cache/get/branner_his', param);

export const getDocList = (param) => fetch.post('/api/ehis/health/api/doctor/page', param);

export const getDeptList = (param) => fetch.post('/api/ehis/health/api/dept/getTopDepts', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

export const getInfo = (param) => fetch.post('/api/ehis/health/api/doctor/page/v2', param);

export const getSum = (param) =>  fetch.post('/api/ehis/health/api/pageview/savePageviewData', param);
export const getHisInfo = param => fetch.post('api/ehis/common/cache/get/branner_his', param);

export const getDeptDetail = (param) =>  fetch.post('/api/ehis/health/api/doctor/doctor', param);

export const getEvaluateDet = (param) =>  fetch.post('/api/ehis/health/api/appraisal/page', param);

export const addCollect = (param) =>  fetch.post('/api/ehis/user/favorite/addmyfavorite', param, false);

export const cancelCollect = (param) =>  fetch.post('/api/ehis/user/favorite/cancelmyfavorite', param, false);

export const isRegister = (param) =>  fetch.post('/api/ehis/user/personal/isregistered', param);

export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

export const getUser = (param) => fetch.post('/api/ehis/user/personal/getuser', param);

export const getSum = (param) =>  fetch.post('/api/ehis/health/api/pageview/savePageviewData', param);

export const getHisInfo = param => fetch.post('api/ehis/common/cache/get/branner_his', param);

export const createOrder = (param) => fetch.post('/api/ehis/health/api/inquiry/add', param);

export const getCardList = (param) => fetch.post('/api/ehis/user/personal/autoSynchronousPatients', param);

export const getDocDetail = (param) => fetch.post('/api/ehis/health/api/doctor/doctor', param);

export const isRegister = (param) => fetch.post('/api/ehis/user/personal/isregistered', param);

export const getCardList1 = (param) => fetch.post('/api/ehis/user/personal/getPatientsFromHosp', param);

export const getSign = (param) => fetch.post('/api/ehis/health/api/file/sign', param);

export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

export const getOpenId = (param) => fetch.post('/api/ehis/user/personal/getWxUserInfoByOpenId', param);

export const sameCard = (param) =>  fetch.post('/api/ehis/user/personal/SynchronousPatients', param);

export const getCode = (param) =>  fetch.post('/api/ehis/wx/qrcode/follow/list', param);

export const checkHasInquiry = param => fetch.post('/api/ehis/health/api/inquiry/checkHasInquiry', param);

export const getHisInfo = param => fetch.post('api/ehis/common/cache/get/branner_his', param);
export const getDocList = (param) => fetch.post('/api/ehis/health/api/doctor/page', param);
export const getDeptList = (param) => fetch.post('/api/ehis/health/api/dept/getTopDepts', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export const getInfo = (param) => fetch.post('/api/ehis/health/api/doctor/page/v2', param);
export const getHisInfo = param => fetch.post('/api/web/gethisinfo', param);

export const getInquiryList = (param) => fetch.post('/api/ehis/health/api/inquiry/userInquirys', param);

export const getMsg = (param) => fetch.post('/api/ehis/health/api/inquiry/message', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export const getAuth = param => fetchs.post('/api/ehis/user/login/authorization', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export const getOpenId = (param) => fetchs.post('/api/ehis/user/personal/getWxUserInfoByOpenId', param);
export const add = (param) => fetchs.post('/api/mch/user/earlyWarning/add', param);

export const exist = (param) => fetchs.post('/api/mch/user/earlyWarning/exist', param);
export const getAuth = param => fetch.post('/api/ehis/user/login/authorization', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

export const getUser = (param) => fetch.post('/api/ehis/user/personal/getuser', param);

export const getAppid = (param) => fetch.post('/api/ehis/wechat/appids', param);

export const bindAnother = (param) => fetch.post('/api/ehis/user/personal/userBindKq', param);
export const getUploadToken = (param) => fetch.post('/api/qiniu/fileUploadToken', param);

export const createOrder = (param) => fetch.post('/api/ehis/health/api/inquiry/add', param);

export const getCardList = (param) => fetch.post('/api/ehis/user/personal/getpatientslist', param);

export const getDocDetail = (param) => fetch.post('/api/ehis/health/api/doctor/doctor', param);

export const isRegister = (param) => fetch.post('/api/ehis/user/personal/isregistered', param);
// export const getResonList = (param) => post('/api/consultationReason/list', param);

export const getRegister= (param) =>fetch.post('/api/ehis/health/api/subscribe/getAllSubscribeByPatient',param);
export const getHisInfo = param => fetch.post('api/ehis/common/cache/get/branner_his', param);


export const bindCard = (param) => fetch.post('/api/ehis/user/personal/addpatients', param);

export const getInfo = (param) => fetch.post('/api/ehis/health/api/subscribe/getSubscribeDetailsByOrder', param);

export const getInfo1 = (param) => fetch.post('/api/ehis/health/api/subscribe/getSubscribeDetails', param);
export const returnNo = (param) => fetch.post('/api/front/kq/register/backRegistStatus', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);


export const addInfo = (param) => fetch.post('/api/ehis/health/api/subscribe/updateStatus', param);

export const returnMoney = (param) => fetch.post('/api/ehis/health/api/subscribe/returnMoney', param);


export const getUploadToken = (param) => fetch.post('/api/qiniu/fileUploadToken', param);

export const createOrder = (param) => fetch.post('/api/ehis/health/api/inquiry/add', param);

export const getCardList = (param) => fetch.post('/api/ehis/user/personal/getpatientslist', param);

export const getDocDetail = (param) => fetch.post('/api/ehis/health/api/doctor/doctor', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

export const getInfo = (param) => fetch.post('/api/ehis/health/api/subscribe/getSubscribeDetailsByOrder', param);

export const getInfo1 = (param) => fetch.post('/api/ehis/health/api/subscribe/getSubscribeDetails', param);
export const returnNo = (param) => fetch.post('/api/front/kq/register/backRegistStatus', param);


export const addInfo = (param) => fetch.post('/api/ehis/health/api/subscribe/updateStatus', param);

export const returnMoney = (param) => fetch.post('/api/ehis/health/api/subscribe/returnMoney', param);

