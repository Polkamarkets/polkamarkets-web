import api, { polkamarketsAuthApiUrl } from './api';

async function getJWTForUser(userId: string) {
  const url = `${polkamarketsAuthApiUrl}/token`;
  return api.post(url, { user_id: userId });
}

// eslint-disable-next-line import/prefer-default-export
export { getJWTForUser };
