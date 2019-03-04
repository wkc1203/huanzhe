import fetch from '../../../utils/fetch';


export const getUploadToken = (param) => fetch.post('/api/qiniu/fileUploadToken', param);

export const createOrder = (param) => fetch.post('/api/ehis/health/api/inquiry/add', param);

export const getCardList = (param) => fetch.post('/api/ehis/user/personal/getpatientslist', param);

export const getDocDetail = (param) => fetch.post('/api/ehis/health/api/doctor/doctor', param);

export const getInfo = (param) => fetch.post('/api/ehis/health/api/subscribe/getSubscribeDetailsByOrder', param);

export const getInfo1 = (param) => fetch.post('/api/ehis/health/api/subscribe/getSubscribeDetails', param);
export const returnNo = (param) => fetch.post('/api/front/kq/register/backRegistStatus', param);


export const addInfo = (param) => fetch.post('/api/ehis/health/api/subscribe/updateStatus', param);

export const returnMoney = (param) => fetch.post('/api/ehis/health/api/subscribe/returnMoney', param);
