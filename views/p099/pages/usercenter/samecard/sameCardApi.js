import fetch from '../../../utils/fetch';

export const getArticleTypeList = param => fetch.post('/api/msg/getarticletypelist', param);

export const bindCard = (param) =>  fetch.post('/api/ehis/user/personal/addpatients', param);
export const getCardList1 = (param) =>  fetch.post('/api/ehis/user/personal/getPatientsFromHosp', param);

export const getCardList = (param) =>  fetch.post('/api/ehis/user/personal/getpatientslist', param);

export const sameCard = (param) =>  fetch.post('/api/ehis/user/personal/SynchronousPatients', param);

export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
