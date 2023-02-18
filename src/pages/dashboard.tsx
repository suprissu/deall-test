// #region IMPORTS
import { withAuthGuard } from "@/bootstrap/AuthGuard.bootstrap";
import { DashboardTemplate } from "@/components/templates";
import { AppRouter, Endpoints } from "@/domains/Endpoints.domains";
import { ProductResponse } from "@/domains/Types.domains";
import axios from "axios";
import { GetServerSideProps } from "next";
import { Chart as ChartJS, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
// #endregion IMPORTS

// #region PROPS
ChartJS.register(...registerables);
type ProductsResponseType = {
  data: ProductResponse | null;
};
type DashboardProps = {
  brandChartData: Record<string, number>;
};
// #endregion PROPS

export const getServerSideProps: GetServerSideProps = async (context) => {
  return withAuthGuard(context, async ({ res }) => {
    const { data }: ProductsResponseType = await axios
      .get(Endpoints.GET_PRODUCTS)
      .catch(() => {
        return { data: null };
      });

    if (res) {
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=10, stale-while-revalidate=59"
      );
    }

    const brandChartData = data
      ? data.products.reduce(function (res, value) {
          if (!res[value.brand]) {
            res[value.brand] = 0;
          }
          res[value.brand] += value.stock;
          return res;
        }, {} as Record<string, number>)
      : null;

    return {
      props: {
        brandChartData,
      },
    };
  });
};

// #region MAIN COMPONENT
export default function Dashboard({ brandChartData }: DashboardProps) {
  const data = {
    labels: Object.keys(brandChartData),
    datasets: [
      {
        label: "# of Items per Brands",
        data: Object.values(brandChartData),
        borderWidth: 1,
      },
    ],
  };

  return (
    <DashboardTemplate title={AppRouter.DASHBOARD.name}>
      <div className="w-full h-full flex flex-col">
        <h1 className="text-xl font-bold m-4">{AppRouter.DASHBOARD.name}</h1>
        <div className="flex-1 bg-white p-4 rounded-md w-full flex flex-col overflow-auto">
          <Bar
            data={data}
            width={320}
            height={120}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </div>
    </DashboardTemplate>
  );
}
// #endregion MAIN COMPONENT
