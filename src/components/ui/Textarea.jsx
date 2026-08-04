function Textarea({ className = "", error = false, rows = 4, ...props }) {
  return (
    <textarea
      rows={rows}
      className={`w-full resize-none rounded-lg border bg-ink-100/40 px-3 py-2 text-sm outline-none transition placeholder:text-ink-300 focus:border-brand-500 focus:bg-white dark:bg-white/5 dark:text-ink-100 dark:placeholder:text-ink-500 dark:focus:bg-ink-900 ${
        error
          ? "border-bad-700 dark:border-bad-500"
          : "border-ink-100 dark:border-white/10"
      } ${className}`}
      {...props}
    />
  );
}

export default Textarea;