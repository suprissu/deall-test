// #region IMPORTS
import { DashboardTemplate } from "@/components/templates";
import {
  Cart,
  CartDetailResponse,
  LoginResponse,
  Product,
} from "@/domains/Types.domains";
import { useRouter } from "next/router";
import { useToggle } from "usehooks-ts";
import { BsChevronDown, BsChevronLeft, BsChevronUp } from "react-icons/bs";
import { Table } from "@/components/atoms";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { GetServerSideProps } from "next";
import { withAuthGuard } from "@/bootstrap/AuthGuard.bootstrap";
import { Endpoints } from "@/domains/Endpoints.domains";
import axios from "axios";
// #endregion IMPORTS

// #region PROPS
type CartProps = {
  cart: CartDetailResponse;
};
type CartDetailProps = {
  cartDetail: CartDetailResponse;
};
// #endregion PROPS

export const getServerSideProps: GetServerSideProps = async (context) => {
  return withAuthGuard(context, async () => {
    const { res, params } = context;
    const id = params?.id as string;

    if (!id) throw new Error("Cart detail not found.");

    const { data } = await axios
      .get(Endpoints.GET_CART_DETAIL.replace(":id", id))
      .catch(() => {
        return { data: null };
      });

    if (res) {
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=10, stale-while-revalidate=59"
      );
    }

    return {
      props: {
        cartDetail: data,
      },
    };
  });
};

// #region CART COMPONENT
function Cart({ cart }: CartProps) {
  const columns = useMemo(
    () =>
      [
        {
          accessorKey: "title",
        },
        {
          accessorKey: "quantity",
        },
        {
          accessorKey: "price",
          cell(props) {
            return `$${props.cell.getValue()}`;
          },
        },
        {
          accessorKey: "discountPercentage",
          header: "discount",
          cell(props) {
            return `${props.cell.getValue()}%`;
          },
        },
        {
          accessorKey: "total",
          cell(props) {
            return `$${props.cell.getValue()}`;
          },
        },
      ] satisfies ColumnDef<Cart["products"][number]>[],
    []
  );

  return (
    <div className="flex flex-col gap-2">
      <section className="w-full bg-info-100 p-4">
        <div className="pb-2 mb-2 border-b-2">
          <h4 className="font-semibold text-info-500">Detail</h4>
        </div>
        <div className="grid grid-cols-2">
          <p>User: {cart.userId}</p>
          <p>Number of Items: {cart.totalQuantity}</p>
          <p>Price: ${cart.total}</p>
          <p>Number of Products: {cart.totalProducts}</p>
        </div>
      </section>
      <div>
        <Table columns={columns} data={cart.products} />
      </div>
    </div>
  );
}
// #endregion CART COMPONENT

// #region MAIN COMPONENT
export default function CartDetail({
  cartDetail: cartDetailResponse,
}: CartDetailProps) {
  const router = useRouter();

  console.log(cartDetailResponse);

  return (
    <DashboardTemplate title="Carts Detail">
      <div className="w-full h-full flex flex-col">
        <button className="flex items-center gap-1" onClick={router.back}>
          <BsChevronLeft />
          <h1 className="text-xl font-bold m-4">
            Carts Detail #{router.query.id}
          </h1>
        </button>
        <div className="flex-1 bg-white p-4 rounded-md w-full flex flex-col">
          <Cart cart={cartDetailResponse} />
        </div>
      </div>
    </DashboardTemplate>
  );
}
// #endregion MAIN COMPONENT
