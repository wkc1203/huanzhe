import fetch from '../../../utils/fetch';

export const getHisInfo = param => fetch.post('api/ehis/common/cache/get/branner_his', param);


export const bindCard = (param) => fetch.post('/api/ehis/user/personal/addpatients', param);

export const getInfo = (param) => fetch.post('/api/ehis/health/api/subscribe/getSubscribeDetailsByOrder', param);

export const getInfo1 = (param) => fetch.post('/api/ehis/health/api/subscribe/getSubscribeDetails', param);
export const returnNo = (param) => fetch.post('/api/front/kq/register/backRegistStatus', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);


export const addInfo = (param) => fetch.post('/api/ehis/health/api/subscribe/updateStatus', param);

export const returnMoney = (param) => fetch.post('/api/ehis/health/api/subscribe/returnMoney', param);
