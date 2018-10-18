import fetch from '../../../utils/fetch';

export const getHisInfo = param => fetch.post('api/ehis/common/cache/get/branner_his', param);

export const getDocList = (param) => fetch.post('/api/ehis/health/api/doctor/page', param);
