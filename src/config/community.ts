import { ui } from 'config';
import isUndefined from 'lodash/isUndefined';

import { IconProps } from 'components';

const { communityUrls } = ui.layout.header;

export type Community = { name: IconProps['name']; href: string | undefined }[];

const community = [
  {
    name: 'Twitter',
    href: communityUrls.twitter
  },
  {
    name: 'Medium',
    href: communityUrls.medium
  },
  {
    name: 'Telegram',
    href: communityUrls.telegram
  },
  {
    name: 'Youtube',
    href: communityUrls.youtube
  },
  {
    name: 'LinkedIn',
    href: communityUrls.linkedin
  },
  {
    name: 'GitHub',
    href: communityUrls.github
  }
].filter(({ href }) => !isUndefined(href)) as Community;

export default community;
