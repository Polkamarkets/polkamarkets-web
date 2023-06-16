import { SVGProps, memo } from 'react';

function MyPlaceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 18 18"
      {...props}
    >
      <path
        fill="#5D55FA"
        d="M9 0C4.038 0 0 4.038 0 9c0 4.963 4.038 9 9 9s9-4.037 9-9c0-4.962-4.038-9-9-9zm0 2.483a2.485 2.485 0 012.483 2.483A2.485 2.485 0 019 7.449a2.485 2.485 0 01-2.483-2.483A2.485 2.485 0 019 2.483zm4.655 11.793h-9.31a.31.31 0 01-.31-.31c0-2.91 2.227-5.276 4.965-5.276s4.966 2.367 4.966 5.276a.31.31 0 01-.31.31z"
      />
    </svg>
  );
}

export default memo(MyPlaceIcon);
