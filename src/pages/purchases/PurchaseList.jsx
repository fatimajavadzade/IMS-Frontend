import { useMemo, useState } from "react";
import {
  Truck,
  Warehouse as WarehouseIcon,
  Wallet,
  Clock,
  Plus,
  Eye,
} from "lucide-react";

import PageHeader from "../../components/ui/PageHeader.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Badge from "../../components/ui/Badge.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import Spinner from "../../components/ui/Spinner.jsx";

import { usePurchases } from "../../hooks/purchases/usePurchases";
import { usePurchasesPage } from "../../hooks/purchases/usePurchasesPage";
import { useWarehouses } from "../../hooks/warehouses/useWarehouses";
import {
  PURCHASE_STATUS_LABELS,
  PURCHASE_STATUS_TONES,
  PURCHASE_STATUS_OPTIONS,
} from "../../constants/purchaseStatus.js";

import PurchaseFormModal from "./PurchaseFormModal.jsx";
import PurchaseDetailModal from "./PurchaseDetailModal.jsx";

const PAGE_SIZE = 8;

const formatMoney = (value) =>
  new Intl.NumberFormat("az-AZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value ?? 0);

const PurchaseList = () => {
  // Full (unpaged) list is kept only to power the aggregate stat cards below,
  // since /api/purchases/page only returns one page of results at a time.
  const { data: purchases = [] } = usePurchases();
  const { data: warehouses = [] } = useWarehouses();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [page, setPage] = useState(1); // 1-indexed for the UI/Pagination component
  const [formOpen, setFormOpen] = useState(false);
  const [viewingId, setViewingId] = useState(null);

  // Matches the /api/purchases/page query params exactly: page, size, status, warehouseId, sortBy, sortDir
  const queryParams = useMemo(
    () => ({
      page: page - 1, // backend "page" param is 0-indexed (Default value: 0)
      size: PAGE_SIZE,
      ...(status ? { status } : {}),
      ...(warehouseId ? { warehouseId } : {}),
      sortBy: "id",
      sortDir: "asc",
    }),
    [page, status, warehouseId],
  );

  const { data: purchasePage, isLoading } = usePurchasesPage(queryParams);

  const totalItems = purchasePage?.totalElements ?? 0;
  const totalPages = Math.max(1, purchasePage?.totalPages ?? 1);

  // Backend has no free-text search param, so this only filters the
  // rows already loaded for the current page.
  const pageItems = useMemo(() => {
    const content = purchasePage?.content ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return content;
    return content.filter(
      (p) =>
        p.supplierName?.toLowerCase().includes(q) ||
        p.warehouseName?.toLowerCase().includes(q) ||
        String(p.id).includes(q),
    );
  }, [search, purchasePage]);

  const stats = useMemo(() => {
    const warehouseCount = new Set(purchases.map((p) => p.warehouseId)).size;
    const totalCost = purchases.reduce((sum, p) => sum + (p.totalCost ?? 0), 0);
    const pendingCount = purchases.filter((p) => p.status === "PENDING").length;

    return [
      {
        label: "Sifarişlər",
        value: purchases.length,
        icon: Truck,
        tone: "bg-brand-50 text-brand-700",
      },
      {
        label: "Anbarlar",
        value: warehouseCount,
        icon: WarehouseIcon,
        tone: "bg-good-100 text-good-700",
      },
      {
        label: "Ümumi məbləğ",
        value: `${formatMoney(totalCost)} ₼`,
        icon: Wallet,
        tone: "bg-brand-50 text-brand-700",
      },
      {
        label: "Gözləmədə olan",
        value: pendingCount,
        icon: Clock,
        tone: "bg-warn-100 text-warn-700",
      },
    ];
  }, [purchases]); // Sifarişlər üzrə statistika hesablanır

  const columns = [
    {
      key: "id",
      header: "№",
      render: (row) => (
        <span className="font-medium text-ink-900 dark:text-ink-100">
          #{row.id}
        </span>
      ),
    },
    {
      key: "supplierName",
      header: "Təchizatçı",
      render: (row) => row.supplierName || "—",
    },
    {
      key: "warehouseName",
      header: "Anbar",
      render: (row) => (
        <span className="flex items-center gap-2 text-ink-700 dark:text-ink-300">
          <WarehouseIcon className="h-4 w-4 shrink-0 text-ink-300 dark:text-ink-500" />
          {row.warehouseName || "—"}
        </span>
      ),
    },
    {
      key: "totalCost",
      header: "Məbləğ",
      render: (row) => `${formatMoney(row.totalCost)} ₼`,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge tone={PURCHASE_STATUS_TONES[row.status] || "neutral"}>
          {PURCHASE_STATUS_LABELS[row.status] || row.status}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Tarix",
      render: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString("az-AZ")
          : "—",
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex justify-end">
          <button
            onClick={() => setViewingId(row.id)}
            className="rounded-lg p-2 text-ink-300 hover:bg-ink-100/60 hover:text-brand-700 dark:text-ink-500 dark:hover:bg-white/5 dark:hover:text-brand-400"
          >
            <Eye className="h-4 w-4" />
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
        title="Satınalma"
        subtitle="Təchizatçılardan mal qəbulu üçün sifarişlərin idarə edilməsi."
        action={
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Yeni Sifariş
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
          placeholder="Cari səhifədə axtar (Təchizatçı, anbar və ya sifariş nömrəsi)..."
          className="min-w-[220px] flex-1"
        />
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="w-auto min-w-[160px]"
        >
          <option value="">Bütün statuslar</option>
          {PURCHASE_STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {PURCHASE_STATUS_LABELS[s] || s}
            </option>
          ))}
        </Select>
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
          emptyText="Hələ satınalma sifarişi əlavə olunmayıb"
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

      <PurchaseFormModal open={formOpen} onClose={() => setFormOpen(false)} />

      <PurchaseDetailModal
        open={!!viewingId}
        onClose={() => setViewingId(null)}
        purchaseId={viewingId}
      />
    </div>
  );
};

export default PurchaseList;