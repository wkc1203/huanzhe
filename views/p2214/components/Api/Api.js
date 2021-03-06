import fetch from '../../utils/fetch';
import fetchs from '../../utils/fetchs';
import fetch1 from '../../utils/fetch1';
import fetchAI from '../../utils/fetchAI';


export const getCardList = (param) =>  fetch.post('/api/ehis/user/personal/autoSynchronousPatients', param);

export const isRegister = (param) =>  fetch.post('/api/ehis/user/personal/isregistered', param);

export const getCardList1 = (param) =>  fetch.post('/api/ehis/user/personal/getPatientsFromHosp', param);

export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

export const getOpenId = (param) => fetch.post('/api/ehis/user/personal/getWxUserInfoByOpenId', param);
 
export const sameCard = (param) =>  fetch.post('/api/ehis/user/personal/SynchronousPatients', param);

export const getCode = (param) =>  fetch.post('/api/ehis/wx/qrcode/follow/list', param);

export const getUserInfo = (param) =>  fetch.post('/api/ehis/user/personal/getpatientinfo', param);

export const unBind = (param) =>  fetch.post('/api/ehis/user/personal/unbindpatient', param);

export const setDefault = (param) =>  fetch.post('/api/ehis/user/personal/setdefaultpatient', param);

export const getValidate = (param) => fetch.post('/api/ehis/user/personal/sendvalidatecode', param);

export const modifyPhone = (param) => fetch.post('/api/ehis/user/personal/updateuserinfo', param);

export const getUser = (param) => fetch.post('/api/ehis/user/personal/getuser', param);

export const isRegistered = param => fetch.post('/api/ehis/user/personal/isregistered', param);

export const getMsgValidate = param => fetch.post('/api/ehis/user/msg/sendValicode', param);

export const validate = param => fetch.post('/api/ehis/user/msg/checkValicode', param);

export const checkTime = param => fetch.post('/api/ehis/user/personal/userCheckMsgFlag', param);

export const getMsg = (param) => fetch.post('/api/ehis/health/api/inquiry/message', param);

export const getHisInfo = param => fetch.post('api/ehis/common/cache/get/branner_his', param);
//投诉建议
export const complain = (param) => fetch.post('/api/ehis/user/complaints/addcomplaintsinfo', param);
//追加回复
export const addReply = (param) => fetch.post('/api/ehis/user/complaints/appendReply', param);
//获取投诉列表
export const getcomplaintslist = (param) => fetch.post('/api/ehis/user/complaints/getcomplaintslist', param);
//获取投诉详情
export const getcomplaintDetail = (param) => fetch.post('/api/ehis/user/complaints/getcomplaintsdetailinfo', param);

export const getSign = (param) => fetch.post('/api/ehis/health/api/file/sign', param);

export const getCollectList = (param) =>  fetch.post('/api/ehis/user/favorite/getmyfavoritelist', param);

export const bindCard = (param) => fetch.post('/api/ehis/user/personal/addPatientsNew', param);

export const getreportList = (param) => fetch.post('/api/ehis/health/api/reportInterpretation/getPatientReport', param);

export const getDoctor = (param) => fetch.post('/api/ehis/health/api/reportInterpretation/getDoctorByHospitalUserName', param);

export const createOrder = (param) => fetch.post('/api/ehis/health/api/inquiry/add', param);

export const getOrderList = (param) => fetch.post('/api/ehis/order/getorderlist', param);
 
export const getInspectReportDetails = param => fetch.post('/api/front/customize/getInspectReportDetails', param);

export const getCheckReportDetailsOld = param => fetch.post('/api/front/customize/getCheckReportDetailsOld', param);

export const getOrderListByCard = (param) => fetch.post('/api/ehis/order/getorderlistByCard', param);

// 订单管理咨询列表分页查询
export const getOrderListByCardList = (param) => fetch.post('/api/ehis/order/getOrderListPageByCard', param);

