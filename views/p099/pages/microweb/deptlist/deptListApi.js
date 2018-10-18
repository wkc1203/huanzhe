import fetch from '../../../utils/fetch';

// 绑定就诊卡
export const deptListFull = param => fetch.post('/api/ehis/health/api/dept/getDeptsByInitials', param);
