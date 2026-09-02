import { cn } from '@/utils/cn';

interface PanelProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
}

export function Panel({ title, children, className, headerRight }: PanelProps) {
  return (
    <div className={cn('panel flex flex-col', className)}>
      {title && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-panel-header uppercase text-text-muted font-semibold">
            {title}
          </span>
          {headerRight}
        </div>
      )}
      {children}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />;
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-12 text-text-muted text-sm">
      {message}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <span className="text-loss text-sm">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1.5 text-xs border border-border-strong rounded text-text-secondary hover:bg-bg-hover transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}

interface LoadingStateProps {
  loading: boolean;
  error: string | null | undefined;
  onRetry?: () => void;
  emptyMessage?: string;
  hasData?: boolean;
  children: React.ReactNode;
  skeletonClassName?: string;
}

export function AsyncBoundary({
  loading,
  error,
  onRetry,
  emptyMessage,
  hasData,
  children,
  skeletonClassName,
}: LoadingStateProps) {
  if (loading && !hasData) {
    return <Skeleton className={cn('h-32', skeletonClassName)} />;
  }
  if (error && !hasData) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }
  if (!loading && !error && !hasData && emptyMessage) {
    return <EmptyState message={emptyMessage} />;
  }
  return <>{children}</>;
}
