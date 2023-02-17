import { matchSorter } from "match-sorter";
import React, { useCallback, useEffect, useMemo } from "react";
import {
  Column,
  Row,
  TableOptions,
  useFilters,
  useGlobalFilter,
  useSortBy,
  useTable,
} from "react-table";
import { useSticky } from "react-table-sticky";
import { ImFileEmpty } from "react-icons/im";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { LoadingSkeletonTable } from "@/components/atoms";

// STYLED COMPONENTS
const tableContainerStyle = `w-full flex-1 flex flex-col`;
const tableWrapperStyle = `w-full h-96 flex-grow border-collapse border border-info-200 rounded-xl overflow-auto`;
const tableStyle = `w-full relative z-0`;
const tHeadStyle = `sticky -top-[1px] z-index[1] bg-info-200 m-0`;
const tableHeaderStyle = `sticky top-0 z-index[4] px-4 py-2 capitalize text-left hover:bg-info-300`;
const tableHeaderItemContainerStyle = `flex items-center gap-1 font-medium`;
const tableRowStyle = `w-full even:bg-info-100 transition duration-500 hover:bg-primary-100`;
const tableDataStyle = `border-gray-100 p-4 w-96 h-5 border-b`;
const emptyTableIconContainerStyle = `flex flex-col align-middle text-center mt-28`;
const emptyTableTextStyle = `text-primary-500 mt-3 font-weight[600]`;

type TableDashboardProps = {
  isLoading: boolean;
  hasPagination?: boolean;
  title?: string;
  emptyIcon?: JSX.Element;
  totalItems?: number;
  data: unknown[];
  columns: unknown[];
  options?: Omit<TableOptions<Record<string, unknown>>, "data" | "columns">;
  searchFilterString?: string;
  filterColumns?: { id: string; value: string }[];
  searchFilterColumns?: string[];
  handleRowClick?: (data: Row<Record<string, unknown>>) => void;
  extraEmptyComponent?: JSX.Element;
  actionDrawer?: JSX.Element;
  onPageChange?: (page: number) => void;
};

const TableDashboard: React.FC<TableDashboardProps> = ({
  title,
  emptyIcon,
  isLoading,
  data,
  columns,
  options,
  searchFilterString,
  filterColumns,
  searchFilterColumns,
  handleRowClick,
  extraEmptyComponent,
}) => {
  const globalFilter = useCallback(
    (
      rows: Row<Record<string, unknown>>[],
      columnIds: string[],
      query: string
    ) => {
      if (!searchFilterColumns) return rows;
      return matchSorter(rows, query, {
        keys: searchFilterColumns.map((columnName) => `values.${columnName}`),
      });
    },
    [searchFilterColumns]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setAllFilters,
    setGlobalFilter,
  } = useTable(
    {
      globalFilter,
      data: data as Record<string, unknown>[],
      columns: columns as Column<Record<string, unknown>>[],
      sortTypes: {
        alphanumeric: (
          row1: Row<Record<string, unknown>>,
          row2: Row<Record<string, unknown>>,
          columnName: string
        ) => {
          const valueA = row1.values[columnName].toString();
          const valueB = row2.values[columnName].toString();
          return valueB.localeCompare(valueA, undefined, {
            sensitivity: "base",
          });
        },
        numeric: (
          row1: Row<Record<string, unknown>>,
          row2: Row<Record<string, unknown>>,
          columnName: string
        ) => {
          const valueA = row1.values[columnName];
          const valueB = row2.values[columnName];
          return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        },
      },
      ...options,
    },
    useSticky,
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  // #region GLOBAL FILTER
  const onGlobalFilterChange = useCallback(() => {
    setGlobalFilter(searchFilterString);
  }, [searchFilterString, setGlobalFilter]);

  useEffect(() => {
    if (typeof searchFilterString !== "undefined") {
      onGlobalFilterChange();
    }
  }, [searchFilterString, onGlobalFilterChange]);
  // #endregion

  // #region COLUMNS FILTER
  useEffect(() => {
    if (filterColumns) {
      setAllFilters(filterColumns);
    }
  }, [setAllFilters, filterColumns]);
  // #endregion

  // #region TABLE BODY DATA
  const tableBodyWithData = useMemo(() => {
    return (
      <tbody {...getTableBodyProps()}>
        {rows.map((row, idx) => {
          prepareRow(row);
          const { key, ...restRowProps } = row.getRowProps();
          return (
            <tr
              className={tableRowStyle}
              key={`${key}_${idx}`}
              {...restRowProps}
              onClick={() => !!handleRowClick && handleRowClick(row)}
            >
              {row.cells.map((cell, index) => {
                const { key, className, ...restCellProps } = cell.getCellProps({
                  className: (cell.column as unknown as Record<string, string>)
                    .extraStyle,
                });
                const extraStyle = className as string;
                return (
                  <td
                    key={`${key}_${index}`}
                    className={`${tableDataStyle} ${extraStyle}`}
                    {...restCellProps}
                  >
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    );
  }, [getTableBodyProps, handleRowClick, prepareRow, rows]);
  // #endregion

  // #region TABLE BODY LOADING
  const tableBodyLoading = useMemo(() => {
    return (
      <tbody>
        <LoadingSkeletonTable
          columns={columns as Column<Record<string, unknown>>[]}
        />
      </tbody>
    );
  }, [columns]);
  // #endregion

  // #region TABLE HEAD
  const tableHead = (
    <thead className={tHeadStyle}>
      {headerGroups.map((headerGroup, idx) => {
        const { key, ...restHeaderGroupProps } =
          headerGroup.getHeaderGroupProps();
        return (
          <tr key={`${key}_${idx}`} {...restHeaderGroupProps}>
            {headerGroup.headers.map((column, index) => {
              const { key, ...restHeaderProps } = column.getHeaderProps(
                column.getSortByToggleProps()
              );
              return (
                <th
                  className={tableHeaderStyle}
                  key={`${key}_${index}`}
                  {...restHeaderProps}
                >
                  <div className={tableHeaderItemContainerStyle}>
                    {column.render("Header")}
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <BiChevronUp className="w-4 h-4 stroke-0 text-cc-slate-400" />
                      ) : (
                        <BiChevronDown className="w-4 h-4 stroke-0 text-cc-slate-400" />
                      )
                    ) : (
                      ""
                    )}{" "}
                  </div>
                </th>
              );
            })}
          </tr>
        );
      })}
    </thead>
  );
  // #endregion

  return (
    <div className={tableContainerStyle}>
      {(isLoading ||
        ((data as Record<string, unknown>[]).length !== 0 &&
          rows.length !== 0)) && (
        <div className={tableWrapperStyle} {...getTableProps()}>
          <table className={tableStyle}>
            {tableHead}
            {isLoading ? tableBodyLoading : tableBodyWithData}
          </table>
        </div>
      )}
      <div>
        <React.Fragment>
          {!isLoading && rows.length === 0 && (
            <div className={emptyTableIconContainerStyle}>
              {emptyIcon ?? <ImFileEmpty className="self-center" />}
              <p className={emptyTableTextStyle}>
                No {title ?? "data"}{" "}
                {(data as Record<string, unknown>[]).length === 0
                  ? "has been added"
                  : "found"}
              </p>
              {extraEmptyComponent}
            </div>
          )}
        </React.Fragment>
      </div>
    </div>
  );
};

export default TableDashboard;
