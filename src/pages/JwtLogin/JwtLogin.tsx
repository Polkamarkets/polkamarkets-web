import { useEffect } from 'react';

import { usePolkamarketsService } from '../../hooks';
import { getJWTForUser } from '../../services/Polkamarkets/jwt';

export default function JwtLogin() {
  const polkamarketsService = usePolkamarketsService();

  useEffect(() => {
    const login = async () => {
      // call service to get jwt token
      const jwtToken = await getJWTForUser('teste'); // TODO grab userid from cookies

      const success = await polkamarketsService.socialLoginWithJWT(
        jwtToken.data
      );

      if (success) {
        window.parent.postMessage(
          {
            type: 'loginjwt',
            message: 'login_success'
          },
          '*'
        );
      }
    };

    login();
  }, [polkamarketsService]);

  return <h1>JWT Login</h1>;
}
