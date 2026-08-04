import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "../../components/ui/Modal.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Button from "../../components/ui/Button.jsx";

import { useWarehouses } from "../../hooks/warehouses/useWarehouses";
import { useProducts } from "../../hooks/products/useProducts";
import { useCreateStock } from "../../hooks/stocks/useCreateStock";
import { useUpdateStock } from "../../hooks/stocks/useUpdateStock";

const emptyValues = {
  warehouseId: "",
  productId: "",
  quantity: "",
};

const StockFormModal = ({ open, onClose, stock }) => {
  const isEdit = !!stock;

  const { data: warehouses = [] } = useWarehouses();
  const { data: products = [] } = useProducts();

  const createStockMutation = useCreateStock();
  const updateStockMutation = useUpdateStock();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: emptyValues });

  useEffect(() => {
    if (open) {
      reset(
        stock
          ? {
              warehouseId: stock.warehouse?.id?.toString() ?? "",
              productId: stock.product?.id?.toString() ?? "",
              quantity: stock.quantity ?? "",
            }
          : emptyValues,
      );
    }
  }, [open, stock, reset]); // Modal açıldıqda və ya stock dəyişdikdə formu sıfırla

  const onSubmit = async (formData) => {
    try {
      if (isEdit) {
        await updateStockMutation.mutateAsync({
          id: stock.id,
          data: { quantity: Number(formData.quantity) },
        });
        toast.success("Stok uğurla yeniləndi.");
      } else {
        await createStockMutation.mutateAsync({
          warehouseId: Number(formData.warehouseId),
          productId: Number(formData.productId),
          quantity: Number(formData.quantity),
        });
        toast.success("Stok uğurla əlavə edildi.");
      }

      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Stok yadda saxlanılmadı.");
    }
  };

  const isSaving = createStockMutation.isPending || updateStockMutation.isPending;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Stoku redaktə et" : "Yeni stok əlavə et"}
      subtitle="Anbardakı məhsul miqdarının idarə edilməsi"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Ləğv et
          </Button>
          <Button onClick={handleSubmit(onSubmit)} loading={isSaving}>
            {isEdit ? "Yadda saxla" : "Əlavə et"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Anbar" required error={errors.warehouseId?.message}>
          <Select
            disabled={isEdit}
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

        <FormField label="Məhsul" required error={errors.productId?.message}>
          <Select
            disabled={isEdit}
            {...register("productId", { required: "Məhsul vacibdir" })}
          >
            <option value="">Seçin</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.sku ? `(${p.sku})` : ""}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Miqdar" required error={errors.quantity?.message}>
          <Input
            type="number"
            min="0"
            placeholder="0"
            {...register("quantity", {
              required: "Miqdar vacibdir",
              min: { value: 0, message: "Miqdar mənfi ola bilməz" },
            })}
          />
        </FormField>
      </form>
    </Modal>
  );
};

export default StockFormModal;