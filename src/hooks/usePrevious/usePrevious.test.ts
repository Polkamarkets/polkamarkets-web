import { renderHook } from '@testing-library/react-hooks';

import usePrevious from './usePrevious';

enum Value {
  Prev,
  Cur
}

function renderPrevious() {
  return renderHook(initialProps => usePrevious(initialProps.value), {
    initialProps: { value: Value.Prev }
  });
}

describe('usePrevious', () => {
  it('returns the previous provided value', () => {
    const { result, rerender } = renderPrevious();

    rerender({
      value: Value.Cur
    });
    expect(result.current.current).toBe(Value.Cur);
  });
  it('keeps the previous provided value on rerender', () => {
    const { result, rerender } = renderPrevious();

    rerender();
    expect(result.current.current).toBe(Value.Prev);
  });
});
