import { UserGeolocation } from 'models/user';
import * as publicIp from 'public-ip';
import { getUserGeolocation } from 'services/Polkamarkets/user';

async function getUserPublicIp() {
  try {
    return publicIp.v4();
  } catch (err) {
    return undefined;
  }
}

const undefinedCountry: UserGeolocation = { country: '', countryCode: '' };

async function getUserCountry() {
  try {
    const response = await getUserGeolocation();
    return response.data;
  } catch (err) {
    return undefinedCountry;
  }
}

export { getUserPublicIp, getUserCountry, undefinedCountry };
