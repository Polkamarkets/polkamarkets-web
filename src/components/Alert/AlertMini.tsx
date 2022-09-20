import { ReactNode, CSSProperties } from 'react';

import { CheckIcon, InfoIcon, WarningIcon } from 'assets/icons';

import Text from '../Text';

const variants = {
  default: { icon: <InfoIcon /> },
  information: { icon: <InfoIcon /> },
  success: { icon: <CheckIcon /> },
  warning: { icon: <WarningIcon /> },
  error: { icon: <InfoIcon /> }
};

export type AlertMiniVariant =
  | 'default'
  | 'information'
  | 'success'
  | 'warning'
  | 'error';

export type AlertMiniStyle = 'subtle' | 'outline';

type AlertMiniProps = {
  /**
   * Variant of Alert styles
   * @default 'default'
   */
  variant: AlertMiniVariant;
  /**
   * Alert style
   * @default 'subtle'
   */
  styles?: AlertMiniStyle;
  /**
   * Aditional CSS styles
   */
  style?: CSSProperties;
  /**
   * Additional content of Alert
   */
  description: ReactNode;
};

/**
 *
 * Alert show messages to users
 */
function AlertMini({
  variant = 'default',
  styles = 'subtle',
  style,
  description
}: AlertMiniProps) {
  return (
    <div
      style={style}
      className={`pm-c-alert-mini-${styles}--${variant}`}
      role="alert"
    >
      {variants[variant].icon}
      <Text
        as="p"
        scale="tiny"
        fontWeight="semibold"
        className="pm-c-alert-mini__description"
      >
        {description}
      </Text>
    </div>
  );
}

export default AlertMini;
