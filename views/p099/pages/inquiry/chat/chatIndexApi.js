import fetch from '../../../utils/fetch';

export const getHisInfo = param => fetch.post('/api/web/gethisinfo', param);


export const getChat = (param) => fetch.post('/api/ehis/health/api/inquiry/inquirys', param, false, false);

export const sendMsg = (param) => fetch.post('/api/ehis/health/api/inquiry/inquiry', param,false);

export const closure = (param) => fetch.post('/api/ehis/health/api/inquiry/closure', param);

export const change = (param) => fetch.post('/api/ehis/health/api/inquiry/change', param);

export const getDocDet = (param) => fetch.post('/api/ehis/health/api/appraisal/preAppraisal', param);

export const evaluate = (param) => fetch.post('/api/ehis/health/api/appraisal/appraisal', param);
export const evaluate1 = (param) => fetch.post('/api/ehis/health/api/appraisal/appraisals', param);

export const getEvaluateDet = (param) => fetch.post('/api/ehis/health/api/appraisal/page', param);

export const getSign = (param) => fetch.post('/api/ehis/health/api/file/sign', param);

export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
