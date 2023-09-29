import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Input,
  FormFeedback,
  Form,
} from "reactstrap"

// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"

//redux
import { useDispatch } from "react-redux"
import { withRouter } from "react-router-dom"

//actions
import { isUserUpdated } from "../../store/auth/userdetails/actions"

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb"
import {
  userInfo, //check this funtion
  postUserProfileDetails,
  getUserInfo,
  storeUserData,
  loginData,
} from "./store/apiServices"
import { customRegex } from "../../helpers/validation_helpers"
import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
import TextLoader from "../../components/textLoader"
import { toast } from "react-toastify"
const UserAccountDetail = props => {
  const dispatch = useDispatch()
  const [userDetail, setUserDetail] = useState("")
  const [loader, setloader] = useState("")
  const success = false
  const error = false

  useEffect(async () => {
    getUsersInfo()
  }, [])


  const getUsersInfo = async() => {
    try{
      setloader(true)
      let info = await userInfo()
      if(info){
        setloader(false)
        setUserDetail(info)
      }else {
        handleuserInfo()
      }
    }catch(error){
      setloader(false)
    }
  }

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      firstName: userDetail?.first_name || "",
      lastName: userDetail?.last_name || "",
      email: userDetail?.email || "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .required("Please enter your first name.")
        .matches(customRegex.name, "Only albhabets are allowed.")
        .min(3, "First name must be minimum 3 characters long")
        .max(15, "First name must be maximum 15 characters long"),
      lastName: Yup.string()
        .required("Please enter your last name.")
        .matches(customRegex.name, "Only albhabets are allowed.")
        .min(3, "Last name must be minimum 3 characters long")
        .max(15, "Last name must be maximum 15 characters long"),
    }),
    onSubmit: async values => {
      setloader(true)
      try {
        let data = new URLSearchParams({
          first_name: values?.firstName,
          last_name: values?.lastName,
          email: values?.email,
        })
        let result = await postUserProfileDetails(data)
        if (result) {
          toast.success(result.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          })
        }
        setloader(false)
        handleuserInfo()
        // dispatch(isUserUpdated(values))
      } catch (error) {
        setloader(false)
        setloading(false)
        toast.error(error?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      }
    },
  })

  const handleuserInfo = async() => {
    try{
      let res = await getUserInfo()
      if(res){
        let info = res?.data?.data
        setUserDetail(info)
        setloader(false)
        let data = loginData()
        data.first_name = info?.first_name
        data.last_name = info?.last_name
        storeUserData(data)
        dispatch(isUserUpdated(data))
      }
    }catch(error) {
      setloader(false)
     }
  }

  return (
    <React.Fragment>
      <div className={loader ? "page-content overlayerloader" : "page-content"}>
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumb title="Minible" breadcrumbItem="User account details" />

          <Row>
            <Col lg="12">
              {/* {error && error ? <Alert color="danger">{error}</Alert> : null}
              {success ? <Alert color="success">{success}</Alert> : null} */}
              <Form
                className="form-horizontal floating-form my-account"
                onSubmit={e => {
                  e.preventDefault()
                  validation.handleSubmit()
                  return false
                }}
              >
                <Card>
                  <CardBody>
                    <div className="my-account-header">
                      <h6 className="font16  font-semibold">Personal</h6>
                    </div>
                    <Row>
                      <Col lg="6">
                        <Input
                          name="firstName"
                          className="mt-3"
                          placeholder="Firstname"
                          type="text"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.firstName || ""}
                          invalid={
                            validation.touched.firstName &&
                            validation.errors.firstName
                              ? true
                              : false
                          }
                        />
                        {validation.touched.firstName &&
                        validation.errors.firstName ? (
                          <>
                            <FormFeedback type="invalid">
                              <img
                                className="form-error-icon"
                                src={rederror}
                                alt=""
                                height={15}
                              />
                              {validation.errors.firstName}
                            </FormFeedback>
                          </>
                        ) : null}
                      </Col>
                      <Col lg="6">
                        <Input
                          name="lastName"
                          className="mt-3"
                          placeholder="Lastname"
                          type="text"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.lastName || ""}
                          invalid={
                            validation.touched.lastName &&
                            validation.errors.lastName
                              ? true
                              : false
                          }
                        />
                        {validation.touched.lastName &&
                        validation.errors.lastName ? (
                          <>
                            <FormFeedback type="invalid">
                              <img
                                className="form-error-icon"
                                src={rederror}
                                alt=""
                                height={15}
                              />
                              {validation.errors.lastName}
                            </FormFeedback>
                          </>
                        ) : null}
                      </Col>
                      <Col lg="6">
                        <Input
                          name="email"
                          className="mt-3"
                          placeholder="Email"
                          type="email"
                          value={validation.values.email || ""}
                          readOnly
                        />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>

                <div className="btn-group">
                  <button
                    className="btn btn-primary w-100 waves-effect waves-light btn-cancel"
                    type="button"
                    onClick={() => validation.resetForm({ values: "" })}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary w-100 waves-effect waves-light btn-save"
                    type="submit"
                  >
                    Save Changes
                  </button>
                </div>
              </Form>
            </Col>
          </Row>
          <TextLoader loading={loader} loader={loader}/>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(UserAccountDetail)
