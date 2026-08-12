import { useState } from "react";
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
import { Download } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import { salesReportPeriods, stockMovements } from "../../data/mockData.js";

const Reports = () => {
  const [tab, setTab] = useState("overview");

  const columns = [
    {
      key: "date",
      header: "Tarix",
      render: (row) => new Date(row.date).toLocaleDateString("az-AZ"),
    },
    { key: "productName", header: "Məhsul" },
    { key: "warehouseName", header: "Anbar" },
    { key: "type", header: "Növ" },
    { key: "quantity", header: "Miqdar" },
  ];

  return (
    <div>
      <PageHeader
        title="Hesabatlar"
        subtitle="Satış, satınalma və stok hərəkətləri üzrə hesabatlar."
        action={
          <Button variant="secondary">
            <Download className="h-4 w-4" />
            Excel-ə çıxar
          </Button>
        }
      />

      <div className="mb-4 flex w-fit gap-1 rounded-lg border border-ink-100 bg-white p-1 dark:border-white/10 dark:bg-ink-900">
        <button
          onClick={() => setTab("overview")}
          className={`rounded-md px-4 py-1.5 text-sm font-medium ${tab === "overview" ? "bg-brand-700 text-white dark:bg-brand-600" : "text-ink-500 dark:text-ink-400"}`}
        >
          Ümumi baxış
        </button>
        <button
          onClick={() => setTab("movements")}
          className={`rounded-md px-4 py-1.5 text-sm font-medium ${tab === "movements" ? "bg-brand-700 text-white dark:bg-brand-600" : "text-ink-500 dark:text-ink-400"}`}
        >
          Stok hərəkətləri
        </button>
      </div>

      {tab === "overview" ? (
        <div className="rounded-xl border border-ink-100 bg-white p-6 dark:border-white/10 dark:bg-ink-900">
          <h2 className="mb-1 font-display text-base font-semibold text-ink-900 dark:text-ink-100">
            Satış vs Satınalma
          </h2>
          <p className="mb-4 text-sm text-ink-500 dark:text-ink-400">
            Seçilmiş dövr üzrə.
          </p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={salesReportPeriods}>
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
      ) : (
        <div className="overflow-hidden rounded-xl border border-ink-100 bg-white dark:border-white/10 dark:bg-ink-900">
          <DataTable
            columns={columns}
            data={stockMovements}
            rowKey={(row) => row.id}
            emptyText="Stok hərəkəti tapılmadı"
          />
        </div>
      )}
    </div>
  );
};

export default Reports;