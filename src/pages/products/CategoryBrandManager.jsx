import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";

import Modal from "../../components/ui/Modal.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";

import { useCategories } from "../../hooks/categories/useCategories";
import { useCreateCategory } from "../../hooks/categories/useCreateCategory";
import { useDeleteCategory } from "../../hooks/categories/useDeleteCategory";

import { useBrands } from "../../hooks/brands/useBrands";
import { useCreateBrand } from "../../hooks/brands/useCreateBrand";
import { useDeleteBrand } from "../../hooks/brands/useDeleteBrand";

function TabList({
  items,
  isLoading,
  placeholder,
  isSubmitting,
  deletingId,
  onCreate,
  onDelete,
}) {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    await onCreate(trimmedName);
    setName("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={placeholder}
        />
        <Button type="submit" loading={isSubmitting}>
          <Plus className="h-4 w-4" />
          Əlavə et
        </Button>
      </form>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-500 dark:text-ink-400">
          Hələ heç nə əlavə olunmayıb
        </p>
      ) : (
        <ul className="divide-y divide-ink-100 rounded-lg border border-ink-100 dark:divide-white/10 dark:border-white/10">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between px-4 py-2.5 text-sm"
            >
              <span className="text-ink-900 dark:text-ink-100">
                {item.name}
              </span>
              <button
                onClick={() => onDelete(item.id)}
                disabled={deletingId === item.id}
                className="text-ink-300 hover:text-bad-700 disabled:opacity-40 dark:text-ink-500 dark:hover:text-bad-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CategoryBrandManager({ open, onClose }) {
  const [tab, setTab] = useState("categories");
  const [deletingId, setDeletingId] = useState(null);

  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const createCategoryMutation = useCreateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const { data: brands = [], isLoading: brandsLoading } = useBrands();
  const createBrandMutation = useCreateBrand();
  const deleteBrandMutation = useDeleteBrand();

  const handleCreateCategory = async (name) => {
    try {
      await createCategoryMutation.mutateAsync({ name });
      toast.success("Kateqoriya əlavə edildi.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Kateqoriya əlavə edilmədi.",
      );
    }
  };

  const handleDeleteCategory = async (id) => {
    setDeletingId(id);
    try {
      await deleteCategoryMutation.mutateAsync(id);
      toast.success("Kateqoriya silindi.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Kateqoriya silinmədi.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateBrand = async (name) => {
    try {
      await createBrandMutation.mutateAsync({ name });
      toast.success("Brend əlavə edildi.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Brend əlavə edilmədi.");
    }
  };

  const handleDeleteBrand = async (id) => {
    setDeletingId(id);
    try {
      await deleteBrandMutation.mutateAsync(id);
      toast.success("Brend silindi.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Brend silinmədi.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Kateqoriyalar və Brendlər"
      size="sm"
    >
      <div className="mb-4 flex gap-1 rounded-lg bg-ink-100/70 p-1 dark:bg-white/5">
        <button
          onClick={() => setTab("categories")}
          className={`flex-1 rounded-md py-1.5 text-sm font-medium ${tab === "categories" ? "bg-white text-brand-800 shadow-sm dark:bg-ink-800 dark:text-brand-300" : "text-ink-500 dark:text-ink-400"}`}
        >
          Kateqoriyalar
        </button>
        <button
          onClick={() => setTab("brands")}
          className={`flex-1 rounded-md py-1.5 text-sm font-medium ${tab === "brands" ? "bg-white text-brand-800 shadow-sm dark:bg-ink-800 dark:text-brand-300" : "text-ink-500 dark:text-ink-400"}`}
        >
          Brendlər
        </button>
      </div>

      {tab === "categories" ? (
        <TabList
          items={categories}
          isLoading={categoriesLoading}
          placeholder="Məs: Elektronika"
          isSubmitting={createCategoryMutation.isPending}
          deletingId={deletingId}
          onCreate={handleCreateCategory}
          onDelete={handleDeleteCategory}
        />
      ) : (
        <TabList
          items={brands}
          isLoading={brandsLoading}
          placeholder="Məs: Samsung"
          isSubmitting={createBrandMutation.isPending}
          deletingId={deletingId}
          onCreate={handleCreateBrand}
          onDelete={handleDeleteBrand}
        />
      )}
    </Modal>
  );
}

export default CategoryBrandManager;