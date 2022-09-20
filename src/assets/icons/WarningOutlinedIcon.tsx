import React from 'react';

function WarningOutlinedIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      style={{ verticalAlign: 'middle' }}
    >
      <path d="M7 2H9V11H7V2Z" />
      <path d="M9 13C9 13.5523 8.55228 14 8 14C7.44772 14 7 13.5523 7 13C7 12.4477 7.44772 12 8 12C8.55228 12 9 12.4477 9 13Z" />
    </svg>
  );
}

export default React.memo(WarningOutlinedIcon);
