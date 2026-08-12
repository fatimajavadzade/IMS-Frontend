export const dashboardTrend = [
  { month: "Yan", sales: 32000, purchases: 21000 },
  { month: "Fev", sales: 28000, purchases: 19500 },
  { month: "Mar", sales: 41000, purchases: 26000 },
  { month: "Apr", sales: 37500, purchases: 24000 },
  { month: "May", sales: 46000, purchases: 29000 },
  { month: "İyun", sales: 52000, purchases: 31000 },
];

export const stockMovements = [
  {
    id: "m1",
    date: "2026-07-16T08:00:00Z",
    productName: "Türk Qəhvəsi 500g",
    warehouseName: "Bakı Mərkəzi Anbar",
    type: "Satış",
    quantity: -4,
  },
  {
    id: "m2",
    date: "2026-07-15T09:30:00Z",
    productName: "Samsung Galaxy S24 Ultra",
    warehouseName: "Bakı Mərkəzi Anbar",
    type: "Düzəliş",
    quantity: -2,
  },
  {
    id: "m3",
    date: "2026-07-14T10:30:00Z",
    productName: "Kişi Pambıq Köynək",
    warehouseName: "Bakı Mərkəzi Anbar",
    type: "Transfer",
    quantity: -40,
  },
  {
    id: "m4",
    date: "2026-07-13T11:20:00Z",
    productName: "iPhone 15 Pro Max",
    warehouseName: "Sumqayıt Logistika Mərkəzi",
    type: "Transfer",
    quantity: 6,
  },
  {
    id: "m5",
    date: "2026-07-11T13:00:00Z",
    productName: "Türk Qəhvəsi 500g",
    warehouseName: "Naxçıvan Filialı",
    type: "Transfer",
    quantity: 50,
  },
  {
    id: "m6",
    date: "2026-07-07T12:00:00Z",
    productName: "Bosch Paltaryuyan Maşın",
    warehouseName: "Bakı Mərkəzi Anbar",
    type: "Satınalma",
    quantity: 10,
  },
];

export const salesReportPeriods = dashboardTrend.map((d) => ({
  period: d.month,
  sales: d.sales,
  purchases: d.purchases,
}));