import React, { useState, useEffect } from "react"
import { Row, Col, Card, CardBody, Input, FormFeedback, Form } from "reactstrap"
import * as Yup from "yup"
import { useFormik } from "formik"
import { withRouter } from "react-router-dom"
import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
import Breadcrumb from "../../components/Common/Breadcrumb"
import { loginData, postClientProfileDetails } from "../../pages/Authentication/store/apiServices"
import TextLoader from "../../components/textLoader"
import { toast } from "react-toastify"
import { setPageTitle } from "../../helpers/api_helper_rs"
import { FocusError } from 'focus-formik-error'
import showeye from "../../assets/images/showeye.svg"
import hideeye from "../../assets/images/hideeye.svg"
import { customRegex } from "../../helpers/validation_helpers"
const TransferFunds = props => {
  const [userData, setUserData] = useState()
  const [loader, setloader] = useState("")
  const [passwordInputType, setPasswordInputType] = useState(true)


  useEffect(() => {
    setPageTitle("My Account")
    const userInfo = loginData()
    setUserData(userInfo)
  }, [])

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      transferToId: "",
      transferToAccName: "",
      transferById: userData?.user_name || "",
      transferByAccName: (userData?.first_name + " " + userData?.last_name) || "",
      amount: "",
      password: "",
    },
    validationSchema: Yup.object({
      transferToId: Yup.string()
        .required("Transfer id is required.")
        .matches(/^[A-Za-z]+$/, "Only albhabets are allowed."),
      transferToAccName: Yup.string()
        .required("Transfer account name is required.")
        .matches(customRegex?.name, "Only alphabets are allowed"),
      amount: Yup.string()
        .matches(customRegex?.onlyDigitsRegex, "Please enter valid amount.")
        .required("Amount is required."),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Enter Valid Password"),
    }),
    onSubmit: async values => {
      let data = new URLSearchParams({
        transferToId: values.transferToId,
        transferToAccName: values.transferToAccName,
        transferById: values.transferById,
        transferByAccName: values.transferByAccName,
        amount: values.amount,
        password: values?.password
      })

      try {
        setloader(true)
        let res = await postClientProfileDetails(data)
        if (res) {
          setloader(false)
          toast.success(res.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          })
        }

      } catch (error) {
        setloader(false)
        toast.error(error?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      }
    },
  })

  return (
    <React.Fragment>
      <div
        className={
          loader
            ? "page-content my-account overlayerloader"
            : "page-content my-account"
        }
      >
        <Breadcrumb title="Minible" breadcrumbItem="Transfer Funds" />
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
                <h6 className="font16  font-semibold">
                  Transfer To
                </h6>
              </div>
              <br />
              <Row>
                <Col lg="6">
                  <FocusError formik={validation} />
                  <label>Transfer Id</label>
                  <Input
                    name="transferToId"
                    className="mt-3 input-outline"
                    placeholder="Transfer Id"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    // disabled={true}
                    value={validation.values.transferToId || ""}
                    invalid={
                      validation.touched.transferToId &&
                        validation.errors.transferToId
                        ? true
                        : false
                    }
                  />
                  {validation.touched.transferToId &&
                    validation.errors.transferToId ? (
                    <>
                      <FormFeedback type="invalid">
                        <img
                          className="form-error-icon"
                          src={rederror}
                          alt=""
                          height={15}
                        />
                        {validation.errors.transferToId}
                      </FormFeedback>
                    </>
                  ) : null}
                </Col>
              </Row>
              <br />
              <Row>
                <Col lg="6">
                  <label>{"Account Holder's Name"}</label>
                  <Input
                    name="transferToAccName"
                    className="mt-3 input-outline"
                    placeholder="Account Holder's Name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.transferToAccName || ""}
                    invalid={
                      validation.touched.transferToAccName &&
                        validation.errors.transferToAccName
                        ? true
                        : false
                    }
                  />
                  {validation.touched.transferToAccName &&
                    validation.errors.transferToAccName ? (
                    <>
                      <FormFeedback type="invalid">
                        <img
                          className="form-error-icon"
                          src={rederror}
                          alt=""
                          height={15}
                        />
                        {validation.errors.transferToAccName}
                      </FormFeedback>
                    </>
                  ) : null}
                </Col>
              </Row>
              <br />
              <div className="my-account-header">
                <h6 className="font16  font-semibold">
                  Transfer By
                </h6>
              </div>
              <br />
              <Row>
                <Col lg="6">
                  <FocusError formik={validation} />
                  <label>Transfer Id</label>
                  <Input
                    name="transferById"
                    className="mt-3 input-outline"
                    placeholder=""
                    type="text"
                    readOnly
                    value={validation.values.transferById}
                  />
                </Col>
              </Row>
              <br />
              <Row>
                <Col lg="6">
                  <label>{"Account Holder's Name"}</label>
                  <Input
                    name="transferByAccName"
                    className="mt-3 input-outline"
                    placeholder="Account Holder's Name"
                    type="text"
                    readOnly
                    value={validation.values.transferByAccName}
                  />
                </Col>
              </Row>
              <br />
              <Row>
                <Col lg="6">
                  <label>Ammount</label>
                  <Input
                    name="amount"
                    className="mt-3 input-outline"
                    placeholder="Amount"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.amount || ""}
                    invalid={
                      validation.touched.amount &&
                        validation.errors.amount
                        ? true
                        : false
                    }
                  />
                  {validation.touched.amount &&
                    validation.errors.amount ? (
                    <>
                      <FormFeedback type="invalid">
                        <img
                          className="form-error-icon"
                          src={rederror}
                          alt=""
                          height={15}
                        />
                        {validation.errors.amount}
                      </FormFeedback>
                    </>
                  ) : null}
                </Col>
              </Row>
              <br />
              <Row>
                <Col lg="6">
                  <label>Password</label>
                  <div className="mb-3 form-g position-relative">
                      <Input
                        name="password"
                        // autoComplete="off"
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
                    </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
          <div className="btn-group mt-30">
            <button
              className="btn btn-primary w-100 waves-effect waves-light btn-cancel m-0"
              type="button"
              onClick={() => validation.resetForm({ values: "" })}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary w-100 waves-effect waves-light btn-save m-0"
              type="submit"
            >
              Transfer Request
            </button>
          </div>
        </Form>
        <TextLoader loading={loader} loader={loader} />
      </div>
    </React.Fragment>
  )
}
export default withRouter(TransferFunds)
