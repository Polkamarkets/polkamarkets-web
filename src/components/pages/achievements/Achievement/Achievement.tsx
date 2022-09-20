import { ReactNode, useState, memo } from 'react';

import { PolkamarketsService } from 'services';
import { Achievement as AchievementProps } from 'types/achievement';

import { CheckIcon, MedalIcon } from 'assets/icons';

import { Button, Divider } from 'components';
import { ButtonColor, ButtonVariant } from 'components/Button';

import { useNetwork } from 'hooks';

type ButtonStatus = {
  title: string;
  color: ButtonColor;
  variant: ButtonVariant;
  icon: ReactNode;
  disabled: boolean;
};

const buttonsByStatus: { [key: string]: ButtonStatus } = {
  unlocked: {
    title: 'Claim NFT',
    color: 'primary',
    variant: 'normal',
    icon: null,
    disabled: false
  },
  locked: {
    title: 'Claim NFT',
    color: 'default',
    variant: 'subtle',
    icon: null,
    disabled: true
  },
  claimed: {
    title: 'Claimed',
    color: 'success',
    variant: 'subtle',
    icon: <CheckIcon />,
    disabled: true
  }
};

type AditionalAchievementProps = {
  onClaimCompleted: (
    _id: number,
    _status: boolean,
    _transactionHash: string
  ) => void;
};

function Achievement({
  id,
  title,
  description,
  imageUrl,
  actionTitle,
  rarity,
  status,
  tokenCount,
  onClaimCompleted
}: AchievementProps & AditionalAchievementProps) {
  const { networkConfig } = useNetwork();
  const [isClaimingNFT, setIsClaimingNFT] = useState(false);

  async function claimNFT() {
    setIsClaimingNFT(true);

    const polkamarketsService = new PolkamarketsService(networkConfig);

    try {
      await polkamarketsService.login();
      const response = await polkamarketsService.claimAchievement(id);

      if (response.status && response.transactionHash) {
        await onClaimCompleted(id, response.status, response.transactionHash);
      }

      setIsClaimingNFT(false);
    } catch (error) {
      setIsClaimingNFT(false);
    }
  }

  return (
    <div className="pm-c-achievement flex-column height-full border-radius-top-corners-small">
      <div className="pm-c-achievement__wrapper flex-column height-full border-solid border-radius-top-corners-small">
        <div className="pm-c-achievement__image-vignette relative border-radius-top-corners-small">
          <img
            src={imageUrl}
            alt={title}
            className={`pm-c-achievement__image--${status} border-radius-top-corners-small`}
          />
          <div
            className="absolute"
            style={{ top: '0.8rem', right: '0.767rem' }}
          >
            <div
              className={`pm-c-achievement__status--${status} border-radius-small`}
            >
              <span className="pm-c-achievement__status-title tiny-uppercase semibold">
                {status}
              </span>
            </div>
          </div>
        </div>
        <div className="pm-c-achievement__content flex-column gap-5 padding-6 height-full">
          <div className="flex-column grow gap-3">
            <div className="flex-row justify-start align-center gap-3">
              <MedalIcon
                className={`pm-c-achievement__medal-icon--${status}`}
              />
              <h1
                className={`pm-c-achievement__title--${status} tiny-uppercase semibold`}
              >
                {actionTitle}
              </h1>
            </div>
            <h4 className="pm-c-achievement__award-title heading-large bold">
              {title}
            </h4>
            <p className="pm-c-achievement__award-description caption medium">
              {description}
            </p>
          </div>
          <Button
            size="normal"
            color={buttonsByStatus[status].color}
            variant={buttonsByStatus[status].variant}
            loading={isClaimingNFT}
            disabled={buttonsByStatus[status].disabled}
            onClick={() => claimNFT()}
          >
            {buttonsByStatus[status].icon}
            {buttonsByStatus[status].title}
          </Button>
        </div>
      </div>
      <div className="pm-c-achievement__footer flex-row gap-3 justify-center align-center padding-4 border-solid border-radius-bottom-corners-small">
        <span className="pm-c-achievement__claim-count tiny-uppercase semibold">
          {`${tokenCount} claimed`}
        </span>
        <Divider variant="circle" />
        <span
          className={`pm-c-achievement__rarity--${rarity} tiny-uppercase semibold`}
        >
          {rarity}
        </span>
      </div>
    </div>
  );
}

export default memo(Achievement);
