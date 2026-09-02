import { useState } from 'react';
import { Activity, ChevronDown, ChevronUp, Copy, Pause, Play, Zap } from 'lucide-react';
import { useStore } from '@/store';
import { useCountdown } from '@/hooks/useCountdown';
import { cn } from '@/utils/cn';

const connections = [
  { label: 'ALPACA PAPER', status: 'connected' as const },
  { label: 'MCP', status: 'connected' as const },
  { label: 'GROQ', status: 'connected' as const },
  { label: 'OPTIONS L3', status: 'connected' as const },
];

const statusColors: Record<string, string> = {
  connected: 'bg-profit',
  degraded: 'bg-warn',
  down: 'bg-loss',
};

export function TopBar() {
  const { agentStatus, account, toggleAgent } = useStore();
  const [copied, setCopied] = useState(false);
  const countdown = useCountdown(agentStatus?.next_cycle_at ?? null);

  const handleCopy = () => {
    if (!account?.account_id) return;
    navigator.clipboard.writeText(account.account_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggle = () => {
    if (agentStatus) toggleAgent(!agentStatus.running);
  };

  return (
    <header className="h-14 bg-bg-panel border-b border-border flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50">
      {/* Left — wordmark */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-gradient-to-br from-accent to-info flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-sm text-text-primary tracking-wide">HRAMY OMNI AI</span>
            <span className="text-[10px] text-text-muted uppercase tracking-widest">Autonomous Options Agent</span>
          </div>
        </div>
      </div>

      {/* Center — connection pills */}
      <div className="hidden md:flex items-center gap-2">
        {connections.map((c) => (
          <div
            key={c.label}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-bg-elevated border border-border rounded text-[10px] uppercase tracking-wider text-text-secondary"
          >
            <span className={cn('w-1.5 h-1.5 rounded-full', statusColors[c.status])} />
            {c.label}
          </div>
        ))}
      </div>

      {/* Right — agent toggle + countdown + account ID */}
      <div className="flex items-center gap-3">
        {agentStatus && (
          <div className="hidden lg:flex items-center gap-1 text-[11px] text-text-muted">
            <span>next cycle in</span>
            <span className="tabular-nums text-text-secondary">{countdown}s</span>
          </div>
        )}

        {agentStatus && (
          <button
            onClick={handleToggle}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-semibold transition-colors',
              agentStatus.running
                ? 'border-profit/30 bg-profit/10 text-profit hover:bg-profit/20'
                : 'border-warn/30 bg-warn/10 text-warn hover:bg-warn/20',
            )}
          >
            <span className={cn('w-1.5 h-1.5 rounded-full', agentStatus.running ? 'bg-profit animate-dot-pulse' : 'bg-warn')} />
            {agentStatus.running ? (
              <>
                <Activity className="w-3 h-3" />
                <span>AGENT: RUNNING</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3" />
                <span>AGENT: PAUSED</span>
              </>
            )}
          </button>
        )}

        {account && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-bg-elevated border border-border rounded text-[11px] text-text-muted hover:text-text-secondary hover:border-border-strong transition-colors"
            title="Click to copy account ID"
          >
            {copied ? <ChevronUp className="w-3 h-3 text-profit" /> : <Copy className="w-3 h-3" />}
            <span className="tabular-nums">{account.account_id.slice(0, 8)}…</span>
          </button>
        )}
      </div>
    </header>
  );
}
