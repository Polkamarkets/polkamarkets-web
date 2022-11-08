import { SVGProps, memo } from 'react';

function ArrowDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="15"
      fill="none"
      viewBox="0 0 12 15"
      {...props}
    >
      <path d="M11.863 8.637l-1.226-1.225-3.762 3.763V.5h-1.75v10.675L1.362 7.412.137 8.637 6 14.5l5.863-5.863z" />
    </svg>
  );
}

export default memo(ArrowDown);
