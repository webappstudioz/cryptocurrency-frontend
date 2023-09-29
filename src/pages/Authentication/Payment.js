import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";

import { withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

 
import time from "../../assets/images/time.svg"
import paypal from "../../assets/images/paypal.svg"
import razor from "../../assets/images/razor.svg"
import stripe from "../../assets/images/stripe.svg"
import usd from "../../assets/images/usd.svg"
import wise from "../../assets/images/wise.svg"

const Payment = props => {
  const dispatch = useDispatch();

  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [idx, setidx] = useState("");

 
  const success = false
  const error = false

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        setname(obj.displayName);
        setemail(obj.email);
        setidx(obj.uid);
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {

        if (obj.username) {
          setname(obj.username);
          setidx(obj.uid);
        } else {
          setname(obj.name);
        }

        setemail(obj.email);

      }
      setTimeout(() => {
        //resetProfileFlag
      }, 3000);
    }
  }, [dispatch, success]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: name || '',
      idx: idx || '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Please Enter Your UserName"),
    }),
    onSubmit: (values) => {
     //submit
    }
  });


  return (
    <React.Fragment>
      <div className="page-content payment">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumb title="Minible" breadcrumbItem="Add Funds" />

          <Row>
            <Col lg="12">
              {/* {error && error ? <Alert color="danger">{error}</Alert> : null}
              {success ? <Alert color="success">{success}</Alert> : null} */}
              <Form
                className="form-horizontal user-management"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Card className="m-0">
                  <CardBody>
                    <div className="inner-content invite-user rd-group">
                      <h6 className="font16  font-semibold">Select a Payment Method</h6>
                      <div className="radio-btn">
                        <Row>
                          <Col>
                            <div className="form-check form-check-inline mt-20">
                              <Input
                                type="radio"
                                id="customRadioInline1"
                                name="customRadioInline1"
                                className="form-check-input"
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="customRadioInline1"
                              >
                                <img src={paypal} />
                                <p className="font-normal">Paypal</p>
                              </Label>
                            </div>
                          </Col>
                          <Col>
                            <div className="form-check form-check-inline mt-20">
                              <Input
                                type="radio"
                                id="customRadioInline2"
                                name="customRadioInline1"
                                className="form-check-input"
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="customRadioInline2"
                              >
                                <img src={stripe} />
                                <p className="font-normal">Credit card</p>
                              </Label>
                            </div>
                          </Col>
                          <Col>
                            <div className="form-check form-check-inline mt-20">
                              <Input
                                type="radio"
                                id="customRadioInline3"
                                name="customRadioInline1"
                                className="form-check-input"
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="customRadioInline3"
                              >
                                <img src={usd} />
                                <p className="font-normal">Crypto</p>
                              </Label>
                            </div>
                          </Col>
                          <Col>
                            <div className="form-check form-check-inline mt-20">
                              <Input
                                type="radio"
                                id="customRadioInline4"
                                name="customRadioInline1"
                                className="form-check-input"
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="customRadioInline4"
                              >
                                <img src={razor} />
                                <p className="font-normal"> UPI/NEFT/IMPS  </p>

                              </Label>
                            </div>
                          </Col>
                          <Col>
                            <div className="form-check form-check-inline mt-20">
                              <Input
                                type="radio"
                                id="customRadioInline5"
                                name="customRadioInline1"
                                className="form-check-input"
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="customRadioInline5"
                              >
                                <img src={wise} />
                                <p className="font-normal"> BankTransfer  </p>
                              </Label>
                            </div>
                          </Col>
                        </Row>


                      </div>
                    </div>
                    <div className="inner-content invite-user rd-group mt-4">
                      <h6 className="font16  font-semibold">Choose Payment Amount</h6>
                      <div className="radio-btn amount">
                        <Row>
                          <Col>
                            <div className="form-check form-check-inline mt-20">
                              <Input
                                type="radio"
                                id="customRadioInline6"
                                name="customRadioInline1"
                                className="form-check-input"
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="customRadioInline6"
                              >
                                <p className="font-normal">$100 USD</p>
                              </Label>
                            </div>
                          </Col>
                          <Col>
                            <div className="form-check form-check-inline mt-20">
                              <Input
                                type="radio"
                                id="customRadioInline7"
                                name="customRadioInline1"
                                className="form-check-input"
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="customRadioInline7"
                              >
                                <p className="font-normal">$250 USD </p>
                              </Label>
                            </div>
                          </Col>
                          <Col>
                            <div className="form-check form-check-inline mt-20">
                              <Input
                                type="radio"
                                id="customRadioInline8"
                                name="customRadioInline1"
                                className="form-check-input"
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="customRadioInline8"
                              >
                                <p className="font-normal">$500 USD</p>
                              </Label>
                            </div>
                          </Col>
                          <Col>
                            <div className="form-check form-check-inline mt-20">
                              <Input
                                type="radio"
                                id="customRadioInline9"
                                name="customRadioInline1"
                                className="form-check-input"
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="customRadioInline9"
                              >
                                <p className="font-normal"> $500 USD  </p>

                              </Label>
                            </div>
                          </Col>
                          <Col>
                            <div className="form-check form-check-inline mt-20">
                              <Input
                                type="radio"
                                id="customRadioInline10"
                                name="customRadioInline1"
                                className="form-check-input"
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="customRadioInline10"
                              >
                                <p className="font-normal"> Custom </p>
                              </Label>
                            </div>
                          </Col>
                        </Row>


                      </div>
                    </div>
                    <div className="check-group">
                    <div className="form-check d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="customControlInline"
                      />
                      <label
                        className="form-check-label d-flex align-items-center"
                        htmlFor="customControlInline"
                      >                       
                        I agree to <b className="m-0 font-semibold"> Terms & Conditions</b>
                      </label>       
                                  
                    </div>
                  </div>                   
                  </CardBody>
                </Card>         

                <div className="btn-group m-0 mt-30">
                  <button
                    className="btn btn-primary w-100 waves-effect waves-light btn-save font-normal btnv1"
                    type="submit"
                  >
                   Save Changes
                  </button>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Payment);
