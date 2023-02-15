// #region IMPORTS
import { Sidebar } from "@/components/organisms";
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
    <MainTemplate title={title} description={description} guard>
      <div className="flex">
        <Sidebar />
        <main className="p-4 flex-1 bg-info-100">{children}</main>
      </div>
    </MainTemplate>
  );
}
// #endregion MAIN COMPONENT
