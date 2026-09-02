import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  Eye,
  X,
} from 'lucide-react';
import { useStore } from '@/store';
import { Panel } from '@/components/ui/Panel';
import type { AgentStage, Decision } from '@/types';
import { cn } from '@/utils/cn';

const stages: { id: AgentStage; label: string; shortLabel: string }[] = [
  { id: 'MARKET_ANALYST', label: 'Market Analyst', shortLabel: 'ANALYST' },
  { id: 'OPPORTUNITY_SCANNER', label: 'Opportunity Scanner', shortLabel: 'SCANNER' },
  { id: 'OPTIONS_STRATEGIST', label: 'Options Strategist', shortLabel: 'STRATEGIST' },
  { id: 'RISK_MANAGER', label: 'Risk Manager', shortLabel: 'RISK' },
  { id: 'EXECUTION', label: 'Execution', shortLabel: 'EXEC' },
  { id: 'PORTFOLIO_MONITOR', label: 'Portfolio Monitor', shortLabel: 'MONITOR' },
];

const stageOutputs: Record<AgentStage, string> = {
  MARKET_ANALYST: 'NVDA · BULL_TREND · ADX 31 · conf 84%',
  OPPORTUNITY_SCANNER: 'NVDA · composite 78 · 6/8 bullish',
  OPTIONS_STRATEGIST: 'Bull Call Spread 178/185 · 24 DTE',
  RISK_MANAGER: 'APPROVED · max loss $420 (0.42% equity)',
  EXECUTION: 'Order filled · NVDA x2 @ $2.10 net debit',
  PORTFOLIO_MONITOR: '4 positions · delta 0.42 · theta -$0.149/d',
};

const stageStatuses: Record<AgentStage, 'completed' | 'active' | 'idle'> = {
  MARKET_ANALYST: 'completed',
  OPPORTUNITY_SCANNER: 'completed',
  OPTIONS_STRATEGIST: 'active',
  RISK_MANAGER: 'idle',
  EXECUTION: 'idle',
  PORTFOLIO_MONITOR: 'idle',
};

function getStageDecision(stage: AgentStage, decisions: Decision[]): Decision | undefined {
  return decisions.find((d) => d.agent_stage === stage);
}

