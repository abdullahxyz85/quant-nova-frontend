import { useStore } from '@/store';
import { RiskDashboard } from '@/components/overview/RiskDashboard';
import { Panel, AsyncBoundary } from '@/components/ui/Panel';
import { formatTime } from '@/utils/format';
import { ShieldX } from 'lucide-react';

export function RiskPage() {
  const { risk, loading, errors, fetchRisk } = useStore();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RiskDashboard />

        <Panel title="Trades Blocked Today">
          <AsyncBoundary
            loading={loading.risk}
            error={errors.risk}
            onRetry={fetchRisk}
            hasData={!!risk}
            emptyMessage="No rejection data"
            skeletonClassName="h-48"
          >
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-loss/10 border border-loss/30 flex items-center justify-center">
                  <ShieldX className="w-5 h-5 text-loss" />
                </div>
                <div>
                  <span className="text-2xl tabular-nums font-bold text-text-primary">{risk?.rejections_today.length ?? 0}</span>
                  <span className="text-xs text-text-muted ml-2 uppercase tracking-wider">trades blocked</span>
                </div>
                <p className="ml-auto text-xs text-profit italic">Proof of discipline</p>
              </div>

              <div className="space-y-2">
                {risk?.rejections_today.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 bg-bg-elevated rounded border-l-2 border-loss/40">
                    <span className="text-[10px] tabular-nums text-text-muted shrink-0 mt-0.5">{formatTime(r.ts)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-primary text-xs">{r.symbol}</span>
                        <span className="text-[10px] text-text-muted uppercase">{r.strategy.replace(/_/g, ' ')}</span>
                      </div>
                      <p className="text-xs text-loss mt-0.5">{r.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AsyncBoundary>
        </Panel>
      </div>
    </div>
  );
}
