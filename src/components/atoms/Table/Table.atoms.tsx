// #region IMPORTS
import React from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtual } from "react-virtual";
// #endregion IMPORTS

// #region TW STYLES
const containerStyle = "max-w-full h-96 overflow-auto";
const tableStyle =
  "w-full h-32 border border-info-100 rounded-xl border-collapse border-spacing-0 table-fixed overflow-hidden";
const tableHeadStyle = "bg-info-200 m-0 sticky top-0";
const thStyle = "px-4 py-2 capitalize text-left hover:bg-info-200";
const tdStyle = "p-4";
const trStyle = "even:bg-info-100";
// #endregion TW STYLES

// #region PROPS
type TableProps = {
  columns: unknown;
  data: unknown;
};
// #endregion PROPS

// #region MAIN COMPONENT
export default function Table({ columns, data }: TableProps) {
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: data as Record<string, unknown>[],
    columns: columns as ColumnDef<Record<string, unknown>>[],
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10,
  });

  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;

  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  return (
    <div ref={tableContainerRef} className={containerStyle}>
      <table className={tableStyle}>
        <thead className={tableHeadStyle}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    className={thStyle}
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: `${paddingTop}px` }} />
            </tr>
          )}
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index] as Row<unknown>;
            return (
              <tr key={row.id} className={trStyle}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id} className={tdStyle}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: `${paddingBottom}px` }} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
// #endregion MAIN COMPONENT
