import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TrafficChart = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [labels, setLabels] = useState([]);

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }
    return days;
  };

  useEffect(() => {
    const last7Days = getLast7Days();
    setLabels(last7Days);

    const storedVisits = JSON.parse(localStorage.getItem("visits") || "{}");
    const weeklyCounts = last7Days.map((day) => storedVisits[day] || 0);
    setWeeklyData(weeklyCounts);
  }, []);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Website Visitors",
        data: weeklyData,
        fill: false,
        borderColor: "#1976d2",
        backgroundColor: "#1976d2",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Weekly Website Traffic",
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default TrafficChart;
