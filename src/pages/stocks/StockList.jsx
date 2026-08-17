import { useMemo, useState } from "react";
import {
  Boxes,
  Warehouse as WarehouseIcon,
  PackageSearch,
  AlertTriangle,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../../components/ui/PageHeader.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Badge from "../../components/ui/Badge.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import ConfirmDialog from "../../components/ui/ConfirmDialog.jsx";
import Spinner from "../../components/ui/Spinner.jsx";

import { useStocks } from "../../hooks/stocks/useStocks";
import { useStocksPage } from "../../hooks/stocks/useStocksPage";
import { useDeleteStock } from "../../hooks/stocks/useDeleteStock";
import { useWarehouses } from "../../hooks/warehouses/useWarehouses";

import StockFormModal from "./StockFormModal.jsx";

const PAGE_SIZE = 8;
const LOW_STOCK_THRESHOLD = 10;

const StockList = () => {
  const { data: stocks = [] } = useStocks();
  const deleteStockMutation = useDeleteStock();
  const { data: warehouses = [] } = useWarehouses();

  const [search, setSearch] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Matches the /api/stocks/page query params exactly: page, size, warehouseId, sortBy, sortDir
  const queryParams = useMemo(
    () => ({
      page: page - 1, // backend "page" param is 0-indexed (Default value: 0)
      size: PAGE_SIZE,
      ...(warehouseId ? { warehouseId } : {}),
      sortBy: "id",
      sortDir: "asc",
    }),
    [page, warehouseId],
  );

  const { data: stockPage, isLoading } = useStocksPage(queryParams);

  const totalItems = stockPage?.totalElements ?? 0;
  const totalPages = Math.max(1, stockPage?.totalPages ?? 1);

  // Backend has no free-text search param, so this only filters the
  // rows already loaded for the current page.
  const pageItems = useMemo(() => {
    const content = stockPage?.content ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return content;
    return content.filter(
      (s) =>
        s.product?.name?.toLowerCase().includes(q) ||
        s.product?.sku?.toLowerCase().includes(q) ||
        s.warehouse?.name?.toLowerCase().includes(q),
    );
  }, [search, stockPage]);

  const stats = useMemo(() => {
    const warehouseCount = new Set(stocks.map((s) => s.warehouse?.id)).size;
    const totalQuantity = stocks.reduce((sum, s) => sum + (s.quantity ?? 0), 0);
    const lowStockCount = stocks.filter(
      (s) => (s.quantity ?? 0) <= LOW_STOCK_THRESHOLD,
    ).length;

    return [
      {
        label: "Stok qeydləri",
        value: stocks.length,
        icon: Boxes,
        tone: "bg-brand-50 text-brand-700",
      },
      {
        label: "Anbarlar",
        value: warehouseCount,
        icon: WarehouseIcon,
        tone: "bg-good-100 text-good-700",
      },
      {
        label: "Ümumi miqdar",
        value: totalQuantity,
        icon: PackageSearch,
        tone: "bg-brand-50 text-brand-700",
      },
      {
        label: "Az qalan stoklar",
        value: lowStockCount,
        icon: AlertTriangle,
        tone: "bg-warn-100 text-warn-700",
      },
    ];
  }, [stocks]); // Calculate statistics for the stock list

  const openCreate = () => {
    setEditingStock(null);
    setFormOpen(true);
  };

  const openEdit = (stock) => {
    setEditingStock(stock);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingStock(null);
  };

  const handleDelete = async () => {
    try {
      await deleteStockMutation.mutateAsync(deletingId);
      toast.success("Stok qeydi uğurla silindi.");
      setDeletingId(null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Stok silinərkən xəta baş verdi.",
      );
    }
  };

  const columns = [
    {
      key: "product",
      header: "Məhsul",
      render: (row) => (
        <div>
          <p className="font-medium text-ink-900 dark:text-ink-100">
            {row.product?.name || "—"}
          </p>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            {row.product?.sku || "—"}
          </p>
        </div>
      ),
    },
    {
      key: "warehouse",
      header: "Anbar",
      render: (row) => (
        <span className="flex items-center gap-2 text-ink-700 dark:text-ink-300">
          <WarehouseIcon className="h-4 w-4 shrink-0 text-ink-300 dark:text-ink-500" />
          {row.warehouse?.name || "—"}
        </span>
      ),
    },
    {
      key: "quantity",
      header: "Miqdar",
      render: (row) => {
        const isLow = (row.quantity ?? 0) <= LOW_STOCK_THRESHOLD;
        return (
          <Badge tone={isLow ? "warn" : "good"}>{row.quantity} ədəd</Badge>
        );
      },
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => openEdit(row)}
            className="rounded-lg p-2 text-ink-300 hover:bg-ink-100/60 hover:text-brand-700 dark:text-ink-500 dark:hover:bg-white/5 dark:hover:text-brand-400"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeletingId(row.id)}
            className="rounded-lg p-2 text-ink-300 hover:bg-bad-100 hover:text-bad-700 dark:text-ink-500 dark:hover:bg-bad-500/10 dark:hover:text-bad-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

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
        title="Stok"
        subtitle="Anbarlar üzrə məhsul miqdarlarının izlənməsi."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Yeni Stok
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-ink-100 bg-white p-3 dark:border-white/10 dark:bg-ink-900">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari səhifədə axtar (Məhsul adı, SKU və ya anbar)..."
          className="min-w-[220px] flex-1"
        />
        <Select
          value={warehouseId}
          onChange={(e) => {
            setWarehouseId(e.target.value);
            setPage(1);
          }}
          className="w-auto min-w-[180px]"
        >
          <option value="">Bütün anbarlar</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-100 bg-white dark:border-white/10 dark:bg-ink-900">
        <DataTable
          columns={columns}
          data={pageItems}
          rowKey={(row) => row.id}
          emptyText="Hələ stok qeydi əlavə olunmayıb"
        />
        {totalItems > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        )}
      </div>

      <StockFormModal
        open={formOpen}
        onClose={closeForm}
        stock={editingStock}
      />

      <ConfirmDialog
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        loading={deleteStockMutation.isPending}
        title="Stok qeydini sil"
        description="Bu stok qeydi sistemdən həmişəlik silinəcək."
      />
    </div>
  );
};

export default StockList;
