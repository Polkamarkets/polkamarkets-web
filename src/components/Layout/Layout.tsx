import { Container } from 'ui';

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
        <Container className="pm-l-layout__main">
          {children}
          <footer className="pm-l-layout__footer">
            <Footer />
          </footer>
        </Container>
      </ScrollableArea>
      <RightSidebar />
      <div id="toast-notification-portal" />
    </div>
  );
}
