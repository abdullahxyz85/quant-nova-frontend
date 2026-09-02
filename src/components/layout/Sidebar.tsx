import {
  BarChart3,
  Briefcase,
  ChevronLeft,
  GitBranch,
  LayoutDashboard,
  Settings,
  Shield,
  ScrollText,
} from 'lucide-react';
import { useStore, type Page } from '@/store';
import { cn } from '@/utils/cn';

const navItems: { id: Page; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'positions', label: 'Positions', icon: Briefcase },
  { id: 'options-chain', label: 'Options Chain', icon: GitBranch },
  { id: 'agent-log', label: 'Agent Log', icon: ScrollText },
  { id: 'risk', label: 'Risk', icon: Shield },
  { id: 'backtest', label: 'Backtest', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { currentPage, setPage, sidebarCollapsed, toggleSidebar } = useStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-14 bottom-8 bg-bg-panel border-r border-border flex flex-col transition-all duration-200 z-40',
        sidebarCollapsed ? 'w-[56px]' : 'w-[200px]',
      )}
    >
      <nav className="flex-1 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors group relative',
                active
                  ? 'text-text-primary bg-accent/10'
                  : 'text-text-muted hover:text-text-secondary hover:bg-bg-hover',
              )}
            >
              {active && (
                <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent" />
              )}
              <Icon className={cn('w-4 h-4 shrink-0', active && 'text-accent')} />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <button
        onClick={toggleSidebar}
        className="flex items-center gap-2 px-4 py-3 text-text-muted hover:text-text-secondary border-t border-border text-xs"
      >
        <ChevronLeft className={cn('w-3.5 h-3.5 transition-transform', sidebarCollapsed && 'rotate-180')} />
        {!sidebarCollapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
}
