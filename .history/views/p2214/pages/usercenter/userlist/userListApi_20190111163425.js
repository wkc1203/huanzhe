import fetch from '../../../utils/fetch';


export const getCardList = (param) =>  fetch.post('/api/ehis/user/personal/getpatientslist', param);

export const isRegister = (param) =>  fetch.post('/api/ehis/user/personal/isregistered', param);

export const getCardList1 = (param) =>  fetch.post('/api/ehis/user/personal/getPatientsFromHosp', param);

export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

export const getOpenId = (param) => fetch.post('/api/ehis/user/personal/getWxUserInfoByOpenId', param);

export const sameCard = (param) =>  fetch.post('/api/ehis/user/personal/SynchronousPatients', param);

export const getCode = (param) =>  fetch.post('/api/ehis/wx/qrcode/follow/list', param);
