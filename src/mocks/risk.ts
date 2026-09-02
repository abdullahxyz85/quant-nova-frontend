import type {
  RiskData,
  RiskGate,
  RiskRejection,
  OptionsChain,
  ChainStrike,
  BacktestResult,
  BacktestEquityPoint,
} from '@/types';

// ---- Risk ----

export const mockRiskData: RiskData = {
  gates: [
    { name: 'Portfolio Delta', value: 0.42, limit: 0.50, unit: 'Δ', status: 'OK' },
    { name: 'Net Theta', value: -0.149, limit: -0.25, unit: '$/day', status: 'OK' },
    { name: 'Max Position Size', value: 580, limit: 2000, unit: '$', status: 'OK' },
    { name: 'Portfolio Exposure', value: 21.4, limit: 25, unit: '%', status: 'WARN' },
    { name: 'Daily Loss Used', value: 1.2, limit: 3, unit: '%', status: 'OK' },
    { name: 'Buying Power Used', value: 50.0, limit: 80, unit: '%', status: 'OK' },
    { name: 'Min DTE', value: 5, limit: 7, unit: 'days', status: 'BREACH' },
    { name: 'Max Loss/Trade', value: 420, limit: 1000, unit: '$', status: 'OK' },
  ],
  portfolio_greeks: {
    delta: 0.42,
    gamma: 0.082,
    theta: -0.149,
    vega: 0.284,
  },
  exposure_pct: 21.4,
  daily_loss_used_pct: 1.2,
  buying_power_used_pct: 50.0,
  rejections_today: [
    { ts: new Date(Date.now() - 30 * 1000).toISOString(), symbol: 'TSLA', strategy: 'STRADDLE', reason: 'Portfolio exposure limit exceeded (27.2% > 25%)' },
    { ts: new Date(Date.now() - 45 * 1000).toISOString(), symbol: 'MSFT', strategy: 'LONG_CALL', reason: 'DTE 5 below minimum 7 and bearish signal contradicts bullish strategy' },
    { ts: new Date(Date.now() - 2 * 60 * 1000).toISOString(), symbol: 'TSLA', strategy: 'STRANGLE', reason: 'IV rank 55% — long volatility too expensive' },
    { ts: new Date(Date.now() - 8 * 60 * 1000).toISOString(), symbol: 'NFLX', strategy: 'LONG_CALL', reason: 'Signal SELL contradicts LONG_CALL direction' },
    { ts: new Date(Date.now() - 15 * 60 * 1000).toISOString(), symbol: 'SPY', strategy: 'IRON_CONDOR', reason: 'Max position size would exceed $2,000 limit' },
    { ts: new Date(Date.now() - 22 * 60 * 1000).toISOString(), symbol: 'GOOGL', strategy: 'BULL_CALL_SPREAD', reason: 'Buying power insufficient for 4-leg spread' },
    { ts: new Date(Date.now() - 35 * 60 * 1000).toISOString(), symbol: 'AMD', strategy: 'STRADDLE', reason: 'IV rank 48% — long volatility not optimal' },
  ],
};

// ---- Options Chain ----

