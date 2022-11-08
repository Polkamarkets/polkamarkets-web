/* eslint-disable no-underscore-dangle */
import * as realitioLib from '@reality.eth/reality-eth-lib/formatters/question';
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

  public erc20ContractAddress: string;

  public realitioErc20ContractAddress: string;

  public achievementsContractAddress: string | undefined;

  public votingContractAddress: string | undefined;

  // util functions
  static bytes32ToInt(bytes32Str: string): number {
    return Number(realitioLib.bytes32ToString(bytes32Str, { type: 'int' }));
  }

  static intToBytes32(int: string): number {
    return realitioLib.answerToBytes32(int, { type: 'int' });
  }

  constructor(
    {
      PREDICTION_MARKET_CONTRACT_ADDRESS,
      ERC20_CONTRACT_ADDRESS,
      REALITIO_ERC20_CONTRACT_ADDRESS,
      ACHIEVEMENTS_CONTRACT_ADDRESS,
      VOTING_CONTRACT_ADDRESS,
      WEB3_PROVIDER,
      WEB3_EVENTS_PROVIDER
    }: NetworkConfig = environment.NETWORKS[environment.NETWORK_ID || 42]
  ) {
    this.predictionMarketContractAddress = PREDICTION_MARKET_CONTRACT_ADDRESS;
    this.erc20ContractAddress = ERC20_CONTRACT_ADDRESS;
    this.realitioErc20ContractAddress = REALITIO_ERC20_CONTRACT_ADDRESS;
    this.achievementsContractAddress = ACHIEVEMENTS_CONTRACT_ADDRESS;
    this.votingContractAddress = VOTING_CONTRACT_ADDRESS;

    this.polkamarkets = new polkamarketsjs.Application({
      web3Provider: WEB3_PROVIDER,
      web3EventsProvider: WEB3_EVENTS_PROVIDER
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
  }

  public getPredictionMarketContract() {
    this.contracts.pm = this.polkamarkets.getPredictionMarketContract({
      contractAddress: this.predictionMarketContractAddress
    });
  }

  public getERC20Contract() {
    this.contracts.erc20 = this.polkamarkets.getERC20Contract({
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

  // returns wether wallet is connected to service or not
  public async isLoggedIn(): Promise<boolean> {
    return this.polkamarkets.isLoggedIn();
  }

  public async login() {
    if (this.loggedIn) return true;

    try {
      this.loggedIn = await this.polkamarkets.login();
      // successful login
      if (this.loggedIn) {
        this.address = await this.getAddress();
        // TODO: set this in polkamarkets
        this.polkamarkets.web3.eth.defaultAccount = this.address;
        // re-fetching contracts
        this.getContracts();
      }
    } catch (e) {
      // should be non-blocking
      return false;
    }

    return this.loggedIn;
  }

  public async getAddress(): Promise<string> {
    if (this.address) return this.address;

    return this.polkamarkets.getAddress() || '';
  }

  public async getBalance(): Promise<number> {
    if (!this.address) return 0;

    // returns user balance in ETH
    const balance = await this.polkamarkets.getETHBalance();

    return parseFloat(balance) || 0;
  }

  // PredictionMarket contract functions

  public async getMinimumRequiredBalance(): Promise<number> {
    const requiredBalance = await this.contracts.pm.getMinimumRequiredBalance();

    return requiredBalance;
  }

  public async getMarketFee(): Promise<number> {
    const fee = await this.contracts.pm.getFee();

    return fee;
  }

  public async createMarket(
    name: string,
    image: string,
    duration: number,
    outcomes: Array<string>,
    category: string,
    ethAmount: number
  ) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.pm.createMarket({
      name,
      image,
      duration,
      outcomes,
      category,
      ethAmount,
      oracleAddress: this.address
    });

    return response;
  }

  public async buy(
    marketId: string | number,
    outcomeId: string | number,
    ethAmount: number,
    minOutcomeSharesToBuy: number
  ) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.pm.buy({
      marketId,
      outcomeId,
      ethAmount,
      minOutcomeSharesToBuy
    });

    return response;
  }

  public async sell(
    marketId: string | number,
    outcomeId: string | number,
    ethAmount: number,
    maxOutcomeSharesToSell: number
  ) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.pm.sell({
      marketId,
      outcomeId,
      ethAmount,
      maxOutcomeSharesToSell
    });

    return response;
  }

  public async addLiquidity(marketId: string | number, ethAmount: number) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.pm.addLiquidity({
      marketId,
      ethAmount
    });

    return response;
  }

  public async removeLiquidity(marketId: string | number, shares: number) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.pm.removeLiquidity({
      marketId,
      shares
    });

    return response;
  }

  public async claimWinnings(marketId: string | number) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.pm.claimWinnings({
      marketId
    });

    return response;
  }

  public async claimVoidedOutcomeShares(
    marketId: string | number,
    outcomeId: string | number
  ) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.pm.claimVoidedOutcomeShares({
      marketId,
      outcomeId
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

  public async getMarketPrices(marketId: string | number) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.pm.getMarketPrices({ marketId });

    return response;
  }

  public async getPortfolio(): Promise<Object> {
    // ensuring user has wallet connected
    if (!this.address) return {};

    const response = await this.contracts.pm.getMyPortfolio();

    return response;
  }

  public async getActions(): Promise<any[]> {
    // ensuring user has wallet connected
    if (!this.address) return [];

    const response = await this.contracts.pm.getMyActions();

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

  public async getERC20Balance(): Promise<number> {
    if (!this.address) return 0;

    // TODO improve this: ensuring erc20 contract is initialized
    // eslint-disable-next-line no-underscore-dangle
    await this.contracts.erc20.__init__();

    // returns user balance in ETH
    const balance = await this.contracts.erc20.getTokenAmount(this.address);

    return parseFloat(balance) || 0;
  }

  public async approveERC20(address: string, amount: number): Promise<any[]> {
    // ensuring user has wallet connected
    await this.login();

    // ensuring erc20 contract is initialized
    // eslint-disable-next-line no-underscore-dangle
    await this.contracts.erc20.__init__();

    const response = await this.contracts.erc20.approve({
      address,
      amount
    });

    return response;
  }

  public async calcBuyAmount(
    marketId: string | number,
    outcomeId: string | number,
    ethAmount: number
  ): Promise<number> {
    const response = await this.contracts.pm.calcBuyAmount({
      marketId,
      outcomeId,
      ethAmount
    });

    return response;
  }

  public async calcSellAmount(
    marketId: string | number,
    outcomeId: string | number,
    ethAmount: number
  ): Promise<number> {
    const response = await this.contracts.pm.calcSellAmount({
      marketId,
      outcomeId,
      ethAmount
    });

    return response;
  }

  // Realitio contract functions

  public async isRealitioERC20Approved(): Promise<boolean> {
    if (!this.address) return false;

    // TODO improve this: ensuring erc20 contract is initialized
    // eslint-disable-next-line no-underscore-dangle
    await this.contracts.erc20.__init__();

    // returns user balance in ETH
    const isApproved = await this.contracts.erc20.isApproved({
      address: this.address,
      amount: 1,
      spenderAddress: this.contracts.realitio.getAddress()
    });

    return isApproved;
  }

  public async approveRealitioERC20(): Promise<any> {
    // ensuring user has wallet connected
    await this.login();

    if (!this.address) return false;

    // TODO improve this: ensuring erc20 contract is initialized
    // eslint-disable-next-line no-underscore-dangle
    await this.contracts.erc20.__init__();

    return this.approveERC20(
      this.contracts.realitio.getAddress(),
      2 ** 128 - 1
    );
  }

  public async getQuestionBonds(
    questionId: string,
    user: string | null = null
  ) {
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

  public async getBonds(): Promise<Object> {
    // ensuring user has wallet connected
    if (!this.address) return {};

    const bonds = await this.contracts.realitio.getMyBonds();

    return bonds;
  }

  public async getBondActions(): Promise<Object> {
    // ensuring user has wallet connected
    if (!this.address) return [];

    const response = await this.contracts.realitio.getMyActions();

    return response;
  }

  public async getBondMarketIds(): Promise<string[]> {
    // ensuring user has wallet connected
    if (!this.address) return [];

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
}
