import { Market } from 'models/market';

import Icon from 'components/Icon';

import styles from './QuestionItem.module.scss';

export type QuestionItemProps = { question: Market };
export const QuestionItem: React.FC<QuestionItemProps> = ({ question }) => {
  return (
    <a href={`/markets/${question.slug}`} className={styles.root}>
      <span className={styles.questionTitle}>{question.title}</span>
      {(question.tournaments.length && (
        <>
          <div className={styles.metadata}>
            {question.tournaments[0].land?.imageUrl && (
              <img
                src={question.tournaments[0].land.imageUrl}
                alt="land logo"
              />
            )}

            <span className={styles.landTitle}>
              {question.tournaments[0].land?.title || 'Land Title'}
            </span>
            <span className={styles.askedAt}>Asked at</span>
            <span className={styles.contestName}>
              {question.tournaments[0].title}
            </span>
            <Icon name="Cup" />

            <div />
          </div>
        </>
      )) ||
        null}
    </a>
  );
};

export default QuestionItem;