export const getCheckOrderList = (param) => fetch.post('/api/ehis/health/api/onlineCheckList/page', param);

export const getUploadToken = (param) => fetch.post('/api/qiniu/fileUploadToken', param);

export const getDocDetail = (param) => fetch.post('/api/ehis/health/api/doctor/doctor', param);

export const getRegister= (param) =>fetch.post('/api/ehis/health/api/subscribe/getAllSubscribeByPatient',param);
// 咨询列表-加号分页
export const getRegisterList= (param) =>fetch.post('/api/ehis/health/api/subscribe/listPageSubscribeByPatient',param);

export const getHisConfig = param => fetch.post('/api/personal/getbindcardprofile', param);

export const getOrderDet = (param) => fetch.post('/api/ehis/order/getorderdetail', param);

export const getDocDet = (param) => fetch.post('/api/ehis/health/api/appraisal/preAppraisal', param);

export const evaluate = (param) => fetch.post('/api/ehis/health/api/appraisal/appraisal', param);

export const evaluate1 = (param) => fetch.post('/api/ehis/health/api/appraisal/appraisals', param);

export const getCheckDetail = (param) => fetch.post('/api/ehis/health/api/onlineCheckList/getById', param);

export const cancel = param => fetch.post('/api/ehis/health/api/onlineCheckList/returnMoney', param);

export const returnDescribe = param => fetch.post('/api/ehis/health/api/chronicDisease/apply/refund', param);

export const preCheckPay = param => fetch.post('/api/ehis/health/api/onlineCheckList/hisOrderCreate', param);

export const getDoctorInfo = (param) => fetch.post('/api/ehis/health/api/doctor/doctor', param);

export const addCollect = (param) => fetch.post('/api/ehis/user/favorite/addmyfavorite', param, false);

export const deptListFull = param =>  fetch.post('/api/ehis/health/api/dept/getTopDepts', param);

export const docListFull = param =>  fetch.post('/api/ehis/health/api/doctor/page', param);

export const deptListFullInitials = param => fetch.post('/api/ehis/health/api/dept/getDeptsByInitials', param);

export const getDepInfo = (param) => fetch.post('/api/ehis/health/api/dept/dept', param);

export const register = param => fetch.post('/api/ehis/user/login/register', param);

export const validateImg = param => fetch.post('/api/ehis/user/personal/defaultKaptcha', param);

export const getSum = (param) =>  fetch.post('/api/ehis/health/api/pageview/savePageviewData', param);

export const getLoginValidate = param => fetch.post('/api/ehis/user/login/valicode', param);

export const getInquiryList = (param) => fetch.post('/api/ehis/health/api/inquiry/userInquirys', param);
// 
export const getInquiryListNes = (param) => fetch.post('/api/ehis/health/api/inquiry/userInquirysPage', param);

//获取咨询详情
export const getChat = (param) => fetch.post('/api/ehis/health/api/inquiry/inquirys', param, false, false);
//发送消息
export const sendMsg = (param) => fetch.post('/api/ehis/health/api/inquiry/inquiry', param,false);
//关闭咨询
export const closure = (param) => fetch.post('/api/ehis/health/api/inquiry/closure', param);

export const change = (param) => fetch.post('/api/ehis/health/api/inquiry/change', param);

export const getDocList = (param) => fetch.post('/api/ehis/health/api/doctor/page', param);

export const getInfo = (param) => fetch.post('/api/ehis/health/api/doctor/page/v2', param);

export const getStatus = (param) =>  fetch.post('/api/ehis/common/cache/get/system_error', param);

export const getPayInfo = (param) =>  fetch.post('/api/ehis/health/api/inquiry/pay', param);

export const getConsultDet1 = (param) =>  fetch.post('/api/ehis/health/api/inquiry/prePay', param);

export const orderStatus = (param) => fetch.post('/api/ehis/health/api/inquiry/getOrderStatus', param, false);

export const getInquriyStatus = (param) => fetch.post('/api/ehis/health/api/inquiry/getOrderStatus', param, false);

