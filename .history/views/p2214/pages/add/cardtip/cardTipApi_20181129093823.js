import fetch from '../../../utils/fetch';

export const getHisInfo = param => fetch.post('api/ehis/common/cache/get/branner_his', param);


export const bindCard = (param) => fetch.post('/api/ehis/user/personal/addpatients', param);
