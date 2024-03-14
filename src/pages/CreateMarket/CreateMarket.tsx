import { Container } from 'ui';

import { CreateMarketForm } from 'components';

import CreateMarketClasses from './CreateMarket.module.scss';

function CreateMarket() {
  return (
    <Container $size="sm" className={CreateMarketClasses.root}>
      <div className={CreateMarketClasses.header}>
        <h2 className={CreateMarketClasses.heading}>Create Your Question</h2>
        <h3 className={CreateMarketClasses.subheading}>
          Set up a new question providing the necessary details and funding
          information. Follow the step-by-step process to create a question
          that&apos;s engaging and easy to participate in for users.
        </h3>
      </div>
      <CreateMarketForm />
    </Container>
  );
}

export default CreateMarket;
