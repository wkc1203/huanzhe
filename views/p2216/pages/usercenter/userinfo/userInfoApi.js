import fetch from '../../../utils/fetch';


export const getUserInfo = (param) =>  fetch.post('/api/ehis/user/personal/getpatientinfo', param);

export const unBind = (param) =>  fetch.post('/api/ehis/user/personal/unbindpatient', param);

export const setDefault = (param) =>  fetch.post('/api/ehis/user/personal/setdefaultpatient', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
