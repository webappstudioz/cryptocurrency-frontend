import PropTypes from 'prop-types'
import React, { useEffect, useState } from "react"
import { Row, Col, Container, Form } from "reactstrap";

// Redux
import { useDispatch } from "react-redux";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// import images

import tick from "../../assets/images/tick-mark.svg"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import OtpInput from "react-otp-input";
import { verfiy2FALoginOtp, storeUserData, storeAuthToken } from "../Authentication/store/apiServices"
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import { decrypt, storeLoginTime } from '../../helpers/api_helper_rs';
import TextLoader from '../../components/textLoader';
import { loginSuccess } from '../../store/actions';

const CartTwoFA = ({spinner, setSpinner, setIsVerified, setIsUpdateCart}) => {
  const dispatch = useDispatch();
  const [token, setToken] = useState()
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState("")
  
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
    },
    validationSchema: Yup.object({
    }),

    onSubmit: () => {
      setSpinner({verify:true})
      setLoading(true)
      var data = new URLSearchParams({
        token: token,
        two_factor_code: code,
      });
      verfiy2FALoginOtp(data)
      .then(res => {
        if(res.data) {
          setIsUpdateCart(true)
          setSpinner(false)
          setLoading(false)
          toast.success(res?.data?.message, {
                position: toast.POSITION.TOP_RIGHT
          });
          localStorage.removeItem("jwt")
          dispatch(loginSuccess(res))
          storeUserData(res?.data?.data)
          storeAuthToken(res?.data?.data?.token)
          storeLoginTime()
          setIsVerified(true)
        }
      }).catch(err => {
        setSpinner(false)
        setLoading(false)
        setCode("")
        toast.error(err?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT
        });
      })
    }
  });
 
  const handleChange = (code) => setCode(code);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("jwt"))
    if(user){
        user = JSON.parse(decrypt(user))
        setToken(user)
    }
    setToken(user)
  }, [])

  return (
    <React.Fragment>
        <div className="cart-signup">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <div className='right_content'>
                <div className="text-center mt-2">
                  <img className='s-icon mb-0 mb-3' src={tick} alt="" />
                  <h5 className="m-0">Two-Factor Authentication</h5>
                  <div className='forgot-content'>
                    <p className='text-muted m-0 font-normal'>
                      Open your authentication app and enter the code to continue.
                    </p>
                  </div>
                </div>

                <div className="p-2 mt-4">
                  <div className="p-2 mt-4">
                    <Form
                      className="form-horizontal digit-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >                      
                        <div className="mb-3 form-g position-relative input-group d-flex align-items-center" style={{justifyContent:"space-around"}}>
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
                            }}></OtpInput>
                        </div>                     
                      <button
                        className="btn btn-primary w-100 waves-effect waves-light d-flex justify-content-center align-items-center"
                        type="submit"
                        disabled={code == "" || code.length != 6 ? true : false || spinner?.verify}
                      >
                        {spinner?.verify? <div className="ui active inline loader"></div> : "Verify"}
                      </button>
                    </Form>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <TextLoader loading={loading}/>
      </div>
    </React.Fragment>
  )
}

CartTwoFA.propTypes = {
  forgetError: PropTypes.any,
  forgetSuccessMsg: PropTypes.any,
  history: PropTypes.object,
  userForgetPassword: PropTypes.func
}

export default withRouter(CartTwoFA);