import React, { useEffect, useState } from "react"
import ReactApexChart from "react-apexcharts"
import { deviceDetails } from "../../Authentication/store/apiServices"
import { toast } from "react-toastify"
import DatePicker from "react-datepicker"
import { useParams } from "react-router-dom"
import "react-datepicker/dist/react-datepicker.css"
import TextLoader from "../../../components/textLoader"
const BandwidthChart = ({ bandwidthChartData, product } = props) => {
  const [udata, setudata] = useState([])
  const [ddata, setddata] = useState([])
  const [dates, setdates] = useState([])
  const [refresh, setrefresh] = useState(false)
  const [unit, setunit] = useState("")
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [toDate, settoDate] = useState(new Date())
  const [comparetoDate, setcomparetoDate] = useState("")
  const [comparefromDate, setcomparefromDate] = useState("")
  const [registrationDate, setRegistrationDate] = useState()
  const [spinner, setSpinner] = useState(false)
  const [loading, setLoading] = useState("")
  const params = useParams()

  useEffect(() => {
    if(product?.regdate){
      let formattedDate = new Date(product?.regdate)
      setRegistrationDate(formattedDate)
      startDate < formattedDate? setStartDate(formattedDate) : null
    }
  },[product])

  function formatBytes(size, transfer = false) {
    if (size == 0) {
      return "0 B"
    }
    const base = Math.log(size) / Math.log(1000)
    let suffixes = ["B", "KB", "MB", "GB", "TB"]
    if (transfer) {
      suffixes = ["bps", "Kbps", "Mbps", "Gbps", "Tbps"]
    }
    return (
      parseFloat(Math.pow(1000, base - Math.floor(base))).toFixed(2) +
      " " +
      suffixes[Math.floor(base)]
    )
  }

  let series = [
    {
      name: "Incoming",
      data: ddata || [],
      color: "#2d2e86",
      borderColor: "#6062f9",
    },
    {
      name: "Outgoing",
      data: udata || [],
      color: "#5685c4",
      borderColor: "#AFB1FC",
    },
  ]

  const options = {
    chart: {
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    xaxis: {
      labels: {
        rotate: -45,
        rotateAlways: true,
      },
      categories:
        //
        dates?.dates,
      tickPlacement: "on",
    },
    yaxis: {
      show: true,
      labels: {
        show: true,
        formatter: function (value, timestamp, opts) {
          return formatBytes(value, true)
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      floating: true,
      fontSize: 16,
      offsetY: -5,
      borderRadius: 10,
      borderWidth: 3,
      background: "#fff",
      markers: {
        width: 8,
        height: 8,
        strokeWidth: "3px",
        strokeColor: ["#2d2e86", "#5685c4"],
        fillColors: ["#6062f9", "#AFB1FC"],
        radius: 8,
        offsetX: 0,
        offsetY: 0,
      },
    },
    fill: {
      opacity: 1,
    },
  }

  useEffect(async () => {
    // comparisonvalid(startDate, toDate)
    GraphData(bandwidthChartData)
  }, [bandwidthChartData])

  // const comparisonvalid = (s, t) => {
  //   let day = (s?.getDate() < 10 ? "0" : "") + s?.getDate()
  //   let month = (s?.getMonth() + 1 < 10 ? "0" : "") + (s?.getMonth() + 1)
  //   let year = s?.getFullYear()
  //   let from = year + "-" + month + "-" + day

  //   setcomparefromDate(from)

  //   let day1 = (t?.getDate() < 10 ? "0" : "") + t?.getDate()
  //   let month1 = (t?.getMonth() + 1 < 10 ? "0" : "") + (t?.getMonth() + 1)
  //   let year1 = t?.getFullYear()
  //   let to = year1 + "-" + month1 + "-" + day1
  //   setcomparetoDate(to)
  // }

  const GraphData = async (data) => {
    setddata(data?.down)
    setudata(data?.up)
    setdates(data)
    setunit(data?.unit)
    setrefresh(true)
    // return
    // let result = params.id
    // setSpinner(true)
    // setLoading(true)
    // try {
    //   let param = new URLSearchParams({
    //     service_id: result,
    //     action: "bandwidth",
    //   })

    //   let res = await getBandwidthDetails(param)
    //   if (res) {
    //     setSpinner(false)
    //     setLoading(false)
    //     setddata(res?.data?.data?.data?.down)
    //     setudata(res?.data?.data?.data?.up)
    //     setdates(res?.data?.data?.data)
    //     setunit(res?.data?.data?.data?.unit)
    //     setTimeout(() => {
    //       // props?.setchartLoader(false)
    //       // props?.setLoading(false)
    //     }, 1000)
    //   }
    // } catch (error) {
    //   setSpinner(false)
    //   setLoading(false)
    // props?.setLoading(false)
    // props?.setchartLoader(false)
    // }
    // setrefresh(true)
  }

  const FilterGraphData = async () => {
    let result = params.id
    try {
      let day = (startDate?.getDate() < 10 ? "0" : "") + startDate?.getDate()
      let month = (startDate?.getMonth() + 1 < 10 ? "0" : "") + (startDate?.getMonth() + 1)
      let year = startDate?.getFullYear()
      let from = year + "-" + month + "-" + day
      // setcomparefromDate(from)

      let day1 = (toDate?.getDate() < 10 ? "0" : "") + toDate?.getDate()
      let month1 =(toDate?.getMonth() + 1 < 10 ? "0" : "") + (toDate?.getMonth() + 1)
      let year1 = toDate?.getFullYear()
      let to = year1 + "-" + month1 + "-" + day1
      // setcomparetoDate(to)
      if(from > to || from == to){
        toast.error("To date must be greater than From date", {
          position: toast.POSITION.TOP_RIGHT,
        })
      }else {
        let param = new URLSearchParams({
          service_id: result,
          action: "bandwidth",
          from: from,
          to: to,
        })
        setSpinner(true)
        setLoading(true)
        let res = await deviceDetails(param)

        if (res) {
          setSpinner(false)
          setLoading(false)
          setddata(res?.data?.data?.data?.down)
          setudata(res?.data?.data?.data?.up)
          setdates(res?.data?.data?.data)
          setunit(res?.data?.data?.data?.unit)
        }
      }  
    } catch (error) {
      setSpinner(false)
      setLoading(false)
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
    }

    // try {
    //   let param = new URLSearchParams({
    //     service_id: result,
    //     action: "bandwidth-avg",
    //   })
    //   let res = await deviceDetails(param)
    // if (res) {
    //   props?.avg(res?.data?.data?.data)
    // }
    // } catch (err) {}

    // try {
    //   let params = new URLSearchParams({
    //     service_id: result,
    //     action: "bandwidth-95",
    //   })
    //   let response = await deviceDetails(params)
    // if (response) {
    //   props?.ninefive(response?.data?.data?.data)
    // }
    // } catch (err) {}
    setrefresh(true)
  }

  return (
    <div>
      {refresh && (
        <div
          className="chartfilter"
        // className={loader ? "chartfilter overlayerloader" : "chartfilter"}
        >
          <span>
            <p className="datelabel">From</p>
            <DatePicker
              selected={startDate > registrationDate? startDate : registrationDate}
              onChange={date => {
                setStartDate(date)
                // comparisonvalid(date, toDate)
              }}
              minDate={registrationDate}
              maxDate={new Date()}
              dateFormat={"yyyy/MM/dd"}
            />
          </span>
          <span>
            <p className="datelabel">To</p>
            <DatePicker
              selected={toDate? toDate : new Date()}
              onChange={date => {
                settoDate(date)
                // comparisonvalid(startDate, date)
              }}
              minDate={startDate}
              maxDate={new Date()}
              dateFormat={"yyyy/MM/dd"}
            />
          </span>
          <button
            // title={
            //   comparefromDate >= comparetoDate
            //     ? "To date must be greater than Start date"
            //     : ""
            // }
            onClick={() => FilterGraphData()}
            className="filter usage-filter"
            disabled={spinner}
            // style={{
            //   cursor:
            //     (comparefromDate >= comparetoDate || spinner) ? "not-allowed" : "pointer",
            // }}
          >
            {spinner ? <div className="ui active inline loader"></div> : "Filter"}
          </button>
        </div>
      )}
      {refresh && (
        // className={loader ? "bandwidth overlayerloader" : "bandwidth"
        <div className="bandwidth">
          <h4 className="card-title mb-4 font16  font-semibold">
            Bandwidth: {dates?.from} to {dates?.to}
          </h4>
          <div id="chart">
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              height={350}
            />
          </div>
        </div>
      )}
      <TextLoader loading={loading} />
    </div>
  )
}
export default React.memo(BandwidthChart)
