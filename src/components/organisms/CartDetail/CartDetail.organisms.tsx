// #region IMPORTS
import { Cart, CartDetailResponse } from "@/domains/Types.domains";
import { Table } from "@/components/atoms";
import { useMemo } from "react";
import { CellProps, Column } from "react-table";
// #endregion IMPORTS

// #region PROPS
type CartProps = {
  cart: CartDetailResponse;
};
type ProductCartDetail = Cart["products"][number];
// #endregion PROPS

export default function CartDetail({ cart }: CartProps) {
  const columns = useMemo(
    () =>
      [
        {
          accessor: "title",
          Header: "title",
        },
        {
          accessor: "quantity",
          Header: "quantity",
        },
        {
          accessor: "price",
          Header: "price",
          Cell(props: CellProps<ProductCartDetail>) {
            return <>{`$${props.value}`}</>;
          },
        },
        {
          accessor: "discountPercentage",
          Header: "discount",
          Cell(props: CellProps<ProductCartDetail>) {
            return <>{`${props.value}%`}</>;
          },
        },
        {
          accessor: "total",
          Header: "total",
          Cell(props: CellProps<ProductCartDetail>) {
            return <>{`$${props.value}`}</>;
          },
        },
      ] satisfies Column<ProductCartDetail>[],
    []
  );

  return (
    <div className="flex flex-col gap-2">
      <section className="w-full bg-info-100 p-4">
        <div className="pb-2 mb-2 border-b-2">
          <h4 className="font-semibold text-info-500">Detail</h4>
        </div>
        <div className="grid grid-cols-2 mobile:flex mobile:flex-col">
          <p>
            <span className="font-bold">User:</span> {cart.userId}
          </p>
          <p>
            <span className="font-bold">Number of Items:</span>{" "}
            {cart.totalQuantity}
          </p>
          <p>
            <span className="font-bold">Price:</span> ${cart.total}
          </p>
          <p>
            <span className="font-bold">Number of Products:</span>{" "}
            {cart.totalProducts}
          </p>
        </div>
      </section>
      <div>
        <Table columns={columns} data={cart.products} isLoading={false} />
      </div>
    </div>
  );
}
