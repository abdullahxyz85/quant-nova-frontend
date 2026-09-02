import { KPIStrip } from '@/components/overview/KPIStrip';
import { EquityCurve } from '@/components/overview/EquityCurve';
import { AgentPipeline } from '@/components/overview/AgentPipeline';
import { AgentLogFeed } from '@/components/overview/AgentLogFeed';
import { PositionsTable } from '@/components/overview/PositionsTable';
import { Watchlist } from '@/components/overview/Watchlist';
import { RiskDashboard } from '@/components/overview/RiskDashboard';
import { BacktestPanel } from '@/components/overview/BacktestPanel';

export function OverviewPage() {
  return (
    <div className="space-y-3 sm:space-y-4">
      <KPIStrip />
      <EquityCurve />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="lg:col-span-3 min-w-0">
          <AgentPipeline />
        </div>
        <div className="lg:col-span-2 min-w-0">
          <AgentLogFeed />
        </div>
      </div>
      <PositionsTable />
      <Watchlist />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <RiskDashboard />
        <BacktestPanel />
      </div>
    </div>
  );
}
