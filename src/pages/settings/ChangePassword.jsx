import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import PageHeader from "../../components/ui/PageHeader.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

import { useUpdatePassword } from "../../hooks/auth/useUpdatePassword.js";

function ChangePassword() {
  const updatePasswordMutation = useUpdatePassword();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit = ({ oldPassword, newPassword }) => {
    updatePasswordMutation.mutate(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          toast.success("Şifrəniz uğurla yeniləndi.");
          reset();
        },

        onError: (error) => {
          toast.error(
            error?.response?.data?.message ||
              "Şifrə yenilənərkən xəta baş verdi.",
          );
        },
      },
    );
  };

  return (
    <div>
      <PageHeader
        title="Şifrə dəyişimi"
        subtitle="Hesabınızın şifrəsini yeniləyin."
      />

      <div className="rounded-xl2 bg-white p-6 shadow-sm ring-1 ring-ink-100 dark:bg-ink-900 dark:ring-white/10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            label="Cari şifrə"
            required
            error={errors.oldPassword?.message}
          >
            <div className="flex items-center gap-2 rounded-lg border border-ink-100 bg-ink-100/40 px-3 focus-within:border-brand-500 dark:border-white/10 dark:bg-white/5">
              <Lock className="h-4 w-4 text-ink-300 dark:text-ink-500" />

              <Input
                type="password"
                placeholder="••••••••"
                className="border-0 bg-transparent px-0"
                {...register("oldPassword", {
                  required: "Cari şifrənizi daxil edin.",
                })}
              />
            </div>
          </FormField>

          <FormField
            label="Yeni şifrə"
            required
            error={errors.newPassword?.message}
          >
            <div className="flex items-center gap-2 rounded-lg border border-ink-100 bg-ink-100/40 px-3 focus-within:border-brand-500 dark:border-white/10 dark:bg-white/5">
              <Lock className="h-4 w-4 text-ink-300 dark:text-ink-500" />

              <Input
                type="password"
                placeholder="••••••••"
                className="border-0 bg-transparent px-0"
                {...register("newPassword", {
                  required: "Yeni şifrəni daxil edin.",
                  minLength: {
                    value: 6,
                    message: "Şifrə minimum 6 simvol olmalıdır.",
                  },
                })}
              />
            </div>
          </FormField>

          <FormField
            label="Yeni şifrə (təkrar)"
            required
            error={errors.confirmPassword?.message}
          >
            <div className="flex items-center gap-2 rounded-lg border border-ink-100 bg-ink-100/40 px-3 focus-within:border-brand-500 dark:border-white/10 dark:bg-white/5">
              <Lock className="h-4 w-4 text-ink-300 dark:text-ink-500" />

              <Input
                type="password"
                placeholder="••••••••"
                className="border-0 bg-transparent px-0"
                {...register("confirmPassword", {
                  required: "Yeni şifrənizi təkrar daxil edin.",
                  validate: (value) =>
                    value === newPassword || "Şifrələr uyğun gəlmir.",
                })}
              />
            </div>
          </FormField>

          <Button
            type="submit"
            className="mt-2 w-full"
            disabled={updatePasswordMutation.isPending}
          >
            {updatePasswordMutation.isPending
              ? "Yenilənir..."
              : "Şifrəni yenilə"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
