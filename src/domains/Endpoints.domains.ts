import { env } from "@/config/Environment.config";

const withBase = (path: string) => `${env.baseApiUrl}${path}`;

export const Endpoints = {
  GET_PRODUCTS: withBase("/products"),
} as const;