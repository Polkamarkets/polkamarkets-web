import { useCallback, useState } from 'react';

import classNames from 'classnames';
import { ui } from 'config';
import type { Providers } from 'config';
import { Spinner } from 'ui';

import { RemoveOutlinedIcon } from 'assets/icons';

import { Button } from 'components/Button';
import ConnectMetamask from 'components/ConnectMetamask';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import ModalContent from 'components/ModalContent';
import ModalHeader from 'components/ModalHeader';
import ModalHeaderTitle from 'components/ModalHeaderTitle';
import ModalSection from 'components/ModalSection';
import ProfileSigninEmail from 'components/ProfileSigninEmail';
import Text from 'components/Text';

import { useAppDispatch, usePolkamarketsService } from 'hooks';

import profileSigninClasses from './ProfileSignin.module.scss';

const hasSingleProvider = ui.socialLogin.providers.length === 1;
const singleProviderName = ui.socialLogin.providers[0];

export default function ProfileSignin() {
  const dispatch = useAppDispatch();
  const polkamarketsService = usePolkamarketsService();
  const [show, setShow] = useState(false);
  const [load, setLoad] = useState<Providers | ''>('');
  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      const name = event.currentTarget.name as Exclude<Providers, 'Email'>;

      try {
        setLoad(name);

        const success = await polkamarketsService[`socialLogin${name}`]();

        if (success) {
          const { login } = await import('redux/ducks/polkamarkets');

          dispatch(login(polkamarketsService));
        }
      } finally {
        setLoad('');
        setShow(false);
      }
    },
    [dispatch, polkamarketsService]
  );
  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (event.target[0].value) {
        try {
          setLoad('Email');

          const success = await polkamarketsService.socialLoginEmail(
            event.target[0].value
          );

          if (success) {
            const { login } = await import('redux/ducks/polkamarkets');

            dispatch(login(polkamarketsService));
          }
        } finally {
          setLoad('');
          setShow(false);
        }
      }
    },
    [dispatch, polkamarketsService]
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
              {hasSingleProvider && (
                <>
                  <Icon
                    name="LogIn"
                    size="lg"
                    className={profileSigninClasses.signinIcon}
                  />
                  Login with{' '}
                </>
              )}
              {provider}
            </>
          )}
          {isLoading ? (
            <Spinner $size="md" />
          ) : (
            <Icon size="lg" name={provider === 'Email' ? 'LogIn' : provider} />
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
    [handleClick, handleSubmit, load]
  );

  function handleShow() {
    setShow(true);
  }
  function handleHide() {
    setShow(false);
  }

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
          variant="ghost"
          color="default"
          size="sm"
          onClick={handleShow}
          className={profileSigninClasses.signin}
        >
          <Icon
            name="LogIn"
            size="lg"
            className={profileSigninClasses.signinIcon}
          />
          Login
        </Button>
      )}
    </>
  );
}
