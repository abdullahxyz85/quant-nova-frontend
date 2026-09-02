import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useStore } from '@/store';
import { Panel, AsyncBoundary } from '@/components/ui/Panel';
import type { WatchlistItem, Regime, Signal } from '@/types';
import { cn } from '@/utils/cn';

const regimeColors: Record<Regime, string> = {
  BULL_TREND: 'border-profit/30 bg-profit/10 text-profit',
  BEAR_TREND: 'border-loss/30 bg-loss/10 text-loss',
  RANGE_BOUND: 'border-info/30 bg-info/10 text-info',
  HIGH_VOL: 'border-warn/30 bg-warn/10 text-warn',
  LOW_VOL: 'border-text-muted/30 bg-text-muted/10 text-text-muted',
  BREAKOUT: 'border-accent/30 bg-accent/10 text-accent',
};

const signalColors: Record<Signal, string> = {
  STRONG_BUY: 'text-profit',
  BUY: 'text-profit',
  HOLD: 'text-text-secondary',
  SELL: 'text-loss',
  STRONG_SELL: 'text-loss',
  WATCH: 'text-warn',
};

export function Watchlist() {
  const { watchlist, loading, errors, fetchWatchlist } = useStore();
  const [selected, setSelected] = useState<WatchlistItem | null>(null);

  return (
    <Panel title="Watchlist / Opportunity Scanner">
      <AsyncBoundary
        loading={loading.watchlist}
        error={errors.watchlist}
        onRetry={fetchWatchlist}
        hasData={watchlist.length > 0}
        emptyMessage="No symbols in watchlist"
        skeletonClassName="h-40"
      >
        <div className="overflow-x-auto min-w-0">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="text-panel-header uppercase text-text-muted border-b border-border">
                <th className="px-3 py-2 text-left font-semibold">Symbol</th>
                <th className="px-3 py-2 text-right font-semibold">Price</th>
                <th className="px-3 py-2 text-right font-semibold">Chg%</th>
                <th className="px-3 py-2 text-left font-semibold">Regime</th>
                <th className="px-3 py-2 text-center font-semibold">Score</th>
                <th className="px-3 py-2 text-center font-semibold">IV Rank</th>
                <th className="px-3 py-2 text-left font-semibold">Suggested</th>
                <th className="px-3 py-2 text-center font-semibold">Signal</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((item) => (
                <tr
                  key={item.symbol}
                  onClick={() => setSelected(item)}
                  className="border-b border-border-subtle hover:bg-bg-hover/40 cursor-pointer transition-colors duration-150"
                >
                  <td className="px-3 py-2.5 font-semibold text-text-primary">{item.symbol}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-text-secondary">${item.price.toFixed(2)}</td>
                  <td className={cn('px-3 py-2.5 text-right tabular-nums', item.change_pct >= 0 ? 'text-profit' : 'text-loss')}>
                    {item.change_pct >= 0 ? '+' : ''}{item.change_pct.toFixed(2)}%
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={cn('inline-block px-1.5 py-0.5 text-[9px] uppercase tracking-wider rounded border', regimeColors[item.regime])}>
                      {item.regime.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <ScoreBar score={item.composite_score} />
                  </td>
                  <td className="px-3 py-2.5">
                    <IVRankBar value={item.iv_rank} />
                  </td>
                  <td className="px-3 py-2.5 text-xs text-text-secondary">{item.suggested_strategy.replace(/_/g, ' ')}</td>
                  <td className={cn('px-3 py-2.5 text-center text-xs font-semibold', signalColors[item.signal])}>
                    {item.signal.replace(/_/g, ' ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AsyncBoundary>

      <AnimatePresence>
        {selected && (
          <WatchlistDrawer item={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </Panel>
  );
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.abs(score) / 100;
  const isPositive = score >= 0;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1.5 bg-bg-elevated rounded-full overflow-hidden relative flex">
        <div className="flex-1 flex justify-end">
          {isPositive && (
            <div className="h-full bg-profit rounded-l-full" style={{ width: `${pct * 100}%` }} />
          )}
        </div>
        <div className="w-px bg-border-strong" />
        <div className="flex-1">
          {!isPositive && (
            <div className="h-full bg-loss rounded-r-full" style={{ width: `${pct * 100}%` }} />
          )}
        </div>
      </div>
      <span className={cn('tabular-nums text-xs w-8 text-right', isPositive ? 'text-profit' : 'text-loss')}>
        {score > 0 ? '+' : ''}{score}
      </span>
    </div>
  );
}

function IVRankBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
        <div className="h-full bg-warn rounded-full" style={{ width: `${value}%` }} />
      </div>
      <span className="tabular-nums text-xs text-text-secondary w-7 text-right">{value}</span>
    </div>
  );
}

function WatchlistDrawer({ item, onClose }: { item: WatchlistItem; onClose: () => void }) {
  const scoreData = [
    { name: 'Trend', value: item.trend_strength },
    { name: 'Composite', value: Math.abs(item.composite_score) },
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.2 }}
      className="fixed right-0 top-14 bottom-8 w-[400px] bg-bg-panel border-l border-border z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <span className="text-lg font-bold text-text-primary">{item.symbol}</span>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-bg-elevated rounded">
            <span className="text-[10px] uppercase text-text-muted">Price</span>
            <p className="text-lg tabular-nums text-text-primary">${item.price.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-bg-elevated rounded">
            <span className="text-[10px] uppercase text-text-muted">Change</span>
            <p className={cn('text-lg tabular-nums', item.change_pct >= 0 ? 'text-profit' : 'text-loss')}>
              {item.change_pct >= 0 ? '+' : ''}{item.change_pct.toFixed(2)}%
            </p>
          </div>
          <div className="p-3 bg-bg-elevated rounded">
            <span className="text-[10px] uppercase text-text-muted">Regime</span>
            <p className="text-sm text-text-primary mt-0.5">{item.regime.replace(/_/g, ' ')}</p>
          </div>
          <div className="p-3 bg-bg-elevated rounded">
            <span className="text-[10px] uppercase text-text-muted">IV Rank</span>
            <p className="text-lg tabular-nums text-text-primary">{item.iv_rank}</p>
          </div>
        </div>

        <div>
          <span className="text-panel-header uppercase text-text-muted font-semibold">Composite Score</span>
          <div className="mt-2 h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData}>
                <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {scoreData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#3B82F6' : item.composite_score >= 0 ? '#10B981' : '#EF4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <span className="text-panel-header uppercase text-text-muted font-semibold">Suggested Strategy</span>
          <p className="mt-1 text-sm text-text-primary">{item.suggested_strategy.replace(/_/g, ' ')}</p>
        </div>

        <div>
          <span className="text-panel-header uppercase text-text-muted font-semibold">Signal</span>
          <p className={cn('mt-1 text-sm font-semibold', signalColors[item.signal])}>
            {item.signal.replace(/_/g, ' ')}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
