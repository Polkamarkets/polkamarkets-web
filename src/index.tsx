import { StrictMode } from 'react';
import { render } from 'react-dom';

import * as Sentry from '@sentry/react';
import { environment } from 'config';
import type { ReportHandler } from 'web-vitals';

import App from './App';

import 'styles/main.scss';

Sentry.init({
  dsn: environment.SENTRY_DSN,
  integrations: integrations =>
    integrations.filter(integration => integration.name !== 'GlobalHandlers'),
  enabled: process.env.NODE_ENV !== 'development'
});

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);

((onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
})();
