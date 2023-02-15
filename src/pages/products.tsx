// #region IMPORTS
import { Table } from "@/components/atoms";
import { DashboardTemplate } from "@/components/templates";
import { Endpoints } from "@/domains/Endpoints.domains";
import { Product, ProductResponse } from "@/domains/Types.domains";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { GetServerSideProps } from "next";
import React, { useMemo } from "react";
// #endregion IMPORTS

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const { data } = await axios.get(Endpoints.GET_PRODUCTS).catch((e) => {
    throw new Error("Cannot fetch products from server", { cause: e });
  });

  if (res) {
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=10, stale-while-revalidate=59"
    );
  }

  return {
    props: {
      products: data,
    },
  };
};

// #region PROPS
type ProductsProps = {
  products: ProductResponse;
};
// #endregion PROPS

// #region MAIN COMPONENT
export default function Products({
  products: productsResponse,
}: ProductsProps) {
  const data: Product[] = useMemo(
    () => productsResponse.products,
    [productsResponse.products]
  );
  const columns: ColumnDef<Product>[] = useMemo(
    () => [
      {
        accessorKey: "title",
      },
      {
        accessorKey: "brand",
      },
      {
        accessorKey: "price",
      },
      {
        accessorKey: "stock",
      },
      {
        accessorKey: "category",
      },
    ],
    []
  );

  return (
    <DashboardTemplate title="Products">
      <div className="w-full h-full flex flex-col">
        <h1 className="text-xl font-bold m-4">Products</h1>
        <div className="flex-1 bg-white p-4 rounded-md w-full">
          <Table columns={columns} data={data} />
        </div>
      </div>
    </DashboardTemplate>
  );
}
// #endregion MAIN COMPONENT
