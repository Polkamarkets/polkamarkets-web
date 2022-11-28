import ScrollableArea from 'components/ScrollableArea';

import { useAppSelector } from 'hooks';

import LiquidityForm from '../LiquidityForm';
import ReportForm from '../ReportForm';
import TradeForm from '../TradeForm';

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
      <ScrollableArea>
        <aside className="pm-l-layout__aside">
          <div className="pm-l-right-sidebar">
            <TradeForm />
          </div>
        </aside>
      </ScrollableArea>
    );

  if (liquidityFormIsVisible)
    return (
      <ScrollableArea>
        <aside className="pm-l-layout__aside">
          <div className="pm-l-right-sidebar">
            <LiquidityForm />
          </div>
        </aside>
      </ScrollableArea>
    );

  if (reportFormIsVisible)
    return (
      <ScrollableArea>
        <aside className="pm-l-layout__aside">
          <div className="pm-l-right-sidebar">
            <ReportForm />
          </div>
        </aside>
      </ScrollableArea>
    );

  return null;
}

export default RightSidebar;
