import React from "react"
import { Pie } from "react-chartjs-2"

const PieChart = () => {
  const data = {
    labels: ["Desktops", "Tablets"],
    datasets: [
      {
        data: [300, 180],
        backgroundColor: ["#EFFFF0", "#ebeff2"],
        hoverBackgroundColor: ["#EFFFF0", "#ebeff2"],
        hoverBorderColor: "#fff",
      },
    ],
  }

  return <Pie width={474} height={260} data={data} />
}

export default PieChart
