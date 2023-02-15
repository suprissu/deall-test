import { env } from "@/config/Environment.config";

const withBase = (path: string) => `${env.baseApiUrl}${path}`;

export const Endpoints = {
  AUTH_LOGIN: withBase("/auth/login"),
  GET_PRODUCTS: withBase("/products"),
  GET_CARTS: withBase("/carts/user/:id"),
} as const;

export const AppRouter = {
  LOGIN: "/login",
  PRODUCTS: "/products",
  CARTS: "/carts",
} as const;
