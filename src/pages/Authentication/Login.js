import PropTypes from "prop-types"
import React, { useEffect } from "react"
import { useState } from "react"
import { Row, Col, Container, Form, Input, FormFeedback } from "reactstrap"

// Redux
import { withRouter, Link, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

// Formik validation
import * as Yup from "yup"
import { useFormik } from "formik"

//Social Media Imports
import GoogleLogin from "react-google-login"
import { gapi } from "gapi-script"

// actions
import { loginUser, socialLogin } from "../../store/actions"

// import images
import logo from "../../assets/images/Logo.svg"
import mockup from "../../assets/images/mockup.png"
import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
import hand from "../../assets/images/hand.PNG"
import logoGreen from "../../assets/images/c2c/logoGreen.jpg"
import email from "../../assets/images/email.svg"
import lock from "../../assets/images/Lock.svg"
import google_i from "../../assets/images/super-g.svg"
import showeye from "../../assets/images/showeye.svg"
import hideeye from "../../assets/images/hideeye.svg"

//Import config
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { customRegex } from "../../helpers/validation_helpers"
import { decrypt, setPageTitle } from "../../helpers/api_helper_rs"
import { read_cookie } from "sfcookies"
import { SETTINGS } from "../../constants/api/api_path"
import TextLoader from "../../components/textLoader"
import { getGameResults } from "./store/apiServices"

var settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
}

