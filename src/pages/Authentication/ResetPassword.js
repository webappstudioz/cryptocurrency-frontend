import PropTypes from "prop-types"
import React, { useEffect } from "react"
import { useState } from "react"

import {
  Row,
  Col,
  Alert,
  Container,
  Form,
  Input,
  FormFeedback,
} from "reactstrap"

// Redux

import { withRouter, Link, useHistory } from "react-router-dom"
import { useSelector } from "react-redux"

// Formik validation
import * as Yup from "yup"
import { useFormik } from "formik"

// import images
import logo from "../../assets/images/Logo.svg"
import mockup from "../../assets/images/mockup.png"

import lock from "../../assets/images/Lock.svg"
import showeye from "../../assets/images/showeye.svg"
import hideeye from "../../assets/images/hideeye.svg"

import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
//Import config

import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { customRegex } from "../../helpers/validation_helpers"
import { resetPassword, resendPassLink, verifyResetPasswordToken } from "./store/apiServices"
import { setPageTitle } from "../../helpers/api_helper_rs"
import { toast } from "react-toastify"
import TextLoader from "../../components/textLoader"

var settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
}

const ResetPassword = props => {
  let history = useHistory()
  const [passwordInputType, setPasswordInputType] = useState(true)
  const [confirmPasswordInputType, setConfirmPasswordInputType] = useState(true)
  const [token, setToken] = useState("")
  const { match = {} } = props
  const [spinner, setSpinner] = useState(false)
  const [disableBtn, setDisableBtn] = useState(false)
  const [action, setAction] = useState("")
  const [loader, setLoader] = useState(true)


  useEffect(() => {
    setToken(match?.params?.token)
    handleVerifyToken(match?.params?.token)
  }, [setToken])

  useEffect(() => {
    setPageTitle("Reset Password")
  }, [])

  const handleVerifyToken = async(token) => {
    try{
      const result = await verifyResetPasswordToken(token)
      if(result){
        setLoader(false)
      }else{
        toast.error("Your token is invalid", {
          position: toast.POSITION.TOP_RIGHT,
        })
        history.push("/login")
      }
    }catch(error){
    }

  }
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      password: Yup.string()
        .required("Please enter your password")
        .min(8, "Password must be 8 characters at least")
        .matches(
          customRegex.password,
          "Please enter atleast one uppercase letter, one lowercase letter, one digit and one special character"
        ),
      confirmPassword: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try{
        let data = new URLSearchParams({
        token: token,
        password: values.password,
        confirm_password: values.confirmPassword,
      })
      setSpinner(true)
      setAction(true)
      let res = await resetPassword(data)
      resetForm({ values: "" })
      if (res?.data?.api_response === "success") {
        setSpinner(false)
        setAction(false)
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        history.push("/login")
        }
      }catch(error) {
        setSpinner(false)
        setAction(false)
        toast.error(error?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      }
    },
  })

  useEffect(() => {
    document.body.className = "authentication-bg"
    // remove classname when component will unmount
    return function cleanup() {
      document.body.className = ""
    }
  })

  const handleResendLink = async () => {
    setDisableBtn(true)
    setAction(true)
    try{
      let res = await resendPassLink(token)
      if(res){
        setDisableBtn(false)
        setAction(false)
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      }
    }catch(error) {
      setDisableBtn(false)
      setAction(false)
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

  const { forgetError, forgetSuccessMsg } = useSelector(state => ({
    forgetError: state.ForgetPassword.forgetError,
    forgetSuccessMsg: state.ForgetPassword.forgetSuccessMsg,
  }))

  return (
    <React.Fragment>
      {/* <div className="home-btn d-none d-sm-block">
        <Link onClick={(e) => {spinner? e?.preventDefault() : null }} to="/" className="text-dark">
          <i className="mdi mdi-home-variant h2"></i>
        </Link>
      </div> */}

      <div
        className="account-pages forgot"
      >
        <Container fluid>
          <Row>
            <Col lg={6} className="left-panel">
            {/* <Link onClick={(e) => {(spinner || disableBtn)? e?.preventDefault() : null }} to="/productlist"><img src={logo} alt="" /> </Link> */}
              {/* <div className="slide-content">
                <Slider {...settings}>
                  <div>
                    <img src={mockup} alt="" />
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
                    <img src={mockup} alt="" />
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
                    <img src={mockup} alt="" />
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
                  <h5 className="m-0">Reset Password</h5>
                </div>
                <div className="p-2 mt-4">
                  <Form
                    className="form-horizontal"
                    onSubmit={e => {
                      e.preventDefault()
                      validation.handleSubmit()
                      return false
                    }}
                  >
                    {/* {forgetError ? (
                      <Alert color="danger">{forgetError}</Alert>
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
                    <div className="mb-3 form-g position-relative">
                      <Input
                        disabled={spinner || disableBtn}
                        name="password"
                        autoComplete="off"
                        value={validation.values.password || ""}
                        type={passwordInputType ? "password" : "text"}
                        placeholder="**********"
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
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.password}
                        </FormFeedback>
                      ) : null}

                      <img className="form-icon" src={lock} alt="" />
                    </div>

                    <div className="mb-3 form-g position-relative">
                      <Input
                        disabled={spinner || disableBtn}
                        name="confirmPassword"
                        autoComplete="off"
                        value={validation.values.confirmPassword || ""}
                        type={confirmPasswordInputType ? "password" : "text"}
                        placeholder="**********"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.confirmPassword &&
                          validation.errors.confirmPassword
                            ? true
                            : false
                        }
                      />
                      <div
                        onClick={() =>
                          setConfirmPasswordInputType(!confirmPasswordInputType)
                        }
                      >
                        <img
                          className="pw-icon"
                          height={18}
                          src={confirmPasswordInputType ? showeye : hideeye}
                          alt=""
                        />
                      </div>
                      {validation.touched.confirmPassword &&
                      validation.errors.confirmPassword ? (
                        <FormFeedback type="invalid">
                          <img
                            className="form-error-icon"
                            src={rederror}
                            alt=""
                            height={15}
                          />
                          {validation.errors.confirmPassword}
                        </FormFeedback>
                      ) : null}
                      <img className="form-icon" src={lock} alt="" />
                    </div>
                    <div className="mt-3">
                      <button
                        className="btn btn-primary w-100 waves-effect waves-light"
                        type="submit"
                        disabled={spinner || disableBtn}
                      >
                        {spinner? <div className="ui active inline loader"></div> : "Reset Password"}
                      </button>
                    </div>
                    <div className="mt-4 text-center"></div>

                    <div className="mt-4 text-center form-footer ">
                      <p className="mb-0 text-muted font-normal">
                        Didn’t receive an email?
                        <a
                          onClick={(e) => {(spinner || disableBtn)? e?.preventDefault() : handleResendLink()}}
                          className="fw-medium text-primary font-normal cursor-pointer"
                        >
                          {" "}
                          Resend link
                        </a>
                      </p>
                    </div>
                  </Form>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <TextLoader loading={action}/>
        <TextLoader loading={loader} loader={loader}/>
      </div>
    </React.Fragment>
  )
}

export default withRouter(ResetPassword)

ResetPassword.propTypes = {
  forgetError: PropTypes.any,
  forgetSuccessMsg: PropTypes.any,
  history: PropTypes.object,
  userForgetPassword: PropTypes.func,
}
