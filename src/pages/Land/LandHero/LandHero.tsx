import { CSSProperties, useEffect, useState } from 'react';

import classNames from 'classnames';
import dayjs from 'dayjs';
import { Land } from 'types/land';
import { Badge } from 'ui/Badge/Badge';
import { Button } from 'ui/Button';
import { ButtonIcon } from 'ui/Button/ButtonIcon';
import * as Menu from 'ui/Menu/Menu';
import * as Tooltip from 'ui/Tooltip/Tooltip';

import { AuthModal, Icon } from 'components';

import { useAppSelector, useERC20Balance, usePolkamarketsService } from 'hooks';

import styles from './LandHero.module.scss';

type LandHeroProps = {
  land: Land;
};

export default function LandHero({ land }: LandHeroProps) {
  const { ethAddress, isLoggedIn } = useAppSelector(
    state => state.polkamarkets
  );
  const polkamarketsService = usePolkamarketsService();

  const [isClaimed, setIsClaimed] = useState(false);

  const { balance, refreshBalance } = useERC20Balance(land.token.address);

  useEffect(() => {
    const fetchState = async () => {
      if (!ethAddress) return;
      const state = await polkamarketsService.isERC20Claimed(
        land.token.address
      );
      setIsClaimed(state);
    };

    fetchState();
  }, [polkamarketsService, ethAddress, land.token.address]);

  const handleClaim = async () => {
    await polkamarketsService.claimERC20(land.token.address);
    await refreshBalance();
  };

  const renderJoinButton = () => {
    if (!isLoggedIn) {
      return (
        <AuthModal>
          <Button>Join Now</Button>
        </AuthModal>
      );
    }

    if (!isClaimed) {
      return <Button onClick={handleClaim}>Join Now</Button>;
    }

    return <Button variant="outlined">Joined</Button>;
  };

  const createdAt = dayjs(land.createdAt).format('MMMM YYYY');

  return (
    <div className={classNames('max-width-screen-lg', styles.container)}>
      <div className={styles.root}>
        <div
          className={styles.banner}
          style={
            { '--background-image': `url(${land.bannerUrl})` } as CSSProperties
          }
        >
          {land.imageUrl ? (
            <div className={styles.avatarRoot}>
              <img
                src={land.imageUrl}
                alt={land.title}
                className={styles.avatar}
              />
            </div>
          ) : null}
        </div>
        <div className={styles.content}>
          <div className={styles.nameAndMenu}>
            <h1 className={styles.contentTitle}>{land.title}</h1>
            <div className={styles.menuRoot}>
              {renderJoinButton()}

              <Menu.Root>
                <Menu.Trigger asChild>
                  <ButtonIcon variant="outlined">
                    <Icon name="MoreHoriz" size="md" />
                  </ButtonIcon>
                </Menu.Trigger>
                <Menu.Content align="end">
                  <Menu.Item
                    onClick={() =>
                      navigator.clipboard.writeText(window.location.toString())
                    }
                  >
                    <Icon name="Link" fill="none" /> Share
                  </Menu.Item>
                  <Menu.Item>Unfollow</Menu.Item>
                </Menu.Content>
              </Menu.Root>
            </div>
          </div>
          <div className={styles.rightContent}>
            <div className={styles.tags}>
              {land.tags.map(tag => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
            <div className={styles.description}>
              {land.description.substring(0, 190)}
              {land.description.length > 190 ? '...' : null}
            </div>
            <div className={styles.linkAndDate}>
              {land.socialUrls.homepage && (
                <a
                  className={styles.link}
                  href={land.socialUrls.homepage}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="ExternalLink" size="md" />{' '}
                  {land.socialUrls.homepage?.replace('https://', '')}
                </a>
              )}
              <Icon name="CalendarDates" size="md" /> Created on {createdAt}
            </div>
          </div>
          <div className={styles.statsRoot}>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Members</span>
                <span className={styles.statValue}>{land.users}</span>
              </div>

              <div className={styles.divider} />
              <div className={styles.stat}>
                <span className={styles.statLabel}>
                  Token{' '}
                  <Tooltip.Provider>
                    <Tooltip.Root delayDuration={200}>
                      <Tooltip.Trigger asChild>
                        <span>
                          <Icon name="Info" size="sm" color="#768393" />
                        </span>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content side="right" sideOffset={4}>
                          Land Tokens are play-money credits that anyone receive
                          when joining Lands, to be used to make predictions.
                          Token earnings are considered along with prediction
                          accuracy for ranking participants.
                          <Tooltip.Arrow />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </span>
                <span className={styles.statValue}>{land.token.symbol}</span>
              </div>
            </div>

            {isClaimed ? (
              <>
                <div className={classNames(styles.stat, styles.balance)}>
                  <span className={styles.statLabel}>
                    Balance{' '}
                    <Tooltip.Provider>
                      <Tooltip.Root delayDuration={200}>
                        <Tooltip.Trigger asChild>
                          <span>
                            <Icon name="Info" size="sm" color="#768393" />
                          </span>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content side="right" sideOffset={4}>
                            Available Land Tokens to use in our Contests, with
                            earnings and losses impacting your balance.
                            <Tooltip.Arrow />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </span>
                  <span className={styles.statValue}>{balance.toFixed()}</span>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
