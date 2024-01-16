import { useCallback, useState } from 'react';

import classNames from 'classnames';
import { isNull } from 'lodash';
import { Land } from 'types/land';
import { Avatar, Image, useTheme } from 'ui';

import { InfoIcon } from 'assets/icons';

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalHeaderHide,
  ModalHeaderTitle,
  ModalSection,
  ModalSectionText,
  Share
} from 'components';

import styles from './LandHero.module.scss';

type LandHeroProps = {
  meta: Pick<Land, 'slug' | 'title' | 'description' | 'bannerUrl' | 'imageUrl'>;
  stats: {
    tournaments: number;
    members: number;
    // totalRewards: number;
  };
};

export default function LandHero({ meta, stats }: LandHeroProps) {
  const theme = useTheme();

  const [showAboutModal, setShowAboutModal] = useState(false);

  const handleShowAboutModal = useCallback(() => setShowAboutModal(true), []);
  const handleHideAboutModal = useCallback(() => setShowAboutModal(false), []);

  return (
    <div className={classNames('max-width-screen-xl', styles.container)}>
      <div className={styles.root}>
        <div className={styles.banner}>
          {!isNull(meta.bannerUrl) && (
            <Image
              alt=""
              src={meta.bannerUrl}
              className={{ img: styles.bannerImage }}
            />
          )}
          <div className={styles.bannerContent}>
            {meta.imageUrl ? (
              <Avatar
                src={meta.imageUrl}
                alt={meta.title}
                $radius="lg"
                className={styles.bannerAvatar}
              />
            ) : null}
          </div>
        </div>
        <div className={styles.content}>
          <Modal show={showAboutModal} size="sm" centered>
            <ModalContent>
              <ModalHeader>
                <ModalHeaderTitle>{meta.title}</ModalHeaderTitle>
                <ModalHeaderHide onClick={handleHideAboutModal} />
              </ModalHeader>
              <ModalSection>
                <ModalSectionText>{meta.description}</ModalSectionText>
              </ModalSection>
            </ModalContent>
          </Modal>
          {!theme.device.isDesktop ? (
            <div className={styles.contentActions}>
              <Button
                size="sm"
                color="noborder"
                className={styles.contentActionsButton}
                onClick={handleShowAboutModal}
              >
                <InfoIcon />
                About
              </Button>
              <span
                className={classNames(
                  'pm-c-divider--circle',
                  styles.footerStatsDivider
                )}
              />
              <Share
                id={`${meta.slug}--content`}
                className={classNames(
                  styles.contentActionsButton,
                  styles.contentActionsButtonWithHover
                )}
              />
            </div>
          ) : null}
          <h3 className={styles.contentTitle}>{meta.title}</h3>
        </div>
        <div className={styles.footer}>
          <div className={styles.footerStats}>
            <span className={styles.footerStatsItem}>
              Tournaments:
              <strong>{stats.tournaments}</strong>
            </span>
            <span
              className={classNames(
                'pm-c-divider--circle',
                styles.footerStatsDivider
              )}
            />
            <span className={styles.footerStatsItem}>
              Members:
              <strong>{stats.members}</strong>
            </span>
            {/* <span
            className={classNames(
              'pm-c-divider--circle',
              styles.footerStatsDivider
            )}
          />
          <span className={styles.footerStatsItem}>
            Total Rewards:
            <strong>{stats.totalRewards}</strong>
          </span> */}
          </div>
          {theme.device.isDesktop ? (
            <div className={styles.footerActions}>
              <Button
                size="sm"
                color="noborder"
                className={styles.contentActionsButton}
                onClick={handleShowAboutModal}
              >
                <InfoIcon />
                About
              </Button>
              <span
                className={classNames(
                  'pm-c-divider--circle',
                  styles.footerStatsDivider
                )}
              />
              <Share
                id={`${meta.slug}--footer`}
                className={classNames(
                  styles.contentActionsButton,
                  styles.contentActionsButtonWithHover
                )}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
