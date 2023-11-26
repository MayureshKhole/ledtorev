import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

function PieChart({ filteredData }) {
  const chartRef = useRef(null);
  const myChart = useRef(null);
  const [data, setData] = useState(null);
  const [cases, recoveries, deaths] = filteredData;
  const [jsonData, setJsonData] = useState({
    cases: 0,
    recoveries: 0,
    deaths: 0,
  }); // Add this line

  useEffect(() => {
    setJsonData({ cases, recoveries, deaths });
  }, [cases]);

  useEffect(() => {
    if (jsonData) {
      const chartDataR = {
        labels: Object.keys(jsonData),
        datasets: [
          {
            data: Object.values(jsonData),
            backgroundColor: [
              "rgba(54, 162, 235, 1)", // Blue for cases
              "rgba(75, 192, 192, 1)", // Green for recoveries
              "rgba(255, 99, 132, 1)", // Red for deaths
            ],
            borderColor: [
              "rgba(54, 162, 235, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(255, 99, 132, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };

      setData(chartDataR);
    }
  }, [jsonData]);

  useEffect(() => {
    if (data && chartRef.current) {
      if (myChart.current) {
        myChart.current.destroy();
      }
      myChart.current = new Chart(chartRef.current, {
        type: "doughnut",
        data: data,
        plugins: [ChartDataLabels],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "bottom",
              labels: {
                font: {
                  family: "Poppins",
                  size: 12, // Set the font size for legend labels
                },
                padding: 10, // Set the padding between legend labels
                borderRadius: 20, // Set the corner radius for legend labels
                boxWidth: 12, // Set the box width for legend labels
              },
            },
            datalabels: {
              color: "#000",
              font: {
                family: "Poppins",
                weight: "bold",
              },
              formatter: (value, context) => {
                const label = context.chart.data.labels[context.dataIndex];
                return `${label}: ${value}`;
              },
              anchor: "end",
              align: "end",
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
      <h6 style={{ paddingBottom: "20px" }}>Pie Chart</h6>
      <canvas ref={chartRef} />
    </div>
  );
}

// ... (export statement)

export default PieChart;
