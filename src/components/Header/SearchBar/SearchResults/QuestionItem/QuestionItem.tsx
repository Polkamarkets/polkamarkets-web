import { Market } from 'models/market';

import Icon from 'components/Icon';

import styles from './QuestionItem.module.scss';

export type QuestionItemProps = { question: Market };
export const QuestionItem: React.FC<QuestionItemProps> = ({ question }) => {
  return (
    <a href={`/markets/${question.slug}`} className={styles.root}>
      <span className={styles.questionTitle}>{question.title}</span>
      <div className={styles.metadata}>
        {question.land?.imageUrl && (
          <img src={question.land.imageUrl} alt="land logo" />
        )}
        <span className={styles.landTitle}>
          {question.land?.title || 'Land Title'}
        </span>
        <span className={styles.askedAt}>
          Asked {(question.tournaments.length && 'at') || ''}
        </span>
        <span className={styles.contestName}>
          {(question.tournaments.length && question.tournaments[0].title) ||
            'Contest Title'}
        </span>
        <Icon name="Cup" />
        <div />
      </div>
    </a>
  );
};

export default QuestionItem;
