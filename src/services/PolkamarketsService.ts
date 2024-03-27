/* eslint-disable no-underscore-dangle */
import * as realitioLib from '@reality.eth/reality-eth-lib/formatters/question';
import { features, ui } from 'config';
import environment, { NetworkConfig } from 'config/environment';
import * as polkamarketsjs from 'polkamarkets-js';

export default class PolkamarketsService {
  // polkamarkets app
  public polkamarkets: any;

  // polkamarkets smart contract instances
  public contracts: any = {};

  // indicates if user has already done a successful metamask login
  public loggedIn: boolean = false;

  // user eth address
  public address: string = '';

  public predictionMarketContractAddress: string;

  public predictionMarketManagerContractAddress: string | undefined;

  public predictionMarketIsV3: boolean;

  public erc20ContractAddress: string;

  public realitioErc20ContractAddress: string;

  public realitioErc20Timeout: number;

  public achievementsContractAddress: string | undefined;

  public votingContractAddress: string | undefined;

  public arbitrationContractAddress: string | undefined;

  public arbitrationProxyContractAddress: string | undefined;

  // util functions
  static bytes32ToInt(bytes32Str: string): number {
    return Number(realitioLib.bytes32ToString(bytes32Str, { type: 'int' }));
  }

  static intToBytes32(int: string): string {
    return realitioLib.answerToBytes32(Number(int), { type: 'int' });
  }

  constructor(
    {
      PREDICTION_MARKET_CONTRACT_ADDRESS,
      PREDICTION_MARKET_MANAGER_CONTRACT_ADDRESS,
      PREDICTION_MARKET_IS_V3,
      ERC20_CONTRACT_ADDRESS,
      REALITIO_ERC20_CONTRACT_ADDRESS,
      REALITIO_ERC20_TIMEOUT,
      ACHIEVEMENTS_CONTRACT_ADDRESS,
      VOTING_CONTRACT_ADDRESS,
      ARBITRATION_CONTRACT_ADDRESS,
      ARBITRATION_PROXY_CONTRACT_ADDRESS,
      WEB3_PROVIDER,
      WEB3_EVENTS_PROVIDER
    }: NetworkConfig = environment.NETWORKS[environment.NETWORK_ID || 42]
  ) {
    this.predictionMarketContractAddress = PREDICTION_MARKET_CONTRACT_ADDRESS;
    this.predictionMarketManagerContractAddress =
      PREDICTION_MARKET_MANAGER_CONTRACT_ADDRESS;
    this.predictionMarketIsV3 = PREDICTION_MARKET_IS_V3 || false;
    this.erc20ContractAddress = ERC20_CONTRACT_ADDRESS;
    this.realitioErc20Timeout = REALITIO_ERC20_TIMEOUT || 3600;
    this.realitioErc20ContractAddress = REALITIO_ERC20_CONTRACT_ADDRESS;
    this.achievementsContractAddress = ACHIEVEMENTS_CONTRACT_ADDRESS;
    this.votingContractAddress = VOTING_CONTRACT_ADDRESS;
    this.arbitrationContractAddress = ARBITRATION_CONTRACT_ADDRESS;
    this.arbitrationProxyContractAddress = ARBITRATION_PROXY_CONTRACT_ADDRESS;

    this.polkamarkets = new polkamarketsjs.Application({
      web3Provider: WEB3_PROVIDER,
      web3EventsProvider: WEB3_EVENTS_PROVIDER,
      isSocialLogin: ui.socialLogin.enabled,
      socialLoginParams: {
        isTestnet: ui.socialLogin.isTestnet,
        networkConfig: {
          chainId: Number(
            process.env.REACT_APP_FEATURE_SOCIAL_LOGIN_NETWORK_ID
          ),
          particleProjectId:
            process.env.REACT_APP_FEATURE_SOCIAL_LOGIN_PARTICLE_PROJECT_ID,
          particleClientKey:
            process.env.REACT_APP_FEATURE_SOCIAL_LOGIN_PARTICLE_CLIENT_KEY,
          particleAppId:
            process.env.REACT_APP_FEATURE_SOCIAL_LOGIN_PARTICLE_APP_ID,
          bundlerRPC: process.env.REACT_APP_FEATURE_SOCIAL_LOGIN_BUNDLER_RPC,
          bundlerAPI: process.env.REACT_APP_POLKAMARKETS_API_URL
        },
        web3AuthConfig: {
          clientId: process.env.REACT_APP_WEB3AUTH_CLIENT_ID,
          jwt: {
            customVerifier: process.env.REACT_APP_WEB3AUTH_JWT_CUSTOM_VERIFIER
          },
          discord: {
            customVerifier:
              process.env.REACT_APP_WEB3AUTH_DISCORD_CUSTOM_VERIFIER,
            clientId: process.env.REACT_APP_WEB3AUTH_DISCORD_CLIENT_ID
          }
        },
        whiteLabelData: {
          logo:
            process.env.REACT_APP_SOCIAL_LOGIN_LOGO_URL ||
            'https://www.polkamarkets.com/favicon.ico',
          name: process.env.REACT_APP_SOCIAL_LOGIN_NAME || 'Polkamarkets'
        }
      }
    });

    this.polkamarkets.start();
    // fetching contract
    this.getContracts();
  }

