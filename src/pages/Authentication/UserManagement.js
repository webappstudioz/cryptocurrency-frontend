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
import { useDispatch } from "react-redux";

import { withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";


import time from "../../assets/images/time.svg"

const UserManagement = props => {
  const dispatch = useDispatch();

  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [idx, setidx] = useState("");

  const success = false
  const error = false


 
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
    onSubmit: async(values) => {
    }
  });


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumb title="Minible" breadcrumbItem="User Management" />

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
                <Card>
                  <CardBody>
                    <div className="form-g position-relative form-bottom-border mb-20">
                      <Input
                        name="email"
                        className="form-control"
                        placeholder="Email Address"
                        type="email"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email || ""}
                        invalid={
                          validation.touched.email && validation.errors.email ? true : false
                        }
                      />

                    </div>
                    <div className="inner-content user">
                      <h4 className="font-bold text-blue">ikperfect@hotmail.com</h4>
                      <p className="text-primary d-flex align-items-center font-semi"><img className="mr-3" src={time} /> Last Login: 1 month ago</p>

                      <div className="grp-btn d-inline-flex">
                        <button
                          className="btn btn-border waves-effect waves-light"
                          type="submit"
                        >
                          Manage Permissions
                        </button>
                        <button
                          className="btn btn-danger waves-effect waves-light mx-lg-4 btn-remove text-white"
                          type="submit"
                        >
                          Remove Access
                        </button>
                      </div>

                    </div>
                  </CardBody>
                </Card>
                <Card className="m-0">
                  <CardBody>
                    <div className="inner-content invite-user">
                      <h6 className="font16  font-semibold">Invite New User</h6>

                      <div className="mb-3 form-g position-relative">
                        <Input
                          name="username"
                          className="form-control bg-input"
                          type="email"
                          placeholder="redswitches@gmail.com"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                        />
                      </div>

                      <div className="radio-btn">
                        <div className="form-check form-check-inline">
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
                            All permissions
                          </Label>
                        </div>
                        &nbsp;
                        <div className="form-check form-check-inline">
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
                            Choose permissions
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
                <div className="btn-group mt-30">
                  <button
                    className="btn btn-primary w-100 waves-effect waves-light btn-save font-normal btnv1"
                    type="submit"
                  >
                    Send Invite
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

export default withRouter(UserManagement);
