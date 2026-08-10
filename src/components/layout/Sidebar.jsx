import { NavLink, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

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
];

function Sidebar() {
  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    toast.success("Hesabdan çıxış edildi.");

    navigate("/login", { replace: true });
  }; //! logout funksiyası deyisecek

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-ink-100 bg-white md:flex dark:border-white/10 dark:bg-ink-900">
      <div className="border-b border-ink-100 px-5 py-5 dark:border-white/10">
        <p className="font-display text-lg font-bold text-brand-800 dark:text-brand-300">
          IMS Sistem
        </p>
        <p className="text-xs text-ink-500 dark:text-ink-400">
          Anbar İdarəetmə
        </p>
      </div>

      <div className="px-4 pt-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500">
          <Plus className="h-4 w-4" />
          Yeni Məhsul
        </button>
      </div>

      <nav className="flex-1 px-3 py-4">
        <div className="flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg border-l-[3px] px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-brand-700 bg-brand-50 text-brand-800 dark:border-brand-400 dark:bg-brand-500/10 dark:text-brand-300"
                    : "border-transparent text-ink-500 hover:bg-ink-100/70 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-white/5 dark:hover:text-ink-100"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="mt-auto border-t border-ink-100 px-3 py-4 dark:border-white/10">
        <button
          onClick={handleLogout}
          type="button"
          aria-label="Çıxış"
          title="Çıxış"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-bad-700 hover:bg-bad-100/60 dark:text-bad-400 dark:hover:bg-bad-500/10"
        >
          <LogOut className="h-4 w-4" />
          Çıxış
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;