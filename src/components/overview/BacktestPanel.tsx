import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useStore } from '@/store';
import { Panel, AsyncBoundary } from '@/components/ui/Panel';
import { cn } from '@/utils/cn';
import type { BacktestSegment } from '@/types';

const segments: { id: BacktestSegment; label: string }[] = [
  { id: 'oos', label: 'Out-of-Sample' },
  { id: 'validation', label: 'Validation' },
  { id: 'train', label: 'In-Sample' },
];

export function BacktestPanel() {
  const { backtest, loading, errors, fetchBacktest } = useStore();
  const [segment, setSegment] = useState<BacktestSegment>('oos');

  const handleSegmentChange = (s: BacktestSegment) => {
    setSegment(s);
    fetchBacktest(s);
  };

  const drawdownData = backtest?.equity_curve.map((p) => {
    const peak = Math.max(...backtest.equity_curve.slice(0, backtest.equity_curve.indexOf(p) + 1).map((q) => q.strategy));
    return { ts: p.ts, drawdown: ((p.strategy - peak) / peak) * 100 };
  }) ?? [];

  return (
    <Panel
      title="Backtest / Validation"
      headerRight={
        <div className="flex items-center gap-1">
          {segments.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSegmentChange(s.id)}
              className={cn(
                'px-2 py-1 text-[10px] uppercase tracking-wider rounded transition-colors',
                segment === s.id
                  ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'text-text-muted hover:text-text-secondary border border-transparent',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      }
    >
      <AsyncBoundary
        loading={loading.backtest}
        error={errors.backtest}
        onRetry={() => fetchBacktest(segment)}
        hasData={!!backtest}
        emptyMessage="No backtest data"
        skeletonClassName="h-48"
      >
        <div className="p-4 space-y-3">
          <div className="text-[10px] uppercase text-text-muted">{backtest?.period}</div>

          {/* Metrics row */}
          <div className="grid grid-cols-4 gap-2">
            <Metric label="Return" value={`${backtest?.return_pct.toFixed(1)}%`} positive={(backtest?.return_pct ?? 0) > 0} />
            <Metric label="Win Rate" value={`${backtest?.win_rate.toFixed(1)}%`} />
            <Metric label="Profit Factor" value={backtest?.profit_factor.toFixed(2) ?? '—'} />
            <Metric label="Sharpe" value={backtest?.sharpe.toFixed(2) ?? '—'} />
            <Metric label="Max DD" value={`${backtest?.max_drawdown_pct.toFixed(1)}%`} negative />
            <Metric label="Trades" value={`${backtest?.trades ?? 0}`} />
            <Metric label="Alpha vs SPY" value={`${backtest?.alpha_pct.toFixed(1)}%`} positive={(backtest?.alpha_pct ?? 0) > 0} />
          </div>

          {/* Equity vs benchmark */}
          <div>
            <span className="text-[10px] uppercase text-text-muted">Equity vs Benchmark</span>
            <div className="h-[140px] mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={backtest?.equity_curve ?? []} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="stratGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                  <XAxis dataKey="ts" tick={{ fill: '#6B7280', fontSize: 9 }} axisLine={false} tickLine={false} minTickGap={40} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 9 }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '8px', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="strategy" stroke="#3B82F6" strokeWidth={1.5} fill="url(#stratGrad)" name="Strategy" />
                  <Line type="monotone" dataKey="benchmark" stroke="#6B7280" strokeWidth={1} strokeDasharray="4 4" dot={false} name="SPY" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Underwater drawdown */}
          <div>
            <span className="text-[10px] uppercase text-text-muted">Underwater Drawdown</span>
            <div className="h-[80px] mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={drawdownData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity={0.02} />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                  <XAxis dataKey="ts" tick={{ fill: '#6B7280', fontSize: 9 }} axisLine={false} tickLine={false} minTickGap={40} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 9 }} axisLine={false} tickLine={false} width={35} tickFormatter={(v) => `${v.toFixed(0)}%`} />
                  <ReferenceLine y={0} stroke="#374151" />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '8px', fontSize: '11px' }} formatter={(v) => [`${Number(v).toFixed(2)}%`, 'Drawdown']} />
                  <Area type="monotone" dataKey="drawdown" stroke="#EF4444" strokeWidth={1} fill="url(#ddGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </AsyncBoundary>
    </Panel>
  );
}

function Metric({ label, value, positive, negative }: { label: string; value: string; positive?: boolean; negative?: boolean }) {
  return (
    <div className="p-2 bg-bg-elevated rounded text-center">
      <span className="text-[10px] uppercase text-text-muted">{label}</span>
      <p className={cn(
        'text-sm tabular-nums mt-0.5',
        positive && 'text-profit',
        negative && 'text-loss',
        !positive && !negative && 'text-text-primary',
      )}>{value}</p>
    </div>
  );
}
