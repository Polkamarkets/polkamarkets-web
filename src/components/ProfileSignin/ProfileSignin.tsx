import { useCallback, useEffect, useState } from 'react';

import classNames from 'classnames';
import { ui } from 'config';
import type { Providers } from 'config';
import { jwtVerify, importSPKI } from 'jose';
import Cookies from 'js-cookie';
import { Spinner } from 'ui';

import { RemoveOutlinedIcon } from 'assets/icons';

import { Button } from 'components/Button';
import type { ButtonProps } from 'components/Button';
import ConnectMetamask from 'components/ConnectMetamask';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import ModalContent from 'components/ModalContent';
import ModalHeader from 'components/ModalHeader';
import ModalHeaderTitle from 'components/ModalHeaderTitle';
import ModalSection from 'components/ModalSection';
import ProfileSigninEmail from 'components/ProfileSigninEmail';
import Text from 'components/Text';

import { useAppDispatch, useAppSelector, usePolkamarketsService } from 'hooks';

import { getJWTForUser } from '../../services/Polkamarkets/jwt';
import profileSigninClasses from './ProfileSignin.module.scss';

const hasSingleProvider = ui.socialLogin.providers.length === 1;
const singleProviderName = ui.socialLogin.providers[0];
const autoClaimEnabled = ui.socialLogin.hasAutoClaim;

