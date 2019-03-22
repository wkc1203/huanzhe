import fetch from '../../../utils/fetch';
import fetchs from '../../../utils/fetchs';
export const getAuth = param => fetchs.post('/api/ehis/user/login/authorization', param);
export const getJsApiConfig = param => fetchs.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export const getOpenId = (param) => fetchs.post('/api/ehis/user/personal/getWxUserInfoByOpenId', param);
export const add = (param) => fetchs.post('/api/mch/user/earlyWarning/add', param);

export const exist = (param) => fetchs.post('/api/mch/user/earlyWarning/exist', param);
