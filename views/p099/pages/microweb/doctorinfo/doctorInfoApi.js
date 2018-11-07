import fetch from '../../../utils/fetch';



export const getDoctorInfo = (param) => fetch.post('/api/ehis/health/api/doctor/doctor', param);

export const addCollect = (param) => fetch.post('/api/ehis/user/favorite/addmyfavorite', param, false);

export const cancelCollect = (param) => fetch.post('/api/ehis/user/favorite/cancelmyfavorite', param, false);