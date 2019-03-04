import fetch from '../../utils/fetch';

/**
 * 获取医院功能
 */
export const getHisFunction = param => fetch.post('/api/function/list', param);
