import { SVGProps, memo } from 'react';

import { useTheme } from 'hooks';

function RankDownIcon(props: SVGProps<SVGSVGElement>) {
  const { theme } = useTheme();

  const backgroundColor = theme === 'dark' ? '#FFFFFF' : '#000000';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      {...props}
    >
      <rect
        width="20"
        height="20"
        y="0"
        fill={backgroundColor}
        fillOpacity="0.1"
        rx="10"
      />
      <g clipPath="url(#clip0_2442_57798)">
        <path
          fill="#EF4E4E"
          d="M10 14.75c.204 0 .396-.1.512-.267l4.375-6.25a.625.625 0 00-.512-.983h-8.75a.624.624 0 00-.512.983l4.375 6.25a.622.622 0 00.511.267h.002c-.001 0-.001 0 0 0z"
        />
      </g>
    </svg>
  );
}

export default memo(RankDownIcon);
