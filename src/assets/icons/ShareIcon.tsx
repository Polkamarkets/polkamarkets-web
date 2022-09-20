import { SVGProps, memo } from 'react';

function ShareIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M11.25 0H5.99998V1.5H9.44998L4.72498 6.225L5.77498 7.275L10.5 2.55V6H12V0.75C12 0.3 11.7 0 11.25 0Z" />
      <path d="M10.5 12H0.75C0.3 12 0 11.7 0 11.25V1.5C0 1.05 0.3 0.75 0.75 0.75H3.75V2.25H1.5V10.5H9.75V8.25H11.25V11.25C11.25 11.7 10.95 12 10.5 12Z" />
    </svg>
  );
}

export default memo(ShareIcon);
