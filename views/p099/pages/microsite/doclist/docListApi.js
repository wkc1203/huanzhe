import fetch from '../../../utils/fetch';

export const getDocList = param => fetch.post('/api/web/getdoctorlist', param);

