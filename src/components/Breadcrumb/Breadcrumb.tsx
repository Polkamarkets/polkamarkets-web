function Item({
  children,
  className
}: React.PickFrom<'span', 'children' | 'className'>) {
  return (
    <>
      <span className="breadcrumb__separator">/</span>
      <span className={`breadcrumb__item ${className}`}>{children}</span>
    </>
  );
}

/**
 * A breadcrumb displays the current location within a hierarchy
 */
function Breadcrumb({
  children,
  className
}: React.PickFrom<'div', 'children' | 'className'>) {
  return <div className={`breadcrumb ${className}`}>{children}</div>;
}

Breadcrumb.Item = Item;

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
