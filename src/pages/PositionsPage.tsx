import { useStore } from '@/store';
import { PositionsTable } from '@/components/overview/PositionsTable';
import { Panel, AsyncBoundary } from '@/components/ui/Panel';
import { formatSignedCurrency, formatPercent, formatDateTime } from '@/utils/format';
import { cn } from '@/utils/cn';

export function PositionsPage() {
  const { positions, trades, loading, errors, fetchTrades } = useStore();

  return (
    <div className="space-y-4">
      <PositionsTable />

      <Panel title="Order History">
        <AsyncBoundary
          loading={loading.orders}
          error={errors.orders}
          hasData={true}
          emptyMessage="No orders"
        >
          <OrdersTable />
        </AsyncBoundary>
      </Panel>

      <Panel title="Closed Trades">
        <AsyncBoundary
          loading={loading.trades}
          error={errors.trades}
          onRetry={fetchTrades}
          hasData={trades.length > 0}
          emptyMessage="No closed trades yet"
          skeletonClassName="h-40"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-panel-header uppercase text-text-muted border-b border-border">
                  <th className="px-3 py-2 text-left font-semibold">Underlying</th>
                  <th className="px-3 py-2 text-left font-semibold">Strategy</th>
                  <th className="px-3 py-2 text-right font-semibold">Entry</th>
                  <th className="px-3 py-2 text-right font-semibold">Exit</th>
                  <th className="px-3 py-2 text-right font-semibold">Net P&L</th>
                  <th className="px-3 py-2 text-right font-semibold">Return</th>
                  <th className="px-3 py-2 text-right font-semibold">Days</th>
                  <th className="px-3 py-2 text-left font-semibold">Exit Reason</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t) => (
                  <tr key={t.id} className="border-b border-border-subtle hover:bg-bg-hover/30">
                    <td className="px-3 py-2.5 font-semibold text-text-primary">{t.underlying}</td>
                    <td className="px-3 py-2.5 text-xs text-text-secondary">{t.strategy_type.replace(/_/g, ' ')}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-text-muted text-xs">{formatDateTime(t.entry_ts)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-text-muted text-xs">{formatDateTime(t.exit_ts)}</td>
                    <td className={cn('px-3 py-2.5 text-right tabular-nums', t.net_pnl >= 0 ? 'text-profit' : 'text-loss')}>
                      {formatSignedCurrency(t.net_pnl)}
                    </td>
                    <td className={cn('px-3 py-2.5 text-right tabular-nums', t.return_pct >= 0 ? 'text-profit' : 'text-loss')}>
                      {formatPercent(t.return_pct)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-text-secondary">{t.holding_days}</td>
                    <td className="px-3 py-2.5 text-xs text-text-muted">{t.exit_reason}</td>
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

function OrdersTable() {
  const { orders } = useStore();
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-panel-header uppercase text-text-muted border-b border-border">
            <th className="px-3 py-2 text-left font-semibold">Time</th>
            <th className="px-3 py-2 text-left font-semibold">Status</th>
            <th className="px-3 py-2 text-left font-semibold">Underlying</th>
            <th className="px-3 py-2 text-left font-semibold">Class</th>
            <th className="px-3 py-2 text-right font-semibold">Qty</th>
            <th className="px-3 py-2 text-right font-semibold">Fill Price</th>
            <th className="px-3 py-2 text-left font-semibold">Alpaca ID</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-border-subtle hover:bg-bg-hover/30">
              <td className="px-3 py-2.5 text-xs tabular-nums text-text-muted">{formatDateTime(o.ts)}</td>
              <td className="px-3 py-2.5">
                <span className={cn(
                  'inline-block px-1.5 py-0.5 text-[9px] uppercase tracking-wider rounded border',
                  o.status === 'FILLED' && 'border-profit/30 bg-profit/10 text-profit',
                  o.status === 'CANCELLED' && 'border-loss/30 bg-loss/10 text-loss',
                  o.status === 'PENDING' && 'border-warn/30 bg-warn/10 text-warn',
                )}>{o.status}</span>
              </td>
              <td className="px-3 py-2.5 font-semibold text-text-primary">{o.underlying}</td>
              <td className="px-3 py-2.5 text-xs text-text-secondary">{o.order_class}</td>
              <td className="px-3 py-2.5 text-right tabular-nums text-text-secondary">{o.qty}</td>
              <td className="px-3 py-2.5 text-right tabular-nums text-text-secondary">${o.filled_avg_price.toFixed(2)}</td>
              <td className="px-3 py-2.5 text-xs tabular-nums text-text-muted">{o.alpaca_order_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
