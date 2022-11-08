import type React from 'react';

import * as Svgs from './__svgs__';
import { dirs, sizes } from './Icon.util';

export interface IconProps extends React.ComponentPropsWithRef<'svg'> {
  dir?: typeof dirs[number];
  name: keyof typeof Svgs;
  size?: typeof sizes[number];
  title?: string;
}
