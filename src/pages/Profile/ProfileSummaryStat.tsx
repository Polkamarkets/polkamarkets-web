import { Text } from 'components/new';

type ProfileSummaryStatProps = {
  title: string;
  value: string;
  backgroundColor: 'yellow' | 'blue' | 'green' | 'pink' | 'orange';
};

function ProfileSummaryStat({
  title,
  value,
  backgroundColor
}: ProfileSummaryStatProps) {
  return (
    <div
      className={`pm-p-profile-summary__stat bg-gradient-${backgroundColor}`}
    >
      <Text
        className="text-white-50 whitespace-nowrap"
        as="h5"
        fontSize="body-4"
        fontWeight="bold"
        transform="uppercase"
      >
        {title}
      </Text>
      <Text
        className="text-light"
        as="span"
        fontSize="body-1"
        fontWeight="semibold"
      >
        {value}
      </Text>
    </div>
  );
}

export default ProfileSummaryStat;
