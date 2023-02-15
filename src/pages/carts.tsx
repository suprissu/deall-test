// #region IMPORTS
import { Table } from "@/components/atoms";
import { DashboardTemplate } from "@/components/templates";
import { Endpoints } from "@/domains/Endpoints.domains";
import { Cart, CartsResponse, LoginResponse } from "@/domains/Types.domains";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { GetServerSideProps } from "next";
import React, { useEffect, useMemo } from "react";
// #endregion IMPORTS

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cSession = req.cookies["_session"];
  const session = JSON.parse(cSession ?? "") as LoginResponse;

  if (!session || !session.id) return { props: { carts: null } };

  const { data } = await axios
    .get(Endpoints.GET_CARTS.replace(":id", String(session.id)))
    .catch((e) => {
      throw new Error("Cannot fetch carts from server", { cause: e });
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
  const columns: ColumnDef<Cart>[] = useMemo(
    () => [
      {
        accessorKey: "userId",
      },
      {
        accessorKey: "totalQuantity",
      },
      {
        accessorKey: "total",
      },
      {
        accessorKey: "totalProducts",
      },
    ],
    []
  );

  return (
    <DashboardTemplate title="Carts">
      <div className="w-full h-full flex flex-col">
        <h1 className="text-xl font-bold m-4">Carts</h1>
        <div className="flex-1 bg-white p-4 rounded-md w-full">
          <Table columns={columns} data={data} />
        </div>
      </div>
    </DashboardTemplate>
  );
}
// #endregion MAIN COMPONENT
