import type { AgentStage } from '@/types';

export interface AgentLogEntry {
  id: string;
  ts: string;
  agent: AgentStage;
  message: string;
  level: 'info' | 'success' | 'warn' | 'error';
}

const now = Date.now();

export const mockAgentLog: AgentLogEntry[] = [
  { id: 'log_001', ts: new Date(now - 5 * 1000).toISOString(), agent: 'EXECUTION', message: 'Order filled: NVDA BULL_CALL_SPREAD 178/185 x2 @ $2.10 net debit', level: 'success' },
  { id: 'log_002', ts: new Date(now - 12 * 1000).toISOString(), agent: 'EXECUTION', message: 'Submitting MLEG order to Alpaca via MCP...', level: 'info' },
  { id: 'log_003', ts: new Date(now - 18 * 1000).toISOString(), agent: 'RISK_MANAGER', message: 'APPROVED · max loss $420 (0.42% equity) · exposure 21% < 25% limit', level: 'success' },
  { id: 'log_004', ts: new Date(now - 25 * 1000).toISOString(), agent: 'OPTIONS_STRATEGIST', message: 'Bull Call Spread 178/185 · 24 DTE · R/R 1:1.62 · IV rank 42%', level: 'info' },
  { id: 'log_005', ts: new Date(now - 32 * 1000).toISOString(), agent: 'OPPORTUNITY_SCANNER', message: 'NVDA · composite 78 · 6/8 bullish components · BULL_TREND regime', level: 'info' },
  { id: 'log_006', ts: new Date(now - 38 * 1000).toISOString(), agent: 'MARKET_ANALYST', message: 'NVDA · BULL_TREND · ADX 31 · conf 84% · RSI 68 · vol ratio 1.4x', level: 'info' },
  { id: 'log_007', ts: new Date(now - 45 * 1000).toISOString(), agent: 'RISK_MANAGER', message: 'REJECTED · TSLA STRADDLE · exposure would exceed 25% limit (27.2%)', level: 'error' },
  { id: 'log_008', ts: new Date(now - 52 * 1000).toISOString(), agent: 'OPTIONS_STRATEGIST', message: 'TSLA · STRADDLE evaluated · IV rank 55% — long volatility too expensive', level: 'warn' },
  { id: 'log_009', ts: new Date(now - 60 * 1000).toISOString(), agent: 'OPPORTUNITY_SCANNER', message: 'TSLA · composite 12 · RANGE_BOUND regime · no strong directional edge', level: 'warn' },
  { id: 'log_010', ts: new Date(now - 68 * 1000).toISOString(), agent: 'MARKET_ANALYST', message: 'TSLA · RANGE_BOUND · ADX 18 · RSI 51 · vol ratio 0.9x', level: 'info' },
  { id: 'log_011', ts: new Date(now - 75 * 1000).toISOString(), agent: 'RISK_MANAGER', message: 'REJECTED · MSFT LONG_CALL · DTE 5 < min 7 · bearish signal contradicts strategy', level: 'error' },
  { id: 'log_012', ts: new Date(now - 82 * 1000).toISOString(), agent: 'PORTFOLIO_MONITOR', message: 'AAPL COVERED_CALL · unrealized +$35 (+11.1%) · theta working in favor', level: 'success' },
  { id: 'log_013', ts: new Date(now - 90 * 1000).toISOString(), agent: 'PORTFOLIO_MONITOR', message: 'NFLX BEAR_PUT_SPREAD · unrealized +$270 (+50.0%) · near max profit', level: 'success' },
  { id: 'log_014', ts: new Date(now - 98 * 1000).toISOString(), agent: 'PORTFOLIO_MONITOR', message: 'AMD BULL_CALL_SPREAD · unrealized +$180 (+26.1%) · on track', level: 'info' },
  { id: 'log_015', ts: new Date(now - 105 * 1000).toISOString(), agent: 'MARKET_ANALYST', message: 'AMZN · BREAKOUT · ADX 88 · conf 88% · vol ratio 1.8x · composite 82', level: 'info' },
  { id: 'log_016', ts: new Date(now - 112 * 1000).toISOString(), agent: 'OPPORTUNITY_SCANNER', message: 'AMZN · composite 82 · breakout confirmed · 7/8 bullish components', level: 'success' },
  { id: 'log_017', ts: new Date(now - 120 * 1000).toISOString(), agent: 'OPTIONS_STRATEGIST', message: 'AMZN · LONG_CALL evaluated · IV rank 51% · DTE 21 · R/R 1:1.8', level: 'info' },
  { id: 'log_018', ts: new Date(now - 128 * 1000).toISOString(), agent: 'RISK_MANAGER', message: 'REJECTED · AMZN LONG_CALL · max position size would exceed $2,000 limit', level: 'error' },
  { id: 'log_019', ts: new Date(now - 135 * 1000).toISOString(), agent: 'PORTFOLIO_MONITOR', message: 'Portfolio delta 0.42 · theta -$0.149/day · vega 0.284 · exposure 21.4%', level: 'info' },
  { id: 'log_020', ts: new Date(now - 142 * 1000).toISOString(), agent: 'MARKET_ANALYST', message: 'Cycle #47 complete · scanning 10 symbols · 2 opportunities detected', level: 'info' },
  { id: 'log_021', ts: new Date(now - 150 * 1000).toISOString(), agent: 'RISK_MANAGER', message: 'REJECTED · GOOGL BULL_CALL_SPREAD · buying power insufficient for 4-leg spread', level: 'error' },
  { id: 'log_022', ts: new Date(now - 158 * 1000).toISOString(), agent: 'OPTIONS_STRATEGIST', message: 'GOOGL · BULL_CALL_SPREAD 165/170 · 28 DTE · IV rank 39%', level: 'info' },
  { id: 'log_023', ts: new Date(now - 165 * 1000).toISOString(), agent: 'OPPORTUNITY_SCANNER', message: 'GOOGL · composite 61 · BULL_TREND · 5/8 bullish components', level: 'info' },
  { id: 'log_024', ts: new Date(now - 172 * 1000).toISOString(), agent: 'MARKET_ANALYST', message: 'GOOGL · BULL_TREND · ADX 25 · conf 75% · RSI 62 · vol ratio 1.1x', level: 'info' },
  { id: 'log_025', ts: new Date(now - 180 * 1000).toISOString(), agent: 'EXECUTION', message: 'Order filled: AMD BULL_CALL_SPREAD 162/168 x3 @ $1.90 net debit', level: 'success' },
];

