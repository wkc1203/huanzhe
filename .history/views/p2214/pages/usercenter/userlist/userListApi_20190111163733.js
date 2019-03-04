import fetch from '../../../utils/fetch';

//获取就诊人列表
export const getCardList = (param) =>  fetch.post('/api/ehis/user/personal/getpatientslist', param);

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
