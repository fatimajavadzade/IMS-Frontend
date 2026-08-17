import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download, TrendingUp, TrendingDown } from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../../components/ui/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import Select from "../../components/ui/Select.jsx";
import Input from "../../components/ui/Input.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import Spinner from "../../components/ui/Spinner.jsx";

import { useWarehouses } from "../../hooks/warehouses/useWarehouses";
import { useReportOverview } from "../../hooks/reports/useReportOverview";
import { useExportReport } from "../../hooks/reports/useExportReport";

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

const formatMoney = (value) =>
  new Intl.NumberFormat("az-AZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value ?? 0);

const toStartOfDay = (value) => (value ? `${value}T00:00:00` : undefined);
const toEndOfDay = (value) => (value ? `${value}T23:59:59` : undefined);

const Reports = () => {
  const [tab] = useState("overview");
  const [year, setYear] = useState(String(CURRENT_YEAR));
  const [warehouseId, setWarehouseId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: warehouses = [] } = useWarehouses();

  const overviewParams = useMemo(
    () => ({
      year: year ? Number(year) : undefined,
      warehouseId: warehouseId ? Number(warehouseId) : undefined,
      startDate: toStartOfDay(startDate),
      endDate: toEndOfDay(endDate),
    }),
    [year, warehouseId, startDate, endDate],
  );

  const { data: overview, isLoading: isOverviewLoading } =
    useReportOverview(overviewParams);

  const exportReportMutation = useExportReport();

  const chartData = useMemo(
    () =>
      (overview?.monthlyData ?? []).map((m) => ({
        period: m.monthName,
        sales: m.salesTotal,
        purchases: m.purchaseTotal,
      })),
    [overview],
  );

  const handleExport = async () => {
    try {
      const blob = await exportReportMutation.mutateAsync({
        tab,
        year: year ? Number(year) : undefined,
        warehouseId: warehouseId ? Number(warehouseId) : undefined,
        startDate: toStartOfDay(startDate),
        endDate: toEndOfDay(endDate),
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `hesabat-${tab}-${year}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Hesabat çıxarılarkən xəta baş verdi.",
      );
    }
  };

  return (
    <div>
      <PageHeader
        title="Hesabatlar"
        subtitle="Satış, satınalma və stok hərəkətləri üzrə hesabatlar."
        action={
          <Button
            variant="secondary"
            onClick={handleExport}
            loading={exportReportMutation.isPending}
          >
            <Download className="h-4 w-4" />
            Excel-ə çıxar
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-ink-100 bg-white p-3 dark:border-white/10 dark:bg-ink-900">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-500 dark:text-ink-400">
            İl
          </label>
          <Select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-28"
          >
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-500 dark:text-ink-400">
            Anbar
          </label>
          <Select
            value={warehouseId}
            onChange={(e) => setWarehouseId(e.target.value)}
            className="w-48"
          >
            <option value="">Bütün anbarlar</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-500 dark:text-ink-400">
            Başlanğıc tarix
          </label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-40"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-500 dark:text-ink-400">
            Son tarix
          </label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-40"
          />
        </div>
      </div>

      {isOverviewLoading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard
              label="Ümumi satış"
              value={`${formatMoney(overview?.totalSales)} ₼`}
              icon={TrendingUp}
              tone="bg-good-100 text-good-700"
            />
            <StatCard
              label="Ümumi satınalma"
              value={`${formatMoney(overview?.totalPurchases)} ₼`}
              icon={TrendingDown}
              tone="bg-warn-100 text-warn-700"
            />
          </div>

          <div className="rounded-xl border border-ink-100 bg-white p-6 dark:border-white/10 dark:bg-ink-900">
            <h2 className="mb-1 font-display text-base font-semibold text-ink-900 dark:text-ink-100">
              Satış vs Satınalma
            </h2>
            <p className="mb-4 text-sm text-ink-500 dark:text-ink-400">
              {overview?.warehouseName
                ? `${overview.warehouseName} anbarı üzrə, seçilmiş dövr.`
                : "Seçilmiş dövr üzrə."}
            </p>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef0f6" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 12, fill: "#5b6785" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#5b6785" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #eef0f6",
                    fontSize: 13,
                  }}
                />
                <Legend />
                <Bar
                  dataKey="sales"
                  name="Satış (₼)"
                  fill="#263a7e"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="purchases"
                  name="Satınalma (₼)"
                  fill="#8a9bd6"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;