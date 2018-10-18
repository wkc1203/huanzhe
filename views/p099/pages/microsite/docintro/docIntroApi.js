import fetch from '../../../utils/fetch';

export const getDoctorInfo = param => fetch.post('/api/web/getdoctorinfo', param);

