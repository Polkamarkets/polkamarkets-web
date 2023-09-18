/* eslint-disable import/prefer-default-export */
import { undefinedCountry } from 'helpers/location';
import { UserGeolocation } from 'models/user';

import api, { polkamarketsApiUrl } from './api';

async function getUserGeolocation() {
  const { REACT_APP_IP_API_KEY } = process.env;
  if (!REACT_APP_IP_API_KEY) return { data: undefinedCountry };

  const url = `https://pro.ip-api.com/json?key=${REACT_APP_IP_API_KEY}`;
  return api.get<UserGeolocation>(url, {
    params: {
      fields: 'country,countryCode'
    }
  });
}

async function updateSocialLoginInfo(
  authenticationToken: string,
  loginType: string,
  walletAddress: string,
  avatar: string,
  oAuthAccessToken: string
) {
  const url = `${polkamarketsApiUrl}/users`;
  return api.put(
    url,
    {
      login_type: loginType,
      wallet_address: walletAddress,
      avatar,
      oauth_access_token: oAuthAccessToken
    },
    {
      headers: {
        Authorization: `Bearer ${authenticationToken}`
      }
    }
  );
}

export { getUserGeolocation, updateSocialLoginInfo };
