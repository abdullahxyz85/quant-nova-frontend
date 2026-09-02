import { useStore } from '@/store';
import { Panel } from '@/components/ui/Panel';
import { Zap, Activity, Shield, Server } from 'lucide-react';

export function SettingsPage() {
  const { account, agentStatus } = useStore();

  return (
    <div className="space-y-4 max-w-3xl">
      <Panel title="Connection Settings">
        <div className="p-4 space-y-4">
          <SettingRow icon={Server} label="API Base URL" value={(import.meta as unknown as { env: Record<string, string> }).env?.VITE_API_BASE_URL || 'http://localhost:8000'} />
          <SettingRow icon={Zap} label="Mock Data" value={(import.meta as unknown as { env: Record<string, string> }).env?.VITE_USE_MOCKS === 'true' ? 'Enabled' : 'Disabled'} />
          <SettingRow icon={Activity} label="Agent Mode" value={agentStatus?.mode ?? '—'} />
          <SettingRow icon={Shield} label="Options Level" value={account?.options_level ?? '—'} />
        </div>
      </Panel>

      <Panel title="Account Information">
        <div className="p-4 space-y-4">
          <SettingRow label="Account ID" value={account?.account_id ?? '—'} mono />
          <SettingRow label="Starting Equity" value={account ? `$${account.starting_equity.toLocaleString()}` : '—'} mono />
          <SettingRow label="Current Equity" value={account ? `$${account.equity.toLocaleString()}` : '—'} mono />
          <SettingRow label="Cash" value={account ? `$${account.cash.toLocaleString()}` : '—'} mono />
          <SettingRow label="Buying Power" value={account ? `$${account.buying_power.toLocaleString()}` : '—'} mono />
        </div>
      </Panel>

      <Panel title="Agent Statistics">
        <div className="p-4 space-y-4">
          <SettingRow label="Cycles Today" value={agentStatus ? String(agentStatus.cycles_today) : '—'} mono />
          <SettingRow label="Decisions Today" value={agentStatus ? String(agentStatus.decisions_today) : '—'} mono />
          <SettingRow label="Orders Today" value={agentStatus ? String(agentStatus.orders_today) : '—'} mono />
          <SettingRow label="Blocked Today" value={agentStatus ? String(agentStatus.blocked_today) : '—'} mono />
        </div>
      </Panel>
    </div>
  );
}

function SettingRow({ icon: Icon, label, value, mono }: { icon?: React.ComponentType<{ className?: string }>; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border-subtle">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-text-muted" />}
        <span className="text-sm text-text-secondary">{label}</span>
      </div>
      <span className={mono ? 'text-sm tabular-nums text-text-primary' : 'text-sm text-text-primary'}>{value}</span>
    </div>
  );
}
