import { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Boxes,
  Users,
  ShoppingCart,
  Truck,
  Repeat,
  FileBarChart,
  Settings,
  LogOut,
  Plus,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

import { useLogout } from "../../hooks/auth/useLogout.js";

const links = [
  { to: "/dashboard", label: "Panel", icon: LayoutDashboard },
  { to: "/products", label: "Məhsullar", icon: Package },
  { to: "/warehouses", label: "Anbarlar", icon: Warehouse },
  { to: "/stock", label: "Stok", icon: Boxes },
  { to: "/customers", label: "Müştərilər", icon: Users },
  { to: "/orders", label: "Satış", icon: ShoppingCart },
  { to: "/purchases", label: "Satınalma", icon: Truck },
  { to: "/transfers", label: "Hərəkətlər", icon: Repeat },
  { to: "/reports", label: "Hesabatlar", icon: FileBarChart },
  { to: "/settings/password", label: "Şifrə dəyişimi", icon: Settings },
];

function Sidebar() {
  const { refreshToken, logout } = useAuth();
  const logoutMutation = useLogout();

  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("ims-sidebar-collapsed") === "true",
  );

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const isCollapsed = !prev;
      localStorage.setItem(
        "ims-sidebar-collapsed",
        isCollapsed ? "true" : "false",
      );
      return isCollapsed;
    });
  };

  const handleLogout = () => {
    logoutMutation.mutate(
      { refreshToken },
      {
        onSettled: () => {
          logout();

          toast.success("Hesabdan çıxış edildi.");

          navigate("/login", { replace: true });
        },
      },
    );
  };

  return (
    <aside
      className={`relative hidden h-screen shrink-0 flex-col border-r border-ink-100 bg-white transition-[width] duration-200 md:flex dark:border-white/10 dark:bg-ink-900 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <button
        onClick={toggleCollapsed}
        type="button"
        aria-label={collapsed ? "Sidebar-ı aç" : "Sidebar-ı yığ"}
        title={collapsed ? "Sidebar-ı aç" : "Sidebar-ı yığ"}
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-ink-100 bg-white text-ink-500 shadow-sm transition hover:text-ink-900 dark:border-white/10 dark:bg-ink-900 dark:text-ink-400 dark:hover:text-ink-100"
      >
        {collapsed ? (
          <ChevronsRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronsLeft className="h-3.5 w-3.5" />
        )}
      </button>

      <div
        className={`overflow-hidden border-b border-ink-100 px-5 py-5 dark:border-white/10 ${
          collapsed ? "px-3 text-center" : ""
        }`}
      >
        {collapsed ? (
          <p className="font-display text-lg font-bold text-brand-800 dark:text-brand-300">
            IMS
          </p>
        ) : (
          <>
            <p className="font-display text-lg font-bold text-brand-800 dark:text-brand-300">
              IMS Sistem
            </p>
            <p className="text-xs text-ink-500 dark:text-ink-400">
              Anbar İdarəetmə
            </p>
          </>
        )}
      </div>

      <div className="px-3 pt-4">
        <Link
          to="/products"
          title="Yeni Məhsul"
          className={`flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500 ${
            collapsed ? "px-0" : "px-4"
          }`}
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!collapsed && "Yeni Məhsul"}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg border-l-[3px] px-3 py-2 text-sm font-medium transition ${
                  collapsed ? "justify-center px-0" : ""
                } ${
                  isActive
                    ? "border-brand-700 bg-brand-50 text-brand-800 dark:border-brand-400 dark:bg-brand-500/10 dark:text-brand-300"
                    : "border-transparent text-ink-500 hover:bg-ink-100/70 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-white/5 dark:hover:text-ink-100"
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="mt-auto border-t border-ink-100 px-3 py-4 dark:border-white/10">
        <button
          onClick={handleLogout}
          type="button"
          disabled={logoutMutation.isPending}
          aria-label="Çıxış"
          title="Çıxış"
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-bad-700 hover:bg-bad-100/60 disabled:cursor-not-allowed disabled:opacity-60 dark:text-bad-400 dark:hover:bg-bad-500/10 ${
            collapsed ? "justify-center px-0" : ""
          }`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && "Çıxış"}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
