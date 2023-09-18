/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import dayjs from 'dayjs';

// import { CaretDownIcon, CaretUpIcon } from 'assets/icons';

// import Label from '../Label';
import { AreaChart } from '../Charts/AreaChart';
import Text from '../Text';

type BackgroundColor = 'yellow' | 'blue' | 'green' | 'pink' | 'orange';

type CategoryAnalyticsProps = {
  title: string;
  change?: {
    type: 'up' | 'down' | string;
    amount: number;
  };
  value: string | number;
  chartData?: { x: dayjs.Dayjs; y: number }[];
  backgroundColor: BackgroundColor | string;
};

function CategoryAnalytics({
  title,
  change,
  value,
  chartData,
  backgroundColor
}: CategoryAnalyticsProps) {
  return (
    <div
      className={`pm-c-category--${backgroundColor} pm-c-category--analytics`}
    >
      <div className="pm-c-category__header">
        <Text as="h5" scale="tiny-uppercase" fontWeight="bold" color="white-50">
          {title}
        </Text>
        {/* disabling change labels at the moment
        {change ? (
          <Label size="lg" color={change.type === 'up' ? 'success' : 'danger'}>
            {change.type === 'up' ? <CaretUpIcon /> : <CaretDownIcon />}
            {`${change.amount}%`}
          </Label>
        ) : null} */}
      </div>
      <div className="pm-c-category__body notranslate">
        <Text
          as="span"
          scale="body"
          fontWeight="semibold"
          color="light"
          style={{ margin: '0rem 1.6rem' }}
        >
          {value}
        </Text>
      </div>
      {chartData ? (
        <AreaChart data={chartData} height={40} color="white" />
      ) : null}
    </div>
  );
}

CategoryAnalytics.displayName = 'CategoryAnalytics';

export default CategoryAnalytics;
