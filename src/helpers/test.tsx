import type React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import cn from 'classnames';
import store from 'redux/store';

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    wrapper: function Wrapper({
      // 🐛 BACKLOG: to be imported from some high-level app component
      children
    }: React.PropsWithChildren<Record<string, unknown>>) {
      return (
        <Provider store={store}>
          <BrowserRouter>
            <MemoryRouter>{children}</MemoryRouter>
          </BrowserRouter>
        </Provider>
      );
    },
    ...options
  });
}
export function renderClassName({ withClassName }: { withClassName: string }) {
  const input = cn('class', {
    name: true
  });

  return {
    input,
    expected: `${withClassName} ${input}`
  };
}
