import type { Market } from 'models/market';
import { Image } from 'ui';
import type { ImageProps } from 'ui';

import { VerifiedIcon } from 'assets/icons';

import Logos from 'components/Logos';

import marketAvatarClasses from './MarketAvatar.module.scss';

type MarketAvatarProps = Pick<Market, 'imageUrl' | 'verified'> &
  Pick<ImageProps, '$size'>;

export default function MarketAvatar({
  imageUrl,
  $size,
  verified
}: MarketAvatarProps) {
  return (
    <div className={marketAvatarClasses.root}>
      <Image $radius="lg" alt="Market" $size={$size} src={imageUrl}>
        <Logos size="md" standard="mono" />
      </Image>
      {verified && (
        <div className={marketAvatarClasses.verified}>
          <VerifiedIcon size="sm" />
        </div>
      )}
    </div>
  );
}
