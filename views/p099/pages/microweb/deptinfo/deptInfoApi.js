import fetch from '../../../utils/fetch';

// 绑定就诊卡
export const getHisConfig = param => fetch.post('/api/personal/getbindcardprofile', param);

export const addPatients = param => fetch.post('/api/personal/addpatients', param);

export const getDepInfo = (param) => fetch.post('/api/ehis/health/api/dept/dept', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
