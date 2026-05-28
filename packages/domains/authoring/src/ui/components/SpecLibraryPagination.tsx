interface SpecLibraryPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function SpecLibraryPagination({ page, totalPages, total, pageSize, onPageChange }: SpecLibraryPaginationProps) {
  if (total === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const btnBase = 'px-3 py-1.5 text-[0.8125rem] rounded-[var(--radius-sm)] transition-colors [transition-duration:var(--duration-fast)]';
  const btnEnabled = `${btnBase} bg-[var(--glass-4)] border border-[var(--glass-border)] text-white/60 cursor-pointer hover:bg-[var(--glass-12)] hover:text-white`;
  const btnDisabled = `${btnBase} bg-[var(--glass-4)] border border-[var(--glass-border)] text-white/20 cursor-not-allowed opacity-50`;

  return (
    <div className="flex items-center justify-between mt-4 text-[0.8125rem] text-white/40">
      <span>
        Showing {start}&ndash;{end} of {total} specs
      </span>
      <div className="flex items-center gap-2">
        <button type="button" className={page <= 1 ? btnDisabled : btnEnabled} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button type="button" className={page >= totalPages ? btnDisabled : btnEnabled} disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
