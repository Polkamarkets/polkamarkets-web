import { Container } from 'ui';

import { useMarketForms } from 'hooks';

import rightSidebarClasses from './RightSidebar.module.scss';

const forms = {};

export default function RightSidebar() {
  const form = useMarketForms();
  return (
    <Container $enableGutters className={rightSidebarClasses.root}>
      {forms[form]}
    </Container>
  );
}
