import fetch from '../../../utils/fetch';

export const getHisInfo = param => fetch.post('api/ehis/common/cache/get/branner_his', param);

export const complain = (param) => fetch.post('/api/ehis/user/complaints/addcomplaintsinfo', param);

export const getSign = (param) => fetch.post('/api/ehis/health/api/file/sign', param);

export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

