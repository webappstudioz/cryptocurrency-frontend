import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import arrow from "../../assets/images/btn-arrow.svg"
import Select from "react-select"
import {
  WidAppServer,
  WidIpAddress,
  WidLocation,
  WidStatus,
} from "../../components/Common/Widgets"

import header from "../../assets/images/header.svg"
import Line from "../../assets/images/Line.png"

import { Col, Card, Row, Form, CardBody } from "reactstrap"
import {
  deviceDetails, getOSList,
} from "../Authentication/store/apiServices"
import TextLoader from "../../components/textLoader"
import { useDispatch } from "react-redux"
import { getOs, getPartionmode } from "../../store/actions"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { toast } from "react-toastify"
import { useLocation } from "react-router-dom/cjs/react-router-dom.min"

const customStyles = {
  control: base => ({
    ...base,
    height: 50,
    minHeight: 50,
  }),
}

function ReinstallWizard1() {
  const dispatch = useDispatch()
  // const params = useParams()
  const locationParams = useLocation()
  const serverid = locationParams?.state?.serverid
  const wizard1Info = locationParams?.state?.wizard1Info
  const wizard2Info = locationParams?.state?.wizard2Info
  const wizard3Info = locationParams?.state?.wizard3Info
  const serverDetail = wizard1Info?.serverDetail
  const osList = wizard1Info?.osList
  const selectedOS = wizard1Info?.selectedOS
  const [options, setOptions] = useState([])
  const [selecteos, setselecteos] = useState("")
  // const [fullRes, setfullRes] = useState()
  const [loader, setLoader] = useState(false)
  const [loading, setLoading] = useState("")
  // const [Location, setLocation] = useState()
  // const storedata = useSelector(state => state)
  const history = useHistory()
  // const selectedOS = useSelector(state => state?.SelectedOs)
  // const selectedService = useSelector(state => state?.SelectedService)
  useEffect(() => {
    // const config = {
    //   params: {
    //     command: "lw_reinstallWizard1",
    //     whmcs_hostingid: params?.id,
    //   },
    // }

    // getOSControls(config).then(res => {
    //   if(res.status == 200 ){
    //     const osList = res.data?.operatingSystems?.json?.operatingSystems;
    //     const osOptions = osList.map(item => {
    //       return {
    //         ...item,
    //         value: item.id,
    //         label: item.name
    //       }
    //     });
    //     setOptions(osOptions)
    //   }

    // }).catch(err => {
    // })
  }, [])

  useEffect(async () => {
      if(serverid) {
        osList? setOptions(osList) : getOperatingSystemsList(serverid)
        selectedOS? setselecteos(selectedOS) : null
      }else{
        history.push(history.push(`/dashboard`))
      }
    // let alldata = selectedService?.data?.product
    // setfullRes(alldata)
    // alldata?.configoptions?.configoption?.map(ele => {
    //   ele.option == "Location" && setLocation(ele.value)
    // })
    // if (
    //   selectedOS?.data?.selecteos?.value &&
    //   selectedOS?.data?.oslist
    // ) {
    //   setOptions(selectedOS?.data?.oslist)
    //   setselecteos(selectedOS?.data?.selecteos)
    // } else {
      // let param = new URLSearchParams({
      //   service_id: params?.id != undefined && params?.id,
      //   action: "operatingSystems",
      // })
      // try {
      //   setLoader(true)
      //   setLoading(true)
      //   let res = await deviceDetails(param)
      //   if (res) {
      //     let arr = []
      //     res?.data?.data?.data?.operatingSystems.map(el => {
      //       arr.push({ value: el?.id, label: el?.name })
      //     })
      //     setselecteos(arr[0])
      //     setOptions(arr)
      //     setLoader(false)
      //     setLoading(false)
      //     dispatch(getOs({ selecteos: arr[0], oslist: arr }))
      //   }
      // } catch (err) {
      //   setLoader(false)
      //   setLoading(false)
      // }
    // }
  }, [osList,selectedOS])

  const getOperatingSystemsList = async(id) => {
    let param = new URLSearchParams({
      service_id: id,
      action: "operatingSystems",
    })
    try {
      setLoader(true)
      setLoading(true)
      // let res = await deviceDetails(param) //geting from leas web
      let res = await getOSList(param) //geting from loom
      if (res) {
        let arr = []
        res?.data?.data?.data?.operatingSystems.map(el => {
          arr.push({ value: el?.osid, label: el?.osname })
        })
        setselecteos(arr[0])
        setOptions(arr)
        setLoader(false)
        setLoading(false)
        // dispatch(getOs({ selecteos: arr[0], oslist: arr }))
      }
    } catch (err) {
      setLoader(false)
      setLoading(false)
    }
  }

  const SelectOs = value => {
    setselecteos(value)
    // dispatch(getOs({ ...selectedOS?.data, selecteos: value }))
  }

  const handleNextClick = () => {
    if(selecteos && selectedOS?.value === selecteos?.value){
      history.push({
        pathname:`/reinstall-wizard-2`, 
        state: {
          serverid: serverid, 
          wizard1Info:{
            selectedOS:selecteos, 
            osList:options, 
            serverDetail: serverDetail
          },
          wizard2Info: wizard2Info,
          wizard3Info: wizard3Info
        }})
    }else if(selecteos && selectedOS?.value != selecteos?.value){
      history.push({
        pathname:`/reinstall-wizard-2`, 
        state: {
          serverid: serverid, 
          wizard1Info:{
            selectedOS:selecteos, 
            osList:options, 
            serverDetail: serverDetail
          },
          // wizard2Info: wizard2Info,
          wizard3Info: wizard3Info
        }})
    }else{
      toast.error("Please choose an operating system.", {
      position: toast.POSITION.TOP_RIGHT,
    })}
    // dispatch(
    //   getOs({
    //     ...selectedOS?.data,
    //     preos: selecteos,
    //   })
    // )
    // selectedOS?.data?.preos != selecteos &&
    //   dispatch(getPartionmode())
  }

  return (
    <React.Fragment>
      <div
        className={
          loader
            ? "page-content admin-pg wiz overlayerloader"
            : "page-content admin-pg wiz"
        }
      >
        <div className="container-fluid">
          <div className="page-header d-flex align-items-center">
            <Link to={`/server-management/${serverDetail?.product?.id}`} className="to-main">
              <img src={header} alt="" />{" "}
              <h3 className="mb-0">
                {" "}
                {serverDetail?.product?.name}
              </h3>
            </Link>
          </div>
          <div className="server_info">
            <h5 className="info_heding">Server Information: </h5>
            <div className="row">
              <div className="col">
                <WidAppServer model={serverDetail?.product?.hostname}></WidAppServer>
              </div>
              <div className="col">
                <WidIpAddress ipAddress={serverDetail?.product?.dedicatedip}></WidIpAddress>
              </div>
              <div className="col">
                <WidLocation location={serverDetail?.product?.desformat?.Location}></WidLocation>
              </div>
              <div className="col">
                <WidStatus status={serverDetail?.product?.status}></WidStatus>
              </div>
            </div>
          </div>
          <div className="wizard-step one">
            <Card>
              <CardBody>
                <Row className="header">
                  <div className="reinstall-buttons">
                    <div className="card-header p-0 d-flex align-items-center align-items-center justify-content-center">
                      <div className="header-count orenge-count bg-yellow">
                        <p className="text-white">1</p>
                      </div>
                      <h6 className="text-blue font-14  font-semibold">
                        Operating System
                      </h6>
                    </div>
                    <i className="uil uil-angle-right"></i>
                  </div>

                  <div className="reinstall-buttons">
                    <div className="card-header p-0 d-flex align-items-center align-items-center justify-content-center">
                      <div className="header-count count-v1 bg-yellow">
                        <p className="text-white">2</p>
                      </div>
                      <h6 className="text-color font-14  font-semibold">
                        Disk & Raid
                      </h6>
                    </div>
                    <i className="uil uil-angle-right"></i>
                  </div>

                  <div className="reinstall-buttons">
                    <div className="card-header p-0 d-flex align-items-center align-items-center justify-content-center">
                      <div className="header-count count-v1 bg-yellow">
                        <p className="text-white">3</p>
                      </div>
                      <h6 className="text-color font-14  font-semibold">
                        Hostname
                      </h6>
                    </div>
                    <i className="uil uil-angle-right"></i>
                  </div>

                  <Col>
                    <div className="card-header p-0 d-flex align-items-center align-items-center justify-content-center">
                      <div className="header-count count-v1 bg-yellow">
                        <p className="text-white">4</p>
                      </div>
                      <h6 className="text-color font-14  font-semibold">
                        Confirmation
                      </h6>
                      <img className="w-100" src={Line} alt="" />
                    </div>
                  </Col>
                </Row>

                <Form className="reinstall-common">
                  <div className="form-group select-v1"> {/*os_list_dropdwon*/}
                    <label>Select operating System</label>
                    <Select
                      classNamePrefix="select-v1"
                      value={selecteos}
                      options={options}
                      styles={customStyles}
                      onChange={SelectOs}
                    />
                  </div>
                  {/* <Link
                    className="btn btn-primary waves-effect waves-light btn-save font-normal btnv1"
                    to={{pathname:`/reinstall-wizard-2`, state:{selectedOS:selecteos, osList:options, serverDetail: serverDetail, }}}
                    // to={selecteos ? `/reinstall-wizard-2/${params?.id}` : "#"}
                    // onClick={() => {
                    //   dispatch(
                    //     getOs({
                    //       ...storedata?.SelectedOs?.data,
                    //       preos: selecteos,
                    //     })
                    //   )
                    //   storedata?.SelectedOs?.data?.preos != selecteos &&
                    //     dispatch(getPartionmode())
                    // }}
                    onClick={(e) => selecteos? handleNextClick() : (e.preventDefault(), toast.error("Please select an operating system.", {
                      position: toast.POSITION.TOP_RIGHT,
                    }))}
                  >
                    Next <img src={arrow} />
                  </Link> */}
                  <a
                    className="btn btn-primary waves-effect waves-light btn-save font-normal btnv1"
                    onClick={handleNextClick}
                  >
                    Next <img src={arrow} />
                  </a>
                </Form>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
      <TextLoader loading={loading} loader={loader}/>
    </React.Fragment>
  )
}
export default ReinstallWizard1