  public async getContracts() {
    this.getPredictionMarketContract();
    this.getRealitioERC20Contract();
    this.getERC20Contract();
    this.getAchievementsContract();
    this.getVotingContract();
    this.getArbitrationContract();
    this.getArbitrationProxyContract();
  }

  public getPredictionMarketContract() {
    this.contracts.pm = this.predictionMarketIsV3
      ? this.polkamarkets.getPredictionMarketV3Contract({
          contractAddress: this.predictionMarketContractAddress
        })
      : this.polkamarkets.getPredictionMarketV2Contract({
          contractAddress: this.predictionMarketContractAddress
        });
  }

  public getERC20Contract() {
    this.contracts.erc20 = this.polkamarkets.getFantasyERC20Contract({
      contractAddress: this.erc20ContractAddress
    });
  }

  public getRealitioERC20Contract() {
    this.contracts.realitio = this.polkamarkets.getRealitioERC20Contract({
      contractAddress: this.realitioErc20ContractAddress
    });
  }

  public getAchievementsContract() {
    this.contracts.achievements = this.polkamarkets.getAchievementsContract({
      contractAddress: this.achievementsContractAddress
    });
  }

  public getVotingContract() {
    this.contracts.voting = this.polkamarkets.getVotingContract({
      contractAddress: this.votingContractAddress
    });
  }

  public getArbitrationContract() {
    this.contracts.arbitration = this.polkamarkets.getArbitrationContract({
      contractAddress: this.arbitrationContractAddress
    });
  }

  public getArbitrationProxyContract() {
    this.contracts.arbitrationProxy =
      this.polkamarkets.getArbitrationProxyContract({
        contractAddress: this.arbitrationProxyContractAddress
      });
  }

  public getPredictionMarketManagerContract() {
    this.contracts.pm = this.polkamarkets.getPredictionMarketV3ManagerContract({
      contractAddress: this.predictionMarketManagerContractAddress
    });
  }

  public logoutSocialLogin() {
    this.polkamarkets.socialLoginLogout();
    this.loggedIn = false;
    this.address = '';
  }

  public async socialLoginWithJWT(id, jwtToken) {
    return this.polkamarkets.socialLoginWithJWT(id, jwtToken);
  }

  public async socialLoginMetamask() {
    await this.polkamarkets.socialLogin.init();
    return this.polkamarkets.socialLoginMetamask();
  }

  public async getSocialLoginUserInfo() {
    return this.polkamarkets.getSocialLoginUserInfo();
  }

  // returns wether wallet is connected to service or not
  public async isLoggedIn(): Promise<boolean> {
    return this.polkamarkets.isLoggedIn();
  }

