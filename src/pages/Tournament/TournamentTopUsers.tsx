import { useCallback, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import classNames from 'classnames';
import keys from 'helpers/objectKeys';
import every from 'lodash/every';
import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import Divider from 'ui/Divider';

import AlertMini from 'components/Alert/AlertMini';
import Icon from 'components/Icon';
import TableMini from 'components/new/TableMini/TableMini';
import Text from 'components/Text';

import styles from './TournamentTopUsers.module.scss';
import { TournamentTopUsersColumn } from './TournamentTopUsers.types';
import {
  topUserColumnRender,
  prepareTournamentTopUsersRow
} from './TournamentTopUsers.utils';

const columns: TournamentTopUsersColumn[] = [
  {
    key: 'firstPlace',
    title: 'First place',
    render: topUserColumnRender
  },
  {
    key: 'secondPlace',
    title: 'Second place',
    render: topUserColumnRender
  },
  {
    key: 'thirdPlace',
    title: 'Third place',
    render: topUserColumnRender
  }
];

const tabs = {
  ranking: 'Ranking',
  rewards: 'Rewards'
} as const;

type Tabs = typeof tabs[keyof typeof tabs];

type TournamentTopUsersProps = {
  isLoading: boolean;
  rankingRows: ReturnType<typeof prepareTournamentTopUsersRow>;
  rewardsRows: Array<Record<'title' | 'description', string>>;
  rewardsButton: React.ReactNode;
};

function TournamentTopUsers({
  rankingRows,
  rewardsRows,
  isLoading,
  rewardsButton
}: TournamentTopUsersProps) {
  const location = useLocation();

  const [currentTab, setCurrentTab] = useState<Tabs>(tabs.rewards);

  const handleCurrentTab = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setCurrentTab(event.currentTarget.value as Tabs);
    },
    []
  );

  return (
    <div
      className={classNames(
        'border-radius-medium border-solid border-1',
        styles.root
      )}
    >
      <div className={classNames('pm-c-leaderboard-stats bg-3')}>
        <div className={styles.tabs}>
          {keys(tabs).map(tab => (
            <button
              role="tab"
              type="button"
              key={tab}
              value={tabs[tab]}
              aria-selected={currentTab === tabs[tab]}
              className={styles.tabsItem}
              onClick={handleCurrentTab}
            >
              {tabs[tab]}
            </button>
          ))}
        </div>
        {(() => {
          if (isLoading)
            return (
              <div className="flex-row justify-center align-center width-full padding-y-5 padding-x-4">
                <span className="spinner--primary" />
              </div>
            );

          return {
            [tabs.ranking]:
              isEmpty(rankingRows) ||
              every(
                Object.values(rankingRows).map(v => v.value),
                isNull
              ) ? (
                <AlertMini
                  style={{ border: 'none', margin: 2.5 }}
                  styles="outline"
                  variant="information"
                  description="No data to show."
                />
              ) : (
                <TableMini columns={columns} row={rankingRows} />
              ),
            [tabs.rewards]: !rewardsRows.length ? (
              <AlertMini
                style={{ border: 'none', margin: 2.5 }}
                styles="outline"
                variant="information"
                description="No rewards to show."
              />
            ) : (
              <ul className={styles.list}>
                {rewardsRows.map(reward => (
                  <li key={reward.title} className={styles.listItem}>
                    <Text
                      as="span"
                      scale="caption"
                      fontWeight="medium"
                      color="lighter-gray-50"
                    >
                      {reward.title} -{' '}
                    </Text>
                    <Text as="span" scale="caption" color="light-gray">
                      {reward.description}
                    </Text>
                  </li>
                ))}
              </ul>
            )
          }[currentTab];
        })()}
      </div>
      <Divider />
      {
        {
          [tabs.ranking]: (
            <Link
              to={`${location.pathname}/leaderboard`}
              className={styles.action}
            >
              View Leaderboard
              <Icon
                name="Arrow"
                size="md"
                dir="right"
                className={styles.actionIcon}
              />
            </Link>
          ),
          [tabs.rewards]: rewardsButton
        }[currentTab]
      }
    </div>
  );
}

export default TournamentTopUsers;
