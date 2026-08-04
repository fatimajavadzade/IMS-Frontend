function Toggle({ label, hint, checked, onChange, name }) {
  return (
    <label className="flex items-center justify-between rounded-lg bg-ink-100/40 px-3 py-3 dark:bg-white/5">
      <span>
        <span className="block text-sm font-medium text-ink-900 dark:text-ink-100">
          {label}
        </span>

        {hint && (
          <span className="block text-xs text-ink-500 dark:text-ink-400">
            {hint}
          </span>
        )}
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        name={name}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? "bg-brand-700 dark:bg-brand-500"
            : "bg-ink-300 dark:bg-white/15"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
            checked ? "left-5" : "left-0.5"
          }`}
        />
      </button>
    </label>
  );
}

export default Toggle;