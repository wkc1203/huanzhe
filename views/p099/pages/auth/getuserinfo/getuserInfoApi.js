import fetch from '../../../utils/fetch';

export const getAuth = param => fetch.post('/api/ehis/user/login/authorization', param);

