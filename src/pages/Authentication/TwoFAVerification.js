import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import { Row, Col, Container, Form } from "reactstrap"

// Redux
import { useSelector } from "react-redux"

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
import { verfiy2FALoginOtp, storeAuthToken, storeUserData } from "./store/apiServices"
import { withRouter, Link, useHistory, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import { decrypt, setPageTitle, storeLoginTime } from "../../helpers/api_helper_rs"
import TextLoader from "../../components/textLoader"
import VerifyLoader from "../../components/verifyingLoader"

var settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
}

const StepVerification = props => {
  let navigate = useHistory()
  const location = useLocation()
  const invoiceId = location?.state?.invoiceId
  // const [token, setToken] = useState()
  const token = location?.state?.token
  const [code, setCode] = useState("")
  const [loader, setLoader] = useState(false)
  const [loading, setLoading] = useState("")
  const [loader1, setLoader1] = useState(false)
  const [spinner, setSpinner] = useState(false)

  useEffect(() => {
    setPageTitle("2FA Verfication")
    // const jwt = localStorage.getItem("jwt")
    // if(jwt){
    //   let user = JSON.parse(jwt)
    //   user = JSON.parse(decrypt(user))
    //   setToken(user)
    // }
  }, [])

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {},
    validationSchema: Yup.object({}),

    onSubmit: () => {
      setLoading(true)
      setSpinner(true)
      var data = new URLSearchParams({
        token: token,
        two_factor_code: code,
      })
      verfiy2FALoginOtp(data)
        .then(res => {
          if (res.data) {
            setSpinner(false)
            setLoading(false)
            toast.success(res?.data?.message, {
              position: toast.POSITION.TOP_RIGHT,
            })
            localStorage.removeItem("jwt")
            storeAuthToken(res?.data?.data?.token)
            storeUserData(res?.data?.data)
            storeLoginTime()
            invoiceId? navigate.push(`/invoice-detail/${invoiceId}`) : navigate.push("/dashboard")
          }
        })
        .catch(err => {
          setLoading(false)
          setSpinner(false)
          setCode("")
          toast.error(err?.response?.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          })
        })
    },
  })

  useEffect(() => {
    document.body.className = "authentication-bg"
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
      <div
        className={
          loader || loader1
            ? "account-pages forgot overlayerloader"
            : "account-pages forgot"
        }
      >
        <Container fluid>
          <Row>
            <Col lg={6} className="left-panel">
            <Link to="/productlist"><img src={logo} alt="" /> </Link>
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
              </div>
            </Col>
            <Col lg={6}>
              <div className="right_content">
                <div className="text-center mt-2">
                  <img className="s-icon mb-0 mb-3" src={tick} alt="" />
                  <h5 className="m-0">Two-Factor Authentication</h5>
                  <div className="forgot-content">
                    <p className="text-muted m-0 font-normal">
                      Open your authentication app and enter the code to
                      continue.
                    </p>
                  </div>
                </div>

                <div className="p-2 mt-4">
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
                            border: "1px solid #6062F9",
                            outline: "none",
                            borderRadius: "12px",
                          }}
                        ></OtpInput>
                      </div>
                      <button
                        className="btn btn-primary w-100 waves-effect waves-light d-flex justify-content-center align-items-center"
                        type="submit"
                        disabled={code == "" || code.length != 6 ? true : false || spinner}
                      >
                        {spinner?(
                            <div className="ui active inline loader"></div>
                          ): "Verify"} 
                        
                      </button>
                    </Form>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <TextLoader loading={loading} loader={loader}/>
        {/* {loader1 ? <TextLoader loading={loading} /> : ""} */}
        {/* {loader ? <VerifyLoader loading={loading} /> : ""} */}
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
