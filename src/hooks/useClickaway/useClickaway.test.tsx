import { useRef } from 'react';

import { fireEvent, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import useClickaway from './useClickaway';

function renderClickaway() {
  const node = document.createElement('div');
  const onClickaway = jest.fn();

  return {
    node,
    onClickaway,
    ...renderHook(
      initialProps => {
        const ref = useRef(node);

        return useClickaway(ref, onClickaway, initialProps.deps);
      },
      {
        initialProps: {
          deps: [true]
        }
      }
    )
  };
}

describe('useClickaway', () => {
  it('mutates the referenced node', () => {
    const { node } = renderClickaway();

    expect(node).toHaveAttribute('tabindex', '0');
  });
  it('calls [onClickaway] when clicks away node', async () => {
    const { node, onClickaway } = renderClickaway();

    fireEvent.focusOut(node);
    await waitFor(() => expect(onClickaway).toHaveBeenCalledTimes(1));
  });
  it("doesn't call [onClickaway] if the deps doesn't allow it", async () => {
    const { node, onClickaway, rerender } = renderClickaway();

    rerender({
      deps: [false]
    });
    fireEvent.focusOut(node);
    expect(onClickaway).not.toHaveBeenCalled();
  });
});
