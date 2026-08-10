import { useMemo } from "react";
import {
  Boxes,
  Warehouse as WarehouseIcon,
  Users,
  AlertTriangle,
  Wallet,
  TrendingUp,
  TrendingDown,
  PackageX,
  ShoppingCart,
  Truck,
} from "lucide-react";

import PageHeader from "../components/ui/PageHeader.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import Badge from "../components/ui/Badge.jsx";
import DataTable from "../components/ui/DataTable.jsx";
import Spinner from "../components/ui/Spinner.jsx";

import { useDashboard } from "../hooks/dashboard/useDashboard";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONES,
} from "../constants/orderStatus.js";
import {
  PURCHASE_STATUS_LABELS,
  PURCHASE_STATUS_TONES,
} from "../constants/purchaseStatus.js";

const formatMoney = (value) =>
  new Intl.NumberFormat("az-AZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value ?? 0);

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("az-AZ") : "—";

function Dashboard() {
  const { data, isLoading } = useDashboard();

  const stats = useMemo(() => {
    const d = data ?? {};

    return [
      {
        label: "Ümumi məhsul",
        value: d.totalProducts ?? 0,
        icon: Boxes,
        tone: "bg-brand-50 text-brand-700",
      },
      {
        label: "Aktiv anbarlar",
        value: d.activeWarehouses ?? 0,
        icon: WarehouseIcon,
        tone: "bg-good-100 text-good-700",
      },
      {
        label: "Müştərilər",
        value: d.totalCustomers ?? 0,
        icon: Users,
        tone: "bg-brand-50 text-brand-700",
      },
      {
        label: "Stoku bitənlər",
        value: d.outOfStockCount ?? 0,
        icon: PackageX,
        tone: "bg-bad-100 text-bad-700",
      },
      {
        label: "Anbar dəyəri",
        value: `${formatMoney(d.totalInventoryValue)} ₼`,
        icon: Wallet,
        tone: "bg-brand-50 text-brand-700",
      },
      {
        label: "Satış gəliri",
        value: `${formatMoney(d.totalSalesRevenue)} ₼`,
        icon: TrendingUp,
        tone: "bg-good-100 text-good-700",
      },
      {
        label: "Satınalma xərci",
        value: `${formatMoney(d.totalPurchaseExpense)} ₼`,
        icon: TrendingDown,
        tone: "bg-warn-100 text-warn-700",
      },
    ];
  }, [data]);

  const lowStockItems = data?.lowStockItems ?? [];
  const recentOrders = data?.recentOrders ?? [];
  const recentPurchases = data?.recentPurchases ?? [];

  const lowStockColumns = [
    {
      key: "productName",
      header: "Məhsul",
      render: (row) => (
        <div>
          <p className="font-medium text-ink-900 dark:text-ink-100">
            {row.productName}
          </p>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            {row.sku || "—"}
          </p>
        </div>
      ),
    },
    {
      key: "brandName",
      header: "Brend / Kateqoriya",
      render: (row) => (
        <span>
          {row.brandName || "—"}
          {row.categoryName ? ` · ${row.categoryName}` : ""}
        </span>
      ),
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
      key: "currentQuantity",
      header: "Qalıq",
      render: (row) => (
        <Badge tone={row.currentQuantity === 0 ? "bad" : "warn"}>
          {row.currentQuantity} ədəd
        </Badge>
      ),
    },
    {
      key: "price",
      header: "Qiymət",
      render: (row) => `${formatMoney(row.price)} ₼`,
    },
  ];

  const recentOrdersColumns = [
    {
      key: "orderId",
      header: "№",
      render: (row) => (
        <span className="font-medium text-ink-900 dark:text-ink-100">
          #{row.orderId}
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
      render: (row) => row.warehouseName || "—",
    },
    {
      key: "totalPrice",
      header: "Məbləğ",
      render: (row) => `${formatMoney(row.totalPrice)} ₼`,
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
      render: (row) => formatDate(row.createdAt),
    },
  ];

  const recentPurchasesColumns = [
    {
      key: "purchaseId",
      header: "№",
      render: (row) => (
        <span className="font-medium text-ink-900 dark:text-ink-100">
          #{row.purchaseId}
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
      render: (row) => row.warehouseName || "—",
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
      render: (row) => formatDate(row.createdAt),
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
        title="Panel"
        subtitle="Anbar sisteminin ümumi göstəriciləri və son fəaliyyət."
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.slice(0, 4).map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.slice(4).map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="mb-6 overflow-hidden rounded-xl border border-ink-100 bg-white dark:border-white/10 dark:bg-ink-900">
        <div className="flex items-center gap-2 border-b border-ink-100 px-5 py-4 dark:border-white/10">
          <AlertTriangle className="h-4 w-4 text-warn-600 dark:text-warn-400" />
          <h2 className="font-display text-base font-semibold text-ink-900 dark:text-ink-100">
            Az qalan məhsullar
          </h2>
        </div>
        <DataTable
          columns={lowStockColumns}
          data={lowStockItems}
          rowKey={(row) => `${row.productId}-${row.warehouseName}`}
          emptyText="Az qalan məhsul yoxdur"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-ink-100 bg-white dark:border-white/10 dark:bg-ink-900">
          <div className="flex items-center gap-2 border-b border-ink-100 px-5 py-4 dark:border-white/10">
            <ShoppingCart className="h-4 w-4 text-brand-700 dark:text-brand-400" />
            <h2 className="font-display text-base font-semibold text-ink-900 dark:text-ink-100">
              Son satışlar
            </h2>
          </div>
          <DataTable
            columns={recentOrdersColumns}
            data={recentOrders}
            rowKey={(row) => row.orderId}
            emptyText="Hələ satış sifarişi yoxdur"
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-ink-100 bg-white dark:border-white/10 dark:bg-ink-900">
          <div className="flex items-center gap-2 border-b border-ink-100 px-5 py-4 dark:border-white/10">
            <Truck className="h-4 w-4 text-brand-700 dark:text-brand-400" />
            <h2 className="font-display text-base font-semibold text-ink-900 dark:text-ink-100">
              Son satınalmalar
            </h2>
          </div>
          <DataTable
            columns={recentPurchasesColumns}
            data={recentPurchases}
            rowKey={(row) => row.purchaseId}
            emptyText="Hələ satınalma sifarişi yoxdur"
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;