function Pagination({ page, totalPages = 1, onChange, totalItems, pageSize }) {
  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems ?? 0);
  return (
    <div className="flex items-center justify-between border-t border-ink-100 px-5 py-3 text-sm text-ink-500 dark:border-white/10 dark:text-ink-400">
      <span>
        {totalItems != null
          ? `${totalItems} nəticədən ${from}-${to} arası göstərilir`
          : `Səhifə ${page}`}
      </span>
      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="rounded-lg border border-ink-100 px-2 py-1 hover:bg-ink-100/60 disabled:opacity-40 dark:border-white/10 dark:hover:bg-white/5"
        >
          ‹
        </button>
        <span className="rounded-lg bg-brand-700 px-2.5 py-1 text-white dark:bg-brand-600">
          {page}
        </span>
        <button
          disabled={totalPages && page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="rounded-lg border border-ink-100 px-2 py-1 hover:bg-ink-100/60 disabled:opacity-40 dark:border-white/10 dark:hover:bg-white/5"
        >
          ›
        </button>
      </div>
    </div>
  );
}

export default Pagination;