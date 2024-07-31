import PropTypes from "prop-types"
import React, { useEffect } from "react"
import { useState } from "react"
import { Row, Col, Container, Form, Input, FormFeedback } from "reactstrap"

import { withRouter, Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import * as Yup from "yup"
import { useFormik } from "formik"

import { 
  loginUser, 
} from "../../store/actions"
import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
import email from "../../assets/images/email.svg"
import lock from "../../assets/images/Lock.svg"
import showeye from "../../assets/images/showeye.svg"
import hideeye from "../../assets/images/hideeye.svg"

import { setPageTitle } from "../../helpers/api_helper_rs"
import TextLoader from "../../components/textLoader"
import ShowResultsAndTime from "../../components/ShowResultsAndTime"
const Login = props => {
  const [passwordInputType, setPasswordInputType] = useState(true)
  const [userInfo, setUserInfo] = useState()
  const [rememberCheck, setRememberCheck] = useState(false)
  const [loader, setLoader] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const [action, setAction] = useState("")
  const dispatch = useDispatch()
  
  useEffect(() =>{
    setPageTitle("Login")
  },[])

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: userInfo?.email || "",
      password: userInfo?.password || "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .required("Enter username or email."),
        // .matches(customRegex.email, "Enter a valid username or email."),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Enter Valid Password"),
    }),

    onSubmit: async values => {
      dispatch(loginUser(values, props.history))
    },
  })

  const { error } = useSelector(state => ({
    error: state.Login.error,
  }))
  const reduxData = useSelector(state => state?.Login)

  useEffect(() => {
    setLoader(reduxData?.loading)
    setSpinner(reduxData?.spinner)

    if(reduxData?.error || reduxData?.user){
      reduxData?.loading === false ? setAction(false) : null
      reduxData?.spinner === false ? setAction(false) : null
    }
  },[reduxData])

  useEffect(() => {
    document.body.className = "authentication-bg"
    return function cleanup() {
      document.body.className = ""
    }
  })

  return (
    <React.Fragment>
      <div
        className={loader ? "account-pages overlayerloader" : "account-pages"}
      >
        <Container fluid>
          <Row>
            <Col lg={6} className="left-panel">
              <ShowResultsAndTime />
            </Col>
            <Col lg={6}>
              <div className="right_content">
                <div className="text-center mt-2">
                  <h5 className="m-0">Login</h5>

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
                        name="email"
                        className="form-control input-outline"
                        placeholder="Username/Email"
                        type="text"
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

                    <div className="mb-3 form-g position-relative">
                      <Input
                        name="password"
                        autoComplete="on"
                        className="input-outline"
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

                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="customControlInline"
                        name="rememberMe"
                        defaultChecked={rememberCheck}
                        onChange={validation.handleChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="customControlInline"
                      >
                        Remember me
                      </label>
                      <div className="float-end">
                        <Link
                          onClick={(e) => {spinner? e.preventDefault() : null}}
                          to="/forgot-password"
                          className="text-muted font-normal"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </div>

                    <div className="mt-3">
                      <button
                        className="btn btn-primary w-100 waves-effect waves-light"
                        type="submit"
                        disabled={reduxData?.spinner || reduxData?.loading || spinner}
                      >
                        {spinner? <div className="ui active inline loader"></div> : "Sign In"}
                      </button>
                    </div>

                    <div className="mt-4 text-center"></div>

                    <div className="mt-4 text-center form-footer ">
                      <p className="mb-0 text-muted font-normal">
                        Not registered yet?{" "}
                        <Link
                          onClick={(e) => {spinner? e.preventDefault() : null}}
                          to="/register"
                          className="fw-medium text-primary font-normal"
                        >
                          {" "}
                          Create an Account{" "}
                        </Link>{" "}
                      </p>
                    </div>
                  </Form>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <TextLoader loader={loader} loading={action}/>
      </div>
    </React.Fragment>
  )
}

export default withRouter(Login)

Login.propTypes = {
  error: PropTypes.any,
  history: PropTypes.object,
  loginUser: PropTypes.func,
  socialLogin: PropTypes.func,
}
