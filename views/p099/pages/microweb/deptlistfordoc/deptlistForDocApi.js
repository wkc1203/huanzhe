import fetch from '../../../utils/fetch';

// 绑定就诊卡
export const getHisConfig = param => fetch.post('/api/personal/getbindcardprofile', param);

export const addPatients = param => fetch.post('/api/personal/addpatients', param);

export const getUser = param => fetch.post('/api/personal/getuser', param);
export const deptListFull = param =>  fetch.post('/api/ehis/health/api/dept/getTopDepts', param);
export const docListFull = param =>  fetch.post('/api/ehis/health/api/doctor/page', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
