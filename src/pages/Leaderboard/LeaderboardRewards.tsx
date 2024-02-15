export default function LeaderboardRewards({
  children
}: React.PropsWithChildren<{}>) {
  return (
    <div className="pm-c-leaderboard-stats bg-3 border-radius-medium border-solid border-1">
      <h3 className="body semibold text-1">Rewards</h3>
      {children}
    </div>
  );
}
