import PropTypes from 'prop-types'
import React, { useEffect } from "react"
import { Row, Col, Alert, Container} from "reactstrap";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { withRouter, Link } from "react-router-dom"

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// action
import { userForgetPassword } from "../../store/actions"

// import images
import logo from "../../assets/images/Logo.svg"
import mockup from "../../assets/images/mockup.png"
import arrow from "../../assets/images/arrow.svg"
import loginsuspended from "../../assets/images/loginsuspended.svg"

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


var settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};

const LoginSuspended = props => {
  const dispatch = useDispatch();

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
    }),
    onSubmit: (values) => {
      dispatch(userForgetPassword(values, props.history));
    }
  });


  useEffect(() => {
    document.body.className = "authentication-bg";
    // remove classname when component will unmount
    return function cleanup() {
      document.body.className = "";
    };
  });
  const { forgetError, forgetSuccessMsg } = useSelector(state => ({
    forgetError: state.ForgetPassword.forgetError,
    forgetSuccessMsg: state.ForgetPassword.forgetSuccessMsg,
  }));


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
            <Col lg={6} className="left-panel">
            <Link to="/productlist"><img src={logo} alt="" /> </Link>
              <div className='slide-content'>
                <Slider {...settings}>
                  <div>
                    <img src={mockup} alt="" />
                    <div className='inner-content'>
                      <h3 className='text-white'>See Server Information</h3>
                      <p className='text-white'>Pick one of our 20+ server locations packed with bare <br /> metal servers and host your applications instantly.</p>
                    </div>
                  </div>
                  <div>
                    <img src={mockup} alt="" />
                    <div className='inner-content'>
                      <h3 className='text-white'>See Server Information</h3>
                      <p className='text-white'>Pick one of our 20+ server locations packed with bare <br /> metal servers and host your applications instantly.</p>
                    </div>
                  </div>
                  <div>
                    <img src={mockup} alt="" />
                    <div className='inner-content'>
                      <h3 className='text-white'>See Server Information</h3>
                      <p className='text-white'>Pick one of our 20+ server locations packed with bare <br /> metal servers and host your applications instantly.</p>
                    </div>
                  </div>
                </Slider>
              </div>
            </Col>
            <Col lg={6}>
              <div className='right_content'>
                <div className="text-center mt-2">
                  <img className='s-icon mb-0 mb-3' src={loginsuspended} alt="" />
                  <h5 className="m-0">Login Suspended</h5>
                  <div className='forgot-content'>
                    <p className='text-muted m-0 font-normal'>Your account has been suspended. To learn more, contact us.</p>
                  </div>
                </div>
                <div className="p-2 mt-4">
                  {/* {forgetError && forgetError ? (
                    <Alert color="danger" className="text-center mb-4" style={{ marginTop: "13px" }}>
                      {forgetError}
                    </Alert>
                  ) : null}
                  {forgetSuccessMsg ? (
                    <Alert color="success" className="text-center mb-4" style={{ marginTop: "13px" }}>
                      {forgetSuccessMsg}
                    </Alert>
                  ) : null} */}

                      <button
                      className="btn btn-primary w-100 waves-effect waves-light d-flex justify-content-center align-items-center"
                      type="submit"
                    >
                       Contact Us
                    </button>   
                    <div className="mt-4 text-center">
                      <p className="mb-0 font-normal"><Link to="/login" className="fw-medium text-primary font-normal d-flex align-itemes-center justify-content-center">  <img className='mx-2' src={arrow} alt="" /> Back to Sign In </Link></p>
                    </div>                
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

LoginSuspended.propTypes = {
  forgetError: PropTypes.any,
  forgetSuccessMsg: PropTypes.any,
  history: PropTypes.object,
  userForgetPassword: PropTypes.func
}

export default withRouter(LoginSuspended);