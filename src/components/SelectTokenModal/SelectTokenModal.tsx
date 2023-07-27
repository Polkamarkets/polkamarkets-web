import { useCallback, useState, ChangeEvent, useMemo, useEffect } from 'react';

import cn from 'classnames';
import { ui, tokens } from 'config';
import isEmpty from 'lodash/isEmpty';
import { changeCreateMarketToken } from 'redux/ducks/polkamarkets';
import { PolkamarketsService } from 'services';
import { Currency } from 'types/currency';
import type { Network } from 'types/network';
import { Token } from 'types/token';
import { Adornment, Container } from 'ui';

import { TokenIcon } from 'assets/icons';

import { useAppDispatch, useAppSelector, useNetwork } from 'hooks';

import { Button } from '../Button';
import Icon from '../Icon';
import Modal from '../Modal';
import ModalContent from '../ModalContent';
import SearchBar from '../SearchBar';
import Text from '../Text';
import VirtualizedList from '../VirtualizedList';
import selectTokenModalClasses from './SelectTokenModal.module.scss';

type SelectTokenModalProps = {
  network: Network;
};

export default function SelectTokenModal({ network }: SelectTokenModalProps) {
  const dispatch = useAppDispatch();
  const [rect, setRect] = useState<DOMRect | null>(null);

  const [searchString, setSearchString] = useState<string>('');
  const [searchToken, setSearchToken] = useState<any>(null);
  const { createMarketToken } = useAppSelector(state => state.polkamarkets);
  const { networkConfig } = useNetwork();

  const currency = createMarketToken || network.currency;

  const currencyByNetwork = network.currency;
  const tokensByNetwork = useMemo(
    () =>
      tokens.filter(token =>
        Object.keys(token.addresses).includes(network.key)
      ),
    [network.key]
  );

  const isOnBlacklist = (token: Currency | Token) =>
    ui.selectTokenModal.blacklist
      ? ui.selectTokenModal.blacklist.some(
          tokenTicker =>
            tokenTicker.toLowerCase() === token.ticker.toLowerCase()
        )
      : false;

  const filterByBlacklist = (token: Currency | Token) => !isOnBlacklist(token);

  const filterBySearchString = (token: Currency | Token) =>
    token.name.toLowerCase().includes(searchString.toLowerCase()) ||
    token.ticker.toLowerCase().includes(searchString.toLowerCase());

  const availableTokens = [currencyByNetwork, ...tokensByNetwork].filter(
    token => filterByBlacklist(token)
  );

  const filteredTokens = availableTokens.filter(token =>
    filterBySearchString(token)
  );

  useEffect(() => {
    if (
      createMarketToken &&
      (createMarketToken as Token).addresses &&
      !(createMarketToken as Token).addresses[network.key]
    ) {
      dispatch(changeCreateMarketToken(network.currency));
    }
  }, [
    availableTokens,
    createMarketToken,
    dispatch,
    network.currency,
    network.key
  ]);

  const handleShow = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) =>
      setRect(event.currentTarget.getBoundingClientRect()),
    []
  );

  const handleHide = useCallback(() => setRect(null), []);

  const handleChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value;

      setSearchString(text);

      const isAddress = /0[x, X][a-fA-F0-9]{40}/.test(text);

      if (isAddress) {
        const polkamarketsService = new PolkamarketsService(networkConfig);
        // fetching token info from blockchain
        const tokenInfo = await polkamarketsService.getERC20TokenInfo(text);

        if (tokenInfo) {
          setSearchToken(tokenInfo);
        }
      } else {
        setSearchToken(null);
      }
    },
    [networkConfig]
  );

  const handleSelect = useCallback(
    (token: Currency | Token) => {
      dispatch(changeCreateMarketToken(token));
      handleHide();
    },
    [handleHide, dispatch]
  );

  if (searchToken) {
    const tokenByTicker = (Object.values(tokens).find(
      token => token.ticker === searchToken.ticker
    ) || Object.values(tokens).find(token => token.ticker === 'TOKEN')) as any;

    const res = {
      ...tokenByTicker,
      name: searchToken.name,
      ticker: searchToken.ticker,
      symbol: searchToken.ticker,
      addresses: {
        [network.key]: searchToken.address
      }
    };

    filteredTokens.push(res);
  }

  const searchTokenIsOnBlacklist =
    filteredTokens.length === 1 && isOnBlacklist(filteredTokens[0]);

  return (
    <>
      <button
        type="button"
        aria-label="Select token"
        onClick={handleShow}
        className={cn(
          selectTokenModalClasses.root,
          'pm-c-button-outline--default'
        )}
      >
        {currency.iconName === 'Token' ? (
          <TokenIcon ticker={currency.ticker} size={20} />
        ) : (
          <Icon name={currency.iconName} size="lg" />
        )}
        {currency.ticker}
        <span className={selectTokenModalClasses.rootIcon}>
          <Icon name="Chevron" size="lg" dir={rect ? 'up' : 'down'} />
        </span>
      </button>
      <Modal
        show={!!rect}
        onHide={handleHide}
        disableGutters
        size="sm"
        centered
        className={{
          dialog: selectTokenModalClasses.dialog
        }}
      >
        <ModalContent className={selectTokenModalClasses.dialogWrapper}>
          <Container
            $as="header"
            className={selectTokenModalClasses.dialogHeader}
          >
            <Text
              scale="heading"
              fontWeight="bold"
              className={selectTokenModalClasses.dialogHeaderTitle}
            >
              Select a token
            </Text>
            <Adornment $edge="end" $size="md">
              <Button
                size="xs"
                variant="ghost"
                color="default"
                aria-label="Close"
                onClick={handleHide}
              >
                <Icon name="Cross" size="lg" />
              </Button>
            </Adornment>
          </Container>
          <Container className={selectTokenModalClasses.dialogContent}>
            <SearchBar
              size="md"
              placeholder="Search name or paste address"
              onSearch={() => {}}
              onChange={handleChange}
              value={searchString}
            />
            <ul className={selectTokenModalClasses.buttonList}>
              {filteredTokens.map((token, index) => (
                <li key={token.name} tabIndex={index + 1}>
                  <Button
                    variant="outline"
                    color="default"
                    className={selectTokenModalClasses.buttonListItem}
                    onClick={() => handleSelect(token)}
                    disabled={isOnBlacklist(token)}
                  >
                    {token.iconName === 'Token' ? (
                      <TokenIcon
                        className={selectTokenModalClasses.buttonListItemIcon}
                        ticker={token.ticker}
                      />
                    ) : (
                      <Icon
                        name={token.iconName}
                        className={selectTokenModalClasses.buttonListItemIcon}
                      />
                    )}
                    <span
                      className={selectTokenModalClasses.buttonListItemTicker}
                    >
                      {token.ticker}
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          </Container>
          <Container className={selectTokenModalClasses.dialogList}>
            {!isEmpty(filteredTokens) ? (
              <>
                <VirtualizedList
                  height="100%"
                  data={filteredTokens}
                  itemContent={(_index, token) => (
                    <div
                      role="button"
                      tabIndex={0}
                      className={cn(selectTokenModalClasses.listItem, {
                        [selectTokenModalClasses.listItemDisabled]:
                          isOnBlacklist(token)
                      })}
                      onClick={() => handleSelect(token)}
                      onKeyPress={() => handleSelect(token)}
                    >
                      {token.iconName === 'Token' ? (
                        <TokenIcon
                          className={selectTokenModalClasses.listItemIcon}
                          ticker={token.ticker}
                        />
                      ) : (
                        <Icon
                          name={token.iconName}
                          className={selectTokenModalClasses.listItemIcon}
                        />
                      )}
                      <div
                        className={selectTokenModalClasses.listItemNameGroup}
                      >
                        <span className={selectTokenModalClasses.listItemName}>
                          {token.name}
                        </span>
                        <span
                          className={selectTokenModalClasses.listItemTicker}
                        >
                          {token.ticker}
                        </span>
                      </div>
                    </div>
                  )}
                  components={{
                    Footer: () =>
                      searchTokenIsOnBlacklist ? (
                        <div className={selectTokenModalClasses.listError}>
                          <p
                            className={selectTokenModalClasses.listErrorMessage}
                          >
                            {`${filteredTokens[0].ticker} is used to secure and curate the Polkamarkets Protocol. It shouldn’t be used directly in markets`}
                          </p>
                        </div>
                      ) : null
                  }}
                />
              </>
            ) : (
              <div className={selectTokenModalClasses.listEmpty}>
                <Icon
                  className={selectTokenModalClasses.listEmptyIcon}
                  name="Ban"
                />
                <p className={selectTokenModalClasses.listEmptyDescription}>
                  No token found
                </p>
              </div>
            )}
          </Container>
        </ModalContent>
      </Modal>
    </>
  );
}
