import { Inbox } from "lucide-react";
import EmptyState from "./EmptyState.jsx";

const DataTable = ({
  columns,
  data = [],
  rowKey,
  emptyText = "Nəticə tapılmadı",
}) => {
  if (!data.length) {
    return <EmptyState icon={Inbox} title={emptyText} />;
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-500 dark:border-white/10 dark:text-ink-400">
          {columns.map((col) => (
            <th key={col.key} className="px-5 py-3 font-medium">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr
            key={rowKey(row)}
            className="border-b border-ink-100 last:border-0 hover:bg-ink-100/30 dark:border-white/10 dark:hover:bg-white/5"
          >
            {columns.map((col) => (
              <td
                key={col.key}
                className="px-5 py-4 align-middle text-ink-700 dark:text-ink-300"
              >
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;