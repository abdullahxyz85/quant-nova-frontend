import { useState } from 'react';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  CheckCircle2,
  ChevronRight,
  Cpu,
  GitBranch,
  Github,
  LineChart,
  Play,
  Server,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface LandingPageProps {
  onEnterDashboard: () => void;
}

export function LandingPage({ onEnterDashboard }: LandingPageProps) {
  const [activeAgent, setActiveAgent] = useState(0);

  const agents = [
    { name: 'Market Analyst', icon: BarChart3, desc: 'Analyzes price, volume, trends, momentum, and volatility across the full watchlist', color: 'text-info' },
    { name: 'Opportunity Scanner', icon: TrendingUp, desc: 'Detects trade setups using a composite scoring system across 8 signal components', color: 'text-accent' },
    { name: 'Options Strategist', icon: GitBranch, desc: 'Selects the optimal options strategy — spreads, covered calls, iron condors and more', color: 'text-accent' },
    { name: 'Risk Manager', icon: Shield, desc: 'Enforces 8 risk gates before any trade is approved — exposure, delta, DTE, max loss', color: 'text-warn' },
    { name: 'Execution Agent', icon: Zap, desc: 'Submits multi-leg orders through Alpaca MCP with precise limit pricing', color: 'text-profit' },
    { name: 'Portfolio Monitor', icon: Activity, desc: 'Continuously tracks P&L, greeks, and position health — feeding the next cycle', color: 'text-text-secondary' },
  ];

  return (
    <div className="landing-grid relative min-h-screen overflow-hidden bg-bg-base text-text-primary">
      <div className="landing-glow left-[-180px] top-24 bg-info" />
      <div className="landing-glow right-[-180px] top-[520px] bg-accent" style={{ animationDelay: '-3s' }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-bg-panel/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-gradient-to-br from-accent to-info flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-sm tracking-wide">HRAMY OMNI AI</span>
            <span className="text-[10px] text-text-muted uppercase tracking-widest">Autonomous Options Agent</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://lablab.ai/ai-hackathons/alpaca-ai-trading-agents-hackathon" target="_blank" rel="noreferrer" className="hidden md:block text-xs text-text-muted hover:text-text-secondary uppercase tracking-wider">Hackathon</a>
          <button
            onClick={onEnterDashboard}
            className="flex items-center gap-2 px-4 py-1.5 bg-accent hover:bg-accent/80 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Launch Terminal
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-16 px-4 md:px-8 w-full max-w-[1500px] mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/30 rounded-full text-xs text-accent uppercase tracking-wider mb-6">
            <Sparkles className="w-3 h-3" />
            Alpaca AI Trading Agents Hackathon
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-balance">
            The Autonomous <span className="bg-gradient-to-r from-info via-accent to-profit bg-clip-text text-transparent">Options Trading</span> Agent
          </h1>
          <p className="mt-6 text-lg text-text-secondary leading-relaxed">
            A multi-agent AI system that analyzes market conditions, detects opportunities,
            selects options strategies, enforces strict risk gates, and executes trades through
            Alpaca — all autonomously, in paper trading.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={onEnterDashboard}
              className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/80 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <Play className="w-4 h-4" />
              View Live Dashboard
            </button>
            <a
              href="#architecture"
              className="flex items-center gap-2 px-6 py-3 border border-border-strong text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg text-sm font-semibold transition-colors"
            >
              Explore Architecture
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Starting Capital', value: '$100,000', icon: Server },
            { label: 'Agent Stages', value: '6', icon: Bot },
            { label: 'Risk Gates', value: '8', icon: Shield },
            { label: 'Strategies', value: '10+', icon: GitBranch },
          ].map((s) => (
            <div key={s.label} className="panel neon-border hover-lift p-4 flex min-w-0 items-center gap-3">
              <div className="w-10 h-10 rounded bg-bg-elevated flex items-center justify-center">
                <s.icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xl tabular-nums font-bold">{s.value}</p>
                <p className="text-[10px] uppercase text-text-muted tracking-wider">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" className="relative py-16 px-4 md:px-8 w-full max-w-[1500px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Multi-Agent Pipeline</h2>
          <p className="mt-3 text-text-secondary">Six specialized agents work in sequence — observe, analyze, decide, risk-check, execute, monitor.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent, i) => (
            <button
              key={agent.name}
              onClick={() => setActiveAgent(i)}
              className={cn(
                'panel neon-border hover-lift p-5 text-left transition-all hover:border-border-strong',
                activeAgent === i && 'border-accent/40 glow-accent',
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={cn('w-9 h-9 rounded bg-bg-elevated flex items-center justify-center', agent.color)}>
                  <agent.icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider">Agent {i + 1}</span>
                  <h3 className="text-sm font-semibold">{agent.name}</h3>
                </div>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{agent.desc}</p>
              {i < agents.length - 1 && (
                <div className="mt-3 flex items-center gap-1 text-[10px] text-text-muted uppercase tracking-wider">
                  <span>Next</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-accent">{agents[i + 1].name}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative py-16 px-4 md:px-8 w-full max-w-[1500px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Built for Judges</h2>
          <p className="mt-3 text-text-secondary">Every element designed to demonstrate autonomous trading, risk discipline, and Alpaca integration.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Brain, title: 'AI Reasoning Visible', desc: 'Every trade decision shows the full reasoning chain — key factors, invalidations, and risk verdicts.' },
            { icon: Shield, title: 'Risk Gates Enforced', desc: '8 risk gates block dangerous trades. Rejections are highlighted as proof of discipline, not hidden.' },
            { icon: LineChart, title: 'P&L-at-Expiration Diagrams', desc: 'Every position shows its payoff diagram with breakeven markers and current price overlay.' },
            { icon: GitBranch, title: 'Full Options Chain', desc: 'Two-sided chain with IV heatmap, greeks, and ATM highlighting — the real trading experience.' },
            { icon: Cpu, title: 'Alpaca MCP Integration', desc: 'Orders submitted through Alpaca MCP server with multi-leg order support and paper trading.' },
            { icon: BarChart3, title: 'Backtest Validation', desc: 'Out-of-sample, validation, and in-sample segments with equity vs benchmark and drawdown charts.' },
          ].map((f) => (
            <div key={f.title} className="panel hover-lift p-5">
              <div className="w-10 h-10 rounded bg-accent/10 border border-accent/20 flex items-center justify-center mb-3">
                <f.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="relative py-16 px-4 md:px-8 w-full max-w-[1500px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Technology Stack</h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Recharts', 'Zustand', 'Framer Motion', 'Alpaca API', 'Alpaca MCP', 'Paper Trading'].map((tech) => (
            <span key={tech} className="hover-lift inline-flex px-4 py-2 bg-bg-panel border border-border rounded-lg text-sm text-text-secondary">
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 md:px-8">
        <div className="neon-border hover-lift max-w-3xl mx-auto text-center panel p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to See It Trade?</h2>
          <p className="text-text-secondary mb-8">
            Launch the live dashboard to watch the agent analyze markets, make decisions,
            enforce risk gates, and execute options trades in real time.
          </p>
          <button
            onClick={onEnterDashboard}
            className="inline-flex items-center gap-2 px-8 py-3 bg-accent hover:bg-accent/80 text-white rounded-lg text-sm font-semibold uppercase tracking-wider transition-colors"
          >
            Launch Terminal
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 md:px-8">
        <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-accent to-info flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold">HRAMY OMNI AI</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-profit" />
              Paper Trading
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-warn" />
              No Real Capital at Risk
            </span>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-text-secondary">
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
