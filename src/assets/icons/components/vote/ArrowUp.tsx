import { SVGProps, memo } from 'react';

function ArrowUp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="15"
      fill="none"
      viewBox="0 0 12 15"
      {...props}
    >
      <path d="M.138 6.362l1.225 1.226 3.762-3.763V14.5h1.75V3.825l3.762 3.763 1.226-1.226L6 .5.138 6.362z" />
    </svg>
  );
}

export default memo(ArrowUp);
