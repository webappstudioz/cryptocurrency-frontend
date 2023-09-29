import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import "bootstrap/dist/css/bootstrap.min.css"
import arrow from "../../assets/images/btn-arrow.svg"
import back from "../../assets/images/back.svg"
import down from "../../assets/images/down.png"
import { Delete } from "../../components/Common/CommonSvg"
//import components
import Select from "react-select"
import { Checkwizard } from "../../components/Common/CommonSvg"
import {
  WidAppServer,
  WidIpAddress,
  WidLocation,
  WidStatus,
} from "../../components/Common/Widgets"
import { deviceDetails, getOSConfig } from "../Authentication/store/apiServices"
import TextLoader from "../../components/textLoader"
import { useHistory } from "react-router-dom"
import header from "../../assets/images/header.svg"
import Line from "../../assets/images/Line.png"
import { Col, Card, Row, Form, CardBody } from "reactstrap"
import { useLocation } from "react-router-dom/cjs/react-router-dom.min"
import { customRegex } from "../../helpers/validation_helpers"

const options = [
  { value: 0, label: "RAID 0 " },
  { value: 1, label: "RAID 1" },
  { value: 5, label: "RAID 5" },
  { value: 10, label: "RAID 10" },
]

const options3 = [
  { value: "Customised ", label: "Customised " },
  { value: "Default", label: "Default" },
]

