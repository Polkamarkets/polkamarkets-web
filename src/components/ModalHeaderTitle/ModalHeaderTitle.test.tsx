import { render, screen } from '@testing-library/react';
import { renderClassName } from 'helpers/test';

import ModalHeaderTitle from './ModalHeaderTitle';
import ModalHeaderTitleStyles from './ModalHeaderTitle.module.scss';

describe('ModalHeaderTitle', () => {
  it('renders its children', () => {
    render(<ModalHeaderTitle>text</ModalHeaderTitle>);

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'text'
      })
    ).toBeInTheDocument();
  });
  it('accepts extra [className]', () => {
    const className = renderClassName({
      withClassName: ModalHeaderTitleStyles.root
    });

    render(
      <ModalHeaderTitle className={className.input}>header</ModalHeaderTitle>
    );

    expect(screen.getByText('header')).toHaveClass(className.expected);
  });
  it('accepts extra props', () => {
    render(<ModalHeaderTitle id="title">title</ModalHeaderTitle>);

    expect(screen.getByText('title')).toHaveAttribute('id', 'title');
  });
});
