const tones = {
  good: "bg-good-100 text-good-700 dark:bg-good-500/15 dark:text-good-400",
  warn: "bg-warn-100 text-warn-700 dark:bg-warn-500/15 dark:text-warn-400",
  bad: "bg-bad-100 text-bad-700 dark:bg-bad-500/15 dark:text-bad-400",
  brand: "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
  neutral: "bg-ink-100 text-ink-700 dark:bg-white/10 dark:text-ink-300",
};

const Badge = ({ tone = "neutral", children }) => {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
};

export default Badge;