export const getPayInfo1 = (param) =>  fetch.post('/api/ehis/health/api/checkList/pay', param);

export const getAddInfo = (param) =>  fetch.post('/api/ehis/health/api/subscribe/prePay', param);

export const getCheckInfo = (param) =>  fetch.post('/api/ehis/health/api/onlineCheckList/prePay', param);

export const update = (param) => fetch.post('/api/ehis/health/api/onlineCheckList/updateOnlineCheckList', param);

export const getDeptList = (param) => fetch.post('/api/ehis/health/api/dept/getTopDepts', param);

export const getDeptDetail = (param) =>  fetch.post('/api/ehis/health/api/doctor/doctor', param);

export const getEvaluateDet = (param) =>  fetch.post('/api/ehis/health/api/appraisal/page', param);

export const cancelCollect = (param) =>  fetch.post('/api/ehis/user/favorite/cancelmyfavorite', param, false)

export const checkHasInquiry = param => fetch.post('/api/ehis/health/api/inquiry/checkHasInquiry', param);

export const getAuth = param => fetchs.post('/api/ehis/user/login/authorization', param);

export const getAuth1 = param => fetch1.post('/api/ehis/user/login/authorization', param);


export const add = (param) => fetchs.post('/api/mch/user/earlyWarning/add', param);

export const exist = (param) => fetchs.post('/api/mch/user/earlyWarning/exist', param);

export const getAppid = (param) => fetch.post('/api/ehis/wechat/appids', param);

export const bindAnother = (param) => fetch.post('/api/ehis/user/personal/userBindKq', param);

export const returnNo = (param) => fetch.post('/api/front/kq/register/backRegistStatus', param);

export const addInfo = (param) => fetch.post('/api/ehis/health/api/subscribe/updateStatus', param);

//查询加号详情
export const getInfo1 = (param) => fetch.post('/api/ehis/health/api/subscribe/getSubscribeDetails', param);
export const getInfoByOrder = (param) => fetch.post('/api/ehis/health/api/subscribe/getSubscribeDetailsByOrder', param);
/* 退号 */
export const returnMoney = (param) => fetch.post('/api/ehis/health/api/subscribe/returnMoney', param);

//获取医院信息

export const hospitalInformation = (param) => fetch.post('/api/ehis/health/api/hospital/get/hisId', param);

//mdt
export const getMdtList = (param) => fetch.post('/api/ehis/mdt/team/page', param);
export const getMdtDetail = (param) => fetch.post('/api/ehis/mdt/team/info', param);
export const addMdt = (param) => fetch.post('/api/ehis/mdt/apply', param);
export const mdtList = (param) => fetch.post('/api/ehis/mdt/list', param);
export const getmdtDetail = (param) => fetch.post('/api/ehis/mdt/info', param);
export const mdtPay = (param) => fetch.post('/api/ehis/mdt/prePay', param);
export const delMdt = (param) => fetch.post('/api/ehis/mdt/cancel', param);

export const getMdt = (param) => fetch.post('/api/ehis/mdt/list', param);
export const getMdtMessage = (param) => fetch.post('/api/ehis/mdt/info/items', param);
export const sendMdtMsg = (param) => fetch.post('/api/ehis/mdt/user/send', param);

//慢病
export const getdiseaseList = (param) => fetch.post('/api/ehis/health/api/chronicDisease/his/record', param);

export const applyDisease = (param) => fetch.post('/api/ehis/health/api/chronicDisease/apply', param);

export const getDescribeList = (param) => fetch.post('/api/ehis/health/api/chronicDisease/page', param);

export const getDescribeDetail = (param) => fetch.post('/api/ehis/health/api/chronicDisease/getById', param);

export const getDescribeInfo = (param) => fetch.post('/api/ehis/health/api/chronicDisease/prePay', param);

export const cancleDescribe = (param) => fetch.post('/api/ehis/health/api/chronicDisease/cancel', param);
/* 预问诊 */




