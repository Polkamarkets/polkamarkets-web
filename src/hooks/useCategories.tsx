import { useMemo } from 'react';

import identity from 'lodash/identity';
import pickBy from 'lodash/pickBy';
import { Category } from 'models/category';

import {
  SoccerBallIcon,
  GamingConsoleIcon,
  WhiteHouseIcon,
  BitcoinIcon,
  ExploreIcon
} from 'assets/icons';

import { generateChartRandomData } from 'pages/Portfolio/utils';

import useAppSelector from './useAppSelector';

const categories: Category[] = [
  {
    title: 'Crypto',
    backgroundColor: 'yellow',
    icon: <BitcoinIcon />,
    chartData: generateChartRandomData(),
    change: {
      type: 'up',
      amount: 0
    }
  },
  {
    title: 'Gaming',
    backgroundColor: 'pink',
    icon: <GamingConsoleIcon />,
    chartData: generateChartRandomData(),
    change: {
      type: 'up',
      amount: 0
    }
  },
  {
    title: 'Sports',
    backgroundColor: 'orange',
    icon: <SoccerBallIcon />,
    chartData: generateChartRandomData(),
    change: {
      type: 'up',
      amount: 0
    }
  },
  {
    title: 'Politics',
    backgroundColor: 'green',
    icon: <WhiteHouseIcon />,
    chartData: generateChartRandomData(),
    change: {
      type: 'up',
      amount: 0
    }
  },
  {
    title: 'Other',
    backgroundColor: 'blue',
    icon: <ExploreIcon />,
    chartData: generateChartRandomData(),
    change: {
      type: 'up',
      amount: 0
    }
  }
];

function useCategories() {
  const markets = useAppSelector(state => state.markets.markets);

  const marketCountByCategory = useMemo(() => {
    const marketCount = {};
    markets.forEach(market => {
      const { category } = market;
      if (!marketCount[category]) {
        marketCount[category] = 0;
      }
      marketCount[category] += 1;
    });
    return marketCount;
  }, [markets]);

  return categories.map(category =>
    pickBy(
      {
        ...category,
        marketCount: marketCountByCategory[category.title.toLowerCase()]
      },
      identity
    )
  ) as Category[];
}

export default useCategories;
