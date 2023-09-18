import { forwardRef } from 'react';

import type { ImageProps } from 'ui/Image';
import Image from 'ui/Image';

import avatarClasses from './Avatar.module.scss';

export type AvatarProps = ImageProps;

const Avatar = forwardRef<HTMLImageElement, AvatarProps>(function Avatar(
  { alt, ...props },
  ref
) {
  return (
    <Image ref={ref} {...props}>
      <strong className={avatarClasses.alt}>
        {alt?.toUpperCase().match(/\w/)}
      </strong>
    </Image>
  );
});

export default Avatar;
