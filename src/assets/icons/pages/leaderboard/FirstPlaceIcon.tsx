import { SVGProps, memo } from 'react';

function FirstPlaceIcon(props: SVGProps<SVGSVGElement>) {
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
        id="mask0_2445_47029"
        style={{ maskType: 'alpha' }}
        width="16"
        height="17"
        x="0"
        y="0"
        maskUnits="userSpaceOnUse"
      >
        <path
          fill="#F7C948"
          d="M15.045 12.825l-6.933-3.2a.265.265 0 00-.224 0l-6.933 3.2a.267.267 0 00-.155.242v2.134c0 .44.359.8.8.8h12.8c.441 0 .8-.36.8-.8v-2.134a.267.267 0 00-.155-.242zm0-4.8l-6.933-3.2a.265.265 0 00-.224 0l-6.933 3.2a.267.267 0 00-.155.242v2.667a.267.267 0 00.378.242L8 8.028l6.82 3.148a.27.27 0 00.257-.017.267.267 0 00.123-.225V8.267a.267.267 0 00-.155-.242zm0-4.8L8.112.025a.265.265 0 00-.224 0l-6.933 3.2a.267.267 0 00-.155.242v2.667a.267.267 0 00.378.242L8 3.228l6.82 3.148a.271.271 0 00.257-.017.268.268 0 00.123-.225V3.467a.267.267 0 00-.155-.242z"
        />
      </mask>
      <g mask="url(#mask0_2445_47029)">
        <path fill="#3B4760" d="M-11 -0.999H25V17.001H-11z" />
        <path fill="#F0B429" d="M-9.5 11.5L8-4l20 18-20 8-17.5-10.5z" />
      </g>
    </svg>
  );
}

export default memo(FirstPlaceIcon);
