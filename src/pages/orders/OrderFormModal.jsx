import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import Modal from "../../components/ui/Modal.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Button from "../../components/ui/Button.jsx";

import { useWarehouses } from "../../hooks/warehouses/useWarehouses";
import { useProducts } from "../../hooks/products/useProducts";
import { useCustomers } from "../../hooks/customers/useCustomers";
import { useCreateOrder } from "../../hooks/orders/useCreateOrder";

const emptyItem = { sku: "", quantity: 1 };

const emptyValues = {
  warehouseId: "",
  customerId: "",
  items: [emptyItem],
};

const OrderFormModal = ({ open, onClose }) => {
  const { data: warehouses = [] } = useWarehouses();
  const { data: products = [] } = useProducts();
  const { data: customers = [] } = useCustomers();

  const createOrderMutation = useCreateOrder();

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

  useEffect(() => {
    if (open) {
      reset(emptyValues);
    }
  }, [open, reset]); // Modal açıldıqda formu sıfırla

  const onSubmit = async (formData) => {
    try {
      await createOrderMutation.mutateAsync({
        warehouseId: Number(formData.warehouseId),
        customerId: Number(formData.customerId),
        items: formData.items.map((item) => ({
          sku: item.sku,
          quantity: Number(item.quantity),
        })),
      });

      toast.success("Satış sifarişi uğurla yaradıldı.");
      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Satış sifarişi yadda saxlanılmadı.",
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Yeni satış sifarişi"
      subtitle="Müştəriyə anbardan mal satışı üçün sifariş yaradın"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Ləğv et
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            loading={createOrderMutation.isPending}
          >
            Sifarişi yarat
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Anbar" required error={errors.warehouseId?.message}>
            <Select
              {...register("warehouseId", { required: "Anbar vacibdir" })}
            >
              <option value="">Seçin</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Müştəri"
            required
            error={errors.customerId?.message}
          >
            <Select
              {...register("customerId", { required: "Müştəri vacibdir" })}
            >
              <option value="">Seçin</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <div className="mb-2 mt-2 flex items-center justify-between">
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
                label="Məhsul (SKU)"
                required
                error={errors.items?.[index]?.sku?.message}
              >
                <Select
                  {...register(`items.${index}.sku`, {
                    required: "Məhsul vacibdir",
                  })}
                >
                  <option value="">Seçin</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.sku}>
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

export default OrderFormModal;
