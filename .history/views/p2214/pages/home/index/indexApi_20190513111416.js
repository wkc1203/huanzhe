import fetch from '../../../utils/fetch';

/* 获取医生消息的提示消息 */
export const getMsg = (param) => fetch.post('/api/ehis/health/api/inquiry/message', param);

export const getDocList = (param) => fetch.post('/api/ehis/health/api/doctor/page', param);

export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

export const getInfo = (param) => fetch.post('/api/ehis/health/api/doctor/page/v2', param);

export const getStatus = (param) =>  fetch.post('/api/ehis/common/cache/get/system_error', param);
export const getSum = (param) =>  fetch.post('/api/ehis/health/api/pageview/savePageviewData', param);
  