import PropTypes from "prop-types"
import React, { useEffect, useRef } from "react"
import { useState } from "react"
import { Row, Col, Container, Form, Input, FormFeedback } from "reactstrap"
import { Dropdown } from "semantic-ui-react"

// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"

// action
import { 
  registerUser, 
  // apiError, 
  registerSocial 
} from "../../store/actions"

// Redux
import { useSelector, useDispatch } from "react-redux"
import { withRouter, Link, useHistory } from "react-router-dom"

// import images
// import logo from "../../assets/images/Logo.svg"
import showeye from "../../assets/images/showeye.svg"
import hideeye from "../../assets/images/hideeye.svg"
// import google_i from "../../assets/images/super-g.svg"
// import registerMockup from "../../assets/images/register-mockup.png"
import email from "../../assets/images/email.svg"
import lock from "../../assets/images/Lock.svg"
import name from "../../assets/images/name.svg"

// import Slider from "react-slick"
// import "slick-carousel/slick/slick.css"
// import "slick-carousel/slick/slick-theme.css"

// import GoogleLogin from "react-google-login"
import { gapi } from "gapi-script"
import { customRegex } from "../../helpers/validation_helpers"
import TextLoader from "../../components/textLoader"
import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
import { 
  // verifyUserInvite, 
  getCountryList, 
  // getGstCountries
 } from "../Authentication/store/apiServices"
// import { toast } from "react-toastify"
import { setPageTitle } from "../../helpers/api_helper_rs"

// var settings = {
//   dots: true,
//   infinite: true,
//   speed: 500,
//   slidesToShow: 1,
//   slidesToScroll: 1,
//   arrows: false,
// }

