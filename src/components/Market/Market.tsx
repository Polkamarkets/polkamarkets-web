import { Link } from 'react-router-dom';

import { Market as MarketInterface } from 'models/market';

import Breadcrumb from '../Breadcrumb';
import Text from '../Text';
import MarketFooter from './MarketFooter';
import MarketOptions from './MarketOptions';

type MarketCardProps = {
  market: MarketInterface;
};

function Market({ market }: MarketCardProps) {
  const { imageUrl, category, subcategory, title } = market;
  return (
    <div className="pm-c-market">
      <div className="pm-c-market__body">
        <img height={66} width={66} src={imageUrl} alt="" />
        <div className="pm-c-market__body-details">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to={`/${category.toLowerCase()}`}>{category}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{subcategory}</Breadcrumb.Item>
          </Breadcrumb>
          <Text as="p" scale="body" fontWeight="medium" color="light">
            {title}
          </Text>
        </div>
      </div>
    </div>
  );
}

Market.displayName = 'Market';

Market.Options = MarketOptions;
Market.Footer = MarketFooter;

export default Market;