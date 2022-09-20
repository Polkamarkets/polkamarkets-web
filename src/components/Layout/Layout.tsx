import { ReactNode } from 'react';

import cn from 'classnames';

import useAlertNotification from 'hooks/useAlertNotification';

import BetaWarning from '../BetaWarning';
import Footer from '../Footer';
import NavBar from '../NavBar';
import RightSidebar from '../RightSidebar';
import ScrollableArea from '../ScrollableArea';
import Sidebar from '../Sidebar';

type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  const { alertList } = useAlertNotification();
  const hasAlertNotification = alertList.size > 0;

  return (
    <>
      <BetaWarning />
      <div className="pm-l-layout">
        <header className="pm-l-layout__header sticky">
          <div id="alert-notification-portal" className="pm-l-layout__alert" />
          <NavBar />
        </header>
        <nav className="pm-l-layout__nav">
          <Sidebar />
        </nav>
        <ScrollableArea
          className={cn({
            'pm-l-layout__scrollable-area--with-alert': hasAlertNotification,
            'pm-l-layout__scrollable-area': !hasAlertNotification
          })}
        >
          <main className="pm-l-layout__main">
            {children}
            <footer className="pm-l-layout__footer">
              <Footer />
            </footer>
          </main>
        </ScrollableArea>
        <ScrollableArea>
          <aside className="pm-l-layout__aside">
            <RightSidebar hasAlertNotification={hasAlertNotification} />
          </aside>
        </ScrollableArea>
        <div id="toast-notification-portal" />
      </div>
    </>
  );
}

export default Layout;
