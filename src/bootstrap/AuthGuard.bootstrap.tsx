// #region IMPORTS
import { useSession } from "@/context/Session.context";
import { AppRouter } from "@/domains/Endpoints.domains";
import { LoginResponse } from "@/domains/Types.domains";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
// #endregion IMPORTS

// #region PROPS
type AuthGuardBootstrapProps = {
  guard?: boolean;
  portal?: boolean;
};
// #endregion PROPS

export const withAuthGuard = (
  context: GetServerSidePropsContext,
  fn: GetServerSideProps
) => {
  const { req } = context;
  const cSession = req.cookies["_session"];
  const session = cSession
    ? (JSON.parse(cSession) as LoginResponse)
    : undefined;

  if (!session) {
    return {
      redirect: {
        permanent: true,
        destination: AppRouter.LOGIN,
      },
    };
  }

  return fn(context);
};

// #region MAIN COMPONENT
export default function AuthGuardBootstrap({
  children,
  guard,
  portal,
}: React.PropsWithChildren<AuthGuardBootstrapProps>) {
  const { session } = useSession();
  const router = useRouter();
  const isAuthenticated = Boolean(session?.token);

  useEffect(() => {
    if (portal && isAuthenticated) router.push(AppRouter.PRODUCTS);
    else if (guard && !isAuthenticated) {
      router.push(AppRouter.LOGIN);
    }
  }, [guard, isAuthenticated, portal, router]);

  if (guard && !isAuthenticated) return null;

  return <>{children}</>;
}
// #endregion MAIN COMPONENT
