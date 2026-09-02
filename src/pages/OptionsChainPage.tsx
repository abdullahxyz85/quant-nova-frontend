import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useStore } from '@/store';
import { api } from '@/api';
import { Panel, AsyncBoundary } from '@/components/ui/Panel';
import type { OptionsChain, ChainStrike } from '@/types';
import { cn } from '@/utils/cn';

export function OptionsChainPage() {
  const { watchlist } = useStore();
  const [symbol, setSymbol] = useState('NVDA');
  const [expiry, setExpiry] = useState<string | null>(null);
  const [chain, setChain] = useState<OptionsChain | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadChain = async (sym: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getOptionsChain(sym);
      setChain(data);
      if (data.expiries.length > 0 && !expiry) setExpiry(data.expiries[0]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useMemo(() => {
    loadChain(symbol);
  }, [symbol]);

  const atmStrike = chain ? chain.strikes.reduce((closest, s) =>
    Math.abs(s.strike - chain.underlying_price) < Math.abs(closest.strike - chain.underlying_price) ? s : closest
  ) : null;

  // IV heatmap range
  const allIVs = chain?.strikes.flatMap((s) => [s.call.iv, s.put.iv]) ?? [];
  const minIV = Math.min(...allIVs);
  const maxIV = Math.max(...allIVs);

  const ivColor = (iv: number) => {
    const pct = maxIV === minIV ? 0.5 : (iv - minIV) / (maxIV - minIV);
    const alpha = 0.05 + pct * 0.25;
    return `rgba(139, 92, 246, ${alpha})`;
  };

  return (
    <div className="space-y-4">
      <Panel title="Options Chain">
        <div className="p-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-text-muted" />
            <select
              value={symbol}
              onChange={(e) => { setSymbol(e.target.value); setExpiry(null); }}
              className="bg-bg-elevated border border-border rounded px-2 py-1.5 text-sm text-text-primary focus:outline-none focus:border-accent"
            >
              {watchlist.map((w) => (
                <option key={w.symbol} value={w.symbol}>{w.symbol}</option>
              ))}
            </select>
          </div>

          {chain && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">Expiry:</span>
                <div className="flex flex-wrap gap-1">
                  {chain.expiries.map((exp) => (
                    <button
                      key={exp}
                      onClick={() => setExpiry(exp)}
                      className={cn(
                        'px-2 py-1 text-[10px] uppercase tracking-wider rounded border transition-colors',
                        expiry === exp
                          ? 'border-accent/40 bg-accent/10 text-accent'
                          : 'border-border text-text-muted hover:text-text-secondary',
                      )}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ml-auto text-right">
                <span className="text-[10px] uppercase text-text-muted">Underlying</span>
                <p className="text-lg tabular-nums text-text-primary">${chain.underlying_price.toFixed(2)}</p>
              </div>
            </>
          )}
        </div>

        <AsyncBoundary
          loading={loading}
          error={error}
          onRetry={() => loadChain(symbol)}
          hasData={!!chain}
          emptyMessage="No chain data"
          skeletonClassName="h-96"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-panel-header uppercase text-text-muted border-b border-border">
                  <th colSpan={8} className="px-2 py-2 text-center text-profit font-semibold border-r border-border">CALLS</th>
                  <th className="px-2 py-2 text-center font-semibold">STRIKE</th>
                  <th colSpan={8} className="px-2 py-2 text-center text-loss font-semibold border-l border-border">PUTS</th>
                </tr>
                <tr className="text-panel-header uppercase text-text-muted border-b border-border">
                  <th className="px-2 py-1.5 text-right font-semibold">Bid</th>
                  <th className="px-2 py-1.5 text-right font-semibold">Ask</th>
                  <th className="px-2 py-1.5 text-right font-semibold">Last</th>
                  <th className="px-2 py-1.5 text-right font-semibold">Vol</th>
                  <th className="px-2 py-1.5 text-right font-semibold">OI</th>
                  <th className="px-2 py-1.5 text-right font-semibold">IV</th>
                  <th className="px-2 py-1.5 text-right font-semibold">Δ</th>
                  <th className="px-2 py-1.5 text-right font-semibold">Θ</th>
                  <th className="px-2 py-1.5 text-center font-semibold border-x border-border"></th>
                  <th className="px-2 py-1.5 text-right font-semibold">Θ</th>
                  <th className="px-2 py-1.5 text-right font-semibold">Δ</th>
                  <th className="px-2 py-1.5 text-right font-semibold">IV</th>
                  <th className="px-2 py-1.5 text-right font-semibold">OI</th>
                  <th className="px-2 py-1.5 text-right font-semibold">Vol</th>
                  <th className="px-2 py-1.5 text-right font-semibold">Last</th>
                  <th className="px-2 py-1.5 text-right font-semibold">Ask</th>
                  <th className="px-2 py-1.5 text-right font-semibold">Bid</th>
                </tr>
              </thead>
              <tbody>
                {chain?.strikes.map((row: ChainStrike) => {
                  const isATM = atmStrike?.strike === row.strike;
                  const callITM = chain.underlying_price > row.strike;
                  const putITM = chain.underlying_price < row.strike;
                  return (
                    <tr
                      key={row.strike}
                      className={cn(
                        'border-b border-border-subtle hover:bg-bg-hover/20',
                        isATM && 'bg-accent/5 border-l-2 border-l-accent',
                      )}
                    >
                      {/* Calls */}
                      <td className={cn('px-2 py-1.5 text-right tabular-nums', callITM ? 'text-text-primary' : 'text-text-secondary')}>{row.call.bid.toFixed(2)}</td>
                      <td className={cn('px-2 py-1.5 text-right tabular-nums', callITM ? 'text-text-primary' : 'text-text-secondary')}>{row.call.ask.toFixed(2)}</td>
                      <td className={cn('px-2 py-1.5 text-right tabular-nums', callITM ? 'text-text-primary' : 'text-text-secondary')}>{row.call.last.toFixed(2)}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums text-text-muted">{row.call.volume}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums text-text-muted">{row.call.oi}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums" style={{ backgroundColor: ivColor(row.call.iv) }}>{row.call.iv.toFixed(1)}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums text-text-secondary">{row.call.delta.toFixed(2)}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums text-text-muted">{row.call.theta.toFixed(2)}</td>
                      {/* Strike */}
                      <td className="px-2 py-1.5 text-center tabular-nums font-semibold text-text-primary border-x border-border bg-bg-base">{row.strike}</td>
                      {/* Puts */}
                      <td className="px-2 py-1.5 text-right tabular-nums text-text-muted">{row.put.theta.toFixed(2)}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums text-text-secondary">{row.put.delta.toFixed(2)}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums" style={{ backgroundColor: ivColor(row.put.iv) }}>{row.put.iv.toFixed(1)}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums text-text-muted">{row.put.oi}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums text-text-muted">{row.put.volume}</td>
                      <td className={cn('px-2 py-1.5 text-right tabular-nums', putITM ? 'text-text-primary' : 'text-text-secondary')}>{row.put.last.toFixed(2)}</td>
                      <td className={cn('px-2 py-1.5 text-right tabular-nums', putITM ? 'text-text-primary' : 'text-text-secondary')}>{row.put.ask.toFixed(2)}</td>
                      <td className={cn('px-2 py-1.5 text-right tabular-nums', putITM ? 'text-text-primary' : 'text-text-secondary')}>{row.put.bid.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </AsyncBoundary>
      </Panel>
    </div>
  );
}
