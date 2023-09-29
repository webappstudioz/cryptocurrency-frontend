import React, { useEffect, useState } from "react"
// import PropTypes from "prop-types"
import { Link, useParams } from "react-router-dom"
// import { isEmpty } from "lodash"
import "bootstrap/dist/css/bootstrap.min.css"
import Select from "react-select"
import down from "../../assets/images/down.png"
import checkone from "../../assets/images/check-one.png"
import rederror from "../../assets/images/rederror.jpg"
import crosssign from "../../assets/images/crosssign.png"
import ticksign from "../../assets/images/ticksign.png"
import Alert from "react-bootstrap/Alert";

// import TableContainer from "../../components/Common/TableContainer"
// import * as Yup from "yup"
// import { useFormik } from "formik"
// import filter from "../../assets/images/filter.svg"
// import arrow from "../../assets/images/btn-arrow.svg"
import back from "../../assets/images/back.svg"
// import down from "../../assets/images/down.png"
import check from "../../assets/images/check-green.svg"
import cross from "../../assets/images/close-red-icon.svg"

// import xcircle from "../../assets/images/x-circle.png"
import install from "../../assets/images/install.svg"
// import { Delete } from "../../components/Common/CommonSvg"
//import components
// import Breadcrumbs from "../../components/Common/Breadcrumb"
// import Select from "react-select"
import { Checkwizard } from "../../components/Common/CommonSvg"
import {
  WidAppServer,
  WidIpAddress,
  WidLocation,
  WidStatus,
} from "../../components/Common/Widgets"

import header from "../../assets/images/header.svg"
import Line from "../../assets/images/Line.png"
import { useDispatch, useSelector } from "react-redux"
import { useHistory, useLocation } from "react-router-dom"
import { deviceDetails, installOperatingSystem } from "../Authentication/store/apiServices"

import { toast } from "react-toastify"

import { Col, Card, Row, CardBody, Modal } from "reactstrap"
// import { circle } from "leaflet"
// import { async } from "q"
import TextLoader from "../../components/textLoader"
import { flatten } from "lodash"
import { CONFIGURATIONS } from "../../constants/api/api_path"
import { fetcheOsList } from "../../store/osInstallList/action"
// import {  } from "react-router-dom/cjs/react-router-dom.min"

