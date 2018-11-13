import fetch from '../../../utils/fetch';


export const getValidate = (param) => fetch.post('/api/ehis/user/personal/sendvalidatecode', param);

export const modifyPhone = (param) => fetch.post('/api/ehis/user/personal/updateuserinfo', param);

export const getUser = (param) => fetch.post('/api/ehis/user/personal/getuser', param);

export const getJsApiConfig = param => fetch.post('/api/ehis/health/api/inquiry/getJsApiConfig', param);
