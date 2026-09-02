import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, X, AlertTriangle } from 'lucide-react';
import { Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useStore } from '@/store';
import { Panel, AsyncBoundary, EmptyState } from '@/components/ui/Panel';
import type { Position, StrategyType } from '@/types';
import { formatCurrency, formatSignedCurrency, formatPercent, formatDateTime } from '@/utils/format';
import { cn } from '@/utils/cn';

const strategyChipColors: Record<StrategyType, string> = {
  BULL_CALL_SPREAD: 'border-profit/30 bg-profit/10 text-profit',
  BEAR_PUT_SPREAD: 'border-loss/30 bg-loss/10 text-loss',
  LONG_CALL: 'border-profit/30 bg-profit/10 text-profit',
  LONG_PUT: 'border-loss/30 bg-loss/10 text-loss',
  COVERED_CALL: 'border-info/30 bg-info/10 text-info',
  PROTECTIVE_PUT: 'border-info/30 bg-info/10 text-info',
  IRON_CONDOR: 'border-accent/30 bg-accent/10 text-accent',
  STRADDLE: 'border-warn/30 bg-warn/10 text-warn',
  STRANGLE: 'border-warn/30 bg-warn/10 text-warn',
  CASH_SECURED_PUT: 'border-info/30 bg-info/10 text-info',
};

const strategyLabels: Record<StrategyType, string> = {
  BULL_CALL_SPREAD: 'Bull Call Spread',
  BEAR_PUT_SPREAD: 'Bear Put Spread',
  LONG_CALL: 'Long Call',
  LONG_PUT: 'Long Put',
  COVERED_CALL: 'Covered Call',
  PROTECTIVE_PUT: 'Protective Put',
  IRON_CONDOR: 'Iron Condor',
  STRADDLE: 'Straddle',
  STRANGLE: 'Strangle',
  CASH_SECURED_PUT: 'Cash Secured Put',
};

