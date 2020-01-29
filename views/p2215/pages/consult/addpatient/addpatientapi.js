import fetch from '../../../utils/fetch';

export const getValidate = param => fetch.post('/api/ehis/user/msg/sendValicode', param);
export const register = param => fetch.post('/api/ehis/user/login/register', param);
export const validateImg = param => fetch.post('/api/ehis/user/personal/defaultKaptcha', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export const bindCard = (param) => fetch.post('/api/ehis/user/personal/addPatientsNew2215', param);
