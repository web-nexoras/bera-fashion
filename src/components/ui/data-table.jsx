import { cn } from "@/lib/utils";
export function DataTable({ columns, rows, empty, className, }) {
    return (<div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-ink-100 bg-ink-50/60">
            {columns.map((column) => (<th key={column.key} className={cn("whitespace-nowrap px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-500", column.align === "right" && "text-right", column.align === "center" && "text-center")}>
                {column.label}
              </th>))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {rows.length === 0 ? (<tr>
              <td colSpan={columns.length} className="px-5 py-14 text-center text-sm text-ink-500">
                {empty ?? "No records found."}
              </td>
            </tr>) : (rows.map((row, index) => (<tr key={index} className="transition-colors hover:bg-brand-50/30">
                {columns.map((column) => (<td key={column.key} className={cn("whitespace-nowrap px-5 py-3.5 text-ink-700", column.align === "right" && "text-right", column.align === "center" && "text-center", column.className)}>
                    {row[column.key] ?? "—"}
                  </td>))}
              </tr>)))}
        </tbody>
      </table>
    </div>);
}
