import fetch from '../../../utils/fetch';

export const getValidate = param => fetch.post('/api/ehis/user/login/valicode', param);
export const register = param => fetch.post('/api/ehis/user/login/register', param);
export const validateImg = param => fetch.post('/api/ehis/user/personal/defaultKaptcha', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export const getSum = (param) =>  fetch.post('/api/ehis/health/api/pageview/savePageviewData', param);
