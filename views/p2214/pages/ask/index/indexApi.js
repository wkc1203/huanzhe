import fetch1 from '../../../utils/fetch1';

/* 获取医生消息的提示消息 */
export const getHis = (param) => fetch1.post('/api/ehis/front/hospital/execute', param);

export const getDeseaseType = (param) => fetch1.post('/api/ehis/followed/patient/openid', param);

export const getDeseaseRecord = (param) => fetch1.post('/api/ehis/followed/record/page', param);
