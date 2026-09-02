import type {
  WatchlistItem,
  MarketData,
  OHLCBar,
} from '@/types';

export const mockWatchlist: WatchlistItem[] = [
  {
    symbol: 'NVDA',
    price: 178.42,
    change_pct: 2.84,
    regime: 'BULL_TREND',
    trend_strength: 84,
    composite_score: 78,
    iv_rank: 42,
    suggested_strategy: 'BULL_CALL_SPREAD',
    signal: 'STRONG_BUY',
  },
  {
    symbol: 'AAPL',
    price: 229.87,
    change_pct: 1.12,
    regime: 'BULL_TREND',
    trend_strength: 72,
    composite_score: 65,
    iv_rank: 28,
    suggested_strategy: 'COVERED_CALL',
    signal: 'BUY',
  },
  {
    symbol: 'TSLA',
    price: 248.91,
    change_pct: -0.73,
    regime: 'RANGE_BOUND',
    trend_strength: 45,
    composite_score: 12,
    iv_rank: 55,
    suggested_strategy: 'IRON_CONDOR',
    signal: 'HOLD',
  },
  {
    symbol: 'AMD',
    price: 164.23,
    change_pct: 3.45,
    regime: 'BULL_TREND',
    trend_strength: 81,
    composite_score: 72,
    iv_rank: 48,
    suggested_strategy: 'BULL_CALL_SPREAD',
    signal: 'BUY',
  },
  {
    symbol: 'META',
    price: 512.34,
    change_pct: 0.89,
    regime: 'BULL_TREND',
    trend_strength: 68,
    composite_score: 54,
    iv_rank: 35,
    suggested_strategy: 'LONG_CALL',
    signal: 'BUY',
  },
  {
    symbol: 'SPY',
    price: 563.21,
    change_pct: 0.42,
    regime: 'BULL_TREND',
    trend_strength: 63,
    composite_score: 41,
    iv_rank: 22,
    suggested_strategy: 'CASH_SECURED_PUT',
    signal: 'HOLD',
  },
  {
    symbol: 'MSFT',
    price: 418.72,
    change_pct: -1.23,
    regime: 'RANGE_BOUND',
    trend_strength: 38,
    composite_score: -8,
    iv_rank: 31,
    suggested_strategy: 'PROTECTIVE_PUT',
    signal: 'SELL',
  },
  {
    symbol: 'GOOGL',
    price: 167.89,
    change_pct: 1.67,
    regime: 'BULL_TREND',
    trend_strength: 75,
    composite_score: 61,
    iv_rank: 39,
    suggested_strategy: 'BULL_CALL_SPREAD',
    signal: 'BUY',
  },
  {
    symbol: 'AMZN',
    price: 186.45,
    change_pct: 2.14,
    regime: 'BREAKOUT',
    trend_strength: 88,
    composite_score: 82,
    iv_rank: 51,
    suggested_strategy: 'LONG_CALL',
    signal: 'STRONG_BUY',
  },
  {
    symbol: 'NFLX',
    price: 698.12,
    change_pct: -2.31,
    regime: 'BEAR_TREND',
    trend_strength: 59,
    composite_score: -35,
    iv_rank: 62,
    suggested_strategy: 'BEAR_PUT_SPREAD',
    signal: 'SELL',
  },
];

