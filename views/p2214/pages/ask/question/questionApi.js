import fetch1 from '../../../utils/fetch1';


export const getQuestion = (param) => fetch1.post('/api/ehis/followed/record/info', param);
export const addQuestion = (param) => fetch1.post('/api/ehis/followed/fillin/add', param);

export const submitQuestion = (param) => fetch1.post('/api/ehis/followed/record/submit', param);

  