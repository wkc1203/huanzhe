import fetch from '../../../utils/fetch';

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