export function PositionsTable() {
  const { positions, loading, errors, fetchPositions, closePosition } = useStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Panel title="Open Options Positions">
      <AsyncBoundary
        loading={loading.positions}
        error={errors.positions}
        onRetry={fetchPositions}
        hasData={positions.length > 0}
        emptyMessage="No open positions"
        skeletonClassName="h-40"
      >
        <div className="overflow-x-auto min-w-0">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="text-panel-header uppercase text-text-muted border-b border-border">
                <th className="px-4 py-2 text-left font-semibold w-8"></th>
                <th className="px-4 py-2 text-left font-semibold">Underlying</th>
                <th className="px-4 py-2 text-left font-semibold">Strategy</th>
                <th className="px-4 py-2 text-right font-semibold">Net Debit/Credit</th>
                <th className="px-4 py-2 text-right font-semibold">Mark</th>
                <th className="px-4 py-2 text-right font-semibold">Unreal P&L</th>
                <th className="px-4 py-2 text-right font-semibold">DTE</th>
                <th className="px-4 py-2 text-right font-semibold">Δ</th>
                <th className="px-4 py-2 text-right font-semibold">Θ</th>
                <th className="px-4 py-2 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((pos) => (
                <PositionRow
                  key={pos.id}
                  position={pos}
                  expanded={expandedId === pos.id}
                  onToggle={() => setExpandedId(expandedId === pos.id ? null : pos.id)}
                  onClose={() => closePosition(pos.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </AsyncBoundary>
    </Panel>
  );
}

function PositionRow({
  position: pos,
  expanded,
  onToggle,
  onClose,
}: {
  position: Position;
  expanded: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const pnlColor = pos.unrealized_pnl >= 0 ? 'text-profit' : 'text-loss';
  const mark = pos.legs.reduce((sum, l) => sum + l.mark * l.qty * (l.side === 'BUY' ? 1 : -1), 0);
  const dteWarning = pos.dte < 7;

  return (
    <>
      <tr
        onClick={onToggle}
        className="border-b border-border-subtle hover:bg-bg-hover/40 cursor-pointer transition-colors duration-150"
      >
        <td className="px-4 py-2.5">
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-text-muted" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
          )}
        </td>
        <td className="px-4 py-2.5 font-semibold text-text-primary">{pos.underlying}</td>
        <td className="px-4 py-2.5">
          <span className={cn('inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider rounded border', strategyChipColors[pos.strategy_type])}>
            {strategyLabels[pos.strategy_type]}
          </span>
        </td>
        <td className="px-4 py-2.5 text-right tabular-nums text-text-secondary whitespace-nowrap">
          {pos.net_debit_credit < 0 ? '-' : '+'}${Math.abs(pos.net_debit_credit).toFixed(2)}
        </td>
        <td className="px-4 py-2.5 text-right tabular-nums text-text-secondary">${mark.toFixed(2)}</td>
        <td className="px-4 py-2.5 text-right tabular-nums whitespace-nowrap">
          <span className={pnlColor}>
            {formatSignedCurrency(pos.unrealized_pnl)}
            <span className="text-xs ml-1">{formatPercent(pos.unrealized_pnl_pct)}</span>
          </span>
        </td>
        <td className="px-4 py-2.5 text-right tabular-nums">
          <span className={cn('flex items-center justify-end gap-1', dteWarning ? 'text-warn' : 'text-text-secondary')}>
            {dteWarning && <AlertTriangle className="w-3 h-3" />}
            {pos.dte}
          </span>
        </td>
        <td className="px-4 py-2.5 text-right tabular-nums text-text-secondary">{pos.greeks.delta.toFixed(2)}</td>
        <td className="px-4 py-2.5 text-right tabular-nums text-text-secondary">{pos.greeks.theta.toFixed(3)}</td>
        <td className="px-4 py-2.5 text-center">
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="px-2 py-1 text-[10px] uppercase tracking-wider border border-loss/30 text-loss rounded hover:bg-loss/10 transition-colors"
          >
            Close
          </button>
        </td>
      </tr>
      <AnimatePresence>
        {expanded && (
          <motion.tr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <td colSpan={10} className="px-4 py-4 bg-bg-base border-b border-border">
              <ExpandedPosition position={pos} />
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

function ExpandedPosition({ position: pos }: { position: Position }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: legs + metrics */}
      <div className="space-y-4">
        <div>
          <span className="text-panel-header uppercase text-text-muted font-semibold">Legs Breakdown</span>
          <div className="mt-2 space-y-1">
            {pos.legs.map((leg, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-bg-elevated rounded text-xs">
                <div className="flex items-center gap-3">
                  <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-semibold', leg.side === 'BUY' ? 'bg-profit/20 text-profit' : 'bg-loss/20 text-loss')}>
                    {leg.side}
                  </span>
                  <span className="tabular-nums text-text-secondary">{leg.option_symbol}</span>
                  <span className="text-text-muted">{leg.type}</span>
                  <span className="tabular-nums text-text-muted">Strike ${leg.strike}</span>
                </div>
                <div className="flex items-center gap-4 tabular-nums text-text-secondary">
                  <span>Qty {leg.qty}</span>
                  <span>Avg ${leg.avg_price.toFixed(2)}</span>
                  <span>Mark ${leg.mark.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Metric label="Max Profit" value={formatCurrency(pos.max_profit)} valueClass="text-profit" />
          <Metric label="Max Loss" value={formatCurrency(pos.max_loss)} valueClass="text-loss" />
          <Metric label="Breakeven" value={`$${pos.breakevens.map((b) => b.toFixed(2)).join(', ')}`} />
          <Metric label="Risk/Reward" value={`1:${(pos.max_profit / pos.max_loss).toFixed(2)}`} />
          <Metric label="Delta" value={pos.greeks.delta.toFixed(3)} />
          <Metric label="Theta" value={pos.greeks.theta.toFixed(3)} />
          <Metric label="Gamma" value={pos.greeks.gamma.toFixed(4)} />
          <Metric label="Vega" value={pos.greeks.vega.toFixed(3)} />
        </div>

        <div>
          <span className="text-panel-header uppercase text-text-muted font-semibold">AI Reasoning</span>
          <p className="mt-2 text-xs text-text-secondary leading-relaxed p-3 bg-bg-elevated rounded border border-border">
            {pos.opening_reason}
          </p>
        </div>
      </div>

      {/* Right: payoff diagram */}
      <div>
        <span className="text-panel-header uppercase text-text-muted font-semibold">P&L at Expiration</span>
        <div className="mt-2 h-[240px] p-2 bg-bg-elevated rounded border border-border">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pos.payoff} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
              <XAxis
                dataKey="underlying_price"
                tickFormatter={(v) => `$${v}`}
                tick={{ fill: '#6B7280', fontSize: 10 }}
                axisLine={{ stroke: '#1F2937' }}
                tickLine={false}
                minTickGap={30}
              />
              <YAxis
                tickFormatter={(v) => `$${v}`}
                tick={{ fill: '#6B7280', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={50}
              />
              <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="3 3" />
              {pos.breakevens.map((be, i) => (
                <ReferenceLine key={i} x={be} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'BE', fill: '#F59E0B', fontSize: 9, position: 'top' }} />
              ))}
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '8px', fontSize: '11px' }}
                labelFormatter={(v) => `Underlying: $${v}`}
                formatter={(v) => [`${Number(v).toFixed(2)}`, 'P&L']}
              />
              <Line type="monotone" dataKey="pnl" stroke="#3B82F6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="p-2 bg-bg-elevated rounded">
      <span className="text-[10px] uppercase text-text-muted">{label}</span>
      <p className={cn('text-sm tabular-nums mt-0.5', valueClass ?? 'text-text-secondary')}>{value}</p>
    </div>
  );
}
