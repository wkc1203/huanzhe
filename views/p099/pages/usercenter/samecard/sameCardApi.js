import fetch from '../../../utils/fetch';

export const getArticleTypeList = param => fetch.post('/api/msg/getarticletypelist', param);

export const getHospDynamics = param => fetch.post('/api/msg/getarticlelist', param);

