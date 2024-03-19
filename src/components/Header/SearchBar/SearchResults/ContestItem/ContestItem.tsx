import { Tournament } from 'types/tournament';

import styles from './ContestItem.module.scss';

export type ContestItemProps = { contest: Tournament };
export const ContestItem: React.FC<ContestItemProps> = ({ contest }) => {
  return (
    <a href={`/tournaments/${contest.slug}`} className={styles.root}>
      <span className={styles.contestTitle}>{contest.title || 'Unnamed'}</span>
      <span className={styles.landTitle}>{contest.land?.title}</span>
      {contest.land?.imageUrl ? (
        <img src={contest.land.imageUrl} alt="land logo" />
      ) : null}
    </a>
  );
};

export default ContestItem;
