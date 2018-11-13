import fetch from '../../../utils/fetch';

export const bindCard = (param) => fetch.post('/api/ehis/user/personal/addPatientsNew', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
