import fetch from '../../../utils/fetch';

export const getDeptInfo = param => fetch.post('/api/web/getdeptinfo', param);

   