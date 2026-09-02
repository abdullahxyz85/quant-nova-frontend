import { useStore } from '@/store';
import { AgentLogFeed } from '@/components/overview/AgentLogFeed';
import { Panel, AsyncBoundary } from '@/components/ui/Panel';
import type { AgentStage } from '@/types';
import { formatTime, formatDateTime } from '@/utils/format';
import { cn } from '@/utils/cn';

const agentLabels: Record<AgentStage, string> = {
  MARKET_ANALYST: 'ANALYST',
  OPPORTUNITY_SCANNER: 'SCANNER',
  OPTIONS_STRATEGIST: 'STRATEGIST',
  RISK_MANAGER: 'RISK',
  EXECUTION: 'EXEC',
  PORTFOLIO_MONITOR: 'MONITOR',
};

const agentColors: Record<AgentStage, string> = {
  MARKET_ANALYST: 'text-info',
  OPPORTUNITY_SCANNER: 'text-accent',
  OPTIONS_STRATEGIST: 'text-accent',
  RISK_MANAGER: 'text-warn',
  EXECUTION: 'text-profit',
  PORTFOLIO_MONITOR: 'text-text-secondary',
};

export function AgentLogPage() {
  const { decisions, loading, errors, fetchDecisions } = useStore();

  return (
    <div className="space-y-4">
      <AgentLogFeed />

      <Panel title="Decision History">
        <AsyncBoundary
          loading={loading.decisions}
          error={errors.decisions}
          onRetry={fetchDecisions}
          hasData={decisions.length > 0}
          emptyMessage="No decisions recorded"
          skeletonClassName="h-40"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-panel-header uppercase text-text-muted border-b border-border">
                  <th className="px-3 py-2 text-left font-semibold">Time</th>
                  <th className="px-3 py-2 text-left font-semibold">Agent</th>
                  <th className="px-3 py-2 text-left font-semibold">Symbol</th>
                  <th className="px-3 py-2 text-left font-semibold">Decision</th>
                  <th className="px-3 py-2 text-right font-semibold">Confidence</th>
                  <th className="px-3 py-2 text-left font-semibold">Verdict</th>
                  <th className="px-3 py-2 text-left font-semibold">Reason</th>
                </tr>
              </thead>
              <tbody>
                {decisions.map((d) => (
                  <tr key={d.id} className="border-b border-border-subtle hover:bg-bg-hover/30">
                    <td className="px-3 py-2.5 text-xs tabular-nums text-text-muted">{formatTime(d.ts)}</td>
                    <td className={cn('px-3 py-2.5 text-xs font-semibold', agentColors[d.agent_stage])}>
                      {agentLabels[d.agent_stage]}
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-text-primary">{d.symbol}</td>
                    <td className="px-3 py-2.5 text-xs text-text-secondary">{d.decision.replace(/_/g, ' ')}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-text-secondary">{d.confidence}%</td>
                    <td className="px-3 py-2.5">
                      {d.risk_verdict ? (
                        <span className={cn(
                          'inline-block px-1.5 py-0.5 text-[9px] uppercase tracking-wider rounded border',
                          d.risk_verdict.status === 'APPROVED' && 'border-profit/30 bg-profit/10 text-profit',
                          d.risk_verdict.status === 'REJECTED' && 'border-loss/30 bg-loss/10 text-loss',
                          d.risk_verdict.status === 'PENDING' && 'border-warn/30 bg-warn/10 text-warn',
                        )}>{d.risk_verdict.status}</span>
                      ) : (
                        <span className="text-text-muted text-xs">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-text-muted max-w-md truncate">{d.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AsyncBoundary>
      </Panel>
    </div>
  );
}
