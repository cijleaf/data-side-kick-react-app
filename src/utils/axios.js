import { create } from 'axios';
import { stringify as stringifyParams } from 'querystring';
import { apiUrl } from '../config';

const axios = create({
  baseURL: apiUrl,
  paramsSerializer: params => stringifyParams(params),
});

export function setGlobalHeader(header, value) {
  axios.defaults.headers.common[header] = value;
}

export default axios;
