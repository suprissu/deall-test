// #region IMPORTS
import { Input, Table } from "@/components/atoms";
import { DashboardTemplate } from "@/components/templates";
import { AppRouter, Endpoints } from "@/domains/Endpoints.domains";
import { Product, ProductResponse } from "@/domains/Types.domains";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import QueryString from "qs";
// #endregion IMPORTS

export const getServerSideProps: GetServerSideProps = async ({
  res,
  query,
}) => {
  const search = query.s ? `/search?q=${query.s}` : "";

  const { data } = await axios
    .get(Endpoints.GET_PRODUCTS + search)
    .catch((e) => {
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
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

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

  const handleSearch = useCallback(() => {
    const params = QueryString.stringify({
      s: searchText || undefined,
    });
    router.push(`${AppRouter.PRODUCTS}${params ? "?" + params : ""}`);
  }, [router, searchText]);

  return (
    <DashboardTemplate title="Products">
      <div className="w-full h-full flex flex-col">
        <h1 className="text-xl font-bold m-4">Products</h1>
        <div className="flex-1 bg-white p-4 rounded-md w-full flex flex-col gap-4">
          <div className="flex items-center justify-end">
            <Input
              placeholder="Search..."
              onChange={(e) => setSearchText(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && handleSearch()}
              rightIcon={
                <button
                  className="p-2 rounded-md hover:bg-info-100"
                  onClick={handleSearch}
                >
                  <AiOutlineSearch />
                </button>
              }
            />
          </div>
          <Table columns={columns} data={data} />
        </div>
      </div>
    </DashboardTemplate>
  );
}
// #endregion MAIN COMPONENT
