// #region IMPORTS
import { DashboardTemplate } from "@/components/templates";
import {
  Cart,
  CartDetailResponse,
  UsersResponse,
} from "@/domains/Types.domains";
import { useRouter } from "next/router";
import { BsChevronLeft } from "react-icons/bs";
import { Table } from "@/components/atoms";
import { useEffect, useMemo } from "react";
import { GetServerSideProps } from "next";
import { withAuthGuard } from "@/bootstrap/AuthGuard.bootstrap";
import { AppRouter, Endpoints } from "@/domains/Endpoints.domains";
import axios from "axios";
import { CellProps, Column } from "react-table";
import { toast } from "react-toastify";
// #endregion IMPORTS

// #region PROPS
type CartProps = {
  cart: CartDetailResponse;
};
type CartDetailProps = {
  cartDetail: CartDetailResponse;
};
type ProductCartDetail = Cart["products"][number];
type CartDetailResponseType = { data: CartDetailResponse | null };
type UsersResponseType = { data: UsersResponse | null };
// #endregion PROPS

export const getServerSideProps: GetServerSideProps = async (context) => {
  return withAuthGuard(context, async () => {
    const { res, params } = context;
    const id = params?.id as string;

    if (!id) throw new Error("Cart detail not found.");

    const { data: cartDetail }: CartDetailResponseType = await axios
      .get(Endpoints.GET_CART_DETAIL.replace(":id", id))
      .catch(() => {
        return { data: null };
      });

    const { data: users }: UsersResponseType = await axios
      .get(Endpoints.USERS)
      .catch(() => {
        return { data: null };
      });

    if (res) {
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=10, stale-while-revalidate=59"
      );
    }

    const user = users?.users.find((user) => user.id === cartDetail?.id);

    return {
      props: {
        cartDetail: cartDetail
          ? {
              ...cartDetail,
              userId: user?.username,
            }
          : null,
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
// #endregion CART COMPONENT

// #region MAIN COMPONENT
export default function CartDetail({
  cartDetail: cartDetailResponse,
}: CartDetailProps) {
  const router = useRouter();

  useEffect(() => {
    if (
      !cartDetailResponse ||
      (cartDetailResponse.products.length === 0 &&
        cartDetailResponse.totalProducts)
    ) {
      toast.error("Failed to fetch cart detail!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.success("Fetched cart detail API.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }, [cartDetailResponse]);

  return (
    <DashboardTemplate title={AppRouter.CART_DETAIL.name}>
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
