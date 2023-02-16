// #region IMPORTS
import { Button, Input, Table } from "@/components/atoms";
import { DashboardTemplate } from "@/components/templates";
import { AppRouter, Endpoints } from "@/domains/Endpoints.domains";
import { Product, ProductResponse } from "@/domains/Types.domains";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";
import {
  AiFillFilter,
  AiOutlineCloseCircle,
  AiOutlineSearch,
} from "react-icons/ai";
import QueryString from "qs";
import { Pagination } from "@/components/molecules";
import { withAuthGuard } from "@/bootstrap/AuthGuard.bootstrap";
// #endregion IMPORTS

export const getServerSideProps: GetServerSideProps = async (context) => {
  return withAuthGuard(context, async ({ res, query }) => {
    const limit = query.l || 30;
    const skip =
      query.p && limit ? String((Number(query.p) - 1) * Number(limit)) : 0;
    const search: string = query.s ? `/search?q=${query.s}` : "";
    const params: string = QueryString.stringify({ limit, skip });

    const { data } = await axios
      .get(
        `${Endpoints.GET_PRODUCTS}${
          search ? `${search}&${params}` : `?${params}`
        }`
      )
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
        products: data,
      },
    };
  });
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
  const { s: qSearch, p: qPage, l: qLimit } = router.query;
  const [searchText, setSearchText] = useState(qSearch ?? "");
  const totalItems = useMemo(
    () => productsResponse?.total ?? 0,
    [productsResponse]
  );
  const limit = useMemo(() => (qLimit ? Number(qLimit) : 30), [qLimit]);

  const data: Product[] = useMemo(
    () => productsResponse?.products ?? [],
    [productsResponse]
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

  const handleSearch = useCallback(
    (search?: string) => {
      if (search === "") setSearchText(search);
      const params = QueryString.stringify({
        s: search === "" ? undefined : searchText || undefined,
        l: qLimit,
        p: 1,
      });
      router.push(`${AppRouter.PRODUCTS}${params ? "?" + params : ""}`);
    },
    [qLimit, router, searchText]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const params = QueryString.stringify({
        s: searchText || undefined,
        p: page,
        l: qLimit,
      });
      router.push(`${AppRouter.PRODUCTS}${params ? "?" + params : ""}`);
    },
    [qLimit, router, searchText]
  );

  const handleLimitChange = useCallback(
    (limit: string) => {
      const params = QueryString.stringify({
        s: searchText || undefined,
        p: 1,
        l: limit,
      });
      router.push(`${AppRouter.PRODUCTS}${params ? "?" + params : ""}`);
    },
    [router, searchText]
  );

  return (
    <DashboardTemplate title="Products">
      <div className="w-full h-full flex flex-col">
        <h1 className="text-xl font-bold m-4">Products</h1>
        <div className="flex-1 bg-white p-4 rounded-md w-full flex flex-col gap-4">
          <div className="flex items-center justify-end gap-4">
            <Button variants="info" types="outline" className="flex gap-2">
              <p>Filter</p>
              <AiFillFilter />
            </Button>
            <Input
              placeholder="Search..."
              onChange={(e) => setSearchText(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && handleSearch()}
              value={searchText}
              rightIcon={
                qSearch ? (
                  <button
                    className="p-2 rounded-md hover:bg-info-100"
                    onClick={() => handleSearch("")}
                  >
                    <AiOutlineCloseCircle />
                  </button>
                ) : (
                  <button
                    className="p-2 rounded-md hover:bg-info-100"
                    onClick={() => handleSearch()}
                  >
                    <AiOutlineSearch />
                  </button>
                )
              }
            />
          </div>
          <Table columns={columns} data={data} />
          <Pagination
            total={totalItems}
            page={Number(qPage ?? 1)}
            limit={limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </div>
      </div>
    </DashboardTemplate>
  );
}
// #endregion MAIN COMPONENT
