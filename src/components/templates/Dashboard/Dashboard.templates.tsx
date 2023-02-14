// #region IMPORTS
import { MainTemplate } from "@/components/templates";
import React from "react";
// #endregion IMPORTS

// #region PROPS
type DashboardTemplateProps = {
  title: string;
  description?: string;
};
// #endregion PROPS

// #region MAIN COMPONENT
export default function DashboardTemplate({
  children,
  title,
  description,
}: React.PropsWithChildren<DashboardTemplateProps>) {
  return (
    <MainTemplate title={title} description={description}>
      {children}
    </MainTemplate>
  );
}
// #endregion MAIN COMPONENT
