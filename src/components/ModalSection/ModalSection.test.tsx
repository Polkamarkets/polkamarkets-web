import { render, screen } from '@testing-library/react';
import { renderClassName } from 'helpers/test';

import ModalSection from './ModalSection';
import ModalSectionStyles from './ModalSection.module.scss';

describe('ModalSection', () => {
  it('renders its children', () => {
    render(
      <ModalSection>
        <div>test</div>
      </ModalSection>
    );

    expect(screen.getByText('test')).toBeInTheDocument();
  });
  it('accepts extra [className]', () => {
    const className = renderClassName({
      withClassName: ModalSectionStyles.root
    });

    render(<ModalSection className={className.input}>footer</ModalSection>);

    expect(screen.getByText('footer')).toHaveClass(className.expected);
  });
  it('accepts extra props', () => {
    render(<ModalSection data-testid="footer" />);

    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
