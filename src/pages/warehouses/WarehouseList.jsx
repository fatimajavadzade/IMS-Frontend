import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Warehouse as WarehouseIcon,
  Pencil,
  Trash2,
  MapPin,
  Power,
  PowerOff,
} from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../../components/ui/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import ConfirmDialog from "../../components/ui/ConfirmDialog.jsx";
import Spinner from "../../components/ui/Spinner.jsx";

import { useWarehouses } from "../../hooks/warehouses/useWarehouses";
import { useDeleteWarehouse } from "../../hooks/warehouses/useDeleteWarehouse";
import { useActivateWarehouse } from "../../hooks/warehouses/useActivateWarehouse";
import { useDeactivateWarehouse } from "../../hooks/warehouses/useDeactivateWarehouse";

function WarehouseList() {
  const navigate = useNavigate();

  const { data: warehouses = [], isLoading } = useWarehouses();

  const deleteWarehouseMutation = useDeleteWarehouse();
  const activateWarehouseMutation = useActivateWarehouse();
  const deactivateWarehouseMutation = useDeactivateWarehouse();

  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const handleDelete = async () => {
    try {
      await deleteWarehouseMutation.mutateAsync(deletingId);

      toast.success("Anbar uğurla silindi.");
      setDeletingId(null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Anbar silinərkən xəta baş verdi.",
      );
    }
  };

  const handleToggleStatus = async (warehouse) => {
    const isActive = warehouse.status === "ACTIVE";

    setTogglingId(warehouse.id);

    try {
      if (isActive) {
        await deactivateWarehouseMutation.mutateAsync(warehouse.id);
        toast.success("Anbar deaktiv edildi.");
      } else {
        await activateWarehouseMutation.mutateAsync(warehouse.id);
        toast.success("Anbar aktivləşdirildi.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Status dəyişdirilə bilmədi.",
      );
    } finally {
      setTogglingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Anbarlar"
        subtitle="Bütün logistika mərkəzləri və saxlama sahələri."
        action={
          <Button onClick={() => navigate("/warehouses/new")}>
            <Plus className="h-4 w-4" />
            Yeni Anbar
          </Button>
        }
      />

      {warehouses.length === 0 ? (
        <EmptyState
          icon={WarehouseIcon}
          title="Hələ anbar əlavə olunmayıb"
          description="Yeni logistika mərkəzi və ya saxlama sahəsi əlavə edərək başlayın."
          action={
            <Button
              onClick={() => navigate("/warehouses/new")}
              className="mt-3"
            >
              <Plus className="h-4 w-4" />
              Yeni Anbar
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {warehouses.map((warehouse) => {
            const isActive = warehouse.status === "ACTIVE";

            return (
              <div
                key={warehouse.id}
                className="rounded-xl border border-ink-100 bg-white p-5 dark:border-white/10 dark:bg-ink-900"
              >
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                    <WarehouseIcon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink-900 dark:text-ink-100">
                      {warehouse.name}
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-xs text-ink-500 dark:text-ink-400">
                      <MapPin className="h-3 w-3 shrink-0" />

                      {warehouse.latitude != null && warehouse.longitude != null
                        ? `${warehouse.latitude.toFixed(5)}, ${warehouse.longitude.toFixed(5)}`
                        : "Məkan seçilməyib"}
                    </p>
                  </div>

                  <Badge tone={isActive ? "good" : "neutral"}>
                    {isActive ? "Aktiv" : "Passiv"}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-ink-100 pt-4 dark:border-white/10">
                  <div>
                    <p className="text-xs text-ink-500 dark:text-ink-400">
                      Menecer
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-ink-900 dark:text-ink-100">
                      {warehouse.manager?.email ?? "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-ink-500 dark:text-ink-400">
                      Ümumi tutum
                    </p>

                    <p className="mt-1 text-sm font-medium text-ink-900 dark:text-ink-100">
                      {warehouse.capacity}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-ink-500 dark:text-ink-400">
                      Boş yer
                    </p>

                    <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {warehouse.freeSpace}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-ink-100 pt-4 dark:border-white/10">
                  <Button
                    variant="ghost"
                    size="sm"
                    loading={togglingId === warehouse.id}
                    onClick={() => handleToggleStatus(warehouse)}
                    className={
                      isActive
                        ? "text-bad-700 hover:bg-bad-100 dark:text-bad-400 dark:hover:bg-bad-500/10"
                        : "text-good-700 hover:bg-good-100 dark:text-good-400 dark:hover:bg-good-500/10"
                    }
                  >
                    {isActive ? (
                      <PowerOff className="h-4 w-4" />
                    ) : (
                      <Power className="h-4 w-4" />
                    )}

                    {isActive ? "Deaktiv et" : "Aktivləşdir"}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/warehouses/${warehouse.id}/edit`)}
                  >
                    <Pencil className="h-4 w-4" />
                    Redaktə et
                  </Button>

                  {/* <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingId(warehouse.id)}
                    className="text-bad-700 hover:bg-bad-100 dark:text-bad-400 dark:hover:bg-bad-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    Sil
                  </Button> */}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        loading={deleteWarehouseMutation.isPending}
        title="Anbarı sil"
        description="Bu anbar sistemdən həmişəlik silinəcək."
      />
    </div>
  );
}

export default WarehouseList;
