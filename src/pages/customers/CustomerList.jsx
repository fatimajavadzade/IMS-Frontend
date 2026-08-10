import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../../components/ui/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import ConfirmDialog from "../../components/ui/ConfirmDialog.jsx";
import Spinner from "../../components/ui/Spinner.jsx";

import { useCustomers } from "../../hooks/customers/useCustomers";
import { useDeleteCustomer } from "../../hooks/customers/useDeleteCustomer";

import CustomerFormModal from "./CustomerFormModal.jsx";

const PAGE_SIZE = 8;

const CustomerList = () => {
  const { data: customers = [], isLoading } = useCustomers();
  const deleteCustomerMutation = useDeleteCustomer();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.companyName?.toLowerCase().includes(q) ||
        c.voen?.toLowerCase().includes(q) ||
        c.contactPerson?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q),
    );
  }, [search, customers]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openCreate = () => {
    setEditingCustomer(null);
    setFormOpen(true);
  };

  const openEdit = (customer) => {
    setEditingCustomer(customer);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingCustomer(null);
  };

  const handleDelete = async () => {
    try {
      await deleteCustomerMutation.mutateAsync(deletingId);
      toast.success("Müştəri uğurla silindi.");
      setDeletingId(null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Müştəri silinərkən xəta baş verdi.",
      );
    }
  };

  const columns = [
    {
      key: "companyName",
      header: "Şirkət",
      render: (row) => (
        <div>
          <p className="font-medium text-ink-900 dark:text-ink-100">
            {row.companyName}
          </p>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            Vöen: {row.voen || "—"}
          </p>
        </div>
      ),
    },
    {
      key: "contactPerson",
      header: "Əlaqədar şəxs",
      render: (row) => row.contactPerson || "—",
    },
    {
      key: "contact",
      header: "Əlaqə",
      render: (row) => (
        <div className="space-y-1">
          <p className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400">
            <Phone className="h-3 w-3 shrink-0" />
            {row.phone || "—"}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400">
            <Mail className="h-3 w-3 shrink-0" />
            {row.email || "—"}
          </p>
        </div>
      ),
    },
    {
      key: "address",
      header: "Ünvan",
      render: (row) => (
        <span className="line-clamp-2 max-w-xs">{row.address || "—"}</span>
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
        title="Müştərilər"
        subtitle="Bütün müştərilərin siyahısı və əlaqə məlumatları."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Müştəri əlavə et
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-ink-100 bg-white p-3 dark:border-white/10 dark:bg-ink-900">
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Şirkət adı, VÖEN, əlaqədar şəxs..."
          className="min-w-[220px] flex-1"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-100 bg-white dark:border-white/10 dark:bg-ink-900">
        <DataTable
          columns={columns}
          data={pageItems}
          rowKey={(row) => row.id}
          emptyText="Hələ müştəri əlavə olunmayıb"
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

      <CustomerFormModal
        open={formOpen}
        onClose={closeForm}
        customer={editingCustomer}
      />
      <ConfirmDialog
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        loading={deleteCustomerMutation.isPending}
        title="Müştərini sil"
        description="Bu müştəri sistemdən həmişəlik silinəcək."
      />
    </div>
  );
};

export default CustomerList;