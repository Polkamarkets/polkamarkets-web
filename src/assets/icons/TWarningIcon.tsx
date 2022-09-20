import React, { memo } from 'react';

type Props = React.ComponentPropsWithoutRef<'svg'> & { size?: string | number };

function TWarningIcon({ size = 12, ...props }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 12 12"
      style={{
        verticalAlign: 'middle',
        fill: 'currentColor'
      }}
      {...props}
    >
      <path d="M11.412 10.1468L6.66148 1.24051C6.37948 0.711009 5.62047 0.711009 5.33772 1.24051L0.587975 10.1468C0.321725 10.6463 0.683975 11.25 1.25023 11.25H10.7505C11.316 11.25 11.6782 10.6463 11.412 10.1468ZM5.99997 9.75001C5.58597 9.75001 5.24997 9.41401 5.24997 9.00001C5.24997 8.58601 5.58597 8.25001 5.99997 8.25001C6.41397 8.25001 6.74998 8.58601 6.74998 9.00001C6.74998 9.41401 6.41397 9.75001 5.99997 9.75001ZM6.74998 7.50001H5.24997V4.50001H6.74998V7.50001Z" />
    </svg>
  );
}

export default memo(TWarningIcon);
