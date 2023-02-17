import { env } from "@/config/Environment.config";

const withBase = (path: string) => `${env.baseApiUrl}${path}`;

export const Endpoints = {
  AUTH_LOGIN: withBase("/auth/login"),
  GET_PRODUCTS: withBase("/products"),
  GET_CARTS: withBase("/carts"),
  GET_CART_DETAIL: withBase("/carts/:id"),
} as const;

export const AppRouter = {
  HOME: "/",
  LOGIN: "/login",
  PRODUCTS: "/products",
  CARTS: "/carts",
  CART_DETAIL: "/carts/:id",
} as const;
