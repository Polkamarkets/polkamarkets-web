import cn from 'classnames';
import { Avatar, useTheme } from 'ui';

import type { Outcome } from '../../CreateMarketForm';
import Text from '../../Text';
import MarketPreviewOutcomesClasses from './MarketPreviewOutcomes.module.scss';

type MarketPreviewOutcomesProps = {
  outcomes: Outcome[];
};

function MarketPreviewOutcomes({ outcomes }: MarketPreviewOutcomesProps) {
  const theme = useTheme();

  const max = theme.device.isDesktop ? 2 : 1;
  const multiple = outcomes.length > (theme.device.isDesktop ? 3 : 2);

  const on = multiple ? outcomes.slice(0, max) : outcomes;
  const off = multiple ? outcomes.slice(max) : [];

  return (
    <ul
      className={cn(
        'pm-c-market-outcomes',
        MarketPreviewOutcomesClasses.outcomes
      )}
    >
      {on.map(outcome => {
        const image = outcome.image?.hash
          ? `https://polkamarkets.infura-ipfs.io/ipfs/${outcome.image.hash}`
          : undefined;
        return (
          <li key={outcome.id}>
            <div
              className={cn(
                MarketPreviewOutcomesClasses.root,
                'pm-c-market-outcomes__item--default'
              )}
              style={{
                // @ts-expect-error No need to assert React.CSSProperties here
                '--outcome-image': image && `url('${image}')`
              }}
            >
              <div className={MarketPreviewOutcomesClasses.content}>
                <div className="pm-c-market-outcomes__item-group--column">
                  <Text
                    as="p"
                    scale="caption"
                    fontWeight="semibold"
                    className="pm-c-market-outcomes__item-title"
                  >
                    {outcome.name}
                  </Text>
                  <Text
                    as="p"
                    scale="tiny"
                    fontWeight="semibold"
                    className="pm-c-market-outcomes__item-odd notranslate"
                  >
                    <Text
                      as="span"
                      scale="tiny"
                      fontWeight="bold"
                      className="pm-c-market-outcomes__item-value"
                    >
                      {`${(outcome.probability / 100).toFixed(3)} `}
                    </Text>
                  </Text>
                </div>
                {image ? <Avatar $size="xs" $radius="xs" src={image} /> : null}
              </div>
            </div>
          </li>
        );
      })}
      {off.length > 0 ? (
        <li>
          <div
            className={cn(
              MarketPreviewOutcomesClasses.root,
              'pm-c-market-outcomes__item--default',
              MarketPreviewOutcomesClasses.variantDashed
            )}
          >
            <div className={MarketPreviewOutcomesClasses.content}>
              <div className="pm-c-market-outcomes__item-group--column">
                <Text
                  as="p"
                  scale="caption"
                  fontWeight="semibold"
                  className="pm-c-market-outcomes__item-title"
                >
                  {`${off.length}+ Outcomes`}
                </Text>
                <Text
                  as="p"
                  scale="tiny"
                  fontWeight="semibold"
                  className="pm-c-market-outcomes__item-odd"
                >
                  {`${off
                    .slice(0, max)
                    .map(outcome => outcome.name)
                    .join(', ')}...`}
                </Text>
              </div>
            </div>
          </div>
        </li>
      ) : null}
    </ul>
  );
}

export default MarketPreviewOutcomes;
