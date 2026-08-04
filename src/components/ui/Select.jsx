function Select({ className = "", error = false, children, ...props }) {
  return (
    <select
      className={`w-full rounded-lg border bg-ink-100/40 px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:bg-white dark:bg-white/5 dark:text-ink-100 dark:focus:bg-ink-900 ${
        error
          ? "border-bad-700 dark:border-bad-500"
          : "border-ink-100 dark:border-white/10"
      } ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export default Select;