const Register = props => {
  const phoneInputRef = useRef(null);
  const [passwordInputType, setPasswordInputType] = useState(true)
  const [loader, setLoader] = useState(false)
  // const [inviteInfo, setInviteInfo] = useState("")
  // const [inviteToken, setInviteToken] = useState("")
  const [spinner, setSpinner] = useState(false)
  const [action, setAction] = useState("")
  const [countryList, setcountryList] = useState()
  // const [gstCountries, setGstCountries] = useState()
  // const [gstCountry, setGstCountry] = useState(false)
  const dispatch = useDispatch()
  let navigate = useHistory()
  const [selectedPhoneCode, setSelectedPhoneCode] = useState()
  const [selectedCountryCode, setSelectedCountryCode] = useState()

  useEffect(() => {
    setPageTitle("Registration")
    getcountry()
    // getGstCountriesList()
  }, [])

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

  // const getGstCountriesList = async () => {
  //   try {
  //     let res = await getGstCountries()
  //     setGstCountries(res?.data?.data)
  //   } catch (error) {

  //   }
  // }

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      // email: inviteInfo?.email || "",
      email: "",
      name: "",
      password: "",
      phoneNumber: "",
      country: "",
      referralCode: "",
      termConditions: false,
      // gst:""
    },
    validationSchema: () => {
      let schema = Yup.object().shape({
        email: Yup.string()
          .required("Please enter your email ")
          .matches(customRegex.email, "Please enter a valid email "),
        name: Yup.string()
          .required("Please enter your name")
          .matches(customRegex.userName, "Please enter alphabets only")
          .matches(customRegex.spaces, "space not allowed")
          .min(3, "User name must be minimum 3 characters long")
          .max(15, "User name must be maximum 15 characters long"),
        password: Yup.string()
          .required("Please enter your password")
          .min(8, "Password must be 8 characters at least")
          .matches(
            customRegex.password,
            "Please enter atleast one uppercase letter, one lowercase letter, one digit and one special character"
          ),
        phoneNumber: Yup.string()
          .required("Please enter your phone number.")
          .matches(customRegex.phoneNumber, "Please enter a valid phone number."),
        termConditions: Yup.bool()
        .oneOf(
          [true],
          "You must accept the terms and conditions"
        ),
        country: Yup.string()
          .required('Please select your country'),
      })

      // if (!inviteInfo) {
      //   schema = schema.shape({
      //     country: Yup.string()
      //     .required('Please select your country'),
      //   })
      // }
      return schema
    },
    onSubmit: (values) => {
      const name = values?.name?.split(" ")
      let terms = 0
      values.termConditions ? (terms = 1) : (terms = 0)
      let data = new URLSearchParams({
        first_name: name[0],
        last_name: name[1],
        phone_number: values?.phoneNumber,
        email: values?.email,
        country_id: values?.country,
        password: values?.password,
        confirm_password: values?.password,
        term_condition: terms,
      })
      // if (!inviteInfo) {
      //   data.append('country_id', values.country);
      // }
      // if (inviteToken) {
      //   data.append('token', inviteToken)
      // }
      // if (values.gst) {
      //   data.append('gst_enabled', values.gst)
      // }
      setSpinner(true)
      setAction(true)
      dispatch(registerUser(data, props?.history))
    },
  })

  const handleDropdownChange = (_, { value }) => {
    // countryList.map((country) => {
    //   if (value === country?.value)
    //     gstCountries.includes(country?.short_code) ? setGstCountry(true) : setGstCountry(false)
    // })
    validation.setFieldValue('country', value);
  };

  const reduxData = useSelector(state => state?.Account)

  useEffect(() => {
    setLoader(reduxData?.loading)
    setSpinner(reduxData?.spinner)
    if (reduxData?.registrationError || reduxData?.user) {
      !reduxData?.spinner ? setAction(false) : null
      !reduxData?.loading ? setAction(false) : null
    }
  }, [reduxData])

  const responseGoogle = response => {
    if (response) {
      var data = new URLSearchParams({
        first_name: response?.profileObj?.givenName,
        last_name: response?.profileObj?.familyName,
        email: response?.profileObj?.email,
        social_id: response?.profileObj?.googleId,
        imageUrl: response?.profileObj?.imageUrl,
        social_type: "google",
      })
      setLoader(true)
      setAction(true)
      dispatch(registerSocial(data, navigate))
    }
  }

  useEffect(() => {
    const clientId =
      "471779568255-ev1mm78t9g4tu4si9ms57n692qc0pnbu.apps.googleusercontent.com"
    function start() {
      gapi?.client?.init({
        clientId: clientId,
        scope: "",
      })
    }
    gapi.load("client:auth2", start)
  }, [])

  useEffect(() => {
    // let url = window.location.href
    // let n = url.lastIndexOf("/")
    // let token = url.substring(n + 1)
    // if (token != "register" && token != "invite") {
    //   verifyInvitation(token)
    //   setInviteToken(token)
    // }
    // dispatch(apiError(""))
    document.body.className = "authentication-bg"
    // remove classname when component will unmount
    return function cleanup() {
      document.body.className = ""
    }
  }, [dispatch])

  // const verifyInvitation = async token => {
  //   setLoader(true)
  //   setAction(true)
  //   try {
  //     let userToken = new URLSearchParams({
  //       token: token,
  //     })
  //     let result = await verifyUserInvite(userToken)
  //     if (result) {
  //       setInviteInfo(result?.data?.data)
  //     }
  //     setLoader(false)
  //     setAction(false)
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message, {
  //       position: toast.POSITION.TOP_RIGHT,
  //     })
  //     setLoader(false)
  //     setAction(false)
  //   }
  // }

  useEffect(() => {
    const inputElement = phoneInputRef.current;
    if (inputElement) {
      const iti = intlTelInput(inputElement, {
        separateDialCode: true,
        initialCountry: selectedCountryCode,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js"

      });

      inputElement?.addEventListener("countrychange", function () {
        const selectedCountryData = iti.getSelectedCountryData();
        setSelectedPhoneCode(selectedCountryData)
      });

      // Clean up by destroying the intlTelInput instance when the component unmounts
      return () => {
        iti.destroy();
      };
    }
  }, [phoneInputRef?.current, selectedCountryCode]);

  useEffect(() => {
    countryList?.map((country) => {
      if (validation?.values?.country === country.value) {
        setSelectedCountryCode(country?.short_code?.toLowerCase())
      }
    })
  }, [
    selectedPhoneCode,
    selectedCountryCode,
    countryList,
    validation?.values?.country
  ])
  return (
    <React.Fragment>
      <div
        className={
          loader
            ? "account-pages register overlayerloader"
            : "account-pages register"
        }
      >
        <Container fluid>
          <Row>
            <Col lg={6} className="left-panel">
              {/* <Link onClick={(e) => {spinner? e?.preventDefault() : null }} to="/productlist"><img src={logo} alt="" /> </Link>
              <div className="slide-content">
                <Slider {...settings}>
                  <div>
                    <img src={registerMockup} alt="" />
                    <div className="inner-content">
                      <h3 className="text-white">Easy to use Dashboard</h3>
                      <p className="text-white">
                        Choose the best of product/services and get a bare{" "}
                        <br /> metal server at the lowest prices.
                      </p>
                    </div>
                  </div>
                  <div>
                    <img src={registerMockup} alt="" />
                    <div className="inner-content">
                      <h3 className="text-white">Easy to use Dashboard</h3>
                      <p className="text-white">
                        Choose the best of product/services and get a bare{" "}
                        <br /> metal server at the lowest prices.
                      </p>
                    </div>
                  </div>
                  <div>
                    <img src={registerMockup} alt="" />
                    <div className="inner-content">
                      <h3 className="text-white">Easy to use Dashboard</h3>
                      <p className="text-white">
                        Choose the best of product/services and get a bare{" "}
                        <br /> metal server at the lowest prices.
                      </p>
                    </div>
                  </div>
                </Slider> 
              </div>*/}
            </Col>
            <Col lg={6}>
              <div className="right_content">
                <div className="text-center mt-2">
                  {/* {inviteInfo && (
                    <>
                      <h5>You have been invited to {inviteInfo?.invite_by}</h5>
                      <h2>
                        {inviteInfo?.company_name} has given you access to the{" "}
                        {inviteInfo?.invite_by} account.
                      </h2>
                      <h2>
                        To accept the invite, please login or register below.
                      </h2>
                    </>
                  )} */}
                  <h5 className="text-center">Create your account</h5>
                  {/* {!inviteInfo && ( */}
                    {/* <> */}
                      {/* <GoogleLogin
                        clientId="471779568255-ev1mm78t9g4tu4si9ms57n692qc0pnbu.apps.googleusercontent.com"
                        buttonText="Login with gooogle"
                        onSuccess={responseGoogle}
                        onFailure={err => {
                        }}
                        render={renderProps => (
                          <button
                            type="submit"
                            onClick={spinner? null : renderProps.onClick}
                            className="g-btn"
                          >
                            <img src={google_i} alt="" />
                            Sign Up with Google
                          </button>
                        )}
                      /> */}

                      {/* <div className="sub_header register">
                        <p className="text-muted m-0">
                          <span>OR</span>
                        </p>
                      </div> */}
                    {/* </> */}
                  {/* )} */}
                </div>
                <div className="ragister">
                  <Form
                    className="form-horizontal"
                    onSubmit={e => {
                      e.preventDefault()
                      validation.handleSubmit()
                      return false
                    }}
                  >
                    <div className="mb-3 form-g position-relative">
                      <Input
                        disabled={spinner}
                        name="name"
                        type="text"
                        className="input-outline"
                        placeholder="Your Name"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.name || ""}
                        invalid={
                          validation.touched.name &&
                            validation.errors.name
                            ? true
                            : false
                        }
                      />
                      {validation.touched.name &&
                        validation.errors.name ? (
                        <>
                          <FormFeedback type="invalid">
                            <img
                              className="form-error-icon"
                              src={rederror}
                              alt=""
                              height={15}
                            />
                            {validation.errors.name}
                          </FormFeedback>
                        </>
                      ) : null}
                      <img className="form-icon" src={name} alt="" />
                    </div>
                    <div className="mb-3 form-g position-relative">
                      <Input
                        id="email"
                        name="email"
                        className="form-control input-outline"
                        placeholder="Your Email"
                        type="email"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email || ""}
                        // disabled={inviteInfo?.email ? true : false || spinner}
                        disabled={spinner}
                        invalid={
                          validation.touched.email && validation.errors.email
                            ? true
                            : false
                        }
                      />
                      {validation.touched.email && validation.errors.email ? (
                        <>
                          <FormFeedback type="invalid">
                            <img
                              className="form-error-icon"
                              src={rederror}
                              alt=""
                              height={15}
                            />
                            {validation.errors.email}
                          </FormFeedback>
                        </>
                      ) : null}
                      <img className="form-icon" src={email} alt="" />
                    </div>

                    <div className="mb-3 form-g position-relative">
                      <Input
                        disabled={spinner}
                        name="password"
                        autoComplete="off"
                        className="input-outline"
                        value={validation.values.password || ""}
                        type={passwordInputType ? "password" : "text"}
                        placeholder="Password"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.password &&
                            validation.errors.password
                            ? true
                            : false
                        }
                      />
                      <div
                        onClick={() => setPasswordInputType(!passwordInputType)}
                      >
                        <img
                          className="pw-icon"
                          height={18}
                          src={passwordInputType ? showeye : hideeye}
                          alt=""
                        />
                      </div>
                      {validation.touched.password &&
                        validation.errors.password ? (
                        <>
                          <FormFeedback type="invalid">
                            <img
                              className="form-error-icon"
                              src={rederror}
                              alt=""
                              height={15}
                            />
                            {validation.errors.password}
                          </FormFeedback>
                        </>
                      ) : null}

                      <img className="form-icon" src={lock} alt="" />
                    </div>
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
                    {/* {!inviteInfo &&  */}
                    <div className="mb-3 form-g position-relative">
                      <Dropdown
                        id="country"
                        name="country"
                        placeholder="Select Country"
                        fluid
                        search
                        className={(validation.touched.country && validation.errors.country) ? "input-outline is-invalid" : "input-outline"}
                        value={validation?.values?.country || ""}
                        onChange={handleDropdownChange}
                        onBlur={validation.handleBlur}
                        options={countryList}
                        invalid={
                          validation.touched.country &&
                            validation.errors.country
                            ? "true"
                            : "false"
                        }
                      />
                      {validation.touched.country && validation.errors.country ? (
                        <>
                          <FormFeedback type="invalid">
                            <img
                              className="form-error-icon"
                              src={rederror}
                              alt=""
                              height={15}
                            />
                            {validation.errors.country}
                          </FormFeedback>
                        </>
                      ) : null}
                    </div>
                    {/* } */}
                    <div className="mb-3 form-g position-relative">
                      <Input
                        disabled={spinner}
                        name="referralCode"
                        type="text"
                        className="input-outline"
                        placeholder="Referral Code"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.referralCode || ""}
                        invalid={
                          validation.touched.referralCode &&
                            validation.errors.referralCode
                            ? true
                            : false
                        }
                      />
                      {validation.touched.referralCode &&
                        validation.errors.referralCode ? (
                        <>
                          <FormFeedback type="invalid">
                            <img
                              className="form-error-icon"
                              src={rederror}
                              alt=""
                              height={15}
                            />
                            {validation.errors.referralCode}
                          </FormFeedback>
                        </>
                      ) : null}
                      <img className="form-icon" src={name} alt="" />
                    </div>
                    {/* {gstCountry && <div className="form-check">
                      <Input
                        disabled={spinner}
                        type="checkbox"
                        className="form-check-input "
                        id="enable-gst"
                        name="gst"
                        onChange={validation.handleChange}
                        // onBlur={validation.handleBlur}
                        value={validation.values.gst || ""}
                      />
                      <label htmlFor="enable-gst">
                        {" "}
                        Pay with GST
                      </label>
                    </div>} */}
                    <div className="form-check">
                      <Input
                        disabled={spinner}
                        type="checkbox"
                        className="form-check-input "
                        id="auth-terms-condition-check"
                        name="termConditions"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.termConditions || ""}
                        invalid={
                          validation.touched.termConditions &&
                            validation.errors.termConditions
                            ? true
                            : false
                        }
                      />
                      <label htmlFor="auth-terms-condition-check">
                        <span>I agree to the</span>
                        <a className="text-primary" style={{ cursor: 'pointer' }}>
                          {" "}
                          Terms & Conditions
                        </a>
                      </label>
                      {validation.touched.termConditions &&
                        validation.errors.termConditions ? (
                        <>
                          <FormFeedback type="invalid" className="terms_conditions">
                            <img
                              className="form-error-icon"
                              src={rederror}
                              alt=""
                              height={15}
                            />
                            {validation.errors.termConditions}
                          </FormFeedback>
                        </>
                      ) : null}
                    </div>

                    <div className="mt-3 text-end">
                      <button
                        className="btn btn-primary w-100 waves-effect waves-light"
                        type="submit"
                        disabled={reduxData?.spinner || reduxData?.loading || spinner}
                      >
                        {spinner ? <div className="ui active inline loader"></div> : "Sign Up"}
                      </button>
                    </div>

                    <div className="mt-4 text-center">
                      <p className="text-muted mb-0 font-normal">
                        Already have an account ?{" "}
                        <Link onClick={(e) => { spinner ? e?.preventDefault() : null }} to="/login" className="fw-medium text-primary">
                          {" "}
                          Sign In
                        </Link>
                      </p>
                    </div>
                  </Form>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <TextLoader loader={loader} loading={action} />
      </div>
    </React.Fragment>
  )
}
export default withRouter(Register)

Register.propTypes = {
  registerUser: PropTypes.func,
  registrationError: PropTypes.any,
  user: PropTypes.any,
}
