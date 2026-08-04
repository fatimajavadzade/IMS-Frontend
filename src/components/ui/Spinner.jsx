function Spinner({ className = "h-5 w-5" }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-brand-700 border-t-transparent dark:border-brand-400 ${className}`}
    />
  );
}

export default Spinner;