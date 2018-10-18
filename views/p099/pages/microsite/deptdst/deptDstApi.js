import fetch from '../../../utils/fetch';

export const getDeptBuildList = param => fetch.post('/api/web/getdeptbuildlist', param);
export const getDeptBuildDetail = param => fetch.post('/api/web/getdeptbuilddetail', param);

