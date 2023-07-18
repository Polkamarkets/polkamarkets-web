import * as React from 'react';

declare module 'react' {
  export type PickFrom<
    E extends keyof JSX.IntrinsicElements,
    P extends keyof React.ComponentPropsWithoutRef<E>
  > = Pick<React.ComponentPropsWithoutRef<E>, P>;
}
