import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { TopBar } from '@/components/layout/TopBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { OverviewPage } from '@/pages/OverviewPage';
import { PositionsPage } from '@/pages/PositionsPage';
import { OptionsChainPage } from '@/pages/OptionsChainPage';
import { AgentLogPage } from '@/pages/AgentLogPage';
import { RiskPage } from '@/pages/RiskPage';
import { BacktestPage } from '@/pages/BacktestPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { LandingPage } from '@/pages/LandingPage';
import { cn } from '@/utils/cn';

function App() {
  const { currentPage, sidebarCollapsed, fetchAll } = useStore();
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    if (!showLanding) fetchAll();
  }, [showLanding, fetchAll]);

  if (showLanding) {
    return <LandingPage onEnterDashboard={() => setShowLanding(false)} />;
  }

  const pages: Record<string, React.ReactNode> = {
    overview: <OverviewPage />,
    positions: <PositionsPage />,
    'options-chain': <OptionsChainPage />,
    'agent-log': <AgentLogPage />,
    risk: <RiskPage />,
    backtest: <BacktestPage />,
    settings: <SettingsPage />,
  };

  return (
    <div className="min-h-screen bg-bg-base">
      <TopBar />
      <Sidebar />
      <main
        className={cn(
          'pt-14 pb-8 transition-all duration-200',
          sidebarCollapsed ? 'pl-[56px]' : 'pl-[200px]',
        )}
      >
        <div className="w-full min-w-0 p-3 sm:p-4">
          {pages[currentPage] ?? <OverviewPage />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