export default function ProfileSignin({ onClick, ...props }: ButtonProps) {
  const dispatch = useAppDispatch();
  const polkamarketsService = usePolkamarketsService();
  const [show, setShow] = useState(false);
  const [load, setLoad] = useState<Providers | ''>('');
  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      const name = event.currentTarget.name as Exclude<Providers, 'Email'>;

      try {
        setLoad(name);

        throw new Error('Not implemented');

        // const jwtToken = await getJWTForUser('teste'); // TODO grab userid from cookies

        // const success = await polkamarketsService[`socialLogin${name}`]('teste',
        //   jwtToken.data);

        // if (success) {
        //   const { login } = await import('redux/ducks/polkamarkets');

        //   dispatch(login(polkamarketsService));
        // }
      } finally {
        setLoad('');
        setShow(false);
      }
    },
    []
  );

  const handleObservadorClick = useCallback(async () => {
    const getUserData = async (userJwt: string) => {
      const publicKey = await importSPKI(
        process.env.REACT_APP_OBSERVADOR_LOGIN_PUBLIC_KEY || '',
        'RS256'
      );

      const { payload: userData } = await jwtVerify(userJwt, publicKey);

      return userData;
    };

    const loginObservador = async userData => {
      const userId = userData.uid as string;

      const jwtToken = await getJWTForUser(
        userId,
        userData.email || `${userId}@observador.pt`,
        userData.name as string,
        userData.picture as string
      );

      const success = await polkamarketsService.socialLoginWithJWT(
        userId,
        jwtToken.data
      );

      if (success) {
        const { login } = await import('redux/ducks/polkamarkets');

        dispatch(login(polkamarketsService, autoClaimEnabled));
      }

      setLoad('');
      setShow(false);
    };

    setLoad('Observador');

    let userJwt = Cookies.get('obs_foreland');
    if (userJwt) {
      const userData = await getUserData(userJwt as string);
      await loginObservador(userData);
      return;
    }

    const popup = window.open(
      'https://observador.pt/login-popup/',
      'Observador',
      'width=500, height=500'
    );

    window.addEventListener('message', async message => {
      if (message.data.event === 'login-success' && popup) {
        popup.close();

        // TODO need to test if the refresh is needed or not
        // refresh the page to rerender with cookie obs_foreland seted

        userJwt = Cookies.get('obs_foreland');

        const userData = await getUserData(userJwt as string);

        await loginObservador(userData);
      }
    });
  }, [dispatch, polkamarketsService]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (event.target[0].value) {
        try {
          setLoad('Email');
          throw new Error('Not implemented');

          // const success = await polkamarketsService.socialLoginEmail(
          //   event.target[0].value
          // );

          // if (success) {
          //   const { login } = await import('redux/ducks/polkamarkets');

          //   dispatch(login(polkamarketsService));
          // }
        } finally {
          setLoad('');
          setShow(false);
        }
      }
    },
    []
  );

  const renderProviders = useCallback(
    (provider: Providers) => {
      const isLoading = !!load && load === provider;
      const isDisabled = !!load && load !== provider;
      const child = (
        <>
          {provider === 'Email' ? (
            ''
          ) : (
            <>
              {hasSingleProvider ? (
                <>
                  <Icon name="Profile" size="md" />
                  <Text as="span" scale="caption">
                    Sign In
                  </Text>
                </>
              ) : (
                provider
              )}
            </>
          )}
          {isLoading ? (
            <Spinner $size="md" />
          ) : (
            <>
              {!hasSingleProvider && (
                <Icon
                  size="lg"
                  name={provider === 'Email' ? 'LogIn' : provider}
                />
              )}
            </>
          )}
        </>
      );
      const className = classNames(
        profileSigninClasses.provider,
        profileSigninClasses.social,
        {
          [profileSigninClasses.socialGoogle]: provider === 'Google',
          [profileSigninClasses.socialFacebook]: provider === 'Facebook',
          [profileSigninClasses.socialDiscord]: provider === 'Discord',
          [profileSigninClasses.socialTwitter]: provider === 'Twitter',
          [profileSigninClasses.socialMetaMask]: provider === 'MetaMask'
        }
      );

      if (provider === 'Observador') {
        return (
          <Button
            color="primary"
            size="xs"
            key={provider}
            name={provider}
            className={profileSigninClasses.signin}
            onClick={handleObservadorClick}
            disabled={isDisabled}
          >
            {child}
          </Button>
        );
      }

      if (provider === 'Email')
        return (
          <ProfileSigninEmail
            key={provider}
            disabled={isDisabled}
            onSubmit={handleSubmit}
          >
            {child}
          </ProfileSigninEmail>
        );

      if (provider === 'MetaMask')
        return (
          <ConnectMetamask
            key={provider}
            className={className}
            disabled={isDisabled}
          >
            {child}
          </ConnectMetamask>
        );

      return (
        <Button
          variant="outline"
          color="default"
          size="sm"
          key={provider}
          name={provider}
          className={className}
          onClick={handleClick}
          disabled={isDisabled}
        >
          {child}
        </Button>
      );
    },
    [handleClick, handleSubmit, load, handleObservadorClick]
  );

  function handleHide() {
    setShow(false);
  }

  const { isLoggedIn, isLoggedOut } = useAppSelector(
    state => state.polkamarkets
  );

  useEffect(() => {
    // triggering observador login if the user is already logged in
    if (
      !isLoggedIn &&
      !isLoggedOut &&
      Cookies.get('obs_foreland') &&
      singleProviderName === 'Observador'
    ) {
      handleObservadorClick();
    }
  }, [isLoggedIn, handleObservadorClick, isLoggedOut]);

  return (
    <>
      <Modal
        show={show}
        centered
        className={{ dialog: profileSigninClasses.modal }}
        onHide={handleHide}
      >
        <ModalContent>
          <ModalHeader>
            <Button
              variant="ghost"
              className={profileSigninClasses.modalHeaderHide}
              aria-label="Hide"
              onClick={handleHide}
            >
              <RemoveOutlinedIcon />
            </Button>
            <ModalHeaderTitle className={profileSigninClasses.modalHeaderTitle}>
              Login
            </ModalHeaderTitle>
          </ModalHeader>
          <ModalSection>
            <Text
              fontWeight="medium"
              scale="caption"
              className={profileSigninClasses.subtitle}
            >
              Select one of the following to continue.
            </Text>
            <div className={profileSigninClasses.providers}>
              {ui.socialLogin.providers.map(renderProviders)}
            </div>
          </ModalSection>
        </ModalContent>
      </Modal>
      {hasSingleProvider ? (
        renderProviders(singleProviderName)
      ) : (
        <Button
          size="sm"
          onClick={event => {
            onClick?.(event);
            setShow(true);
          }}
          className={profileSigninClasses.signin}
          {...props}
        />
      )}
    </>
  );
}
