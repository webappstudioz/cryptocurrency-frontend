import React, { useEffect } from "react"
import { useState } from "react"
import { Form, Input, FormFeedback } from "reactstrap"

// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"

// action
import { registerUser, registerSocial } from "../../store/actions"

// Redux
import { useDispatch, useSelector } from "react-redux"

// import images
import showeye from "../../assets/images/showeye.svg"
import hideeye from "../../assets/images/hideeye.svg"
import google_i from "../../assets/images/super-g.svg"
import email from "../../assets/images/email.svg"
import lock from "../../assets/images/Lock.svg"
import name from "../../assets/images/name.svg"
import GoogleLogin from "react-google-login"
import { customRegex } from "../../helpers/validation_helpers"
import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
import { read_cookie } from "sfcookies"
import { SETTINGS } from "../../constants/api/api_path"
import { getCokkie } from "../Service/store/apiService"
import TextLoader from "../../components/textLoader"
import { Dropdown } from "semantic-ui-react"
import {
  getCountryList,
  getGstCountries,
} from "../Authentication/store/apiServices"
const SignUp = props => {
  const [passwordInputType, setPasswordInputType] = useState(true)
  const [cartToken, setCartToken] = useState()
  const [cartUrl, setCartUrl] = useState()
  const [currencyID, setCurrencyID] = useState()
  const [loading, setLoading] = useState("")
  const [countryList, setcountryList] = useState()
  const [gstCountries, setGstCountries] = useState([])
  const [gstCountry, setGstCountry] = useState(false)
  const reduxSpinner = useSelector(state => state?.Account?.spinner)
  const dispatch = useDispatch()

  useEffect(() => {
    props?.setSpinner({ register: reduxSpinner })
    setLoading(reduxSpinner)
  }, [reduxSpinner])

  const responseGoogle = response => {
    if (response) {
      var data = new URLSearchParams({
        first_name: response?.profileObj?.givenName,
        last_name: response?.profileObj?.familyName,
        email: response?.profileObj?.email,
        social_id: response?.profileObj?.googleId,
        imageUrl: response?.profileObj?.imageUrl,
        social_type: "google",
        cart_token: cartToken,
        url: cartUrl,
        currencyId: currencyID,
      })
      dispatch(registerSocial(data))
    }
  }

  useEffect(() => {
    let currency_id = getCokkie(SETTINGS?.CURRENCY)
    setCurrencyID(currency_id)
    
  }, [])

  useEffect(() => {
    let isMounted = true; // Add a boolean flag to track component mount status
  
    const getcountry = async () => {
      try {
        let res = await getCountryList()
        let all = []
        if (isMounted) {
          res.data.data.map(ele => {
            all.push({
              value: ele.name,
              flag: (
                <img value={ele.id} height={15} width={15} src={ele.country_flag} />
              ),
              text: ele.name,
              value: ele.id,
              short_code: ele.short_code,
            })
          })
          setcountryList(all)
        }
      } catch (error) {
        // Handle the error if needed
      }
    };
  
    getcountry()
  
    return () => {
      isMounted = false; // Update the flag when the component is unmounted
    };
  }, [])


  useEffect(() => {
    let isMounted = true; // Add a boolean flag to track component mount status
  
    const getGstCountriesList = async () => {
      try {
        let res = await getGstCountries();
        if (isMounted) {
          setGstCountries(res?.data?.data);
        }
      } catch (error) {
        // Handle the error if needed
      }
    };
  
    getGstCountriesList();
  
    return () => {
      isMounted = false; // Update the flag when the component is unmounted
    };
  }, []);
  

  useEffect(() => {
    let url = window.location.href
    setCartUrl(url)
    let token = read_cookie(SETTINGS.GUESTTOKEN)
    setCartToken(token)
  }, [])

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "",
      name: "",
      password: "",
      termConditions: false,
      country: "",
      gst: "",
    },
    validationSchema: Yup.object({
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
      country: Yup.string().required("Please select your country"),
      termConditions: Yup.bool().oneOf(
        [true],
        "You must accept the terms and conditions"
      ),
    }),
    onSubmit: values => {
      let terms = 0
      values.termConditions ? (terms = 1) : (terms = 0)
      let data = new URLSearchParams({
        email: values.email,
        password: values.password,
        first_name: values.name,
        is_agree: terms,
        cart_token: cartToken,
        url: cartUrl,
        currencyId: currencyID,
        country_id: values.country,
      })
      if (values.gst) {
        data.append("gst_enabled", values.gst)
      }
      dispatch(registerUser(data, props.history, "cartSignUp"))
    },
  })

  const handleDropdownChange = (_, { value }) => {
    countryList.map(country => {
      if (value === country?.value)
        gstCountries.includes(country?.short_code)
          ? setGstCountry(true)
          : setGstCountry(false)
    })
    validation.setFieldValue("country", value)
  }

  return (
    <div className="cart-signup">
      <div className="text-center mt-2">
        <h5 className="text-center">Create your account</h5>
        <GoogleLogin
          clientId="471779568255-ev1mm78t9g4tu4si9ms57n692qc0pnbu.apps.googleusercontent.com"
          buttonText="Login with gooogle"
          onSuccess={responseGoogle}
          onFailure={err => {
            // console.log("fail", err)
          }}
          render={renderProps => (
            <button
              type="submit"
              onClick={props?.spinner?.register? null : renderProps.onClick}
              className="g-btn"
            >
              <img src={google_i} alt="" />
              Sign Up with Google
            </button>
          )}
        />
        {/* <button className='g-btn'>
                    <img src={google_i} alt="" /> Sign Up with Google
                  </button> */}
        <div className="sub_header register">
          <p className="text-muted m-0">
            <span>OR</span>
          </p>
        </div>
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
          {/* {user && user ? (
                      <Alert color="success">
                        Register User Successfully
                      </Alert>
                    ) : null}

                    {registrationError && registrationError ? (
                      <Alert color="danger">{registrationError.errorMsg}</Alert>
                    ) : null} */}
          <div className="mb-3 form-g position-relative">
            <Input
              disabled={props?.spinner?.register}
              autoComplete="off"
              name="name"
              type="text"
              placeholder="Your Name"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.name || ""}
              invalid={
                validation.touched.name && validation.errors.name ? true : false
              }
            />
            {validation.touched.name && validation.errors.name ? (
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
              disabled={props?.spinner?.register}
              autoComplete="off"
              id="email"
              name="email"
              className="form-control"
              placeholder="Your Email"
              type="email"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.email || ""}
              // disabled={inviteInfo?.email? true : false}
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
              disabled={props?.spinner?.register}
              autoComplete="off"
              name="password"
              value={validation.values.password || ""}
              type={passwordInputType ? "password" : "text"}
              placeholder="Password"
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
            {/* <p className="font-normal text-muted mt-1 font-semi">Must be 8 characters at least</p> */}
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
          <div className="mb-3 form-g position-relative">
            <Dropdown
              disabled={props?.spinner?.register}
              id="country"
              name="country"
              placeholder="Select Country"
              fluid
              search
              className={
                validation.touched.country && validation.errors.country
                  ? "input-outline is-invalid"
                  : "input-outline"
              }
              value={validation?.values?.country || ""}
              onChange={handleDropdownChange}
              onBlur={validation.handleBlur}
              options={countryList}
              invalid={
                validation.touched.country && validation.errors.country
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
          {gstCountry && (
            <div
              className="form-check form-check-box"
              style={{ display: "block" }}
            >
              <Input
                disabled={props?.spinner?.register}
                type="checkbox"
                className="form-check-input square-box checkout-check"
                id="enable-gst"
                name="gst"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.gst || ""}
              />
              <label htmlFor="enable-gst">
                  {" "}
                  Pay with GST
              </label>
            </div>
          )}
          <div
            className="form-check form-check-box"
            style={{ display: "block" }}
          >
            <Input
              disabled={props?.spinner?.register}
              type="checkbox"
              className="form-check-input square-box checkout-check"
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
            {/* className="form-check-label" htmlFor="auth-terms-condition-check" */}
            <label htmlFor="auth-terms-condition-check">
              <span>I agree to the</span>
              <a className="text-primary" style={{ cursor: "pointer" }}>
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
              disabled={props?.spinner?.register}
            >
              {props?.spinner?.register ? (
                <div className="ui active inline loader"></div>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>

          {/* <div className="mt-4 text-center">
            <p className="text-muted mb-0 font-normal">
              Already have an account ?{" "}
              <Link to="/login" className="fw-medium text-primary">
                {" "}
                Sign In
              </Link>
            </p>
          </div> */}
        </Form>
        <TextLoader loading={loading} />
      </div>
    </div>
  )
}

export default SignUp
