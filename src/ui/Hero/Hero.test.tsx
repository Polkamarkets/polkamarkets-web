import { render, screen } from '@testing-library/react';

import Hero from './Hero';

test('renders label', () => {
  render(
    <Hero href="https://app.polkamarkets.com" aria-label="Go to webpage" />
  );

  expect(screen.getByLabelText('Go to webpage')).toBeInTheDocument();
});
