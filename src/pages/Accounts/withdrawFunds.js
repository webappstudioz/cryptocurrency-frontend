import React, { useState, useEffect, useRef } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Input,
  Form,
} from "reactstrap"

// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"
import { withRouter } from "react-router-dom"

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb"
import paypal from "../../assets/images/paypal.svg"
import razor from "../../assets/images/razor.svg"
// import stripe from "../../assets/images/stripe.svg"
import cardLogo from "../../assets/images/ccard-logos-set.png"
import usd from "../../assets/images/usd.svg"
import wise from "../../assets/images/wise.svg"
import { setPageTitle } from "../../helpers/api_helper_rs"
import {
  getPaymentMethodList,
  loginData,
  addWalletAmount,
  sendInvoiceMail,
} from "../Authentication/store/apiServices"
// import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
import { customRegex } from "../../helpers/validation_helpers"
import { toast } from "react-toastify"
import { SETTINGS } from "../../constants/api/api_path"
// import { Elements } from "@stripe/react-stripe-js"
// import { loadStripe } from "@stripe/stripe-js/pure"
// import CheckoutForm from "../Stripe/CheckoutForm"
import { useHistory } from "react-router-dom"
// import { sendStripeDetailsBack, getSavedCards } from "../Service/store/apiService"
import TextLoader from "../../components/textLoader"
import RazorPayForm from "../Razorpay/RazorpayForm"
import useRazorpay from "react-razorpay"
// import { selectCardLogo } from "../../helpers/api_helper_rs"
// import CreditCardLogo from "../../assets/images/credit-card-logo.jpg";
import CreditCard from "../Stripe/CreditCard"
import { getStoredCards } from "../../helpers/api_helper_rs"
import PaymentModal from "../../components/Common/PaymentModal"
import { useSelector } from "react-redux"
import BankLogo from "../../assets/images/c2c/banklogo.png"
import EthereumLogo from "../../assets/images/c2c/ethereum.png"
import BitcoinLogo from "../../assets/images/c2c/bitcoinlogo.png"
import TetherLogo from "../../assets/images/c2c/tetherlogo.png"
const WithdrawFunds = props => {
    const [loader, setLoader] = useState(false)
    const [stripeCardHeight, setStripeCardHeight] = useState(0)
    const [selectedMethod, setSelectedMethod] = useState()
    const [selectedAmount, setSelectedAmount] = useState(100)
    const [spinner, setSpinner] = useState(false)
    const [currency, setCurrency] = useState()
    const [paypalBasicFormData, setPaypalBasicFormData] = useState()
    const [loading, setLoading] = useState("")
    const [openModal, setOpenModal] = useState(false)

    const validation = useFormik({
        //   // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,
    
        initialValues: {
          customAmount: "",
        },
        validationSchema: Yup.object({
          customAmount: Yup.string()
          .matches(customRegex?.amount, "Please valid amount"),
        }),
    
        onSubmit: values => {
          return
          let amount = ""
          values?.customAmount? amount = values?.customAmount : amount = selectedAmount
          if (selectedMethod == "stripe" && amount) {
            if (values?.customAmount) {
              setstripecondition(true)
              setSpinner(true)
              setLoading(true)
              setOpenModal(true)
            } else if (selectedAmount != "custom") {
              setstripecondition(true)
              setSpinner(true)
              setLoading(true)
              setOpenModal(true)
            }
          } else {
            if (values?.customAmount) {
              HandleAddWalletAmount(values?.customAmount)
            } else if (selectedAmount != "custom") {
              HandleAddWalletAmount(selectedAmount)
            }
          }
    
          if (!values?.customAmount && selectedAmount === "custom") {
            toast.error("Please select or enter an amount to wallet", {
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
              ? "page-content payment  overlayerloader"
              : "page-content payment"
          }
        >
          <Container fluid>
            <Breadcrumb title="Minible" breadcrumbItem="Withdraw Funds" />
  
            <Row>
              <Col lg="12">
                <Form
                  className="form-horizontal user-management"
                  onSubmit={e => {
                    e.preventDefault()
                    validation.handleSubmit()
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
                                                id="tether"
                                                name="paymentMethod"
                                                className="form-check-input"
                                                // value={method?.value}
                                                // checked={method?.value === selectedMethod}
                                                onChange={() => {}}
                                                onClick={() => {
                                                    // setSelectedMethod(method?.value)
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
                                                // value={method?.value}
                                                // checked={method?.value === selectedMethod}
                                                onChange={() => {}}
                                                onClick={() => {
                                                    // setSelectedMethod(method?.value)
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
                                                // value={method?.value}
                                                // checked={method?.value === selectedMethod}
                                                onChange={() => {}}
                                                onClick={() => {
                                                    // setSelectedMethod(method?.value)
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
                                    <Col>
                                        <div className="form-check form-check-inline mt-20">
                                            <Input
                                                type="radio"
                                                id="banks"
                                                name="paymentMethod"
                                                className="form-check-input"
                                                // value={method?.value}
                                                // checked={method?.value === selectedMethod}
                                                onChange={() => {}}
                                                onClick={() => {
                                                    // setSelectedMethod(method?.value)
                                                }}
                                                // disabled={spinner}
                                            />
                                            <Label
                                                className="form-check-label"
                                                htmlFor="banks"
                                            >
                                                <img src={BankLogo} />
                                                <p className="font-normal">India Local Banks</p>
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
                      height: stripeCardHeight,
                      overflow: "hidden",
                      maxHeight: "450px",
                      transition: "height 0.6s ease 0s",
                      opacity: selectedMethod === "stripe" ? 1 : 0,
                    }}
                  >
                    <Card className="m-10 stripe-form">
                        <CardBody
                        className="credit-card-scroll"
                          style={{
                            backgroundColor: "#fafafb",
                            margin: "20px auto",
                            overflowY: "auto" ,
                            borderRadius: "12px",
                            maxHeight: "400px",
                          }}
                        >
                          {selectedMethod === "stripe" && <CreditCard 
                            paymentMethods={paymentMethods}
                            stripecondition={stripecondition}
                            setstripecondition={setstripecondition}
                            setSpinner={setSpinner}
                            spinner={spinner}
                            selectedMethod={selectedMethod}
                            selectedAmount={selectedAmount}
                            custompay={custompay}
                            setOpenModal={setOpenModal}
                            paymentId={""}
                            setSelectedCard={setSelectedCard}
                            page={"billing"}
                            setLoading={setLoading}
                          />}
                     </CardBody>
                      </Card>
                  </div>
                  <div
                    className="slide"
                    style={{
                    //   height: selectedMethod === "banktransfer" ? "258px" : "0px",
                      overflow: "hidden",
                      transition: "height 0.3s ease",
                    //   opacity: selectedMethod === "banktransfer" ? 1 : 0,
                    }}
                  >
                  </div>
                  <Card className="m-0  ">
                    <CardBody>
                      <div className="inner-content invite-user rd-group">
                        <h6 className="font16  font-semibold">
                          Choose Payment Amount
                        </h6>
                        <div className="radio-btn amount">
                          <Row>
                            <Col>
                              <span>Payment method: Tether</span>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <span>Minimum deposit amount: 50</span>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <span>Address: TDGEKJ5586598970899787S</span>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <div className="btn-group mt-30">
                                <button
                                  className="btn btn-primary w-100 waves-effect btn-save font-normal btnv1"
                                  type="submit"
                                  disabled={spinner}
                                >
                                  {spinner? <div className="ui active inline loader"></div> : "Copy Crypto Address"}
                                </button>
                              </div>
                            </Col>
                          </Row>
                          <h6 className="font16  font-semibold">
                            Import to know
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
                              <div className="form-check form-check-inline mt-20">
                                <Input
                                  type="radio"
                                  id="customRadioInline6"
                                  name="customRadioInline2"
                                  className="form-check-input"
                                  value="100"
                                  checked={selectedAmount === 100}
                                  onClick={() => {
                                    validation.resetForm({ values: "" }),
                                      setSelectedAmount(100)
                                  }}
                                  onChange={() => {}}
                                  disabled={spinner}
                                />
                                <Label
                                  className="form-check-label"
                                  htmlFor="customRadioInline6"
                                >
                                  <p className="font-normal">
                                    {currency?.prefix}$100 USD {currency?.suffix}
                                  </p>
                                </Label>
                              </div>
                            </Col>
                            <Col>
                              <div className="form-check form-check-inline mt-20">
                                <Input
                                  type="radio"
                                  id="customRadioInline7"
                                  name="customRadioInline2"
                                  className="form-check-input"
                                  value="250"
                                  checked={selectedAmount === 250}
                                  onClick={() => {
                                    validation.resetForm({ values: "" }),
                                      setSelectedAmount(250)
                                  }}
                                  onChange={() => {}}
                                  disabled={spinner}
                                />
                                <Label
                                  className="form-check-label"
                                  htmlFor="customRadioInline7"
                                >
                                  <p className="font-normal">
                                    {currency?.prefix}$250 USD{currency?.suffix}{" "}
                                  </p>
                                </Label>
                              </div>
                            </Col>
                            <Col>
                              <div className="form-check form-check-inline mt-20">
                                <Input
                                  type="radio"
                                  id="customRadioInline8"
                                  name="customRadioInline2"
                                  className="form-check-input"
                                  value="500"
                                  checked={selectedAmount === 500}
                                  onClick={() => {
                                    validation.resetForm({ values: "" }),
                                      setSelectedAmount(500)
                                  }}
                                  onChange={() => {}}
                                  disabled={spinner}
                                />
                                <Label
                                  className="form-check-label"
                                  htmlFor="customRadioInline8"
                                >
                                  <p className="font-normal">
                                    {currency?.prefix}$500 USD {currency?.suffix}
                                  </p>
                                </Label>
                              </div>
                            </Col>
                            <Col>
                              <div className="form-check form-check-inline mt-20">
                                <Input
                                  type="radio"
                                  id="customRadioInline9"
                                  name="customRadioInline2"
                                  className="form-check-input"
                                  value="1000"
                                  checked={selectedAmount === 1000}
                                  onClick={() => {
                                    validation.resetForm({ values: "" }),
                                      setSelectedAmount(1000)
                                  }}
                                  onChange={() => {}}
                                  disabled={spinner}
                                />
                                <Label
                                  className="form-check-label"
                                  htmlFor="customRadioInline9"
                                >
                                  <p className="font-normal">
                                    {" "}
                                    {currency?.prefix}$1000 USD {currency?.suffix}{" "}
                                  </p>
                                </Label>
                              </div>
                            </Col>
                            <Col>
                              <div className="test form-check form-check-inline mt-20 ">
                                <span className="prefix">{currency?.prefix}$</span>
                                {/* <div className="inner-input-box"> */}
                                <Input
                                  className="chose-payment"
                                  value={validation.values.customAmount || ""}
                                  placeholder="5000"
                                  max="5000"
                                  min="1"
                                  onChange={e => {
                                    validation.handleChange(e)
                                    setcustompay(e.target.value)
                                  }}
                                  onBlur={(e) => {validation.handleBlur, custompay > 5000? validation.values.customAmount = 5000 :""}}
                                  invalid={
                                    validation.touched.customAmount &&
                                    validation.errors.customAmount
                                      ? true
                                      : false
                                  }
                                  type="number"
                                  name="customAmount"
                                  onClick={() => {
                                    setSelectedAmount("custom")
                                  }}
                                  disabled={spinner}
                                />
                                {/* </div> */}
                                <span className="suffix">
                                  {/* {" "} */}
                                  {currency?.suffix}USD
                                </span>
                                {/* {validation.touched.customAmount &&
                                  validation.errors.customAmount ? (
                                    <>
                                      <FormFeedback type="invalid">
                                        <img
                                          className="form-error-icon"
                                          src={rederror}
                                          alt=""
                                          height={15}
                                        />
                                        {validation.errors.customAmount}
                                      </FormFeedback>
                                    </>
                                  ) : null} */}
                              </div>
                              <span className="billing-max-amt">*Maximum amount: 5000</span>
                            
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
                      disabled={spinner}
                    >
                      {spinner? <div className="ui active inline loader"></div> : "Add Fund"}
                    </button>
                  </div>
                </Form>
              </Col>
            </Row>
          </Container>
          <div
            style={{ display: "none" }}
            dangerouslySetInnerHTML={{ __html: paypalBasicFormData }}
          ></div>
        </div>
        <TextLoader loading={loading} loader={loader}/>
        <PaymentModal openModal={openModal} message={"Payment"}/>
      </React.Fragment>
    )
}

export default withRouter(WithdrawFunds)
