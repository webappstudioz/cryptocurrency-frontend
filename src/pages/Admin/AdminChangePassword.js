import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap"

// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"
import { withRouter } from "react-router-dom"

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb"
import { changePassword } from "../Authentication/store/apiServices"
import { toast } from "react-toastify"
import { customRegex } from "../../helpers/validation_helpers"
import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
import showeye from "../../assets/images/showeye.svg"
import hideeye from "../../assets/images/hideeye.svg"
import { setPageTitle } from "../../helpers/api_helper_rs"
import TextLoader from "../../components/textLoader"

const AdminChangePassword = props => {
  const [passwordInputType, setPasswordInputType] = useState(true)
  const [newpasswordInputType, setNewPasswordInputType] = useState(true)
  const [confirmPasswordInputType, setConfirmPasswordInputType] = useState(true)
  const [securityKeyType, setSecurityKeyType] = useState(true)
  const [loading, setLoading] = useState("")
  const success = false
  const error = false

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      existingPassword: "",
      newPassword: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
        existingPassword: Yup.string().required("Please enter existing password"),
        newPassword: Yup.string()
            .required("Please enter your new password")
            .min(8, "Password must be 8 characters at least")
            .max(30, "Password should not exceed 30 characters.")
            .matches(
            customRegex.password,
            "Please enter atleast one uppercase letter, one lowercase letter, one digit and one special character"
            ),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
            .required("Confirm password is required"),
        securityKey: Yup.string()
            .required("Security key is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      setLoading(true)
      try {
        let data = new URLSearchParams({
          old_password: values.existingPassword,
          password: values.newPassword,
          password_confirmation: values.confirmPassword,
        })
        let res = await changePassword(data)
        if (res) {
          setLoading(false)
          toast.success(res?.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          })
        }
        resetForm({ values: "" })
        setConfirmPassVal("")
        setConfirmPasswordInputType(true)
        setNewPasswordInputType(true)
        setPasswordInputType(true)
        securityKeyType(true)
      } catch (err) {
        setConfirmPasswordInputType(true)
        setNewPasswordInputType(true)
        setPasswordInputType(true)
        securityKeyType(true)
        setLoading(false)
        toast.error(err?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        resetForm({ values: "" })
        setConfirmPassVal("")
      }
    },
  })

  useEffect(() => {
    setPageTitle("Change Password")
  }, [])
  return (
    <React.Fragment>
      <div
        // className={
        //   loader ? "page-content change-pw overlayerloader" : "page-content"
        // }
        className="page-content"
      >
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumb title="Minible" breadcrumbItem="Change Password" />

          <Row>
            <Col lg="12">
              {/* {error && error ? <Alert color="danger">{error}</Alert> : null} */}
              {/* {success ? <Alert color="success">{success}</Alert> : null} */}
              <Form
                className="form-horizontal profile-form"
                onSubmit={e => {
                  e.preventDefault()
                  validation.handleSubmit()
                  return false
                }}
              >
                <Card className="m-0">
                  <CardBody>
                    <div className="form-group">
                      <Label className="form-label">Existing Password</Label>
                      <Input
                        disabled={loading}
                        name="existingPassword"
                        value={validation.values.existingPassword || ""}
                        type={passwordInputType ? "password" : "text"}
                        placeholder="**********"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.existingPassword &&
                          validation.errors.existingPassword
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
                      {validation.touched.existingPassword &&
                      validation.errors.existingPassword ? (
                        <>
                          <FormFeedback type="invalid">
                            <img
                              className="form-error-icon"
                              src={rederror}
                              alt=""
                              height={15}
                            />
                            {validation.errors.existingPassword}
                          </FormFeedback>
                        </>
                      ) : null}
                    </div>
                    <div className="form-group position-relative">
                      <Label className="form-label">New Password</Label>
                      <Input
                        disabled={loading}
                        name="newPassword"
                        value={validation.values.newPassword || ""}
                        type={newpasswordInputType ? "password" : "text"}
                        placeholder="**********"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.newPassword &&
                          validation.errors.newPassword
                            ? true
                            : false
                        }
                      />
                      <div
                        onClick={() =>
                          setNewPasswordInputType(!newpasswordInputType)
                        }
                      >
                        <img
                          className="pw-icon"
                          height={18}
                          src={newpasswordInputType ? showeye : hideeye}
                          alt=""
                        />
                      </div>
                      {validation.touched.newPassword &&
                      validation.errors.newPassword ? (
                        <>
                          <FormFeedback type="invalid">
                            <img
                              className="form-error-icon"
                              src={rederror}
                              alt=""
                              height={15}
                            />
                            {validation.errors.newPassword}
                          </FormFeedback>
                        </>
                      ) : null}
                    </div>
                    <div className="form-group">
                      <Label className="form-label">Confirm New Password</Label>
                      <Input
                        disabled={loading}
                        name="confirmPassword"
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
                        <>
                          <FormFeedback type="invalid">
                            <img
                              className="form-error-icon"
                              src={rederror}
                              alt=""
                              height={15}
                            />
                            {validation.errors.confirmPassword}
                          </FormFeedback>
                        </>
                      ) : null}
                    </div>
                    <div className="form-group">
                      <Label className="form-label">Confirm New Password</Label>
                      <Input
                        disabled={loading}
                        name="securityKey"
                        value={validation.values.securityKey || ""}
                        type={securityKeyType ? "password" : "text"}
                        placeholder="**********"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.securityKey &&
                          validation.errors.securityKey
                            ? true
                            : false
                        }
                      />
                      <div
                        onClick={() =>
                          setSecurityKeyType(!securityKeyType)
                        }
                      >
                        <img
                          className="pw-icon"
                          height={18}
                          src={securityKeyType ? showeye : hideeye}
                          alt=""
                        />
                      </div>
                      {validation.touched.securityKey &&
                      validation.errors.securityKey ? (
                        <>
                          <FormFeedback type="invalid">
                            <img
                              className="form-error-icon"
                              src={rederror}
                              alt=""
                              height={15}
                            />
                            {validation.errors.securityKey}
                          </FormFeedback>
                        </>
                      ) : null}
                    </div>
                  </CardBody>
                </Card>
                <div className="btn-group mt-30">
                  <button
                    className="btn btn-primary w-100 waves-effect waves-light btn-save m-0"
                    type="submit"
                    disabled={loading}
                  >
                   {loading?  <div className="ui active inline loader"></div> : "Save Changes"}
                  </button>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
        <TextLoader loading={loading}/>
      </div>
    </React.Fragment>
  )
}

export default withRouter(AdminChangePassword)
