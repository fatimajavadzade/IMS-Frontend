function FormField({ label, error, hint, required, children }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-300">
          {label}{" "}
          {required && (
            <span className="text-bad-700 dark:text-bad-400">*</span>
          )}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">{hint}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-bad-700 dark:text-bad-400">{error}</p>
      )}
    </div>
  );
}

export default FormField;