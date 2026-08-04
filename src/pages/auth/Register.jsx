import { Link, useNavigate } from "react-router-dom";
import { Boxes, Lock, Mail, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Input from "../../components/ui/Input.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Button from "../../components/ui/Button.jsx";

import { useRegister } from "../../hooks/auth/useRegister.js";

function Register() {
  const navigate = useNavigate();

  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Qeydiyyat uğurla tamamlandı.");

        navigate("/login", { replace: true });
      },

      onError: (error) => {
        toast.error(
          error?.response?.data?.message || "Qeydiyyat zamanı xəta baş verdi.",
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
          Qeydiyyat
        </h1>

        <p className="mb-6 text-sm text-ink-500 dark:text-ink-400">
          Yeni hesab yaradın.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            label="Telefon nömrəsi"
            required
            error={errors.phoneNumber?.message}
          >
            <div className="flex items-center gap-2 rounded-lg border border-ink-100 bg-ink-100/40 px-3 focus-within:border-brand-500 dark:border-white/10 dark:bg-white/5">
              <Phone className="h-4 w-4 text-ink-300 dark:text-ink-500" />

              <Input
                type="text"
                placeholder="+994 50 123 45 67"
                className="border-0 bg-transparent px-0"
                {...register("phoneNumber", {
                  required: "Telefon nömrəsini daxil edin.",
                })}
              />
            </div>
          </FormField>

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
                  required: "Şifrəni daxil edin.",
                  minLength: {
                    value: 6,
                    message: "Şifrə minimum 6 simvol olmalıdır.",
                  },
                })}
              />
            </div>
          </FormField>

          <Button
            type="submit"
            className="mt-2 w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending
              ? "Qeydiyyat edilir..."
              : "Qeydiyyatdan keç"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">
          Artıq hesabınız var?{" "}
          <Link
            to="/login"
            className="font-medium text-brand-700 hover:underline dark:text-brand-400"
          >
            Daxil olun
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;