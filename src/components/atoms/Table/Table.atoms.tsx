// #region IMPORTS
import React, { useState } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
// #endregion IMPORTS

// #region TW STYLES
const containerStyle =
  "w-full h-96 flex-grow border-collapse border border-info-200 rounded-xl overflow-auto";
const tableStyle = "w-full relative z-0";
const theadStyle = "sticky -top-[1px] z-index[1] bg-info-200 m-0";
const thStyle =
  "sticky top-0 z-index[4] px-4 py-2 capitalize text-left hover:bg-info-300";
const tdStyle = "p-4";
const trStyle = "even:bg-info-100";
// #endregion TW STYLES

// #region PROPS
type TableProps = {
  columns: unknown[];
  data: unknown[];
};
// #endregion PROPS

// #region MAIN COMPONENT
export default function Table({ columns, data }: TableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

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

  return (
    <div className={containerStyle}>
      <table className={tableStyle}>
        <thead className={theadStyle}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="w-full">
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={thStyle}
                  >
                    {!header.isPlaceholder && (
                      <div
                        className={`${
                          header.column.getCanSort() &&
                          "cursor-pointer select-none"
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
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
          {table.getRowModel().rows.map((row) => {
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
        </tbody>
      </table>
    </div>
  );
}
// #endregion MAIN COMPONENT
