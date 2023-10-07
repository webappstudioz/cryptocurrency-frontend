import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import { Row, Col, Alert, Container, Form } from "reactstrap"

// Redux
import { useSelector, useDispatch } from "react-redux"

// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"

// import images
import logo from "../../assets/images/Logo.svg"
import mockup2 from "../../assets/images/mockup2.png"
import tick from "../../assets/images/tick-mark.svg"

import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import OtpInput from "react-otp-input"
import {
  registerConfirm,
  resendOtp,
  storeUserData,
  storeAuthToken,
} from "./store/apiServices"
import { withRouter, Link, useHistory, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import {
  decrypt,
  setPageTitle,
  storeLoginTime,
} from "../../helpers/api_helper_rs"
import { bake_cookie } from "sfcookies"
import { SETTINGS } from "../../constants/api/api_path"
import TextLoader from "../../components/textLoader"
import { registerUserSuccessful, registerSilentUser } from "../../store/actions"

var settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
}

const StepVerification = () => {
  const location = useLocation()
  // const { search } = useLocation()
  const parameters = new URLSearchParams(location?.search)
  const verificationToken = parameters.get("token")
  const [userInfo, setUserInfo] = useState({ token: "", email: "" })
  const [code, setCode] = useState("")
  const [spinner, setSpinner] = useState(false)
  const [disableBtn, setDisableBtn] = useState(false)
  const [action, setAction] = useState("")
  const dispatch = useDispatch()
  let navigate = useHistory()

  useEffect(() => {
    if (verificationToken) {
      setUserInfo({ token: verificationToken })
    } else {
      if(location?.state){
        setUserInfo({ token:  location?.state?.token, email: location?.state?.email })
      }
      // let user = JSON.parse(localStorage.getItem("jwt"))
      // if (user) {
      //   user = JSON.parse(decrypt(user))
      //   setUserInfo({ token: user.token, email: user.email })
      // }
    }
  }, [verificationToken])

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: userInfo.email,
    },
    validationSchema: Yup.object({
      // email: Yup.string().required("Please Enter Your Email"),
    }),

    onSubmit: () => {
      navigate.push("/dashboard")
      return
      setSpinner(true)
      setAction(true)
      var data = new URLSearchParams({
        token: userInfo.token,
        otp: code,
      })
      registerConfirm(data)
        .then(res => {
          if (res.data) {
            setSpinner(false)
            setAction(false)
            toast.success(res?.data?.message, {
              position: toast.POSITION.TOP_RIGHT,
            })
            dispatch(registerSilentUser())
            localStorage.removeItem("jwt")
            let urldetail = res?.data?.data?.url_detail
            storeAuthToken(res?.data?.data?.token)
            storeUserData(res?.data?.data)
            dispatch(registerUserSuccessful(res?.data?.data))
            storeLoginTime()
            if (urldetail) {
              bake_cookie(SETTINGS.GUESTTOKEN, urldetail?.cart_token)
              navigate.push(`/product-checkout`)
            } else {
              navigate.push("/dashboard")
            }
          }
        })
        .catch(err => {
          setSpinner(false)
          setAction(false)
          toast.error(err?.response?.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          })
        })
    },
  })

  const handleResend = async token => {
    setCode("")
    setDisableBtn(true)
    setAction(true)
    await resendOtp(token)
      .then(res => {
        toast.success(res?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        setDisableBtn(false)
        setAction(false)
      })
      .catch(err => {
        toast.error(err?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        setDisableBtn(false)
        setAction(false)
      })
  }

  useEffect(() => {
    setPageTitle("Verfication")
    document.body.className = "authentication-bg"
    // remove classname when component will unmount
    return function cleanup() {
      document.body.className = ""
    }
  })
  const { forgetError, forgetSuccessMsg } = useSelector(state => ({
    forgetError: state.ForgetPassword.forgetError,
    forgetSuccessMsg: state.ForgetPassword.forgetSuccessMsg,
  }))

  const handleChange = code => setCode(code)



  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="mdi mdi-home-variant h2"></i>
        </Link>
      </div>
      <div className="account-pages forgot">
        <Container fluid>
          <Row>
            <Col lg={6} sm={12} className="left-panel">
              {/* <Link to="/productlist">
                <img src={logo} alt="" />{" "}
              </Link>
              <div className="slide-content">
                <Slider {...settings}>
                  <div>
                    <img src={mockup2} alt="" />
                    <div className="inner-content">
                      <h3 className="text-white">See Server Information</h3>
                      <p className="text-white">
                        Pick one of our 20+ server locations packed with bare{" "}
                        <br /> metal servers and host your applications
                        instantly.
                      </p>
                    </div>
                  </div>
                  <div>
                    <img src={mockup2} alt="" />
                    <div className="inner-content">
                      <h3 className="text-white">See Server Information</h3>
                      <p className="text-white">
                        Pick one of our 20+ server locations packed with bare{" "}
                        <br /> metal servers and host your applications
                        instantly.
                      </p>
                    </div>
                  </div>
                  <div>
                    <img src={mockup2} alt="" />
                    <div className="inner-content">
                      <h3 className="text-white">See Server Information</h3>
                      <p className="text-white">
                        Pick one of our 20+ server locations packed with bare{" "}
                        <br /> metal servers and host your applications
                        instantly.
                      </p>
                    </div>
                  </div>
                </Slider>
              </div> */}
            </Col>
            <Col lg={6}>
              <div className="right_content">
                <div className="text-center mt-2">
                  <img className="s-icon mb-0 mb-3" src={tick} alt="" />
                  <h5 className="m-0">Verification</h5>
                  <div className="forgot-content">
                    {userInfo?.email ? (
                      <p className="text-muted m-0 font-normal">
                        We’ve sent a 6-character code to{" "}
                        <span className="fw-medium text-primary font-normal">
                          {userInfo?.email}
                        </span>
                        .The code expires shortly, so please enter it soon.
                      </p>
                    ) : (
                      <p className="text-muted m-0 font-normal">
                        Please enter 6-character code We’ve sent to your
                        mail.The code expires shortly, so please enter it soon.
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-2 mt-4">
                  {/* {forgetError && forgetError ? (
                    <Alert
                      color="danger"
                      className="text-center mb-4"
                      style={{ marginTop: "13px" }}
                    >
                      {forgetError}
                    </Alert>
                  ) : null}
                  {forgetSuccessMsg ? (
                    <Alert
                      color="success"
                      className="text-center mb-4"
                      style={{ marginTop: "13px" }}
                    >
                      {forgetSuccessMsg}
                    </Alert>
                  ) : null} */}

                  <div className="p-2 mt-4">
                    <Form
                      className="form-horizontal digit-form"
                      onSubmit={e => {
                        e.preventDefault()
                        validation.handleSubmit()
                        return false
                      }}
                    >
                      <div className="mb-3 form-g position-relative input-group d-flex align-items-center justify-content-center">
                        <OtpInput
                          value={code}
                          onChange={handleChange}
                          numInputs={6}
                          separator={<span style={{ width: "8px" }}></span>}
                          isInputNum={true}
                          shouldAutoFocus={true}
                          inputStyle={{
                            border: "1px solid #EFEFF2",
                            borderRadius: "12px",
                            width: "55px",
                            height: "55px",
                            fontSize: "20px",
                            color: "#000",
                            fontWeight: "600",
                            caretColor: "#3F3D65",
                          }}
                          focusStyle={{
                            border: "1px solid #285a3d",
                            outline: "none",
                            borderRadius: "12px",
                          }}
                        ></OtpInput>
                      </div>
                      <button
                        className="btn btn-primary w-100 waves-effect waves-light d-flex justify-content-center align-items-center"
                        type="submit"
                        disabled={
                          code == "" || code.length != 6
                            ? true
                            : false || spinner || disableBtn
                        }
                      >
                        {spinner ? (
                          <div className="ui active inline loader"></div>
                        ) : (
                          "Verify"
                        )}
                      </button>
                    </Form>
                  </div>

                  <div className="mt-4 text-center"></div>

                  {userInfo?.token && (
                    <div className="mt-4 text-center form-footer ">
                      <p className="mb-0 text-muted font-normal">
                        Can’t find your code?{" "}
                        <a
                          onClick={e => {(spinner || disableBtn)? e?.preventDefault() : handleResend(userInfo?.token)}}
                          className="fw-medium text-primary font-normal cursor-pointer"
                        >
                          Resend again
                        </a>{" "}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <TextLoader loading={action} />
      </div>
    </React.Fragment>
  )
}

StepVerification.propTypes = {
  forgetError: PropTypes.any,
  forgetSuccessMsg: PropTypes.any,
  history: PropTypes.object,
  userForgetPassword: PropTypes.func,
}

export default withRouter(StepVerification)