// Generate candlestick bars
function genBars(basePrice: number, count: number = 60): OHLCBar[] {
  const bars: OHLCBar[] = [];
  let price = basePrice * 0.95;
  const now = Date.now();
  for (let i = count; i >= 0; i--) {
    const t = new Date(now - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const open = price;
    const drift = (Math.random() - 0.45) * basePrice * 0.02;
    const close = open + drift;
    const high = Math.max(open, close) + Math.random() * basePrice * 0.01;
    const low = Math.min(open, close) - Math.random() * basePrice * 0.01;
    const volume = Math.floor(30_000_000 + Math.random() * 50_000_000);
    bars.push({
      t,
      o: Math.round(open * 100) / 100,
      h: Math.round(high * 100) / 100,
      l: Math.round(low * 100) / 100,
      c: Math.round(close * 100) / 100,
      v: volume,
    });
    price = close;
  }
  return bars;
}

const marketDataCache: Record<string, MarketData> = {};

export function getMockMarketData(symbol: string): MarketData {
  if (marketDataCache[symbol]) return marketDataCache[symbol];

  const wl = mockWatchlist.find((w) => w.symbol === symbol);
  const price = wl?.price ?? 100;
  const prevClose = price * (1 - (wl?.change_pct ?? 0) / 100);
  const change = price - prevClose;

  const data: MarketData = {
    symbol,
    price,
    prev_close: Math.round(prevClose * 100) / 100,
    change: Math.round(change * 100) / 100,
    change_pct: wl?.change_pct ?? 0,
    indicators: {
      sma20: Math.round(price * 0.98 * 100) / 100,
      sma50: Math.round(price * 0.95 * 100) / 100,
      ema20: Math.round(price * 0.99 * 100) / 100,
      ema50: Math.round(price * 0.96 * 100) / 100,
      rsi: Math.round((wl ? 40 + wl.composite_score * 0.4 : 50) * 10) / 10,
      atr: Math.round(price * 0.025 * 100) / 100,
      atr_pct: 2.5,
      macd: Math.round((wl ? wl.composite_score * 0.01 : 0) * 1000) / 1000,
      macd_hist: Math.round((wl ? wl.composite_score * 0.005 : 0) * 1000) / 1000,
      bb_percent_b: Math.round((wl ? 0.5 + wl.composite_score * 0.004 : 0.5) * 100) / 100,
      adx: wl?.trend_strength ?? 50,
      volume_ratio: Math.round((0.8 + Math.random() * 0.8) * 100) / 100,
      vwap20: Math.round(price * 0.99 * 100) / 100,
      support20: Math.round(price * 0.94 * 100) / 100,
      resistance20: Math.round(price * 1.06 * 100) / 100,
      volatility: Math.round((15 + Math.random() * 30) * 100) / 100,
    },
    regime: {
      regime: wl?.regime ?? 'RANGE_BOUND',
      trend_strength: wl?.trend_strength ?? 50,
      description:
        wl?.regime === 'BULL_TREND'
          ? 'Sustained uptrend with above-average momentum'
          : wl?.regime === 'BEAR_TREND'
          ? 'Downtrend with bearish momentum building'
          : wl?.regime === 'BREAKOUT'
          ? 'Breaking out of consolidation range'
          : 'Consolidation with no clear directional bias',
    },
    score: {
      composite: wl?.composite_score ?? 0,
      components: {
        trend: Math.round((wl?.trend_strength ?? 50) * 0.8),
        momentum: Math.round((wl?.composite_score ?? 0) * 0.7),
        rsi: Math.round((wl ? 40 + wl.composite_score * 0.4 : 50) * 0.6),
        macd: Math.round((wl?.composite_score ?? 0) * 0.5),
        volume: Math.round((wl?.composite_score ?? 0) * 0.3),
        volatility: Math.round((50 - (wl?.iv_rank ?? 50)) * 0.4),
        adx: Math.round((wl?.trend_strength ?? 50) * 0.6),
        regime: Math.round((wl?.composite_score ?? 0) * 0.5),
      },
      notes:
        (wl?.composite_score ?? 0) > 50
          ? 'Multiple bullish signals aligned — high conviction setup'
          : (wl?.composite_score ?? 0) < -20
          ? 'Bearish signals dominant — consider defensive strategies'
          : 'Mixed signals — neutral stance recommended',
    },
    signals:
      wl?.signal === 'STRONG_BUY'
        ? ['Bullish MACD crossover', 'Price above SMA20 & SMA50', 'Volume expansion', 'ADX > 25']
        : wl?.signal === 'BUY'
        ? ['Price above SMA20', 'Positive MACD histogram', 'RSI in neutral zone']
        : wl?.signal === 'SELL'
        ? ['Bearish MACD', 'Price below SMA20', 'RSI overbought']
        : ['Price near VWAP', 'RSI neutral', 'No strong signal'],
    iv_rank: wl?.iv_rank ?? 40,
    bars: genBars(price),
  };

  marketDataCache[symbol] = data;
  return data;
}
