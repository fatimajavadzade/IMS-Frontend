import { useState } from "react";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

import Modal from "../../components/ui/Modal.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Select from "../../components/ui/Select.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";

import { useTransfer } from "../../hooks/transfers/useTransfer";
import { useUpdateTransferStatus } from "../../hooks/transfers/useUpdateTransferStatus";
import {
  TRANSFER_STATUS_LABELS,
  TRANSFER_STATUS_TONES,
  TRANSFER_STATUS_OPTIONS,
} from "../../constants/transferStatus";

const TransferDetailModal = ({ open, onClose, transferId }) => {
  const { data: transfer, isLoading } = useTransfer(transferId);
  const updateStatusMutation = useUpdateTransferStatus();

  const [nextStatus, setNextStatus] = useState("");

  const handleStatusChange = async () => {
    if (!nextStatus || nextStatus === transfer?.status) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: transferId,
        data: { status: nextStatus },
      });
      toast.success("Hərəkətin statusu yeniləndi.");
      setNextStatus("");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Status yenilənə bilmədi.",
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={transfer ? `Hərəkət #${transfer.id}` : "Hərəkət"}
      size="lg"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Bağla
        </Button>
      }
    >
      {isLoading || !transfer ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-ink-100 p-4 dark:border-white/10">
            <div className="flex-1">
              <p className="text-xs text-ink-500 dark:text-ink-400">Haradan</p>
              <p className="mt-1 text-sm font-medium text-ink-900 dark:text-ink-100">
                {transfer.fromWarehouseName || "—"}
              </p>
            </div>

            <ArrowRight className="h-5 w-5 shrink-0 text-ink-300 dark:text-ink-500" />

            <div className="flex-1">
              <p className="text-xs text-ink-500 dark:text-ink-400">Haraya</p>
              <p className="mt-1 text-sm font-medium text-ink-900 dark:text-ink-100">
                {transfer.toWarehouseName || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-ink-500 dark:text-ink-400">Status</p>
              <div className="mt-1">
                <Badge tone={TRANSFER_STATUS_TONES[transfer.status] || "neutral"}>
                  {TRANSFER_STATUS_LABELS[transfer.status] || transfer.status}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-xs text-ink-500 dark:text-ink-400">Tarix</p>
              <p className="mt-1 text-sm font-medium text-ink-900 dark:text-ink-100">
                {transfer.createdAt
                  ? new Date(transfer.createdAt).toLocaleString("az-AZ")
                  : "—"}
              </p>
            </div>
          </div>

          <div className="mb-5 flex flex-wrap items-end gap-2 rounded-lg border border-ink-100 p-3 dark:border-white/10">
            <div className="min-w-[180px] flex-1">
              <p className="mb-1 text-xs font-medium text-ink-700 dark:text-ink-300">
                Statusu dəyiş
              </p>
              <Select
                value={nextStatus}
                onChange={(e) => setNextStatus(e.target.value)}
              >
                <option value="">Yeni status seçin</option>
                {TRANSFER_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {TRANSFER_STATUS_LABELS[status]}
                  </option>
                ))}
              </Select>
            </div>

            <Button
              onClick={handleStatusChange}
              loading={updateStatusMutation.isPending}
              disabled={!nextStatus || nextStatus === transfer.status}
            >
              Yenilə
            </Button>
          </div>

          <div className="overflow-hidden rounded-lg border border-ink-100 dark:border-white/10">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-500 dark:border-white/10 dark:text-ink-400">
                  <th className="px-4 py-2 font-medium">Məhsul</th>
                  <th className="px-4 py-2 font-medium">Miqdar</th>
                </tr>
              </thead>
              <tbody>
                {(transfer.items || []).map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-ink-100 last:border-0 dark:border-white/10"
                  >
                    <td className="px-4 py-3 text-ink-700 dark:text-ink-300">
                      {item.productName}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink-900 dark:text-ink-100">
                      {item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TransferDetailModal;
