import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from 'helpers/test';
import { PolkamarketsService } from 'services';

import ConnectMetamask from './ConnectMetamask';

const { location, ethereum } = window;

function renderConnectMetamask({
  isMetamaskInstalled
}: {
  isMetamaskInstalled: boolean;
}) {
  if (!isMetamaskInstalled) window.ethereum = null;

  const a11y = {
    // 🐛 BACKLOG: to be moved to i18n
    name: 'Looks like your browser do not have Metamask installed.',
    desc: 'Please follow up the instructions to install it, make sure your wallet is unlocked with at least one account on it and try again.'
  };
  const assertions = {
    getElements() {
      const dialog = screen.queryByRole('dialog', {
        name: a11y.name
      }) as HTMLElement;

      return {
        buttonConnectMetamask: screen.getByRole('button', {
          name: 'Connect MetaMask'
        }),
        dialog
      };
    },
    connectMetamask() {
      const { buttonConnectMetamask } = this.getElements();

      expect(buttonConnectMetamask).toBeInTheDocument();
      fireEvent.click(buttonConnectMetamask);
    }
  };

  return {
    a11y,
    assertions,
    ...renderWithProviders(<ConnectMetamask />)
  };
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn()
  }),
  useLocation: () => ({
    pathname: 'localhost:3000'
  })
}));

beforeEach(() => {
  delete window.ethereum;
  // @ts-expect-error
  delete window.location;

  Object.defineProperties(window, {
    ethereum: {
      writable: true,
      value: {
        on: jest.fn()
      }
    },
    location: {
      configurable: true,
      value: {
        reload: jest.fn()
      }
    }
  });
});
afterEach(() => {
  Object.defineProperties(window, {
    ethereum: {
      ...ethereum
    },
    // @ts-expect-error
    location: {
      ...location
    }
  });
  jest.clearAllMocks();
});
describe('ConnectMetamask', () => {
  it('renders its action button initially', () => {
    const { assertions } = renderConnectMetamask({
      isMetamaskInstalled: false
    });

    expect(assertions.getElements().buttonConnectMetamask).toBeInTheDocument();
    expect(assertions.getElements().dialog).not.toBeInTheDocument();
  });
  it('renders its warning dialog if it is not installed', () => {
    const { a11y, assertions } = renderConnectMetamask({
      isMetamaskInstalled: false
    });

    assertions.connectMetamask();

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: a11y.name
      })
    ).toBeInTheDocument();
    expect(assertions.getElements().dialog).toHaveAccessibleName(a11y.name);

    expect(screen.getByText(a11y.desc)).toBeInTheDocument();
    expect(assertions.getElements().dialog).toHaveAccessibleDescription(
      a11y.desc
    );
  });
  it('allows to close its warning dialog through Hide button', async () => {
    const { assertions } = renderConnectMetamask({
      isMetamaskInstalled: false
    });

    assertions.connectMetamask();

    const hideConnectMetamask = screen.getByRole('button', {
      name: 'Hide'
    });

    expect(hideConnectMetamask).toBeInTheDocument();
    fireEvent.click(hideConnectMetamask);

    await waitFor(() => {
      expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
    });
  });
  it('allows to close its warning dialog through click away', async () => {
    const { a11y, assertions } = renderConnectMetamask({
      isMetamaskInstalled: false
    });

    assertions.connectMetamask();

    const root = screen.getByRole('dialog', {
      name: a11y.name
    });

    expect(root).toHaveAccessibleName(a11y.name);
    fireEvent.focusOut(root);

    await waitFor(() => {
      expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
    });
  });
  it('allows to install MetaMask through website owner', () => {
    const { assertions } = renderConnectMetamask({
      isMetamaskInstalled: false
    });

    assertions.connectMetamask();

    const buttonInstall = screen.getByRole('link', {
      name: 'Install'
    });

    expect(buttonInstall).toBeInTheDocument();
    expect(buttonInstall).toHaveAttribute(
      'href',
      'https://metamask.io/download.html'
    );
  });
  it('allows to try again by reloading the page', () => {
    const { assertions } = renderConnectMetamask({
      isMetamaskInstalled: false
    });

    assertions.connectMetamask();

    const buttonTryagain = screen.getByRole('button', {
      name: 'Try Again'
    });

    expect(buttonTryagain).toBeInTheDocument();
    fireEvent.click(buttonTryagain);
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });
  it('calls the PolkamarketsServices API if it is installed', async () => {
    PolkamarketsService.prototype.login = jest.fn();
    PolkamarketsService.prototype.isLoggedIn = jest.fn();

    const { assertions } = renderConnectMetamask({
      isMetamaskInstalled: true
    });

    assertions.connectMetamask();

    expect(assertions.getElements().dialog).not.toBeInTheDocument();
    await waitFor(() => {
      expect(PolkamarketsService.prototype.login).toHaveBeenCalledTimes(1);
    });
  });
});
