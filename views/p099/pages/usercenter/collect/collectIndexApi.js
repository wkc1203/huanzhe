import fetch from '../../../utils/fetch';

export const getHisInfo = param => fetch.post('api/ehis/common/cache/get/branner_his', param);


export const getCollectList = (param) =>  fetch.post('/api/ehis/user/favorite/getmyfavoritelist', param);

export const cancelCollect = (param) =>  fetch.post('/api/ehis/user/favorite/cancelmyfavorite', param, false);

export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
