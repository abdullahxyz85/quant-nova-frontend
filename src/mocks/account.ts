import type {
  Account,
  AgentStatus,
  EquityCurvePoint,
} from '@/types';

const STARTING_EQUITY = 100000;

export const mockAccount: Account = {
  account_id: 'PA7H3K9X2M4N8Q1R',
  equity: 103420.55,
  cash: 41250.30,
  buying_power: 82500.60,
  options_buying_power: 41250.30,
  starting_equity: STARTING_EQUITY,
  total_pnl: 3420.55,
  total_pnl_pct: 3.42,
  day_pnl: 1185.22,
  day_pnl_pct: 1.16,
  options_level: 'L3',
};

export const mockAgentStatus: AgentStatus = {
  running: true,
  mode: 'AUTO',
  current_stage: 'OPTIONS_STRATEGIST',
  last_cycle_at: new Date(Date.now() - 42_000).toISOString(),
  next_cycle_at: new Date(Date.now() + 18_000).toISOString(),
  cycles_today: 47,
  decisions_today: 12,
  orders_today: 5,
  blocked_today: 7,
};

// Generate equity curve with 1M of data points (every 15 min for ~20 trading days)
function genEquityCurve(): EquityCurvePoint[] {
  const points: EquityCurvePoint[] = [];
  let equity = STARTING_EQUITY;
  const now = Date.now();
  const intervalMs = 15 * 60 * 1000;
  const numPoints = 780; // ~20 trading days at 15min intervals

  for (let i = numPoints; i >= 0; i--) {
    const ts = new Date(now - i * intervalMs).toISOString();
    // Random walk with slight upward bias
    const drift = 0.0002;
    const volatility = 0.0015;
    const change = equity * (drift + (Math.random() - 0.48) * volatility);
    equity += change;
    points.push({
      ts,
      equity: Math.round(equity * 100) / 100,
      baseline: STARTING_EQUITY,
    });
  }
  return points;
}

export const mockEquityCurveAll: EquityCurvePoint[] = genEquityCurve();

export function getEquityCurve(range: string): EquityCurvePoint[] {
  const now = Date.now();
  const ranges: Record<string, number> = {
    '1d': 1 * 24 * 60 * 60 * 1000,
    '1w': 7 * 24 * 60 * 60 * 1000,
    '1m': 30 * 24 * 60 * 60 * 1000,
    'all': 60 * 24 * 60 * 60 * 1000,
  };
  const span = ranges[range] || ranges['1m'];
  return mockEquityCurveAll.filter((p) => now - new Date(p.ts).getTime() <= span);
}

// 30-point sparkline data for KPI tiles
export function getSparkline(seed: number): number[] {
  const points: number[] = [];
  let val = seed;
  for (let i = 0; i < 30; i++) {
    val += (Math.random() - 0.45) * seed * 0.008;
    points.push(Math.round(val * 100) / 100);
  }
  return points;
}
