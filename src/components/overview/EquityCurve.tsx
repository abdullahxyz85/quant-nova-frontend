import { useState, useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useStore } from '@/store';
import { Panel, AsyncBoundary } from '@/components/ui/Panel';
import { formatCurrency, formatSignedCurrency, formatDateTime } from '@/utils/format';
import { cn } from '@/utils/cn';

const ranges = ['1D', '1W', '1M', 'ALL'] as const;

export function EquityCurve() {
  const { equityCurve, loading, errors, fetchEquityCurve } = useStore();
  const [range, setRange] = useState<(typeof ranges)[number]>('1M');

  const rangeKey = range.toLowerCase();

  const chartData = useMemo(() => {
    return equityCurve.map((p) => ({
      ts: p.ts,
      equity: p.equity,
      baseline: p.baseline,
      pnl: p.equity - p.baseline,
    }));
  }, [equityCurve]);

  const handleRangeChange = (r: (typeof ranges)[number]) => {
    setRange(r);
    fetchEquityCurve(r.toLowerCase());
  };

  return (
    <Panel
      title="Equity Curve"
      headerRight={
        <div className="flex items-center gap-1">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => handleRangeChange(r)}
              className={cn(
                'px-2 py-1 text-[10px] uppercase tracking-wider rounded transition-colors',
                range === r
                  ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'text-text-muted hover:text-text-secondary border border-transparent',
              )}
            >
              {r}
            </button>
          ))}
        </div>
      }
    >
      <AsyncBoundary
        loading={loading.equityCurve}
        error={errors.equityCurve}
        onRetry={() => fetchEquityCurve(rangeKey)}
        hasData={chartData.length > 0}
        emptyMessage="No equity data available"
        skeletonClassName="h-[320px]"
      >
        <div className="h-[320px] p-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
              <defs>
                <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis
                dataKey="ts"
                tickFormatter={(v) => formatDateTime(v)}
                tick={{ fill: '#6B7280', fontSize: 10 }}
                axisLine={{ stroke: '#1F2937' }}
                tickLine={false}
                minTickGap={50}
              />
              <YAxis
                domain={['dataMin - 500', 'dataMax + 500']}
                tickFormatter={(v) => `$${(v / 1000).toFixed(1)}K`}
                tick={{ fill: '#6B7280', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={50}
              />
              <ReferenceLine y={100000} stroke="#6B7280" strokeDasharray="4 4" strokeWidth={1} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #1F2937',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#9CA3AF' }}
                labelFormatter={(v) => formatDateTime(v as string)}
                formatter={(value, name) => {
                  const v = Number(value);
                  if (name === 'equity') return [formatCurrency(v), 'Equity'];
                  if (name === 'pnl') return [formatSignedCurrency(v), 'P&L vs Baseline'];
                  return [String(value), String(name)];
                }}
              />
              <Area
                type="monotone"
                dataKey="equity"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#equityGradient)"
                activeDot={{ r: 4, fill: '#3B82F6' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </AsyncBoundary>
    </Panel>
  );
}
