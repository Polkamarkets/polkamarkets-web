import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import cn from 'classnames';

import LeaderboardStats from '../Leaderboard/LeaderboardStats';
import type { PrepareLeaderboardTableRowsArgs } from '../Leaderboard/prepare';
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

type TournamentTopUsersProps = {
  isLoading: boolean;
} & Pick<PrepareLeaderboardTableRowsArgs, 'rows'>;

function TournamentTopUsers({ rows, isLoading }: TournamentTopUsersProps) {
  const location = useLocation();

  const row = useMemo(() => prepareTournamentTopUsersRow({ rows }), [rows]);

  return (
    <LeaderboardStats
      title="Top Users"
      columns={columns}
      row={row}
      isLoading={isLoading}
      action={
        <Link
          to={`${location.pathname}/leaderboard`}
          className={cn(
            'pm-c-button--sm',
            'pm-c-button--fullwidth',
            styles.rootActionsButton
          )}
        >
          View Leaderboard
        </Link>
      }
      className={{ root: styles.root }}
    />
  );
}

export default TournamentTopUsers;
