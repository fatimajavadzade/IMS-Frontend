const variants = {
  primary:
    "bg-brand-700 text-white hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500",
  secondary:
    "border border-ink-100 text-ink-700 hover:bg-ink-100/60 dark:border-white/10 dark:text-ink-300 dark:hover:bg-white/5",
  ghost:
    "text-ink-500 hover:bg-ink-100/60 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-white/5 dark:hover:text-ink-100",
  danger:
    "bg-bad-700 text-white hover:bg-bad-700/90 dark:bg-bad-600 dark:hover:bg-bad-500",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      disabled={loading || disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition
      disabled:cursor-not-allowed disabled:opacity-60
      ${variants[variant]}
      ${sizes[size]}
      ${className}`}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        children
      )}
    </button>
  );
}

export default Button;