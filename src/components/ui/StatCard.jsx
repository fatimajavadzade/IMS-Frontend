function StatCard({
  label,
  value,
  icon: Icon,
  tone = "bg-brand-50 text-brand-700",
}) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-4 dark:border-white/10 dark:bg-ink-900">
      <div
        className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${tone} dark:bg-brand-500/15 dark:text-brand-300`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xl font-bold text-ink-900 dark:text-ink-100">
        {value}
      </p>
      <p className="text-xs uppercase tracking-wide text-ink-500 dark:text-ink-400">
        {label}
      </p>
    </div>
  );
}

export default StatCard;