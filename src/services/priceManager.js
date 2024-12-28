const { calculateSpread, formatPrice } = require('../utils/priceUtils');

class PriceManager {
  constructor() {
    this.prices = new Map();
  }

  updatePrice(symbol, price) {
    const spread = calculateSpread(price);
    const mt4Symbol = symbol.replace('USDT', 'USD');
    
    this.prices.set(mt4Symbol, {
      bid: formatPrice(price),
      ask: formatPrice(Number(price) + spread)
    });

    return mt4Symbol;
  }

  getPrice(symbol) {
    return this.prices.get(symbol);
  }

  getAllPrices() {
    return Object.fromEntries(this.prices);
  }
}

module.exports = new PriceManager();