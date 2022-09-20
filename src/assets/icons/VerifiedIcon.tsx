import { SVGProps, memo } from 'react';

type VerifiedIconProps = {
  size?: 'sm' | 'normal';
};

function VerifiedIcon(props: SVGProps<SVGSVGElement> & VerifiedIconProps) {
  const { size = 'normal' } = props;

  if (size === 'sm') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="19"
        fill="none"
        viewBox="0 0 18 19"
        {...props}
      >
        <rect width="12" height="12" x="3" y="3.5" fill="#fff" rx="6" />
        <path
          fill="#7069FA"
          d="M9 3.5c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm-.75 8.55L5.7 9.5l1.05-1.05 1.5 1.5 3-3L12.3 8l-4.05 4.05z"
        />
        <rect
          width="15"
          height="15"
          x="1.5"
          y="2"
          stroke="#7069FA"
          strokeOpacity="0.4"
          strokeWidth="3"
          rx="7.5"
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" fill="#fff" rx="9" />
      <path
        fill="#7069FA"
        d="M12 3c-4.95 0-9 4.05-9 9s4.05 9 9 9 9-4.05 9-9-4.05-9-9-9zm-1.125 12.825L7.05 12l1.575-1.575 2.25 2.25 4.5-4.5L16.95 9.75l-6.075 6.075z"
      />
      <rect
        width="21"
        height="21"
        x="1.5"
        y="1.5"
        stroke="#7069FA"
        strokeOpacity="0.4"
        strokeWidth="3"
        rx="10.5"
      />
    </svg>
  );
}

export default memo(VerifiedIcon);
