import api, { polkamarketsApiUrl } from './api';

async function apiGoogleLogin(accessToken: string) {
  const url = `${polkamarketsApiUrl}/users/auth/google_oauth2/callback/`;

  const data = new FormData();
  data.append('access_token', accessToken);

  return api.post<any>(url, data);
}

// eslint-disable-next-line import/prefer-default-export
export { apiGoogleLogin };
