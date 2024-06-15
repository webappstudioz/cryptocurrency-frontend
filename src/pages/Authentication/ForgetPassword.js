import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import { Row, Col, Container, FormFeedback, Input, Form } from "reactstrap"

// Redux
import { useSelector, useDispatch } from "react-redux"
import { withRouter, Link } from "react-router-dom"

// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"

// action
import { userForgetPassword } from "../../store/actions"

// import images
import logo from "../../assets/images/Logo.svg"
import mockup from "../../assets/images/mockup.png"
import forgot from "../../assets/images/forgot.svg"
import email from "../../assets/images/email.svg"
import arrow from "../../assets/images/arrow.svg"

import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { customRegex } from "../../helpers/validation_helpers"
import TextLoader from "../../components/textLoader"
import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
import { setPageTitle } from "../../helpers/api_helper_rs"

var settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
}

const ForgetPasswordPage = props => {
  const dispatch = useDispatch()
  const [userEmail, setUserEmail] = useState("")
  const [spinner, setSpinner] = useState()

  useEffect(() =>{
    setPageTitle("Forgot Password")
  },[])
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: userEmail || "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Please enter your email address")
        .matches(customRegex.email, "Please enter a valid email address"),
    }),

    onSubmit: values => {
      // return
      setSpinner(true)
      setUserEmail(values.email)
      dispatch(userForgetPassword(values, props.history))
    },
  })

  useEffect(() => {
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

  useEffect(() => {
    if (forgetSuccessMsg) {
      setUserEmail("")
      setSpinner(false)
    }
    forgetError ? (
      setSpinner(false)
      ) : ""
  }, [forgetSuccessMsg, forgetError, userEmail, setUserEmail])

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link onClick={(e) => {spinner? e?.preventDefault() : null }} to="/" className="text-dark">
          <i className="mdi mdi-home-variant h2"></i>
        </Link>
      </div>

      <div
        className="account-pages forgot">
        <Container fluid>
          <Row>
            <Col lg={6} className="left-panel">
            {/* <Link onClick={(e) => {spinner? e?.preventDefault() : null }} to="/productlist"><img src={logo} alt="" /> </Link>
              <div className="slide-content">
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
                  <img className="s-icon" src={forgot} alt="" />
                  <h5 className="m-0">Forgot Password?</h5>
                  <div className="forgot-content">
                    <p className="text-muted m-0 font-normal">
                      No worries, we’ll send you reset instructions.
                    </p>
                  </div>
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
                    <div className="mb-3 form-g position-relative">
                      <Input
                        disabled={spinner}
                        name="email"
                        className="form-control input-outline"
                        placeholder="Your Email"
                        type="email"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email || ""}
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
                    <button
                      className="btn btn-primary w-100 waves-effect waves-light"
                      type="submit"
                      disabled={spinner}
                    >
                      {spinner? <div className="ui active inline loader"></div> : "Send Recovery Link"}
                    </button>
                    <div className="mt-4 text-center">
                      <p className="mb-0 font-normal">
                        <Link
                          onClick={(e) => {spinner? e?.preventDefault() : null }}
                          to="/login"
                          className="fw-medium text-primary font-normal d-flex align-itemes-center justify-content-center"
                        >
                          {" "}
                          <img className="mx-2" src={arrow} alt="" /> Back to
                          Sign In{" "}
                        </Link>
                      </p>
                    </div>
                  </Form>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <TextLoader loading={spinner}/>
      </div>
    </React.Fragment>
  )
}

ForgetPasswordPage.propTypes = {
  forgetError: PropTypes.any,
  forgetSuccessMsg: PropTypes.any,
  history: PropTypes.object,
  userForgetPassword: PropTypes.func,
}

export default withRouter(ForgetPasswordPage)
