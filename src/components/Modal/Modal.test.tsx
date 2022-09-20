import { fireEvent, render, screen } from '@testing-library/react';

import Modal from './Modal';

const defaultProps = {
  show: false,
  onHide: jest.fn(),
  name: 'test'
};
const defaultData = {
  title: 'Modal Title',
  description: 'Modal description text',
  labelAction: 'Modal action'
};
function renderHelper(props = defaultProps, data = defaultData) {
  return render(
    <Modal {...props}>
      <Modal.Header>
        <Modal.HeaderTitle>{data.title}</Modal.HeaderTitle>
      </Modal.Header>
      <Modal.Section>
        <Modal.SectionText>{data.description}</Modal.SectionText>
      </Modal.Section>
      <Modal.Footer>
        <button type="button">{data.labelAction}</button>
      </Modal.Footer>
    </Modal>
  );
}

describe('Modal', () => {
  it('should not render', () => {
    renderHelper();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('should render correctly', () => {
    renderHelper({ ...defaultProps, show: true });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(defaultData.title)).toBeInTheDocument();
    expect(screen.getByText(defaultData.description)).toBeInTheDocument();
    expect(screen.getByText(defaultData.labelAction)).toBeInTheDocument();
  });
  it('should call onHide correctly', () => {
    renderHelper({ ...defaultProps, show: true });

    fireEvent.click(screen.getByRole('button', { name: /hide/i }));
    expect(defaultProps.onHide).toHaveBeenCalled();
  });
});
