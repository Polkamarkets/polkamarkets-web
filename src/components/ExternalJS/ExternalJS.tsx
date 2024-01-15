import { Helmet } from 'react-helmet';

import { environment } from 'config';

function ExternalJS() {
  if (!environment.EXTERNAL_JS_URL) return null;

  return (
    <Helmet>
      <script type="text/javascript" src={environment.EXTERNAL_JS_URL} />
    </Helmet>
  );
}

export default ExternalJS;
