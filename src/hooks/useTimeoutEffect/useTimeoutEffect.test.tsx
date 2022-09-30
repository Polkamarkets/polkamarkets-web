import { useEffect } from 'react';

import { render, screen, waitFor } from '@testing-library/react';

import useTimeoutEffect from './useTimeoutEffect';

const defaults = {
  method: jest.fn(),
  timeout: 100
};

function ComponentWithTimeoutEffect() {
  const timeoutEffect = useTimeoutEffect();

  useEffect(() => {
    timeoutEffect(defaults.method, defaults.timeout);
  }, [timeoutEffect]);

  return <button type="button">button</button>;
}

describe('useTimeoutEffect', () => {
  it('calls a method once the timer expires', async () => {
    render(<ComponentWithTimeoutEffect />);

    expect(
      screen.getByRole('button', {
        name: 'button'
      })
    ).toBeInTheDocument();
    await waitFor(() => expect(defaults.method).toHaveBeenCalledTimes(1));
  });
  it('cleans a method once the component unmounts', () => {
    const { unmount } = render(<ComponentWithTimeoutEffect />);

    jest.spyOn(window, 'clearTimeout');
    unmount();

    expect(window.clearTimeout).toHaveBeenCalledTimes(1);
  });
});
