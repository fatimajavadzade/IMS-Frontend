import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  loading,
  title = "Silinməni təsdiqləyin",
  description = "Bu əməliyyat geri qaytarıla bilməz.",
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title=""
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Ləğv et
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            Sil
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bad-100 text-bad-700 dark:bg-bad-500/15 dark:text-bad-400">
          <AlertTriangle className="h-5 w-5" />
        </div>

        <div>
          <p className="font-medium text-ink-900 dark:text-ink-100">{title}</p>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            {description}
          </p>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;