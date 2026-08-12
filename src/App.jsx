import { Route, Routes, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";

import ProductList from "./pages/products/ProductList";

import ProtectedRoute from "./routes/ProtectedRoute";
import WarehouseList from "./pages/warehouses/WarehouseList";
import WarehouseForm from "./pages/warehouses/WarehouseForm";

import StockList from "./pages/stocks/StockList";
import PurchaseList from "./pages/purchases/PurchaseList";
import TransferList from "./pages/transfers/TransferList";
import CustomerList from "./pages/customers/CustomerList";
import OrderList from "./pages/orders/OrderList";
import Reports from "./pages/reports/Reports";
import ChangePassword from "./pages/settings/ChangePassword";

function App() {
  return (
    <Routes>
      <Route index element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/products" element={<ProductList />} />

          <Route path="/warehouses" element={<WarehouseList />} />
          <Route path="/warehouses/new" element={<WarehouseForm />} />
          <Route path="/warehouses/:id/edit" element={<WarehouseForm />} />

          <Route path="/stock" element={<StockList />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/purchases" element={<PurchaseList />} />
          <Route path="/transfers" element={<TransferList />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/reports" element={<Reports />} />

          <Route path="/settings/password" element={<ChangePassword />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;