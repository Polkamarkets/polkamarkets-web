import { Land } from 'types/land';

import styles from './LandItem.module.scss';

export type LandItemProps = { land: Land };
export const LandItem: React.FC<LandItemProps> = ({ land }) => {
  return (
    <a href={`/${land.slug}`} className={styles.root}>
      {land.imageUrl ? <img src={land.imageUrl} alt="land logo" /> : null}
      <span>{land.title}</span>
    </a>
  );
};

export default LandItem;
