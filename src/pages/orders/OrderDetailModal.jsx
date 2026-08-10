import { useState } from "react";
import toast from "react-hot-toast";

import Modal from "../../components/ui/Modal.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Select from "../../components/ui/Select.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";

import { useOrder } from "../../hooks/orders/useOrder";
import { useUpdateOrderStatus } from "../../hooks/orders/useUpdateOrderStatus";

import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONES,
  ORDER_STATUS_OPTIONS,
} from "../../constants/orderStatus.js";

const formatMoney = (value) =>
  new Intl.NumberFormat("az-AZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value ?? 0);

const OrderDetailModal = ({ open, onClose, orderId }) => {
  const { data: order, isLoading } = useOrder(orderId);
  const updateStatusMutation = useUpdateOrderStatus();

  const [nextStatus, setNextStatus] = useState("");

  const handleStatusChange = async () => {
    if (!nextStatus || nextStatus === order?.status) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: orderId,
        status: nextStatus,
      });
      toast.success("Sifarişin statusu yeniləndi.");
      setNextStatus("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Status yenilənə bilmədi.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={order ? `Sifariş #${order.id}` : "Sifariş"}
      subtitle={order?.companyName}
      size="lg"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Bağla
        </Button>
      }
    >
      {isLoading || !order ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <div>
          <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-ink-500 dark:text-ink-400">Anbar</p>
              <p className="mt-1 text-sm font-medium text-ink-900 dark:text-ink-100">
                {order.warehouseName || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-ink-500 dark:text-ink-400">Status</p>
              <div className="mt-1">
                <Badge tone={ORDER_STATUS_TONES[order.status] || "neutral"}>
                  {ORDER_STATUS_LABELS[order.status] || order.status}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-xs text-ink-500 dark:text-ink-400">
                Ümumi məbləğ
              </p>
              <p className="mt-1 text-sm font-medium text-ink-900 dark:text-ink-100">
                {formatMoney(order.totalCost)} ₼
              </p>
            </div>

            <div>
              <p className="text-xs text-ink-500 dark:text-ink-400">Tarix</p>
              <p className="mt-1 text-sm font-medium text-ink-900 dark:text-ink-100">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString("az-AZ")
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
                {ORDER_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {ORDER_STATUS_LABELS[status]}
                  </option>
                ))}
              </Select>
            </div>

            <Button
              onClick={handleStatusChange}
              loading={updateStatusMutation.isPending}
              disabled={!nextStatus || nextStatus === order.status}
            >
              Yenilə
            </Button>
          </div>

          <div className="overflow-hidden rounded-lg border border-ink-100 dark:border-white/10">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-500 dark:border-white/10 dark:text-ink-400">
                  <th className="px-4 py-2 font-medium">Məhsul</th>
                  <th className="px-4 py-2 font-medium">SKU</th>
                  <th className="px-4 py-2 font-medium">Miqdar</th>
                  <th className="px-4 py-2 font-medium">Qiymət</th>
                  <th className="px-4 py-2 font-medium">Cəmi</th>
                </tr>
              </thead>
              <tbody>
                {(order.items || []).map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-ink-100 last:border-0 dark:border-white/10"
                  >
                    <td className="px-4 py-3 text-ink-700 dark:text-ink-300">
                      {item.productName}
                    </td>
                    <td className="px-4 py-3 text-ink-700 dark:text-ink-300">
                      {item.skuCode}
                    </td>
                    <td className="px-4 py-3 text-ink-700 dark:text-ink-300">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-ink-700 dark:text-ink-300">
                      {formatMoney(item.costPrice)} ₼
                    </td>
                    <td className="px-4 py-3 font-medium text-ink-900 dark:text-ink-100">
                      {formatMoney(item.costPrice * item.quantity)} ₼
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

export default OrderDetailModal;
