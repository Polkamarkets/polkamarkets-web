import React from 'react';

import { features } from 'config';
import dayjs from 'dayjs';
import { colorByOutcomeId } from 'helpers/color';
import { fromTimestampToDate, toUTC } from 'helpers/date';
import { roundNumber } from 'helpers/math';
import { capitalize } from 'helpers/string';
import omit from 'lodash/omit';
import reverse from 'lodash/reverse';
import times from 'lodash/times';
import { PolkamarketsService } from 'services';

import { ShareIcon } from 'assets/icons';

import { Badge, Pill, Text } from 'components';

function generateRandomNumberBetween(min: number, max: number) {
  return Math.random() * (max - min + 1) + min;
}

function generateMarketChartRandomData(size: number) {
  let currentIndex = 0;

  const data = times(size, () => {
    const currentTime = dayjs().subtract(currentIndex, 'minute');
    const currentValue = generateRandomNumberBetween(1.0, 1.5);

    const currentEvent = {
      x: currentTime,
      y: currentValue
    };
    currentIndex += 1;

    return currentEvent;
  });

  return reverse(data);
}

type ItemAlign = 'left' | 'center' | 'right';

type Column = {
  title: string;
  key: string;
  align: ItemAlign;
};

type Row = {
  key: string;
  outcome: { value: React.ReactNode; align: ItemAlign };
  date: { value: React.ReactNode; align: ItemAlign };
  price: { value: React.ReactNode; align: ItemAlign };
  shares: { value: number | null; align: ItemAlign };
  value: { value: React.ReactNode; align: ItemAlign };
  tradeType: { value: React.ReactNode; align: ItemAlign };
  transactionHash: { value: React.ReactNode; align: ItemAlign };
};

function formatMarketPositions<A, O>(
  actions: A[],
  bondActions: A[],
  outcomes: O,
  ticker: string,
  network
) {
  const columns: Column[] = [
    { title: 'Outcome', key: 'outcome', align: 'left' },
    { title: 'Date', key: 'date', align: 'right' },
    { title: 'Price', key: 'price', align: 'right' },
    { title: 'Shares', key: 'shares', align: 'right' },
    { title: 'Total Value', key: 'value', align: 'right' },
    { title: 'Trade Type', key: 'tradeType', align: 'center' },
    { title: 'TX', key: 'transactionHash', align: 'right' }
  ].filter(column =>
    features.fantasy.enabled ? column.key !== 'transactionHash' : true
  ) as Column[];

  const actionColorReducer = action => {
    switch (action) {
      case 'Buy':
        return { color: 'success', variant: 'subtle' };
      case 'Sell':
        return { color: 'danger', variant: 'subtle' };
      case 'Add Liquidity':
        return { color: 'primary', variant: 'subtle' };
      case 'Remove Liquidity':
        return { color: 'primary', variant: 'subtle' };
      case 'Claim Winnings':
        return { color: 'success', variant: 'normal' };
      case 'Bond':
        return { color: 'warning', variant: 'subtle' };
      default:
        return { color: 'default', variant: 'normal' };
    }
  };

  const rows: Row[] = actions
    .concat(bondActions)
    .sort((x: any, y: any) => (x.timestamp > y.timestamp ? -1 : 1))
    .map((action: any, index: number) => {
      const key = index.toString();
      let { outcomeId } = action;
      let outcome =
        action.action === 'Buy' ||
        action.action === 'Sell' ||
        action.action === 'Claim Winnings'
          ? outcomes[outcomeId]?.title
          : null;

      if (action.answerId) {
        // mapping realitio answer to outcome
        outcomeId = PolkamarketsService.bytes32ToInt(action.answerId);
        outcome = outcomeId === -1 ? 'Invalid' : outcomes[outcomeId]?.title;
      }
      const date = fromTimestampToDate(action.timestamp * 1000).format(
        'YYYY/MM/DD'
      );
      const utcTime = fromTimestampToDate(action.timestamp * 1000).format(
        'h:mm A'
      );
      const actionColor = actionColorReducer(action.action);
      const price =
        action.action === 'Claim Fees' || action.action === 'Bond'
          ? null
          : `${roundNumber(action.value / action.shares, 3)}`;
      const shares =
        action.action === 'Claim Fees' || action.action === 'Bond'
          ? null
          : roundNumber(action.shares, 3);
      const value = `${roundNumber(action.value, 3)}`;
      const tradeType = action.action;
      const { transactionHash } = action;

      return omit(
        {
          key,
          outcome: {
            value: outcome && (
              <Badge
                variant="filled"
                style={{
                  backgroundColor: `rgb(var(--color-${colorByOutcomeId(
                    outcomeId
                  )}--rgb) / 0.6)`
                }}
                label={outcome}
              />
            ),
            align: 'left'
          },
          date: {
            value: (
              <Text
                as="span"
                scale="caption"
                fontWeight="semibold"
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                {date}
                <strong>{utcTime}</strong>
              </Text>
            ),
            align: 'right'
          },
          price: {
            value: (
              <Text as="span" scale="caption" fontWeight="semibold">
                {price}
                {price ? <strong>{` ${ticker}`}</strong> : null}
              </Text>
            ),
            align: 'right'
          },
          shares: {
            value: shares,
            align: 'right'
          },
          value: {
            value: (
              <Text as="span" scale="caption" fontWeight="semibold">
                {value}{' '}
                <strong>{action.action === 'Bond' ? 'POLK' : ticker}</strong>
              </Text>
            ),
            align: 'right'
          },
          tradeType: {
            value: (
              <Pill color={actionColor.color} variant={actionColor.variant}>
                {tradeType}
              </Pill>
            ),
            align: 'center'
          },
          transactionHash: {
            value: (
              <a
                target="_blank"
                href={`${network.explorerURL}/tx/${transactionHash}`}
                rel="noreferrer"
              >
                <ShareIcon />
              </a>
            ),
            align: 'right'
          }
        },
        features.fantasy.enabled ? ['transactionHash'] : []
      ) as Row;
    });

  return { columns, rows };
}

function formatSEODescription(
  category: string,
  subcategory: string,
  expiresAt: string
) {
  return `${capitalize(category)} / ${capitalize(
    subcategory
  )} - Market closes on ${toUTC(expiresAt, 'YYYY/MM/DD')}`;
}

export {
  formatMarketPositions,
  generateMarketChartRandomData,
  formatSEODescription
};
