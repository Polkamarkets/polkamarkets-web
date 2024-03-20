import { ReactNode } from 'react';

import cn from 'classnames';
import * as Tooltip from 'ui/Tooltip/Tooltip';

import { Icon } from 'components';

import styles from './Card.module.scss';

export type CardProps = {
  title: string;
  tooltip?: ReactNode;
  className?: string;
};
export const Card: React.FC<CardProps> = ({
  title,
  children,
  tooltip,
  className
}) => (
  <div className={cn(styles.root, className)}>
    <div className={styles.title}>
      {title}{' '}
      {tooltip && (
        <Tooltip.Provider>
          <Tooltip.Root delayDuration={200}>
            <Tooltip.Trigger asChild>
              <span>
                <Icon name="Info" size="md" color="#768393" />
              </span>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content side="right" sideOffset={4}>
                {tooltip}
                <Tooltip.Arrow />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      )}
    </div>
    {children}
  </div>
);
export default Card;
