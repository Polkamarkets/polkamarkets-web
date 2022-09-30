import { render, screen } from '@testing-library/react';
import { renderClassName } from 'helpers/test';

import ModalFooter from './ModalFooter';
import ModalFooterStyles from './ModalFooter.module.scss';

describe('ModalFooter', () => {
  it('renders its children', () => {
    render(
      <ModalFooter>
        <div>test</div>
      </ModalFooter>
    );

    expect(screen.getByText('test')).toBeInTheDocument();
  });
  it('accepts extra [className]', () => {
    const className = renderClassName({
      withClassName: ModalFooterStyles.root
    });

    render(<ModalFooter className={className.input}>footer</ModalFooter>);

    expect(screen.getByText('footer')).toHaveClass(className.expected);
  });
  it('accepts extra props', () => {
    render(<ModalFooter data-testid="footer" />);

    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
