// Utility functions for price calculations and formatting

function calculateSpread(price, spreadPercentage = 0.0001) {
  return price * spreadPercentage;
}

function formatPrice(price, digits = 2) {
  return Number(price).toFixed(digits);
}

module.exports = {
  calculateSpread,
  formatPrice
};