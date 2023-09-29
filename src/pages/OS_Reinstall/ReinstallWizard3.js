import React, { useEffect, useMemo, useState, useRef } from "react"
import { Link, useParams } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"

import arrow from "../../assets/images/btn-arrow.svg"
import back from "../../assets/images/back.svg"
import Select from "react-select"
import { Checkwizard } from "../../components/Common/CommonSvg"

import header from "../../assets/images/header.svg"
import Line from "../../assets/images/Line.png"
import {
  WidAppServer,
  WidIpAddress,
  WidLocation,
  WidStatus,
} from "../../components/Common/Widgets"
import TextLoader from "../../components/textLoader"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { getPartionmode } from "../../store/actions"
import { useHistory } from "react-router-dom"

import { Col, Card, Row, Form, CardBody } from "reactstrap"
import { customRegex } from "../../helpers/validation_helpers"
import { useLocation } from "react-router-dom/cjs/react-router-dom.min"
import { useReducer } from "react"

const options = [
  { value: "GMT-13", label: "GMT-13" },
  { value: "GMT-12", label: "GMT-12" },
  { value: "GMT-11", label: "GMT-11" },
  { value: "GMT-10", label: "GMT-10" },
  { value: "GMT-9", label: "GMT-9" },
  { value: "GMT-8", label: "GMT-8" },
  { value: "GMT-7", label: "GMT-7" },
  { value: "GMT-6", label: "GMT-6" },
  { value: "GMT-5", label: "GMT-5" },
  { value: "GMT-4", label: "GMT-4" },
  { value: "GMT-3", label: "GMT-3" },
  { value: "GMT-2", label: "GMT-2" },
  { value: "GMT-1", label: "GMT-1" },
  { value: "UTC", label: "UTC" },
  { value: "GMT+1", label: "GMT+1" },
  { value: "GMT+2", label: "GMT+2" },
  { value: "GMT+3", label: "GMT+3" },
  { value: "GMT+4", label: "GMT+4" },
  { value: "GMT+5", label: "GMT+5" },
  { value: "GMT+6", label: "GMT+6" },
  { value: "GMT+7", label: "GMT+7" },
  { value: "GMT+8", label: "GMT+8" },
  { value: "GMT+9", label: "GMT+9" },
  { value: "GMT+10", label: "GMT+10" },
  { value: "GMT+11", label: "GMT+11" },
  { value: "GMT+12", label: "GMT+12" },
  { value: "GMT+13", label: "GMT+13" },
]

const customStyles = {
  control: base => ({
    ...base,
    height: 50,
    minHeight: 50,
  }),
}

