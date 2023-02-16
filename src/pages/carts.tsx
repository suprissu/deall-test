// #region IMPORTS
import { withAuthGuard } from "@/bootstrap/AuthGuard.bootstrap";
import { Table } from "@/components/atoms";
import { DashboardTemplate } from "@/components/templates";
import { AppRouter, Endpoints } from "@/domains/Endpoints.domains";
import {
  Cart,
  CartsResponse,
  LoginResponse,
  Product,
} from "@/domains/Types.domains";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { GetServerSideProps } from "next";
import React, { useEffect, useMemo, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { useToggle } from "usehooks-ts";
// #endregion IMPORTS

export const getServerSideProps: GetServerSideProps = async (context) => {
  return withAuthGuard(context, async () => {
    const { res } = context;

    const { data } = await axios.get(Endpoints.GET_CARTS).catch((e) => {
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
  });
};

// #region PROPS
type CartsProps = {
  carts: CartsResponse;
};

type CartProps = {
  cart: Cart;
};
// #endregion PROPS

function Cart({ cart }: CartProps) {
  const [isCollapse, toggleCollapse] = useToggle(true);

  return (
    <div className="flex flex-col gap-2">
      <button className="w-full bg-info-100 p-4" onClick={toggleCollapse}>
        <div className="flex justify-between">
          <p>#{cart.id}</p>
          <div>{isCollapse ? <BsChevronDown /> : <BsChevronUp />}</div>
        </div>
        <div>
          <p>{}</p>
        </div>
      </button>
      {!isCollapse && (
        <div className="p-2">
          {cart.products.map((data, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-y p-4 cursor-pointer hover:bg-info-100"
            >
              <div className="flex gap-2">
                <p>{data.title}</p>
                <p className="text-info-400">x{data.quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="bg-error-500 text-white rounded-md px-1 text-sm">
                  {data.discountPercentage}%
                </p>
                <p className="line-through text-info-400">${data.total}</p>
                <p className="font-bold text-lg">${data.discountedPrice}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// #region MAIN COMPONENT
export default function Carts({ carts: cartsResponse }: CartsProps) {
  const carts: Cart[] = useMemo(
    () => cartsResponse?.carts ?? [],
    [cartsResponse]
  );

  return (
    <DashboardTemplate title="Carts">
      <div className="w-full h-full flex flex-col">
        <h1 className="text-xl font-bold m-4">Carts</h1>
        <div className="flex-1 bg-white p-4 rounded-md w-full overflow-auto flex flex-col gap-2">
          {carts.map((data, index) => (
            <Cart key={index} cart={data} />
          ))}
        </div>
      </div>
    </DashboardTemplate>
  );
}
// #endregion MAIN COMPONENT
