// #region IMPORTS
import AuthGuardBootstrap from "@/bootstrap/AuthGuard.bootstrap";
import { Loader } from "@/components/atoms";
import { env } from "@/config/Environment.config";
import Head from "next/head";
import { Router } from "next/router";
import React, { useEffect, useState } from "react";
// #endregion IMPORTS

// #region PROPS
type MainTemplateProps = {
  title: string;
  description?: string;
  guard?: boolean;
  portal?: boolean;
};
// #endregion PROPS

// #region MAIN COMPONENT
export default function MainTemplate({
  children,
  title,
  description,
  guard,
  portal,
}: React.PropsWithChildren<MainTemplateProps>) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Used for page transition
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  return (
    <AuthGuardBootstrap guard={guard} portal={portal}>
      <Head>
        <title>{title ? `${title} | ${env.appName}` : env.appName}</title>
        <meta name="description" content={description || env.appDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading && <Loader />}
      {children}
    </AuthGuardBootstrap>
  );
}
// #endregion MAIN COMPONENT
