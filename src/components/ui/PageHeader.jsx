function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-100">
          {title}
        </h1>

        {subtitle && (
          <p className="text-sm text-ink-500 dark:text-ink-400">{subtitle}</p>
        )}
      </div>

      {action}
    </div>
  );
}

export default PageHeader;