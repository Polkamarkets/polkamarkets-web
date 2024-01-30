function roundNumber(value, decimals) {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

module.exports = {
  roundNumber
};
