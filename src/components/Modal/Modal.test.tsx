import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import cn from 'classnames';
import { renderClassName } from 'helpers/test';

import ModalFooter from 'components/ModalFooter';
import ModalHeader from 'components/ModalHeader';
import ModalHeaderTitle from 'components/ModalHeaderTitle';
import ModalSection from 'components/ModalSection';
import ModalSectionText from 'components/ModalSectionText';

import Modal from './Modal';
import ModalStyles from './Modal.module.scss';
import { modalTrappersId } from './Modal.util';

const defaultProps = {
  show: true,
  onHide: jest.fn(),
  'aria-labelledby': 'test-modal-name',
  'aria-describedby': 'test-modal-description',
  id: 'modal-id'
};

function renderModal() {
  const className = renderClassName({
    withClassName: ModalStyles.dialog
  });
  const result = render(
    <Modal
      className={{
        dialog: cn(className.input)
      }}
      {...defaultProps}
    >
      <ModalHeader>
        <ModalHeaderTitle id={defaultProps['aria-labelledby']}>
          {defaultProps['aria-labelledby']}
        </ModalHeaderTitle>
      </ModalHeader>
      <ModalSection>
        <ModalSectionText id={defaultProps['aria-describedby']}>
          {defaultProps['aria-describedby']}
        </ModalSectionText>
      </ModalSection>
      <ModalFooter>
        <button type="button">action</button>
      </ModalFooter>
    </Modal>
  );
  const elements = {
    root: screen.getByRole('presentation'),
    dialog: screen.getByRole('dialog', {
      name: defaultProps['aria-labelledby']
    }),
    hide: screen.getByRole('button', {
      name: 'Hide'
    }),
    title: screen.getByRole('heading', {
      level: 2,
      name: defaultProps['aria-labelledby']
    })
  };

  return {
    elements,
    className,
    ...result
  };
}

describe('Modal', () => {
  it("doesn't render if [show=false]", () => {
    render(<Modal show={false} />);

    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });
  it('locks body overflow and animates its root and dialog elements', () => {
    const { elements } = renderModal();

    expect(document.body).toHaveStyle({
      overflow: 'hidden'
    });
    expect(elements.root).toHaveStyle({
      opacity: 0
    });
    expect(elements.dialog).toHaveStyle({
      transform: 'translateY(16px) translateZ(0)'
    });
  });
  it('renders accessible title, description contents and Hide element', () => {
    const { elements } = renderModal();

    expect(elements.title).toBeInTheDocument();
    expect(elements.dialog).toHaveAccessibleName(
      defaultProps['aria-labelledby']
    );

    expect(
      screen.getByText(defaultProps['aria-describedby'])
    ).toBeInTheDocument();
    expect(elements.dialog).toHaveAccessibleDescription(
      defaultProps['aria-describedby']
    );

    expect(elements.hide).toBeInTheDocument();
  });
  it("doesn't render Hide element if [onHide=undefined]", () => {
    render(<Modal show />);

    expect(
      screen.queryByRole('button', {
        name: 'Hide'
      })
    ).not.toBeInTheDocument();
  });
  it('calls [onHide] through Hide element', () => {
    const { elements } = renderModal();

    fireEvent.click(elements.hide);
    expect(defaultProps.onHide).toHaveBeenCalled();
  });
  it('calls [onHide] through useClickaway', async () => {
    const { elements } = renderModal();

    fireEvent.focusOut(elements.dialog);
    await waitFor(() => expect(defaultProps.onHide).toHaveBeenCalled());
  });
  it('calls [onHide] through Escape keydown', () => {
    const { elements } = renderModal();

    fireEvent.keyDown(elements.root, { key: 'Escape' });
    expect(defaultProps.onHide).toHaveBeenCalled();
  });
  it('accepts extra [className]', () => {
    const { elements, className } = renderModal();

    expect(elements.dialog).toHaveClass(className.expected);
  });
  it('accepts extra props', () => {
    const { elements } = renderModal();

    expect(elements.dialog).toHaveAttribute('id', defaultProps.id);
  });
  it('traps focus on focusable elements inside it through useFocustrap', async () => {
    const { elements } = renderModal();

    expect(screen.getByTestId(modalTrappersId.start)).toHaveFocus();

    userEvent.tab();
    expect(elements.hide).toHaveFocus();

    userEvent.tab();
    expect(
      screen.getByRole('button', {
        name: 'action'
      })
    ).toHaveFocus();

    userEvent.tab();
    await waitFor(() => expect(elements.hide).toHaveFocus());
  });
});
