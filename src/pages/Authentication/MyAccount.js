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
import PermissionDenied from "./PermissionDenied"
import { setPageTitle } from "../../helpers/api_helper_rs"
import { FocusError } from 'focus-formik-error'

const MyAccount = props => {
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
                    Personal Details
                  </h6>
                </div>
                <Row>
                <Col lg="6">
                  <FocusError formik={validation} />
                    <Input
                      name="userName"
                      className="mt-3 input-outline"
                      placeholder="User name"
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      disabled={true}
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
                  <Col lg="6">
                    <Input
                      name="firstName"
                      className="mt-3 input-outline"
                      placeholder="First name"
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
                  <Col lg="6">
                    <Input
                      name="lastName"
                      className="mt-3 input-outline"
                      placeholder="Last name"
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
                  <Col lg="6">
                    <Input
                      name="email"
                      className="mt-3 input-outline"
                      placeholder="Email"
                      type="email"
                      value={validation.values.email || ""}
                      readOnly
                    />
                  </Col>
                  {/* <Col lg="6">
                    <Input
                      name="companyName"
                      className="mt-3 input-outline"
                      placeholder="Company name"
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.companyName || ""}
                      invalid={
                        validation.touched.companyName &&
                        validation.errors.companyName
                          ? true
                          : false
                      }
                    />
                    {validation.touched.companyName &&
                    validation.errors.companyName ? (
                      <>
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.companyName}
                        </FormFeedback>
                      </>
                    ) : null}
                  </Col> */}
                  <Col lg="6">
                    <Input
                      name="phoneNumber"
                      className="mt-3 input-outline"
                      placeholder="Phone number"
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.phoneNumber || ""}
                      invalid={
                        validation.touched.phoneNumber &&
                        validation.errors.phoneNumber
                          ? true
                          : false
                      }
                    />
                    {validation.touched.phoneNumber &&
                    validation.errors.phoneNumber ? (
                      <>
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.phoneNumber}
                        </FormFeedback>
                      </>
                    ) : null}
                  </Col> 
                  <Col lg="6">
                    <Input
                      name="doj"
                      className="mt-3 input-outline"
                      placeholder="Date of Joining"
                      type="text"
                      disabled={true}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.doj || "10-07-2023"}
                      invalid={
                        validation.touched.doj &&
                        validation.errors.doj
                          ? true
                          : false
                      }
                    />
                    {validation.touched.doj &&
                    validation.errors.doj ? (
                      <>
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.doj}
                        </FormFeedback>
                      </>
                    ) : null}
                  </Col>
                  {/* <Col lg="6">
                    <Input
                      name="TaxId"
                      className="mt-3 input-outline"
                      placeholder="Tax id"
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.TaxId || ""}
                      invalid={
                        validation.touched.TaxId && validation.errors.TaxId
                          ? true
                          : false
                      }
                    />
                    {validation.touched.TaxId && validation.errors.TaxId ? (
                      <>
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.TaxId}
                        </FormFeedback>
                      </>
                    ) : null}
                  </Col> */}
                {/* </Row>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className="my-account-header">
                  <h6 className="font16  font-semibold">Account Details</h6>
                </div>
                <Row> */}
                  <Col lg="12">
                    <Input
                      name="addressOne"
                      value={validation.values.addressOne}
                      className="mt-3 input-outline"
                      placeholder="Address 1"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.addressOne &&
                        validation.errors.addressOne
                          ? true
                          : false
                      }
                    />
                    {validation.touched.addressOne &&
                    validation.errors.addressOne ? (
                      <>
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.addressOne}
                        </FormFeedback>
                      </>
                    ) : null}
                  </Col>
                  {/* <Col lg="12">
                    <Input
                      name="addressTwo"
                      value={validation.values.addressTwo}
                      className="mt-3 input-outline"
                      placeholder="Address 2"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                    />
                  </Col> */}
                  <Col lg="6">
                    <Input
                      name="city"
                      value={validation.values.city}
                      className="mt-3 input-outline"
                      placeholder="City"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.city && validation.errors.city
                          ? true
                          : false
                      }
                    />
                    {validation.touched.city && validation.errors.city ? (
                      <>
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.city}
                        </FormFeedback>
                      </>
                    ) : null}
                  </Col>
                  <Col lg="6">
                    <Input
                      name="zipCode"
                      value={validation.values.zipCode}
                      className="mt-3 input-outline"
                      placeholder="Zip Code"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.zipCode && validation.errors.zipCode
                          ? true
                          : false
                      }
                    />
                    {validation.touched.zipCode && validation.errors.zipCode ? (
                      <>
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.zipCode}
                        </FormFeedback>
                      </>
                    ) : null}
                  </Col>
                  <Col lg="6">
                    {selectedCountry && (
                      <Dropdown
                        placeholder="Select Country"
                        fluid
                        search
                        className="country-Drop input-outline"
                        defaultValue={selectedCountry}
                        onChange={country}
                        options={countryList}
                      />
                    )}
                    {/* {countryError && (
                      <div style={{ display: "flex" }}>
                        <img
                          className="form-error-icon"
                          src={rederror}
                          alt=""
                          height={15}
                        />
                        <span style={{ color: "red", marginLeft: "3px" }}>
                          Country required
                        </span>
                      </div>
                    )} */}
                  </Col>
                  <Col lg="6">
                    {!inlineLoader ? (
                      <>
                        {selectedState && (
                          <Dropdown
                            placeholder="Select State"
                            fluid
                            search
                            className="state-Drop input-outline"
                            defaultValue={selectedState}
                            onChange={state}
                            options={stateList}
                          />
                        )}
                      </>
                    ) : (
                      <div className=" stateload ui segment">
                        <div className="ui active inverted dimmer">
                          <div className="ui text loader"></div>
                        </div>
                        <p></p>
                      </div>
                    )}
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <Card className="m-0">
              {/* <CardBody>
                <div className="my-account-header">
                  <h6 className="font16 font-semibold mb-20">
                    Email preferences
                  </h6>
                </div>
                <div className="check-group">
                  <div
                    className="form-check d-flex align-items-center"
                    onClick={event => setEmailprefrence("general", event)}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input"
                      defaultChecked={general}
                    />
                    <label
                      className="form-check-label d-flex align-items-center"
                      htmlFor="customControlInline"
                    >
                      <p className="text-color-v1 text-color-v1 font-small">
                        General Emails
                      </p>
                      <b>-</b>
                      <span>General Announcements & Password Reminders</span>
                    </label>
                  </div>
                  <div
                    className="form-check d-flex align-items-center"
                    onClick={() => setEmailprefrence("invoice")}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input"
                      defaultChecked={invoice}
                    />
                    <label
                      className="form-check-label d-flex align-items-center"
                      htmlFor="customControlInline"
                    >
                      <p className="text-color-v1 text-color-v1 font-small">
                        Invoice Emails
                      </p>
                      <b>-</b>
                      <span>Invoices & Billing Reminders</span>
                    </label>
                  </div>
                  <div
                    className="form-check d-flex align-items-center"
                    onClick={() => setEmailprefrence("support")}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input"
                      defaultChecked={support}
                    />
                    <label
                      className="form-check-label d-flex align-items-center"
                      htmlFor="customControlInline3"
                    >
                      <p className="text-color-v1 text-color-v1 font-small">
                        Support Emails
                      </p>
                      <b>-</b>
                      <span>
                        Receive a copy of all support ticket communications
                        created by the parent account holder
                      </span>
                    </label>
                  </div>
                  <div
                    className="form-check d-flex align-items-center"
                    onClick={() => setEmailprefrence("product")}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input"
                      defaultChecked={product}
                    />
                    <label
                      className="form-check-label d-flex align-items-center"
                      htmlFor="customControlInline5"
                    >
                      <p className="text-color-v1 text-color-v1 font-small">
                        Product Emails
                      </p>
                      <b>-</b>
                      <span>Order Details, Welcome Emails, etc...</span>
                    </label>
                  </div>
                  <div className="form-check d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked
                      readOnly
                    />
                    <label
                      className="form-check-label d-flex align-items-center"
                      htmlFor="customControlInline6"
                    >
                      <p className="text-color-v1 text-color-v1 font-small">
                        Domain Emails
                      </p>
                      <b>-</b>
                      <span>
                        Renewal Notices, Registration Confirmations, etc...{" "}
                      </span>
                    </label>
                  </div>
                </div>
              </CardBody> */}
            </Card>
            <Card>
              <CardBody>
                <div className="my-account-header">
                  <h6 className="font16  font-semibold">Crypto Currency Account Details</h6>
                </div>
                <Row>
                <Col lg="6">
                    <Input
                      name="cryptoId"
                      value={validation.values.cryptoId}
                      className="mt-3 input-outline"
                      placeholder="Crypto Id"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.cryptoId &&
                        validation.errors.cryptoId
                          ? true
                          : false
                      }
                    />
                    {validation.touched.cryptoId &&
                    validation.errors.cryptoId ? (
                      <>
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.cryptoId}
                        </FormFeedback>
                      </>
                    ) : null}
                  </Col>
                <Col lg="6">
                    <Input
                      name="cryptoQRCode"
                      type="file"
                      value={validation.values.cryptoQRCode}
                      className="mt-3 input-outline"
                      placeholder="Crypto QR Code"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.cryptoQRCode &&
                        validation.errors.cryptoQRCode
                          ? true
                          : false
                      }
                    />
                    {validation.touched.cryptoQRCode &&
                    validation.errors.cryptoQRCode ? (
                      <>
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.cryptoQRCode}
                        </FormFeedback>
                      </>
                    ) : null}
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className="my-account-header">
                  <h6 className="font16  font-semibold">Bank Account Details</h6>
                </div>
                <Row>
                <Col lg="12">
                    <Input
                      name="bankName"
                      value={validation.values.bankName}
                      className="mt-3 input-outline"
                      placeholder="Bank Name"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.bankName &&
                        validation.errors.bankName
                          ? true
                          : false
                      }
                    />
                    {validation.touched.bankName &&
                    validation.errors.bankName ? (
                      <>
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.bankName}
                        </FormFeedback>
                      </>
                    ) : null}
                  </Col>
                  <Col lg="6">
                    <Input
                      name="accountNum"
                      value={validation.values.accountNum}
                      className="mt-3 input-outline"
                      placeholder="Account Number"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.accountNum &&
                        validation.errors.accountNum
                          ? true
                          : false
                      }
                    />
                    {validation.touched.accountNum &&
                    validation.errors.accountNum ? (
                      <>
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.accountNum}
                        </FormFeedback>
                      </>
                    ) : null}
                  </Col>
                  <Col lg="6">
                    <Input
                      name="ifscCode"
                      value={validation.values.ifscCode}
                      className="mt-3 input-outline"
                      placeholder="IFCS Code"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.ifscCode &&
                        validation.errors.ifscCode
                          ? true
                          : false
                      }
                    />
                    {validation.touched.ifscCode &&
                    validation.errors.ifscCode ? (
                      <>
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.ifscCode}
                        </FormFeedback>
                      </>
                    ) : null}
                  </Col>
                  <Col lg="12">
                    <Input
                      name="accountName"
                      value={validation.values.accountName}
                      className="mt-3 input-outline"
                      placeholder="Account Name"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.accountName &&
                        validation.errors.accountName
                          ? true
                          : false
                      }
                    />
                    {validation.touched.accountName &&
                    validation.errors.accountName ? (
                      <>
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.accountName}
                        </FormFeedback>
                      </>
                    ) : null}
                  </Col>
                  <Col lg="6">
                    <Input
                      name="upiId"
                      value={validation.values.upiId}
                      className="mt-3 input-outline"
                      placeholder="UPI Id"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.upiId &&
                        validation.errors.upiId
                          ? true
                          : false
                      }
                    />
                    {validation.touched.upiId &&
                    validation.errors.upiId ? (
                      <>
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.upiId}
                        </FormFeedback>
                      </>
                    ) : null}
                  </Col>
                  <Col lg="6">
                    <Input
                      name="bankQRCode"
                      type="file"
                      value={validation.values.bankQRCode}
                      className="mt-3 input-outline"
                      placeholder="Address 1"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.bankQRCode &&
                        validation.errors.bankQRCode
                          ? true
                          : false
                      }
                    />
                    {validation.touched.bankQRCode &&
                    validation.errors.bankQRCode ? (
                      <>
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.bankQRCode}
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
                Save Changes
              </button>
            </div>
          </Form>
        ) : (
          <PermissionDenied pageName="my account" />
        )}
        <TextLoader loading={loader} loader={loader}/>
      </div>
    </React.Fragment>
  )
}
export default withRouter(MyAccount)
