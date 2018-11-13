import fetch from '../../../utils/fetch';

// 绑定就诊卡
export const getOrderList = (param) => fetch.post('/api/ehis/order/getorderlist', param);

export const getCardList = (param) => fetch.post('/api/ehis/user/personal/getpatientslist', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