function ReinstallWizard3() {
  const params = useParams()
  const locationParams = useLocation()
  const hNameRef = useRef(null);
  const sshKeyRef = useRef(null);
  const serverid = locationParams?.state?.serverid
  const wizard1Info = locationParams?.state?.wizard1Info
  const wizard2Info = locationParams?.state?.wizard2Info
  const wizard3Info = locationParams?.state?.wizard3Info
  const serverDetail = wizard1Info?.serverDetail
  const [loader, setLoader] = useState(false)
  const [loading, setLoading] = useState(0)
  const [Location, setLocation] = useState()
  const [Hname, setHname] = useState("")
  const [Herror, setHerror] = useState(false)
  const [PowerCycle, setPowerCycle] = useState(false)
  const [emailLetters, setemailLetters] = useState(true)
  const [sshkey, setsshkey] = useState("")
  const [postInstallScript, setpostInstallScript] = useState("")
  const [SelectedTimezone, setSelectedTimezone] = useState(options[13])
  const [SshKeyError, setSshKeyError] = useState(false)
  const [fullDataWizard3, setFullDataWizard3] = useState({  
    hostname:"", 
    SelectedTimezone:"", 
    sshKey:"", 
    postInstallScript:"", 
    powerCycle:"",
    emailLetters: ""
  })
  const history = useHistory()

  let dispatch = useDispatch()
  const storedata = useSelector(state => state)
  useEffect(async () => {
    !serverid && history.push(history.push(`/dashboard`))

    // let alldata = storedata?.SelectedService?.data?.product
    // setfullRes(alldata)
    // alldata?.configoptions?.configoption.map(ele => {
    //   ele.option == "Location" && setLocation(ele?.value)
    // })
    if(wizard3Info){
      wizard3Info?.Hname && setHname(wizard3Info?.Hname)
      wizard3Info?.SelectedTimezone && setSelectedTimezone(wizard3Info?.SelectedTimezone)
      wizard3Info?.sshKey && setsshkey(wizard3Info?.sshKey)
      wizard3Info?.postInstallScript && setpostInstallScript(wizard3Info?.postInstallScript)
      wizard3Info?.PowerCycle && setPowerCycle(wizard3Info?.PowerCycle)
      wizard3Info?.emailLetters && setemailLetters(wizard3Info?.emailLetters)
      // setFullDataWizard3(wizard3Data)
    }
    
  }, [])

  const handlehostName = e => {
    hostnamevalid(e?.target?.value)
    setHname(e.target.value)

    !e?.target?.value && setHerror(false)
    // setFullDataWizard3({
    //   ...fullDataWizard3,
    //   hostname: e?.target?.value,
    // })
    // dispatch(
    //   getPartionmode({
    //     ...storedata?.SelectedPartion?.data,
    //     hostname: e?.target?.value,
    //   })
    // )
  }
  const hostnamevalid = e => {
    // /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(e)
    if (customRegex.hostNameRegex2.test(e)) {
      setHerror(false)
    } else {
      setHerror(true)
      //  val.name.focus()
      //  return false
    }
  }

  const handleNextClick = () => {
    Herror? hNameRef.current.focus() : SshKeyError? sshKeyRef.current.focus() : null

    if(!Herror && !SshKeyError){
      history.push({
        pathname: `/reinstall-wizard-4`,
        state: {
          serverid: serverid,
          wizard1Info: wizard1Info,
          wizard2Info: wizard2Info,
          wizard3Info:{
            SelectedTimezone:SelectedTimezone,
            PowerCycle:PowerCycle,
            emailLetters:emailLetters,
            Hname:Hname,
            sshKey:sshkey,
            postInstallScript:postInstallScript
          }
        }
      })
    }
  }

  const handleBackButton = () => {
    Herror? hNameRef.current.focus() : SshKeyError? sshKeyRef.current.focus() : null

    if(!Herror && !SshKeyError){
      history.push({
        pathname: `/reinstall-wizard-2`,
        state: {
          serverid: serverid,
          wizard1Info: wizard1Info,
          wizard2Info: wizard2Info,
          wizard3Info:{
            SelectedTimezone:SelectedTimezone,
            PowerCycle:PowerCycle,
            emailLetters:emailLetters,
            Hname:Hname,
            sshKey:sshkey,
            postInstallScript:postInstallScript
          }
        }
      })
    }
  }

//   useEffect(() => {
//     inputRef.current.focus();
//  }, []);
 
  return (
    <React.Fragment>
      <div className="page-content admin-pg wiz">
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
                      <div className="header-count orenge-count bg-v2">
                        <Checkwizard />
                      </div>
                      <h6 className="text-blue font-14  font-semibold">
                        Disk & Raid
                      </h6>
                    </div>
                      <i className="uil uil-angle-right"></i>
                  </div>

                  <div className="reinstall-buttons">
                    <div className="card-header p-0 d-flex align-items-center align-items-center justify-content-center">
                      <div className="header-count bg-yellow">
                        <p className="text-white">3</p>
                      </div>
                      <h6 className=" font-14  font-semibold">
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
                <Form className="wiz-form check reinstall-common ">
                  <Row>
                    {wizard2Info?.featuresArray?.includes("HOSTNAME") && <Col md={12}>
                      <div className="form-group select-v1">
                        <label>Hostname</label>
                        <input
                          className="wizard-input-focus"
                          placeholder="rsx.123.redswitches.net"
                          value={Hname}
                          onChange={e => handlehostName(e)}
                          ref={hNameRef}
                        />
                        <p
                          style={{ color: "red" }}
                          className="font-16 font-normal text-color mt-2"
                        >
                          {/* {Herror && "Please provide valid hostname e.g hosted.redswitches.com"} */}
                          {Herror && "Please provide valid hostname e.g rsx.123.redswitches.net"}
                        </p>
                      </div>
                    </Col>}
                    {wizard2Info?.featuresArray?.includes("TIMEZONE") && <Col md={12}>
                      <div className="form-group select-v1">
                        <label>Time Zone</label>
                        <Select
                          classNamePrefix="select-v1"
                          value={SelectedTimezone}
                          options={options}
                          styles={customStyles}
                          onChange={value => {
                            setSelectedTimezone(value)
                            // setFullDataWizard3({
                            //   ...fullDataWizard3,
                            //   SelectedTimezone:value
                            // })
                            // dispatch(
                            //   getPartionmode({
                            //     ...storedata?.SelectedPartion?.data,
                            //     SelectedTimezone: value,
                            //   })
                            // )
                          }}
                        />
                      </div>
                    </Col>}
                    {wizard2Info?.featuresArray?.includes("SSH_KEYS") &&  <Col md={12}>
                      <div className="form-group select-v1">
                        <label>SSH Key</label>
                        {/* <Select
                          classNamePrefix="select-v1"
                          defaultValue={options[1]}
                          options={options4}
                          styles={customStyles}
                        /> */}
                        <textarea
                          className="ostextarea wizard-input-focus"
                          value={sshkey}
                          ref={sshKeyRef}
                          onChange={e => {
                            setsshkey(e?.target?.value)
                            dispatch(
                              getPartionmode({
                                ...storedata?.SelectedPartion?.data,
                                sshKey: e?.target?.value,
                              })
                            )
                            if (!e?.target?.value) {
                              setSshKeyError(false)
                            } else {
                              // const regex = /#ssh-rsa AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?#/
                              const regex = customRegex?.sshKey
                              const isValid = regex.test(e?.target?.value)
                              setSshKeyError(!isValid)
                            }
                          }}
                        ></textarea>
                        <p
                          style={{ color: "red" }}
                          className="font-normal text-color"
                        >
                          {SshKeyError && "Please provide valid SSH Key."}
                        </p>
                        <p className="font-16 font-normal text-color mt-2">
                          You may add your public SSH key here.
                        </p>
                      </div>
                    </Col>}
                    {wizard2Info?.featuresArray?.includes("POST_INSTALL_SCRIPTS") &&  <Col md={12}>
                      <div className="form-group select-v1">
                        <label>Post Installation Script</label>
                        {/* <Select
                          classNamePrefix="select-v1"
                          defaultValue={options[1]}
                          options={options3}
                          styles={customStyles}
                        /> */}
                        <textarea
                          className="ostextarea wizard-input-focus"
                          value={postInstallScript}
                          onChange={e => {
                            setpostInstallScript(e?.target?.value)
                            dispatch(
                              getPartionmode({
                                ...storedata?.SelectedPartion?.data,
                                postInstallScript: e?.target?.value,
                              })
                            )
                          }}
                        ></textarea>
                        {/* <p className="font-16 font-normal text-color mt-2">
                          Base64 Encoded string containing a valid bash script
                          to be run right after the installation.
                        </p> */}
                      </div>
                    </Col>}
                    <Col md={12}>
                      <Row>
                        <Col md={4}>
                          <div className="form-check s-check">
                            <input
                              type="checkbox"
                              className="form-check-input text-color font-16 font-normal"
                              id="customControlInline"
                              checked={PowerCycle}
                              onChange={() => {}}
                              onClick={() => {
                                setPowerCycle(!PowerCycle)
                                // setFullDataWizard3({
                                //   ...fullDataWizard3,
                                //   powerCycle: !PowerCycle,
                                // })
                                // dispatch(
                                //   getPartionmode({
                                //     ...storedata?.SelectedPartion?.data,
                                //     powerCycle: !PowerCycle,
                                //   })
                                // )
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="customControlInline1"
                              onClick={() => {
                                setPowerCycle(!PowerCycle)
                                // setFullDataWizard3({
                                //   ...fullDataWizard3,
                                //   powerCycle: !PowerCycle,
                                // })
                                // dispatch(
                                //   getPartionmode({
                                //     ...storedata?.SelectedPartion?.data,
                                //     powerCycle: !PowerCycle,
                                //   })
                                // )
                              }}
                            >
                              Power cycle your dedicated server
                            </label>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="form-check s-check">
                            <input
                              type="checkbox"
                              className="form-check-input text-color font-16 font-normal"
                              id="customControlInline"
                              checked={emailLetters}
                              onChange={() => {}}
                              onClick={() => {
                                setemailLetters(!emailLetters)
                                // setFullDataWizard3({
                                //   ...fullDataWizard3,
                                //   emailLetters: !emailLetters,
                                // })
                                // dispatch(
                                //   getPartionmode({
                                //     ...storedata?.SelectedPartion?.data,
                                //     emailLetters: !emailLetters,
                                //   })
                                // )
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="customControlInline2"
                              onClick={() => {
                                setemailLetters(!emailLetters)
                                // setFullDataWizard3({
                                //   ...fullDataWizard3,
                                //   emailLetters: !emailLetters,
                                // })
                                // dispatch(
                                //   getPartionmode({
                                //     ...storedata?.SelectedPartion?.data,
                                //     emailLetters: !emailLetters,
                                //   })
                                // )
                              }}
                            >
                              Receive email notification
                            </label>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  {/* <Link
                    className="btn btn-primary waves-effect waves-light btn-save font-normal btnv1"
                    // to={{pathname:
                    //   !Herror &&
                    //   !SshKeyError &&
                    //   `/reinstall-wizard-4/${params?.id}`,
                    //   state:{
                    //     osList: osList, 
                    //     selectedOS: selectedOS, 
                    //     fulldetail:fulldetail,
                    //     serverDetail:serverDetail,
                    //     fullDataWizard3:fullDataWizard3
                    //   }
                    to={{pathname:`/reinstall-wizard-4`, state:{
                        osList: osList, 
                        selectedOS: selectedOS, 
                        fulldetail:fulldetail,
                        serverDetail:serverDetail,
                        fullDataWizard3:{
                          ...fullDataWizard3, 
                          SelectedTimezone:SelectedTimezone,
                          PowerCycle:PowerCycle,
                          emailLetters:emailLetters,
                          Hname:Hname,
                          sshKey:sshkey,
                          postInstallScript:postInstallScript
                        }
                      }
                    }}
                    onClick={() =>
                      dispatch(
                        getPartionmode({
                          ...storedata?.SelectedPartion?.data,
                          SelectedTimezone: SelectedTimezone,
                          powerCycle: PowerCycle,
                          emailLetters: emailLetters,
                          hostname: Hname,
                          sshKey: sshkey,
                          postInstallScript: postInstallScript,
                        })
                      )}
                  >
                    Next <img src={arrow} />
                  </Link> */}
                  <a
                    className="btn btn-primary waves-effect waves-light btn-save font-normal btnv1"                    
                    onClick={handleNextClick}
                  >
                    Next <img src={arrow} />
                  </a>
                  {/* <Link
                    className="btn btn-primary waves-effect waves-light btn-save font-normal btnv1 btn-cancel"
                    to={{pathname:`/reinstall-wizard-2`, state:{
                      osList: osList, 
                      selectedOS: selectedOS, 
                      fulldetail:fulldetail,
                      serverDetail:serverDetail
                    }}}
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
      {loader ? <TextLoader loading={loading} /> : ""}
    </React.Fragment>
  )
}
export default ReinstallWizard3
