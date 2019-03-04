import fetch from '../../../utils/fetch';

export const getHisInfo = param => fetch.post('api/ehis/common/cache/get/branner_his', param);

export const getDeptDetail = (param) =>  fetch.post('/api/ehis/health/api/doctor/doctor', param);

export const getEvaluateDet = (param) =>  fetch.post('/api/ehis/health/api/appraisal/page', param);

export const addCollect = (param) =>  fetch.post('/api/ehis/user/favorite/addmyfavorite', param, false);

export const cancelCollect = (param) =>  fetch.post('/api/ehis/user/favorite/cancelmyfavorite', param, false);

export const isRegister = (param) =>  fetch.post('/api/ehis/user/personal/isregistered', param);

export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

export const getUser = (param) => fetch.post('/api/ehis/user/personal/getuser', param);