// Generate new log entries for the live feed simulation
const sampleMessages: Omit<AgentLogEntry, 'id' | 'ts'>[] = [
  { agent: 'MARKET_ANALYST', message: 'NVDA · BULL_TREND · ADX 32 · conf 85% · RSI 69 · vol ratio 1.5x', level: 'info' },
  { agent: 'OPPORTUNITY_SCANNER', message: 'NVDA · composite 80 · 7/8 bullish components · opportunity confirmed', level: 'success' },
  { agent: 'OPTIONS_STRATEGIST', message: 'NVDA · BULL_CALL_SPREAD 180/185 · 21 DTE · R/R 1:1.55 · IV rank 44%', level: 'info' },
  { agent: 'RISK_MANAGER', message: 'APPROVED · max loss $380 (0.38% equity) · exposure 21.8% < 25% limit', level: 'success' },
  { agent: 'EXECUTION', message: 'Submitting MLEG order to Alpaca via MCP...', level: 'info' },
  { agent: 'EXECUTION', message: 'Order filled: NVDA BULL_CALL_SPREAD 180/185 x2 @ $1.90 net debit', level: 'success' },
  { agent: 'RISK_MANAGER', message: 'REJECTED · TSLA STRANGLE · IV rank 55% — long volatility too expensive', level: 'error' },
  { agent: 'PORTFOLIO_MONITOR', message: 'Portfolio delta 0.44 · theta -$0.152/day · vega 0.291 · exposure 21.8%', level: 'info' },
  { agent: 'MARKET_ANALYST', message: 'AMZN · BREAKOUT · ADX 89 · conf 88% · vol ratio 1.9x · composite 82', level: 'info' },
  { agent: 'OPPORTUNITY_SCANNER', message: 'AMZN · composite 82 · breakout confirmed · 7/8 bullish components', level: 'success' },
  { agent: 'RISK_MANAGER', message: 'REJECTED · AMZN LONG_CALL · max position size would exceed $2,000 limit', level: 'error' },
  { agent: 'PORTFOLIO_MONITOR', message: 'NFLX BEAR_PUT_SPREAD · unrealized +$280 (+51.9%) · near max profit', level: 'success' },
  { agent: 'MARKET_ANALYST', message: 'Cycle #48 complete · scanning 10 symbols · 1 opportunity detected', level: 'info' },
  { agent: 'RISK_MANAGER', message: 'REJECTED · SPY IRON_CONDOR · max position size would exceed $2,000 limit', level: 'error' },
  { agent: 'OPTIONS_STRATEGIST', message: 'META · LONG_CALL 510 · 28 DTE · IV rank 35% · R/R 1:1.9', level: 'info' },
];

let logCounter = 100;

export function genNewLogEntry(): AgentLogEntry {
  const msg = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
  return {
    id: `log_${logCounter++}`,
    ts: new Date().toISOString(),
    ...msg,
  };
}
