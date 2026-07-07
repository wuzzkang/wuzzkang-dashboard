'use client';

export default function Skeleton({ type = 'card', count = 3 }) {
  const renderSingle = () => {
    switch (type) {
      case 'profile':
        return (
          <div className="space-y-4">
            {/* Account Info Card Skeleton */}
            <div className="bg-theme-surface border border-theme-border rounded-2xl p-5 mb-4 shadow-sm space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-theme-border/30 animate-pulse shrink-0" />
                <div className="space-y-2 flex-grow">
                  <div className="h-4 bg-theme-border/30 rounded-md w-1/3 animate-pulse" />
                  <div className="h-3 bg-theme-border/30 rounded-md w-1/2 animate-pulse" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-theme-bg rounded-xl p-3.5 border border-theme-border h-20 animate-pulse" />
                <div className="bg-theme-bg rounded-xl p-3.5 border border-theme-border h-20 animate-pulse" />
              </div>
            </div>

            {/* Security/Themes Card Skeleton */}
            <div className="bg-theme-surface border border-theme-border rounded-2xl p-5 mb-4 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-theme-border/30 animate-pulse shrink-0" />
                <div className="h-4 bg-theme-border/30 rounded-md w-1/4 animate-pulse" />
              </div>
              <div className="h-3 bg-theme-border/30 rounded-md w-3/4 animate-pulse" />
              <div className="flex gap-2">
                <div className="flex-1 h-9 bg-theme-border/30 rounded-xl animate-pulse" />
                <div className="flex-1 h-9 bg-theme-border/30 rounded-xl animate-pulse" />
                <div className="flex-1 h-9 bg-theme-border/30 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        );

      case 'list':
        // Transaction row style skeleton
        return (
          <div className="bg-theme-card/30 border border-theme-border/60 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-grow">
              <div className="h-9 w-9 rounded-xl bg-theme-border/30 animate-pulse shrink-0" />
              <div className="space-y-2 flex-grow">
                <div className="h-3.5 bg-theme-border/30 rounded-md w-2/5 animate-pulse" />
                <div className="h-2.5 bg-theme-border/30 rounded-md w-3/5 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <div className="h-3.5 bg-theme-border/30 rounded-md w-16 animate-pulse" />
              <div className="h-2.5 bg-theme-border/30 rounded-md w-12 animate-pulse" />
            </div>
          </div>
        );

      case 'card':
      default:
        // Landing page card skeleton
        return (
          <div className="bg-theme-card/40 border border-theme-border rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start gap-4 mb-3">
                <div className="h-4.5 bg-theme-border/30 rounded-md w-1/2 animate-pulse" />
                <div className="h-5 bg-theme-border/30 rounded-full w-14 animate-pulse" />
              </div>
              <div className="space-y-2.5 mt-3">
                <div className="h-3 bg-theme-border/30 rounded-md w-3/4 animate-pulse" />
                <div className="h-3 bg-theme-border/30 rounded-md w-2/3 animate-pulse" />
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-theme-border/50 flex gap-2">
              <div className="flex-grow h-10 bg-theme-border/30 rounded-xl animate-pulse" />
              <div className="flex-grow h-10 bg-theme-border/30 rounded-xl animate-pulse" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-3 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="animate-fadeIn" style={{ animationDelay: `${idx * 75}ms` }}>
          {renderSingle()}
        </div>
      ))}
    </div>
  );
}
