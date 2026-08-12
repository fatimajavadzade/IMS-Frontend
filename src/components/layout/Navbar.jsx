import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useLogout } from "../../hooks/auth/useLogout.js";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, refreshToken, logout } = useAuth();
  const logoutMutation = useLogout();

  const navigate = useNavigate();

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
    <header className="flex h-16 shrink-0 items-center justify-end gap-4 border-b border-ink-100 bg-white px-6 dark:border-white/10 dark:bg-ink-900">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg p-2 text-ink-500 transition hover:bg-ink-100/60 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-white/5 dark:hover:text-ink-100"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        <div className="flex items-center gap-2 border-l border-ink-100 pl-4 dark:border-white/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800 dark:bg-brand-500/20 dark:text-brand-300">
            {user?.email?.charAt(0).toUpperCase() ?? "U"}
          </div>

          <div className="leading-tight">
            <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">
              {user?.email}
            </p>
            <p className="text-xs text-ink-500 dark:text-ink-400">
              {user?.role?.replace("ROLE_", "").replace("_", "").toUpperCase()}
            </p>
          </div>

          <button
            onClick={handleLogout}
            type="button"
            disabled={logoutMutation.isPending}
            aria-label="Çıxış"
            title="Çıxış"
            className="ml-1 rounded-lg p-2 text-ink-500 transition hover:bg-ink-100/60 hover:text-bad-700 disabled:cursor-not-allowed disabled:opacity-60 dark:text-ink-400 dark:hover:bg-white/5 dark:hover:text-bad-400"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;