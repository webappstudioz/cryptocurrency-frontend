import React, { useState, useEffect } from "react"
import { Form, Input, FormFeedback } from "reactstrap"
import GoogleLogin from "react-google-login"
import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
import email from "../../assets/images/email.svg"
import { useSelector, useDispatch } from "react-redux"
// actions
import { loginUser, socialLogin } from "../../store/actions"

// Formik validation
import * as Yup from "yup"
import { useFormik } from "formik"
import { customRegex } from "../../helpers/validation_helpers"
import showeye from "../../assets/images/showeye.svg"
import hideeye from "../../assets/images/hideeye.svg"
import lock from "../../assets/images/Lock.svg"
import google_i from "../../assets/images/super-g.svg"
import { decrypt } from "../../helpers/api_helper_rs"
import { read_cookie } from "sfcookies"
import { SETTINGS } from "../../constants/api/api_path"
import { getCokkie } from "../Service/store/apiService"
import TextLoader from "../../components/textLoader"
const SignIn = props => {
  const dispatch = useDispatch()
  const [userInfo, setUserInfo] = useState()
  const [passwordInputType, setPasswordInputType] = useState(true)
  const [cartToken, setCartToken] = useState()
  const [cartUrl, setCartUrl] = useState()
  const [currencyID, setCurrencyID] = useState()
  const [loading, setLoading] = useState("")
  const user = useSelector(user => user?.Login)
  useEffect(() => {
    user?.user?.is_verified ? props?.setIsUpdateCart(true) : null
  }, [user?.user])

  useEffect(() => {
    props?.setSpinner({login:user?.spinner}), setLoading(user?.spinner)
  },[user?.spinner])

  useEffect(() => {
    let url = window.location.href
    setCartUrl(url)
   
    let token = read_cookie(SETTINGS.GUESTTOKEN);
    setCartToken(token)

    let currency_id = getCokkie(SETTINGS?.CURRENCY)
    setCurrencyID(currency_id)
  },[])

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: userInfo?.email || "",
      password: userInfo?.password || "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .required("Please enter your email address")
        .matches(customRegex.email, "Please enter a valid email address"),
      password: Yup.string()
        .required("Please Enter Your Password")
        .min(6, "Please Enter Valid Password"),
    }),

    onSubmit: async values => {
      setLoading(true)
      props?.setSpinner({login:true})
      dispatch(loginUser(values))
    },
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
      let user = JSON.parse(decrypt(data))
      setUserInfo(user)
      let token = read_cookie(SETTINGS.userToken)
      if (token.length > 0) {
        dispatch(loginUser(user, props.history))
      }
    }
  }, [])

  const userSignIn = (res, type) => {
    if (type === "google" && res) {
        var data = new URLSearchParams({
        first_name: res?.profileObj?.givenName,
        last_name: res?.profileObj?.familyName,
        email: res?.profileObj?.email,
        social_id: res?.googleId,
        imageUrl: res?.profileObj?.imageUrl,
        social_type: "google",
        cart_token: cartToken,
        url: cartUrl,
        currencyId: currencyID
      })
      dispatch(socialLogin(data, props.history, type))
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

  const responseGoogle = response => {
    if (response) {
      props?.setSpinner(true)
      setLoading(0)
      userSignIn(response, "google")
    } else{
      props?.setSpinner(false)
      setLoading(100)
    }
  }

  return (
    <div className="cart-signup">
      <div className="text-center mt-2">
        <GoogleLogin
          clientId="471779568255-ev1mm78t9g4tu4si9ms57n692qc0pnbu.apps.googleusercontent.com"
          buttonText="Login with gooogle"
          onSuccess={responseGoogle}
          onFailure={err => {
          }}
          render={renderProps => (
            <button
              type="submit"
              onClick={props?.login? null : renderProps.onClick}
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
              disabled={props?.spinner?.login}
              autoComplete="off"
              name="email"
              className="form-control"
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

          <div className="mb-3 form-g position-relative">
            <Input
              disabled={props?.spinner?.login}
              autoComplete="off"
              name="password"
              value={validation.values.password || ""}
              type={passwordInputType ? "password" : "text"}
              placeholder="**********"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              invalid={
                validation.touched.password && validation.errors.password
                  ? true
                  : false
              }
            />
            <div onClick={() => setPasswordInputType(!passwordInputType)}>
              <img
                className="pw-icon"
                height={18}
                src={passwordInputType ? showeye : hideeye}
                alt=""
              />
            </div>

            {validation.touched.password && validation.errors.password ? (
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
          <div className="mt-3">
            <button
              className="btn btn-primary w-100 waves-effect waves-light"
              type="submit"
              disabled={props?.spinner?.login}
            >
              {props?.spinner?.login ? (
                <div className="ui active inline loader"></div>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </Form>
        <TextLoader loading={loading} />
      </div>
    </div>
  )
}

export default SignIn
