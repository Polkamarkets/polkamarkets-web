# Polkamarkets

Polkamarkets is an Autonomous Prediction Market Protocol built for multi-chain information exchange and trading, based on Polkadot.

## Overview

Our web interface is built with React.

The backend and Ethereum integrations are being developed through [`polkamarkets-js`](https://github.com/Polkamarkets/polkamarkets-js) package. You can have a look on our smart contract [here](https://github.com/Polkamarkets/polkamarkets-js/blob/main/contracts/PredictionMarket.sol).

We're currently running on [Moonbeam](https://moonbeam.network/) and [Moonriver](https://moonbeam.network/networks/moonriver/). You can access it at [https://app.polkamarkets.com](https://app.polkamarkets.com)

## Setup

1. Required software

- [Yarn](https://yarnpkg.com/) (`node v14.15.0 or later`)
- MetaMask for [Chrome](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/)

2. Installing the app

```
git clone https://github.com/Polkamarkets/polkamarkets-web.git
cd polkamarkets-web
yarn install
```

3. Required environment variables

- At the project root create a `.env` file
- Copy the contents of `.env.example` (it has all the required env variables needed for the project)

4. Running the app

- Type `yarn start` to start the local server
- Open `http://localhost:3000/` in your browser

## Troubleshooting

### Storybook

#### Module build failed from SyntaxError

1. Clean up cache

```shell
yarn cache clean
```

2. Try again

> Shorthand commands: `yarn cache clean && yarn storybook`

#### Babel loader crashing between React JS Scripts

1. Clean up `node_modules`

```shell
rm -rf node_modules
```

2. Install dependencies

```shell
yarn install
```

3. Install `react-scripts` to dedupe

```shell
yarn add react-scripts@^4.0.3
```

4. Try again

> Shorthand commands: `rm -rf node_modules && yarn install && yarn add react-scripts@^4.0.3`
