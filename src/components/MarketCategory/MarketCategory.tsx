import type { Market } from 'models/market';

import { VerifiedIcon } from 'assets/icons';

import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import Text from 'components/Text/Text';
import Tooltip from 'components/Tooltip';

import marketCategoryClasses from './MarketCategory.module.scss';

export default function MarketCategory({
  category,
  subcategory,
  verified
}: Pick<Market, 'category' | 'subcategory' | 'verified'>) {
  return (
    <div className={marketCategoryClasses.root}>
      <Breadcrumb className={marketCategoryClasses.fill}>
        <Breadcrumb.Item>{category}</Breadcrumb.Item>
        <Breadcrumb.Item className={marketCategoryClasses.truncate}>
          <Tooltip text={subcategory}>{subcategory}</Tooltip>
        </Breadcrumb.Item>
      </Breadcrumb>
      {verified && (
        <div className={marketCategoryClasses.verified}>
          <VerifiedIcon size="sm" />
          <Text as="span" scale="tiny-uppercase" fontWeight="semibold">
            Verified
          </Text>
        </div>
      )}
    </div>
  );
}
