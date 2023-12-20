/* eslint-disable no-param-reassign */
const CopyPlugin = require('copy-webpack-plugin');
const cracoPluginStyleResourcesLoader = require('craco-plugin-style-resources-loader');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  plugins: [
    {
      plugin: cracoPluginStyleResourcesLoader,
      options: {
        hoistUseStatements: true,
        patterns: [
          path.join(__dirname, './src/styles/utils/*.scss'),
          path.join(__dirname, './src/styles/abstracts/variables/_colors.scss'),
          path.join(__dirname, './src/styles/abstracts/variables/*.scss'),
          path.join(__dirname, './src/styles/abstracts/mixins/*.scss'),
          path.join(__dirname, './src/styles/abstracts/functions/*.scss'),
          path.join(
            __dirname,
            './src/styles/abstracts/variables/layout/*.scss'
          ),
          path.join(__dirname, './src/styles/abstracts/variables/pages/*.scss'),
          path.join(
            __dirname,
            './src/styles/abstracts/variables/components/*.scss'
          ),
          path.join(__dirname, './src/styles/themes/*.scss')
        ],
        styleType: 'scss'
      }
    }
  ],
  babel: {
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-logical-assignment-operators',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-private-methods',
      '@babel/plugin-proposal-numeric-separator',
      '@babel/plugin-transform-class-properties',
      '@babel/plugin-transform-private-methods',
      '@babel/plugin-transform-private-property-in-object',
    ],
  },
  webpack: {
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: 'public/manifest.json',
            to: 'manifest.json',
            transform(content) {
              return content.toString().replace(/%\w+%/g, value => {
                const envValue = process.env[value.slice(1, value.length - 1)];
                const fallbacks = {
                  '%REACT_APP_MANIFEST_SHORT_NAME%': 'Polkamarkets',
                  '%REACT_APP_MANIFEST_NAME%': 'Polkamarkets',
                  '%REACT_APP_MANIFEST_ICON_192_URL%': 'logo192.png',
                  '%REACT_APP_MANIFEST_ICON_512_URL%': 'logo512.png',
                  '%REACT_APP_FAVICON_URL%': 'favicon.ico'
                };

                return typeof envValue === 'undefined'
                  ? fallbacks[value]
                  : envValue;
              });
            }
          }
        ]
      })
    ],

    configure: (config) => {
      const fallback = config.resolve.fallback || {};
      Object.assign(fallback, {
        crypto: false, // require.resolve("crypto-browserify") can be polyfilled here if needed
        stream: false, // require.resolve("stream-browserify") can be polyfilled here if needed
        assert: false, // require.resolve("assert") can be polyfilled here if needed
        http: false, // require.resolve("stream-http") can be polyfilled here if needed
        https: false, // require.resolve("https-browserify") can be polyfilled here if needed
        os: false, // require.resolve("os-browserify") can be polyfilled here if needed
        url: false, // require.resolve("url") can be polyfilled here if needed
        zlib: false, // require.resolve("browserify-zlib") can be polyfilled here if needed
        path: false,
        fs: false,
      });
      config.resolve.fallback = fallback;
      config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
          process: "process/browser",
          Buffer: ["buffer", "Buffer"],
        }),
      ]);
      config.ignoreWarnings = [/Failed to parse source map/];
      config.module.rules.push({
        test: /\.(js|mjs|jsx)$/,
        enforce: "pre",
        loader: require.resolve("source-map-loader"),
        resolve: {
          fullySpecified: false,
        },
      });
      config.devServer = {
        client: {
          overlay: false,
        },
      };

      return config;
    }
  }
};