const Login = props => {
  const [passwordInputType, setPasswordInputType] = useState(true)
  const [userInfo, setUserInfo] = useState()
  const [rememberCheck, setRememberCheck] = useState(false)
  const [loader, setLoader] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const [action, setAction] = useState("")
  const [gameResults, setGameResults] = useState("")
  const dispatch = useDispatch()
  const location = useLocation()
  const invoiceId = location?.state?.invoiceid
 
  const finalResults = [
    {time_zone: 1, winning_Number: 8},
    {time_zone: 2, winning_Number: 19},
    {time_zone: 3, winning_Number: 25},
    {time_zone: 4, winning_Number: 36},
  ]

  const redNumbers = ["1","2","3","4","5","6","7","8","9","10","11","12","13","26","27","28","29","30","31"]
  const blackNumbers = ["0","14","15","16","17","18","19","20","21","22","23","24","25","32","33","34","35"]

  useEffect(() =>{
    setPageTitle("Login")
    getResults()
  },[])

  const getResults = async() => {
    try{
      let res = await getGameResults()
      let info = res?.data?.data
      setGameResults(info)
    }catch(error){
    }
  }

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      username: userInfo?.username || "",
      password: userInfo?.password || "",
    },

    validationSchema: Yup.object({
      username: Yup.string()
        .required("Enter username or email.")
        .matches(customRegex.email, "Enter a valid username or email."),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Enter Valid Password"),
    }),

    onSubmit: async values => {
      // props.history.push("/dashboard")
      // setSpinner(true)
      // setAction(true)
      values.role = "Admin"
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

  const signIn = (res, type) => {
    if (type === "google" && res) {
      var data = new URLSearchParams({
        first_name: res?.profileObj?.givenName,
        last_name: res?.profileObj?.familyName,
        email: res?.profileObj?.email,
        social_id: res?.googleId,
        imageUrl: res?.profileObj?.imageUrl,
        social_type: "google",
      })
      dispatch(socialLogin(data, props.history, type, invoiceId))
    } else if (type === "facebook" && res) {
      const postData = {
        name: res.name,
        email: res.email,
        token: res.accessToken,
        idToken: res.tokenId,
      }
      dispatch(socialLogin(postData, props.history, type))
    }
  }

  //handleGoogleLoginResponse
  const responseGoogle = response => {
    setLoader(true)
    setAction(true)
     if (response) {
      signIn(response, "google")
    }
  }

  //handleFacebookLoginResponse
  const facebookResponse = response => {
    signIn(response, "facebook")
  }

  useEffect(() => {
    document.body.className = "authentication-bg"
    // remove classname when component will  unmount
    return function cleanup() {
      document.body.className = ""
    }
  })

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

    let data = read_cookie(SETTINGS.COOKIE_KEY)
    if (data.length > 0) {
      setRememberCheck(true)
      let user = JSON.parse(decrypt(data))
      setUserInfo(user)
      let token = read_cookie(SETTINGS.userToken)
      if (token.length > 0) {
        dispatch(loginUser(user, props.history))
      }
    }
  }, [])

  return (
    <React.Fragment>
      <div
        className={loader ? "account-pages overlayerloader" : "account-pages"}
      >
        <Container fluid>
          <Row>
            <Col lg={6} className="left-panel">
            <div className="slide-content">
              <div className="inner-content">
                <h3 className="text-white">Comming Soon</h3>
              </div>
              </div>
              {/* <div className="slide-content">
              <div className="inner-content">
                <h3 className="text-white">IPv4 Management</h3>
                <p className="text-white">
                <input type="text" name="zoneOne" value="19" className="form-control"/>
                </p>
              </div>
              </div> */}
              {/* <img src={logoGreen} /> */}
            {/* <Link to="/productlist"><img src={logo} alt="" /> </Link> */}
              {/* <div className="slide-content">  */}
                {/* <Slider {...settings}> */}
                  {/* <div>
                    <img src={mockup} alt="" />
                    <div className="inner-content">
                      <h3 className="text-white">IPv4 Management</h3>
                      <p className="text-white">
                        Pick one of our 20+ server locations packed with bare{" "}
                        <br /> metal servers and host your applications
                        instantly.
                      </p>
                    </div>
                  </div> */}
                  {/* <div>
                    <img src={mockup} alt="" />
                    <div className="inner-content">
                      <h3 className="text-white">IPv4 Management</h3>
                      <p className="text-white">
                        Pick one of our 20+ server locations packed with bare{" "}
                        <br /> metal servers and host your applications
                        instantly.
                      </p>
                    </div>
                  </div> */}
                  {/* <div>
                    <img src={mockup} alt="" />
                    <div className="inner-content">
                      <h3 className="text-white">IPv4 Management</h3>
                      <p className="text-white">
                        Pick one of our 20+ server locations packed with bare{" "}
                        <br /> metal servers and host your applications
                        instantly.
                      </p>
                    </div>
                  </div> */}
                {/* </Slider> */}
               {/* </div>  */}
               <div className="results-login-page">
                <div className="login-left-wrapper">
                  {gameResults? gameResults?.map((result, index) => {
                    return (
                    <div className="login-left-input" key={index}>
                      <Col lg={12}>
                        <label>{result?.time_zone}</label>
                        <input 
                          type="text" 
                          className={redNumbers?.includes(result?.winning_Number)? "form-control redNumber" : blackNumbers?.includes(result?.winning_Number)? "form-control blackNumber" : "form-control"} 
                          name="zoneOne" 
                          defaultValue={result?.winning_Number}
                          disabled
                          />
                      </Col>
                    </div>
                  )
                  }) : null}
                  {/* <Col lg={3}>
                    <label>Zone One</label>
                    <input type="text" className="form-control" name="zoneOne" />
                  </Col>
                  <Col lg={3}>
                    <label>Zone Two</label>
                    <input type="text" className="form-control" name="zoneOne" />
                  </Col>
                  <Col lg={3}>
                    <label>Zone Three</label>
                    <input type="text" className="form-control" name="zoneOne" />
                  </Col>
                  <Col lg={3}>
                    <label>Zone Four</label>
                    <input type="text" className="form-control" name="zoneOne" />
                  </Col> */}
                </div>
               </div>
            </Col>
            <Col lg={6}>
              <div className="right_content">
                <div className="text-center mt-2">
                  <h5 className="m-0">Login</h5>
              {/*     <img className="s-icon" src={hand} alt="" />
                  <GoogleLogin
                    
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
                        Sign In with Google
                      </button>
                    )}
                  />
                  <div className="sub_header">
                    <p className="text-muted m-0">
                      <span>or Sign in with Email</span>
                    </p>
                  </div> */}
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
                        name="username"
                        className="form-control input-outline"
                        placeholder="Username/Email"
                        type="email"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.username || ""}
                        invalid={
                          validation.touched.username && validation.errors.username
                            ? true
                            : false
                        }
                      />
                      {validation.touched.username && validation.errors.username ? (
                        <>
                          <FormFeedback type="invalid">
                            <img
                              className="form-error-icon"
                              src={rederror}
                              alt=""
                              height={15}
                            />
                            {validation.errors.username}
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
                          // onClick={(e) => {e.preventDefault()}}
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
                        // disabled={true}
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
                          // onClick={(e) => {e.preventDefault()}}
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
