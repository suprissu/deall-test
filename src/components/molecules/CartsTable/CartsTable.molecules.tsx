import { Button, Table } from "@/components/atoms";
import { AppRouter } from "@/domains/Endpoints.domains";
import { Cart } from "@/domains/Types.domains";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { CellProps, Column } from "react-table";

type CartsTableProps = {
  data: Cart[];
  filterColumns?: {
    id: string;
    value: string;
  }[];
};

export default function CartsTable({ data, filterColumns }: CartsTableProps) {
  const router = useRouter();

  const columns = useMemo(
    () =>
      [
        {
          accessor: "id",
          Header: "Id",
        },
        {
          accessor: "userId",
          Header: "User Id",
        },
        {
          accessor: "totalProducts",
          Header: "Total Products",
        },
        {
          accessor: "totalQuantity",
          Header: "Total Quantity",
        },
        {
          accessor: "total",
          Header: "Total Price",
          Cell(props: CellProps<Cart>) {
            return <>{`$${props.value}`}</>;
          },
        },
        {
          accessor: "products",
          Header: "Action",
          Cell(props: CellProps<Cart>) {
            return (
              <Button
                variants="info"
                onClick={() =>
                  router.push(
                    AppRouter.CART_DETAIL.path.replace(
                      ":id",
                      String(props.row.original.id)
                    )
                  )
                }
              >
                Detail
              </Button>
            );
          },
        },
      ] satisfies Column<Cart>[],
    [router]
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
