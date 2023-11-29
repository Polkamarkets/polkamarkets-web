import axios, { AxiosError, AxiosResponse } from 'axios';

import { onResponse, onError } from './interceptors';

const api = axios.create();

api.interceptors.response.use(
  (response: AxiosResponse) => onResponse(response),
  (error: AxiosError) => onError(error)
);

export default api;

const { REACT_APP_POLKAMARKETS_API_URL, REACT_APP_POLKAMARKETS_AUTH_API_URL } =
  process.env;

export {
  REACT_APP_POLKAMARKETS_API_URL as polkamarketsApiUrl,
  REACT_APP_POLKAMARKETS_AUTH_API_URL as polkamarketsAuthApiUrl
};
