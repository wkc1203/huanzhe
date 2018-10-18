import fetch from '../../../utils/fetch';

// 绑定就诊卡
export const getHisConfig = param => fetch.post('/api/personal/getbindcardprofile', param);

export const addPatients = param => fetch.post('/api/personal/addpatients', param);

export const getUser = param => fetch.post('/api/personal/getuser', param);
