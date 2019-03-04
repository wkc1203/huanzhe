import fetch from '../../../utils/fetch';


export const getUploadToken = (param) => fetch.post('/api/qiniu/fileUploadToken', param);

export const createOrder = (param) => fetch.post('/api/ehis/health/api/inquiry/add', param);

export const getCardList = (param) => fetch.post('/api/ehis/user/personal/getpatientslist', param);

export const getDocDetail = (param) => fetch.post('/api/ehis/health/api/doctor/doctor', param);

export const isRegister = (param) => fetch.post('/api/ehis/user/personal/isregistered', param);
// export const getResonList = (param) => post('/api/consultationReason/list', param);

export const getRegister= (param) =>fetch.post('/api/ehis/health/api/subscribe/getAllSubscribeByPatient',param);