  public async login() {
    if (this.loggedIn) return true;

    try {
      const loggedIn = await this.polkamarkets.login();
      // successful login
      if (loggedIn) {
        const address = await this.getAddress();
        // TODO: set this in polkamarkets
        if (address) {
          this.polkamarkets.web3.eth.defaultAccount = this.address;
          this.loggedIn = true;
          this.address = address;
          // re-fetching contracts
          this.getContracts();
        }
      }
    } catch (e) {
      // should be non-blocking
      return false;
    }

    return this.loggedIn;
  }

  public async getAddress(): Promise<string> {
    if (this.address) return this.address;

    const address = (await this.polkamarkets.getAddress()) || '';

    return address;
  }

  public async getBalance(): Promise<number> {
    if (!this.address) return 0;

    // returns user balance in ETH
    const balance = await this.polkamarkets.getETHBalance();

    return parseFloat(balance) || 0;
  }

  // PredictionMarket contract functions

  public async getMinimumRequiredBalance(): Promise<number> {
    // TOOD improve this: don't call function when on v3
    if (this.predictionMarketIsV3) {
      return 0;
    }

    const requiredBalance = await this.contracts.pm.getMinimumRequiredBalance();

    return requiredBalance;
  }

  // eslint-disable-next-line class-methods-use-this
  public async getMarketFee(): Promise<number> {
    // TODO: make it variable
    return 0.02;
  }

  public async createMarket(
    name: string,
    description: string,
    image: string,
    duration: number,
    outcomes: Array<string>,
    category: string,
    value: number,
    odds: Array<number>,
    fee: number,
    token: string = '',
    wrapped: boolean = false,
    treasuryFee: number
  ) {
    // ensuring user has wallet connected
    await this.login();

    let response;
    const args = {
      name,
      description,
      image,
      duration,
      outcomes,
      category,
      value,
      oracleAddress: this.arbitrationProxyContractAddress || this.address,
      odds,
      fee: (fee * 1e16).toString(),
      treasuryFee: (treasuryFee * 1e16).toString(),
      treasury: this.address
    };

    if (this.predictionMarketIsV3) {
      return this.contracts.pm.mintAndCreateMarket({
        ...args,
        token,
        realitioAddress: this.realitioErc20ContractAddress,
        realitioTimeout: this.realitioErc20Timeout,
        PM3ManagerAddress: this.predictionMarketManagerContractAddress
      });
    }

    if (wrapped) {
      response = await this.contracts.pm.createMarketWithETH(args);
    } else {
      response = await this.contracts.pm.createMarket({
        ...args,
        token
      });
    }

    return response;
  }

  public async buy(
    marketId: string | number,
    outcomeId: string | number,
    value: number,
    minOutcomeSharesToBuy: number,
    wrapped: boolean
  ) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.pm.buy({
      marketId,
      outcomeId,
      value,
      minOutcomeSharesToBuy,
      wrapped
    });

