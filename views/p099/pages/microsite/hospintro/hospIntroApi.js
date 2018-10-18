import fetch from '../../../utils/fetch';

export const getHisInfo = param => fetch.post('/api/web/gethisinfo', param);

 