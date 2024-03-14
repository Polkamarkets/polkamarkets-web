import cn from 'classnames';
import dayjs from 'dayjs';
import { useFormikContext } from 'formik';
import { Avatar } from 'ui';

import type { CreateMarketFormData } from '../../CreateMarketForm';
import Icon from '../../Icon';
import Text from '../../Text';
import MarketPreviewClasses from './MarketPreview.module.scss';
import MarketPreviewOutcomes from './MarketPreviewOutcomes';

function MarketPreview() {
  const { values } = useFormikContext<CreateMarketFormData>();

  const {
    communityName,
    communityImageUrl,
    contestName,
    question,
    closingDate,
    outcomes
  } = values;

  return (
    <div className="prediction-card">
      <div className={MarketPreviewClasses.body}>
        <div className={MarketPreviewClasses.bodyHeader}>
          <div className="pm-c-market__body-details">
            <div className={cn(MarketPreviewClasses.header)}>
              <Avatar
                $radius="lg"
                $size="x2s"
                alt="Market"
                src={communityImageUrl}
                className={MarketPreviewClasses.bodyHeaderImage}
              />
              <span className={cn(MarketPreviewClasses.community)}>
                {communityName}
              </span>{' '}
              <span className={cn(MarketPreviewClasses.connection)}>
                &#x2022; asked at
              </span>{' '}
              <span className={cn(MarketPreviewClasses.context)}>
                {contestName}
              </span>
            </div>

            {question ? (
              <Text as="p" scale="body" fontWeight="medium">
                {question}
              </Text>
            ) : null}
          </div>
        </div>
        <MarketPreviewOutcomes outcomes={outcomes} />
      </div>
      <div className="prediction-card__footer">
        <div className={cn('pm-c-market-footer', MarketPreviewClasses.footer)}>
          <div className="pm-c-market-footer__stats">
            {closingDate && (
              <>
                <Text
                  as="span"
                  scale="tiny-uppercase"
                  fontWeight="semibold"
                  className={MarketPreviewClasses.statsText}
                >
                  <Icon
                    name="Calendar"
                    title="Expires at"
                    className={MarketPreviewClasses.statsIcon}
                  />
                  <Text
                    as="strong"
                    scale="tiny-uppercase"
                    fontWeight="semibold"
                    className={MarketPreviewClasses.statsText}
                  >
                    {dayjs(closingDate).utc().format('MMM D, YYYY h:mm A')}
                  </Text>
                </Text>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketPreview;
