import { ReactNode, useEffect, useState } from 'react';

import { useField } from 'formik';
import { roundNumber } from 'helpers/math';
import { PolkamarketsService } from 'services';

import { ArrowRightIcon, InfoIcon } from 'assets/icons';

import { useAppSelector, useNetwork } from 'hooks';

import Badge from '../Badge';
import Text from '../Text';
import Tooltip from '../Tooltip';

type ItemFontWeight = 'normal' | 'bold';

type CurrentBondItem = {
  key: string;
  title: string;
  value: number;
  fontWeight: ItemFontWeight;
  helpText?: string;
};

type TotalBondItem = {
  key: string;
  title: ReactNode;
  value: number;
  fontWeight: ItemFontWeight;
  helpText?: string;
};

function ReportFormDetails() {
  const { networkConfig } = useNetwork();
  const [bond] = useField('bond');
  const [outcome] = useField('outcome');

  const { outcomes, questionId } = useAppSelector(state => state.market.market);
  const { finalizeTs } = useAppSelector(state => state.market.market.question);
  const [bonds, setBonds] = useState({});
  const [totalBond, setTotalBond] = useState(0);

  const currentBondItems: CurrentBondItem[] = [
    {
      key: 'bondAmount',
      title: 'Bond Amount',
      value: bond.value,
      fontWeight: 'bold'
    },
    {
      key: 'potentialProfit',
      title: 'Potential Profit',
      value: totalBond - (bonds[outcome.value] || 0),
      fontWeight: 'normal'
    },
    {
      key: 'potentialLoss',
      title: 'Potential Loss',
      value: bond.value,
      fontWeight: 'normal'
    }
  ];

  // UGLY WORKAROUND! TODO: get data from api
  useEffect(() => {
    async function getOutcomesBonds() {
      const polkamarketsService = new PolkamarketsService(networkConfig);
      // await polkamarketsService.login();

      const response = await polkamarketsService.getQuestionBonds(questionId);
      setBonds(response);

      // TODO: improve this calculating total bond
      const totalBondAmount = Object.values(response || {}).reduce(
        (a: any, b: any) => a + b,
        0
      ) as number;
      setTotalBond(totalBondAmount);
    }

    getOutcomesBonds();
  }, [finalizeTs, networkConfig, questionId]);

  const totalBondItems: TotalBondItem[] = [
    {
      key: 'totalBondAmount',
      title: 'Total Bond',
      value: totalBond + bond.value,
      fontWeight: 'bold',
      helpText: 'Total POLK reported by all users'
    },
    {
      key: `${outcomes[0].id}`,
      title: <Badge color="blue" label={outcomes[0].title} />,
      value: bonds[0] || 0,
      fontWeight: 'normal'
    },
    {
      key: `${outcomes[1].id}`,
      title: <Badge color="pink" label={outcomes[1].title} />,
      value: bonds[1] || 0,
      fontWeight: 'normal'
    },
    {
      key: 'invalid',
      title: <Badge color="warning" label="Invalid" />,
      value: bonds[-1] || 0,
      fontWeight: 'normal'
    }
  ];

  return (
    <div className="pm-c-report-form-details">
      <ul className="pm-c-report-form-details__group">
        {currentBondItems.map(item => (
          <li key={item.key} className="pm-c-report-form-details__item">
            <div className="pm-c-report-form-details__group-inline">
              <Text
                as="span"
                className={`pm-c-report-form-details__item-title--${item.fontWeight}`}
              >
                {item.title}
              </Text>
              {item.helpText ? (
                <Tooltip position="top" text={item.helpText}>
                  <InfoIcon />
                </Tooltip>
              ) : null}
            </div>
            <Text
              as="span"
              className={`pm-c-report-form-details__item-value--${item.fontWeight}`}
            >
              {`${roundNumber(item.value, 3)} POLK`}
            </Text>
          </li>
        ))}

        <div className="pm-c-report-form-details__separator" />

        {totalBondItems.map(item => (
          <li key={item.key} className="pm-c-report-form-details__item">
            <div className="pm-c-report-form-details__group-inline">
              <Text
                as="span"
                className={`pm-c-report-form-details__item-title--${item.fontWeight}`}
              >
                {item.title}
              </Text>
              {item.helpText ? (
                <Tooltip position="top" text={item.helpText}>
                  <InfoIcon />
                </Tooltip>
              ) : null}
            </div>
            <div className="pm-c-report-form-details__group-inline--new-bond">
              <Text
                as="span"
                className={`pm-c-report-form-details__item-value--${item.fontWeight}`}
              >
                {`${roundNumber(item.value, 3)} POLK`}
              </Text>
              {outcome.value && outcome.value === item.key ? (
                <>
                  <ArrowRightIcon />
                  <Text
                    as="span"
                    className={`pm-c-report-form-details__item-value--${item.fontWeight}--new-bond`}
                  >
                    {`${roundNumber(item.value + bond.value, 3)} POLK`}
                  </Text>
                </>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReportFormDetails;
