import React, { useState, useEffect, useRef } from "react"
import { Row, Col, Card, CardBody, Input, FormFeedback, Form } from "reactstrap"
// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"
//redux
import { useDispatch } from "react-redux"
import { withRouter, useLocation, useHistory } from "react-router-dom"
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
  updateUserProfile,
  getUserDetail
} from "./store/apiServices"
import { Dropdown } from "semantic-ui-react"
import TextLoader from "../../components/textLoader"
import { toast } from "react-toastify"
import PermissionDenied from "./PermissionDenied"
import { setPageTitle } from "../../helpers/api_helper_rs"
import { FocusError } from 'focus-formik-error'
import { noCountryData } from "../../constants/api/api_path"

const UpdateProfile = props => {
  const locationParams = useLocation()
  const userInfo = locationParams?.state?.userInfo
  const navigate = useHistory()
  const phoneInputRef = useRef(null);
  const [countryList, setcountryList] = useState()
  const [stateList, setstateList] = useState()
  const [selectedCountry, setselectedCountry] = useState()
  const [selectedState, setselectedState] = useState()
  const [countryError, setcountryError] = useState(true)
  const [stateError, setstateError] = useState(false)
  const [loader, setLoader] = useState(true)
  const [role, setRole] = useState()
  const [permissionDen, setPermissionDen] = useState(false)
  const [inlineLoader, setinlineLoader] = useState(false)
  const [countryname, setCountryName] = useState("")
  const [statename, setstatename] = useState("")
  const [selectedCountryCode, setSelectedCountryCode] = useState()
  const [bankQR, setBankQR] = useState()
  const [bankQRError, setBankQRError] = useState(false)
  const [cryptoQR, setCryptoQR] = useState()
  const [cryptoQRError, setCryptoQRError] = useState(false)
  const [selectedPhoneCode, setSelectedPhoneCode] = useState()

  useEffect(() => {
    setPageTitle("Update Profile")
    getcountry()
  }, [])

  useEffect(() => {
    if (userInfo?.country_id) {
      setselectedCountry(userInfo?.country_id)
      setcountryError(false)
    }
  }, [userInfo])

  useEffect(() => {
    if (countryList) {
      countryList?.map((list) => {
        if (list?.value === selectedCountry) {
          setSelectedCountryCode(list?.short_code?.toLowerCase())
          setCountryName(list?.text)
          setLoader(false)
        }
      })
    }
  }, [selectedCountry, countryList])

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
          short_code: ele.short_code
        })
      })
      setcountryList(all)
    } catch (error) {

    }
  }

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      firstName: userInfo?.first_name || "",
      lastName: userInfo?.last_name || "",
      email: userInfo?.email || "",
      doj: userInfo?.joining_date || "",
      phoneNumber: userInfo?.phone_number || "",
      address: userInfo?.address || "",
      city: userInfo?.city || "",
      zipCode: userInfo?.zip_code || "",
      cryptoId: userInfo?.crypto_id || "",
      bankName: userInfo?.bank_name || "",
      accountNumber: userInfo?.account_number || "",
      ifscCode: userInfo?.ifsc_code || "",
      accountName: userInfo?.account_holder_name || "",
      upiId: userInfo?.upi_id || "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        // .required("First name required.")
        .matches(/^[A-Za-z]+$/, "Only albhabets are allowed."),
      lastName: Yup.string()
        // .required("Last name required.")
        .matches(/^[A-Za-z]+$/, "Only albhabets are allowed"),
      email: Yup.string(),
      doj: Yup.string(),
      phoneNumber: Yup.string()
        .matches(/^([+]\d{2})?\d{10}$/, "Please enter valid Phone number."),
      // .required("Phone number is required."),
      address: Yup.string(),
      city: Yup.string(),
      zipCode: Yup.string(),
      cryptoId: Yup.string(),
      bankName: Yup.string(),
      accountNumber: Yup.string(),
      accountName: Yup.string(),
      ifscCode: Yup.string(),
      upiId: Yup.string(),
      // .required("City is required."),
      // zipCode: Yup.string().required("Zip code is required."),
    }),
    onSubmit: async values => {
      // return
      if (selectedCountry != undefined && selectedCountry != null && selectedCountry.length > 1) {
        setcountryError(false)
      } else {
        setcountryError(true)
      }
      // if (selectedState != undefined && selectedState != null && selectedState.length > 1) {
      // } else {   }

      let data = new URLSearchParams({
        user_name: userInfo?.user_name,
        first_name: values?.firstName,
        last_name: values?.lastName,
        email: userInfo?.email,
        phone_number: values?.phoneNumber,
        country_code: selectedCountryCode,
        joining_date: userInfo?.joining_date,
        address: values?.address,
        city: values?.city,
        country_id: selectedCountry,
        zip_code: values?.zipCode,
        crypto_id: values?.cryptoId,
        crypto_image: cryptoQR,
        bank_name: values?.bankName,
        account_number: values?.accountNumber,
        ifsc_code: values?.ifscCode,
        account_holder_name: values?.accountName,
        upi_id: values?.upiId,
        account_image: bankQR
      })

      // if (!stateError) {
        try {
          setLoader(true)
          let res = await updateUserProfile(userInfo?.id, data)
          if (res) {
            // handleClientInfo()
            setLoader(false)
            toast.success(res.data?.message, {
              position: toast.POSITION.TOP_RIGHT,
            })
            navigate.push("/my-account")

            // let data = loginData()
            // data.address_one = values.addressOne
            // data.address_two = values.addressTwo
            // data.city = values.city
            // data.zip_code = values.zipCode
            // data.state = statename
            // data.country = countryname
            // storeUserData(data)
            updateProfileSilent()
          }

        } catch (error) {
          setLoader(false)
          toast.error(error?.response?.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          })
        }
      }
    // },
  })

  // useEffect(async () => {
  //   console.log("userInfo", userInfo?.country_id)
  //     try {
  //       setLoader(true)
  //       if (user) {
  //         setLoader(false)
  //         // if (user?.state_id != null && (user?.state_id).length > 0) {
  //         //   setselectedState(user?.state_id)
  //         // } else {
  //         //   setselectedState("n")
  //         // }
  //         if (userInfo?.country_id != null && (userInfo?.country_id).length > 0) {
  //           try {
  //             setcountryError(false)
  //             setselectedCountry(userInfo.country_id)
  //             let data = new URLSearchParams({
  //               country_id: user.country_id,
  //             })
  //             let res = await postCountry(data)
  //             let all = []
  //             res.data.data.map(ele => {
  //               all.push({ text: ele.name, value: ele.id })
  //             })
  //             setstateList(all)
  //           } catch (error) { }
  //         } else {
  //           setselectedCountry("n")
  //         }
  //       }
  //     } catch (err) {
  //       setLoader(false)
  //         toast.error(err?.response?.data?.message, {
  //           position: toast.POSITION.TOP_RIGHT,
  //         })
  //     }
  // }, [userInfo])

  useEffect(() => {
    const countryCodeMatch = noCountryData.some((item) => item == selectedCountryCode)
    const inputElement = phoneInputRef?.current;
    let iti;
    if (inputElement) {
      iti = intlTelInput(inputElement, {
        separateDialCode: true,
        initialCountry: countryCodeMatch ? 'us' : selectedCountryCode,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js"
      });
      inputElement.addEventListener("countrychange", function () {
        const selectedCountryData = iti.getSelectedCountryData();
        setSelectedPhoneCode(selectedCountryData)
        // focusOnInput()
        countryList?.map(async (countries) => {
          if (selectedCountryData?.iso2 === countries?.short_code.toLowerCase()) {
            setselectedCountry(countries.value)
          }
        })
      });


      // Clean up by destroying the intlTelInput instance when the component unmounts
      return () => {
        iti.destroy();
      };
    }
  }, [
    phoneInputRef?.current,
    selectedCountryCode,
    countryList
  ]);

  const handleFileChange = (event, action) => {

    // console.log("action",action)
    // console.log("event",event)
    const file = event.target.files[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024; // in MB
      const fileType = file.type.split("/")[1]; // get file extension

      // Validate file size (10MB max)
      if (fileSize > 20) {
        action === "cryptoQR" ? setCryptoQRError("File size should be less than 20 MB") : setBankQRError("File size should be less than 20 MB")
      } else {
        // Validate file extension
        if (
          fileType === "jpg" ||
          fileType === "jpeg" ||
          fileType === "png" ||
          fileType === "pdf" ||
          fileType === "doc" ||
          fileType === "xls" ||
          fileType === "zip"
        ) {
          action === "cryptoQR" ? (setCryptoQR(file), setCryptoQRError("")) : (setBankQR(file), setBankQRError(""))
          // setSelectedFile(file)
          // setErrorMsg("");
        } else {
          action === "cryptoQR" ? setCryptoQRError("Only JPG, PNG, PDF, DOC, XLS, and ZIP files are allowed") : setBankQRError("Only JPG, PNG, PDF, DOC, XLS, and ZIP files are allowed")

          // setErrorMsg(
          //   "Only JPG, PNG, PDF, DOC, XLS, and ZIP files are allowed"
          // );
        }
      }
    }
  };

  const handleCountryChange = async (event, maindata) => {
    setselectedCountry(maindata.value)
    setcountryError(false)
    // try {
    //   setinlineLoader(true)
    //   let data = new URLSearchParams({
    //     country_id: maindata.value,
    //   })
    //   let res = await postCountry(data)
    //   let all = []
    //   if (res) {
    //     setinlineLoader(false)

    //     res.data.data.map(ele => {
    //       all.push({ text: ele.name, value: ele.id })
    //     })
    //     setstateList(all)
    //     setselectedCountry(maindata.value)
    //     setcountryError(false)
    //   }
    // } catch (error) {
    //   setinlineLoader(false)
    // }

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
                    <div className="form-group">
                      <Input
                        type="tel"
                        id="phone"
                        name="phoneNumber"
                        className="form-control"
                        placeholder="Phone Number"
                        innerRef={phoneInputRef}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (inputValue.startsWith(`+${selectedPhoneCode?.dialCode}`)) {
                            // Remove the dial code from the input value
                            const phoneNumberWithoutDialCode = inputValue.substring(`+${selectedPhoneCode?.dialCode}`.length);
                            // Update the form field value using formik's handleChange
                            validation.handleChange({
                              target: {
                                name: "phoneNumber",
                                value: phoneNumberWithoutDialCode,
                              },
                            });
                            // }
                          } else {
                            // Handle other changes (e.g., non-dial code input)
                            validation.handleChange(e);
                          }
                        }}
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
                          <FormFeedback type="invalid" className="info-modal">
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
                      <div id="flag-container"></div>
                    </div>
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
                  <Col lg="12">
                    <Input
                      name="address"
                      value={validation.values.address}
                      className="mt-3 input-outline"
                      placeholder="Address"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.address &&
                          validation.errors.address
                          ? true
                          : false
                      }
                    />
                    {validation.touched.address &&
                      validation.errors.address ? (
                      <>
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.address}
                        </FormFeedback>
                      </>
                    ) : null}
                  </Col>
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
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        options={countryList}
                      />
                    )}
                    {countryError && (
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
                    )}
                  </Col>
                  {/* <Col lg="6">
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
                  </Col> */}
                </Row>
              </CardBody>
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
                    <input
                      // disabled={spinner}
                      // key={inputKey}
                      id="file-upload"
                      type="file"
                      // accept=".jpg,.jpeg,.png,.pdf,.doc,.xls,.zip"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => { handleFileChange(e, "cryptoQR") }}
                      onClick={(event) => {
                        if (
                          event.target.files.length === 1 &&
                          event.target.files[0].name ===
                          cryptoQR?.name
                        ) {
                          event.target.value = null;
                        }
                      }}
                    // multiple
                    />
                    <span className="file-formats">
                      Please select files to attach (20 MB max, .jpg, .jpeg,
                      .png,)
                    </span>
                    {cryptoQRError && (
                      <span className="ticket-validaton-error">
                        {" "}
                        <img
                          className="form-error-icon"
                          src={rederror}
                          alt=""
                          height={15}
                        />
                        {cryptoQRError}
                      </span>
                    )}
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
                      name="accountNumber"
                      value={validation.values.accountNumber}
                      className="mt-3 input-outline"
                      placeholder="Account Number"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.accountNumber &&
                          validation.errors.accountNumber
                          ? true
                          : false
                      }
                    />
                    {validation.touched.accountNumber &&
                      validation.errors.accountNumber ? (
                      <>
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.accountNumber}
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
                    <input
                      // disabled={spinner}
                      // key={inputKey}
                      id="file-upload"
                      type="file"
                      // accept=".jpg,.jpeg,.png,.pdf,.doc,.xls,.zip"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => { handleFileChange(e, "bankQR") }}
                      onClick={(event) => {
                        if (
                          event.target.files.length === 1 &&
                          event.target.files[0].name ===
                          bankQR?.name
                        ) {
                          event.target.value = null;
                        }
                      }}
                    // multiple
                    />
                    <span className="file-formats">
                      Please select files to attach (20 MB max, .jpg, .jpeg,
                      .png,)
                    </span>
                    {bankQRError && (
                      <span className="ticket-validaton-error">
                        {" "}
                        <img
                          className="form-error-icon"
                          src={rederror}
                          alt=""
                          height={15}
                        />
                        {bankQRError}
                      </span>
                    )}
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
        <TextLoader loading={loader} loader={loader} />
      </div>
    </React.Fragment>
  )
}
export default withRouter(UpdateProfile)