// 会诊评价

export const getappraisalgetBy = (param) => fetch.post('/api/ehis/mdt/appraisal/getBy', param);
export const getappraisaladd = (param) => fetch.post('/api/ehis/mdt/appraisal/add', param);



// AI预问诊

//保存预问诊内容
export const saveItem = (param) => fetchAI.post('/api/ehis/health/api/prediagnosis/saveItem', param);

// export const getAccessHeader = (param) => fetch.post('/api/ehis/health/api/prediagnosis/getAccessHeader', param);

// /api/ehis/health/api/prediagnosis/getAccessInfo

export const getAccessInfo = (param) => fetch.post('/api/ehis/health/api/prediagnosis/getAccessInfo', param);
export const getReport = (param) => fetch.post('/api/ehis/health/api/prediagnosis/getReport', param);

// /api/ehis/health/api/prediagnosis/getReport


export const prediagnosis = (param) => fetchAI.post('/api/ehis/health/api/prediagnosis/prediagnosis', param);

// 健康宣教列表
export const getJiankangXuanJiaoList = (param) => fetch1.post('	/api/ehis/followed/article/list', param);
// 健康宣教-详情页 /api/ehis/followed/article/get
export const getJiankangXuanJiaoDetail = (param) => fetch1.post('/api/ehis/followed/article/get', param);
// 健康-人物tab
export const getDeseaseType = (param) => fetch1.post('/api/ehis/followed/patient/openid', param);
// 当日监测数据 
export const getByTodayData = (param) => fetch1.post('/api/ehis/followed/monitor/list/today', param);
// /api/ehis/followed/monitor/list/today
// 当日数据增加 /api/ehis/followed/monitorFillin/add
export const addTodayData = (param) => fetch1.post('/api/ehis/followed/monitorFillin/add', param);
// 当日数据提醒 /api/ehis/followed/monitor/notifyFlag
export const getnotifyFlag = (param) => fetch1.post('/api/ehis/followed/monitor/notifyFlag', param);
// 历史监测数据-监测单元获取 /api/ehis/followed/monitor/list/history
export const danxianGetById = (param) => fetch1.post('/api/ehis/followed/monitor/list/history', param);
// 历史监测数据 /api/ehis/followed/monitorFillin/getHistoryData
export const getHistoryData = (param) => fetch1.post('/api/ehis/followed/monitorFillin/getHistoryData', param);
// 我的-个人信息查询 /api/ehis/followed/patient/info
export const getPersonInfo = (param) => fetch1.post('/api/ehis/followed/patient/info', param);
// 我的-个人信息修改 /api/ehis/followed/patient/other/addOrUpdate
export const updatePersonInfo = (param) => fetch1.post('/api/ehis/followed/patient/other/addOrUpdate', param);
// 新增配送地址 
export const addAddressSave = (param) => fetch1.post('/api/ehis/health/api/delivery/address/save', param);
// 修改配送地址 
export const updateAddress = (param) => fetch1.post('/api/ehis/health/api/delivery/address/update', param);
// 查询地址列表 
export const getAddressList = (param) => fetch1.post('/api/ehis/health/api/delivery/address/page', param);
// 查询地址详细 api/ehis/health/api/delivery/address/getBy
export const getAddressById= (param) => fetch1.post('/api/ehis/health/api/delivery/address/getBy', param);
// 查询配送药品 
export const getPeiSongDrugById= (param) => fetch1.post('/api/ehis/health/api/delivery/drug/getBy', param);
// 新增配送药品 
export const addPeiSongDrug= (param) => fetch1.post('/api/ehis/health/api/delivery/drug/save', param);
// 修改配送药品 
export const updatePeiSongDrug= (param) => fetch1.post('/api/ehis/health/api/delivery/drug/update', param);
// 支付邮费
export const youfeiPrePay= (param) => fetch1.post('/api/ehis/health/api/delivery/prePay', param);