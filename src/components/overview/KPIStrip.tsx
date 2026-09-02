import { useStore } from '@/store';
import { getSparkline } from '@/api';
import { formatCurrency, formatSignedCurrency, formatPercent, formatNumber } from '@/utils/format';
import { Sparkline } from '@/components/ui/Sparkline';
import { Skeleton } from '@/components/ui/Panel';
import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

interface KPITileProps {
  label: string;
  value: ReactNode;
  sparkData: number[];
  sparkColor: string;
  loading?: boolean;
}

function KPITile({ label, value, sparkData, sparkColor, loading }: KPITileProps) {
  if (loading) {
    return (
      <div className="panel p-4 flex min-w-0 flex-col gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-4 w-10" />
      </div>
    );
  }
  return (
    <div className="panel hover-lift p-4 flex min-w-0 flex-col gap-1.5">
      <span className="text-panel-header uppercase text-text-muted font-semibold">{label}</span>
      <div className="flex items-end justify-between gap-2 min-w-0">
        <span className="tabular-nums text-xl lg:text-2xl font-semibold text-text-primary truncate">{value}</span>
        <div className="shrink-0">
          <Sparkline data={sparkData} color={sparkColor} width={48} height={20} />
        </div>
      </div>
    </div>
  );
}

export function KPIStrip() {
  const { account, loading } = useStore();

  const pnlColor = account && account.total_pnl >= 0 ? 'text-profit' : 'text-loss';
  const dayColor = account && account.day_pnl >= 0 ? 'text-profit' : 'text-loss';
  const sparkColor = account && account.total_pnl >= 0 ? '#10B981' : '#EF4444';

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <KPITile
        label="Portfolio Value"
        value={account ? formatCurrency(account.equity) : '—'}
        sparkData={getSparkline(account?.equity ?? 100000)}
        sparkColor="#3B82F6"
        loading={loading.account}
      />
      <KPITile
        label="Total P&L"
        value={
          account ? (
            <span className={pnlColor}>
              {formatSignedCurrency(account.total_pnl)}
              <span className="text-sm ml-1">{formatPercent(account.total_pnl_pct)}</span>
            </span>
          ) : '—'
        }
        sparkData={getSparkline(account?.total_pnl ?? 0)}
        sparkColor={sparkColor}
        loading={loading.account}
      />
      <KPITile
        label="Day P&L"
        value={
          account ? (
            <span className={dayColor}>
              {formatSignedCurrency(account.day_pnl)}
              <span className="text-sm ml-1">{formatPercent(account.day_pnl_pct)}</span>
            </span>
          ) : '—'
        }
        sparkData={getSparkline(account?.day_pnl ?? 0)}
        sparkColor={account && account.day_pnl >= 0 ? '#10B981' : '#EF4444'}
        loading={loading.account}
      />
      <KPITile
        label="Open Positions"
        value={account ? formatNumber(4) : '—'}
        sparkData={getSparkline(4)}
        sparkColor="#8B5CF6"
        loading={loading.account}
      />
      <KPITile
        label="Win Rate"
        value={account ? '64.2%' : '—'}
        sparkData={getSparkline(64)}
        sparkColor="#F59E0B"
        loading={loading.account}
      />
      <KPITile
        label="Buying Power"
        value={account ? formatCurrency(account.buying_power) : '—'}
        sparkData={getSparkline(account?.buying_power ?? 50000)}
        sparkColor="#10B981"
        loading={loading.account}
      />
    </div>
  );
}
