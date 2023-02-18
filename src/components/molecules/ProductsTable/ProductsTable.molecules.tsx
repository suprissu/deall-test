import { Table } from "@/components/atoms";
import { Product } from "@/domains/Types.domains";
import { useMemo } from "react";
import { CellProps, Column } from "react-table";

type ProductsTableProps = {
  data: Product[];
  filterColumns?: {
    id: string;
    value: string;
  }[];
};

export default function ProductsTable({
  data,
  filterColumns,
}: ProductsTableProps) {
  const columns = useMemo(
    () =>
      [
        {
          accessor: "title",
          Header: "title",
          filter: "multiple",
        },
        {
          accessor: "brand",
          Header: "brand",
          filter: "multiple",
        },
        {
          accessor: "price",
          Header: "price",
          filter: "range",
          Cell(props: CellProps<Product>) {
            return <>{`$${props.value}`}</>;
          },
        },
        {
          accessor: "stock",
          Header: "stock",
        },
        {
          accessor: "category",
          Header: "category",
          filter: "multiple",
        },
      ] satisfies Column<Product>[],
    []
  );

  return (
    <Table
      columns={columns}
      data={data}
      isLoading={false}
      filterColumns={filterColumns}
    />
  );
}
