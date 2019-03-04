import fetch from '../../../utils/fetch';

export const getAuth = param => fetch.post('/api/ehis/user/login/authorization', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

export const getUser = (param) => fetch.post('/api/ehis/user/personal/getuser', param);

export const getAppid = (param) => fetch.post('/api/ehis/wechat/appids', param);

export const bindAnother = (param) => fetch.post('/api/ehis/user/personal/userBindKq', param);
