// #region IMPORTS
import { Button, Input, Table } from "@/components/atoms";
import { DashboardTemplate } from "@/components/templates";
import { AppRouter, Endpoints } from "@/domains/Endpoints.domains";
import { Product, ProductResponse } from "@/domains/Types.domains";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AiFillFilter,
  AiOutlineCloseCircle,
  AiOutlineSearch,
} from "react-icons/ai";
import QueryString from "qs";
import { Pagination } from "@/components/molecules";
import { withAuthGuard } from "@/bootstrap/AuthGuard.bootstrap";
import { Column } from "react-table";
import Modal from "react-modal";
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

type FilterProps = {
  products: ProductResponse;
  onFilterChange: (data: {
    products: string[];
    brands: string[];
    categories: string[];
    price: {
      min: number;
      max: number;
    };
  }) => void;
};
// #endregion PROPS

// #region FILTER MODAL
Modal.setAppElement("#__next");
function Filter({ products, onFilterChange }: FilterProps) {
  const [isFilterShow, setFilterShow] = useState(false);
  const [filters, setFilters] = useState({
    products: [],
    brands: [],
    categories: [],
    price: {
      min: 0,
      max: 0,
    },
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const productsOptions = useMemo(
    () => [...new Set([...products.products.map((data) => data.title)])],
    [products.products]
  );

  const brandsOptions = useMemo(
    () => [...new Set([...products.products.map((data) => data.brand)])],
    [products.products]
  );

  const categoriesOptions = useMemo(
    () => [...new Set([...products.products.map((data) => data.category)])],
    [products.products]
  );

  const filter = useMemo(
    () => [
      {
        name: "products",
        options: productsOptions,
      },
      {
        name: "brands",
        options: brandsOptions,
      },
      {
        name: "categories",
        options: categoriesOptions,
      },
    ],
    [brandsOptions, categoriesOptions, productsOptions]
  );

  return (
    <>
      <Button
        variants="info"
        types="outline"
        className="flex gap-2"
        onClick={() => setFilterShow(true)}
      >
        <p>Filter</p>
        <AiFillFilter />
      </Button>
      <Modal
        isOpen={isFilterShow}
        onAfterOpen={() => setFilterShow(true)}
        onRequestClose={() => setFilterShow(false)}
        contentLabel="Example Modal"
      >
        <header className="flex justify-between items-center">
          <h3 className="text-xl mb-4 font-bold">Filter</h3>
          <AiOutlineCloseCircle
            className="w-6 h-6 text-info-400 cursor-pointer hover:text-primary-500"
            onClick={() => setFilterShow(false)}
          />
        </header>
        <div className="flex gap-8">
          {filter.map((data, index) => (
            <section key={index}>
              <h4 className="capitalize text-info-500">{data.name}</h4>
              <div className="grid grid-cols-2 gap-4 border-t pt-2 mt-2">
                {data.options.map((opt) => {
                  const id = opt.toLowerCase().replaceAll(" ", "-");

                  return (
                    <div className="flex items-center gap-2" key={id}>
                      <input
                        type="checkbox"
                        id={id}
                        name={id}
                        className="cursor-pointer"
                        onChange={() => {
                          // TODO: ADD CHECKLIST TO FILTER
                        }}
                      />
                      <label className="cursor-pointer" htmlFor={id}>
                        {opt}
                      </label>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
          <section>
            <h4 className="capitalize text-info-500">Price</h4>
            <div className="flex items-center gap-2 border-t pt-2 mt-2">
              <Input
                placeholder="Min Price ($0)"
                onChange={() => {
                  // TODO: ADD TO FILTER
                }}
              />
              {"-"}
              <Input
                placeholder={`Max Price ($${
                  products.products.sort().reverse().pop()?.price
                })`}
                onChange={() => {
                  // TODO: ADD TO FILTER
                }}
              />
            </div>
          </section>
        </div>
      </Modal>
    </>
  );
}
// #endregion FILTER MODAL

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

  const [brandFilter, setBrandFilter] = useState("");
  const [titleFilter, setTitleFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const data: Product[] = useMemo(
    () => productsResponse?.products ?? [],
    [productsResponse]
  );
  const columns = useMemo(
    () =>
      [
        {
          accessor: "title",
          Header: "title",
        },
        {
          accessor: "brand",
          Header: "brand",
        },
        {
          accessor: "price",
          Header: "price",
        },
        {
          accessor: "stock",
          Header: "stock",
        },
        {
          accessor: "category",
          Header: "category",
        },
      ] satisfies Column<Product>[],
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
            <Filter
              products={productsResponse}
              onFilterChange={(data) => {
                // TODO: ADD TO FILTER STATE
              }}
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
          <Table
            columns={columns}
            data={data}
            isLoading={false}
            filterColumns={[
              { id: "brand", value: brandFilter },
              { id: "title", value: titleFilter },
              { id: "price", value: priceFilter },
              { id: "category", value: categoryFilter },
            ]}
          />
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
