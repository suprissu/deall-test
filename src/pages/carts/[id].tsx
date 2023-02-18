// #region IMPORTS
import { DashboardTemplate } from "@/components/templates";
import {
  Cart,
  CartDetailResponse,
  UsersResponse,
} from "@/domains/Types.domains";
import { useRouter } from "next/router";
import { BsChevronLeft } from "react-icons/bs";
import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { withAuthGuard } from "@/bootstrap/AuthGuard.bootstrap";
import { AppRouter, Endpoints } from "@/domains/Endpoints.domains";
import axios from "axios";
import { toast } from "react-toastify";
import { CartDetail } from "@/components/organisms";
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

// #region MAIN COMPONENT
export default function CartDetailPage({
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
          <CartDetail cart={cartDetailResponse} />
        </div>
      </div>
    </DashboardTemplate>
  );
}
// #endregion MAIN COMPONENT
