// #region IMPORTS
import { withAuthGuard } from "@/bootstrap/AuthGuard.bootstrap";
import { Button, Table } from "@/components/atoms";
import { DashboardTemplate } from "@/components/templates";
import { AppRouter, Endpoints } from "@/domains/Endpoints.domains";
import { Cart, CartsResponse, LoginResponse } from "@/domains/Types.domains";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
// #endregion IMPORTS

export const getServerSideProps: GetServerSideProps = async (context) => {
  return withAuthGuard(context, async () => {
    const { req, res } = context;
    const cSession = req.cookies["_session"];

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
  const router = useRouter();
  const data: Cart[] = useMemo(
    () => cartsResponse?.carts ?? [],
    [cartsResponse]
  );
  const columns = useMemo(
    () =>
      [
        {
          accessorKey: "id",
        },
        {
          accessorKey: "userId",
        },
        {
          accessorKey: "totalProducts",
        },
        {
          accessorKey: "totalQuantity",
        },
        {
          accessorKey: "total",
          cell(props) {
            return `$${props.cell.getValue()}`;
          },
        },
        {
          header: "Action",
          cell(props) {
            return (
              <Button
                variants="info"
                onClick={() =>
                  router.push(
                    AppRouter.CART_DETAIL.replace(
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
      ] satisfies ColumnDef<Cart>[],
    [router]
  );

  return (
    <DashboardTemplate title="Carts">
      <div className="w-full h-full flex flex-col">
        <h1 className="text-xl font-bold m-4">Carts</h1>
        <div className="flex-1 bg-white p-4 rounded-md w-full flex flex-col">
          <Table columns={columns} data={data} />
        </div>
      </div>
    </DashboardTemplate>
  );
}
// #endregion MAIN COMPONENT
