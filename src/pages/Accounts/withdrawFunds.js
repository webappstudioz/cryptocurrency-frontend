import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Input,
  Form,
  FormFeedback
} from "reactstrap"

// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"
import { withRouter } from "react-router-dom"
import LogoGreen from "../../assets/images/c2c/logoGreen.jpg"
//Import Breadcrumb

import Breadcrumb from "../../components/Common/Breadcrumb"
import { setPageTitle } from "../../helpers/api_helper_rs"
import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
import { customRegex } from "../../helpers/validation_helpers"
import { toast } from "react-toastify"
import TextLoader from "../../components/textLoader"
import PaymentModal from "../../components/Common/PaymentModal"
import BankLogo from "../../assets/images/c2c/banklogo.png"
import TetherLogo from "../../assets/images/c2c/tetherlogo.png"
import { getUserDetail, handlePayents, loginData, storeUserData } from "../Authentication/store/apiServices"
import { useHistory } from "react-router-dom"
import { isUserUpdated } from "../../store/auth/userdetails/actions"
import { useDispatch } from "react-redux"

const WihtdrawFunds = () => {
  const dispatch = useDispatch()
  let navigate = useHistory()
  const IMAGE_URL = process.env.REACT_APP_IMAGE_HOST
  const [loader, setLoader] = useState(false)
  const [custompay, setcustompay] = useState()
  const [selectedMethod, setSelectedMethod] = useState("bank")
  const [openModal, setOpenModal] = useState(false)
  const [userInfo, setUserInfo] = useState("")

  useEffect(() => {
    setPageTitle("Withdraw Funds")
    const info = loginData()
    handleUserDetails(info?.id)
  }, [])

  const handleUserDetails = async (userId) => {
    try {
      const result = await getUserDetail(userId)
      const info = result?.data?.data
      setUserInfo(info)
      dispatch(isUserUpdated(info))
      storeUserData(info)
      setLoader(false)
    } catch (error) {
      setLoader(false)
    }
  }

  const WithdrawForm = useFormik({
    enableReinitialize: true,

    initialValues: {
      customAmount: "",
    },
    validationSchema: Yup.object({
      customAmount: Yup.string()
        .required("Please enter amount.")
        .matches(customRegex?.amount, "Please valid amount"),
    }),

    onSubmit: async(values) => {
      let data = new FormData()
      data.append('payment_type', "withdraw");
      data.append('method_type', selectedMethod);
      data.append('amount', values?.customAmount);
      if (!errorMsg) {
        setOpenModal(true)
        try {
          const result = await handlePayents(data)
          setOpenModal(false)
          navigate.push("/dashboard")
          toast.success(result?.data?.message, {
						position: toast.POSITION.TOP_RIGHT,
					})
        } catch (error) {
          toast.error(error?.response?.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          })
          setOpenModal(false)
        }
      }
    },
  })


  return (
    <React.Fragment>
      <div
        className={
          loader
            ? "page-content payment  overlayerloader"
            : "page-content payment"
        }
      >
        <Container fluid>
          <Breadcrumb title="Minible" breadcrumbItem="Deposit Funds" />

          <Row>
            <Col lg="12">
              <Form
                className="form-horizontal user-management"
                onSubmit={e => {
                  e.preventDefault()
                  WithdrawForm.handleSubmit()
                  return false
                }}
              >
                <Card>
                  <CardBody>
                    <div className="inner-content invite-user rd-group">
                      <h6 className="font16  font-semibold">
                        Select a Payment Method
                      </h6>
                      <div className="radio-btn">
                        <Row>
                          <Col>
                            <div className="form-check form-check-inline mt-20">
                              <Input
                                type="radio"
                                id="bank"
                                name="paymentMethod"
                                className="form-check-input"
                                value={"bank"}
                                checked={selectedMethod === "bank"}
                                onChange={() => { }}
                                onClick={() => {
                                  setSelectedMethod("bank")
                                }}
                              // disabled={spinner}
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="bank"
                              >
                                <img src={BankLogo} />
                                <p className="font-normal">India Local Banks</p>
                              </Label>
                            </div>
                          </Col>
                          <Col>
                            <div className="form-check form-check-inline mt-20">
                              <Input
                                type="radio"
                                id="tether"
                                name="paymentMethod"
                                className="form-check-input"
                                value={"value"}
                                checked={selectedMethod === "tether"}
                                onChange={() => { }}
                                onClick={() => {
                                  setSelectedMethod("tether")
                                }}
                              // disabled={spinner}
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="tether"
                              >
                                <img src={TetherLogo} />
                                <p className="font-normal">Tether</p>
                              </Label>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </CardBody>
                </Card>
                <div
                  className="slide"
                  style={{
                    height: selectedMethod !== "bank" ? "auto" : "0px",
                    overflow: "hidden",
                    maxHeight: "450px",
                    transition: "height 0.6s ease 0s",
                    opacity: selectedMethod !== "bank" ? 1 : 0,
                  }}
                >
                  <div>
                    <div className="row">
                      <div className="col-md-12">
                        <h5 className="info_heding firstLettercapital">{selectedMethod}</h5>
                        <div className="tab_content tab-data-table">
                          <div className="row">
                            <div className="col-md-6">
                              <table className="w-100">
                                <tbody>
                                  <img src={userInfo?.crypto_image ? (IMAGE_URL + userInfo?.crypto_image) : LogoGreen} style={{ height: "100%", width: "100%" }} />
                                </tbody>
                              </table>
                            </div>
                            <div className="col-md-6">
                              <table className="w-100">
                                <tbody>
                                  <tr>
                                    <th>Crypto Id</th>
                                    <React.Fragment>
                                      <td className="text-right">
                                        {userInfo?.crypto_id}
                                      </td>
                                    </React.Fragment>
                                    <><td></td><td></td><td></td></>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <br />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="slide"
                  style={{
                    height: selectedMethod === "bank" ? "auto" : "0px",
                    overflow: "hidden",
                    maxHeight: "450px",
                    transition: "height 0.6s ease 0s",
                    opacity: selectedMethod === "bank" ? 1 : 0,
                  }}
                >
                  <div>
                    <div className="row">
                      <div className="col-md-12">
                        <h5 className="info_heding">Bank Details</h5>
                        <div className="tab_content tab-data-table">
                          <div className="row">
                            <div className="col-md-6">
                              <table className="w-100">
                                <tbody>
                                  <img src={userInfo?.account_image ? (IMAGE_URL + userInfo?.account_image) : LogoGreen} style={{ height: "100%", width: "100%" }} />
                                </tbody>
                              </table>
                            </div>
                            <div className="col-md-6">
                              <table className="w-100">
                                <tbody>
                                  <tr>
                                    <th>Bank Name</th>
                                    <React.Fragment>
                                      <td className="text-right capitalize">
                                        {userInfo?.bank_name}
                                      </td>
                                    </React.Fragment>
                                    <><td></td><td></td><td></td></>
                                  </tr>
                                  <tr></tr>
                                  <tr>
                                    <th>Account Number</th>
                                    <React.Fragment>
                                      <td className="text-right">
                                        {userInfo?.account_number}
                                      </td>
                                    </React.Fragment>
                                    <><td></td><td></td><td></td></>
                                  </tr>
                                  <tr></tr>
                                  <tr>
                                    <th>{"Account Holder's Name"}</th>
                                    <React.Fragment>
                                      <td className="text-right firstLettercapital">
                                        {userInfo?.account_holder_name}
                                      </td>
                                    </React.Fragment>
                                    <><td></td><td></td><td></td></>
                                  </tr>
                                  <tr></tr>
                                  <tr>
                                    <th>IFSC Code</th>
                                    <React.Fragment>
                                      <td className="text-right">
                                        {userInfo?.ifsc_code}
                                      </td>
                                    </React.Fragment>
                                    <><td></td><td></td><td></td></>
                                  </tr>
                                  <tr></tr>
                                  <tr>
                                    <th>UPI ID</th>
                                    <React.Fragment>
                                      <td className="text-right">
                                        {userInfo?.upi_id}
                                      </td>
                                    </React.Fragment>
                                    <><td></td><td></td><td></td></>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <br />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="m-0  mt-3">
                  <CardBody>
                    <div className="inner-content invite-user rd-group">
                      <div className="radio-btn amount imp-how-text">
                        <h6 className="font16  font-semibold">
                          Important to know
                        </h6>
                        <div className="imp-how-para">
                          <span>The minimum deposit amount is 50t. All deposit below the limit will be lost.</span>
                          <span>Carefully check the address. The transaction will be lost if the address is incorrect.</span>
                        </div>
                        <h6 className="font16  font-semibold">
                          How it works
                        </h6>
                        <div className="imp-how-para">
                          <span>Copy the address, then go to your crypto waller application, paste the address, specify the deposit amount, and complete the transfer</span>
                          <span>Carefully check the address. The transaction will be lost if the address is incorrect.</span>
                        </div>
                        <Row>
                          <Col>
                            <div className="form-check-inline mt-20 w-100">
                              <div className="inner-input-box withdraw-amt-box">
                                <label>Amount <span className="billing-max-amt"> *Maximum amount: 5000</span></label>
                                <Input
                                  className="chose-payment"
                                  value={WithdrawForm.values.customAmount || ""}
                                  placeholder="5000"
                                  max="5000"
                                  min="1"
                                  onChange={e => {
                                    WithdrawForm.handleChange(e)
                                    setcustompay(e.target.value)
                                  }}
                                  onBlur={(e) => { 
                                    WithdrawForm.handleBlur, 
                                    custompay > 5000 ? WithdrawForm.values.customAmount = 5000 :custompay < 50? WithdrawForm.values.customAmount = 50 : null 
                                  }}
                                  invalid={
                                    WithdrawForm.touched.customAmount &&
                                      WithdrawForm.errors.customAmount
                                      ? true
                                      : false
                                  }
                                  type="number"
                                  name="customAmount"

                                  // disabled={spinner}
                                />
                              
                              {WithdrawForm.touched.customAmount &&
                                WithdrawForm.errors.customAmount ? (
                                <>
                                  <FormFeedback type="invalid">
                                    <img
                                      className="form-error-icon"
                                      src={rederror}
                                      alt=""
                                      height={15}
                                    />
                                    {WithdrawForm.errors.customAmount}
                                  </FormFeedback>
                                </>
                              ) : null}
                              </div>
                            </div>
                            

                          </Col>
                        </Row>
                      </div>
                    </div>
                  </CardBody>
                </Card>
                <div className="btn-group mt-30">
                  <button
                    className="btn btn-primary w-100 waves-effect waves-light btn-save font-normal btnv1"
                    type="submit"
                    disabled={openModal}
                  >
                    {openModal ? <div className="ui active inline loader"></div> : "Withdraw Funds"}
                  </button>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
      <TextLoader loading={loader || openModal} loader={loader} />
      <PaymentModal openModal={openModal} message={"Payment"} />
    </React.Fragment>
  )
}

export default withRouter(WihtdrawFunds)
