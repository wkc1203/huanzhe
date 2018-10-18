import fetch from '../../../utils/fetch';

export const getHospDynamicsDetail = param => fetch.post('/api/msg/getarticleinfo', param);

