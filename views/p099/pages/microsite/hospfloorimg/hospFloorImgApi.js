import fetch from '../../../utils/fetch';

export const getFloorImg = param => fetch.post('/api/web/getfloorimg', param);

