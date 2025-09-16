// Trading Data Service - Handles cryptocurrency and market data
export class TradingService {
  private cryptoApiUrl = 'https://api.coingecko.com/api/v3';

  /**
   * Get current cryptocurrency price
   */
  async getCryptoPrice(symbol: string): Promise<any> {
    try {
      console.log(`💰 Fetching price for: ${symbol}`);
      
      // Simulate API delay
      await this.delay(800 + Math.random() * 1200);

      const price = this.generateCryptoPrice(symbol);
      const change24h = (Math.random() - 0.5) * 20; // Random change between -10% to +10%

      return {
        symbol: symbol.toLowerCase(),
        name: this.getCryptoName(symbol),
        price: price,
        priceUSD: price,
        change24h: change24h,
        changePercent24h: change24h,
        volume24h: Math.random() * 1000000000,
        marketCap: price * Math.random() * 100000000,
        timestamp: new Date().toISOString(),
        currency: 'USD'
      };
    } catch (error) {
      throw new Error(`Failed to fetch crypto price: ${error}`);
    }
  }

  /**
   * Get cryptocurrency price history
   */
  async getCryptoPriceHistory(symbol: string, days: number = 7): Promise<any> {
    await this.delay(1000);

    const basePrice = this.generateCryptoPrice(symbol);
    const history = [];

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate realistic price movement
      const volatility = 0.05; // 5% daily volatility
      const change = (Math.random() - 0.5) * volatility * 2;
      const price = basePrice * (1 + change * i / days);
      
      history.push({
        date: date.toISOString().split('T')[0],
        timestamp: date.getTime(),
        price: Math.round(price * 100) / 100,
        volume: Math.random() * 1000000000,
        high: price * (1 + Math.random() * 0.02),
        low: price * (1 - Math.random() * 0.02),
        open: price * (1 + (Math.random() - 0.5) * 0.01),
        close: price
      });
    }

    return {
      symbol: symbol.toLowerCase(),
      period: `${days} days`,
      data: history,
      analysis: {
        minPrice: Math.min(...history.map(h => h.price)),
        maxPrice: Math.max(...history.map(h => h.price)),
        avgPrice: history.reduce((sum, h) => sum + h.price, 0) / history.length,
        totalVolume: history.reduce((sum, h) => sum + h.volume, 0),
        priceChange: history[history.length - 1].price - history[0].price,
        priceChangePercent: ((history[history.length - 1].price - history[0].price) / history[0].price) * 100
      }
    };
  }

  /**
   * Get market data for multiple symbols
   */
  async getMarketData(symbols: string[]): Promise<any> {
    await this.delay(1200);

    const marketData = await Promise.all(
      symbols.map(async symbol => await this.getCryptoPrice(symbol))
    );

    const totalMarketCap = marketData.reduce((sum, data) => sum + (data.marketCap || 0), 0);
    const totalVolume = marketData.reduce((sum, data) => sum + (data.volume24h || 0), 0);

    return {
      symbols: symbols,
      data: marketData,
      marketOverview: {
        totalMarketCap,
        totalVolume24h: totalVolume,
        averageChange24h: marketData.reduce((sum, data) => sum + data.change24h, 0) / marketData.length,
        topPerformer: marketData.reduce((best, current) => 
          current.change24h > best.change24h ? current : best
        ),
        worstPerformer: marketData.reduce((worst, current) => 
          current.change24h < worst.change24h ? current : worst
        )
      },
      timestamp: new Date().toISOString()
    };
  }

  // Helper methods
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateCryptoPrice(symbol: string): number {
    const basePrices = {
      'btc': 45000,
      'eth': 3200,
      'ada': 0.45,
      'dot': 7.8,
      'link': 15.6,
      'uni': 6.2,
      'aave': 85.0,
      'comp': 58.0
    };

    const cleanSymbol = symbol.toLowerCase().replace(/-usd$/, '');
    const basePrice = basePrices[cleanSymbol] || Math.random() * 100;
    
    // Add some random variation
    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
    return Math.round(basePrice * (1 + variation) * 100) / 100;
  }

  private getCryptoName(symbol: string): string {
    const names = {
      'btc': 'Bitcoin',
      'eth': 'Ethereum',
      'ada': 'Cardano',
      'dot': 'Polkadot',
      'link': 'Chainlink',
      'uni': 'Uniswap',
      'aave': 'Aave',
      'comp': 'Compound'
    };

    const cleanSymbol = symbol.toLowerCase().replace(/-usd$/, '');
    return names[cleanSymbol] || symbol.toUpperCase();
  }
}