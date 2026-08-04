import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "../../components/ui/Modal.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Button from "../../components/ui/Button.jsx";

import { useBrands } from "../../hooks/brands/useBrands";
import { useCategories } from "../../hooks/categories/useCategories";
import { useCreateProduct } from "../../hooks/products/useCreateProduct";
import { useUpdateProduct } from "../../hooks/products/useUpdateProduct";

const emptyValues = {
  name: "",
  sku: "",
  categoryId: "",
  brandId: "",
  price: "",
};

const ProductFormModal = ({ open, onClose, product }) => {
  const isEdit = !!product;

  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: emptyValues });

  useEffect(() => {
    if (open) {
      reset(
        product
          ? {
              name: product.name ?? "",
              sku: product.sku ?? "",
              categoryId: product.category?.id?.toString() ?? "",
              brandId: product.brand?.id?.toString() ?? "",
              price: product.price ?? "",
            }
          : emptyValues,
      );
    }
  }, [open, product, reset]); // Reset form values when modal opens or product changes

  const onSubmit = async (formData) => {
    const payload = {
      name: formData.name,
      sku: formData.sku,
      price: Number(formData.price),
      brandId: Number(formData.brandId),
      categoryId: Number(formData.categoryId),
      image: formData.image?.[0],
    };

    try {
      if (isEdit) {
        await updateProductMutation.mutateAsync({
          id: product.id,
          data: payload,
        });
        toast.success("Məhsul uğurla yeniləndi.");
      } else {
        await createProductMutation.mutateAsync(payload);
        toast.success("Məhsul uğurla əlavə edildi.");
      }

      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Məhsul yadda saxlanılmadı.",
      );
    }
  };

  const isSaving = createProductMutation.isPending || updateProductMutation.isPending;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Məhsulu redaktə et" : "Yeni məhsul əlavə et"}
      subtitle="Anbar kataloquna əlavə olunacaq məhsul məlumatları"
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
        <FormField label="Məhsul adı" required error={errors.name?.message}>
          <Input
            placeholder="Məs: iPhone 15 Pro Max"
            {...register("name", { required: "Məhsul adı vacibdir" })}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="SKU" required error={errors.sku?.message}>
            <Input
              placeholder="SKU-74291"
              {...register("sku", { required: "SKU vacibdir" })}
            />
          </FormField>
          <FormField label="Qiymət (₼)" required error={errors.price?.message}>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("price", { required: "Qiymət vacibdir", min: 0 })}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Kateqoriya"
            required
            error={errors.categoryId?.message}
          >
            <Select
              {...register("categoryId", { required: "Kateqoriya vacibdir" })}
            >
              <option value="">Seçin</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Brend" required error={errors.brandId?.message}>
            <Select {...register("brandId", { required: "Brend vacibdir" })}>
              <option value="">Seçin</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <FormField
          label="Şəkil"
          hint={
            isEdit
              ? "Yeni şəkil seçməsəniz, mövcud şəkil saxlanılacaq"
              : "Məhsulun şəkli"
          }
        >
          {isEdit && product?.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="mb-2 h-16 w-16 rounded-lg object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm text-ink-500 dark:text-ink-400"
            {...register("image")}
          />
        </FormField>
      </form>
    </Modal>
  );
};

export default ProductFormModal;