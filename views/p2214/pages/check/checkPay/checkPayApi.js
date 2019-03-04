import fetch from '../../../utils/fetch';

export const getHisInfo = param => fetch.post('/api/web/gethisinfo', param);

export const getInquiryList = (param) => fetch.post('/api/ehis/health/api/inquiry/userInquirys', param);

export const getMsg = (param) => fetch.post('/api/ehis/health/api/inquiry/message', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export const getInfo = param => fetch.post('/api/ehis/health/api/checkList/getOrderStatus', param);

export const getPayInfo = (param) =>  fetch.post('/api/ehis/health/api/checkList/pay', param);

 