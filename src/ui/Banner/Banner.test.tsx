import { render, screen } from '@testing-library/react';

import Banner from './Banner';

test('renders roles', () => {
  render(<Banner />);

  expect(screen.getByRole('banner')).toBeInTheDocument();
  expect(
    screen.getByRole('button', {
      name: 'Close'
    })
  ).toBeInTheDocument();
});
