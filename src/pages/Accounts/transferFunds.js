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
} from "../../pages/Authentication/store/apiServices"
import { Dropdown } from "semantic-ui-react"
import TextLoader from "../../components/textLoader"
import { toast } from "react-toastify"
// import PermissionDenied from "./PermissionDenied"
import { setPageTitle } from "../../helpers/api_helper_rs"
import { FocusError } from 'focus-formik-error'

const TransferFunds = props => {
  const dispatch = useDispatch()
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

  useEffect(() => {
    setPageTitle("My Account")
    let roleinfo = userRole()
    setRole(roleinfo)
  }, [])
  
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      firstName: userData?.first_name || "",
      lastName: userData?.last_name || "",
      email: userData?.email || "",
      // companyName: userData?.company_name || "",
      phoneNumber: userData?.phone_number || "",
      // addressOne: userData?.address_one || "",
      // addressTwo: userData?.address_two || "",
      city: userData?.city || "",
      // zipCode: userData?.zip_code || "",
      // TaxId: userData?.tax_id || "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        // .required("First name required.")
        .matches(/^[A-Za-z]+$/, "Only albhabets are allowed."),
      lastName: Yup.string()
      // .required("Last name required.")
      .matches(/^[A-Za-z]+$/,"Only albhabets are allowed"),
      // companyName: Yup.string(),
      phoneNumber: Yup.string()
        .matches(/^([+]\d{2})?\d{10}$/, "Please enter valid Phone number.")
        .required("Phone number is required."),
      // TaxId: Yup.string(),
      // addressOne: Yup.string().required("Address 1 is required."),
      city: Yup.string().required("City is required."),
      // zipCode: Yup.string().required("Zip code is required."),
    }),
    onSubmit: async values => {
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
    getcountry()
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
      <Breadcrumb title="Minible" breadcrumbItem="Transfer Funds" />
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
                <div className="my-account-header">
                  <h6 className="font16  font-semibold">
                    Transfer To
                  </h6>
                </div>
                <br/>
                <Row>
                <Col lg="6">
                  <FocusError formik={validation} />
                  <label>Transfer Id</label>
                    <Input
                      name="userName"
                      className="mt-3 input-outline"
                      placeholder="Transfer Id"
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      // disabled={true}
                      value={validation.values.userName || ""}
                      invalid={
                        validation.touched.userName &&
                        validation.errors.userName
                          ? true
                          : false
                      }
                    />
                    {validation.touched.userName &&
                    validation.errors.userName ? (
                      <>
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.userName}
                        </FormFeedback>
                      </>
                    ) : null}
                  </Col>
                  </Row>
                  <br/>
                  <Row>
                  <Col lg="6">
                  <label>{"Account Holder's Name"}</label>
                    <Input
                      name="firstName"
                      className="mt-3 input-outline"
                      placeholder="Account Holder's Name"
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.firstName || ""}
                      invalid={
                        validation.touched.firstName &&
                        validation.errors.firstName
                          ? true
                          : false
                      }
                    />
                    {validation.touched.firstName &&
                    validation.errors.firstName ? (
                      <>
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.firstName}
                        </FormFeedback>
                      </>
                    ) : null}
                  </Col>
                  </Row>
                  <br/>
                  <div className="my-account-header">
                  <h6 className="font16  font-semibold">
                    Transfer By
                  </h6>
                </div>
                <br/>
                <Row>
                <Col lg="6">
                  <FocusError formik={validation} />
                  <label>Transfer Id</label>
                    <Input
                      name="userName"
                      className="mt-3 input-outline"
                      placeholder="User name"
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      readOnly
                      value={validation.values.userName || "USX5474"}
                      invalid={
                        validation.touched.userName &&
                        validation.errors.userName
                          ? true
                          : false
                      }
                    />
                    {validation.touched.userName &&
                    validation.errors.userName ? (
                      <>
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.userName}
                        </FormFeedback>
                      </>
                    ) : null}
                  </Col>
                  </Row>
                  <br/>
                  <Row>
                  <Col lg="6">
                  <label>{"Account Holder's Name"}</label>
                    <Input
                      name="firstName"
                      className="mt-3 input-outline"
                      placeholder="Account Holder's Name"
                      type="text"
                      readOnly
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.firstName || "C2C user"}
                      invalid={
                        validation.touched.firstName &&
                        validation.errors.firstName
                          ? true
                          : false
                      }
                    />
                    {validation.touched.firstName &&
                    validation.errors.firstName ? (
                      <>
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.firstName}
                        </FormFeedback>
                      </>
                    ) : null}
                  </Col>
                  </Row>
                  <br/>
                  <Row>
                  <Col lg="6">
                  <label>Ammount</label>
                    <Input
                      name="lastName"
                      className="mt-3 input-outline"
                      placeholder="Amount"
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.lastName || ""}
                      invalid={
                        validation.touched.lastName &&
                        validation.errors.lastName
                          ? true
                          : false
                      }
                    />
                    {validation.touched.lastName &&
                    validation.errors.lastName ? (
                      <>
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.lastName}
                        </FormFeedback>
                      </>
                    ) : null}
                  </Col>
                  </Row>
                  <br/>
                  <Row>
                  <Col lg="6">
                  <label>Password</label>
                    <Input
                      name="lastName"
                      className="mt-3 input-outline"
                      placeholder="Password"
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.lastName || ""}
                      invalid={
                        validation.touched.lastName &&
                        validation.errors.lastName
                          ? true
                          : false
                      }
                    />
                    {validation.touched.lastName &&
                    validation.errors.lastName ? (
                      <>
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.lastName}
                        </FormFeedback>
                      </>
                    ) : null}
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
                Transfer Request
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
export default withRouter(TransferFunds)
