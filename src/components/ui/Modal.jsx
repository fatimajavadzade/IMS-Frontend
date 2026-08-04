import React, { useEffect } from "react";
import { X } from "lucide-react";

const sizes = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

function Modal({
  open,
  onClose,
  title,
  subtitle,
  size = "md",
  children,
  footer,
}) {
  useEffect(() => {
    if (!open) return; // If the modal is not open, do not add event listeners or modify the body style

    const onKey = (e) => e.key === "Escape" && onClose();

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden"; //scroll lock when modal is open

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    }; // cleanup function to remove event listener and restore scroll when modal is closed
  }, [open, onClose]);

  if (!open) return null; // If the modal is not open, render nothing

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-900/50 dark:bg-black/70"
        onClick={onClose}
      />

      <div
        className={`relative flex max-h-[90vh] w-full flex-col rounded-xl2 bg-white shadow-2xl dark:bg-ink-900 dark:ring-1 dark:ring-white/10 ${sizes[size]}`}
      >
        <div className="flex items-start justify-between border-b border-ink-100 px-6 py-4 dark:border-white/10">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-ink-100">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-0.5 text-sm text-ink-500 dark:text-ink-400">
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-ink-300 hover:text-ink-700 dark:text-ink-500 dark:hover:text-ink-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <div className="flex justify-end gap-2 border-t border-ink-100 px-6 py-4 dark:border-white/10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;