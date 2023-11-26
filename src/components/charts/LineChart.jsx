import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

import { useSelector } from "react-redux";

import ChartDataLabels from "chartjs-plugin-datalabels";

function LineChart({ filteredData }) {
  const countryInfo = useSelector((state) => state.dashboard.countryInfo);

  const chartRef = useRef(null);
  const myChart = useRef(null);
  const [data, setData] = useState(null);
  const [cases, recoveries, deaths] = filteredData;

  const [casesData, setCasesData] = useState({
    2019: 0,
    2020: 0,
    2021: 0,
    2022: 0,
    2023: 0,
  });
  const [recoveriesData, setRecoveriesData] = useState({
    2019: 0,
    2020: 0,
    2021: 0,
    2022: 0,
    2023: 0,
  });

  const [deathsData, setDeathsData] = useState({
    2019: 0,
    2020: 0,
    2021: 0,
    2022: 0,
    2023: 0,
  });
  useEffect(() => {
    const casesObject = {};
    const recoveriesObject = {};
    const deathsObject = {};
    for (const date in cases) {
      const year = date.split("/")[2];
      casesObject[year] = (casesObject[year] || 0) + cases[date];
    }
    for (const date in recoveries) {
      const year = date.split("/")[2];
      recoveriesObject[year] = (recoveriesObject[year] || 0) + recoveries[date];
    }
    for (const date in deaths) {
      const year = date.split("/")[2];
      deathsObject[year] = (deathsObject[year] || 0) + deaths[date];
    }
    setCasesData(casesObject);
    setRecoveriesData(recoveriesObject);
    setDeathsData(deathsObject);
  }, [cases]);
  useEffect(() => {
    async function fetchData() {
      try {
        if (casesData) {
          const chartDataR = {
            labels: Object.keys(casesData),
            plugins: [ChartDataLabels],
            datasets: [
              {
                label: "Cases",
                data: Object.values(casesData),
                backgroundColor: "rgba(54, 162, 235, 1)", // Blue
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                fill: false,
              },
              {
                label: "Recoveries",
                data: Object.values(recoveriesData), // Assuming you have a recoveriesData state similar to casesData
                backgroundColor: "rgba(75, 192, 192, 1)", // Green
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                fill: false,
              },
              {
                label: "Deaths",
                data: Object.values(deathsData), // Assuming you have a deathsData state similar to casesData
                backgroundColor: "rgba(255, 99, 132,1)", // Red
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
                fill: false,
              },
            ],
          };

          setData(chartDataR);
        } else {
          // Handle the case where jsonData is undefined
          console.error("casesData is undefined");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [casesData]);

  useEffect(() => {
    if (data && chartRef.current) {
      // Create and render the pie chart using useRef
      if (myChart.current) {
        myChart.current.destroy();
      }
      myChart.current = new Chart(chartRef.current, {
        type: "line",
        data: data,
        plugins: [ChartDataLabels],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false, // Set to false to hide the x-axis gridlines
              },
            },
            y: {
              grid: {
                display: false, // Set to false to hide the y-axis gridlines
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            datalabels: {
              color: "black", // You can customize the label color here
              font: {
                family: "Poppins",
                weight: "bold",
              },
              formatter: (value, context) => {
                return value; // Customize the label format as needed
              },
              anchor: "end",

              align: "end",
              offset: 4, // Adjust the label position
            },
          },
        },
      });
    }

    return () => {
      if (myChart.current) {
        myChart.current.destroy();
      }
    };
  }, [data]);

  return (
    <div style={{ width: "90%", height: "400px", margin: "20px" }}>
      <h6 style={{ paddingBottom: "20px" }}>Line Chart</h6>
      <canvas ref={chartRef} />
    </div>
  );
}

export default LineChart;
