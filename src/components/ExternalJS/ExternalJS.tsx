import { Helmet } from 'react-helmet';

import { environment } from 'config';

function ExternalJS() {
  const hasLocalize = environment.LOCALIZE_CONFIG?.includes('key');

  return (
    <Helmet>
      {!!environment.EXTERNAL_JS_URL && (
        <script type="text/javascript" src={environment.EXTERNAL_JS_URL} />
      )}
      {!!environment.EXTERNAL_CSS_URL && (
        <link
          rel="stylesheet"
          type="text/css"
          href={environment.EXTERNAL_CSS_URL}
        />
      )}
      {hasLocalize && <script type="text/javascript" src="/js/localize.js" />}
      {hasLocalize && (
        <script type="text/javascript">
          {`!function(a){if(!a.Localize){a.Localize={};for(var e=["translate","untranslate","phrase","initialize","translatePage","setLanguage","getLanguage","getSourceLanguage","detectLanguage","getAvailableLanguages","untranslatePage","bootstrap","prefetch","on","off","hideWidget","showWidget"],t=0;t<e.length;t++)a.Localize[e[t]]=function(){}}}(window);`}
        </script>
      )}
      {hasLocalize && (
        <script type="text/javascript">
          {`Localize.initialize(${environment.LOCALIZE_CONFIG});`}
        </script>
      )}
      {hasLocalize && (
        <style type="text/css">{`body #localize-powered-by,body #localize-widget.show #localize-powered-by,body #localize-widget:hover #localize-powered-by{display:none!important}`}</style>
      )}
      {!!environment.CLARITY_PROJECT_ID &&
        /^[a-z0-9]+$/.test(environment.CLARITY_PROJECT_ID) && (
          <script>
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "%REACT_APP_CLARITY_PROJECT_ID%");`}
          </script>
        )}
    </Helmet>
  );
}

export default ExternalJS;
