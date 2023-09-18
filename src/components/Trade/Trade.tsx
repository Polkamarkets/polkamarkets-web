import { CSSProperties } from 'react';

import cn from 'classnames';
import getMarketColors from 'helpers/getMarketColors';
import { useTheme } from 'ui';

import { useAppSelector } from 'hooks';

import Breadcrumb from '../Breadcrumb';
import TradeFormClosed from '../TradeForm/TradeFormClosed';
import TradeFormInput from '../TradeForm/TradeFormInput';
import { views } from './Trade.config';
import styles from './Trade.module.scss';
import type { View } from './Trade.types';
import TradeActions from './TradeActions';
import TradeDetails from './TradeDetails';
import TradePredictions from './TradePredictions';

type TradeProps = {
  view?: View;
  onTradeFinished: () => void;
};

function Trade({ view = 'default', onTradeFinished }: TradeProps) {
  const theme = useTheme();
  const market = useAppSelector(state => state.market.market);
  const marketColors = getMarketColors({
    network: market.network.id,
    market: market.id
  });

  const isLoadingMarket = useAppSelector(state => state.market.isLoading);

  const config = views[view];

  if (isLoadingMarket) return null;

  if (market.state !== 'open')
    return (
      <div className={cn({ [styles.closed]: view === 'modal' })}>
        <TradeFormClosed />
      </div>
    );

  return (
    <div
      className={cn(styles.root, {
        [styles.rootDefault]: view === 'default',
        [styles.rootModal]: view === 'modal'
      })}
      style={
        {
          maxWidth: theme.device.isDesktop ? '540px' : 'unset',
          '--image': `url('${market.imageUrl}')`,
          '--backdrop-color': marketColors.market
        } as CSSProperties
      }
    >
      {view === 'default' && theme.device.isDesktop ? (
        <p className={styles.rootDefaultTitle}>Make your prediction</p>
      ) : null}
      <div className={styles.rootView}>
        {config.market.details ? (
          <div className={styles.market}>
            <Breadcrumb>
              <Breadcrumb.Item>{market.category}</Breadcrumb.Item>
              <Breadcrumb.Item>{market.subcategory}</Breadcrumb.Item>
            </Breadcrumb>
            <p className={styles.marketTitle}>{market.title}</p>
          </div>
        ) : null}
        <TradePredictions view={view} />
      </div>
      <div className={styles.rootActions}>
        <TradeFormInput />
        <TradeDetails />
        <div className={styles.actionsGroup}>
          <TradeActions onTradeFinished={onTradeFinished} />
          <p className={styles.terms}>
            By clicking you’re agreeing to our{' '}
            <a
              href="https://www.polkamarkets.com/legal/terms-conditions"
              target="_blank"
              rel="noreferrer"
            >
              Terms and Conditions
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Trade;
