import cn from 'classnames';
import Adornment from 'ui/Adornment';
import type { ContainerProps } from 'ui/Container';
import Container from 'ui/Container';
import { useTheme } from 'ui/useTheme';

import { Button } from 'components';
import type { ButtonProps } from 'components/Button';
import Icon from 'components/Icon';
import Text from 'components/Text';

import bannerClasses from './Banner.module.scss';

interface BannerProps
  extends Pick<ContainerProps<'div'>, 'children' | 'className'> {
  $type?: 'warning' | 'info';
  $variant?: 'subtle';
  actions?: React.ReactNode;
  onHide?: ButtonProps['onClick'];
}

const icons = {
  warning: 'Warning',
  info: 'Speaker'
} as const;

export default function Banner({
  $type,
  $variant,
  className,
  children,
  actions,
  onHide,
  ...props
}: BannerProps) {
  const theme = useTheme();

  return (
    <Container
      $as="div"
      role="banner"
      aria-busy="false"
      className={cn(
        bannerClasses.root,
        {
          [bannerClasses.typeWarning]: $type === 'warning',
          [bannerClasses.typeInfo]: $type === 'info',
          [bannerClasses.variantSubtle]: $variant === 'subtle',
          [bannerClasses.center]: !actions && theme.device.isDesktop
        },
        className
      )}
      {...props}
    >
      <span className={bannerClasses.icon}>
        {$type && <Icon size="lg" name={icons[$type]} />}
      </span>
      <div className={bannerClasses.container}>
        <Text fontWeight="medium" scale="caption">
          {children}
        </Text>
        {actions}
      </div>
      {onHide && (
        <Adornment $edge="end" $size="md" className={bannerClasses.actions}>
          <Button size="xs" variant="ghost" onClick={onHide}>
            <Icon name="Cross" />
          </Button>
        </Adornment>
      )}
    </Container>
  );
}
