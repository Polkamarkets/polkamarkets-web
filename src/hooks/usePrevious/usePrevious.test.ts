import { renderHook } from '@testing-library/react-hooks';

import usePrevious from './usePrevious';

describe('usePrevious', () => {
  it('should return the correct value', () => {
    const value = 'render';
    const { result, rerender } = renderHook(() => usePrevious(value));

    rerender(value);
    expect(result.current.current).toBe(value);
  });
});
