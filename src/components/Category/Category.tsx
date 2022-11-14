/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import classnames from 'classnames';
import dayjs from 'dayjs';
import { setSearchQuery } from 'redux/ducks/markets';
import { useAppDispatch } from 'redux/store';

// import { CaretDownIcon, CaretUpIcon } from 'assets/icons';

import { AreaChart } from 'components/Charts/AreaChart';

import { useAppSelector } from 'hooks';
import useCategories from 'hooks/useCategories';

// import Label from '../Label';
import Text from '../Text';

type BackgroundColor = 'yellow' | 'blue' | 'green' | 'pink' | 'orange';

type CategoryProps = {
  title: string;
  change?: {
    type: 'up' | 'down' | string;
    amount: number;
  };
  chartData?: { x: dayjs.Dayjs; y: number }[];
  backgroundColor: BackgroundColor | string;
};

function Category({
  title,
  change,
  chartData,
  backgroundColor
}: CategoryProps) {
  const dispatch = useAppDispatch();
  const categories = useCategories();
  const searchQuery = useAppSelector(state => state.markets.searchQuery);

  const searchQueryMatchesWithTitle = (categoryTitle: string) =>
    categoryTitle.match(new RegExp(`^${searchQuery}$`, 'i'));

  const searchQueryMatchesSomeCategory = categories
    .map(category => category.title)
    .some(searchQueryMatchesWithTitle);

  function handleCategorySelected() {
    if (title === searchQuery) {
      dispatch(setSearchQuery(''));
    } else {
      dispatch(setSearchQuery(title));
    }
  }

  return (
    <div
      className={classnames({
        [`pm-c-category--${backgroundColor}`]: true,
        'pm-c-category--outfocus':
          searchQueryMatchesSomeCategory && !searchQueryMatchesWithTitle(title)
      })}
      role="button"
      tabIndex={0}
      onClick={handleCategorySelected}
      onKeyPress={handleCategorySelected}
    >
      <div className="pm-c-category__header">
        <Text
          as="label"
          scale="body"
          fontWeight="semibold"
          color="white"
          className="cursor-pointer"
        >
          {title}
        </Text>
        {/* disabling change labels at the moment
          <Label size="lg" color={change.type === 'up' ? 'success' : 'danger'}>
            {change.type === 'up' ? <CaretUpIcon /> : <CaretDownIcon />}
            {`${change.amount}%`}
          </Label>
        ) : null */}
      </div>
      <div className="pm-c-category__body">
        {chartData ? (
          <AreaChart data={chartData} height="5rem" color="white" />
        ) : null}
      </div>
    </div>
  );
}

Category.displayName = 'Category';

export default Category;
