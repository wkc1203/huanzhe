import fetch from '../../../utils/fetch';

export const getArticleTypeList = param => fetch.post('/api/msg/getarticletypelist', param);

export const getHospDynamics = param => fetch.post('/api/msg/getarticlelist', param);

export const getCardList = (param) =>  fetch.post('/api/ehis/user/personal/getpatientslist', param);

export const isRegister = (param) =>  fetch.post('/api/ehis/user/personal/isregistered', param);

export const getCardList1 = (param) =>  fetch.post('/api/ehis/user/personal/getPatientsFromHosp', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
