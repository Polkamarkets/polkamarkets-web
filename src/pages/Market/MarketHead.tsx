import { VerifiedIcon } from 'assets/icons';

import { Breadcrumb, Text, Tooltip } from 'components';

type MarketHeadProps = {
  isVerified: boolean;
  section: string;
  subsection: string;
  imageUrl: string;
  description: string;
};

const MarketHead = ({
  isVerified,
  section,
  subsection,
  imageUrl,
  description
}: MarketHeadProps) => {
  return (
    <div className="market-head">
      <div className="relative height-min-content">
        <img className="market-head__image" alt="market head" src={imageUrl} />
        {isVerified ? (
          <div
            className="absolute"
            style={{ bottom: '-0.5rem', right: '1.5rem' }}
          >
            <Tooltip
              className="width-max-content"
              text="Verified Market"
              position="bottom"
            >
              <VerifiedIcon style={{ cursor: 'pointer' }} />
            </Tooltip>
          </div>
        ) : null}
      </div>
      <div className="market-head__details">
        <Breadcrumb>
          <Breadcrumb.Item>{section}</Breadcrumb.Item>
          <Breadcrumb.Item>{subsection}</Breadcrumb.Item>
        </Breadcrumb>
        <Text as="p" scale="body" fontWeight="medium">
          {description}
        </Text>
      </div>
    </div>
  );
};

export default MarketHead;
