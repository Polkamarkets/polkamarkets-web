import { Container } from 'ui';

import BetaWarning from '../BetaWarning';
import Footer from '../Footer';
import NavBar from '../NavBar';
import RightSidebar from '../RightSidebar';

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <>
      <NavBar />
      <Container as="main" className="pm-l-layout__main">
        {children}
        <footer className="pm-l-layout__footer">
          <Footer />
        </footer>
      </Container>
      <RightSidebar />
      <BetaWarning />
      <div id="toast-notification-portal" />
    </>
  );
}
