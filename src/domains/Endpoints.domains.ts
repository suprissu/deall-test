import { env } from "@/config/Environment.config";

const withBase = (path: string) => `${env.baseApiUrl}${path}`;

export const Endpoints = {
  AUTH_LOGIN: withBase("/auth/login"),
  GET_PRODUCTS: withBase("/products"),
  GET_CARTS: withBase("/carts"),
  GET_CART_DETAIL: withBase("/carts/:id"),
  USERS: withBase("/users"),
} as const;

export const AppRouter = {
  HOME: { name: "Home", path: "/" },
  DASHBOARD: { name: "Dashboard", path: "/dashboard" },
  LOGIN: { name: "Login", path: "/login" },
  PRODUCTS: { name: "Products", path: "/products" },
  CARTS: { name: "Carts", path: "/carts" },
  CART_DETAIL: { name: "Cart Detail", path: "/carts/:id" },
} as const;
