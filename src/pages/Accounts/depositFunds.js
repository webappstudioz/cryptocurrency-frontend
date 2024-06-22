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
import EthereumLogo from "../../assets/images/c2c/ethereum.png"
import BitcoinLogo from "../../assets/images/c2c/bitcoinlogo.png"
import TetherLogo from "../../assets/images/c2c/tetherlogo.png"
import file from "../../assets/images/file.png";

const DepositFunds = props => {
  const [loader, setLoader] = useState(false)
  const [custompay, setcustompay] = useState()
  const [selectedMethod, setSelectedMethod] = useState("bankTransfer")
  const [spinner, setSpinner] = useState(false)
  const [loading, setLoading] = useState("")
  const [openModal, setOpenModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState([]);
  const [inputKey, setInputKey] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setPageTitle("Deposite Funds")
  }, [])

  const DepositForm = useFormik({
    enableReinitialize: true,

    initialValues: {
      customAmount: "",
      paymentId: "",
    },
    validationSchema: Yup.object({
      customAmount: Yup.string()
        .required("Please enter amount.")
        .matches(customRegex?.amount, "Please valid amount"),
      paymentId: Yup.string()
        .required("Please enter payment id"),
    }),

    onSubmit: values => {
      console.log("values", values)
      // return
      // let amount = ""
      // values?.customAmount ? amount = values?.customAmount : amount = selectedAmount
      // if (selectedMethod == "stripe" && amount) {
      //   if (values?.customAmount) {
      //     setstripecondition(true)
      //     setSpinner(true)
      //     setLoading(true)
      //     setOpenModal(true)
      //   } else if (selectedAmount != "custom") {
      //     setstripecondition(true)
      //     setSpinner(true)
      //     setLoading(true)
      //     setOpenModal(true)
      //   }
      // } else {
      //   if (values?.customAmount) {
      //     HandleAddWalletAmount(values?.customAmount)
      //   } else if (selectedAmount != "custom") {
      //     HandleAddWalletAmount(selectedAmount)
      //   }
      // }

      // if (!values?.customAmount && selectedAmount === "custom") {
      //   toast.error("Please select or enter an amount to wallet", {
      //     position: toast.POSITION.TOP_RIGHT,
      //   })
      // }
    },
  })

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024; // in MB
      const fileType = file.type.split("/")[1]; // get file extension

      // Validate file size (10MB max)
      if (fileSize > 20) {
        setErrorMsg("File size should be less than 20 MB");
      } else {
        // Validate file extension
        if (
          fileType === "jpg" ||
          fileType === "jpeg" ||
          fileType === "png" ||
          fileType === "pdf" ||
          fileType === "doc" ||
          fileType === "xls" ||
          fileType === "zip"
        ) {
          setSelectedFile([...selectedFile, file]);
          // setSelectedFile(file)
          setErrorMsg("");
        } else {
          setErrorMsg(
            "Only JPG, PNG, PDF, DOC, XLS, and ZIP files are allowed"
          );
        }
      }
    }
  };

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
                  DepositForm.handleSubmit()
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
                                id="bankTransfer"
                                name="paymentMethod"
                                className="form-check-input"
                                value={"bankTransfer"}
                                checked={selectedMethod === "bankTransfer"}
                                onChange={() => { }}
                                onClick={() => {
                                  setSelectedMethod("bankTransfer")
                                }}
                              // disabled={spinner}
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="bankTransfer"
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
                          <Col>
                            <div className="form-check form-check-inline mt-20">
                              <Input
                                type="radio"
                                id="bitcoin"
                                name="paymentMethod"
                                className="form-check-input"
                                value={"bitcoin"}
                                checked={selectedMethod === "bitcoin"}
                                onChange={() => { }}
                                onClick={() => {
                                  setSelectedMethod("bitcoin")
                                }}
                              // disabled={spinner}
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="bitcoin"
                              >
                                <img src={BitcoinLogo} />
                                <p className="font-normal">Bitcoin</p>
                              </Label>
                            </div>
                          </Col>
                          <Col>
                            <div className="form-check form-check-inline mt-20">
                              <Input
                                type="radio"
                                id="ethereum"
                                name="paymentMethod"
                                className="form-check-input"
                                value={"ethereum"}
                                checked={selectedMethod === "ethereum"}
                                onChange={() => { }}
                                onClick={() => {
                                  setSelectedMethod("ethereum")
                                }}
                              // disabled={spinner}
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="ethereum"
                              >
                                <img src={EthereumLogo} />
                                <p className="font-normal">Ethereum</p>
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
                    // height: selectedMethod === "stripe" ? selectedCard === "add_new"? "auto" : "450px" : "0px",
                    height: selectedMethod !== "bankTransfer" ? "auto" : "0px",
                    // height: "auto",
                    // height: stripeCardHeight,
                    overflow: "hidden",
                    maxHeight: "450px",
                    transition: "height 0.6s ease 0s",
                    opacity: selectedMethod !== "bankTransfer" ? 1 : 0,
                  }}
                >
                  {/* <Card className="m-10 stripe-form">
                    <CardBody
                      className="credit-card-scroll"
                      style={{
                        backgroundColor: "#fafafb",
                        margin: "20px auto",
                        overflowY: "auto",
                        borderRadius: "12px",
                        maxHeight: "400px",
                      }}
                    >
                      <h3 style={{ textTransform: "capitalize" }} >{selectedMethod}</h3>
                     
                    </CardBody>
                  </Card> */}
                  <div>
                    <div className="row">
                      <div className="col-md-12">
                        <h5 className="info_heding" style={{ textTransform: "capitalize" }}>{selectedMethod}</h5>
                        <div className="tab_content tab-data-table">
                          <div className="row">
                            <div className="col-md-6">
                              <table className="w-100">
                                <tbody>
                                  <img src={LogoGreen} style={{ height: "100%", width: "100%" }} />
                                </tbody>
                              </table>
                            </div>
                            <div className="col-md-6">
                              <table className="w-100">
                                <tbody>
                                  <tr>
                                    <th>Bank Name</th>
                                    <React.Fragment>
                                      <td className="text-right">
                                        {/* {userInfo?.bank_name} */}
                                      </td>
                                    </React.Fragment>
                                    <><td></td><td></td><td></td></>
                                  </tr>
                                  <tr></tr>
                                  <tr>
                                    <th>Account Number</th>
                                    <React.Fragment>
                                      <td className="text-right">
                                        {/* {userInfo?.account_number} */}
                                      </td>
                                    </React.Fragment>
                                    <><td></td><td></td><td></td></>
                                  </tr>
                                  <tr></tr>
                                  <tr>
                                    <th>{"Account Holder's Name"}</th>
                                    <React.Fragment>
                                      <td className="text-right">
                                        {/* {FormatDate(userInfo?.account_holder_name)} */}
                                      </td>
                                    </React.Fragment>
                                    <><td></td><td></td><td></td></>
                                  </tr>
                                  <tr></tr>
                                  <tr>
                                    <th>IFSC Code</th>
                                    <React.Fragment>
                                      <td className="text-right">
                                        {/* {userInfo?.ifsc_code} */}
                                      </td>
                                    </React.Fragment>
                                    <><td></td><td></td><td></td></>
                                  </tr>
                                  <tr></tr>
                                  <tr>
                                    <th>UPI ID</th>
                                    <React.Fragment>
                                      <td className="text-right">
                                        {/* {userInfo?.upi_id} */}
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
                    // height: selectedMethod === "stripe" ? selectedCard === "add_new"? "auto" : "450px" : "0px",
                    height: selectedMethod === "bankTransfer" ? "auto" : "0px",
                    // height: "auto",
                    // height: stripeCardHeight,
                    overflow: "hidden",
                    maxHeight: "450px",
                    transition: "height 0.6s ease 0s",
                    opacity: selectedMethod === "bankTransfer" ? 1 : 0,
                  }}
                >
                  {/* <Card className="m-10 stripe-form">
                    <CardBody
                      className="credit-card-scroll"
                      style={{
                        backgroundColor: "#fafafb",
                        margin: "20px auto",
                        overflowY: "auto",
                        borderRadius: "12px",
                        maxHeight: "400px",
                      }}
                    >
                      <h3 style={{textTransform: "capitalize"}} >{selectedMethod}</h3>
                      
                    </CardBody>
                  </Card> */}
                  <div>
                    <div className="row">
                      <div className="col-md-12">
                        <h5 className="info_heding">Bank Details</h5>
                        <div className="tab_content tab-data-table">
                          <div className="row">
                            <div className="col-md-6">
                              <table className="w-100">
                                <tbody>
                                  <img src={LogoGreen} style={{ height: "100%", width: "100%" }} />
                                </tbody>
                              </table>
                            </div>
                            <div className="col-md-6">
                              <table className="w-100">
                                <tbody>
                                  <tr>
                                    <th>Bank Name</th>
                                    <React.Fragment>
                                      <td className="text-right">
                                        {/* {userInfo?.bank_name} */}
                                      </td>
                                    </React.Fragment>
                                    <><td></td><td></td><td></td></>
                                  </tr>
                                  <tr></tr>
                                  <tr>
                                    <th>Account Number</th>
                                    <React.Fragment>
                                      <td className="text-right">
                                        {/* {userInfo?.account_number} */}
                                      </td>
                                    </React.Fragment>
                                    <><td></td><td></td><td></td></>
                                  </tr>
                                  <tr></tr>
                                  <tr>
                                    <th>{"Account Holder's Name"}</th>
                                    <React.Fragment>
                                      <td className="text-right">
                                        {/* {FormatDate(userInfo?.account_holder_name)} */}
                                      </td>
                                    </React.Fragment>
                                    <><td></td><td></td><td></td></>
                                  </tr>
                                  <tr></tr>
                                  <tr>
                                    <th>IFSC Code</th>
                                    <React.Fragment>
                                      <td className="text-right">
                                        {/* {userInfo?.ifsc_code} */}
                                      </td>
                                    </React.Fragment>
                                    <><td></td><td></td><td></td></>
                                  </tr>
                                  <tr></tr>
                                  <tr>
                                    <th>UPI ID</th>
                                    <React.Fragment>
                                      <td className="text-right">
                                        {/* {userInfo?.upi_id} */}
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

                <Card className="m-0  ">
                  <CardBody>
                    <div className="inner-content invite-user rd-group">
                      <div className="radio-btn amount">
                        <h6 className="font16  font-semibold">
                          Important to know
                        </h6>
                        <div>
                          <span>The minimum deposit amount is 50t. All deposit below the limit will be lost.</span>
                        </div>
                        <div>
                          <span>Carefully check the address. The transaction will be lost if the address is incorrect.</span>
                        </div>
                        <h6 className="font16  font-semibold">
                          How it works
                        </h6>
                        <div>
                          <span>Copy the address, then go to your crypto waller application, paste the address, specify the deposit amount, and complete the transfer</span>
                        </div>
                        <div>
                          <span>Carefully check the address. The transaction will be lost if the address is incorrect.</span>
                        </div>
                        <Row>
                          <Col>
                            <div className="test form-check form-check-inline mt-20 ">
                              {/* <span className="prefix">{currency?.prefix}$</span> */}
                              <div className="inner-input-box">
                                <Input
                                  className="chose-payment"
                                  value={DepositForm.values.customAmount || ""}
                                  placeholder="5000"
                                  max="5000"
                                  min="1"
                                  onChange={e => {
                                    DepositForm.handleChange(e)
                                    setcustompay(e.target.value)
                                  }}
                                  onBlur={(e) => { DepositForm.handleBlur, custompay > 5000 ? DepositForm.values.customAmount = 5000 : "" }}
                                  invalid={
                                    DepositForm.touched.customAmount &&
                                      DepositForm.errors.customAmount
                                      ? true
                                      : false
                                  }
                                  type="number"
                                  name="customAmount"

                                  disabled={spinner}
                                />
                              
                              {DepositForm.touched.customAmount &&
                                DepositForm.errors.customAmount ? (
                                <>
                                  <FormFeedback type="invalid">
                                    <img
                                      className="form-error-icon"
                                      src={rederror}
                                      alt=""
                                      height={15}
                                    />
                                    {DepositForm.errors.customAmount}
                                  </FormFeedback>
                                </>
                              ) : null}
                              </div>
                            </div>
                            <span className="billing-max-amt">*Maximum amount: 5000</span>

                          </Col>
                        </Row>
                      </div>
                    </div>
                  </CardBody>
                </Card>
                <Card className="m-0">
                  <CardBody>
                    <Row>
                      <Col>
                        <div className="inner-content invite-user rd-group">
                          <h6 className="font16  font-semibold">
                            Complete Your Payment
                          </h6>
                          <div className="col-lg-6 form-group mb-4">
                            <p className="place-holder">Upload Screen Short</p>
                            <label
                              htmlFor="file-upload"
                              className="custom-file-upload form-control"
                            >
                              <img src={file} alt="Upload file icon" />
                              <input
                                disabled={spinner}
                                key={inputKey}
                                id="file-upload"
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf,.doc,.xls,.zip"
                                onChange={handleFileChange}
                                onClick={(event) => {
                                  if (
                                    event.target.files.length === 1 &&
                                    event.target.files[0].name ===
                                    selectedFile[selectedFile.length - 1]
                                      ?.name
                                  ) {
                                    event.target.value = null;
                                  }
                                }}
                                multiple
                              />
                            </label>
                          </div>
                          <div className="col-lg-6 form-group">
                            <p className="place-holder">Payment id</p>
                            <Input
                              type="text"
                              placeholder="Enter payment id"
                              className="form-control"
                              id="paymentId"
                              name="paymentId"
                              value={DepositForm?.values?.paymentId || ""}
                              onChange={DepositForm.handleChange}
                              onBlur={DepositForm.handleBlur}
                              invalid={
                                DepositForm.touched.paymentId &&
                                  DepositForm.errors.paymentId
                                  ? true
                                  : false
                              }
                            />
                            {DepositForm.touched.paymentId &&
                              DepositForm.errors.paymentId ? (
                              <>
                                <FormFeedback type="invalid">
                                  <img
                                    className="form-error-icon"
                                    src={rederror}
                                    alt=""
                                    height={15}
                                  />
                                  {DepositForm.errors.paymentId}
                                </FormFeedback>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <div className="btn-group mt-30">
                  <button
                    className="btn btn-primary w-100 waves-effect waves-light btn-save font-normal btnv1"
                    type="submit"
                    disabled={spinner}
                  >
                    {spinner ? <div className="ui active inline loader"></div> : "Deposit Funds"}
                  </button>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
      <TextLoader loading={loading} loader={loader} />
      <PaymentModal openModal={openModal} message={"Payment"} />
    </React.Fragment>
  )
}

export default withRouter(DepositFunds)
