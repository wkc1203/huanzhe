import fetch from '../../../utils/fetch';

// 绑定就诊卡
export const getHisConfig = param => fetch.post('/api/personal/getbindcardprofile', param);

export const addPatients = param => fetch.post('/api/personal/addpatients', param);

export const getUser = param => fetch.post('/api/personal/getuser', param);
export const getOrderDet = (param) => fetch.post('/api/ehis/order/getorderdetail', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
