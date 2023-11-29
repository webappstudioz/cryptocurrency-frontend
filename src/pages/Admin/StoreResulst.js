import React, { useState, useEffect } from "react"
import { Row, Col, Card, CardBody, Input, FormFeedback, Form } from "reactstrap"
// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"
//redux
import { useDispatch } from "react-redux"
import { withRouter } from "react-router-dom"
import { isUserUpdated } from "../../store/auth/userdetails/actions"
import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
import Breadcrumb from "../../components/Common/Breadcrumb"

import {
  getCountryList,
  postClientProfileDetails,
  postCountry,
  getClientInfo,
  userRole,
  storeUserData,
  loginData,
  updateProfileSilent,
  getTimeZones,
  storeGameResults,
} from "../../pages/Authentication/store/apiServices"
import { Dropdown } from "semantic-ui-react"
import TextLoader from "../../components/textLoader"
import { toast } from "react-toastify"
// import PermissionDenied from "./PermissionDenied"
import { setPageTitle } from "../../helpers/api_helper_rs"
import { FocusError } from 'focus-formik-error'
import Select from "react-select";

const StoreResults = props => {
  const dispatch = useDispatch()
  const [timeZones, setTimeZones] = useState()
  const [selectedTimeZone, setSelectedTimeZone] = useState()
  const [winningNumber, setWinningNumber] = useState()
  const [timeZoneError, setTimeZoneErro] = useState(false)
  const [winningNumError, setWinningNumError] = useState(false)
  const [userData, setUserData] = useState()
  const [domain, setdomain] = useState()
  const [product, setproduct] = useState()
  const [invoice, setinvoice] = useState()
  const [general, setgeneral] = useState()
  const [support, setsupport] = useState()
  const [countryList, setcountryList] = useState()
  const [stateList, setstateList] = useState()
  const [selectedCountry, setselectedCountry] = useState()
  const [selectedState, setselectedState] = useState()
  const [countryError, setcountryError] = useState(true)
  const [stateError, setstateError] = useState(false)
  const [loader, setloader] = useState("")
  const [role, setRole] = useState()
  const [permissionDen, setPermissionDen] = useState(false)
  const [inlineLoader, setinlineLoader] = useState(false)
  const [countryname, setcountryname] = useState("")
  const [statename, setstatename] = useState("")

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
    // let roleinfo = userRole()
    // setRole(roleinfo)
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
    try{
        let res = await getTimeZones()
        let info = res?.data?.data
        if(info){
            const convertedArray = info.map((obj) => ({
                value: obj.id,
                label: obj.time_zone,
              }));
              setTimeZones(convertedArray)
        }
    }catch(error){
        console.log("error",error)
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
                let res = storeGameResults(data)
                console.log("res",res)
            }catch(error) {
                console.log("error",error)
            }

        }
      return
      if (selectedCountry != undefined && selectedCountry != null && selectedCountry.length > 1) {
        // setcountryError(false)
      } else {
        // setcountryError(true)
      }
      // if (selectedState != undefined && selectedState != null && selectedState.length > 1) {
      // } else {   }

      let data = new URLSearchParams({
        first_name: values.firstName,
        last_name: values.lastName,
        company_name: values.companyName,
        phone_number: values.phoneNumber,
        address_one: values.addressOne,
        address_two: values.addressTwo,
        city: values.city,
        state_id: selectedState,
        zip_code: values.zipCode,
        country_id: selectedCountry,
        general: general,
        invoice: invoice,
        support: support,
        product: product,
        domain: true,
        tax_id: values.TaxId,
      })

      if (!stateError) {
        try {
          setloader(true)
          let res = await postClientProfileDetails(data)
          if (res) {
            handleClientInfo()
            setloader(false)
            toast.success(res.data?.message, {
              position: toast.POSITION.TOP_RIGHT,
            })

            let data = loginData()
            data.address_one = values.addressOne
            data.address_two = values.addressTwo
            data.city = values.city
            data.zip_code = values.zipCode
            data.state = statename
            data.country = countryname
            storeUserData(data)
            updateProfileSilent()
          }
          
        } catch (error) {
            setloader(false)
            toast.error(error?.response?.data?.message, {
              position: toast.POSITION.TOP_RIGHT,
            })
        }
      }
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

//   console.log("form", validation)
  const getcountry = async () => {
    try {
      let res = await getCountryList()
      let all = []
      res.data.data.map(ele => {
        all.push({
          value: ele.name,
          flag: (
            <img value={ele.id} height={15} width={15} src={ele.country_flag} />
          ),
          text: ele.name,
          value: ele.id,
        })
      })
      setcountryList(all)
    } catch (error) {
      
    }
  }

  const country = async (event,maindata) => {
    try {
      setinlineLoader(true)
      let data = new URLSearchParams({
        country_id: maindata.value,
      })
      let res = await postCountry(data)
      let all = []
      if (res) {
        setinlineLoader(false)

        res.data.data.map(ele => {
          all.push({ text: ele.name, value: ele.id })
        })
        setstateList(all)
        setselectedCountry(maindata.value)
        setcountryError(false)
      }
    } catch (error) {
      setinlineLoader(false)
    }
  }

  const state = (event, maindata) => {
    setselectedState(maindata.value)
  }

  useEffect(async () => {
    // getcountry()
    if(role){
    try {
      setloader(true)
      let userInfo = await handleClientInfo()
      let user = userInfo
      if (user) {
        setloader(false)
        setPermissionDen(false)
        setgeneral(user.general)
        setinvoice(user.invoice)
        setdomain(user.domain)
        setproduct(user.product)
        setsupport(user.support)
        if (user?.state_id != null && (user?.state_id).length > 0) {
          setselectedState(user?.state_id)
        } else {
          setselectedState("n")
        }
        if (user?.country_id != null && (user?.country_id).length > 0) {
          try {
            setcountryError(false)
            setselectedCountry(user.country_id)
            let data = new URLSearchParams({
              country_id: user.country_id,
            })
            let res = await postCountry(data)
            let all = []
            res.data.data.map(ele => {
              all.push({ text: ele.name, value: ele.id })
            })
            setstateList(all)
          } catch (error) {}
        } else {
          setselectedCountry("n")
        }
      }
    } catch (err) {
      setloader(false)
      if (err?.response?.data?.status_code == 403) {
        setPermissionDen(true)
      }
      if (err?.response?.data?.status_code != 401) {
        setPermissionDen(true)
        toast.error(err?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      }
    }}
  }, [role])

  const setEmailprefrence = (name, event) => {
    if (name == "invoice") {
      setinvoice(!invoice)
    } else if (name == "general") {
      setgeneral(!general)
    } else if (name == "support") {
      setsupport(!support)
    } else if (name == "product") {
      setproduct(!product)
    } else if (name == "domain") {
      setdomain(!domain)
    }
  }

  const handleClientInfo = async() => {
    try{
      let res = await getClientInfo()
      if (role == "client") {
        dispatch(isUserUpdated(res?.data?.data))
        storeUserData(res?.data?.data)
      }
      setUserData(res?.data?.data)
      setPermissionDen(false)
      setloader(false)
      return res?.data?.data
    }catch(error) {
      setloader(false)
      if(error?.response?.data?.status_code == 403){
        setPermissionDen(true)
      } 
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

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
                                Time Zone is required.
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
