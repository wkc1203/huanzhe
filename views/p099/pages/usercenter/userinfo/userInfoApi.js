import fetch from '../../../utils/fetch';

export const getArticleTypeList = param => fetch.post('/api/msg/getarticletypelist', param);

export const getHospDynamics = param => fetch.post('/api/msg/getarticlelist', param);


export const getUserInfo = (param) =>  fetch.post('/api/ehis/user/personal/getpatientinfo', param);

export const unBind = (param) =>  fetch.post('/api/ehis/user/personal/unbindpatient', param);

export const setDefault = (param) =>  fetch.post('/api/ehis/user/personal/setdefaultpatient', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
