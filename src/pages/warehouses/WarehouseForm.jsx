import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  ChevronRight,
  Info,
  MapPin,
  Shield,
  Thermometer,
  Truck,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import AddressMapPicker from "../../components/maps/AddressMapPicker.jsx";

import { useWarehouse } from "../../hooks/warehouses/useWarehouse";
import { useCreateWarehouse } from "../../hooks/warehouses/useCreateWarehouse";
import { useUpdateWarehouse } from "../../hooks/warehouses/useUpdateWarehouse";

import { useManagers } from "../../hooks/users/useManagers";

const featureCards = [
  { icon: Shield, label: "Təhlükəsizlik", value: "24/7 Mühafizə" },
  { icon: Thermometer, label: "Temperatur", value: "İqlim Nəzarəti" },
  { icon: Truck, label: "Logistika", value: "4 Yükləmə Rampası" },
];

function WarehouseForm() {
  const { id } = useParams();
  const isEdit = !!id; // id gelibse true
  const navigate = useNavigate();

  const { data: warehouse, isLoading } = useWarehouse(id);
  const { data: managers = [] } = useManagers();

  const createWarehouseMutation = useCreateWarehouse();
  const updateWarehouseMutation = useUpdateWarehouse();

  const [location, setLocation] = useState({
    lat: null,
    lng: null,
  }); // location state-i map-dən gələn koordinatları saxlamaq üçün istifadə olunur

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      managerId: "",
      capacity: "",
    },
  }); // defaultValues: formun default dəyərlərini təyin edir, reset() ilə yenidən doldurmaq üçün istifadə olunur

  useEffect(() => {
    if (warehouse) {
      reset({
        name: warehouse.name,
        managerId: warehouse.manager?.id?.toString() ?? "",
        capacity: warehouse.capacity,
      });

      setLocation({
        lat: warehouse.latitude,
        lng: warehouse.longitude,
      });
    }
  }, [warehouse, reset]); // edit-de data gələndə formu reset (yeni doldurulur) edir və location-u set edir

  const handleLocationChange = (loc) => {
    setLocation(loc);
  }; // location-u map-dən gələn dəyərlə yeniləyir

  const onSubmit = async (formData) => {
    if (!location.lat || !location.lng) {
      toast.error("Xəritədən məkan seçin");
      return;
    }
    const payload = {
      name: formData.name,
      latitude: location.lat,
      longitude: location.lng,
      managerId: Number(formData.managerId),
      capacity: Number(formData.capacity),
    };

    try {
      if (isEdit) {
        await updateWarehouseMutation.mutateAsync({ id, data: payload });
        toast.success("Anbar uğurla yeniləndi.");
      } else {
        await createWarehouseMutation.mutateAsync(payload);
        toast.success("Anbar uğurla yaradıldı.");
      }

      navigate("/warehouses");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Anbar yadda saxlanılmadı.",
      );
    }
  }; // form submit edildikdə çağırılır, payload-u backend-ə göndərir və success/error mesajını göstərir

  const isSaving = createWarehouseMutation.isPending || updateWarehouseMutation.isPending;

  if (isEdit && isLoading) {
    return <div className="py-10 text-center text-ink-500">Yüklənir...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-ink-500 dark:text-ink-400">
          <Link
            to="/dashboard"
            className="hover:text-ink-900 dark:hover:text-ink-100"
          >
            Panel
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            to="/warehouses"
            className="hover:text-ink-900 dark:hover:text-ink-100"
          >
            Anbarlar
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-ink-900 dark:text-ink-100">
            {isEdit ? "Anbarı Redaktə Et" : "Yeni Anbar"}
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate("/warehouses")}>
            Ləğv et
          </Button>
          <Button onClick={handleSubmit(onSubmit)} loading={isSaving}>
            Yadda saxla
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <h1 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-100">
          {isEdit ? "Anbarı Redaktə Et" : "Yeni Anbar Əlavə Et"}
        </h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">
          Yeni logistika mərkəzi və ya saxlama sahəsi haqqında məlumatları daxil
          edin.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      >
        <div className="rounded-xl border border-ink-100 bg-white p-6 dark:border-white/10 dark:bg-ink-900">
          <div className="mb-4 flex items-center gap-2 text-ink-900 dark:text-ink-100">
            <Info className="h-4 w-4 text-brand-700 dark:text-brand-400" />
            <h2 className="font-semibold">Əsas Məlumatlar</h2>
          </div>

          <FormField label="Anbar Adı" required error={errors.name?.message}>
            <Input
              placeholder="Məs: Bakı Logistika Mərkəzi"
              {...register("name", { required: "Anbar adı vacibdir" })}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Məsul Şəxsin email ünvanı"
              error={errors.managerId?.message}
            >
              <Select
                {...register("managerId", {
                  required: "Məsul şəxs seçilməlidir",
                })}
              >
                <option value="">Seçin</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.email}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Ümumi Tutum">
              <Input
                type="number"
                placeholder="0"
                {...register("capacity")}
              />
            </FormField>
          </div>
        </div>

        <div className="rounded-xl border border-ink-100 bg-white p-6 dark:border-white/10 dark:bg-ink-900">
          <div className="mb-4 flex items-center gap-2 text-ink-900 dark:text-ink-100">
            <MapPin className="h-4 w-4 text-brand-700 dark:text-brand-400" />
            <h2 className="font-semibold">Məkan və Ünvan</h2>
          </div>
          <div className="mb-4">
            <AddressMapPicker
              value={location}
              onChange={handleLocationChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-2">
          {featureCards.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-4 dark:border-white/10 dark:bg-ink-900"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-500 dark:text-ink-400">
                  {label}
                </p>
                <p className="text-sm font-medium text-ink-900 dark:text-ink-100">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}

export default WarehouseForm;