function genChain(symbol: string, underlyingPrice: number): OptionsChain {
  const expiries = ['2026-01-17', '2026-02-21', '2026-03-21', '2026-04-18'];
  const atmStrike = Math.round(underlyingPrice);
  const strikes: ChainStrike[] = [];
  const numStrikes = 21;
  const strikeStep = underlyingPrice > 300 ? 5 : underlyingPrice > 150 ? 2.5 : 1;

  for (let i = 0; i < numStrikes; i++) {
    const offset = i - Math.floor(numStrikes / 2);
    const strike = Math.round((atmStrike + offset * strikeStep) * 100) / 100;
    const moneyness = (underlyingPrice - strike) / underlyingPrice;
    const distFromATM = Math.abs(offset) / Math.floor(numStrikes / 2);

    // IV increases with distance from ATM (smile)
    const baseIV = 28 + Math.abs(moneyness) * 80 + (Math.random() - 0.5) * 5;
    const callITM = underlyingPrice > strike;
    const putITM = underlyingPrice < strike;

    // Delta
    const callDelta = Math.round((callITM ? 1 - distFromATM * 0.8 : distFromATM * 0.2) * 100) / 100;
    const putDelta = Math.round((putITM ? -(1 - distFromATM * 0.8) : -distFromATM * 0.2) * 100) / 100;

    // Volume and OI decrease with distance from ATM
    const volDecay = 1 - distFromATM * 0.7;
    const callVol = Math.floor(500 * volDecay + Math.random() * 200);
    const putVol = Math.floor(500 * volDecay + Math.random() * 200);
    const callOI = Math.floor(2000 * volDecay + Math.random() * 1000);
    const putOI = Math.floor(2000 * volDecay + Math.random() * 1000);

    // Price (premium)
    const intrinsicCall = Math.max(0, underlyingPrice - strike);
    const intrinsicPut = Math.max(0, strike - underlyingPrice);
    const timeValue = underlyingPrice * 0.02 * (1 - distFromATM * 0.5);

    const callMid = Math.round((intrinsicCall + timeValue) * 100) / 100;
    const putMid = Math.round((intrinsicPut + timeValue) * 100) / 100;
    const spread = 0.05;

    const callTheta = Math.round(-underlyingPrice * 0.001 * (1 - distFromATM * 0.3) * 100) / 100;
    const putTheta = Math.round(-underlyingPrice * 0.001 * (1 - distFromATM * 0.3) * 100) / 100;

    strikes.push({
      strike,
      call: {
        bid: Math.round((callMid - spread) * 100) / 100,
        ask: Math.round((callMid + spread) * 100) / 100,
        last: Math.round((callMid + (Math.random() - 0.5) * 0.1) * 100) / 100,
        volume: callVol,
        oi: callOI,
        iv: Math.round(baseIV * 10) / 10,
        delta: callDelta,
        theta: callTheta,
      },
      put: {
        bid: Math.round((putMid - spread) * 100) / 100,
        ask: Math.round((putMid + spread) * 100) / 100,
        last: Math.round((putMid + (Math.random() - 0.5) * 0.1) * 100) / 100,
        volume: putVol,
        oi: putOI,
        iv: Math.round((baseIV + 1.5) * 10) / 10,
        delta: putDelta,
        theta: putTheta,
      },
    });
  }

  return { symbol, underlying_price: underlyingPrice, expiries, strikes };
}

const chainCache: Record<string, OptionsChain> = {};

export function getMockChain(symbol: string): OptionsChain {
  if (!chainCache[symbol]) {
    const prices: Record<string, number> = {
      NVDA: 178.42, AAPL: 229.87, TSLA: 248.91, AMD: 164.23,
      META: 512.34, SPY: 563.21, MSFT: 418.72, GOOGL: 167.89,
      AMZN: 186.45, NFLX: 698.12,
    };
    chainCache[symbol] = genChain(symbol, prices[symbol] ?? 100);
  }
  return chainCache[symbol];
}

// ---- Backtest ----

function genBacktestEquity(
  returnPct: number,
  benchmarkPct: number,
  numPoints = 250,
): BacktestEquityPoint[] {
  const points: BacktestEquityPoint[] = [];
  let strategy = 10000;
  let benchmark = 10000;
  const now = Date.now();
  const interval = 1 * 24 * 60 * 60 * 1000;

  for (let i = numPoints; i >= 0; i--) {
    const ts = new Date(now - i * interval).toISOString().slice(0, 10);
    const stratDrift = returnPct / 100 / numPoints;
    const benchDrift = benchmarkPct / 100 / numPoints;
    strategy += strategy * (stratDrift + (Math.random() - 0.5) * 0.01);
    benchmark += benchmark * (benchDrift + (Math.random() - 0.5) * 0.008);
    points.push({
      ts,
      strategy: Math.round(strategy * 100) / 100,
      benchmark: Math.round(benchmark * 100) / 100,
    });
  }
  return points;
}

export const mockBacktestResults: Record<string, BacktestResult> = {
  oos: {
    segment: 'oos',
    period: '2025-06-01 to 2025-12-31',
    return_pct: 18.4,
    win_rate: 64.2,
    profit_factor: 1.82,
    sharpe: 1.34,
    max_drawdown_pct: -8.7,
    trades: 142,
    alpha_pct: 6.8,
    equity_curve: genBacktestEquity(18.4, 11.6),
  },
  validation: {
    segment: 'validation',
    period: '2025-01-01 to 2025-05-31',
    return_pct: 12.1,
    win_rate: 61.0,
    profit_factor: 1.65,
    sharpe: 1.21,
    max_drawdown_pct: -6.2,
    trades: 98,
    alpha_pct: 4.2,
    equity_curve: genBacktestEquity(12.1, 7.9),
  },
  train: {
    segment: 'train',
    period: '2024-01-01 to 2024-12-31',
    return_pct: 24.8,
    win_rate: 67.5,
    profit_factor: 2.1,
    sharpe: 1.56,
    max_drawdown_pct: -5.1,
    trades: 287,
    alpha_pct: 9.4,
    equity_curve: genBacktestEquity(24.8, 15.3),
  },
};
