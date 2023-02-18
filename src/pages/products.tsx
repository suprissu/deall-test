// TODO:  Filter should be given from Backend.
//        Note that the list will filter manual from react-table feature.
//        Bugs will be occured.

// #region IMPORTS
import { Input, Table } from "@/components/atoms";
import { DashboardTemplate } from "@/components/templates";
import { AppRouter, Endpoints } from "@/domains/Endpoints.domains";
import { Product, ProductResponse } from "@/domains/Types.domains";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AiOutlineCloseCircle, AiOutlineSearch } from "react-icons/ai";
import QueryString from "qs";
import { FilterModal, Pagination } from "@/components/molecules";
import { withAuthGuard } from "@/bootstrap/AuthGuard.bootstrap";
import { CellProps, Column } from "react-table";
import { toast } from "react-toastify";
import ProductsTable from "@/components/molecules/ProductsTable";
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
type FilterTypes = {
  title: string | undefined;
  brand: string | undefined;
  category: string | undefined;
  price: string | undefined;
};
// #endregion PROPS

// #region MAIN COMPONENT
export default function Products({
  products: productsResponse,
}: ProductsProps) {
  const router = useRouter();
  const {
    s: qSearch,
    p: qPage,
    l: qLimit,
    title: qTitle,
    brand: qBrand,
    category: qCategory,
    price: qPrice,
  } = router.query;
  const totalItems = useMemo(
    () => productsResponse?.total ?? 0,
    [productsResponse]
  );
  const currentPage = useMemo(() => Number(qPage ?? 1), [qPage]);
  const limit = useMemo(() => (qLimit ? Number(qLimit) : 30), [qLimit]);
  const maxPrice = useMemo(
    () =>
      Math.max.apply(
        null,
        productsResponse.products.map((prod) => prod.price)
      ),
    [productsResponse.products]
  );

  const [searchText, setSearchText] = useState(qSearch ?? "");
  const filters = useMemo(
    () => ({
      title: (qTitle as string) ?? "",
      brand: (qBrand as string) ?? "",
      category: (qCategory as string) ?? "",
      price: (qPrice as string) ?? "",
    }),
    [qBrand, qCategory, qPrice, qTitle]
  );

  const filterColumns = useMemo(
    () => [
      { id: "brand", value: filters.brand ?? "" },
      { id: "title", value: filters.title ?? "" },
      { id: "price", value: filters.price ?? "" },
      { id: "category", value: filters.category ?? "" },
    ],
    [filters.brand, filters.category, filters.price, filters.title]
  );

  const data: Product[] = useMemo(
    () => productsResponse?.products ?? [],
    [productsResponse]
  );

  const handleSearch = useCallback(
    (search?: string) => {
      if (search === "") setSearchText(search);
      const params = QueryString.stringify({
        ...router.query,
        s: search === "" ? undefined : searchText || undefined,
        p: 1,
      });
      router.push(`${AppRouter.PRODUCTS.path}${params ? "?" + params : ""}`);
    },
    [router, searchText]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const params = QueryString.stringify({
        ...router.query,
        p: page,
      });
      router.push(`${AppRouter.PRODUCTS.path}${params ? "?" + params : ""}`);
    },
    [router]
  );

  const handleLimitChange = useCallback(
    (limit: string) => {
      const params = QueryString.stringify({
        ...router.query,
        p: 1,
        l: limit,
      });
      router.push(`${AppRouter.PRODUCTS.path}${params ? "?" + params : ""}`);
    },
    [router]
  );

  const handleFilterChange = useCallback(
    (data: FilterTypes) => {
      const [min, max] = data.price?.split("-") ?? [];
      const filter = {
        ...data,
        price: data.price ? `${min}-${Number(max) || maxPrice}` : undefined,
      };
      const params = QueryString.stringify({
        ...router.query,
        ...filter,
      });
      router.push(`${AppRouter.PRODUCTS.path}${params ? "?" + params : ""}`);
    },
    [maxPrice, router]
  );

  useEffect(() => {
    if (
      !productsResponse ||
      (productsResponse.products.length === 0 && productsResponse.total)
    ) {
      toast.error("Failed to fetch products!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.success("Fetched products API.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }, [productsResponse]);

  return (
    <DashboardTemplate title={AppRouter.PRODUCTS.name}>
      <div className="w-full h-full flex flex-col">
        <h1 className="text-xl font-bold m-4">{AppRouter.PRODUCTS.name}</h1>
        <div className="flex-1 bg-white p-4 rounded-md w-full flex flex-col gap-4">
          <div className="flex items-center justify-end gap-4">
            <FilterModal
              products={productsResponse}
              onFilterChange={handleFilterChange}
            />
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
          {filterColumns.some((data) => data.value !== "") && (
            <p className="flex gap-2">
              Result for:
              {filterColumns?.map((data, index) => {
                return data.value !== "" ? (
                  <span key={index}>
                    <span className="capitalize mr-2 text-primary-500">
                      {data.id}
                    </span>
                    <span className="font-medium">
                      {"'"}
                      {data.id !== "price"
                        ? data.value.replaceAll(";", ", ")
                        : data.value
                            .split("-")
                            .map((num) => `$${num}`)
                            .join(" - ")}
                      {"'"}
                    </span>
                  </span>
                ) : null;
              })}
            </p>
          )}
          <ProductsTable data={data} filterColumns={filterColumns} />
          <Pagination
            total={totalItems}
            page={currentPage}
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
