'use client';

import * as React from 'react';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import cn from 'classnames';

import styles from './Tooltip.module.scss';

const { Provider, Root, Trigger, Portal } = TooltipPrimitive;

const Content = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(styles.tooltipContent, className)}
    {...props}
  />
));
Content.displayName = TooltipPrimitive.Content.displayName;

const Arrow = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Arrow
    ref={ref}
    className={cn(styles.tooltipArrow, className)}
    {...props}
  />
));
Arrow.displayName = TooltipPrimitive.Content.displayName;

export { Root, Trigger, Content, Provider, Arrow, Portal };
