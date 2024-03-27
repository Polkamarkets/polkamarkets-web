import { memo } from 'react';

function ForelandMobileLogo() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M25 10L5 30V10H25Z" fill="#FCFCFD" />
      <path d="M25 10H35V20H25V10Z" fill="#FCFCFD" />
    </svg>
  );
}

export default memo(ForelandMobileLogo);
