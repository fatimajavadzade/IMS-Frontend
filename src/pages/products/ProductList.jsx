import { useMemo, useState } from "react";
import {
  Boxes,
  Tags,
  BadgePercent,
  TrendingUp,
  Plus,
  Filter,
  Pencil,
  Trash2,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../../components/ui/PageHeader.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import ConfirmDialog from "../../components/ui/ConfirmDialog.jsx";
import Spinner from "../../components/ui/Spinner.jsx";

import { useProducts } from "../../hooks/products/useProducts";
import { useDeleteProduct } from "../../hooks/products/useDeleteProduct";

import ProductFormModal from "./ProductFormModal.jsx";
import CategoryBrandManager from "./CategoryBrandManager.jsx";

const PAGE_SIZE = 8;

const ProductList = () => {
  const { data: products = [], isLoading } = useProducts();
  const deleteProductMutation = useDeleteProduct();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [managerOpen, setManagerOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q),
    );
  }, [search, products]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = useMemo(() => {
    const brandCount = new Set(products.map((p) => p.brand?.id)).size;
    const categoryCount = new Set(products.map((p) => p.category?.id)).size;
    const avgPrice = products.length
      ? (
          products.reduce((sum, p) => sum + (p.price ?? 0), 0) / products.length
        ).toFixed(2)
      : "0.00";

    return [
      {
        label: "Ümumi məhsul",
        value: products.length,
        icon: Boxes,
        tone: "bg-brand-50 text-brand-700",
      },
      {
        label: "Brendlər",
        value: brandCount,
        icon: Tags,
        tone: "bg-good-100 text-good-700",
      },
      {
        label: "Kateqoriyalar",
        value: categoryCount,
        icon: BadgePercent,
        tone: "bg-warn-100 text-warn-700",
      },
      {
        label: "Orta qiymət",
        value: `${avgPrice} ₼`,
        icon: TrendingUp,
        tone: "bg-brand-50 text-brand-700",
      },
    ];
  }, [products]);

  const openCreate = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async () => {
    try {
      await deleteProductMutation.mutateAsync(deletingId);
      toast.success("Məhsul uğurla silindi.");
      setDeletingId(null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Məhsul silinərkən xəta baş verdi.",
      );
    }
  };

  const columns = [
    {
      key: "name",
      header: "Məhsul",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.imageName ? (
            <img
              src={`http://localhost:8080/api/products/images/${row.imageName}`}
              alt={row.name}
              className="h-10 w-10 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="h-10 w-10 shrink-0 rounded-lg bg-ink-100 dark:bg-white/10" />
          )}
          <div>
            <p className="font-medium text-ink-900 dark:text-ink-100">
              {row.name}
            </p>
            <p className="text-xs text-ink-500 dark:text-ink-400">
              {row.brand?.name || "—"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Kateqoriya",
      render: (row) => row.category?.name || "—",
    },
    { key: "sku", header: "SKU" },
    {
      key: "price",
      header: "Qiymət",
      render: (row) => (
        <span className="font-medium text-brand-700 dark:text-brand-400">
          {row.price} ₼
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => openEdit(row)}
            className="rounded-lg p-2 text-ink-300 hover:bg-ink-100/60 hover:text-brand-700 dark:text-ink-500 dark:hover:bg-white/5 dark:hover:text-brand-400"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeletingId(row.id)}
            className="rounded-lg p-2 text-ink-300 hover:bg-bad-100 hover:text-bad-700 dark:text-ink-500 dark:hover:bg-bad-500/10 dark:hover:text-bad-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Məhsul Kataloqu"
        subtitle="Sistemdə olan bütün məhsulların siyahısı."
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setManagerOpen(true)}>
              <Tag className="h-4 w-4" />
              Kateqoriya / Brend
            </Button>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Məhsul əlavə et
            </Button>
          </div>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-ink-100 bg-white p-3 dark:border-white/10 dark:bg-ink-900">
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Məhsul adı, SKU və ya barkod..."
          className="min-w-[220px] flex-1"
        />
        {/* <Button variant="secondary">
          <Filter className="h-4 w-4" />
          Filtr
        </Button> */}
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-100 bg-white dark:border-white/10 dark:bg-ink-900">
        <DataTable
          columns={columns}
          data={pageItems}
          rowKey={(row) => row.id}
          emptyText="Hələ məhsul əlavə olunmayıb"
        />
        {pageItems.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        )}
      </div>

      <ProductFormModal
        open={formOpen}
        onClose={closeForm}
        product={editingProduct}
      />
      <CategoryBrandManager
        open={managerOpen}
        onClose={() => setManagerOpen(false)}
      />
      <ConfirmDialog
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        loading={deleteProductMutation.isPending}
        title="Məhsulu sil"
        description="Bu məhsul kataloqdan həmişəlik silinəcək."
      />
    </div>
  );
};

export default ProductList;
