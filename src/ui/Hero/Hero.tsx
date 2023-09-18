import type React from 'react';
import { createElement, forwardRef } from 'react';

import cn from 'classnames';

import HeroClasses from './Hero.module.scss';

type HeroProps = {
  $image?: React.CSSProperties['backgroundImage'];
  $rounded?: boolean;
  $backdrop?: 'main' | (string & {});
} & (
  | ({ $as?: 'div' } & Pick<
      React.ComponentPropsWithRef<'div'>,
      'className' | 'children'
    >)
  | ({
      $as?: 'a';
    } & Pick<
      React.ComponentPropsWithRef<'a'>,
      'className' | 'children' | 'target' | 'href' | 'rel' | 'aria-label'
    >)
);

function isMain(params: HeroProps['$backdrop']): params is 'main' {
  return params === 'main';
}

export default forwardRef(function Hero(
  { $image, $rounded, $backdrop, $as, className, ...props }: HeroProps,
  ref: React.Ref<Element>
) {
  return createElement($as || 'div', {
    ref,
    className: cn(
      HeroClasses.root,
      {
        [HeroClasses.rounded]: $rounded,
        [HeroClasses.backdropMain]: isMain($backdrop),
        [HeroClasses.backdropCustom]: !isMain($backdrop)
      },
      className
    ),
    style: {
      '--hero-image': `url('${$image}')`,
      ...(!isMain($backdrop) && {
        '--hero-backdrop-color': $backdrop
      })
    },
    ...props
  });
});
