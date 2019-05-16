import fetch from '../../../utils/fetch';

// 绑定就诊卡
export const getHisConfig = param => fetch.post('/api/personal/getbindcardprofile', param);
export const getUser = param => fetch.post('/api/personal/getuser', param);
export const getCheckDetail = (param) => fetch.post('/api/ehis/health/api/onlineCheckList/getById', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
export const cancel = param => fetch.post('/api/ehis/health/api/onlineCheckList/returnMoney', param);

export const prePay = param => fetch.post('/api/ehis/health/api/onlineCheckList/hisOrderCreate', param);

