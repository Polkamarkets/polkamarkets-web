import { SVGProps, memo } from 'react';

function ArrowUpSmallestIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="12"
      height="13"
      viewBox="0 0 12 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0.974991 5.525L2.02499 6.575L5.24999 3.35V12.5H6.74999V3.35L9.97499 6.575L11.025 5.525L5.99999 0.5L0.974991 5.525Z" />
    </svg>
  );
}

export default memo(ArrowUpSmallestIcon);
