// #region IMPORTS
import { withAuthGuard } from "@/bootstrap/AuthGuard.bootstrap";
import { CartsTable } from "@/components/molecules";
import { DashboardTemplate } from "@/components/templates";
import { AppRouter, Endpoints } from "@/domains/Endpoints.domains";
import { Cart, CartsResponse } from "@/domains/Types.domains";
import axios from "axios";
import { GetServerSideProps } from "next";
import React, { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
// #endregion IMPORTS

export const getServerSideProps: GetServerSideProps = async (context) => {
  return withAuthGuard(context, async () => {
    const { res } = context;

    const { data } = await axios.get(Endpoints.GET_CARTS).catch(() => {
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
        carts: data,
      },
    };
  });
};

// #region PROPS
type CartsProps = {
  carts: CartsResponse;
};
// #endregion PROPS

// #region MAIN COMPONENT
export default function Carts({ carts: cartsResponse }: CartsProps) {
  const data: Cart[] = useMemo(
    () => cartsResponse?.carts ?? [],
    [cartsResponse]
  );

  useEffect(() => {
    if (
      !cartsResponse ||
      (cartsResponse.carts.length === 0 && cartsResponse.total)
    ) {
      toast.error("Failed to fetch carts!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.success("Fetched carts API.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }, [cartsResponse]);

  return (
    <DashboardTemplate title={AppRouter.CARTS.name}>
      <div className="w-full h-full flex flex-col">
        <h1 className="text-xl font-bold m-4">{AppRouter.CARTS.name}</h1>
        <div className="flex-1 bg-white p-4 rounded-md w-full flex flex-col">
          <CartsTable data={data} />
        </div>
      </div>
    </DashboardTemplate>
  );
}
// #endregion MAIN COMPONENT
