type EmptyStateVariant = 'empty-library' | 'no-results' | 'no-archived' | 'invalid-page' | 'error';

interface SpecLibraryEmptyStateProps {
  variant: EmptyStateVariant;
  onClearSearch?: () => void;
  onCreateSpec?: () => void;
  onRetry?: () => void;
}

export function SpecLibraryEmptyState({ variant, onClearSearch, onCreateSpec, onRetry }: SpecLibraryEmptyStateProps) {
  switch (variant) {
    case 'empty-library':
      return (
        <div className="py-12 px-6 text-center text-white/40">
          <p className="text-base font-semibold text-white mb-2">No specs yet</p>
          <p className="text-sm mb-4 max-w-lg mx-auto">Create your first spec or start building a playbook — specs you create there will appear here automatically.</p>
          {onCreateSpec && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-[var(--radius-sm)] border-none cursor-pointer transition-colors [transition-duration:var(--duration-fast)]"
              onClick={onCreateSpec}
            >
              + New spec
            </button>
          )}
        </div>
      );

    case 'no-results':
      return (
        <div className="py-12 px-6 text-center text-white/40">
          <p className="text-base font-semibold text-white mb-2">No specs match your search</p>
          <p className="text-sm mb-4 max-w-lg mx-auto">Try a different term or clear the filter.</p>
          {onClearSearch && (
            <button
              type="button"
              className="text-blue-400 cursor-pointer bg-transparent border-none text-sm underline hover:text-blue-300 transition-colors [transition-duration:var(--duration-fast)]"
              onClick={onClearSearch}
            >
              Clear search
            </button>
          )}
        </div>
      );

    case 'no-archived':
      return (
        <div className="py-12 px-6 text-center text-white/40">
          <p className="text-base font-semibold text-white mb-2">No archived specs</p>
        </div>
      );

    case 'invalid-page':
      return (
        <div className="py-12 px-6 text-center text-white/40">
          <p className="text-base font-semibold text-white mb-2">No specs on this page</p>
        </div>
      );

    case 'error':
      return (
        <div className="py-12 px-6 text-center text-white/40">
          <p className="text-base font-semibold text-white mb-2">Failed to load specs</p>
          <p className="text-sm mb-4 max-w-lg mx-auto">Please try again.</p>
          {onRetry && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-[var(--radius-sm)] border-none cursor-pointer transition-colors [transition-duration:var(--duration-fast)]"
              onClick={onRetry}
            >
              Retry
            </button>
          )}
        </div>
      );
  }
}
