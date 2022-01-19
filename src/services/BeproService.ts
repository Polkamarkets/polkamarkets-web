import * as realitioLib from '@reality.eth/reality-eth-lib/formatters/question';
import * as beprojs from 'bepro-js';

export default class BeproService {
  // bepro app
  public bepro: any;

  // bepro smart contract instances
  public contracts: any = {};

  // indicates if user has already done a successful metamask login
  public loggedIn: boolean = false;

  // user eth address
  public address: string = '';

  // util functions
  static bytes32ToInt(bytes32Str: string): number {
    return Number(realitioLib.bytes32ToString(bytes32Str, { type: 'int' }));
  }

  static intToBytes32(int: string): number {
    return realitioLib.answerToBytes32(int, { type: 'int' });
  }

  constructor() {
    this.bepro = new beprojs.Application({
      web3Provider: process.env.REACT_APP_WEB3_PROVIDER,
      web3EventsProvider: process.env.REACT_APP_WEB3_EVENTS_PROVIDER,
    });
    this.bepro.start();
    // fetching contract
    this.getContracts();
  }

  public async getContracts() {
    this.getPredictionMarketContract();
    this.getRealitioERC20Contract();
    this.getERC20Contract();
    this.governanceContract();
  }

  public getPredictionMarketContract() {
    this.contracts.pm = this.bepro.getPredictionMarketContract({
      contractAddress: process.env.REACT_APP_PREDICTION_MARKET_CONTRACT_ADDRESS
    });
  }

  public getERC20Contract() {
    this.contracts.erc20 = this.bepro.getERC20Contract({
      contractAddress: process.env.REACT_APP_ERC20_CONTRACT_ADDRESS
    });
  }

  public governanceContract() {
    this.contracts.governance = this.bepro.getERC20Contract({
      contractAddress: process.env.REACT_APP_GOVERNANCE_CONTRACT_ADDRESS
    });
  }

  public getRealitioERC20Contract() {
    this.contracts.realitio = this.bepro.getRealitioERC20Contract({
      contractAddress: process.env.REACT_APP_REALITIO_ERC20_CONTRACT_ADDRESS
    });
  }

  // returns wether wallet is connected to service or not
  public async isLoggedIn(): Promise<boolean> {
    return this.bepro.isLoggedIn();
  }

  public async login() {
    if (this.loggedIn) return true;

    try {
      this.loggedIn = await this.bepro.login();
      // successful login
      if (this.loggedIn) {
        this.address = await this.getAddress();
        // TODO: set this in bepro
        this.bepro.web3.eth.defaultAccount = this.address;
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

    return this.bepro.getAddress() || '';
  }

  public async getBalance(): Promise<number> {
    if (!this.address) return 0;

    // returns user balance in ETH
    const balance = await this.bepro.getETHBalance();

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

  public async getGovernanceBalance(): Promise<number> {
    if (!this.address) return 0;

    // TODO improve this: ensuring erc20 contract is initialized
    // eslint-disable-next-line no-underscore-dangle
    await this.contracts.governance.__init__();

    // returns user balance in ETH
    const balance = await this.contracts.governance.getTokenAmount(this.address);

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

  public async getQuestion(questionId: string): Promise<Object> {
    const question = await this.contracts.realitio.getQuestion({ questionId });

    return question;
  }
}
