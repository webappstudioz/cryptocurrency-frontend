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
import copy from "copy-to-clipboard"

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

    onSubmit: async (values) => {
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
                                      <td></td>
                                      <td></td>
                                      <td>
                                        <svg
                                          onClick={() => {
                                            copy(userInfo?.crypto_id);
                                            toast("Crypto id has been copied", {
                                              autoClose: 1000,
                                            });
                                          }}
                                          className="pw-icon-pass"
                                          width="13"
                                          height="17"
                                          viewBox="0 0 15 17"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M2.02526 16.4685C1.8004 16.4153 1.58059 16.3427 1.36827 16.2515C1.07612 16.1087 0.830075 15.8867 0.65819 15.6106C0.486306 15.3346 0.395472 15.0156 0.396227 14.6905C0.379227 14.1735 0.396227 13.6564 0.396227 13.1394C0.396227 10.6354 0.396227 8.13178 0.396227 5.62845C0.405174 5.19207 0.572476 4.77374 0.866808 4.45144C1.16114 4.12915 1.56255 3.9249 1.99633 3.87649C2.45233 3.84249 2.91227 3.87039 3.38927 3.87039V4.00247C3.38927 6.21447 3.37827 8.42646 3.39427 10.6385C3.37907 11.1864 3.52846 11.7263 3.82311 12.1885C4.11775 12.6507 4.54409 13.014 5.04723 13.2315C5.42622 13.4071 5.84075 13.4926 6.25829 13.4815H12.3423C12.3423 13.8745 12.3483 14.2545 12.3423 14.6345C12.3431 14.7976 12.3219 14.96 12.2793 15.1175C12.1904 15.4667 11.9978 15.781 11.7268 16.0186C11.4558 16.2562 11.1191 16.4061 10.7612 16.4485C10.7428 16.453 10.725 16.4597 10.7082 16.4685H2.02526Z"
                                            fill="#9F9EB2"
                                          />
                                          <path
                                            d="M4.37758 6.50446C4.37758 5.13246 4.37758 3.76019 4.37758 2.38752C4.37009 2.09061 4.43648 1.79651 4.57069 1.53156C4.70491 1.26662 4.9028 1.03905 5.14662 0.869455C5.43858 0.650757 5.79381 0.533193 6.15858 0.534494C8.51192 0.530494 10.8646 0.530494 13.2166 0.534494C13.6825 0.543533 14.1271 0.731573 14.4583 1.0594C14.7894 1.38722 14.9818 1.8297 14.9956 2.29548C15.0056 3.36048 14.9956 4.42568 14.9956 5.49568C14.9956 7.20634 14.9956 8.91685 14.9956 10.6275C15.0066 11.0475 14.8709 11.4583 14.612 11.7891C14.353 12.12 13.9869 12.3502 13.5766 12.4405C13.4481 12.4706 13.3165 12.4854 13.1846 12.4844C10.8513 12.4844 8.51792 12.4844 6.18459 12.4844C5.70827 12.4847 5.25107 12.297 4.91249 11.962C4.57391 11.627 4.38135 11.1719 4.3766 10.6956C4.3686 9.29563 4.3766 7.90461 4.3766 6.50862L4.37758 6.50446Z"
                                            fill="#9F9EB2"
                                          />
                                        </svg>
                                      </td>
                                    </React.Fragment>
                                    {/* <><td></td><td></td><td></td></> */}
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
                                      <td></td>
                                      <td></td>
                                      <td>
                                        <svg
                                          onClick={() => {
                                            copy(userInfo?.bank_name);
                                            toast("Bank name has been copied", {
                                              autoClose: 1000,
                                            });
                                          }}
                                          className="pw-icon-pass"
                                          width="13"
                                          height="17"
                                          viewBox="0 0 15 17"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M2.02526 16.4685C1.8004 16.4153 1.58059 16.3427 1.36827 16.2515C1.07612 16.1087 0.830075 15.8867 0.65819 15.6106C0.486306 15.3346 0.395472 15.0156 0.396227 14.6905C0.379227 14.1735 0.396227 13.6564 0.396227 13.1394C0.396227 10.6354 0.396227 8.13178 0.396227 5.62845C0.405174 5.19207 0.572476 4.77374 0.866808 4.45144C1.16114 4.12915 1.56255 3.9249 1.99633 3.87649C2.45233 3.84249 2.91227 3.87039 3.38927 3.87039V4.00247C3.38927 6.21447 3.37827 8.42646 3.39427 10.6385C3.37907 11.1864 3.52846 11.7263 3.82311 12.1885C4.11775 12.6507 4.54409 13.014 5.04723 13.2315C5.42622 13.4071 5.84075 13.4926 6.25829 13.4815H12.3423C12.3423 13.8745 12.3483 14.2545 12.3423 14.6345C12.3431 14.7976 12.3219 14.96 12.2793 15.1175C12.1904 15.4667 11.9978 15.781 11.7268 16.0186C11.4558 16.2562 11.1191 16.4061 10.7612 16.4485C10.7428 16.453 10.725 16.4597 10.7082 16.4685H2.02526Z"
                                            fill="#9F9EB2"
                                          />
                                          <path
                                            d="M4.37758 6.50446C4.37758 5.13246 4.37758 3.76019 4.37758 2.38752C4.37009 2.09061 4.43648 1.79651 4.57069 1.53156C4.70491 1.26662 4.9028 1.03905 5.14662 0.869455C5.43858 0.650757 5.79381 0.533193 6.15858 0.534494C8.51192 0.530494 10.8646 0.530494 13.2166 0.534494C13.6825 0.543533 14.1271 0.731573 14.4583 1.0594C14.7894 1.38722 14.9818 1.8297 14.9956 2.29548C15.0056 3.36048 14.9956 4.42568 14.9956 5.49568C14.9956 7.20634 14.9956 8.91685 14.9956 10.6275C15.0066 11.0475 14.8709 11.4583 14.612 11.7891C14.353 12.12 13.9869 12.3502 13.5766 12.4405C13.4481 12.4706 13.3165 12.4854 13.1846 12.4844C10.8513 12.4844 8.51792 12.4844 6.18459 12.4844C5.70827 12.4847 5.25107 12.297 4.91249 11.962C4.57391 11.627 4.38135 11.1719 4.3766 10.6956C4.3686 9.29563 4.3766 7.90461 4.3766 6.50862L4.37758 6.50446Z"
                                            fill="#9F9EB2"
                                          />
                                        </svg>
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
                                      <td></td>
                                      <td></td>
                                      <td>
                                        <svg
                                          onClick={() => {
                                            copy(userInfo?.account_number);
                                            toast("Account number has been copied", {
                                              autoClose: 1000,
                                            });
                                          }}
                                          className="pw-icon-pass"
                                          width="13"
                                          height="17"
                                          viewBox="0 0 15 17"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M2.02526 16.4685C1.8004 16.4153 1.58059 16.3427 1.36827 16.2515C1.07612 16.1087 0.830075 15.8867 0.65819 15.6106C0.486306 15.3346 0.395472 15.0156 0.396227 14.6905C0.379227 14.1735 0.396227 13.6564 0.396227 13.1394C0.396227 10.6354 0.396227 8.13178 0.396227 5.62845C0.405174 5.19207 0.572476 4.77374 0.866808 4.45144C1.16114 4.12915 1.56255 3.9249 1.99633 3.87649C2.45233 3.84249 2.91227 3.87039 3.38927 3.87039V4.00247C3.38927 6.21447 3.37827 8.42646 3.39427 10.6385C3.37907 11.1864 3.52846 11.7263 3.82311 12.1885C4.11775 12.6507 4.54409 13.014 5.04723 13.2315C5.42622 13.4071 5.84075 13.4926 6.25829 13.4815H12.3423C12.3423 13.8745 12.3483 14.2545 12.3423 14.6345C12.3431 14.7976 12.3219 14.96 12.2793 15.1175C12.1904 15.4667 11.9978 15.781 11.7268 16.0186C11.4558 16.2562 11.1191 16.4061 10.7612 16.4485C10.7428 16.453 10.725 16.4597 10.7082 16.4685H2.02526Z"
                                            fill="#9F9EB2"
                                          />
                                          <path
                                            d="M4.37758 6.50446C4.37758 5.13246 4.37758 3.76019 4.37758 2.38752C4.37009 2.09061 4.43648 1.79651 4.57069 1.53156C4.70491 1.26662 4.9028 1.03905 5.14662 0.869455C5.43858 0.650757 5.79381 0.533193 6.15858 0.534494C8.51192 0.530494 10.8646 0.530494 13.2166 0.534494C13.6825 0.543533 14.1271 0.731573 14.4583 1.0594C14.7894 1.38722 14.9818 1.8297 14.9956 2.29548C15.0056 3.36048 14.9956 4.42568 14.9956 5.49568C14.9956 7.20634 14.9956 8.91685 14.9956 10.6275C15.0066 11.0475 14.8709 11.4583 14.612 11.7891C14.353 12.12 13.9869 12.3502 13.5766 12.4405C13.4481 12.4706 13.3165 12.4854 13.1846 12.4844C10.8513 12.4844 8.51792 12.4844 6.18459 12.4844C5.70827 12.4847 5.25107 12.297 4.91249 11.962C4.57391 11.627 4.38135 11.1719 4.3766 10.6956C4.3686 9.29563 4.3766 7.90461 4.3766 6.50862L4.37758 6.50446Z"
                                            fill="#9F9EB2"
                                          />
                                        </svg>
                                      </td>
                                    </React.Fragment>
                                    {/* <><td></td><td></td><td></td></> */}
                                  </tr>
                                  <tr></tr>
                                  <tr>
                                    <th>{"Account Holder's Name"}</th>
                                    <React.Fragment>
                                      <td className="text-right firstLettercapital">
                                        {userInfo?.account_holder_name}
                                      </td>
                                      <td></td>
                                      <td></td>
                                      <td>
                                        <svg
                                          onClick={() => {
                                            copy(userInfo?.account_holder_name);
                                            toast("Account holder's name has been copied", {
                                              autoClose: 1000,
                                            });
                                          }}
                                          className="pw-icon-pass"
                                          width="13"
                                          height="17"
                                          viewBox="0 0 15 17"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M2.02526 16.4685C1.8004 16.4153 1.58059 16.3427 1.36827 16.2515C1.07612 16.1087 0.830075 15.8867 0.65819 15.6106C0.486306 15.3346 0.395472 15.0156 0.396227 14.6905C0.379227 14.1735 0.396227 13.6564 0.396227 13.1394C0.396227 10.6354 0.396227 8.13178 0.396227 5.62845C0.405174 5.19207 0.572476 4.77374 0.866808 4.45144C1.16114 4.12915 1.56255 3.9249 1.99633 3.87649C2.45233 3.84249 2.91227 3.87039 3.38927 3.87039V4.00247C3.38927 6.21447 3.37827 8.42646 3.39427 10.6385C3.37907 11.1864 3.52846 11.7263 3.82311 12.1885C4.11775 12.6507 4.54409 13.014 5.04723 13.2315C5.42622 13.4071 5.84075 13.4926 6.25829 13.4815H12.3423C12.3423 13.8745 12.3483 14.2545 12.3423 14.6345C12.3431 14.7976 12.3219 14.96 12.2793 15.1175C12.1904 15.4667 11.9978 15.781 11.7268 16.0186C11.4558 16.2562 11.1191 16.4061 10.7612 16.4485C10.7428 16.453 10.725 16.4597 10.7082 16.4685H2.02526Z"
                                            fill="#9F9EB2"
                                          />
                                          <path
                                            d="M4.37758 6.50446C4.37758 5.13246 4.37758 3.76019 4.37758 2.38752C4.37009 2.09061 4.43648 1.79651 4.57069 1.53156C4.70491 1.26662 4.9028 1.03905 5.14662 0.869455C5.43858 0.650757 5.79381 0.533193 6.15858 0.534494C8.51192 0.530494 10.8646 0.530494 13.2166 0.534494C13.6825 0.543533 14.1271 0.731573 14.4583 1.0594C14.7894 1.38722 14.9818 1.8297 14.9956 2.29548C15.0056 3.36048 14.9956 4.42568 14.9956 5.49568C14.9956 7.20634 14.9956 8.91685 14.9956 10.6275C15.0066 11.0475 14.8709 11.4583 14.612 11.7891C14.353 12.12 13.9869 12.3502 13.5766 12.4405C13.4481 12.4706 13.3165 12.4854 13.1846 12.4844C10.8513 12.4844 8.51792 12.4844 6.18459 12.4844C5.70827 12.4847 5.25107 12.297 4.91249 11.962C4.57391 11.627 4.38135 11.1719 4.3766 10.6956C4.3686 9.29563 4.3766 7.90461 4.3766 6.50862L4.37758 6.50446Z"
                                            fill="#9F9EB2"
                                          />
                                        </svg>
                                      </td>
                                    </React.Fragment>
                                    {/* <><td></td><td></td><td></td></> */}
                                  </tr>
                                  <tr></tr>
                                  <tr>
                                    <th>IFSC Code</th>
                                    <React.Fragment>
                                      <td className="text-right">
                                        {userInfo?.ifsc_code}
                                      </td>
                                      <td></td>
                                      <td></td>
                                      <td>
                                        <svg
                                          onClick={() => {
                                            copy(userInfo?.ifsc_code);
                                            toast("IFSC code has been copied", {
                                              autoClose: 1000,
                                            });
                                          }}
                                          className="pw-icon-pass"
                                          width="13"
                                          height="17"
                                          viewBox="0 0 15 17"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M2.02526 16.4685C1.8004 16.4153 1.58059 16.3427 1.36827 16.2515C1.07612 16.1087 0.830075 15.8867 0.65819 15.6106C0.486306 15.3346 0.395472 15.0156 0.396227 14.6905C0.379227 14.1735 0.396227 13.6564 0.396227 13.1394C0.396227 10.6354 0.396227 8.13178 0.396227 5.62845C0.405174 5.19207 0.572476 4.77374 0.866808 4.45144C1.16114 4.12915 1.56255 3.9249 1.99633 3.87649C2.45233 3.84249 2.91227 3.87039 3.38927 3.87039V4.00247C3.38927 6.21447 3.37827 8.42646 3.39427 10.6385C3.37907 11.1864 3.52846 11.7263 3.82311 12.1885C4.11775 12.6507 4.54409 13.014 5.04723 13.2315C5.42622 13.4071 5.84075 13.4926 6.25829 13.4815H12.3423C12.3423 13.8745 12.3483 14.2545 12.3423 14.6345C12.3431 14.7976 12.3219 14.96 12.2793 15.1175C12.1904 15.4667 11.9978 15.781 11.7268 16.0186C11.4558 16.2562 11.1191 16.4061 10.7612 16.4485C10.7428 16.453 10.725 16.4597 10.7082 16.4685H2.02526Z"
                                            fill="#9F9EB2"
                                          />
                                          <path
                                            d="M4.37758 6.50446C4.37758 5.13246 4.37758 3.76019 4.37758 2.38752C4.37009 2.09061 4.43648 1.79651 4.57069 1.53156C4.70491 1.26662 4.9028 1.03905 5.14662 0.869455C5.43858 0.650757 5.79381 0.533193 6.15858 0.534494C8.51192 0.530494 10.8646 0.530494 13.2166 0.534494C13.6825 0.543533 14.1271 0.731573 14.4583 1.0594C14.7894 1.38722 14.9818 1.8297 14.9956 2.29548C15.0056 3.36048 14.9956 4.42568 14.9956 5.49568C14.9956 7.20634 14.9956 8.91685 14.9956 10.6275C15.0066 11.0475 14.8709 11.4583 14.612 11.7891C14.353 12.12 13.9869 12.3502 13.5766 12.4405C13.4481 12.4706 13.3165 12.4854 13.1846 12.4844C10.8513 12.4844 8.51792 12.4844 6.18459 12.4844C5.70827 12.4847 5.25107 12.297 4.91249 11.962C4.57391 11.627 4.38135 11.1719 4.3766 10.6956C4.3686 9.29563 4.3766 7.90461 4.3766 6.50862L4.37758 6.50446Z"
                                            fill="#9F9EB2"
                                          />
                                        </svg>
                                      </td>
                                    </React.Fragment>
                                    {/* <><td></td><td></td><td></td></> */}
                                  </tr>
                                  <tr></tr>
                                  <tr>
                                    <th>UPI ID</th>
                                    <React.Fragment>
                                      <td className="text-right">
                                        {userInfo?.upi_id}
                                      </td>
                                      <td></td>
                                      <td></td>
                                      <td>
                                        <svg
                                          onClick={() => {
                                            copy(userInfo?.upi_id);
                                            toast("UPI id has been copied", {
                                              autoClose: 1000,
                                            });
                                          }}
                                          className="pw-icon-pass"
                                          width="13"
                                          height="17"
                                          viewBox="0 0 15 17"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M2.02526 16.4685C1.8004 16.4153 1.58059 16.3427 1.36827 16.2515C1.07612 16.1087 0.830075 15.8867 0.65819 15.6106C0.486306 15.3346 0.395472 15.0156 0.396227 14.6905C0.379227 14.1735 0.396227 13.6564 0.396227 13.1394C0.396227 10.6354 0.396227 8.13178 0.396227 5.62845C0.405174 5.19207 0.572476 4.77374 0.866808 4.45144C1.16114 4.12915 1.56255 3.9249 1.99633 3.87649C2.45233 3.84249 2.91227 3.87039 3.38927 3.87039V4.00247C3.38927 6.21447 3.37827 8.42646 3.39427 10.6385C3.37907 11.1864 3.52846 11.7263 3.82311 12.1885C4.11775 12.6507 4.54409 13.014 5.04723 13.2315C5.42622 13.4071 5.84075 13.4926 6.25829 13.4815H12.3423C12.3423 13.8745 12.3483 14.2545 12.3423 14.6345C12.3431 14.7976 12.3219 14.96 12.2793 15.1175C12.1904 15.4667 11.9978 15.781 11.7268 16.0186C11.4558 16.2562 11.1191 16.4061 10.7612 16.4485C10.7428 16.453 10.725 16.4597 10.7082 16.4685H2.02526Z"
                                            fill="#9F9EB2"
                                          />
                                          <path
                                            d="M4.37758 6.50446C4.37758 5.13246 4.37758 3.76019 4.37758 2.38752C4.37009 2.09061 4.43648 1.79651 4.57069 1.53156C4.70491 1.26662 4.9028 1.03905 5.14662 0.869455C5.43858 0.650757 5.79381 0.533193 6.15858 0.534494C8.51192 0.530494 10.8646 0.530494 13.2166 0.534494C13.6825 0.543533 14.1271 0.731573 14.4583 1.0594C14.7894 1.38722 14.9818 1.8297 14.9956 2.29548C15.0056 3.36048 14.9956 4.42568 14.9956 5.49568C14.9956 7.20634 14.9956 8.91685 14.9956 10.6275C15.0066 11.0475 14.8709 11.4583 14.612 11.7891C14.353 12.12 13.9869 12.3502 13.5766 12.4405C13.4481 12.4706 13.3165 12.4854 13.1846 12.4844C10.8513 12.4844 8.51792 12.4844 6.18459 12.4844C5.70827 12.4847 5.25107 12.297 4.91249 11.962C4.57391 11.627 4.38135 11.1719 4.3766 10.6956C4.3686 9.29563 4.3766 7.90461 4.3766 6.50862L4.37758 6.50446Z"
                                            fill="#9F9EB2"
                                          />
                                        </svg>
                                      </td>
                                    </React.Fragment>
                                    {/* <><td></td><td></td><td></td></> */}
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
                                      custompay > 5000 ? WithdrawForm.values.customAmount = 5000 : custompay < 50 ? WithdrawForm.values.customAmount = 50 : null
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
