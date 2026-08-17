import { Link } from "react-router-dom";
import { ArrowLeft, Home, SearchX } from "lucide-react";

import Button from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function NotFound() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-100 px-4 dark:bg-ink-950">
      <div className="w-full max-w-xl rounded-2xl border border-ink-200 bg-white p-8 text-center shadow-xl dark:border-white/10 dark:bg-ink-900">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bad-100 text-bad-700 dark:bg-bad-900/30 dark:text-bad-400">
            <SearchX className="h-8 w-8" />
          </div>
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-400">
          404 Error
        </p>

        <h1 className="font-display text-4xl font-bold text-ink-900 dark:text-ink-100">
          Səhifə tapılmadı
        </h1>

        <p className="mt-4 text-base text-ink-500 dark:text-ink-400">
          Axtardığınız səhifə mövcud deyil və ya ünvan dəyişdirilib.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri dön
          </Button>

          <Link to={isAuthenticated ? "/dashboard" : "/login"} className="w-full sm:w-auto">
            <Button type="button" className="w-full sm:w-auto">
              <Home className="h-4 w-4" />
              Ana səhifə
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
