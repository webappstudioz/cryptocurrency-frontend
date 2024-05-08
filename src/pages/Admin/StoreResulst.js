import React, { useState, useEffect } from "react"
import { Row, Col, Card, CardBody, Form } from "reactstrap"
// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"
//redux
import { useDispatch } from "react-redux"
import { withRouter } from "react-router-dom"
import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
import Breadcrumb from "../../components/Common/Breadcrumb"
import { getTimeZones, storeGameResults } from "../../pages/Authentication/store/apiServices"
import TextLoader from "../../components/textLoader"
import { toast } from "react-toastify"
// import PermissionDenied from "./PermissionDenied"
import { setPageTitle } from "../../helpers/api_helper_rs"
import { FocusError } from 'focus-formik-error'
import Select from "react-select";

const StoreResults = props => {
  const [timeZones, setTimeZones] = useState()
  const [selectedTimeZone, setSelectedTimeZone] = useState()
  const [winningNumber, setWinningNumber] = useState()
  const [timeZoneError, setTimeZoneErro] = useState(false)
  const [winningNumError, setWinningNumError] = useState(false)
  const [loader, setLoader] = useState("")
  const [loading, setLoading] = useState("")
  const [permissionDen, setPermissionDen] = useState(false)

  const numbersList = [
    {value: "0", label: "0"},
    {value: "1", label: "1"},
    {value: "2", label: "2"},
    {value: "3", label: "3"},
    {value: "4", label: "4"},
    {value: "5", label: "5"},
    {value: "6", label: "6"},
    {value: "7", label: "7"},
    {value: "8", label: "8"},
    {value: "9", label: "9"},
    {value: "10", label: "10"},
    {value: "11", label: "11"},
    {value: "12", label: "12"},
    {value: "13", label: "13"},
    {value: "14", label: "14"},
    {value: "15", label: "15"},
    {value: "16", label: "16"},
    {value: "17", label: "17"},
    {value: "18", label: "18"},
    {value: "19", label: "19"},
    {value: "20", label: "20"},
    {value: "21", label: "21"},
    {value: "22", label: "22"},
    {value: "23", label: "23"},
    {value: "24", label: "24"},
    {value: "25", label: "25"},
    {value: "26", label: "26"},
    {value: "27", label: "27"},
    {value: "28", label: "28"},
    {value: "29", label: "29"},
    {value: "30", label: "30"},
    {value: "31", label: "31"},
    {value: "32", label: "32"},
    {value: "33", label: "33"},
    {value: "34", label: "34"},
    {value: "35", label: "35"},
    {value: "36", label: "36"},
  ]
  useEffect(() => {
    setPageTitle("Store Results")
    getTimeZoneList()
  }, [])

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 50,
      minHeight: 50,
    }),
  };

  const getTimeZoneList = async() => {
    setLoader(true)
    setLoading(true)
    try{
        let res = await getTimeZones()
        let info = res?.data?.data
        setLoader(false)
        setLoading(false)
        if(info){
            const convertedArray = info.map((obj) => ({
                value: obj.id,
                label: obj.time_zone,
              }));
              setTimeZones(convertedArray)
        }
    }catch(error){
        console.log("error",error)
        setLoader(false)
        setLoading(false)
    }
  }

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      timeZone: "",
      winningNumber: "",
    },
    validationSchema: Yup.object({
        timeZone: Yup.string(),
            // .required("Time zone is required."),
        winningNumber: Yup.string()
            // .required("Winning number is required."),
    }),
    onSubmit: async values => {
        if(!values.timeZone){
            setTimeZoneErro(true)
        }
        if(!values.winningNumber){
            setWinningNumError(true)
        }

        if(!timeZoneError && !winningNumError){
            let data = new URLSearchParams({
                id : values.timeZone,
                winning_Number : values.winningNumber
            })

            try{
                let res = await storeGameResults(data)
                console.log("res",res)
                toast.success(res?.data?.message, {
                  position: toast.POSITION.TOP_RIGHT,
                })
            }catch(error) {
                console.log("error",error)
            }

        }
     
          setloader(true)
    },
  })

  useEffect(() => {
    if(selectedTimeZone){
        validation.setFieldValue("timeZone", selectedTimeZone?.value)
        setTimeZoneErro(false)
    }

    if(winningNumber){
        validation.setFieldValue("winningNumber", winningNumber?.value)
        setWinningNumError(false)
    }
  },[selectedTimeZone, winningNumber])

  return (
    <React.Fragment>
      <div
        className={
          loader
            ? "page-content my-account overlayerloader"
            : "page-content my-account"
        }
      >
      <Breadcrumb title="Minible" breadcrumbItem="Store Results" />
        {!permissionDen ? (
          <Form
            className="form-horizontal floating-form my-account"
            onSubmit={e => {
              e.preventDefault()
              validation.handleSubmit()
              return false
            }}
          >
            <Card>
              <CardBody>
                <Row>
                    <Col lg="6">
                        <FocusError formik={validation} />
                        <label>Time Zones</label>
                        <Select
                            // isDisabled={spinner}
                            classNamePrefix="select-v1"
                            value={selectedTimeZone}
                            options={timeZones}
                            styles={customStyles}
                            onChange={(value) => {
                            setSelectedTimeZone(value)
                            }}
                        />
                        {timeZoneError &&
                            <>
                                <span className="ticket-validaton-error">
                                <img
                                    className="form-error-icon"
                                    src={rederror}
                                    alt=""
                                    height={15}
                                />
                                Time zone is required.
                                </span>
                            </>
                        }
                    </Col>
                    <Col lg="6">
                        <label>Winning Number</label>
                        <Select
                            // isDisabled={spinner}
                            classNamePrefix="select-v1"
                            value={winningNumber}
                            options={numbersList}
                            styles={customStyles}
                            onChange={(value) => {
                            setWinningNumber(value)
                            }}
                        />
                        {winningNumError &&
                            <>
                                <span className="ticket-validaton-error">
                                <img
                                    className="form-error-icon"
                                    src={rederror}
                                    alt=""
                                    height={15}
                                />
                                Winning number is required.
                                </span>
                            </>
                        }
                    </Col>
                </Row>    
                </CardBody>
            </Card>    
            <div className="btn-group mt-30">
              <button
                className="btn btn-primary w-100 waves-effect waves-light btn-cancel m-0"
                type="button"
                onClick={() => validation.resetForm({ values: "" })}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary w-100 waves-effect waves-light btn-save m-0"
                type="submit"
              >
                Save Result
              </button>
            </div>
          </Form>
        ) : (
          null
          // <PermissionDenied pageName="my account" />
        )}
        <TextLoader loading={loader} loader={loader}/>
      </div>
    </React.Fragment>
  )
}
export default withRouter(StoreResults)
