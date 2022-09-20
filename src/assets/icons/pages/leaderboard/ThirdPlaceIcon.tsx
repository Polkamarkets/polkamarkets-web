import { SVGProps, memo } from 'react';

import { useTheme } from 'hooks';

function ThirdPlaceIcon(props: SVGProps<SVGSVGElement>) {
  const { theme } = useTheme();

  const backgroundColor = theme === 'dark' ? '#3B4760' : '#C3CCDA';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <mask
        id="mask0_2445_47023"
        style={{ maskType: 'alpha' }}
        width="16"
        height="17"
        x="0"
        y="0"
        maskUnits="userSpaceOnUse"
      >
        <path
          fill="#F7C948"
          d="M15.045 12.825l-6.933-3.2a.265.265 0 00-.224 0l-6.933 3.2a.267.267 0 00-.155.242V15.2c0 .441.359.8.8.8h12.8c.441 0 .8-.359.8-.8v-2.133a.267.267 0 00-.155-.242zm0-4.8l-6.933-3.2a.265.265 0 00-.224 0l-6.933 3.2a.267.267 0 00-.155.242v2.667a.267.267 0 00.378.242L8 8.027l6.82 3.149a.27.27 0 00.257-.018.267.267 0 00.123-.224V8.267a.267.267 0 00-.155-.242zm0-4.8L8.112.025a.265.265 0 00-.224 0l-6.933 3.2a.267.267 0 00-.155.242v2.667a.267.267 0 00.378.242L8 3.227l6.82 3.149a.271.271 0 00.257-.018.268.268 0 00.123-.224V3.467a.267.267 0 00-.155-.242z"
        />
      </mask>
      <g mask="url(#mask0_2445_47023)">
        <path fill={backgroundColor} d="M-11 -1H25V17H-11z" />
        <path fill="#28C1B8" d="M-9.5 16.5L8 9l17 8h-36l1.5-.5z" />
      </g>
    </svg>
  );
}

export default memo(ThirdPlaceIcon);
