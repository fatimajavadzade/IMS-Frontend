import { useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

import Modal from "../../components/ui/Modal.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Button from "../../components/ui/Button.jsx";

import { useWarehouses } from "../../hooks/warehouses/useWarehouses";
import { useProducts } from "../../hooks/products/useProducts";
import { useCreateTransfer } from "../../hooks/transfers/useCreateTransfer";

const emptyItem = { productId: "", quantity: 1 };

const emptyValues = {
  fromWarehouseId: "",
  toWarehouseId: "",
  items: [emptyItem],
};

const TransferFormModal = ({ open, onClose }) => {
  const { data: warehouses = [] } = useWarehouses();
  const { data: products = [] } = useProducts();

  const createTransferMutation = useCreateTransfer();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: emptyValues });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const fromWarehouseId = useWatch({ control, name: "fromWarehouseId" });

  useEffect(() => {
    if (open) {
      reset(emptyValues);
    }
  }, [open, reset]); // Modal açıldıqda formu sıfırla

  const onSubmit = async (formData) => {
    try {
      await createTransferMutation.mutateAsync({
        fromWarehouseId: Number(formData.fromWarehouseId),
        toWarehouseId: Number(formData.toWarehouseId),
        items: formData.items.map((item) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
        })),
      });

      toast.success("Hərəkət sifarişi uğurla yaradıldı.");
      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Hərəkət sifarişi yadda saxlanılmadı.",
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Yeni anbar hərəkəti"
      subtitle="Məhsulları bir anbardan digərinə köçürün"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Ləğv et
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            loading={createTransferMutation.isPending}
          >
            Hərəkəti yarat
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <FormField
            label="Haradan"
            required
            error={errors.fromWarehouseId?.message}
          >
            <Select
              {...register("fromWarehouseId", {
                required: "Mənbə anbar vacibdir",
              })}
            >
              <option value="">Seçin</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </Select>
          </FormField>

          <div className="hidden justify-center pt-3 sm:flex">
            <ArrowRight className="h-5 w-5 text-ink-300 dark:text-ink-500" />
          </div>

          <FormField
            label="Haraya"
            required
            error={errors.toWarehouseId?.message}
          >
            <Select
              {...register("toWarehouseId", {
                required: "Hədəf anbar vacibdir",
                validate: (value) =>
                  !fromWarehouseId ||
                  value !== fromWarehouseId ||
                  "Hədəf anbar mənbə anbardan fərqli olmalıdır",
              })}
            >
              <option value="">Seçin</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <div className="mb-2 mt-4 flex items-center justify-between">
          <p className="text-sm font-medium text-ink-700 dark:text-ink-300">
            Məhsullar
          </p>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => append(emptyItem)}
          >
            <Plus className="h-4 w-4" />
            Məhsul əlavə et
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 gap-3 rounded-lg border border-ink-100 p-3 sm:grid-cols-[2fr_1fr_auto] dark:border-white/10"
            >
              <FormField
                label="Məhsul"
                required
                error={errors.items?.[index]?.productId?.message}
              >
                <Select
                  {...register(`items.${index}.productId`, {
                    required: "Məhsul vacibdir",
                  })}
                >
                  <option value="">Seçin</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.sku ? `(${p.sku})` : ""}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Miqdar"
                required
                error={errors.items?.[index]?.quantity?.message}
              >
                <Input
                  type="number"
                  min="1"
                  placeholder="1"
                  {...register(`items.${index}.quantity`, {
                    required: "Miqdar vacibdir",
                    min: { value: 1, message: "Ən azı 1 olmalıdır" },
                  })}
                />
              </FormField>

              <div className="flex items-end justify-end pb-1 sm:pb-0">
                <button
                  type="button"
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                  className="rounded-lg p-2 text-ink-300 hover:bg-bad-100 hover:text-bad-700 disabled:cursor-not-allowed disabled:opacity-40 dark:text-ink-500 dark:hover:bg-bad-500/10 dark:hover:text-bad-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </form>
    </Modal>
  );
};

export default TransferFormModal;
