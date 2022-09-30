import { render, screen } from '@testing-library/react';
import cn from 'classnames';
import { renderClassName } from 'helpers/test';

import ModalSectionText from './ModalSectionText';
import ModalSectionTextStyles from './ModalSectionText.module.scss';

describe('ModalSectionText', () => {
  it('renders its children', () => {
    render(<ModalSectionText>text</ModalSectionText>);

    expect(screen.getByText('text')).toBeInTheDocument();
  });
  it('accepts extra [className]', () => {
    const className = renderClassName({
      withClassName: ModalSectionTextStyles.root
    });

    render(
      <ModalSectionText className={className.input}>header</ModalSectionText>
    );

    expect(screen.getByText('header')).toHaveClass(className.expected);
  });
  it('accepts extra props', () => {
    render(<ModalSectionText id="text">text</ModalSectionText>);

    expect(screen.getByText('text')).toHaveAttribute('id', 'text');
  });
});
