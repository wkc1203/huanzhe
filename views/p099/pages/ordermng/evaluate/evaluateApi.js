import fetch from '../../../utils/fetch';

// 绑定就诊卡
export const getDocDet = (param) => fetch.post('/api/ehis/health/api/appraisal/preAppraisal', param);
export const evaluate = (param) => fetch.post('/api/ehis/health/api/appraisal/appraisal', param);
export const evaluate1 = (param) => fetch.post('/api/ehis/health/api/appraisal/appraisals', param);
export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
