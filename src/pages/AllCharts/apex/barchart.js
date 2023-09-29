import React, { useEffect, useState } from "react"
import ReactApexChart from "react-apexcharts"
import { deviceDetails } from "../../Authentication/store/apiServices"
import TextLoader from "../../../components/textLoader"
import { toast } from "react-toastify"
import DatePicker from "react-datepicker"
import { useParams } from "react-router-dom"

const BarChart = ({ barChartData, product } = props) => {
  const [udata, setudata] = useState([])
  const [ddata, setddata] = useState([])
  const [data, setdata] = useState([])
  const [loading, setLoading] = useState("")
  const [refresh, setrefresh] = useState(false)
  const [unit, setunit] = useState("")
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [toDate, settoDate] = useState(new Date())
  // const [comparetoDate, setcomparetoDate] = useState("")
  // const [comparefromDate, setcomparefromDate] = useState("")
  const [registrationDate, setRegistrationDate] = useState()
  // const [minDateTo, setMinDateTo] = useState(startDate)
  const params = useParams()
  const [spinner, setSpinner] = useState(false)

  useEffect(() => {
    if(product?.regdate){
      let formattedDate = new Date(product?.regdate)
      setRegistrationDate(formattedDate)
      startDate < formattedDate? setStartDate(formattedDate) : null
    }
  },[product])

  // useState(() => {
  //   if(startDate){
  //     let date = (minDateTo.getDate() + 1);
  //     setMinDateTo(date)
  //   }
  // },[startDate])

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

  const series = [
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
        data?.dates,
      tickPlacement: "on",
    },
    yaxis: {
      show: true,
      labels: {
        show: true,
        formatter: function (value, timestamp, opts) {
          return formatBytes(value)
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
    GraphData(barChartData)
  }, [barChartData])

  // const comparisonvalid = (s, t) => {
  //   let day = (s.getDate() < 10 ? "0" : "") + s.getDate()
  //   let month = (s.getMonth() + 1 < 10 ? "0" : "") + (s.getMonth() + 1)
  //   let year = s.getFullYear()
  //   let from = year + "-" + month + "-" + day

  //   setcomparefromDate(from)

  //   let day1 = (t.getDate() < 10 ? "0" : "") + t.getDate()
  //   let month1 = (t.getMonth() + 1 < 10 ? "0" : "") + (t.getMonth() + 1)
  //   let year1 = t.getFullYear()
  //   let to = year1 + "-" + month1 + "-" + day1
  //   setcomparetoDate(to)
  // }

  const GraphData = async (data) => {
    setddata(data?.down)
    setudata(data?.up)
    setdata(data)
    setunit(data?.unit)
    setrefresh(true)
    // return
    // setLoading(true)
    // setSpinner(true)
    // let result = params.id
    // try {
    //   let param = new URLSearchParams({
    //     service_id: result,
    //     action: "dataTraffic",
    //   })
    //   let res = await getDataTrafficDetails(param)
    //   if (res) {
    //     setLoading(false)
    //     setSpinner(false)
    //     setddata(res?.data?.data?.data?.down)
    //     setudata(res?.data?.data?.data?.up)
    //     setdata(res?.data?.data?.data)
    //     // props.data(res?.data?.data?.data)
    //     setunit(res?.data?.data?.data?.unit)
    //     setTimeout(() => {
    //       setLoading(false)
    //       setSpinner(false)
    //     }, 1000)
    //   }
    // } catch (error) {
    //   setLoading(false)
    //   setSpinner(false)
    // }
    // setrefresh(true)
  }

  useEffect(() => {
    if(startDate == null){
      setStartDate(registrationDate)
    }else if(toDate == null) {
      settoDate(new Date())
    }
  },[startDate, toDate])

  const FilterGraphData = async () => {
    let result = params?.id
      try {
        let day = (startDate.getDate() < 10 ? "0" : "") + startDate.getDate()
        let month = (startDate.getMonth() + 1 < 10 ? "0" : "") + (startDate.getMonth() + 1)
        let year = startDate.getFullYear()
        let from = year + "-" + month + "-" + day
        let day1 = (toDate.getDate() < 10 ? "0" : "") + toDate.getDate()
        let month1 = (toDate.getMonth() + 1 < 10 ? "0" : "") + (toDate.getMonth() + 1)
        let year1 = toDate.getFullYear()
        let to = year1 + "-" + month1 + "-" + day1

        if(from > to || from == to){
          toast.error("To date must be greater than From date", {
            position: toast.POSITION.TOP_RIGHT,
          })
        }else { 
          let param = new URLSearchParams({
            service_id: result,
            action: "dataTraffic",
            from: from,
            to: to,
          })
          setLoading(true)
          setSpinner(true)
          let res = await deviceDetails(param)
          let info = res?.data?.data?.data
          if (info) {
            setLoading(false)
            setSpinner(false)
            setddata(info?.down)
            setudata(info?.up)
            setdata(info)
            // props.data(res?.data?.data?.data)
            setunit(info?.unit)
            setTimeout(() => {
              setLoading(false)
              setSpinner(false)
            }, 1000)
          }
        }
      } catch (error) {
        setLoading(false)
        setSpinner(false)
        toast.error(error?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      }
    setrefresh(true)
  }

  return (
    <React.Fragment>
      {refresh && (
        // className={loader ? "chartfilter overlayerloader" : "chartfilter"
        <div className="chartfilter">
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
            onClick={() => {FilterGraphData()}}
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
        <div className="barchart">
          <h4 className="card-title mb-4 font16  font-semibold">
            Data Traffic: {data?.from} to {data?.to}
          </h4>
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      )}
      <TextLoader loading={loading} />
    </React.Fragment>
  )
}
export default React.memo(BarChart)
