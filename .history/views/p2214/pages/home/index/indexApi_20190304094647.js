import fetch from '../../../utils/fetch';

export const getHisInfo = param => fetch.post('api/ehis/common/cache/get/branner_his', param);

export const getMsg = (param) => fetch.post('/api/ehis/health/api/inquiry/message', param);

export const getDocList = (param) => fetch.post('/api/ehis/health/api/doctor/page', param);

export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

export const getInfo = (param) => fetch.post('/api/ehis/health/api/doctor/page/v2', param);

export const getStatus = (param) =>  fetch.post('/api/ehis/common/cache/get/system_error', param);
export const getSum = (param) =>  fetch.post('/api/ehis/health/api/pageview/savePageviewData', param);
