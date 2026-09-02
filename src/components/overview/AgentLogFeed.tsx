import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useStore } from '@/store';
import { api, type AgentLogEntry } from '@/api';
import { Panel } from '@/components/ui/Panel';
import type { AgentStage } from '@/types';
import { formatTime } from '@/utils/format';
import { cn } from '@/utils/cn';

const agentColors: Record<AgentStage, string> = {
  MARKET_ANALYST: 'text-info',
  OPPORTUNITY_SCANNER: 'text-accent',
  OPTIONS_STRATEGIST: 'text-accent',
  RISK_MANAGER: 'text-warn',
  EXECUTION: 'text-profit',
  PORTFOLIO_MONITOR: 'text-text-secondary',
};

const levelColors: Record<string, string> = {
  info: 'text-text-secondary',
  success: 'text-profit',
  warn: 'text-warn',
  error: 'text-loss',
};

const agentLabels: Record<AgentStage, string> = {
  MARKET_ANALYST: 'ANALYST',
  OPPORTUNITY_SCANNER: 'SCANNER',
  OPTIONS_STRATEGIST: 'STRATEGIST',
  RISK_MANAGER: 'RISK',
  EXECUTION: 'EXEC',
  PORTFOLIO_MONITOR: 'MONITOR',
};

const filterAgents: AgentStage[] = [
  'MARKET_ANALYST',
  'OPPORTUNITY_SCANNER',
  'OPTIONS_STRATEGIST',
  'RISK_MANAGER',
  'EXECUTION',
  'PORTFOLIO_MONITOR',
];

export function AgentLogFeed() {
  const { agentLog, addLogEntry } = useStore();
  const [autoscroll, setAutoscroll] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Set<AgentStage>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulate live feed
  useEffect(() => {
    const interval = setInterval(() => {
      const entry = api.genNewLogEntry() as AgentLogEntry;
      addLogEntry(entry);
    }, 5000);
    return () => clearInterval(interval);
  }, [addLogEntry]);

  // Auto-scroll
  useEffect(() => {
    if (autoscroll && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [agentLog, autoscroll]);

  const handleScroll = () => {
    if (scrollRef.current && scrollRef.current.scrollTop > 10) {
      setAutoscroll(false);
    }
  };

  const toggleFilter = (agent: AgentStage) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(agent)) next.delete(agent);
      else next.add(agent);
      return next;
    });
  };

  const filteredLog = activeFilters.size === 0
    ? agentLog
    : agentLog.filter((e) => activeFilters.has(e.agent));

  return (
    <Panel
      title="Live Agent Log"
      headerRight={
        <button
          onClick={() => setAutoscroll(!autoscroll)}
          className={cn(
            'flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-wider rounded transition-colors',
            autoscroll ? 'text-profit' : 'text-text-muted',
          )}
        >
          {autoscroll ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          {autoscroll ? 'Auto' : 'Paused'}
        </button>
      }
    >
      <div className="px-3 py-2 border-b border-border flex flex-wrap gap-1">
        {filterAgents.map((agent) => (
          <button
            key={agent}
            onClick={() => toggleFilter(agent)}
            className={cn(
              'px-2 py-0.5 text-[9px] uppercase tracking-wider rounded border transition-colors',
              activeFilters.has(agent)
                ? 'border-accent/40 bg-accent/10 text-accent'
                : 'border-border text-text-muted hover:text-text-secondary',
            )}
          >
            {agentLabels[agent]}
          </button>
        ))}
      </div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-[320px] overflow-y-auto font-mono text-[11px] p-2 space-y-0.5"
      >
        {filteredLog.map((entry) => (
          <div
            key={entry.id}
            className={cn(
              'flex items-start gap-2 px-1.5 py-0.5 rounded hover:bg-bg-hover/50',
              entry.level === 'error' && 'bg-loss/5 border-l-2 border-loss',
            )}
          >
            <span className="text-text-muted tabular-nums shrink-0">{formatTime(entry.ts)}</span>
            <span className={cn('shrink-0 font-semibold', agentColors[entry.agent])}>
              {agentLabels[entry.agent]}
            </span>
            <span className={cn('flex-1', levelColors[entry.level])}>{entry.message}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
