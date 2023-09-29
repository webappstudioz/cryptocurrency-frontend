import React from "react"
import { Radar } from "react-chartjs-2"

const RadarChart = () => {
  const data = {
    labels: [
      "Eating",
      "Drinking",
      "Sleeping",
      "Designing",
      "Coding",
      "Cycling",
      "Running",
    ],
    datasets: [
      {
        label: "Desktops",
        backgroundColor: "rgba(52, 195, 143, 0.2)",
        borderColor: "#EFFFF0",
        pointBackgroundColor: "#EFFFF0",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#EFFFF0",
        data: [65, 59, 90, 81, 56, 55, 40],
      },
      {
        label: "Tablets",
        backgroundColor: "rgba(85, 110, 230, 0.2)",
        borderColor: "#556ee6",
        pointBackgroundColor: "#556ee6",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#556ee6",
        data: [28, 48, 40, 19, 96, 27, 100],
      },
    ],
  }

  return <Radar width={474} height={300} data={data} />
}

export default RadarChart
