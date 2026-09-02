import { useStore } from '@/store';
import { Panel, AsyncBoundary } from '@/components/ui/Panel';
import type { GateStatus } from '@/types';
import { cn } from '@/utils/cn';

const statusColors: Record<GateStatus, string> = {
  OK: 'text-profit',
  WARN: 'text-warn',
  BREACH: 'text-loss',
};

const barColors: Record<GateStatus, string> = {
  OK: 'bg-profit',
  WARN: 'bg-warn',
  BREACH: 'bg-loss',
};

export function RiskDashboard() {
  const { risk, loading, errors, fetchRisk } = useStore();

  return (
    <Panel title="Risk Dashboard">
      <AsyncBoundary
        loading={loading.risk}
        error={errors.risk}
        onRetry={fetchRisk}
        hasData={!!risk}
        emptyMessage="No risk data"
        skeletonClassName="h-48"
      >
        <div className="p-4 space-y-3">
          {/* Risk gates */}
          <div className="space-y-2">
            {risk?.gates.map((gate) => {
              const pct = Math.min(100, (Math.abs(gate.value) / Math.abs(gate.limit)) * 100);
              const barColor = pct < 70 ? 'bg-profit' : pct < 90 ? 'bg-warn' : 'bg-loss';
              return (
                <div key={gate.name} className="flex items-center gap-3">
                  <span className="text-xs text-text-secondary w-36 shrink-0">{gate.name}</span>
                  <div className="flex-1 h-2 bg-bg-elevated rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full transition-all', barColor)} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={cn('text-xs tabular-nums w-20 text-right', statusColors[gate.status])}>
                    {gate.value}{gate.unit}
                  </span>
                  <span className="text-xs tabular-nums text-text-muted w-20 text-right">
                    / {gate.limit}{gate.unit}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Portfolio Greeks */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border">
            <div className="p-2 bg-bg-elevated rounded text-center">
              <span className="text-[10px] uppercase text-text-muted">Delta</span>
              <p className="text-sm tabular-nums text-text-primary">{risk?.portfolio_greeks.delta.toFixed(3)}</p>
            </div>
            <div className="p-2 bg-bg-elevated rounded text-center">
              <span className="text-[10px] uppercase text-text-muted">Gamma</span>
              <p className="text-sm tabular-nums text-text-primary">{risk?.portfolio_greeks.gamma.toFixed(4)}</p>
            </div>
            <div className="p-2 bg-bg-elevated rounded text-center">
              <span className="text-[10px] uppercase text-text-muted">Theta</span>
              <p className="text-sm tabular-nums text-loss">{risk?.portfolio_greeks.theta.toFixed(3)}</p>
            </div>
            <div className="p-2 bg-bg-elevated rounded text-center">
              <span className="text-[10px] uppercase text-text-muted">Vega</span>
              <p className="text-sm tabular-nums text-text-primary">{risk?.portfolio_greeks.vega.toFixed(3)}</p>
            </div>
          </div>
        </div>
      </AsyncBoundary>
    </Panel>
  );
}