const customStyles = {
  control: base => ({
    ...base,
    height: 50,
    minHeight: 50,
  }),
}
function ReinstallWizard2() {
  const params = useParams()
  const locationParams = useLocation()
  const serverid = locationParams?.state?.serverid
  const wizard1Info = locationParams?.state?.wizard1Info
  const serverDetail = wizard1Info?.serverDetail
  const selectedOS = wizard1Info?.selectedOS
  const wizard2Info = locationParams?.state?.wizard2Info
  const wizard3Info = locationParams?.state?.wizard3Info
  const [loader, setLoader] = useState(false)
  const [loading, setLoading] = useState("")
  const [alldata, setalldata] = useState([])
  const [disklist, setdisklist] = useState([])
  const [selectedDisk, setselectedDisk] = useState()
  const [selectedRaid, setselectedRaid] = useState(options[0])
  const [raiddisk, setraiddisk] = useState("")
  const [selectedPartition, setselectedPartition] = useState({value: "Default", label: "Default",})
  const [DefaultData, setDefaultData] = useState()
  const [FileSystemType, setFileSystemType] = useState([]) ////filesystem select list
  const [partitionConfigurable, setPartitionConfigurable] = useState("")
  const [featuresArray, setFeaturesArray] = useState([])
  const history = useHistory()
  const [mbSizeError, setMBSizeError] = useState([{index: "", error: ""}])
  const [raidTypeOpt, setRaidTypeOpt] = useState();
  const [selectedRaidType, setselectedRaidType] = useState()

  useEffect(async () => {
    !serverid && history.push(history.push(`/dashboard`))
    if(wizard2Info) {
      setalldata(wizard2Info?.alldata)
      setdisklist(wizard2Info?.disklist)
      setselectedPartition(wizard2Info?.partionmode)
      setselectedDisk(wizard2Info?.selectedDisk)
      setselectedRaid(wizard2Info?.selectedRaid)
      setDefaultData(wizard2Info?.DefaultData)
      setraiddisk(wizard2Info?.numberOfDisks)
      setFileSystemType(wizard2Info?.FileSystemType)
      setselectedRaidType(wizard2Info?.selectedRaidType)
      setFeaturesArray(wizard2Info?.featuresArray)
      setPartitionConfigurable(wizard2Info?.partitionConfigurable)
    } else {
        selectcp()
      }
  }, [])


  /**
   * here we add raid type options
   */
  useEffect(() => {
    if (featuresArray) {
      const newOptions = [];
      featuresArray?.forEach((feature) => {
        if(feature === "SW_RAID" || feature === "HW_RAID"){
          newOptions.push({ value: "NONE", label: "No RAID" });
          if (feature === "SW_RAID") {
            newOptions.push({ value: "SW_RAID", label: "Software RAID" });
          }
          if (feature === "HW_RAID") {
            newOptions.push({ value: "HW_RAID", label: "Hardware RAID" });
          }
        }
        
      });

      // setRaidTypeOpt((prevOptions) => [...prevOptions, ...newOptions]);
      setRaidTypeOpt(newOptions);

      setselectedRaidType(newOptions[0])
    }
  }, [featuresArray]);

  const handlePartionChange = (value) => {
    if(value.value === "Default") {
      setselectedDisk(disklist[0])
      setselectedPartition({value:value?.value, lable:value?.label})
      setMBSizeError([{index: "", error: ""}])
    }
  }

  useEffect(() => {
    let arr = []
    if(serverDetail?.server?.diskset){
      serverDetail?.server?.diskset.map((ele) => {
        arr.push({ value: Object.values(ele)[0], label: Object.values(ele)[0] + ` (${ele?.amount}x ${ele?.size + ele?.unit + " " + ele?.type})` })
      })
    }
    setdisklist(arr)
    setselectedDisk(arr[0])
  },[serverDetail])

  const selectcp = async value => {
    try {
      let param = new URLSearchParams({
        service_id: serverid,
        operatingSystemId: selectedOS?.value,
        action: "getOSDetails",
      })
      setLoader(true)
      setLoading(true)
      var res1 = await deviceDetails(param)
      // let res1 = await getOSConfig(param)
      if (res1) {
        let info = res1?.data?.data?.data
        setPartitionConfigurable(info?.configurable)
        setFeaturesArray(info?.features)
        setalldata(info?.defaults?.partitions)
        setDefaultData(JSON.parse(JSON.stringify(info?.defaults?.partitions)))
        
        ////////////////////setting supported filesytem list
        let list = []
        if(info?.supportedFileSystems){
          info?.supportedFileSystems?.map((el, index) => {
            list = [...list]
            list.push({ value: el, label: el })
          })
          setFileSystemType(list)
        }
        setLoader(false)
        setLoading(false)
      }
    } catch (err) {
      setLoader(false)
      setLoading(false)
    }
  }

  const setTodefault = () => {
    setalldata(JSON.parse(JSON.stringify(DefaultData)))
  }

  const handleDelete = (e, value) => {
    let arr = [...alldata]
    arr.splice(value, 1)
    setalldata(arr)
  }
  const selectDiskSet = value => {
    setselectedDisk(value)
  }

  function validateNumberInput(inputValue) {
    const regex = customRegex?.onlyDigitsRegex
    return regex.test(inputValue)
  }

  const validateMBSizeInput = (value) => {
    const regex = customRegex?.mbSizeRegex
    return regex.test(value)
  }

  const handleTestmount = (e, index) => {
    let p = [...alldata]
    p[index].mountpoint = e?.target?.value
    setalldata(p)
  }
  // const handleTestsize = (e, index) => {
  //   let p = [...alldata]
  //   // let mountpoint = p[index].mountpoint
  //   // p[index].size = e?.target?.value
  //   if(alldata?.length === index + 1){ 
  //     if(validateMBSizeInput(e?.target?.value) || e.target.value === ""){
  //       p[index].size = e?.target?.value
  //       if(e?.target?.value <= 100){
  //         const isDuplicate = mbSizeError.some((error) => error.index === index);
  //         if(!isDuplicate){ 
  //           let newError = {index: index, error:"Partition size should be greater than 100 or must be a *."}
  //           setMBSizeError((prevErrors) => [...prevErrors, newError]);
  //         }
  //       }else if(e?.target?.value == "*" || e?.target?.value > 100){
  //         const updatedErrors = mbSizeError.filter((error) => error.index !== index);
  //         setMBSizeError(updatedErrors);
  //       }
  //     }
  //   }else{
  //     if(validateMBSizeInput(e?.target?.value) || e.target.value === ""){
  //       p[index].size = e?.target?.value
  //       if(e?.target?.value == "*"){
  //         const isDuplicate = mbSizeError.some((error) => error.index === index);
  //         if(!isDuplicate){
  //           let newError = {index: index, error:"Only the last partition can use all remaining disk space."}
  //           setMBSizeError((prevErrors) => [...prevErrors, newError]);
  //         }else if(isDuplicate){
  //           const updatedErrors = mbSizeError.filter((error) => error.index !== index);
  //           setMBSizeError(updatedErrors);
  //           let newError = {index: index, error:"Only the last partition can use all remaining disk space."}
  //           setMBSizeError((prevErrors) => [...prevErrors, newError]);
  //         }
  //       }else if(e?.target?.value <= 100){
  //         const isDuplicate = mbSizeError.some((error) => error.index === index);
  //         if(!isDuplicate){
  //           let newError = {index: index, error:"Partition size should be greater than 100."}
  //           setMBSizeError((prevErrors) => [...prevErrors, newError]);
  //         }else if(isDuplicate){
  //           const updatedErrors = mbSizeError.filter((error) => error.index !== index);
  //           setMBSizeError(updatedErrors);
  //           let newError = {index: index, error:"Partition size should be greater than 100."}
  //           setMBSizeError((prevErrors) => [...prevErrors, newError]);
  //         }
  //       }else if(e?.target?.value != "*" || e?.target?.value > 100){
  //         const updatedErrors = mbSizeError.filter((error) => error.index !== index);
  //         setMBSizeError(updatedErrors);
  //       }
  //     }
  //   }
    
  //   /**
  //    * Partition size should be greater than 100
  //    * Only the last partition can use all remaining disk space
  //    */
  //   // if(p[index].size <= 100){
  //   //   setMBSizeError({index: p[index], error:"Partition size should be greater than 100."})
  //   // }

  //   setalldata(p)
  // }

  /**
  * Partition size should be greater than 100
  * Only the last partition can use all remaining disk space
  */
  const handleTestsize = (e, index) => {
    let p = [...alldata];
    let errorText = "";
  
    if (e?.target?.value === "") {
      p[index].size = "";
      errorText = "Required.";
      const isDuplicate = mbSizeError.some((error) => error.index === index);

      if (isDuplicate) {
        const updatedErrors = mbSizeError.filter((error) => error.index !== index);
        setMBSizeError(updatedErrors);
      }

      if (errorText !== "") {
        let newError = { index: index, error: errorText };
        setMBSizeError((prevErrors) => [...prevErrors, newError]);
      }
    } else if (validateMBSizeInput(e?.target?.value)) {
      p[index].size = e?.target?.value;
      const isDuplicate = mbSizeError.some((error) => error.index === index);
      if (e?.target?.value === "*" && alldata.length - 1 !== index) {
        errorText = "Only the last partition can use all remaining disk space.";
      } else if (e?.target?.value <= 100) {
        errorText = "Partition size should be greater than 100.";
      }
  
      if (isDuplicate) {
        const updatedErrors = mbSizeError.filter((error) => error.index !== index);
        setMBSizeError(updatedErrors);
      }
  
      if (errorText !== "") {
        let newError = { index: index, error: errorText };
        setMBSizeError((prevErrors) => [...prevErrors, newError]);
      }
    }

    setalldata(p)
  };

  const handleTestSelect = (e, index) => {
    let p = [...alldata]
    p[index].filesystem = e.value
    setalldata(p)
  }

  const handleNextClick = () => {
    if(mbSizeError.length == 1){
      history.push({
        pathname:`/reinstall-wizard-3`, 
        state:{
        serverid: serverid,
        wizard1Info: wizard1Info,
        wizard2Info: {
          alldata: alldata,
          selectedDisk: selectedDisk,
          selectedRaid: selectedRaid,
          partionmode: selectedPartition,
          disklist:disklist,
          numberOfDisks:raiddisk,
          FileSystemType:FileSystemType,
          DefaultData:DefaultData,
          selectedRaidType:selectedRaidType,
          partitionConfigurable:partitionConfigurable,
          featuresArray:featuresArray
        },
        wizard3Info: wizard3Info
      }})
    }
  }

  const handleBackButton = () => {
    history.push({
      pathname:`/reinstall-wizard-1`,
      state: {
        serverid: serverid,
        wizard1Info: wizard1Info,
        wizard2Info: {
          alldata: alldata,
          selectedDisk: selectedDisk,
          selectedRaid: selectedRaid,
          partionmode: selectedPartition,
          disklist:disklist,
          numberOfDisks:raiddisk,
          FileSystemType:FileSystemType,
          DefaultData:DefaultData,
          selectedRaidType:selectedRaidType,
          partitionConfigurable:partitionConfigurable,
          featuresArray:featuresArray
        },
        wizard3Info: wizard3Info
      }
    })
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
          <div className="wizard-step one">
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

                  <div className="reinstall-buttons">
                    <div className="card-header p-0 d-flex align-items-center align-items-center justify-content-center">
                      <div className="header-count bg-yellow">
                        <p className="text-white">2</p>
                      </div>
                      <h6 className="text-blue font-14  font-semibold">
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
                <Row className="mb-5 reinstall-common">
                  <Col md={4}>
                    <div className="flex-content d-flex align-items-center">
                      <p className="font-16 text-color-v1 font-semibold">
                        Operating System
                      </p>
                      <span className="text-blue font-16 font-normal mx-3">
                        -
                      </span>
                      <p className="font-18 text-color font-normal">
                        {selectedOS?.label}
                      </p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="flex-content d-flex align-items-center">
                      <p className="font-16 text-color-v1 font-semibold">
                        Storage
                      </p>
                      <span className="text-blue font-16 font-normal mx-3">
                        -
                      </span>
                      <p className="font-18 text-color font-normal">
                        {serverDetail?.server?.disks?.Title}
                      </p>
                    </div>
                  </Col>
                </Row>
                <Form className="wiz-form">
                  <Row>
                    {/* {ControlPanelList?.length > 0 && (
                      <Col md={6}>
                        <div className="form-group select-v1">
                          <label>Select Control Panel</label>
                          <Select
                            classNamePrefix="select-v1"
                            defaultValue={selectedControlPanel}
                            options={ControlPanelList}
                            styles={customStyles}
                            onChange={selectcp}
                          />
                        </div>
                      </Col>
                    )} */}
                    <Col md={6}>
                      <div className="form-group select-v1">
                        <label>Select Disk Set</label>
                        <Select
                          classNamePrefix="select-v1"
                          value={selectedDisk}
                          options={disklist}
                          styles={customStyles}
                          onChange={selectDiskSet}
                        />
                      </div>
                    </Col>
                    {raidTypeOpt?.length > 0 && <Col md={6}>
                      <div className="form-group select-v1">
                        <label>Select RAID Type</label>
                        <Select
                          classNamePrefix="select-v1"
                          value={selectedRaidType}
                          options={raidTypeOpt}
                          styles={customStyles}
                          onChange={value => {
                            setselectedRaidType(value)
                          }}
                        />
                      </div>
                    </Col>}
                    {(selectedRaidType?.value != "NONE" && selectedRaidType?.value != undefined)&& <Col md={6}>
                      <div className="form-group select-v1">
                        <label>Select Raid Array</label>
                        <Select
                          isDisabled={selectedRaidType?.value === "NONE"}
                          classNamePrefix="select-v1"
                          value={selectedRaid}
                          options={options}
                          styles={customStyles}
                          onChange={value => {
                            setselectedRaid(value)
                            value.value === false && setraiddisk("")
                          }}
                        />
                      </div>
                    </Col>}
                    {(selectedRaidType?.value != "NONE" && selectedRaidType?.value != undefined) && <Col md={6}>
                      <div className="form-group select-v1">
                        <label>Number of disks to perform software RAID</label>
                        <input
                          type="text"
                          pattern="[0-9]+"
                          disabled={selectedRaidType?.value === "NONE"}
                          value={raiddisk}
                          onChange={e => {
                            if (validateNumberInput(e?.target?.value)) {
                              setraiddisk(e.target.value)
                            }
                          }}
                        />
                      </div>
                    </Col>}
                    <Col md={6}>
                      <div className="form-group select-v1">
                        <label>Select Partition Mode</label>
                        <Select
                          isDisabled={!partitionConfigurable}
                          classNamePrefix="select-v1"
                          value={selectedPartition}
                          options={options3}
                          styles={customStyles}
                          onChange={value => {
                            handlePartionChange(value)
                            setselectedPartition(value)
                            value.value == "Default" && setTodefault()
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                  {(featuresArray?.includes("PARTITIONING") && alldata?.length > 0) && (
                    <div className="wiz-tab-view">
                      <Row>
                        <Col md={3}>
                          <div className="tab-block">
                            <p className="text-color-v1 font-semibold d-flex align-items-center mb-3">
                              Mount Point <img className="mx-2" src={down} /> 
                            </p>
                            {/* {alldata&&alldata?.defaults?.partitions?.map((el) => {
                          el.mountpoint &&
                           <input placeholder={el.mountpoint} />
                          })} */}

                            {alldata &&
                              alldata?.map((el, index) => {
                                return (
                                  <input
                                    // placeholder={
                                    //   el.mountpoint ? el.mountpoint : ""
                                    // }
                                    className="wizard-input-focus"
                                    key={index}
                                    value={el?.mountpoint ? el?.mountpoint : ""}
                                    name="mountpoint"
                                    onChange={e => handleTestmount(e, index)}
                                    // disabled
                                    disabled={
                                      selectedPartition?.value == "Default"
                                        ? true
                                        : false
                                    }
                                  />
                                )
                              })}

                            {/* <input placeholder="/boot" />
                          <input />
                          <input placeholder="/tmp" />
                          <input placeholder="/" /> */}
                          </div>
                        </Col>
                     
                        <Col md={3}>
                          <div className="tab-block">
                            <p className="text-color-v1 font-semibold d-flex align-items-center mb-3">
                              Type here<img className="mx-2" src={down} />
                            </p>
                            {alldata &&
                              // Filesystem.length > 0 &&
                              alldata?.map((el, index) => {
                                return (
                                  <div
                                    className="form-group select-v1 tb-select-group"
                                    key={index}
                                  >
                                    <Select
                                      key={index}
                                      classNamePrefix="select-v1"
                                      // defaultValue={el?.filesystem}
                                      options={FileSystemType}
                                      styles={customStyles}
                                      value={{
                                        value: el?.filesystem,
                                        label: el?.filesystem,
                                      }}
                                      name="filesystem"
                                      onChange={e => handleTestSelect(e, index)}
                                      isDisabled={
                                        selectedPartition?.value == "Default"
                                          ? true
                                          : false
                                      }
                                    />
                                  </div>
                                )
                              })}
                            {/* <div className="form-group select-v1 tb-select-group"> */}
                            {/* <Select
                            classNamePrefix="select-v1"
                            defaultValue={options3[0]}
                            options={options3}
                            styles={customStyles}
                          />
                        </div>
                        <div className="form-group select-v1 tb-select-group">
                          <Select
                            classNamePrefix="select-v1"
                            defaultValue={options3[0]}
                            options={options3}
                            styles={customStyles}
                          />
                        </div>
                        <div className="form-group select-v1 tb-select-group">
                          <Select
                            classNamePrefix="select-v1"
                            defaultValue={options3[0]}
                            options={options3}
                            styles={customStyles}
                          />
                        </div>
                        <div className="form-group select-v1 tb-select-group">
                          <Select
                            classNamePrefix="select-v1"
                            defaultValue={options3[0]}
                            options={options3}
                            styles={customStyles}
                          /> */}
                            {/* </div> */}
                          </div>
                        </Col>
                        <Col md={3}>
                          <div className="tab-block">
                            <p className="text-color-v1 font-semibold d-flex align-items-center mb-3">
                              Size in MB <img className="mx-2" src={down} />
                            </p>
                            {alldata &&
                              alldata?.map((el, index) => {
                                return (
                                  <span className="wizard-span-input" key={index}><input
                                    className="wizard-input-focus"
                                    placeholder={el.size ? el.size : ""}
                                    key={index}
                                    value={el?.size}
                                    name="size"
                                    onChange={(e) => {
                                      handleTestsize(e, index)
                                  }}
                                    disabled={
                                      selectedPartition?.value == "Default"
                                        ? true
                                        : false
                                    }
                                  />
                                  {mbSizeError.map((error, i) => {
                                    if(error?.index === index){
                                      return <span key={i} className="wizaed2-error-text">
                                      {error?.error}
                                    </span>
                                    }
                                  })}
                                  </span>
                                )
                              })}
                          </div>
                        </Col>
                        <Col md={3}>
                          <div className="tab-block delete">
                            {/* <p className="text-color-v1 font-semibold d-flex align-items-center mb-3">
                                Delete <img className="mx-2" src={down} />
                            </p> */}
                            {alldata &&
                              alldata?.map((el, index) => {
                                return (
                                  <Row className="icon-group" key={index}>
                                    {/* <Col>
                                      <div className="form-check" key={index}>
                                        <input
                                          type="checkbox"
                                          className="form-check-input mb-0"
                                          id="customControlInline"
                                          key={index}
                                        />
                                      </div>
                                    </Col> */}
                                    <Col>
                                      <div
                                        className="deletelist"
                                        style={{
                                          cursor:
                                            selectedPartition?.value ==
                                            "Default"
                                              ? "not-allowed"
                                              : "pointer",
                                          width: "fit-content",
                                        }}
                                        id={index}
                                        onClick={e => {
                                          selectedPartition?.value !=
                                            "Default" && handleDelete(e, index)
                                        }}
                                      >
                                        <Delete />
                                      </div>
                                    </Col>
                                  </Row>
                                )
                              })}
                            {/* <Row className="icon-group">
                            <Col>
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input mb-0"
                                  id="customControlInline"
                                />
                              </div>
                            </Col>
                            <Col>
                              <Delete />
                            </Col>
                          </Row>
                          <Row className="icon-group">
                            <Col>
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input mb-0"
                                  id="customControlInline"
                                />
                              </div>
                            </Col>
                            <Col>
                              <Delete />
                            </Col>
                          </Row>
                          <Row className="icon-group">
                            <Col>
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input mb-0"
                                  id="customControlInline"
                                />
                              </div>
                            </Col>
                            <Col>
                              <Delete />
                            </Col>
                          </Row>
                          <Row className="icon-group">
                            <Col>
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input mb-0"
                                  id="customControlInline"
                                />
                              </div>
                            </Col>
                            <Col>
                              <Delete />
                            </Col>
                          </Row> */}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )}

                  <a
                    className="btn btn-primary waves-effect waves-light btn-save font-normal btnv1"
                    // to={{pathname:`/reinstall-wizard-3`, state:{selectedOS: selectedOS, osList: osList, serverDetail: serverDetail, fulldetail: {...fulldetail1, DefaultData}}}}
                    onClick={handleNextClick}
                  >
                    Next <img src={arrow} />
                  </a>
                  {/* <Link
                    className="btn btn-primary waves-effect waves-light btn-save font-normal btnv1 btn-cancel"
                    to={{pathname:`/reinstall-wizard-1`, state:{selectedOS: selectedOS, osList: osList, serverDetail: serverDetail, }}}
                  >
                    <img src={back} /> Back{" "}
                  </Link> */}
                  <a
                    className="btn btn-primary waves-effect waves-light btn-save font-normal btnv1 btn-cancel"
                    onClick={handleBackButton}
                  >
                    <img src={back} /> Back{" "}
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
export default ReinstallWizard2
