// #region IMPORTS
import { env } from "@/config/Environment.config";
import Head from "next/head";
import React from "react";
// #endregion IMPORTS

// #region PROPS
type MainTemplateProps = {
  title: string;
  description?: string;
};
// #endregion PROPS

// #region MAIN COMPONENT
export default function MainTemplate({
  children,
  title,
  description,
}: React.PropsWithChildren<MainTemplateProps>) {
  return (
    <>
      <Head>
        <title>{title ? `${title} | ${env.appName}` : env.appName}</title>
        <meta name="description" content={description || env.appDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </>
  );
}
// #endregion MAIN COMPONENT
