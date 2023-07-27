import { Fragment, useCallback, useState } from 'react';

import cn from 'classnames';
import { Adornment, List, ListItem, Popover, useTheme } from 'ui';
import Button from 'ui/Button';
import type { ButtonProps } from 'ui/Button';

import Icon from 'components/Icon';
import Text from 'components/Text';

import { useNetworks } from 'contexts/networks';

import networSelectorClasses from './NetworkSelector.module.scss';

interface NetworkSelectorProps extends ButtonProps {
  responsive?: boolean;
}

export default function NetworkSelector({
  responsive,
  className,
  ...props
}: NetworkSelectorProps) {
  const theme = useTheme();
  const networks = useNetworks();
  const [show, setShow] = useState<HTMLButtonElement | null>(null);
  const handleShow = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) =>
      setShow(event.currentTarget),
    []
  );
  const handleHide = useCallback(() => setShow(null), []);
  const handleNetworkClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const [network] = networks.networks.filter(
        ({ name }) => name === event.currentTarget.name
      );

      networks.changeToNetwork(network);
      handleHide();
    },
    [handleHide, networks]
  );
  const isDesktop = !responsive || theme.device.isDesktop;
  const isTv = !responsive || theme.device.isTv;

  return (
    <>
      <Button
        $size="md"
        $color="text"
        $variant="outline"
        aria-label="Switch network"
        onClick={handleShow}
        className={cn(networSelectorClasses.root, className)}
        {...props}
      >
        {props.$color !== 'warn' && (
          <Icon name={networks.network.currency.iconName} size="lg" />
        )}
        {isDesktop && (
          <>
            {isTv &&
              (props.$color === 'warn' ? 'Change' : networks.network.name)}
            <Adornment $edge="end" $size={props.$size}>
              <Icon name="Chevron" size="lg" dir={show ? 'up' : 'down'} />
            </Adornment>
          </>
        )}
      </Button>
      <Popover position="bottomLeft" onHide={handleHide} show={show}>
        {!theme.device.isDesktop && (
          <header className={networSelectorClasses.header}>
            <Text
              scale="heading"
              fontWeight="bold"
              className={networSelectorClasses.headerTitle}
            >
              Select Network
            </Text>
            <Adornment $edge="end" $size="md">
              <Button
                $variant="text"
                $color="text"
                aria-label="Hide"
                onClick={handleHide}
              >
                <Icon name="Cross" size="lg" />
              </Button>
            </Adornment>
          </header>
        )}
        <List className={networSelectorClasses.list}>
          {networks.networks.map(network => (
            <Fragment key={network.id}>
              <ListItem
                ButtonProps={{
                  name: network.name,
                  className: networSelectorClasses.listItem,
                  onClick: handleNetworkClick
                }}
                $actived={network.id === networks.network.id}
              >
                <Adornment
                  $edge="start"
                  $size={theme.device.isDesktop ? 'sm' : 'md'}
                >
                  <Icon
                    name={network.currency.iconName}
                    size={theme.device.isDesktop ? 'lg' : 'xl'}
                  />
                </Adornment>
                <Text
                  scale={theme.device.isDesktop ? 'caption' : 'body'}
                  fontWeight="semibold"
                >
                  {network.name}
                </Text>
              </ListItem>
            </Fragment>
          ))}
        </List>
      </Popover>
    </>
  );
}
