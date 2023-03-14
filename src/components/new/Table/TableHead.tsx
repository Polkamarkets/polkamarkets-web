import { forwardRef } from 'react';

const TableHead = forwardRef<HTMLTableSectionElement>((props, ref) => {
  return (
    <thead
      ref={ref}
      {...props}
      style={{ position: 'sticky', zIndex: 10, top: '0px' }}
    />
  );
});

TableHead.displayName = 'TableHead';

export default TableHead;
