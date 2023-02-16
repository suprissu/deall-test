import React from "react";
import { Column } from "react-table";

// STYLED COMPONENT
const tableCellLoadingStyle = `animate-pulse w-full h-3 bg-primary-500`;

// TYPES
type LoadingSkeletonTableProps = {
  columns: Column<Record<string, unknown>>[];
};

//#region MAIN COMPONENT
const LoadingSkeletonTable: React.FC<LoadingSkeletonTableProps> = ({
  columns,
}) => {
  return (
    <React.Fragment>
      {new Array(10).fill(null).map((data, idx) => (
        <tr key={idx} className="border-b-[1px]">
          {columns.map((data, index) => (
            <td key={index} className="py-6 px-2">
              <div className={tableCellLoadingStyle} />
            </td>
          ))}
        </tr>
      ))}
    </React.Fragment>
  );
};
//#endregion

export default LoadingSkeletonTable;
