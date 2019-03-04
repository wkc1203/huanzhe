import fetch from '../../../utils/fetch';


export const isRegistered = param => fetch.post('/api/ehis/user/personal/isregistered', param);

export const getUser = (param) => fetch.post('/api/ehis/user/personal/getuser', param);

export const getCardList = (param) => fetch.post('/api/ehis/user/personal/autoSynchronousPatients', param);

export const getCardList1 = (param) => fetch.post('/api/ehis/user/personal/getPatientsFromHosp', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export const getOpenId = (param) => fetch.post('/api/ehis/user/personal/getWxUserInfoByOpenId', param);
export const sameCard = (param) =>  fetch.post('/api/ehis/user/personal/SynchronousPatients', param);

export const getCode = (param) =>  fetch.post('/api/ehis/wx/qrcode/follow/list', param);