export function AgentPipeline() {
  const { decisions, agentStatus } = useStore();
  const [expandedStage, setExpandedStage] = useState<AgentStage | null>(null);

  const currentStage = agentStatus?.current_stage ?? 'OPTIONS_STRATEGIST';

  const expandedDecision = expandedStage ? getStageDecision(expandedStage, decisions) : null;

  return (
    <Panel title="Agent Pipeline">
      <div className="p-4 overflow-x-auto">
        <div className="flex items-stretch gap-1 min-w-max">
          {stages.map((stage, idx) => {
            const status = stageStatuses[stage.id];
            const decision = getStageDecision(stage.id, decisions);
            const isActive = stage.id === currentStage;
            const isCompleted = stages.findIndex((s) => s.id === currentStage) > idx;

            return (
              <div key={stage.id} className="flex items-stretch">
                <button
                  onClick={() => setExpandedStage(stage.id)}
                  className={cn(
                    'relative flex-1 min-w-[160px] p-3 rounded border text-left transition-all',
                    isActive && 'border-accent/50 bg-accent/10 glow-accent',
                    isCompleted && 'border-profit/30 bg-profit/5',
                    !isActive && !isCompleted && 'border-border bg-bg-elevated hover:border-border-strong',
                  )}
                >
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded pointer-events-none"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.15), transparent)',
                        backgroundSize: '200% 100%',
                        animation: 'borderTravel 2s linear infinite',
                      }}
                    />
                  )}
                  <div className="flex items-center gap-2 mb-1.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-profit" />
                    ) : isActive ? (
                      <div className="w-3.5 h-3.5 rounded-full bg-accent animate-dot-pulse" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-border-strong" />
                    )}
                    <span
                      className={cn(
                        'text-[10px] uppercase tracking-wider font-semibold',
                        isActive ? 'text-accent' : isCompleted ? 'text-profit' : 'text-text-muted',
                      )}
                    >
                      {stage.shortLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-snug font-mono">
                    {stageOutputs[stage.id]}
                  </p>
                  {decision && (
                    <div className="mt-1.5 flex items-center gap-1">
                      {decision.risk_verdict?.status === 'REJECTED' ? (
                        <span className="flex items-center gap-1 text-[9px] text-loss">
                          <XCircle className="w-2.5 h-2.5" /> REJECTED
                        </span>
                      ) : decision.risk_verdict?.status === 'APPROVED' ? (
                        <span className="flex items-center gap-1 text-[9px] text-profit">
                          <CheckCircle2 className="w-2.5 h-2.5" /> APPROVED
                        </span>
                      ) : (
                        <span className="text-[9px] text-text-muted">conf {decision.confidence}%</span>
                      )}
                    </div>
                  )}
                  {decision && (
                    <div className="mt-1 flex items-center gap-1 text-[9px] text-text-muted">
                      <Eye className="w-2.5 h-2.5" /> click to expand
                    </div>
                  )}
                </button>
                {idx < stages.length - 1 && (
                  <div className="flex items-center px-0.5">
                    <ChevronRight className="w-3 h-3 text-border-strong" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {expandedStage && expandedDecision && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="fixed right-0 top-14 bottom-8 w-[400px] bg-bg-panel border-l border-border z-50 overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="text-panel-header uppercase text-text-muted font-semibold">
                {stages.find((s) => s.id === expandedStage)?.label} — Reasoning
              </span>
              <button onClick={() => setExpandedStage(null)} className="text-text-muted hover:text-text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <span className="text-[10px] uppercase text-text-muted">Decision</span>
                <p className="text-sm text-text-primary font-mono mt-1">{expandedDecision.decision}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-text-muted">Confidence</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${expandedDecision.confidence}%` }}
                    />
                  </div>
                  <span className="tabular-nums text-sm text-text-secondary">{expandedDecision.confidence}%</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase text-text-muted">Reason</span>
                <p className="text-sm text-text-secondary mt-1 leading-relaxed">{expandedDecision.reason}</p>
              </div>
              {expandedDecision.key_factors.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase text-text-muted">Key Factors</span>
                  <ul className="mt-1 space-y-1">
                    {expandedDecision.key_factors.map((f, i) => (
                      <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                        <span className="text-accent mt-0.5">•</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {expandedDecision.invalidations.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase text-text-muted">Invalidations</span>
                  <ul className="mt-1 space-y-1">
                    {expandedDecision.invalidations.map((f, i) => (
                      <li key={i} className="text-sm text-warn flex items-start gap-2">
                        <span className="mt-0.5">⚠</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {expandedDecision.risk_verdict && (
                <div className={cn(
                  'p-3 rounded border',
                  expandedDecision.risk_verdict.status === 'APPROVED'
                    ? 'border-profit/30 bg-profit/5'
                    : 'border-loss/30 bg-loss/5',
                )}>
                  <span className="text-[10px] uppercase text-text-muted">Risk Verdict</span>
                  <p className={cn(
                    'text-sm font-semibold mt-1',
                    expandedDecision.risk_verdict.status === 'APPROVED' ? 'text-profit' : 'text-loss',
                  )}>
                    {expandedDecision.risk_verdict.status}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">{expandedDecision.risk_verdict.reason}</p>
                </div>
              )}
              <div>
                <span className="text-[10px] uppercase text-text-muted">Full JSON</span>
                <pre className="mt-1 p-3 bg-bg-base border border-border rounded text-[11px] text-text-secondary overflow-x-auto font-mono">
                  {JSON.stringify(expandedDecision, null, 2)}
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Panel>
  );
}
