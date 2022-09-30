import { unmountComponentAtNode } from 'react-dom';

import { fireEvent, render, screen } from '@testing-library/react';

import usePortal from './usePortal';

const defaults = {
  onEffect: jest.fn(),
  root: null as HTMLElement | null
};

function ComponentWithPortal() {
  const Portal = usePortal(defaults);

  return (
    <>
      <button type="button" onClick={() => Portal.mount(true)}>
        mount
      </button>
      <button type="button" onClick={() => Portal.unmount()}>
        unmount
      </button>
      <Portal>
        <div>wrap</div>
      </Portal>
    </>
  );
}

beforeEach(() => {
  defaults.root = document.createElement('div');
  defaults.root.setAttribute('id', 'root');
  defaults.root.dataset.testid = 'root';
  document.body.appendChild(defaults.root);
  jest.resetAllMocks();
});
afterEach(() => {
  if (defaults.root) unmountComponentAtNode(defaults.root);
  defaults.root?.remove();
  defaults.root = null;
});
describe('usePortal', () => {
  it("doesn't mount without its callbacks", () => {
    render(<ComponentWithPortal />);

    expect(screen.queryByText('wrap')).not.toBeInTheDocument();
  });
  it('mounts into the provided root', () => {
    render(<ComponentWithPortal />);
    fireEvent.click(screen.getByText('mount'));

    expect(screen.getByTestId('root')).toContainElement(
      screen.getByText('wrap')
    );
  });
  it('unmounts from the provided root', () => {
    render(<ComponentWithPortal />);
    fireEvent.click(screen.getByText('mount'));

    expect(screen.getByText('wrap')).toBeInTheDocument();
    fireEvent.click(screen.getByText('unmount'));

    expect(screen.queryByText('wrap')).not.toBeInTheDocument();
  });
});
