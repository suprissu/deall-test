// #region IMPORTS
import { withAuthGuard } from "@/bootstrap/AuthGuard.bootstrap";
import { Button, Table } from "@/components/atoms";
import { DashboardTemplate } from "@/components/templates";
import { AppRouter, Endpoints } from "@/domains/Endpoints.domains";
import { Cart, CartsResponse } from "@/domains/Types.domains";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
import { CellProps, Column } from "react-table";
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
  const router = useRouter();
  const data: Cart[] = useMemo(
    () => cartsResponse?.carts ?? [],
    [cartsResponse]
  );
  const columns = useMemo(
    () =>
      [
        {
          accessor: "id",
          Header: "Id",
        },
        {
          accessor: "userId",
          Header: "User Id",
        },
        {
          accessor: "totalProducts",
          Header: "Total Products",
        },
        {
          accessor: "totalQuantity",
          Header: "Total Quantity",
        },
        {
          accessor: "total",
          Header: "Total Price",
          Cell(props: CellProps<Cart>) {
            return <>{`$${props.value}`}</>;
          },
        },
        {
          accessor: "products",
          Header: "Action",
          Cell(props: CellProps<Cart>) {
            return (
              <Button
                variants="info"
                onClick={() =>
                  router.push(
                    AppRouter.CART_DETAIL.path.replace(
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
      ] satisfies Column<Cart>[],
    [router]
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
          <Table columns={columns} data={data} isLoading={false} />
        </div>
      </div>
    </DashboardTemplate>
  );
}
// #endregion MAIN COMPONENT
