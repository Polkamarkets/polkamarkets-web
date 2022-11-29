import ScrollableArea from 'components/ScrollableArea';

import { useAppSelector } from 'hooks';

import LiquidityForm from '../LiquidityForm';
import ReportForm from '../ReportForm';
import TradeForm from '../TradeForm';

function RightSidebarWrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <ScrollableArea>
      <aside className="pm-l-layout__aside">
        <div className="pm-l-right-sidebar">{children}</div>
      </aside>
    </ScrollableArea>
  );
}
function RightSidebar() {
  const rightSidebarIsVisible = useAppSelector(
    state => state.ui.rightSidebar.visible
  );
  const tradeFormIsVisible = useAppSelector(
    state => state.ui.tradeForm.visible
  );
  const liquidityFormIsVisible = useAppSelector(
    state => state.ui.liquidityForm.visible
  );
  const reportFormIsVisible = useAppSelector(
    state => state.ui.reportForm.visible
  );

  if (!rightSidebarIsVisible) return null;

  if (tradeFormIsVisible)
    return (
      <RightSidebarWrapper>
        <TradeForm />
      </RightSidebarWrapper>
    );

  if (liquidityFormIsVisible)
    return (
      <RightSidebarWrapper>
        <LiquidityForm />
      </RightSidebarWrapper>
    );

  if (reportFormIsVisible)
    return (
      <RightSidebarWrapper>
        <ReportForm />
      </RightSidebarWrapper>
    );

  return null;
}

export default RightSidebar;
