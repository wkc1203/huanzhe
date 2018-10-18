import fetch from '../../../utils/fetch';

export const getDeptList = param => fetch.post('/api/web/deptlist', param);

