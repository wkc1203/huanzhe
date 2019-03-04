import fetch from '../../../utils/fetch';

export const getHisInfo = param => fetch.post('api/ehis/common/cache/get/branner_his', param);
export const getChat = (param) => fetch.post('/api/ehis/health/api/inquiry/inquirys', param, false, false);


export const getPayInfo = (param) =>  fetch.post('/api/ehis/health/api/inquiry/pay', param);

export const getConsultDet1 = (param) =>  fetch.post('/api/ehis/health/api/inquiry/prePay', param);

export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

export const orderStatus = (param) => fetch.post('/api/ehis/health/api/inquiry/getOrderStatus', param, false);

export const getStatus = (param) => fetch.post('/api/ehis/health/api/checkList/getOrderStatus', param);