function ReinstallWizard4() {
  const locationParams = useLocation()
  const dispatch = useDispatch()
  const serverid = locationParams?.state?.serverid
  const wizard1Info = locationParams?.state?.wizard1Info
  const wizard2Info = locationParams?.state?.wizard2Info
  const wizard3Info = locationParams?.state?.wizard3Info
  const serverDetail = wizard1Info?.serverDetail
  const [loader, setLoader] = useState(false)
  const [loading, setLoading] = useState("")
  const [alreadyRequested, setalreadyRequested] = useState(false)
  const [modalToggle, setmodalToggle] = useState(false)
  const [dataLostModal, setDataLostModal] = useState(false)
  const [errMessage, seterrMessage] = useState("")
  const params = useParams()
  const history = useHistory()
  // const storedata = useSelector(state => state)

  useEffect(() => {
    !serverid && history.push(history.push(`/dashboard`))
  },[])
  // const selectedOS = useSelector(state => state?.SelectedOs)
  // const selectedService = useSelector(state => state?.SelectedService)
  // const partion = useSelector(state => state?.SelectedPartion)

  // useEffect(async () => {
    // let partitions = JSON.stringify(partion?.data)
    // if (params?.id) {
    //   !partion?.data && history.push(`/server-management/${params?.id}`)

    //   // let alldata = selectedService?.data?.product
    //   // setfullRes(alldata)
    //   // alldata?.configoptions?.configoption.map(ele => {
    //   //   ele.option == "Location" && setLocation(ele.value)
    //   // })
    // }
  // }, [])

  const installOs = async () => {
    setDataLostModal(false)
    let partitions = JSON.stringify(wizard2Info?.alldata)
    let raid = {
      type: wizard2Info?.selectedRaidType?.value,
      level: wizard2Info?.selectedRaid?.value,
      numberOfDisks: wizard2Info?.numberOfDisks
    }
    if(wizard2Info?.selectedRaidType?.value === "NONE" || wizard2Info?.selectedRaidType?.value == undefined){
      delete raid.type
      delete raid.level
      delete raid.numberOfDisks
    }
    let raidData = JSON.stringify(raid)
    // let installInfo = partion?.data
    let param = new URLSearchParams({
      service_id: serverid,
      action: "osinstall",
      device: wizard2Info?.selectedDisk?.value,
      hostname: wizard3Info?.Hname,
      operatingSystemId: wizard1Info?.selectedOS?.value,
      partitions: partitions,
      postInstallScript: wizard3Info?.postInstallScript,
      powerCycle: wizard3Info?.PowerCycle,
      raid: raidData,
      sshKeys: wizard3Info?.sshKey,
      timezone: wizard3Info?.SelectedTimezone?.value,
      operatingSystem: wizard1Info?.selectedOS?.label,
      emailNotify: wizard3Info?.emailLetters,
    })
    if (!wizard2Info?.selectedDisk?.value || wizard2Info?.selectedDisk?.value == undefined) {
      param.delete("device")
    }
    if (wizard2Info?.partionmode?.label == "Default"|| wizard2Info?.partionmode?.label == undefined) {
      param.delete("partitions")
    }
    if (wizard3Info?.Hname?.trim()?.length < 1 || wizard3Info?.Hname == undefined) {
      param.delete("hostname")
    }
    if (wizard3Info?.postInstallScript?.trim()?.length < 1 || wizard3Info?.postInstallScript == undefined) {
      param.delete("postInstallScript")
    }
    if (wizard3Info?.sshKey?.trim()?.length < 1 || wizard3Info?.sshKey == undefined) {
      param.delete("sshKeys")
    }
    if(!wizard3Info?.PowerCycle || wizard3Info?.PowerCycle == undefined) {
      param.delete("powerCycle")
    }
    if(Object.keys(raid).length === 0){
      param.delete("raid")
    }
    if(partitions == undefined){
      param.delete("partitions")
    }
    try {
      setLoading(true)
      // let res = await deviceDetails(param)
      let res = await installOperatingSystem(param)

      let info = res?.data?.data
      if (info) {
        storeArrayFuc(serverid, info?.uuid, info?.status)
        seterrMessage("")
        dispatch(fetcheOsList())
        // setmodalToggle(true)
        setalreadyRequested(true)
        // setLoader(false)
        setLoading(false)
        history.push(`/server-management/${serverid}`)
        toast.success(res?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      }
    } catch (error) {
      // setLoader(false)
      setLoading(false)
      seterrMessage(error?.response?.data?.message)
      // setmodalToggle(true)
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

  // /**
  //  * we store serverid and uuid and installation status.
  //  */
  // const storeArrayFuc = (serverid, uuid, status, percentage) => {
  //   let storedArray = JSON.parse(localStorage.getItem(CONFIGURATIONS?.SERVER_INSTALL_ARRAY)) || [];
  //   let newArray = {serverId:serverid, jobId:uuid, status:status, percentage:percentage || 0}
  //   let isItemAlreadyExist = storedArray.some((item) => item.serverid === newArray.serverId)
  //   if(!isItemAlreadyExist){
  //     storedArray.push(newArray)
  //     localStorage.setItem(CONFIGURATIONS?.SERVER_INSTALL_ARRAY, JSON.stringify(storedArray));
  //   }else{
  //     const indexToUpdate = storedArray.findIndex(obj=> obj?.serverId === newArray?.serverId)
  //     if(indexToUpdate !== -1){
  //       storedArray[indexToUpdate] = newArray
  //     }
  //     localStorage.setItem(CONFIGURATIONS?.SERVER_INSTALL_ARRAY, JSON.stringify(storedArray));
  //   }
  // }

  const storeArrayFuc = (serverid, uuid, status, percentage) => {
    let storedArray = JSON.parse(localStorage.getItem(CONFIGURATIONS?.SERVER_INSTALL_ARRAY)) || [];
    let newArray = { serverId: serverid, jobId: uuid, status: status, percentage: percentage || 0 };
    const indexToUpdate = storedArray.findIndex((obj) => obj?.serverId === newArray?.serverId);
  
    if (indexToUpdate !== -1) {
      storedArray[indexToUpdate] = newArray;
    } else {
      storedArray.push(newArray);
    }
  
    localStorage.setItem(CONFIGURATIONS?.SERVER_INSTALL_ARRAY, JSON.stringify(storedArray));
  };

  const handleBackButton = () => {
    if(!loading){
      history.push({
        pathname:`/reinstall-wizard-3`,
        state: {
          serverid: serverid,
          wizard1Info: wizard1Info,
          wizard2Info: wizard2Info,
          wizard3Info: wizard3Info
        }
      })
    }
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
            <Link to={`/server-management/${serverid}`} className="to-main">
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
          <div className="wizard-step">
            <Card>
              <CardBody>
                <Row className="header">
                  <div className="reinstall-buttons">
                    <div className="card-header p-0 d-flex align-items-center align-items-center justify-content-center">
                      <div className="header-count orenge-count bg-v2">
                        <Checkwizard />
                      </div>
                      <h6 className="text-blue font-14  font-semibold">
                        Operating System
                      </h6>
                    </div>
                    <i className="uil uil-angle-right"></i>
                  </div>
                  {/* <Col className="mx-1"> */}{" "}
                  {/* <span className="line"></span> */}
                  {/* </Col> */}
                  <div className="reinstall-buttons">
                    <div className="card-header p-0 d-flex align-items-center align-items-center justify-content-center">
                      <div className="header-count orenge-count bg-v2">
                        <Checkwizard />
                      </div>
                      <h6 className="text-blue font-14  font-semibold">
                        Disk & Raid
                      </h6>
                    </div>
                    <i className="uil uil-angle-right"></i>
                  </div>
                  {/* <Col className="mx-1"> */}{" "}
                  {/* <span className="line"></span> */}
                  {/* </Col> */}
                  <div className="reinstall-buttons">
                    <div className="card-header p-0 d-flex align-items-center align-items-center justify-content-center">
                      <div className="header-count orenge-count bg-v2">
                        <Checkwizard />
                      </div>
                      <h6 className="text-blue font-14  font-semibold">
                        Hostname
                      </h6>
                    </div>
                    <i className="uil uil-angle-right"></i>
                  </div>
                  {/* <Col className="mx-1"> */}{" "}
                  {/* <span className="line"></span> */}
                  {/* </Col> */}
                  <Col className="reinstall-buttons">
                    <div className="card-header p-0 d-flex align-items-center align-items-center justify-content-center">
                      <div className="header-count bg-yellow">
                        <p className="text-white">
                          {alreadyRequested ? <Checkwizard /> : 4}
                        </p>
                      </div>
                      <h6 className="text-blue font-14  font-semibold">
                        Confirmation
                      </h6>
                      {/* <img className="w-100" src={Line} alt="" /> */}
                    </div>
                  </Col>
                </Row>
                <Row className="wiz-4-content-block details">
                  {wizard1Info?.selectedOS && <Col md={4}>
                    <div className="flex-content d-flex align-items-center">
                      <p className="font-16 text-color-v1 font-semibold">
                        Operating System
                      </p>
                      <span className="text-blue font-16 font-normal mx-3">
                        -
                      </span>
                      <p className="font-16 text-color font-normal">
                        {wizard1Info?.selectedOS?.label}
                      </p>
                    </div>
                  </Col>}
                {wizard3Info?.Hname && <Col md={4}>
                  <div className="flex-content d-flex align-items-center">
                    <p className="font-16 text-color-v1 font-semibold">
                      Hostname
                    </p>
                    <span className="text-blue font-16 font-normal mx-3">
                      -
                    </span>
                    <p className="font-16 text-color font-normal">
                      {wizard3Info?.Hname}
                    </p>
                  </div>
                </Col>}
                  {wizard3Info?.SelectedTimezone && <Col md={4}>
                    <div className="flex-content d-flex align-items-center">
                      <p className="font-16 text-color-v1 font-semibold">
                        Time Zone
                      </p>
                      <span className="text-blue font-16 font-normal mx-3">
                        -
                      </span>
                      <p className="font-16 text-color font-normal">
                        {wizard3Info?.SelectedTimezone?.label}{" "}
                      </p>
                    </div>
                  </Col>}
                </Row>
                <div className="disk">
                  {/* <p className="text-color-v1 font-16 font-semibold">
                    Disk Partitions:
                  </p> */}
                  {wizard2Info?.featuresArray?.includes("PARTITIONING") && wizard2Info?.alldata?.length > 0 && (
                    <div className="wiz-tab-view">
                      <Row>
                        <Col md={4}>
                          <div className="tab-block">
                            <p className="text-color-v1 font-semibold d-flex align-items-center mb-3">
                              Mount Point <img className="mx-2" src={down} />
                            </p>

                            {wizard2Info?.alldata?.map &&
                              wizard2Info?.alldata?.map(
                                (el, index) => {
                                  return (
                                    <input
                                      key={index}
                                      value={
                                        el?.mountpoint ? el?.mountpoint : ""
                                      }
                                      name="mountpoint"
                                      // onChange={e => handleTestmount(e, index)}
                                      disabled={
                                        true
                                        // selectedPartition?.value == "Default"
                                        //   ? true
                                        //   : false
                                      }
                                    />
                                  )
                                }
                              )}
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="tab-block">
                            <p className="text-color-v1 font-semibold d-flex align-items-center mb-3">
                              Type <img className="mx-2" src={down} />
                            </p>
                            {wizard2Info?.alldata?.map &&
                              wizard2Info?.alldata?.map(
                                (el, index) => {
                                  return (
                                    <div
                                      className="form-group select-v1 tb-select-group"
                                      key={index}
                                    >
                                      <Select
                                        key={index}
                                        classNamePrefix="select-v1"
                                        // defaultValue={el?.filesystem}
                                        // options={FileSystemType}
                                        // styles={customStyles}
                                        value={{
                                          value: el?.filesystem,
                                          label: el?.filesystem,
                                        }}
                                        name="filesystem"
                                        // onChange={e => handleTestSelect(e, index)}
                                        isDisabled={
                                          true
                                          // selectedPartition?.value == "Default"
                                          //   ? true
                                          //   : false
                                        }
                                      />
                                    </div>
                                  )
                                }
                              )}
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="tab-block">
                            <p className="text-color-v1 font-semibold d-flex align-items-center mb-3">
                              Size in MB <img className="mx-2" src={down} />
                            </p>
                            {wizard2Info?.alldata?.map &&
                              wizard2Info?.alldata?.map(
                                (el, index) => {
                                  return (
                                    <input
                                      placeholder={el.size ? el.size : ""}
                                      key={index}
                                      value={el?.size}
                                      name="size"
                                      // onChange={e => handleTestsize(e, index)}
                                      disabled={
                                        true
                                        // selectedPartition?.value == "Default"
                                        //   ? true
                                        //   : false
                                      }
                                    />
                                  )
                                }
                              )}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )}
                  <Row className="wiz-4-content-block details">
                    {wizard2Info?.partionmode && <Col md={4}>
                      <div className="flex-content d-flex align-items-center">
                        <p className="font-16 text-color-v1 font-semibold">
                          Partition mode
                        </p>
                        <span className="text-blue font-16 font-normal mx-3">
                          -
                        </span>
                        <p className="font-16 text-color font-normal">
                          {wizard2Info?.partionmode?.label}
                        </p>
                      </div>
                    </Col>}
                    {wizard2Info?.selectedRaidType?.value != "NONE" && <Col md={4}>
                      <div className="flex-content d-flex align-items-center">
                        <p className="font-16 text-color-v1 font-semibold">
                          Software raid level
                        </p>
                        <span className="text-blue font-16 font-normal mx-3">
                          -
                        </span>
                        <p className="font-16 text-color font-normal">
                          {wizard2Info?.selectedRaid?.label}
                        </p>
                      </div>
                    </Col>}
                    <Col md={4}>
                      <div className="flex-content d-flex align-items-center">
                        <p className="font-16 text-color-v1 font-semibold">
                          Device
                        </p>
                        <span className="text-blue font-16 font-normal mx-3">
                          -
                        </span>
                        <p className="font-16 text-color font-normal">
                          {wizard2Info?.selectedDisk?.label}{" "}
                        </p>
                      </div>
                    </Col>
                    <Col md={12}>
                      <Row className="reinstall4-checks">
                        <div className="form-check s-check">
                        {!wizard3Info?.PowerCycle? <img src={crosssign} width={20} /> : <img src={ticksign} width={20} />}
                          {/* <input
                            type="checkbox"
                            className="form-check-input text-color font-16 font-normal"
                            id="customControlInline"
                            checked={wizard3Info?.PowerCycle}
                            onChange={() => {}}
                          /> */}
                          <label
                            className="form-check-label"
                            htmlFor="customControlInline1"
                          >
                            Power cycle your dedicated server
                          </label>
                        </div>
                        <div className="form-check s-check">
                          {!wizard3Info?.emailLetters? <img src={crosssign} width={20} /> : <img src={ticksign} width={20} />}
                          {/* <input
                            type="checkbox"
                            className="form-check-input text-color font-16 font-normal"
                            id="customControlInline"
                            // checked={emailLetters}
                            checked={
                              wizard3Info?.emailLetters
                            }
                            onChange={() => {}}
                          /> */}
                          <label
                            className="form-check-label"
                            htmlFor="customControlInline2"
                          >
                            Receive email notification
                          </label>
                        </div>
                        {/* <div className="form-check s-check">
                          <input
                            type="checkbox"
                            className="form-check-input text-color font-16 font-normal"
                            id="customControlInline"
                            // checked={emailLetters}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="customControlInline2"
                          >
                            Bootable
                          </label>
                        </div> */}
                      </Row>
                    </Col>
                  </Row>
                  {/* <Row> */}
                  {/* <Col md={5}>
                      <div className="basic-table">
                        <table className="w-100">
                          <tbody>
                            <tr>
                              <th>Partition Mode</th>
                              <td>
                                {
                                  storedata?.SelectedPartion?.data?.partionmode
                                    ?.label
                                }
                              </td>
                            </tr>
                            <tr>
                              <th>Software Raid Level</th>
                              <td>
                                {
                                  storedata?.SelectedPartion?.data?.selectedRaid
                                    ?.label
                                }
                              </td>
                            </tr>
                            <tr>
                              <th>Number of disks to perform software RAID</th>
                              <td>
                                {
                                  storedata?.SelectedPartion?.data?.numberOfDisks ?storedata?.SelectedPartion?.data?.numberOfDisks:"-"
                                    
                                }
                              </td>
                            </tr>
                            <tr>
                              <th>Device</th>
                              <td>
                                {" "}
                                {
                                  storedata?.SelectedPartion?.data?.selectedDisk
                                    ?.label
                                }
                              </td>
                            </tr>
                            <tr>
                              <th>
                                <div className="footer-label d-flex align-items-center p-0 m-0">
                                  <p className="mb-0">Power Cycle</p>
                                  <img
                                    src={
                                      storedata?.SelectedPartion?.data
                                        ?.powerCycle == true
                                        ? check
                                        : cross
                                    }
                                    width={17}
                                    height={17}
                                    alt=""
                                    className="d-block"
                                  />
                                  <p className="mb-0 font-normal">
                                    {storedata?.SelectedPartion?.data
                                      ?.powerCycle == true
                                      ? "YES"
                                      : "No"}
                                  </p>
                                </div>
                              </th>
                              <td>
                                <div className="footer-label d-flex align-items-center p-0 m-0">
                                  <p className="mb-0">Send Email</p>
                                  <img
                                    src={
                                      storedata?.SelectedPartion?.data
                                        ?.emailLetters == true
                                        ? check
                                        : cross
                                    }
                                    width={17}
                                    height={17}
                                    alt=""
                                    className="d-block"
                                  />
                                  <p className="mb-0 font-normal">
                                    {" "}
                                    {storedata?.SelectedPartion?.data
                                      ?.emailLetters == true
                                      ? "YES"
                                      : "No"}
                                  </p>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </Col> */}
                  {/* <Col md={7}>
                      <div className="basic-table disk-right">
                        <table className="w-100">
                          <tbody>
                            <tr>
                              <th>Mount Point</th>
                              {storedata?.SelectedPartion?.data?.alldata?.map(
                                (el, index) => {
                                  return (
                                    <td key={index}>
                                      {el.mountpoint ? el.mountpoint : ""}
                                    </td>
                                  )
                                }
                              )}
           
                            </tr>
                            <tr>
                              <th>Type</th>
                              {storedata?.SelectedPartion?.data?.alldata?.map(
                                (el, index) => {
                                  return (
                                    <td key={index}>
                                      {el.filesystem ? el.filesystem : ""}
                                    </td>
                                  )
                                }
                              )}
                 
                            </tr>
                            <tr>
                              <th>Size MB</th>
                              {storedata?.SelectedPartion?.data?.alldata?.map(
                                (el, index) => {
                                  return (
                                    <td key={index}>
                                      {el.size ? el.size : ""}
                                    </td>
                                  )
                                }
                              )}
                       
                            </tr>
                           
                          </tbody>
                        </table>
                      </div>
                    </Col> */}
                  {/* </Row> */}

                  <button
                    className="btn btn-primary waves-effect waves-light btn-save font-normal btnv1 btnv2"
                    type="submit"
                    onClick={(e) => !alreadyRequested? setDataLostModal(true) : e?.preventDefault()}
                    disabled={alreadyRequested || loading}
                  >
                    {loading? 
                      <div className="ui active inline loader"></div> :
                      <><img src={install} /> Install{" "}</>
                    }
                  </button>
                  {/* <Link
                    className="btn btn-primary waves-effect waves-light btn-save font-normal btnv1 btn-cancel"
                    to={{pathname:`/reinstall-wizard-3`, state:{
                      // osList: osList, 
                      // selectedOS: selectedOS, 
                      // fulldetail:fulldetail,
                      // serverDetail:serverDetail,
                      // fullDataWizard3:fullDataWizard3,
                    }}}
                    onClick={ (event) => loading? event.preventDefault() : null}
                  >
                    <img src={back} /> Back{" "}
                  </Link> */}
                  <a
                    className="btn btn-primary waves-effect waves-light btn-save font-normal btnv1 btn-cancel"
                    onClick={handleBackButton}
                  >
                    <img src={back} /> Back{" "}
                  </a>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
      <Modal isOpen={modalToggle} centered={true} modalClassName="manage-modal">
        {/* <div className="modal-header">
          <Row className="w-100">
            <Col xs="11">
              <h5 className="modal-title mt-0">{}</h5>
            </Col>
            <Col xs="1">
            <button
                type="button"
                onClick={() => {
                  // setActionModal(false)
                  // setLoader(false)
                  setmodalToggle(false)
                  history.push(`/server-management/${params.id}`)

                }}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
        >
                <span aria-hidden="true">
                  {" "}
                  <img src={close} alt="" />
                </span>
              </button>
            </Col>
          </Row>
        </div> */}
        <div className="os-success">
          <button
            type="button"
            onClick={() => {
              // setActionModal(false)
              // setLoader(false)
              setmodalToggle(false)
              // history.push(`/server-management/${params.id}`)
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">
              {" "}
              {/* <img src={close} alt="" /> */}
            </span>
          </button>
          <img src={errMessage ? rederror : checkone} width={40} />
          <p>{errMessage ? "Error" : "Success"} </p>
          <span>
            {errMessage
              ? errMessage
              : "operating system installation initiated successfully."}
          </span>
          <div className="btn-group osinstall">
            <button
              className="btn btn-primary btn-modal waves-effect waves-light d-flex justify-content-center align-items-center buttoncustom "
              type="submit"
              onClick={() => {
                setmodalToggle(false)
                // history.push(`/server-management/${params.id}`)
              }}
            >
              Ok
            </button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={dataLostModal} centered={true} modalClassName="manage-modal">
        <div className="modal-header">
          <Row className="w-100">
            <Col xs="11">
              <h3 className="modal-title mt-0">Installation Confirmation</h3>
            </Col>
            <Col xs="1">
              <button
                type="button"
                onClick={() => {
                  setDataLostModal(false)
                }}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">
                  {" "}
                </span>
              </button>
            </Col>
          </Row>
        </div>
        <div className="modal-body p-0 two-factor verify">
          <h6 className="font-bold text-blue text-center">
             Starting the installation will cause all existing data to be removed.
          </h6>
          <div className="factor-disable-btn">
            <button
              className="btn btn-danger waves-effect waves-light btn-green"
              type="button"
              onClick={() => {
                // ActionHandler(action?.action)
                installOs()
              }}
              data-dismiss="modal"
              aria-label="Close"
            >
              Yes
            </button>
            <button
              className="btn btn-danger waves-effect waves-light btn-disable"
              type="button"
              onClick={() => {
                setDataLostModal(false)
              }}
              data-dismiss="modal"
              aria-label="Close"
            >
              No
            </button>
          </div>
        </div>
      </Modal>
      <TextLoader loading={loading} loader={loader}/>
    </React.Fragment>
  )
}
export default ReinstallWizard4
