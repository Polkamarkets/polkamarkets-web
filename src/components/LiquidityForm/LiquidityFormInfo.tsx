import { Alert } from '../Alert';
import Link from '../Link';

function LiquidityFormInfo() {
  return (
    <div className="pm-c-liquidity-form__info">
      <Alert
        variant="warning"
        description={
          <>
            {`When adding liquidity on a market with uneven prices, you’ll get part of your stake as outcome shares. There are risks involved. `}
            <Link
              title="Learn more"
              href="//help.polkamarkets.com/en/articles/6153227-strategies-and-risks-for-liquidity-providers"
              aria-label="Learn more"
              target="_blank"
              rel="noreferrer"
              variant="warning"
              scale="caption"
              fontWeight="medium"
            />
          </>
        }
      />
    </div>
  );
}

LiquidityFormInfo.displayName = 'LiquidityFormInfo';

export default LiquidityFormInfo;
