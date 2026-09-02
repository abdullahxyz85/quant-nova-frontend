// =====================================================
// HRAMY OMNI AI — API Contract Types
// =====================================================

export type AgentStage =
  | 'MARKET_ANALYST'
  | 'OPPORTUNITY_SCANNER'
  | 'OPTIONS_STRATEGIST'
  | 'RISK_MANAGER'
  | 'EXECUTION'
  | 'PORTFOLIO_MONITOR';

export type AgentMode = 'AUTO' | 'PAUSED';

export type OptionsLevel = 'L1' | 'L2' | 'L3' | 'L4';

export type ConnectionStatus = 'connected' | 'degraded' | 'down';

export type Regime =
  | 'BULL_TREND'
  | 'BEAR_TREND'
  | 'RANGE_BOUND'
  | 'HIGH_VOL'
  | 'LOW_VOL'
  | 'BREAKOUT';

export type StrategyType =
  | 'BULL_CALL_SPREAD'
  | 'BEAR_PUT_SPREAD'
  | 'LONG_CALL'
  | 'LONG_PUT'
  | 'COVERED_CALL'
  | 'PROTECTIVE_PUT'
  | 'IRON_CONDOR'
  | 'STRADDLE'
  | 'STRANGLE'
  | 'CASH_SECURED_PUT';

export type Signal =
  | 'STRONG_BUY'
  | 'BUY'
  | 'HOLD'
  | 'SELL'
  | 'STRONG_SELL'
  | 'WATCH';

// ---------- Account ----------

export interface Account {
  account_id: string;
  equity: number;
  cash: number;
  buying_power: number;
  options_buying_power: number;
  starting_equity: number;
  total_pnl: number;
  total_pnl_pct: number;
  day_pnl: number;
  day_pnl_pct: number;
  options_level: OptionsLevel;
}

// ---------- Agent Status ----------

export interface AgentStatus {
  running: boolean;
  mode: AgentMode;
  current_stage: AgentStage;
  last_cycle_at: string;
  next_cycle_at: string;
  cycles_today: number;
  decisions_today: number;
  orders_today: number;
  blocked_today: number;
}

// ---------- Watchlist ----------

export interface WatchlistItem {
  symbol: string;
  price: number;
  change_pct: number;
  regime: Regime;
  trend_strength: number;
  composite_score: number;
  iv_rank: number;
  suggested_strategy: StrategyType;
  signal: Signal;
}

// ---------- Market Data ----------

export interface MarketIndicators {
  sma20: number;
  sma50: number;
  ema20: number;
  ema50: number;
  rsi: number;
  atr: number;
  atr_pct: number;
  macd: number;
  macd_hist: number;
  bb_percent_b: number;
  adx: number;
  volume_ratio: number;
  vwap20: number;
  support20: number;
  resistance20: number;
  volatility: number;
}

export interface MarketRegime {
  regime: Regime;
  trend_strength: number;
  description: string;
}

export interface ScoreComponents {
  trend: number;
  momentum: number;
  rsi: number;
  macd: number;
  volume: number;
  volatility: number;
  adx: number;
  regime: number;
}

export interface MarketScore {
  composite: number;
  components: ScoreComponents;
  notes: string;
}

export interface OHLCBar {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

export interface MarketData {
  symbol: string;
  price: number;
  prev_close: number;
  change: number;
  change_pct: number;
  indicators: MarketIndicators;
  regime: MarketRegime;
  score: MarketScore;
  signals: string[];
  iv_rank: number;
  bars: OHLCBar[];
}

// ---------- Decisions ----------

export interface RiskVerdict {
  allowed: boolean;
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  reason: string;
}

export interface Decision {
  id: string;
  ts: string;
  symbol: string;
  agent_stage: AgentStage;
  decision: string;
  confidence: number;
  risk: string;
  strategy_type: StrategyType | null;
  reason: string;
  key_factors: string[];
  invalidations: string[];
  risk_verdict: RiskVerdict | null;
  order_id: string | null;
}

// ---------- Positions ----------

export interface OptionLeg {
  option_symbol: string;
  side: 'BUY' | 'SELL';
  strike: number;
  expiry: string;
  type: 'CALL' | 'PUT';
  qty: number;
  avg_price: number;
  mark: number;
}

export interface PositionGreeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

export interface PayoffPoint {
  underlying_price: number;
  pnl: number;
}

export interface Position {
  id: string;
  underlying: string;
  strategy_type: StrategyType;
  opened_at: string;
  dte: number;
  legs: OptionLeg[];
  net_debit_credit: number;
  market_value: number;
  unrealized_pnl: number;
  unrealized_pnl_pct: number;
  max_profit: number;
  max_loss: number;
  breakevens: number[];
  greeks: PositionGreeks;
  payoff: PayoffPoint[];
  opening_reason: string;
}

// ---------- Orders ----------

export interface Order {
  id: string;
  ts: string;
  status: 'FILLED' | 'PENDING' | 'CANCELLED' | 'REJECTED' | 'PARTIAL';
  underlying: string;
  order_class: string;
  side: 'BUY' | 'SELL';
  qty: number;
  filled_avg_price: number;
  legs: OptionLeg[];
  alpaca_order_id: string;
}

// ---------- Equity Curve ----------

export interface EquityCurvePoint {
  ts: string;
  equity: number;
  baseline: number;
}

// ---------- Risk ----------

export type GateStatus = 'OK' | 'WARN' | 'BREACH';

export interface RiskGate {
  name: string;
  value: number;
  limit: number;
  unit: string;
  status: GateStatus;
}

export interface PortfolioGreeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

export interface RiskRejection {
  ts: string;
  symbol: string;
  strategy: string;
  reason: string;
}

export interface RiskData {
  gates: RiskGate[];
  portfolio_greeks: PortfolioGreeks;
  exposure_pct: number;
  daily_loss_used_pct: number;
  buying_power_used_pct: number;
  rejections_today: RiskRejection[];
}

// ---------- Trades ----------

export interface Trade {
  id: string;
  underlying: string;
  strategy_type: StrategyType;
  entry_ts: string;
  exit_ts: string;
  net_pnl: number;
  return_pct: number;
  holding_days: number;
  exit_reason: string;
}

// ---------- Options Chain ----------

export interface ChainOption {
  bid: number;
  ask: number;
  last: number;
  volume: number;
  oi: number;
  iv: number;
  delta: number;
  theta: number;
}

export interface ChainStrike {
  strike: number;
  call: ChainOption;
  put: ChainOption;
}

export interface OptionsChain {
  symbol: string;
  underlying_price: number;
  expiries: string[];
  strikes: ChainStrike[];
}

// ---------- Backtest ----------

export type BacktestSegment = 'oos' | 'validation' | 'train';

export interface BacktestEquityPoint {
  ts: string;
  strategy: number;
  benchmark: number;
}

export interface BacktestResult {
  segment: BacktestSegment;
  period: string;
  return_pct: number;
  win_rate: number;
  profit_factor: number;
  sharpe: number;
  max_drawdown_pct: number;
  trades: number;
  alpha_pct: number;
  equity_curve: BacktestEquityPoint[];
}

// ---------- WebSocket ----------

export type WSMessageType = 'agent_event' | 'price' | 'order' | 'position';

export interface WSMessage {
  type: WSMessageType;
  payload: unknown;
}

export interface AgentEventPayload {
  ts: string;
  agent: AgentStage;
  message: string;
  level: 'info' | 'success' | 'warn' | 'error';
}
