import { useMemo, useState } from "react";
import {
  ShoppingCart,
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

import { useOrders } from "../../hooks/orders/useOrders";
import { useOrdersPage } from "../../hooks/orders/useOrdersPage";
import { useWarehouses } from "../../hooks/warehouses/useWarehouses";
import { useCustomers } from "../../hooks/customers/useCustomers";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONES,
  ORDER_STATUS_OPTIONS,
} from "../../constants/orderStatus.js";

import OrderFormModal from "./OrderFormModal.jsx";
import OrderDetailModal from "./OrderDetailModal.jsx";

const PAGE_SIZE = 8;

const formatMoney = (value) =>
  new Intl.NumberFormat("az-AZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value ?? 0);

const OrderList = () => {
  // Full (unpaged) list is kept only to power the aggregate stat cards below,
  // since /api/orders/page only returns one page of results at a time.
  const { data: orders = [] } = useOrders();
  const { data: warehouses = [] } = useWarehouses();
  const { data: customers = [] } = useCustomers();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [page, setPage] = useState(1); // 1-indexed for the UI/Pagination component
  const [formOpen, setFormOpen] = useState(false);
  const [viewingId, setViewingId] = useState(null);

  // Matches the /api/orders/page query params exactly: page, size, status, warehouseId, customerId, sortBy, sortDir
  const queryParams = useMemo(
    () => ({
      page: page - 1, // backend "page" param is 0-indexed (Default value: 0)
      size: PAGE_SIZE,
      ...(status ? { status } : {}),
      ...(warehouseId ? { warehouseId } : {}),
      ...(customerId ? { customerId } : {}),
      sortBy: "id",
      sortDir: "asc",
    }),
    [page, status, warehouseId, customerId],
  );

  const { data: orderPage, isLoading } = useOrdersPage(queryParams);

  const totalItems = orderPage?.totalElements ?? 0;
  const totalPages = Math.max(1, orderPage?.totalPages ?? 1);

  // Backend has no free-text search param, so this only filters the
  // rows already loaded for the current page.
  const pageItems = useMemo(() => {
    const content = orderPage?.content ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return content;
    return content.filter(
      (o) =>
        o.companyName?.toLowerCase().includes(q) ||
        o.warehouseName?.toLowerCase().includes(q) ||
        String(o.id).includes(q),
    );
  }, [search, orderPage]);

  const stats = useMemo(() => {
    const warehouseCount = new Set(orders.map((o) => o.warehouseId)).size;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalCost ?? 0), 0);
    const pendingCount = orders.filter((o) => o.status === "PENDING").length;

    return [
      {
        label: "Sifarişlər",
        value: orders.length,
        icon: ShoppingCart,
        tone: "bg-brand-50 text-brand-700",
      },
      {
        label: "Anbarlar",
        value: warehouseCount,
        icon: WarehouseIcon,
        tone: "bg-good-100 text-good-700",
      },
      {
        label: "Ümumi gəlir",
        value: `${formatMoney(totalRevenue)} ₼`,
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
  }, [orders]); // Sifarişlər üzrə statistika hesablanır

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
      key: "companyName",
      header: "Müştəri",
      render: (row) => row.companyName || "—",
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
        <Badge tone={ORDER_STATUS_TONES[row.status] || "neutral"}>
          {ORDER_STATUS_LABELS[row.status] || row.status}
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
        title="Satış"
        subtitle="Müştərilərə mal satışı üçün sifarişlərin idarə edilməsi."
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
          placeholder="Cari səhifədə axtar (Müştəri, anbar və ya sifariş nömrəsi)..."
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
          {ORDER_STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s] || s}
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
        <Select
          value={customerId}
          onChange={(e) => {
            setCustomerId(e.target.value);
            setPage(1);
          }}
          className="w-auto min-w-[180px]"
        >
          <option value="">Bütün müştərilər</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.companyName}
            </option>
          ))}
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-100 bg-white dark:border-white/10 dark:bg-ink-900">
        <DataTable
          columns={columns}
          data={pageItems}
          rowKey={(row) => row.id}
          emptyText="Hələ satış sifarişi əlavə olunmayıb"
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

      <OrderFormModal open={formOpen} onClose={() => setFormOpen(false)} />

      <OrderDetailModal
        open={!!viewingId}
        onClose={() => setViewingId(null)}
        orderId={viewingId}
      />
    </div>
  );
};

export default OrderList;