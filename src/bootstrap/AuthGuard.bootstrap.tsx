// #region IMPORTS
import Menu from "@/config/Menu";
import { useSession } from "@/context/Session.context";
import RoleCode from "@/data/RoleCode.data";
import { AppRouter } from "@/domains/Endpoints.domains";
import { LoginResponse, Role } from "@/domains/Types.domains";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
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
        destination: AppRouter.LOGIN.path,
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
  const userRoleCode = useMemo(
    () => (session ? RoleCode[session?.username] : Role.GUEST),
    [session]
  );

  useEffect(() => {
    if (
      (portal || router.pathname === AppRouter.HOME.path) &&
      isAuthenticated
    ) {
      const path = Object.entries(Menu.sidebar).find((data) =>
        data[1].access.has(userRoleCode)
      )?.[0];
      console.log(path);
      router.push(path ?? AppRouter.PRODUCTS.path);
    } else if (guard && !isAuthenticated) {
      router.push(AppRouter.LOGIN.path);
    }
  }, [guard, isAuthenticated, portal, router, userRoleCode]);

  if (guard && !isAuthenticated) return null;

  return <>{children}</>;
}
// #endregion MAIN COMPONENT
