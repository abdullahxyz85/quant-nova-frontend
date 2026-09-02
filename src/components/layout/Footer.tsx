import { useStore } from '@/store';

export function Footer() {
  const { account } = useStore();
  const accountId = account?.account_id ?? 'N/A';

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-8 bg-bg-panel border-t border-border flex items-center justify-center px-4 z-50">
      <span className="text-[10px] uppercase tracking-wider text-text-muted">
        <span className="text-warn">PAPER TRADING</span>
        {' · '}
        Alpaca Paper Account <span className="tabular-nums text-text-secondary">{accountId}</span>
        {' · '}
        <span className="text-profit">No real capital at risk</span>
      </span>
    </footer>
  );
}
