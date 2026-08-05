import { useMemo, useState } from "react";
import {
  Repeat,
  Warehouse as WarehouseIcon,
  PackageSearch,
  Clock,
  Plus,
  Eye,
  ArrowRight,
} from "lucide-react";

import PageHeader from "../../components/ui/PageHeader.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Badge from "../../components/ui/Badge.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import Spinner from "../../components/ui/Spinner.jsx";

import { useTransfers } from "../../hooks/transfers/useTransfers";
import {
  TRANSFER_STATUS_LABELS,
  TRANSFER_STATUS_TONES,
} from "../../constants/transferStatus";

import TransferFormModal from "./TransferFormModal.jsx";
import TransferDetailModal from "./TransferDetailModal.jsx";

const PAGE_SIZE = 8;

const TransferList = () => {
  const { data: transfers = [], isLoading } = useTransfers();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [viewingId, setViewingId] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return transfers;
    return transfers.filter(
      (t) =>
        t.fromWarehouseName?.toLowerCase().includes(q) ||
        t.toWarehouseName?.toLowerCase().includes(q) ||
        String(t.id).includes(q),
    );
  }, [search, transfers]); // Axtarış sorğusuna görə hərəkətləri filtrləyir

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = useMemo(() => {
    const warehouseCount = new Set(
      transfers.flatMap((t) => [t.fromWarehouseId, t.toWarehouseId]),
    ).size;
    const totalQuantity = transfers.reduce(
      (sum, t) =>
        sum + (t.items || []).reduce((s, i) => s + (i.quantity ?? 0), 0),
      0,
    );
    const pendingCount = transfers.filter((t) => t.status === "PENDING").length;

    return [
      {
        label: "Hərəkətlər",
        value: transfers.length,
        icon: Repeat,
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
        label: "Gözləmədə olan",
        value: pendingCount,
        icon: Clock,
        tone: "bg-warn-100 text-warn-700",
      },
    ];
  }, [transfers]); // Hərəkətlər üzrə statistika hesablanır

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
      key: "route",
      header: "Marşrut",
      render: (row) => (
        <span className="flex items-center gap-2 text-ink-700 dark:text-ink-300">
          <WarehouseIcon className="h-4 w-4 shrink-0 text-ink-300 dark:text-ink-500" />
          {row.fromWarehouseName || "—"}
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-ink-300 dark:text-ink-500" />
          {row.toWarehouseName || "—"}
        </span>
      ),
    },
    {
      key: "items",
      header: "Məhsul sayı",
      render: (row) => (row.items || []).length,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge tone={TRANSFER_STATUS_TONES[row.status] || "neutral"}>
          {TRANSFER_STATUS_LABELS[row.status] || row.status}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Tarix",
      render: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString("az-AZ") : "—",
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
        title="Anbar hərəkətləri"
        subtitle="Məhsulların anbarlar arasında köçürülməsinin idarə edilməsi."
        action={
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Yeni Hərəkət
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
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Anbar adı və ya hərəkət nömrəsi..."
          className="min-w-[220px] flex-1"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-100 bg-white dark:border-white/10 dark:bg-ink-900">
        <DataTable
          columns={columns}
          data={pageItems}
          rowKey={(row) => row.id}
          emptyText="Hələ anbar hərəkəti əlavə olunmayıb"
        />
        {pageItems.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        )}
      </div>

      <TransferFormModal open={formOpen} onClose={() => setFormOpen(false)} />

      <TransferDetailModal
        open={!!viewingId}
        onClose={() => setViewingId(null)}
        transferId={viewingId}
      />
    </div>
  );
};

export default TransferList;
