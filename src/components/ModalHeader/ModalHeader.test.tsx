import { render, screen } from '@testing-library/react';
import { renderClassName } from 'helpers/test';

import ModalHeader from './ModalHeader';
import ModalHeaderStyles from './ModalHeader.module.scss';

describe('ModalHeader', () => {
  it('renders its children', () => {
    render(
      <ModalHeader>
        <h1>heading</h1>
      </ModalHeader>
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'heading'
      })
    ).toBeInTheDocument();
  });
  it('accepts extra [className]', () => {
    const className = renderClassName({
      withClassName: ModalHeaderStyles.root
    });

    render(<ModalHeader className={className.input}>header</ModalHeader>);

    expect(screen.getByText('header')).toHaveClass(className.expected);
  });
  it('accepts extra props', () => {
    render(<ModalHeader data-testid="header" />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
  });
});
