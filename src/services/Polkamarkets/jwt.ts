import api, { polkamarketsAuthApiUrl } from './api';

async function getJWTForUser(
  userId: string,
  email?: string,
  username?: string,
  avatarUrl?: string
) {
  const url = `${polkamarketsAuthApiUrl}/token`;
  return api.post(url, {
    user_id: userId,
    email,
    username,
    avatar_url: avatarUrl
  });
}

// eslint-disable-next-line import/prefer-default-export
export { getJWTForUser };
