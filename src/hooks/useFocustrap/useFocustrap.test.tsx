import { useRef } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import useFocustrap from './useFocustrap';

const trappersId = {
  start: 'start',
  end: 'end'
};

function ComponentWithFocustrap() {
  const ref = useRef(null);

  useFocustrap(ref, ['button'], trappersId);

  return (
    <div ref={ref}>
      <button type="button">button</button>
    </div>
  );
}

describe('useFocustrap', () => {
  it('inserts focus trappers nodes', () => {
    render(<ComponentWithFocustrap />);

    Object.values(trappersId).forEach(trap =>
      expect(screen.getByTestId(trap)).toBeTruthy()
    );
  });
  it('focus the start trapper element and trap it inside the referenced node', async () => {
    render(<ComponentWithFocustrap />);

    const button = screen.getByText('button');

    expect(screen.getByTestId(trappersId.start)).toHaveFocus();
    userEvent.tab();
    expect(button).toHaveFocus();
    userEvent.tab();
    await waitFor(() => expect(button).toHaveFocus());
  });
  it('focus the previous element back on the referenced node unmount', async () => {
    const { unmount } = render(<ComponentWithFocustrap />);

    expect(screen.getByTestId(trappersId.start)).toHaveFocus();
    unmount();
    Object.values(trappersId).forEach(trap =>
      expect(screen.queryByTestId(trap)).not.toBeInTheDocument()
    );
    expect(document.body).toHaveFocus();
  });
});
