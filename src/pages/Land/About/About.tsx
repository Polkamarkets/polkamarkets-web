import dayjs from 'dayjs';
import { Land } from 'types/land';

import { Icon } from 'components';

import { Card } from '../Card/Card';
import styles from './About.module.scss';

export type AboutProps = {
  land: Land;
};
export const About: React.FC<AboutProps> = ({ land }) => {
  const createdAt = dayjs(land.createdAt).format('MMMM YYYY');
  const socialUrlsKeys = Object.keys(land.socialUrls || {});
  return (
    <Card title="About" className={styles.card}>
      {land.description}

      {socialUrlsKeys.length > 0 && (
        <>
          <div className={styles.divider} />
          <span className={styles.title}>Links</span>

          {socialUrlsKeys.map(key => (
            <div key={key}>
              <span className={styles.socialName}>{key}: </span>
              <a
                href={land.socialUrls[key]}
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
              >
                {land.socialUrls[key].replace('https://', '')}
              </a>
            </div>
          ))}
        </>
      )}
      <div className={styles.divider} />
      <span className={styles.title}>Land Details</span>
      <a
        href={`${window.location.origin}/${land.slug}`}
        className={styles.detailItem}
      >
        <Icon name="Globe" fill="none" size="lg" />
        {`${window.location.origin}/${land.slug}`}
      </a>
      <div className={styles.detailItem}>
        <Icon name="UserCommunities" size="lg" fill="white" /> {land.users}{' '}
        Members
      </div>
      <div className={styles.detailItem}>
        <Icon name="CalendarDates" size="lg" /> Created on {createdAt}
      </div>
    </Card>
  );
};

export default About;
