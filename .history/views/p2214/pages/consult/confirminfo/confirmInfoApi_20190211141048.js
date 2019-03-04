import fetch from '../../../utils/fetch';

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

