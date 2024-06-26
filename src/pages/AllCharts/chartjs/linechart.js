import React from "react"
import { Line } from "react-chartjs-2"

const LineChart = () => {
  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
    ],
    datasets: [
      {
        label: "Sales Analytics",
        fill: !0,
        lineTension: 0.5,
        backgroundColor: "rgba(91, 140, 232, 0.2)",
        borderColor: "#285a3d",
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: "#285a3d",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#285a3d",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [65, 59, 80, 81, 56, 55, 40, 55, 30, 80]
      },
      {
        label: "Monthly Earnings",
        fill: !0,
        lineTension: 0.5,
        backgroundColor: "rgba(235, 239, 242, 0.2)",
        borderColor: "#ebeff2",
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: "#ebeff2",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#ebeff2",
        pointHoverBorderColor: "#eef0f2",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [80, 23, 56, 65, 23, 35, 85, 25, 92, 36]
      }
    ]
  }
  var option = {
    scales: {
      yAxes: [{
        ticks: {
          max: 100,
          min: 20,
          stepSize: 10
        }
      }]
    },
  }

  return <Line width={474} height={300} data={data} options={option} />
}

export default LineChart
