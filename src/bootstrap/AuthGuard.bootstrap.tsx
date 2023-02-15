// #region IMPORTS
import { AppRouter } from "@/domains/Endpoints.domains";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
// #endregion IMPORTS

// #region PROPS
type AuthGuardBootstrapProps = {
  guard?: boolean;
  portal?: boolean;
};
// #endregion PROPS

// #region MAIN COMPONENT
export default function AuthGuardBootstrap({
  children,
  guard,
  portal,
}: React.PropsWithChildren<AuthGuardBootstrapProps>) {
  const router = useRouter();
  const isAuthenticated = false;

  useEffect(() => {
    if (portal && isAuthenticated) router.push(AppRouter.PRODUCTS);
    else if (guard && !isAuthenticated) {
      router.push(AppRouter.LOGIN);
    }
  }, [guard, isAuthenticated, portal, router]);

  return <>{children}</>;
}
// #endregion MAIN COMPONENT
