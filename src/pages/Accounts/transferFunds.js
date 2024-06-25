import React, { useState, useEffect } from "react"
import { Row, Col, Card, CardBody, Input, FormFeedback, Form } from "reactstrap"
import * as Yup from "yup"
import { useFormik } from "formik"
import { withRouter } from "react-router-dom"
import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
import Breadcrumb from "../../components/Common/Breadcrumb"
import { handlePayents, loginData } from "../../pages/Authentication/store/apiServices"
import TextLoader from "../../components/textLoader"
import { toast } from "react-toastify"
import { setPageTitle } from "../../helpers/api_helper_rs"
import { FocusError } from 'focus-formik-error'
// import showeye from "../../assets/images/showeye.svg"
// import hideeye from "../../assets/images/hideeye.svg"
import { customRegex } from "../../helpers/validation_helpers"
import { useHistory } from "react-router-dom"
const TransferFunds = props => {
  let navigate = useHistory()
  const [userData, setUserData] = useState()
  const [loader, setLoader] = useState("")
  const [spinner, setSpinner] = useState(false)
  const [custompay, setcustompay] = useState()

  // const [passwordInputType, setPasswordInputType] = useState(true)


  useEffect(() => {
    setPageTitle("My Account")
    const userInfo = loginData()
    setUserData(userInfo)
  }, [])

  const transferForm = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      transferToId: "",
      transferToAccName: "",
      transferById: userData?.user_name || "",
      transferByAccName: (userData?.first_name + " " + userData?.last_name) || "",
      customAmount: "",
      // password: "",
    },
    validationSchema: Yup.object({
      transferToId: Yup.string()
        .required("Transfer id is required."),
        // .matches(customRegex?.userName, "Enter valid user name."),
      transferToAccName: Yup.string()
        .required("Transfer account name is required.")
        .matches(customRegex?.name, "Only alphabets are allowed"),
      customAmount: Yup.string()
        .matches(customRegex?.onlyDigitsRegex, "Please enter valid amount.")
        .required("Amount is required."),
      // password: Yup.string()
      //   .required("Password is required")
      //   .min(6, "Enter Valid Password"),
    }),
    onSubmit: async values => {
      // let data = new URLSearchParams({
      //   transferToId: values.transferToId,
      //   transferToAccName: values.transferToAccName,
      //   transferById: values.transferById,
      //   transferByAccName: values.transferByAccName,
      //   amount: values.amount,
      //   password: values?.password
      // })
      let data = new FormData()
      data.append('payment_type', "transfer");
      data.append('amount', values?.customAmount);
      data.append('send_to', values?.transferToId)

      // if (!errorMsg) {
        setLoader(true)
        setSpinner(true)
        try {
          const result = await handlePayents(data)
          setLoader(false)
          setSpinner(false)
          navigate.push("/dashboard")
          toast.success(result?.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          })
        } catch (error) {
          toast.error(error?.response?.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          })
          setLoader(false)
          setSpinner(false)
        }
      // }
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
            transferForm.handleSubmit()
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
                  <FocusError formik={transferForm} />
                  <label>Transfer Id</label>
                  <Input
                    name="transferToId"
                    className="mt-3 input-outline"
                    placeholder="Transfer Id"
                    type="text"
                    onChange={transferForm.handleChange}
                    onBlur={transferForm.handleBlur}
                    // disabled={true}
                    value={transferForm.values.transferToId || ""}
                    invalid={
                      transferForm.touched.transferToId &&
                        transferForm.errors.transferToId
                        ? true
                        : false
                    }
                  />
                  {transferForm.touched.transferToId &&
                    transferForm.errors.transferToId ? (
                    <>
                      <FormFeedback type="invalid">
                        <img
                          className="form-error-icon"
                          src={rederror}
                          alt=""
                          height={15}
                        />
                        {transferForm.errors.transferToId}
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
                    onChange={transferForm.handleChange}
                    onBlur={transferForm.handleBlur}
                    value={transferForm.values.transferToAccName || ""}
                    invalid={
                      transferForm.touched.transferToAccName &&
                        transferForm.errors.transferToAccName
                        ? true
                        : false
                    }
                  />
                  {transferForm.touched.transferToAccName &&
                    transferForm.errors.transferToAccName ? (
                    <>
                      <FormFeedback type="invalid">
                        <img
                          className="form-error-icon"
                          src={rederror}
                          alt=""
                          height={15}
                        />
                        {transferForm.errors.transferToAccName}
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
                  <FocusError formik={transferForm} />
                  <label>Transfer Id</label>
                  <Input
                    name="transferById"
                    className="mt-3 input-outline"
                    placeholder=""
                    type="text"
                    readOnly
                    value={transferForm.values.transferById}
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
                    value={transferForm.values.transferByAccName}
                  />
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <div className="test form-check form-check-inline mt-20 ">
                    {/* <span className="prefix">{currency?.prefix}$</span> */}
                    <div className="inner-input-box">
                      <Input
                        className="chose-payment"
                        value={transferForm.values.customAmount || ""}
                        placeholder="5000"
                        max="5000"
                        min="50"
                        onChange={e => {
                          transferForm.handleChange(e)
                          setcustompay(e.target.value)
                        }}
                        onBlur={(e) => {
                          transferForm.handleBlur,
                            custompay > 5000 ? transferForm.values.customAmount = 5000 : custompay < 50 ? transferForm.values.customAmount = 50 : null
                        }}
                        invalid={
                          transferForm.touched.customAmount &&
                            transferForm.errors.customAmount
                            ? true
                            : false
                        }
                        type="number"
                        name="customAmount"

                        disabled={spinner}
                      />

                      {transferForm.touched.customAmount &&
                        transferForm.errors.customAmount ? (
                        <>
                          <FormFeedback type="invalid">
                            <img
                              className="form-error-icon"
                              src={rederror}
                              alt=""
                              height={15}
                            />
                            {transferForm.errors.customAmount}
                          </FormFeedback>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <span className="billing-max-amt">*Maximum amount: 5000</span>

                </Col>
              </Row>
              <br />
              {/* <Row>
                <Col lg="6">
                  <label>Password</label>
                  <div className="mb-3 form-g position-relative">
                      <Input
                        name="password"
                        // autoComplete="off"
                        className="input-outline"
                        value={transferForm.values.password || ""}
                        type={passwordInputType ? "password" : "text"}
                        placeholder="**********"
                        onChange={transferForm.handleChange}
                        onBlur={transferForm.handleBlur}
                        invalid={
                          transferForm.touched.password &&
                          transferForm.errors.password
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

                      {transferForm.touched.password &&
                      transferForm.errors.password ? (
                        <>
                          <FormFeedback type="invalid">
                            <img
                              className="form-error-icon"
                              src={rederror}
                              alt=""
                              height={15}
                            />
                            {transferForm.errors.password}
                          </FormFeedback>
                        </>
                      ) : null}
                    </div>
                </Col>
              </Row> */}
            </CardBody>
          </Card>
          <div className="btn-group mt-30">
            {/* <button
              className="btn btn-primary w-100 waves-effect waves-light btn-cancel m-0"
              type="button"
              onClick={() => transferForm.resetForm({ values: "" })}
            >
              Cancel
            </button> */}
            <button
              className="btn btn-primary w-100 waves-effect waves-light btn-save font-normal btnv1"
              type="submit"
              disabled={spinner}
            >
              {spinner ? <div className="ui active inline loader"></div> : "Transfer Funds"}
            </button>
          </div>
        </Form>
        <TextLoader loading={loader} loader={loader} />
      </div>
    </React.Fragment>
  )
}
export default withRouter(TransferFunds)
