import fetch from '../../../utils/fetch';

// 绑定就诊卡
export const getOrderList = (param) => fetch.post('/api/ehis/health/api/checkList/page', param);

export const getCardList = (param) => fetch.post('/api/ehis/user/personal/getpatientslist', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);

export const getreportList = (param) => fetch.post('/api/ehis/health/api/reportInterpretation/getPatientReport', param);

export const getDoctor = (param) => fetch.post('/api/ehis/health/api/reportInterpretation/getDoctorByHospitalUserName', param);

export const createOrder = (param) => fetch.post('/api/ehis/health/api/inquiry/add', param);
