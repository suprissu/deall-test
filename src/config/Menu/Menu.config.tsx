// #region IMPORTS
import { AppRouter } from "@/domains/Endpoints.domains";
import { Role } from "@/domains/Types.domains";
import React from "react";
import { AiOutlineShoppingCart, AiTwotoneShop } from "react-icons/ai";
// #endregion IMPORTS

// #region STYLED COMPONENTS
const baseIconStyle = "w-6 h-6";
// #region STYLED COMPONENTS

// #region PROPS
export type SidebarMenuProps = {
  icon?: React.ReactNode;
  name: string;
  path: string;
  access: Set<Role>;
  childs?: Array<SidebarMenuProps>;
};
// #endregion PROPS

const access: Record<string, Set<Role>> = {
  [AppRouter.HOME.path]: new Set([Role.ADMIN, Role.CLIENT]),
  [AppRouter.PRODUCTS.path]: new Set([Role.ADMIN, Role.CLIENT]),
  [AppRouter.CARTS.path]: new Set([Role.ADMIN]),
};

export const sidebar: Record<string, SidebarMenuProps> = {
  [AppRouter.PRODUCTS.path]: {
    ...AppRouter.PRODUCTS,
    icon: <AiTwotoneShop className={baseIconStyle} />,
    access: access[AppRouter.PRODUCTS.path],
  },
  [AppRouter.CARTS.path]: {
    ...AppRouter.CARTS,
    icon: <AiOutlineShoppingCart className={baseIconStyle} />,
    access: access[AppRouter.CARTS.path],
  },
};
