import { Link, useNavigate } from "react-router-dom";
import { Boxes, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Input from "../../components/ui/Input.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Button from "../../components/ui/Button.jsx";

import { useLogin } from "../../hooks/auth/useLogin.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { DASHBOARD_ALLOWED_ROLES } from "../../constants/roles.js";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    loginMutation.mutate(data, {
      onSuccess: (res) => {
        const user = res.data; //backend response

        if (!DASHBOARD_ALLOWED_ROLES.includes(user.role)) {
          toast.error("Bu hesabın IMS panelinə giriş icazəsi yoxdur.");
          return;
        }

        login(user);

        toast.success("Uğurla daxil oldunuz.");

        navigate("/dashboard");
      },

      onError: (error) => {
        toast.error(
          error?.response?.data?.message || "E-poçt və ya şifrə yanlışdır.",
        );
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-4 dark:bg-ink-950">
      <div className="w-full max-w-md rounded-xl2 bg-white p-8 shadow-xl dark:bg-ink-900 dark:ring-1 dark:ring-white/10">
        <div className="mb-8 flex items-center gap-2 text-brand-700 dark:text-brand-400">
          <Boxes className="h-7 w-7" />
          <span className="font-display text-xl font-semibold">IMS</span>
        </div>

        <h1 className="mb-1 text-2xl font-semibold text-ink-900 dark:text-ink-100">
          Hesaba giriş
        </h1>

        <p className="mb-6 text-sm text-ink-500 dark:text-ink-400">
          Davam etmək üçün məlumatlarınızı daxil edin.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField label="E-poçt" required error={errors.email?.message}>
            <div className="flex items-center gap-2 rounded-lg border border-ink-100 bg-ink-100/40 px-3 focus-within:border-brand-500 dark:border-white/10 dark:bg-white/5">
              <Mail className="h-4 w-4 text-ink-300 dark:text-ink-500" />

              <Input
                type="email"
                placeholder="ad@sirket.com"
                className="border-0 bg-transparent px-0"
                {...register("email", {
                  required: "E-poçt daxil edin.",
                })}
              />
            </div>
          </FormField>

          <FormField label="Şifrə" required error={errors.password?.message}>
            <div className="flex items-center gap-2 rounded-lg border border-ink-100 bg-ink-100/40 px-3 focus-within:border-brand-500 dark:border-white/10 dark:bg-white/5">
              <Lock className="h-4 w-4 text-ink-300 dark:text-ink-500" />

              <Input
                type="password"
                placeholder="••••••••"
                className="border-0 bg-transparent px-0"
                {...register("password", {
                  required: "Şifrə daxil edin.",
                })}
              />
            </div>
          </FormField>

          <Button
            type="submit"
            className="mt-2 w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Daxil olunur..." : "Daxil ol"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">
          Hesabınız yoxdur?{" "}
          <Link
            to="/register"
            className="font-medium text-brand-700 hover:underline dark:text-brand-400"
          >
            Qeydiyyatdan keçin
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;