import React from "react";
import { Bar } from "react-chartjs-2";
import Box from "../components/box/Box";
import DashboardWrapper, {
  DashboardWrapperMain,
  DashboardWrapperRight,
} from "../components/dashboard-wrapper/DashboardWrapper";
import SummaryBox, {
  SummaryBoxSpecial,
} from "../components/summary-box/SummaryBox";
import { colors, data } from "../constants";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import OverallList from "../components/overall-list/OverallList";
import RevenueList from "../components/revenue-list/RevenueList";
import { Button, Stack } from "@mui/material";
import { MandiListing } from "./mandi/MandiListing";
import { ItemListing } from "./listing/ItemListing";
import { useFireStore } from "../hooks";
import { collections } from "../firebase/collections";
import { listTableHeaders, mandiTableHeaders } from "../constants/metaData";
import { getFirstElements } from "../utils/helper";
import Banner from "../components/dashboard/Banner";
import Card from "../components/dashboard/Cards";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { data, isFetching } = useFireStore(collections.commodities);
  const { data: listingData, isFetching: isLoading } = useFireStore(
    collections.orders
  );

  const onUploadBanner = () => {};

  return (
    <DashboardWrapper>
      <DashboardWrapperMain>
        <div className="row" style={{ marginTop: "34px" }}>
          <Stack gap={12} sx={{ w: "100%" }}>
            <Card />
            {/* <h2 style={{ marginBottom: "-58px" }}>Mandi Update</h2>
            <hr style={{ marginBottom: "-47px" }}></hr>
            <MandiListing
              data={data && data.length > 0 ? getFirstElements(data, 10) : []}
              headingItems={mandiTableHeaders}
              isLoading={isFetching}
              isCheckBox={false}
            /> */}
            <h2 style={{ marginBottom: "-60px" }}>Orders</h2>
            <hr style={{ marginBottom: "-47px" }}></hr>
            <ItemListing
              data={
                listingData && listingData.length > 0
                  ? getFirstElements(listingData, 5)
                  : []
              }
              headingItems={listTableHeaders}
              isLoading={isLoading}
              isCheckBox={false}
            />
            <h2 style={{ marginBottom: "-58px" }}>Home Page Sliders</h2>
            <hr style={{ marginBottom: "-47px" }}></hr>
            <Banner />
          </Stack>
        </div>
        {/* <div className="row">
          <div className="col-12">
            <Box>
              <RevenueByMonthsChart />
            </Box>
          </div>
        </div> */}
      </DashboardWrapperMain>
      {/* <DashboardWrapperRight>
        <div className="title mb">Overall</div>
        <div className="mb">
          <OverallList />
        </div>
      </DashboardWrapperRight> */}
    </DashboardWrapper>
  );
};

export default Dashboard;

const RevenueByMonthsChart = () => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: {
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      yAxes: {
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    elements: {
      bar: {
        backgroundColor: colors.purple,
        borderRadius: 20,
        borderSkipped: "bottom",
      },
    },
  };

  const chartData = {
    labels: data.revenueByMonths.labels,
    datasets: [
      {
        label: "Revenue",
        data: data.revenueByMonths.data,
      },
    ],
  };
  return (
    <>
      {/* <div className="title mb">
                Revenue by months
            </div>
            <div>
                <Bar options={chartOptions} data={chartData} height={`300px`} />
            </div> */}
    </>
  );
};
