import { SVGProps, memo } from 'react';

function ArrowDownSmallestIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="12"
      height="13"
      viewBox="0 0 12 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M11.025 7.475L9.97499 6.425L6.74999 9.65V0.5H5.24999V9.65L2.02499 6.425L0.974991 7.475L5.99999 12.5L11.025 7.475Z" />
    </svg>
  );
}

export default memo(ArrowDownSmallestIcon);