    return response;
  }

  public async sell(
    marketId: string | number,
    outcomeId: string | number,
    value: number,
    maxOutcomeSharesToSell: number,
    wrapped: boolean
  ) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.pm.sell({
      marketId,
      outcomeId,
      value,
      maxOutcomeSharesToSell,
      wrapped
    });

    return response;
  }

  public async addLiquidity(
    marketId: string | number,
    value: number,
    wrapped: boolean
  ) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.pm.addLiquidity({
      marketId,
      value,
      wrapped
    });

    return response;
  }

  public async removeLiquidity(
    marketId: string | number,
    shares: number,
    wrapped: boolean
  ) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.pm.removeLiquidity({
      marketId,
      shares,
      wrapped
    });

    return response;
  }

  public async checkPortfolioPendingClaims(portfolio: any) {
    // ensuring user has wallet connected
    await this.login();

    let pendingAmount = 0;

    // eslint-disable-next-line no-restricted-syntax
    for (const marketId of Object.keys(portfolio)) {
      const position = portfolio[marketId];
      if (
        position.claimStatus.winningsToClaim &&
        !position.claimStatus.winningsClaimed
      ) {
        // eslint-disable-next-line no-await-in-loop
        const marketData = await this.contracts.pm.getMarketData({ marketId });
        if (position.outcomes[marketData.resolvedOutcomeId].shares > 1e0) {
          pendingAmount +=
            position.outcomes[marketData.resolvedOutcomeId].shares;
        }
      } else if (!position.claimStatus.winningsToClaim) {
        // TODO: improve this
        // checking if market is voided
        // eslint-disable-next-line no-await-in-loop
        const marketData = await this.contracts.pm.getMarketData({ marketId });

        if (marketData.voided) {
          // eslint-disable-next-line no-restricted-syntax
          for (const outcomeId of Object.keys(position.outcomes)) {
            const outcomePosition = position.outcomes[outcomeId];
            if (outcomePosition.shares > 1e0) {
              // eslint-disable-next-line no-await-in-loop
              const outcomeData = await this.contracts.pm.getOutcomeData({
                marketId,
                outcomeId
              });

              pendingAmount += outcomePosition.shares * outcomeData.price;
            }
          }
        }
      }
    }

    return pendingAmount;
  }

  public async checkPortfolioAndClaimWinnings(portfolio: any) {
    // ensuring user has wallet connected
    await this.login();

    let hasClaimed = false;

    // eslint-disable-next-line no-restricted-syntax
    for (const marketId of Object.keys(portfolio)) {
      const position = portfolio[marketId];
      if (
        position.claimStatus.winningsToClaim &&
        !position.claimStatus.winningsClaimed
      ) {
        // eslint-disable-next-line no-await-in-loop
        const marketData = await this.contracts.pm.getMarketData({ marketId });
        if (position.outcomes[marketData.resolvedOutcomeId].shares > 1e0) {
          hasClaimed = true;
          // eslint-disable-next-line no-await-in-loop
          await this.claimWinnings(marketId);
        }
      }

      if (
        position.claimStatus.liquidityToClaim &&
        !position.claimStatus.liquidityClaimed
      ) {
        hasClaimed = true;
        // eslint-disable-next-line no-await-in-loop
        await this.claimLiquidity(marketId);
      }
    }

    return hasClaimed;
  }

  public async claimWinnings(marketId: string | number) {
    // ensuring user has wallet connected
    await this.login();

    const wrapped = await this.isMarketERC20TokenWrapped(marketId);

    const response = await this.contracts.pm.claimWinnings({
      marketId,
      wrapped
    });

    return response;
  }

  public async claimVoidedOutcomeShares(
    marketId: string | number,
    outcomeId: string | number
  ) {
    // ensuring user has wallet connected
    await this.login();

    const wrapped = await this.isMarketERC20TokenWrapped(marketId);

    const response = await this.contracts.pm.claimVoidedOutcomeShares({
      marketId,
      outcomeId,
      wrapped
    });

    return response;
  }

  public async claimLiquidity(marketId: string | number) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.pm.claimLiquidity({
      marketId
    });

    return response;
  }

  public async getMarketData(marketId: string | number) {
    // ensuring user has wallet connected
    await this.login();

    const marketData = await this.contracts.pm.getMarketData({ marketId });

    marketData.outcomes = await Promise.all(
      marketData.outcomeIds.map(async outcomeId => {
        const outcomeData = await this.contracts.pm.getOutcomeData({
          marketId,
          outcomeId
        });

        return outcomeData;
      })
    );

    return marketData;
  }

  public async getWETHAddress() {
    const wethAddress = await this.contracts.pm.getWETHAddress();

    return wethAddress;
  }

  public async isMarketERC20TokenWrapped(marketId: string | number) {
    const isWrapped = await this.contracts.pm.isMarketERC20TokenWrapped({
      marketId
    });

    return isWrapped;
  }

  public async getMarketPrices(marketId: string | number) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.pm.getMarketPrices({ marketId });

    return response;
  }

  public async getUserPortfolio(user: string): Promise<Object> {
    const response = await this.contracts.pm.getPortfolio({ user });

    return response;
  }

  public async getPortfolio(): Promise<Object> {
    // ensuring user has wallet connected
    await this.login();
    if (!this.address) return {};

    const response = await this.getUserPortfolio(this.address);

    return response;
  }

  public async getUserActions(user: string): Promise<any[]> {
    const response = await this.contracts.pm.getActions({ user });

    return response;
  }

  public async getActions(): Promise<any[]> {
    // ensuring user has wallet connected
    await this.login();
    if (!this.address) return [];

    const response = await this.contracts.pm.getActions({ user: this.address });

    return response;
  }

  public async resolveMarket(marketId: string | number) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.pm.resolveMarketOutcome({
      marketId
    });

    return response;
  }

  // ERC20 contract functions

  public async getPolkBalance(): Promise<number> {
    return this.getERC20Balance(this.erc20ContractAddress);
  }

  public async getERC20Balance(erc20ContractAddress: string): Promise<number> {
    // ensuring user has wallet connected
    await this.login();

    // console.trace();
    if (!this.address) {
      return 0;
    }

    const contract = this.polkamarkets.getFantasyERC20Contract({
      contractAddress: erc20ContractAddress
    });

    // TODO improve this: ensuring erc20 contract is initialized
    // eslint-disable-next-line no-underscore-dangle
    await contract.__init__();

    // returns user balance in ETH
    const balance = await contract.getTokenAmount(this.address);

    return parseFloat(balance) || 0;
  }

  public async isPolkClaimed(): Promise<boolean> {
    if (!this.address) return false;

    if (features.regular.enabled) return true;

    let claimed;

    try {
      // TODO improve this: ensuring erc20 contract is initialized
      // eslint-disable-next-line no-underscore-dangle
      await this.contracts.erc20.__init__();

      // TODO: only call function when fantasy mode is enabled
      claimed = await this.contracts.erc20.hasUserClaimedTokens({
        address: this.address
      });
    } catch (error) {
      return false;
    }

    return claimed;
  }

  public async claimPolk(): Promise<boolean> {
    if (features.regular.enabled) return true;

    // ensuring user has wallet connected
    await this.login();

    // TODO improve this: ensuring erc20 contract is initialized
    // eslint-disable-next-line no-underscore-dangle
    await this.contracts.erc20.__init__();

    await this.contracts.erc20.claimAndApproveTokens();

    return true;
  }

  public async resetBalance(): Promise<boolean> {
    if (features.regular.enabled) return true;

    // ensuring user has wallet connected
    await this.login();

    // TODO improve this: ensuring erc20 contract is initialized
    // eslint-disable-next-line no-underscore-dangle
    await this.contracts.erc20.__init__();

    const response = await this.contracts.erc20.resetBalance();

    return response;
  }

  public async hasUserResetBalance(timestamp: number = 0): Promise<boolean> {
    if (features.regular.enabled) return false;

    // ensuring user has wallet connected
    await this.login();

    // TODO improve this: ensuring erc20 contract is initialized
    // eslint-disable-next-line no-underscore-dangle
    await this.contracts.erc20.__init__();

    const events = await this.contracts.erc20.burnEvents({
      address: this.address
    });

    return events.filter(event => event.timestamp > timestamp).length > 0;
  }

  public async getERC20TokenInfo(erc20ContractAddress: string): Promise<any> {
    if (!erc20ContractAddress) return false;

    let token;

    try {
      const contract = this.polkamarkets.getFantasyERC20Contract({
        contractAddress: erc20ContractAddress
      });

      // TODO improve this: ensuring erc20 contract is initialized
      // eslint-disable-next-line no-underscore-dangle
      await contract.__init__();

      token = await contract.getTokenInfo();
    } catch (error) {
      // invalid answer, returning false
      return false;
    }

    return token;
  }

  public async isERC20Approved(
    erc20ContractAddress: string,
    spenderAddress: string
  ): Promise<boolean> {
    // ensuring user has wallet connected
    await this.login();

    if (!this.address || !erc20ContractAddress || !spenderAddress) return false;

    const contract = this.polkamarkets.getFantasyERC20Contract({
      contractAddress: erc20ContractAddress
    });

    // TODO improve this: ensuring erc20 contract is initialized
    // eslint-disable-next-line no-underscore-dangle
    await contract.__init__();

    const isApproved = await contract.isApproved({
      address: this.address,
      amount: 1,
      spenderAddress
    });

    return isApproved;
  }

  public async approveERC20(
    erc20ContractAddress: string,
    spenderAddress: string,
    amount?: number
  ) {
    // ensuring user has wallet connected
    await this.login();

    const contract = this.polkamarkets.getFantasyERC20Contract({
      contractAddress: erc20ContractAddress
    });

    // TODO improve this: ensuring erc20 contract is initialized
    // eslint-disable-next-line no-underscore-dangle
    await contract.__init__();

    const response = await contract.approve({
      address: spenderAddress,
      amount: amount || 2 ** 128 - 1
    });

    return response;
  }

  public async calcBuyAmount(
    marketId: string | number,
    outcomeId: string | number,
    value: number
  ): Promise<number> {
    const response = await this.contracts.pm.calcBuyAmount({
      marketId,
      outcomeId,
      value
    });

    return response;
  }

  public async calcSellAmount(
    marketId: string | number,
    outcomeId: string | number,
    value: number
  ): Promise<number> {
    const response = await this.contracts.pm.calcSellAmount({
      marketId,
      outcomeId,
      value
    });

    return response;
  }

  // Realitio contract functions

  public async isRealitioERC20Approved(): Promise<boolean> {
    return this.isERC20Approved(
      this.erc20ContractAddress,
      this.contracts.realitio.getAddress()
    );
  }

  public async approveRealitioERC20(): Promise<any> {
    return this.approveERC20(
      this.erc20ContractAddress,
      this.contracts.realitio.getAddress()
    );
  }

  public async getQuestionBonds(
    questionId: string,
    user: string | null = null
  ) {
    if (!this.contracts.realitio.getContract()._address) return {};

    const bonds = await this.contracts.realitio.getQuestionBondsByAnswer({
      questionId,
      user
    });

    // mapping answer ids to outcome ids
    Object.keys(bonds).forEach(answerId => {
      const outcomeId = Number(
        realitioLib.bytes32ToString(answerId, { type: 'int' })
      );
      bonds[outcomeId] = bonds[answerId];
      delete bonds[answerId];
    });

    return bonds;
  }

  public async placeBond(
    questionId: string,
    outcomeId: string | number,
    amount: number
  ) {
    // ensuring user has wallet connected
    await this.login();

    // translating outcome id to answerId
    const answerId = realitioLib.answerToBytes32(outcomeId, { type: 'int' });

    const response = await this.contracts.realitio.submitAnswerERC20({
      questionId,
      answerId,
      amount
    });

    return response;
  }

  public async claimWinningsAndWithdraw(questionId: string) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.realitio.claimWinningsAndWithdraw({
      questionId
    });

    return response;
  }

  public async getUserBonds(_user: string): Promise<Object> {
    if (!this.contracts.realitio.getContract()._address) return {};

    // TODO: use correct user
    return this.getBonds();
  }

  public async getBonds(): Promise<Object> {
    if (!this.contracts.realitio.getContract()._address) return {};

    // ensuring user has wallet connected
    await this.login();
    if (!this.address) return {};

    const bonds = await this.contracts.realitio.getMyBonds();

    return bonds;
  }

  public async getBondActions(): Promise<Object> {
    // ensuring user has wallet connected
    await this.login();
    if (!this.address || !this.contracts.realitio.getContract()._address)
      return [];

    const response = await this.contracts.realitio.getMyActions();

    return response;
  }

  public async getUserBondMarketsIds(_user: string): Promise<string[]> {
    if (!this.contracts.realitio.getContract()._address) return [];

    // TODO: use correct user
    return this.getBondMarketIds();
  }

  public async getBondMarketIds(): Promise<string[]> {
    // ensuring user has wallet connected
    if (!this.address) return [];

    if (!this.contracts.realitio.getContract()._address) return [];

    const questions = await this.contracts.realitio.getMyQuestions();

    const marketIds = await this.contracts.pm.getMarketIdsFromQuestions({
      questions: questions.map(question => question.question)
    });

    return marketIds;
  }

  public async getQuestion(questionId: string): Promise<Object> {
    const question = await this.contracts.realitio.getQuestion({ questionId });

    return question;
  }

  // Achievement contract functions

  public async getAchievements(): Promise<Object> {
    // TODO improve this: contract might not be defined for network
    if (!this.contracts.achievements.getContract()._address) return {};

    // ensuring user has wallet connected
    if (!this.address) return {};

    const response = await this.contracts.achievements.getUserAchievements({
      user: this.address
    });

    return response;
  }

  public async claimAchievement(achievementId: string | number) {
    // ensuring user has wallet connected
    if (!this.address) return false;

    const response = await this.contracts.achievements.claimAchievement({
      achievementId
    });

    return response;
  }

  // Voting contract functions

  public async getMinimumVotingRequiredBalance(): Promise<number> {
    if (!this.contracts.voting.getContract()._address) return 0;

    const requiredBalance =
      await this.contracts.voting.getMinimumRequiredBalance();

    return requiredBalance;
  }

  public async getUserVotes(): Promise<Object> {
    // TODO improve this: contract might not be defined for network
    if (!this.contracts.voting.getContract()._address) return {};

    // ensuring user has wallet connected
    await this.login();
    if (!this.address) return {};

    const response = await this.contracts.voting.getUserVotes({
      user: this.address
    });

    return response;
  }

  public async upvoteItem(itemId) {
    // ensuring user has wallet connected
    await this.login();

    // ensuring user has wallet connected
    if (!this.address) return false;

    const response = await this.contracts.voting.upvoteItem({ itemId });

    return response;
  }

  public async downvoteItem(itemId) {
    // ensuring user has wallet connected
    await this.login();

    // ensuring user has wallet connected
    if (!this.address) return false;

    const response = await this.contracts.voting.downvoteItem({ itemId });

    return response;
  }

  public async removeUpvoteItem(itemId) {
    // ensuring user has wallet connected
    await this.login();

    // ensuring user has wallet connected
    if (!this.address) return false;

    const response = await this.contracts.voting.removeUpvoteItem({ itemId });

    return response;
  }

  public async removeDownvoteItem(itemId) {
    // ensuring user has wallet connected
    await this.login();

    // ensuring user has wallet connected
    if (!this.address) return false;

    const response = await this.contracts.voting.removeDownvoteItem({ itemId });

    return response;
  }

  // Arbitration contract functions

  public async getDisputeFee(questionId: string): Promise<number> {
    const response = await this.contracts.arbitration.getDisputeFee({
      questionId
    });

    return response;
  }

  public async requestArbitration(
    questionId: string,
    bond: number
  ): Promise<any> {
    await this.login();

    const response = await this.contracts.arbitration.requestArbitration({
      questionId,
      bond
    });

    return response;
  }

  public async getArbitrationRequests(questionId: string): Promise<any> {
    const response = await this.contracts.arbitration.getArbitrationRequests({
      questionId
    });

    return response;
  }

  public async getArbitrationDisputeId(
    questionId: string
  ): Promise<number | null> {
    const response = await this.contracts.arbitration.getArbitrationDisputeId({
      questionId
    });

    return response;
  }

  public async getArbitrationRequestsRejected(
    questionId: string
  ): Promise<any> {
    const response =
      await this.contracts.arbitrationProxy.getArbitrationRequestsRejected({
        questionId
      });

    return response;
  }
}
