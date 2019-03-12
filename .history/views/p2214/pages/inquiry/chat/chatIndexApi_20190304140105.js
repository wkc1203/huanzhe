import fetch from '../../../utils/fetch';

//获取咨询详情
export const getChat = (param) => fetch.post('/api/ehis/health/api/inquiry/inquirys', param, false, false);
//发送消息
export const sendMsg = (param) => fetch.post('/api/ehis/health/api/inquiry/inquiry', param,false);
//关闭咨询
export const closure = (param) => fetch.post('/api/ehis/health/api/inquiry/closure', param);

export const change = (param) => fetch.post('/api/ehis/health/api/inquiry/change', param);

export const getDocDet = (param) => fetch.post('/api/ehis/health/api/appraisal/preAppraisal', param);
//评价
export const evaluate = (param) => fetch.post('/api/ehis/health/api/appraisal/appraisal', param);
//评价详情
export const evaluate1 = (param) => fetch.post('/api/ehis/health/api/appraisal/appraisals', param);
/* 获取上传到oss的配置 */
export const getSign = (param) => fetch.post('/api/ehis/health/api/file/sign', param);
/* 获取微信接口配置 */
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
