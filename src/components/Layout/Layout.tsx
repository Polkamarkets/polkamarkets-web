import type React from 'react';

import BetaWarning from '../BetaWarning';
import Footer from '../Footer';
import NavBar from '../NavBar';
import RightSidebar from '../RightSidebar';
import ScrollableArea from '../ScrollableArea';

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="pm-l-layout">
      <BetaWarning />
      <NavBar />
      <ScrollableArea className="pm-l-layout__scrollable-area">
        <main className="pm-l-layout__main">
          {children}
          <footer className="pm-l-layout__footer">
            <Footer />
          </footer>
        </main>
      </ScrollableArea>
      <ScrollableArea>
        <aside className="pm-l-layout__aside">
          <RightSidebar />
        </aside>
      </ScrollableArea>
      <div id="toast-notification-portal" />
    </div>
  );
}
