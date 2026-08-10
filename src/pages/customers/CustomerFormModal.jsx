import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "../../components/ui/Modal.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Input from "../../components/ui/Input.jsx";
import Textarea from "../../components/ui/Textarea.jsx";
import Button from "../../components/ui/Button.jsx";

import { useCreateCustomer } from "../../hooks/customers/useCreateCustomer";
import { useUpdateCustomer } from "../../hooks/customers/useUpdateCustomer";

const emptyValues = {
  companyName: "",
  voen: "",
  contactPerson: "",
  phone: "",
  email: "",
  address: "",
};

const CustomerFormModal = ({ open, onClose, customer }) => {
  const isEdit = !!customer;

  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: emptyValues });

  useEffect(() => {
    if (open) {
      reset(
        customer
          ? {
              companyName: customer.companyName ?? "",
              voen: customer.voen ?? "",
              contactPerson: customer.contactPerson ?? "",
              phone: customer.phone ?? "",
              email: customer.email ?? "",
              address: customer.address ?? "",
            }
          : emptyValues,
      );
    }
  }, [open, customer, reset]); // Reset form values when modal opens or customer changes

  const onSubmit = async (formData) => {
    const payload = {
      companyName: formData.companyName,
      voen: formData.voen,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
    };

    try {
      if (isEdit) {
        await updateCustomerMutation.mutateAsync({
          id: customer.id,
          data: payload,
        });
        toast.success("Müştəri uğurla yeniləndi.");
      } else {
        await createCustomerMutation.mutateAsync(payload);
        toast.success("Müştəri uğurla əlavə edildi.");
      }

      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Müştəri yadda saxlanılmadı.",
      );
    }
  };

  const isSaving =
    createCustomerMutation.isPending || updateCustomerMutation.isPending;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Müştərini redaktə et" : "Yeni müştəri əlavə et"}
      subtitle="Müştəri ilə bağlı əlaqə və şirkət məlumatları"
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
        <FormField
          label="Şirkət adı"
          required
          error={errors.companyName?.message}
        >
          <Input
            placeholder="Məs: Baku Trade MMC"
            {...register("companyName", {
              required: "Şirkət adı vacibdir",
            })}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="VÖEN" error={errors.voen?.message}>
            <Input placeholder="1234567890" {...register("voen")} />
          </FormField>

          <FormField
            label="Əlaqədar şəxs"
            required
            error={errors.contactPerson?.message}
          >
            <Input
              placeholder="Məs: Elvin Məmmədov"
              {...register("contactPerson", {
                required: "Əlaqədar şəxs vacibdir",
              })}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Telefon" required error={errors.phone?.message}>
            <Input
              placeholder="+994 XX XXX XX XX"
              {...register("phone", { required: "Telefon vacibdir" })}
            />
          </FormField>

          <FormField label="E-poçt" required error={errors.email?.message}>
            <Input
              type="email"
              placeholder="info@sirket.az"
              {...register("email", {
                required: "E-poçt vacibdir",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Düzgün e-poçt daxil edin",
                },
              })}
            />
          </FormField>
        </div>

        <FormField label="Ünvan" error={errors.address?.message}>
          <Textarea
            rows={3}
            placeholder="Şirkətin ünvanı"
            {...register("address")}
          />
        </FormField>
      </form>
    </Modal>
  );
};

export default CustomerFormModal;