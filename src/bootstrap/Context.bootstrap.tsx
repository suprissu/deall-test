import { SessionProvider } from "@/context";
import React from "react";

export default function ContextBootstrap({
  children,
}: React.PropsWithChildren) {
  return <SessionProvider>{children}</SessionProvider>;
}
