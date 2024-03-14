import cn from 'classnames';
import { useRect, useTheme } from 'ui';

import { Modal } from 'components';
import type { ModalProps } from 'components';

import popoverClasses from './Popover.module.scss';

const positionBlock = ['top', 'bottom'] as const;
const positionInline = ['Right', 'Left'] as const;

type PositionBlock = (typeof positionBlock)[number];
type PositionInline = (typeof positionInline)[number];
export interface PopoverProps<E extends HTMLElement>
  extends Omit<
    ModalProps,
    | 'show'
    | 'disableGutters'
    | 'disableOverlay'
    | 'fullWidth'
    | 'initial'
    | 'animate'
    | 'exit'
  > {
  show: E | null;
  position: `${PositionBlock}${PositionInline}`;
  disableMobileSheet?: boolean;
}

function getPopoverStyle<E extends HTMLElement>(
  position: PopoverProps<E>['position'],
  element: E | null
): React.CSSProperties {
  const rect = element?.getBoundingClientRect();

  if (!rect) {
    return {
      left: 0,
      top: 0,
      width: 0
    };
  }

  const positions = [...positionInline, ...positionBlock].reduce(
    (pre, cur) => ({
      ...pre,
      [cur]: position.includes(cur)
    }),
    {} as Record<PositionBlock | PositionInline, boolean>
  );
  const positionY = positions.bottom ? 'top' : 'bottom';
  const positionX = positions.Right ? 'right' : 'left';
  const windowWidth = window.innerWidth;
  const rectTop = Math.round(rect.top);

  return {
    [positionX]: {
      left: Math.round(rect.left),
      right: Math.abs(Math.round(rect.right) - windowWidth)
    }[positionX],
    [positionY]: {
      top: rectTop + rect.height,
      bottom: windowWidth - rectTop
    }[positionY],
    width: rect.width
  };
}
function getPopoverMotion(bottom: number | string) {
  return {
    initial: {
      bottom
    },
    animate: {
      bottom: 0
    },
    exit: {
      bottom
    }
  };
}

export default function Popover<E extends HTMLElement>({
  className,
  show,
  position,
  disableMobileSheet,
  ...outProps
}: PopoverProps<E>) {
  const [ref, rect] = useRect();
  const theme = useTheme();
  const props = {
    // TODO: Node on first mount doesn't animate because it's not on DOM tree yet
    ...(theme.device.isDesktop ? {} : getPopoverMotion(-rect.height)),
    ...outProps
  };
  const style = {
    ...(theme.device.isDesktop ? getPopoverStyle(position, show) : {}),
    ...outProps.style
  };

  return (
    <Modal
      ref={ref}
      disableGutters
      show={!!show}
      disableOverlay={disableMobileSheet ? undefined : theme.device.isDesktop}
      fullWidth={disableMobileSheet ? undefined : !theme.device.isDesktop}
      style={style}
      className={{
        dialog: cn(
          popoverClasses.dialog,
          {
            [popoverClasses.dialogSheet]: !disableMobileSheet
          },
          className?.dialog
        ),
        ...className
      }}
      {...props}
    />
  );
}
