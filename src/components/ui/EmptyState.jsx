import React from "react";

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      {Icon && (
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-300 dark:bg-white/5 dark:text-ink-500">
          <Icon className="h-6 w-6" />
        </div>
      )}

      <p className="font-medium text-ink-900 dark:text-ink-100">{title}</p>

      {description && (
        <p className="max-w-sm text-sm text-ink-500 dark:text-ink-400">
          {description}
        </p>
      )}

      {action}
    </div>
  );
}

export default EmptyState;